import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [progress, setProgress] = useState({ totalTasks: 0, completedTasks: 0, progressPercentage: 0 });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [statusFilter, setStatusFilter] = useState('all');

    // Task Form State
    const [showModal, setShowModal] = useState(false);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDesc, setTaskDesc] = useState('');
    const [taskDate, setTaskDate] = useState('');

    const fetchData = async () => {
        try {
            let tasksEndpoint = `/tasks/project/${id}?page=${page}&size=6`;
            if (statusFilter !== 'all') {
                tasksEndpoint += `&status=${statusFilter}`;
            }

            const [projRes, tasksRes, progressRes] = await Promise.all([
                api.get(`/projects/${id}`),
                api.get(tasksEndpoint),
                api.get(`/projects/${id}/progress`)
            ]);
            setProject(projRes.data);
            setTasks(tasksRes.data.content);
            setTotalPages(tasksRes.data.totalPages);
            setProgress(progressRes.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to load project details", error);
            if (error.response && error.response.status === 403) {
                navigate('/dashboard');
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [id, page, statusFilter]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/tasks/project/${id}`, {
                title: taskTitle,
                description: taskDesc,
                dueDate: taskDate
            });
            setShowModal(false);
            setTaskTitle('');
            setTaskDesc('');
            setTaskDate('');
            fetchData();
        } catch (error) {
            console.error("Failed to create task", error);
        }
    };

    const handleToggleTask = async (task) => {
        if (task.completed) return;
        try {
            await api.put(`/tasks/${task.id}/complete`);
            fetchData();
        } catch (error) {
            console.error("Failed to update task", error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`/tasks/${taskId}`);
            fetchData();
        } catch (error) {
            console.error("Failed to delete task", error);
        }
    };

    const handleDeleteProject = async () => {
        if (!window.confirm("Delete this project and all tasks?")) return;
        try {
            await api.delete(`/projects/${id}`);
            navigate('/dashboard');
        } catch (error) {
            console.error("Failed to delete project", error);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-400">Loading workspace...</div>;
    if (!project) return <div className="p-8 text-center text-red-400">Project not found</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-4">
                <div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-blue-400 hover:text-blue-300 mb-2 text-sm flex items-center gap-1 transition-colors"
                    >
                        &larr; Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">{project.title}</h1>
                    <p className="text-slate-300 max-w-2xl">{project.description}</p>
                </div>
                <button
                    onClick={handleDeleteProject}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-4 py-2 rounded-xl transition border border-transparent hover:border-red-500/30"
                >
                    Delete Project
                </button>
            </div>

            {/* Progress Section */}
            <div className="glass-card mb-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="flex justify-between mb-4 relative z-10">
                    <div>
                        <span className="text-slate-300 font-medium block">Progress Overview</span>
                        <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            {Math.round(progress.progressPercentage)}%
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="block text-white font-bold text-xl">{progress.completedTasks}/{progress.totalTasks}</span>
                        <span className="text-slate-500 text-sm">Tasks Completed</span>
                    </div>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-3 backdrop-blur-sm">
                    <div
                        className="h-3 rounded-full transition-all duration-1000 ease-out relative"
                        style={{
                            width: `${progress.progressPercentage}%`,
                            background: 'linear-gradient(90deg, #3b82f6 0%, #a855f7 100%)',
                            boxShadow: '0 0 10px rgba(168, 85, 247, 0.4)'
                        }}
                    ></div>
                </div>
            </div>

            {/* Tasks Section */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Tasks</h2>
                <div className="flex gap-4">
                    <select
                        className="input-field w-40 py-2"
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(0); // Reset to first page when filter changes
                        }}
                    >
                        <option value="all">All Tasks</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                    </select>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary text-sm px-5 py-2.5"
                    >
                        + Add Task
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                {tasks.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-2xl">
                        <p className="text-slate-500">No tasks yet. Add one to get started.</p>
                    </div>
                ) : (
                    tasks.map(task => (
                        <div key={task.id} className={`glass-card p-5 flex items-center justify-between group border-l-4 ${task.completed ? 'border-l-green-500 bg-slate-800/80' : 'border-l-blue-500'}`}>
                            <div className={`flex-1 ${task.completed ? 'opacity-50' : ''}`}>
                                <h3 className={`font-semibold text-lg ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                                    {task.title}
                                </h3>
                                {task.description && <p className="text-slate-400 text-sm mt-1">{task.description}</p>}
                                {task.dueDate && (
                                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                                        <span className="bg-slate-700/50 px-2 py-0.5 rounded">Due: {task.dueDate}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                {!task.completed && (
                                    <button
                                        onClick={() => handleToggleTask(task)}
                                        className="w-10 h-10 rounded-full bg-slate-700/50 hover:bg-green-500/20 text-slate-400 hover:text-green-400 flex items-center justify-center transition-all"
                                        title="Mark Complete"
                                    >
                                        ✓
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="w-10 h-10 rounded-full bg-slate-700/50 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                    title="Delete"
                                >
                                    🗑
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-8">
                <button
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 rounded-lg bg-slate-700/50 text-white hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    &larr; Previous
                </button>
                <span className="text-slate-800 font-medium">
                    Page {page + 1} of {totalPages === 0 ? 1 : totalPages}
                </span>
                <button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 rounded-lg bg-slate-700/50 text-white hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Next &rarr;
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="glass-card w-full max-w-md animate-float" style={{ animationDuration: '0s' }}>
                        <h2 className="text-2xl font-bold mb-6 text-white">New Task</h2>
                        <form onSubmit={handleCreateTask} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                                <input
                                    className="input-field"
                                    type="text"
                                    placeholder="Task Title"
                                    value={taskTitle}
                                    onChange={(e) => setTaskTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                                <textarea
                                    className="input-field h-24 resize-none"
                                    placeholder="Details..."
                                    value={taskDesc}
                                    onChange={(e) => setTaskDesc(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Due Date</label>
                                <input
                                    className="input-field" // Note: Date inputs need dark mode styling override for calendar usually, but simple styling for now
                                    type="date"
                                    value={taskDate}
                                    onChange={(e) => setTaskDate(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    Add Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetails;

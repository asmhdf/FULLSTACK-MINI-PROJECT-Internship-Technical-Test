import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newProjectTitle, setNewProjectTitle] = useState('');
    const [newProjectDesc, setNewProjectDesc] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();

    const fetchProjects = async () => {
        try {
            const endpoint = searchQuery
                ? `/projects?search=${searchQuery}&page=${page}&size=6`
                : `/projects?page=${page}&size=6`;
            const res = await api.get(endpoint);
            setProjects(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error("Failed to load projects", error);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [searchQuery, page]);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            await api.post('/projects', { title: newProjectTitle, description: newProjectDesc });
            setShowModal(false);
            setNewProjectTitle('');
            setNewProjectDesc('');
            fetchProjects();
        } catch (error) {
            console.error("Failed to create project", error);
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        My Projects
                    </h1>
                    <p className="text-slate-400 mt-2">Manage your workflow seamlessly</p>
                </div>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="input-field w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <span className="text-xl">+</span> New Project
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => {
                    // Calculate status based on tasks
                    const totalTasks = project.tasks?.length || 0;
                    const completedTasks = project.tasks?.filter(t => t.completed).length || 0;
                    const isCompleted = totalTasks > 0 && totalTasks === completedTasks;

                    return (
                        <div
                            key={project.id}
                            onClick={() => navigate(`/projects/${project.id}`)}
                            className="glass-card cursor-pointer group hover:bg-slate-800/50"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                                    {project.title}
                                </h2>
                                <span className={`text-xs px-2 py-1 rounded-full ${isCompleted
                                        ? 'bg-green-500/20 text-green-300'
                                        : 'bg-blue-500/20 text-blue-300'
                                    }`}>
                                    {isCompleted ? 'Completed' : 'Active'}
                                </span>
                            </div>
                            <p className="text-slate-400 text-sm line-clamp-2">
                                {project.description || "No description provided."}
                            </p>
                            <div className="mt-4 flex items-center text-sm text-slate-500">
                                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300 text-blue-400">
                                    View Details &rarr;
                                </span>
                            </div>
                        </div>
                    );
                })}

                {/* Empty State */}
                {projects.length === 0 && (
                    <div className="col-span-full py-16 text-center glass rounded-2xl border-dashed border-2 border-slate-700">
                        <p className="text-slate-400 mb-4">No projects found. Start by creating one!</p>
                        <button onClick={() => setShowModal(true)} className="text-blue-400 hover:text-blue-300">
                            Create a Project &rarr;
                        </button>
                    </div>
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

            {/* Create Project Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="glass-card w-full max-w-lg relative animate-float" style={{ animationDuration: '0s' }}>
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl font-bold mb-6 text-white">Create New Project</h2>
                        <form onSubmit={handleCreateProject} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Project Title</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g. Website Redesign"
                                    value={newProjectTitle}
                                    onChange={(e) => setNewProjectTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                                <textarea
                                    className="input-field h-32 resize-none"
                                    placeholder="Brief description of your project..."
                                    value={newProjectDesc}
                                    onChange={(e) => setNewProjectDesc(e.target.value)}
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
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

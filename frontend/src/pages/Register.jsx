import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        try {
            const success = await register(email, password);
            if (success) {
                navigate('/login');
            } else {
                setError('Registration failed. Try again.');
            }
        } catch (err) {
            setError('Registration failed. Try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-10 right-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '3s' }}></div>

            <div className="glass-card w-full max-w-md z-50 p-8 m-4 relative">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">Create Account</h1>
                    <p className="text-slate-400">Join the workspace of the future</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-center text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary w-full">
                        Get Started
                    </button>
                </form>

                <div className="mt-8 text-center text-slate-400 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;

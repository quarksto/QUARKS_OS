import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * LoginPage - Stitch MCP Generated (Adapted)
 * 
 * Features:
 * - Design System v1.3 compliant
 * - Petroleum #0F4C5C + Solar #F59E0B
 * - Light theme, no gradients
 * - Material Symbols Outlined icons
 * - Centered card layout
 * - Password visibility toggle
 * - Remember me checkbox
 * - Responsive design
 */
export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);
        if (result.success) {
            window.location.href = '/dashboard';
        } else {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#F1F5F9] font-sans">
            {/* Background Pattern */}
            <div
                className="fixed inset-0 -z-10 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: 'radial-gradient(#0f4c5c 0.5px, transparent 0.5px)',
                    backgroundSize: '24px 24px'
                }}
            />

            <div className="w-full max-w-md">
                {/* Branding / Logo Area */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-3 text-petroleum mb-2">
                        {/* Logo SVG */}
                        <div className="w-8 h-8">
                            <svg
                                className="w-full h-full text-petroleum"
                                fill="none"
                                viewBox="0 0 48 48"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M6 6H42L36 24L42 42H6L12 24L6 6Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-petroleum">
                            Quarks OS
                        </h1>
                    </div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                        Gestão Solar Inteligente
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8">
                        {/* Headline Section */}
                        <div className="text-center mb-8">
                            <h2 className="text-slate-900 text-2xl font-bold leading-tight">
                                Bem-vindo de volta
                            </h2>
                            <p className="text-slate-500 text-sm mt-2">
                                Acesse sua conta para gerenciar seus ativos solares.
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                                <span className="material-symbols-outlined text-[18px]">error</span>
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {/* Email Field */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-slate-700 text-sm font-semibold">
                                    Email
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                                        mail
                                    </span>
                                    <input
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-petroleum/20 focus:border-petroleum transition-all placeholder:text-slate-400"
                                        placeholder="seu@email.com"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-slate-700 text-sm font-semibold">
                                    Senha
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                                        lock
                                    </span>
                                    <input
                                        className="w-full pl-10 pr-10 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-petroleum/20 focus:border-petroleum transition-all placeholder:text-slate-400"
                                        placeholder="••••••••"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="material-symbols-outlined text-lg">
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Utility Row */}
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        className="rounded border-slate-300 text-petroleum focus:ring-petroleum h-4 w-4"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <span className="text-slate-600 group-hover:text-slate-900 transition-colors">
                                        Lembrar-me
                                    </span>
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-petroleum font-semibold hover:underline"
                                >
                                    Esqueceu a senha?
                                </Link>
                            </div>

                            {/* CTA Button */}
                            <button
                                className="w-full bg-solar-500 hover:bg-solar-600 text-white font-bold py-3.5 rounded-lg shadow-md transition-all transform active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    'Entrar'
                                )}
                            </button>
                        </form>

                        {/* Footer / Divider Section */}
                        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                            <p className="text-slate-500 text-sm">
                                Ainda não tem conta?{' '}
                                <Link
                                    to="/register"
                                    className="text-petroleum font-bold hover:underline ml-1"
                                >
                                    Solicitar acesso
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Optional Info/Legal Links */}
                <div className="mt-8 flex justify-center gap-6 text-xs text-slate-400 font-medium">
                    <a className="hover:text-petroleum transition-colors" href="#">
                        Termos de Uso
                    </a>
                    <a className="hover:text-petroleum transition-colors" href="#">
                        Privacidade
                    </a>
                    <a className="hover:text-petroleum transition-colors" href="#">
                        Suporte Técnico
                    </a>
                </div>

                {/* Footer Decorative Element */}
                <div className="mt-12 flex justify-center">
                    <div className="w-32 h-1 bg-gradient-to-r from-transparent via-petroleum/30 to-transparent rounded-full" />
                </div>
            </div>
        </div>
    );
}

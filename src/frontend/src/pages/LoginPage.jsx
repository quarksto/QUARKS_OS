import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * LoginPage v4 - Enterprise SaaS Layout (PT-BR)
 * 
 * Features:
 * - Split Views (Petroleum Abstract / Clean Form)
 * - Modern Auth (Google / SSO placeholders)
 * - Floating/Outline Inputs
 * - Copyright Footer
 */
export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
        <div className="min-h-screen w-full flex flex-row overflow-hidden font-sans bg-white">

            {/* LEFT PANEL - Branding (Hidden on mobile) */}
            <div className="hidden lg:flex w-[45%] bg-petroleum flex-col justify-between p-12 relative overflow-hidden text-white">
                {/* Abstract Data Viz Art */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
                        <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        <circle cx="200" cy="200" r="100" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        <circle cx="200" cy="200" r="50" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        <path d="M0,200 H400 M200,0 V400" stroke="currentColor" strokeWidth="0.5" />
                        <rect x="150" y="150" width="100" height="100" stroke="#F59E0B" strokeWidth="1" fill="none" transform="rotate(45 200 200)" />
                    </svg>
                </div>

                {/* Header */}
                <div className="z-10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                        <span className="material-symbols-outlined text-solar text-lg">bolt</span>
                    </div>
                    <span className="font-bold text-lg tracking-tight font-display">Quarks OS</span>
                </div>

                {/* Hero */}
                <div className="z-10 relative max-w-lg">
                    <h1 className="text-4xl font-bold leading-tight mb-6 tracking-tight font-display">
                        Empowering <br />
                        <span className="text-solar">Solar Intelligence</span>
                    </h1>
                    <p className="text-slate-300 text-lg font-light leading-relaxed">
                        A plataforma definitiva para integradores de energia solar. Inteligência, Leads e Gestão em um só lugar.
                    </p>
                </div>

                {/* Badge */}
                <div className="z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        <span className="text-xs font-medium text-slate-300">Sistemas Operacionais</span>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL - Login Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 bg-white relative">
                {/* Mobile Brand */}
                <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-petroleum flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-solar text-lg">bolt</span>
                    </div>
                </div>

                <div className="w-full max-w-[440px] animate-slideDown">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2 font-display">Entrar no Quarks</h2>
                        <p className="text-slate-500 text-sm">Bem-vindo de volta.</p>
                    </div>

                    {/* Social / SSO Buttons */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button type="button" className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-700 text-sm font-medium focus:ring-0 focus:border-petroleum/60 outline-none">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                            Google
                        </button>
                        <button type="button" className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-700 text-sm font-medium focus:ring-0 focus:border-petroleum/60 outline-none">
                            <span className="material-symbols-outlined text-[18px] text-slate-500">fingerprint</span>
                            SSO
                        </button>
                    </div>

                    <div className="relative flex py-2 items-center mb-8">
                        <div className="flex-grow border-t border-slate-100"></div>
                        <span className="flex-shrink-0 mx-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ou use email</span>
                        <div className="flex-grow border-t border-slate-100"></div>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-700 text-sm animate-shake">
                            <span className="material-symbols-outlined text-[18px]">error</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-[13px] font-medium text-slate-700">Email corporativo</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">mail</span>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-3 py-3 rounded-lg border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:border-petroleum/60 focus:ring-0 outline-none transition-all shadow-none"
                                    placeholder="nome@empresa.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="block text-[13px] font-medium text-slate-700">Senha</label>
                                <Link to="/forgot-password" className="text-[12px] font-medium text-petroleum hover:underline">Esqueceu?</Link>
                            </div>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">lock</span>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-3 py-3 rounded-lg border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:border-petroleum/60 focus:ring-0 outline-none transition-all shadow-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-solar hover:bg-amber-600 text-white font-bold py-3 rounded-lg shadow-sm hover:shadow-sm active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <span>Entrar</span>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Novo no Quarks?{' '}
                        <Link to="/register" className="font-semibold text-petroleum hover:underline">
                            Criar conta
                        </Link>
                    </p>
                </div>

                <div className="absolute bottom-6 w-full text-center">
                    <p className="text-[10px] text-slate-400 font-medium">
                        © 2026 Quarks OS • v1.3 Enterprise
                    </p>
                </div>
            </div>
        </div>
    );
}

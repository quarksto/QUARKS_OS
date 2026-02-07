import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * LoginPage - Quarks OS Design System v1.3
 * 
 * Features:
 * - Split Layout (45/55 - Petroleum / White)
 * - Clean minimal design
 * - No gradients, no decorative elements
 * - Outline badges only
 * - Petroleum + Solar colors
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
            window.location.href = '/';
        } else {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-row overflow-hidden font-sans bg-white">

            {/* LEFT PANEL - Branding (Hidden on mobile) */}
            <div className="hidden lg:flex w-[45%] bg-petroleum flex-col justify-between p-12 relative overflow-hidden text-white">
                {/* Simple geometric pattern - NO BLUR */}
                <div className="absolute inset-0 opacity-5">
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
                    <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center border border-white/20">
                        <span className="material-symbols-outlined text-solar text-lg">bolt</span>
                    </div>
                    <span className="font-bold text-lg tracking-tight">Quarks OS</span>
                </div>

                {/* Hero */}
                <div className="z-10 relative max-w-lg">
                    <h1 className="text-4xl font-bold leading-tight mb-6 tracking-tight">
                        Empowering <br />
                        <span className="text-solar">Solar Intelligence</span>
                    </h1>
                    <p className="text-slate-300 text-lg font-light leading-relaxed">
                        A plataforma definitiva para integradores de energia solar. Inteligência, Leads e Gestão em um só lugar.
                    </p>
                </div>

                {/* Status Badge - OUTLINE ONLY */}
                <div className="z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/20 bg-transparent">
                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
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

                <div className="w-full max-w-[440px]">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Entrar no Quarks</h2>
                        <p className="text-slate-500 text-sm">Bem-vindo de volta.</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-3 rounded-lg border border-red-200 bg-white animate-shake flex items-center justify-between gap-3 shadow-sm">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-red-500 text-[20px]">error</span>
                                <p className="text-[13px] font-medium text-red-800">{error}</p>
                            </div>
                            <button
                                onClick={() => setError('')}
                                className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        </div>
                    )}

                    {/* Social / SSO Buttons */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-700 text-sm font-medium focus:ring-0 focus:border-petroleum/60 outline-none"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-700 text-sm font-medium focus:ring-0 focus:border-petroleum/60 outline-none"
                        >
                            <span className="material-symbols-outlined text-xl text-[#00A4EF]">business</span>
                            Microsoft
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-slate-500 font-medium">ou continue com e-mail</span>
                        </div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400 text-xl">mail</span>
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 focus:border-petroleum/60 sm:text-sm transition-all [box-shadow:0_0_0_30px_white_inset_!important] [-webkit-text-fill-color:theme('colors.slate.900')_!important]"
                                    placeholder="seu@email.com"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                Senha
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400 text-xl">lock</span>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 focus:border-petroleum/60 sm:text-sm transition-all [box-shadow:0_0_0_30px_white_inset_!important] [-webkit-text-fill-color:theme('colors.slate.900')_!important]"
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                                >
                                    <span className="material-symbols-outlined text-xl">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Remember Me + Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-petroleum focus:ring-petroleum border-slate-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                                    Lembrar-me
                                </label>
                            </div>
                            <div className="text-sm">
                                <Link to="/forgot-password" className="font-medium text-petroleum hover:text-petroleum/80">
                                    Esqueceu a senha?
                                </Link>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-solar hover:bg-solar/90 focus:outline-none focus:border-solar disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Entrando...
                                </>
                            ) : (
                                <>
                                    Entrar
                                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                </>
                            )}
                        </button>

                        {/* Register Link */}
                        <div className="text-center">
                            <p className="text-sm text-slate-600">
                                Não tem uma conta?{' '}
                                <Link to="/register" className="font-medium text-petroleum hover:text-petroleum/80">
                                    Criar conta
                                </Link>
                            </p>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-slate-200">
                        <p className="text-center text-xs text-slate-500">
                            © 2026 Quarks OS. Todos os direitos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

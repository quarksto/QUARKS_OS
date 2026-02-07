import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * RegisterPage - Quarks OS Design System v1.3
 * 
 * Features:
 * - Split Layout (45/55 - Petroleum / White)
 * - Clean minimal design
 * - No gradients, no blurs
 * - Outline style for everything
 * - Petroleum + Solar colors
 */
export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return setError('As senhas não coincidem');
        }

        setError('');
        setLoading(true);

        const result = await register(formData.name, formData.email, formData.password);
        if (result.success) {
            navigate('/login');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen w-full flex flex-row overflow-hidden font-sans bg-white">

            {/* LEFT PANEL */}
            <div className="hidden lg:flex w-[45%] bg-petroleum flex-col justify-between p-12 relative overflow-hidden text-white">
                {/* Geometric Pattern - NO BLUR */}
                <div className="absolute inset-0 opacity-5">
                    <svg className="w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
                        <path d="M0,400 L400,0" stroke="currentColor" strokeWidth="0.5" />
                        <rect x="50" y="50" width="300" height="300" rx="150" stroke="currentColor" strokeWidth="0.5" fill="none" />
                        <circle cx="200" cy="200" r="80" stroke="#F59E0B" strokeWidth="1" fill="none" />
                        <path d="M200,0 V400 M0,200 H400" stroke="currentColor" strokeWidth="0.2" />
                    </svg>
                </div>

                <div className="z-10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center border border-white/20">
                        <span className="material-symbols-outlined text-solar text-lg">bolt</span>
                    </div>
                    <span className="font-bold text-lg tracking-tight">Quarks OS</span>
                </div>

                <div className="z-10 relative max-w-lg">
                    <h1 className="text-4xl font-bold leading-tight mb-6 tracking-tight">
                        Join the <br />
                        <span className="text-solar">Solar Revolution</span>
                    </h1>
                    <p className="text-slate-300 text-lg font-light leading-relaxed">
                        Faça parte da plataforma que está transformando o mercado de energia solar. Inteligência e gestão em escala.
                    </p>
                </div>

                <div className="z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/20 bg-transparent">
                        <span className="material-symbols-outlined text-xs text-solar">groups</span>
                        <span className="text-xs font-medium text-slate-300">Comunidade de Integradores</span>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL - FORM */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 bg-white relative">
                {/* Mobile Brand */}
                <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-petroleum flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-solar text-lg">bolt</span>
                    </div>
                </div>

                <div className="w-full max-w-[440px]">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Criar nova conta</h2>
                        <p className="text-slate-500 text-sm">Comece sua jornada no Quarks OS.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-lg border border-red-200 bg-white shadow-sm flex items-start gap-3">
                            <span className="material-symbols-outlined text-red-600 text-xl">error</span>
                            <p className="text-sm font-medium text-red-800">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">Nome Completo</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person</span>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:border-petroleum/60 focus:ring-0 outline-none transition-all"
                                    placeholder="Seu nome"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">Email corporativo</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:border-petroleum/60 focus:ring-0 outline-none transition-all"
                                    placeholder="nome@empresa.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Senha</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:border-petroleum/60 focus:ring-0 outline-none transition-all"
                                        placeholder="Min. 8 chars"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Confirmar</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:border-petroleum/60 focus:ring-0 outline-none transition-all"
                                        placeholder="Repetir senha"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-solar hover:bg-solar/90 text-white font-bold py-3 rounded-lg shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-4 outline-none focus:border-solar"
                        >
                            {loading ? (
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <span>Criar Conta</span>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Já tem acesso?{' '}
                        <Link to="/login" className="font-semibold text-petroleum hover:underline">
                            Fazer login
                        </Link>
                    </p>

                    {/* Footer - Integrated like Login */}
                    <div className="mt-8 pt-6 border-t border-slate-200">
                        <p className="text-center text-xs text-slate-500">
                            © 2026 Quarks OS • Enterprise Edition
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * RegisterPage - Quarks OS Design System v1.4
 * 
 * Features:
 * - Split Layout (45/55 - Petroleum / White)
 * - Clean minimal design
 * - Super Flat (No shadows)
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
            <div className="hidden lg:flex w-[45%] bg-petroleum flex-col justify-between p-12 relative overflow-hidden text-white shadow-none">
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
                        <span className="material-symbols-outlined text-solar text-lg ds-icon-w300">bolt</span>
                    </div>
                    <span className="ds-title-section text-white uppercase tracking-wider">Quarks OS</span>
                </div>

                <div className="z-10 relative max-w-lg">
                    <h1 className="ds-display-xl text-white mb-6">
                        Join the <br />
                        <span className="text-solar">Solar Revolution</span>
                    </h1>
                    <p className="text-slate-300 ds-body leading-relaxed max-w-sm">
                        Faça parte da plataforma que está transformando o mercado de energia solar. Inteligência e gestão em escala.
                    </p>
                </div>

                <div className="z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5">
                        <span className="material-symbols-outlined text-xs text-solar ds-icon-w300">groups</span>
                        <span className="ds-meta !text-slate-300 uppercase tracking-widest font-bold">Comunidade de Integradores</span>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL - FORM */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 bg-white relative">
                {/* Mobile Brand */}
                <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-petroleum flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-solar text-lg ds-icon-w300">bolt</span>
                    </div>
                </div>

                <div className="w-full max-w-[400px]">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="ds-display-l text-slate-900 mb-2">Criar nova conta</h2>
                        <p className="ds-body !text-slate-500">Comece sua jornada no Quarks OS.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 flex items-start gap-3">
                            <span className="material-symbols-outlined text-red-600 text-xl ds-icon-w300">error</span>
                            <p className="ds-label normal-case font-bold text-red-800">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="ds-label mb-1.5">Nome Completo</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg ds-icon-w300">person</span>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="ds-input pl-10 h-10"
                                    placeholder="Seu nome"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="ds-label mb-1.5">Email corporativo</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg ds-icon-w300">mail</span>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="ds-input pl-10 h-10"
                                    placeholder="nome@empresa.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="ds-label mb-1.5">Senha</label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="ds-input h-10"
                                    placeholder="Min. 8 chars"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="ds-label mb-1.5">Confirmar</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="ds-input h-10"
                                    placeholder="Repetir senha"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-solar hover:bg-amber-600 text-petroleum font-bold h-12 rounded-full shadow-none transition-all flex items-center justify-center mt-6 active:scale-[0.98]"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-petroleum/20 border-t-petroleum rounded-full animate-spin" />
                            ) : (
                                <span className="text-[17px]">CRIAR MINHA CONTA</span>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center ds-body !text-slate-500">
                        Já tem acesso?{' '}
                        <Link to="/login" className="font-bold text-petroleum hover:underline">
                            Fazer login
                        </Link>
                    </p>

                    <div className="mt-12 pt-6 border-t border-slate-100">
                        <p className="text-center ds-meta !text-slate-300 opacity-60">
                            QUARKS OS • ENTERPRISE EDITION 2026
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

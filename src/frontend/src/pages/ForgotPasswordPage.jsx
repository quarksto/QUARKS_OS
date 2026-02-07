import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

/**
 * ForgotPasswordPage - Quarks OS Design System v1.3
 * 
 * Features:
 * - Split Layout (45/55 - Petroleum / White)
 * - Clean minimal design
 * - No gradients, no blurs
 * - Outline style for everything
 * - Petroleum + Solar colors
 */
export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        // Simulação de envio - Backend integration pending
        setTimeout(() => {
            setStatus('success');
            setMessage(`Um link de recuperação foi enviado para ${email}. Verifique sua caixa de entrada.`);
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full flex flex-row overflow-hidden font-sans bg-white">

            {/* LEFT PANEL */}
            <div className="hidden lg:flex w-[45%] bg-petroleum flex-col justify-between p-12 relative overflow-hidden text-white">
                {/* Geometric Pattern - NO BLUR */}
                <div className="absolute inset-0 opacity-5">
                    <svg className="w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
                        <circle cx="200" cy="200" r="120" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="4 4" />
                        <rect x="180" y="160" width="40" height="60" rx="4" stroke="#F59E0B" strokeWidth="1" fill="none" />
                        <path d="M190,160 V145 A10,10 0 0,1 210,145 V160" stroke="#F59E0B" strokeWidth="1" fill="none" />
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
                        Secure <br />
                        <span className="text-solar">Account Recovery</span>
                    </h1>
                    <p className="text-slate-300 text-lg font-light leading-relaxed">
                        Processo simplificado e seguro para você retomar o acesso à sua plataforma de gestão.
                    </p>
                </div>

                <div className="z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/20 bg-transparent">
                        <span className="material-symbols-outlined text-xs text-solar">lock_reset</span>
                        <span className="text-xs font-medium text-slate-300">Protocolo Seguro</span>
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

                    {status === 'success' ? (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-white border border-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Verifique seu email</h2>
                            <p className="text-slate-500 mb-8">{message}</p>
                            <Link to="/login" className="inline-flex items-center justify-center px-6 py-3 bg-petroleum text-white font-bold rounded-lg hover:bg-petroleum-800 transition-all shadow-sm w-full">
                                Voltar para Login
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="mb-10 text-center lg:text-left">
                                <Link to="/login" className="inline-flex items-center gap-1 text-slate-400 hover:text-petroleum text-xs font-bold mb-4 uppercase tracking-wider transition-colors">
                                    <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                                    Voltar
                                </Link>
                                <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Recuperar Senha</h2>
                                <p className="text-slate-500 text-sm">Digite seu email corporativo para receber as instruções.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">Email cadastrado</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:border-petroleum/60 focus:ring-0 outline-none transition-all"
                                            placeholder="nome@empresa.com"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full bg-solar hover:bg-solar/90 text-white font-bold py-3 rounded-lg shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-4 outline-none focus:border-solar"
                                >
                                    {status === 'loading' ? (
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <span>Enviar Instruções</span>
                                    )}
                                </button>
                            </form>
                        </>
                    )}

                    {/* Footer */}
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

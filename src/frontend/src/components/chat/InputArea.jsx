import React, { useState, useRef, useEffect } from 'react';
import { MdGridView, MdDescription, MdClose, MdAddCircle, MdMic, MdArrowUpward, MdTextFormat } from 'react-icons/md';
import MentionInput from '../shared/MentionInput';
import TemplateSelector from '../shared/TemplateSelector';



const InputArea = ({ onSend, disabled, activeContext }) => {
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [showTemplates, setShowTemplates] = useState(false);
    const fileInputRef = useRef(null);


    const handleSubmit = (e) => {
        e.preventDefault();
        if ((!text.trim() && !file) || disabled) return;

        onSend(text, file);
        setText('');
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-3xl mx-auto">
            {/* Context Pill (Comet Style) */}
            {activeContext && (
                <div className="flex justify-center -mb-1 animate-fadeIn">
                    <div className="inline-flex h-6 items-center gap-1.5 rounded-full bg-slate-100 px-3 py-0.5 border border-slate-200 cursor-default select-none shadow-sm">
                        <MdGridView size={14} className="text-slate-500" />
                        <span className="text-slate-500 text-[10px] font-medium uppercase tracking-wide">Context: {activeContext.type}</span>
                    </div>
                </div>
            )}

            {/* File Preview */}
            {file && (
                <div className="flex items-center gap-3 mx-4 p-2 bg-slate-50 border border-slate-200 rounded-xl relative group w-fit">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                        <MdDescription size={16} />
                    </div>
                    <span className="text-xs text-slate-600 font-medium truncate max-w-[150px]">{file.name}</span>
                    <button
                        type="button"
                        onClick={() => { setFile(null); fileInputRef.current.value = ''; }}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <MdClose size={12} />
                    </button>
                </div>
            )}

            {/* Floating Composer Bar */}
            <div className={`
                relative flex w-full items-center gap-2 rounded-3xl border bg-white p-2 shadow-sm transition-all duration-200
                ${disabled ? 'opacity-70 bg-slate-50 cursor-not-allowed' : 'hover:shadow-md focus-within:border-petroleum focus-within:ring-1 focus-within:ring-petroleum/20 focus-within:shadow-md'}
                border-slate-200
            `}>
                {/* Upload Button */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-10 h-10 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    title="Adicionar Arquivo"
                    disabled={disabled}
                >
                    <MdAddCircle size={20} />
                </button>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    accept="image/*,application/pdf,video/*,audio/*"
                />

                {/* Text Input with Mentions */}
                <MentionInput
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Pergunte qualquer coisa..."
                    disabled={disabled}
                />

                {/* Right Actions */}
                <div className="flex items-center gap-1">
                    {/* Voice Mode (Placeholder) */}
                    {!text && !file && (
                        <button
                            type="button"
                            className="flex w-10 h-10 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            title="Modo de Voz"
                        >
                            <MdMic size={20} />
                        </button>
                    )}

                    {/* Template Button */}
                    <button
                        type="button"
                        onClick={() => setShowTemplates(!showTemplates)}
                        className={`flex w-10 h-10 shrink-0 items-center justify-center rounded-full transition-colors ${showTemplates ? 'bg-petroleum/10 text-petroleum' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                        title="Templates de Mensagem"
                        disabled={disabled}
                    >
                        <MdTextFormat size={20} />
                    </button>

                    {showTemplates && (
                        <TemplateSelector
                            onSelect={(template) => {
                                setText(prev => prev + template.content);
                                setShowTemplates(false);
                            }}
                            onClose={() => setShowTemplates(false)}
                        />
                    )}

                    {/* Send Button */}

                    {(text || file) && (
                        <button
                            type="submit"
                            disabled={disabled}
                            className="flex w-10 h-10 shrink-0 items-center justify-center rounded-full bg-petroleum text-white shadow-md hover:bg-petroleum-600 disabled:bg-slate-300 transition-all duration-300 animate-scaleIn"
                        >
                            <MdArrowUpward size={18} />
                        </button>
                    )}
                </div>
            </div>

            <p className="text-center ds-meta text-slate-400">
                Solar Copilot pode cometer erros. Verifique informações importantes.
            </p>
        </form>
    );
};

export default InputArea;


import React, { useState, useEffect } from 'react';
import api from '../../services/api';

/**
 * LeadDocumentsTab — DS v1.4 (dsoficial).
 * Upload, listagem e download de documentos do lead via /api/documents.
 */
export const LeadDocumentsTab = ({ leadId }) => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (leadId) {
            loadFiles();
        }
    }, [leadId]);

    const loadFiles = async () => {
        try {
            const res = await api.get(`/documents/lead/${leadId}`);
            setFiles(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error('Error loading files:', error);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('leadId', leadId);

        setUploading(true);
        try {
            await api.post('/documents/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            await loadFiles();
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = async (doc) => {
        try {
            const res = await api.get(`/documents/download/${doc.id}`, { responseType: 'blob' });
            const url = URL.createObjectURL(res.data);
            const a = document.createElement('a');
            a.href = url;
            a.download = doc.name || 'documento';
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!id) return;
        try {
            await api.delete(`/documents/${id}`);
            setFiles(prev => prev.filter(f => f.id !== id));
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <h3 className="ds-title-section text-slate-700 flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400 text-[20px] ds-icon-w300">description</span>
                        Documentos do Imóvel
                    </h3>
                    <p className="ds-label text-slate-400">Anexos, faturas e arquivos técnicos</p>
                </div>
                <div>
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                    <label
                        htmlFor="file-upload"
                        className={`h-8 cursor-pointer px-4 bg-solar hover:bg-amber-600 text-white text-[11px] font-bold uppercase tracking-widest rounded-full transition-colors flex items-center justify-center gap-2 active:scale-95 shadow-none ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <span className="material-symbols-outlined text-[18px] ds-icon-w300">
                            {uploading ? 'sync' : 'cloud_upload'}
                        </span>
                        {uploading ? 'Enviando...' : 'Upload de Arquivo'}
                    </label>
                </div>
            </div>

            {files.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-100 rounded-lg bg-slate-50/50 p-12">
                    <span className="material-symbols-outlined text-4xl text-slate-300 ds-icon-w300 mb-3">cloud_off</span>
                    <p className="text-[13px] text-slate-500">Nenhum documento anexado ainda.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {files.map(file => (
                        <div
                            key={file.id}
                            className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-petroleum transition-colors">
                                    <span className="material-symbols-outlined text-[24px] ds-icon-w300">description</span>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[13px] font-semibold text-slate-800 truncate max-w-[180px]" title={file.name}>
                                        {file.name}
                                    </p>
                                    <p className="ds-label text-slate-400">
                                        {new Date(file.createdAt).toLocaleDateString('pt-BR')} • {file.size ? (file.size / 1024).toFixed(1) + ' KB' : 'Size N/A'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleDownload(file)}
                                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-petroleum hover:bg-slate-50 rounded-full transition-colors"
                                    title="Baixar"
                                >
                                    <span className="material-symbols-outlined text-[18px] ds-icon-w300">download</span>
                                </button>
                                <button
                                    onClick={() => handleDelete(file.id)}
                                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors border border-transparent hover:border-red-200"
                                    title="Excluir"
                                >
                                    <span className="material-symbols-outlined text-[18px] ds-icon-w300">close</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


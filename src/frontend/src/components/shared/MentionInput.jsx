import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';

const MentionInput = ({ value, onChange, onKeyDown, placeholder, disabled }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [mentionQuery, setMentionQuery] = useState('');
    const [cursorPos, setCursorPos] = useState(0);
    const [users, setUsers] = useState([]);
    const inputRef = useRef(null);

    useEffect(() => {
        // Fetch users for mentions
        const fetchUsers = async () => {
            try {
                const res = await api.get('/users');
                setUsers(res.data);
            } catch (err) {
                console.error('Failed to fetch users for mentions:', err);
            }
        };
        fetchUsers();
    }, []);

    const handleInputChange = (e) => {
        const val = e.target.value;
        const pos = e.target.selectionStart;
        setCursorPos(pos);
        onChange(e);

        // Detect @ mention
        const textBeforeCursor = val.slice(0, pos);
        const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

        if (mentionMatch) {
            setMentionQuery(mentionMatch[1]);
            setShowSuggestions(true);
            const filtered = users.filter(u =>
                u.name.toLowerCase().includes(mentionMatch[1].toLowerCase()) ||
                u.email.toLowerCase().includes(mentionMatch[1].toLowerCase())
            );
            setSuggestions(filtered);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSelectSuggestion = (user) => {
        const val = value;
        const textBeforeMention = val.slice(0, cursorPos - mentionQuery.length - 1);
        const textAfterMention = val.slice(cursorPos);
        const newValue = `${textBeforeMention}@${user.name} ${textAfterMention}`;

        // Simular evento de mudança
        const event = { target: { value: newValue } };
        onChange(event);
        setShowSuggestions(false);
        inputRef.current.focus();
    };

    return (
        <div className="relative flex-1 flex flex-col">
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={handleInputChange}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete="off"
                className="flex-1 bg-transparent border-none outline-none focus:outline-none p-0 text-slate-800 placeholder:text-slate-400 focus:ring-0 text-[15px] font-normal leading-normal h-10"
            />

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute bottom-full mb-2 left-0 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fadeIn">
                    <div className="p-2 border-b border-slate-100 bg-slate-50">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Mencionar Usuário</span>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                        {suggestions.map(user => (
                            <button
                                key={user.id}
                                type="button"
                                onClick={() => handleSelectSuggestion(user)}
                                className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                            >
                                <div className="w-6 h-6 rounded-full bg-petroleum/10 flex items-center justify-center text-[10px] font-bold text-petroleum">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-slate-700">{user.name}</span>
                                    <span className="text-[10px] text-slate-400">{user.role}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentionInput;

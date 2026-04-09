import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { Key, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import Loader from '../Loader';

const APISettings = () => {
    const [keys, setKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Form State
    const [newKeyName, setNewKeyName] = useState('');
    const [newKeyValue, setNewKeyValue] = useState('');
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState('');

    useEffect(() => {
        fetchKeys();
    }, []);

    const fetchKeys = async () => {
        try {
            const response = await axiosInstance.get('/user/keys');
            setKeys(response.data);
        } catch (err) {
            console.error('Failed to fetch keys:', err);
            setError('Failed to load API keys.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddKey = async (e) => {
        e.preventDefault();
        setAdding(true);
        setAddError('');

        try {
            await axiosInstance.post('/user/keys', {
                name: newKeyName,
                provider: 'gemini-2.5-flash', // Default provider as per request
                api_key: newKeyValue
            });
            setNewKeyName('');
            setNewKeyValue('');
            fetchKeys(); // Refresh list
        } catch (err) {
            console.error('Failed to add key:', err);
            setAddError(err.response?.data?.detail || 'Failed to add API key.');
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteKey = async (keyId) => {
        if (!window.confirm('Are you sure you want to delete this key?')) return;

        try {
            await axiosInstance.delete(`/user/keys/${keyId}`);
            setKeys(keys.filter(k => k.id !== keyId));
        } catch (err) {
            console.error('Failed to delete key:', err);
            alert('Failed to delete key.');
        }
    };

    if (loading) return <Loader text="Loading API settings..." />;

    return (
        <div className="space-y-8">
            {/* Add New Key Section */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                    <Plus className="w-5 h-5 mr-2 text-blue-500" /> Add New API Key
                </h2>

                {addError && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">{addError}</div>}

                <form onSubmit={handleAddKey} className="space-y-4 max-w-lg">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Nickname</label>
                        <input
                            type="text"
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                            placeholder="e.g., My Personal Key"
                            className="w-full px-4 py-2 bg-slate-950/50 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-600 outline-none transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">API Key</label>
                        <input
                            type="password"
                            value={newKeyValue}
                            onChange={(e) => setNewKeyValue(e.target.value)}
                            placeholder="Enter your Gemini API key"
                            className="w-full px-4 py-2 bg-slate-950/50 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-600 outline-none transition-all"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">Provider: gemini-2.5-flash</p>
                    </div>
                    <button
                        type="submit"
                        disabled={adding}
                        className={`flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 ${adding ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {adding ? 'Adding...' : 'Add Key'}
                    </button>
                </form>
            </div>

            {/* Existing Keys Section */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                    <Key className="w-5 h-5 mr-2 text-green-500" /> Managed Keys
                </h2>

                {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm mb-4">{error}</div>}

                {keys.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">No API keys added yet.</p>
                ) : (
                    <div className="space-y-3">
                        {keys.map((key) => (
                            <div key={key.id} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-lg hover:border-blue-500/30 transition-colors group">
                                <div>
                                    <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors">{key.name || 'Unnamed Key'}</h3>
                                    <div className="flex items-center space-x-3 mt-1">
                                        <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-mono">
                                            {key.provider}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            Created: {new Date(key.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteKey(key.id)}
                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                    title="Delete Key"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default APISettings;

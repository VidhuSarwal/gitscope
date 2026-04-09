import { useState } from 'react';
import { useLLM } from '../context/LLMContext';
import { useNavigate } from 'react-router-dom';
import { Key, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ModelKeyModal = ({ isOpen, onClose }) => {
    const { saveKey } = useLLM();
    const navigate = useNavigate();
    const [key, setKey] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!key) return;
        setLoading(true);
        try {
            await saveKey(key);
            onClose();
            // Optional: Refresh or redirect if needed
        } catch (error) {
            console.error("Failed to save key", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSettingsRedirect = () => {
        onClose();
        navigate('/settings');
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4"
                >
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center text-blue-600">
                            <Key className="h-6 w-6 mr-2" />
                            <h2 className="text-xl font-bold text-gray-900">Configure API Key</h2>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <p className="text-gray-600 mb-6">
                        To analyze repositories, you need to configure your Gemini API key. Your key is stored locally and securely.
                    </p>

                    <div className="space-y-4">
                        <input
                            type="password"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            placeholder="Enter Gemini API Key"
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <div className="flex space-x-3">
                            <button
                                onClick={handleSettingsRedirect}
                                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium"
                            >
                                Go to Settings
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={loading || !key}
                                className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Saving...' : 'Save & Continue'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ModelKeyModal;

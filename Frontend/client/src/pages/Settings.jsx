import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserSettings from '../components/settings/UserSettings';
import APISettings from '../components/settings/APISettings';
import { User, Key, ArrowLeft } from 'lucide-react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('user');
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0F172A] pt-20 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
            {/* Background Elements */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>
                <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Vertical Navbar (Left) */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden">
                            <nav className="flex flex-col p-2 space-y-1">
                                <button
                                    onClick={() => setActiveTab('user')}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeTab === 'user'
                                        ? 'bg-blue-600/10 text-blue-400'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <User className="w-5 h-5 mr-3" />
                                    User Profile
                                </button>
                                <button
                                    onClick={() => setActiveTab('api')}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeTab === 'api'
                                        ? 'bg-blue-600/10 text-blue-400'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <Key className="w-5 h-5 mr-3" />
                                    API Configuration
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Content Area (Right) */}
                    <div className="flex-1">
                        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-6">
                            {activeTab === 'user' ? <UserSettings /> : <APISettings />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;

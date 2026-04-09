import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Settings } from 'lucide-react';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Hide Navbar on Login, Signup, and Landing page (root)
    if (['/login', '/signup', '/'].includes(location.pathname)) {
        return null;
    }

    if (!isAuthenticated) return null;

    return (
        <nav className="fixed top-0 w-full z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/app" className="flex-shrink-0 flex items-center group">
                            <img src="/favicon.png" alt="GitScope Logo" className="h-10 w-10 rounded-lg transition-transform group-hover:scale-105" />
                            <span className="ml-3 text-lg font-semibold text-white tracking-tight">GitScope</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">

                        <Link to="/settings" className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors">
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                        </Link>
                        <div className="flex items-center border-l border-white/10 pl-4 ml-4">
                            <span className="text-sm text-gray-400 mr-4 font-medium">{user?.name || user?.email}</span>
                            <button
                                onClick={handleLogout}
                                className="text-gray-400 hover:text-red-400 p-2 rounded-lg hover:bg-white/5 transition-all"
                                title="Logout"
                            >
                                <LogOut className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

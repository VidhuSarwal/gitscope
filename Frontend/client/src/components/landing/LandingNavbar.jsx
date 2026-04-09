import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LandingNavbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const { scrollY } = useScroll();

    useEffect(() => {
        const unsubscribe = scrollY.on("change", (latest) => {
            setIsScrolled(latest > 50);
        });
        return () => unsubscribe();
    }, [scrollY]);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'h-16 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm'
                : 'h-20 bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-full relative flex items-center">
                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-8">
                    {['Product', 'Features', 'Pricing', 'Docs'].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            {item}
                        </a>
                    ))}
                </div>

                {/* Centered Text Logo */}
                <Link
                    to="/"
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center group"
                >
                    <span className="text-xl font-bold text-gray-900 tracking-tight">GitScope</span>
                </Link>

                {/* Actions */}
                <div className="flex items-center space-x-4 ml-auto">
                    {isAuthenticated ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-gray-700">
                                Hi, {user?.username || user?.email?.split('@')[0] || 'User'}
                            </span>
                            <Link
                                to="/app"
                                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
                            >
                                Dashboard
                            </Link>
                        </div>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                Log In
                            </Link>
                            <Link
                                to="/signup"
                                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </motion.nav>
    );
};

export default LandingNavbar;

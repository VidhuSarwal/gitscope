import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

const FooterScene = () => {
    return (
        <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div>
                        <h4 className="text-white font-bold mb-4">Product</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Changelog</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Docs</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Community</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Status</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Connect</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-white transition-colors"><Github size={20} /></a>
                            <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="hover:text-white transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </div>
                </div>

                {/* Huge Brand Text */}
                <div className="py-24 flex items-center justify-center select-none overflow-hidden">
                    <div className="relative flex items-center">
                        <img
                            src="/logo.png"
                            alt="GitScope Logo"
                            className="w-32 h-32 md:w-56 md:h-56 mr-4 md:mr-8 grayscale opacity-90"
                        />
                        <h1 className="text-[12vw] leading-none font-bold text-white tracking-tighter">
                            GitScope
                        </h1>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-sm">
                    <p>© 2025 GitScope Inc. All rights reserved.</p>
                    <p className="mt-2 md:mt-0">Built by developers, for developers.</p>
                </div>
            </div>
        </footer>
    );
};

export default FooterScene;

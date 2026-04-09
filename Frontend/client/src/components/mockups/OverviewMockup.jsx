import React from 'react';

const OverviewMockup = () => {
    return (
        <div className="w-full h-full bg-[#0F172A] p-6 flex flex-col font-sans select-none">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 font-bold">R</div>
                    <span className="text-white font-medium text-lg">facebook / react</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-400">Public</span>
                </div>
                <div className="flex space-x-2">
                    <div className="w-24 h-8 bg-slate-800/50 rounded-lg animate-pulse" />
                    <div className="w-8 h-8 bg-blue-600 rounded-lg" />
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                    { label: "Commits", value: "15,432" },
                    { label: "Contributors", value: "1,829" },
                    { label: "Stars", value: "213k" }
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center">
                        <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">{stat.label}</div>
                        <div className="text-slate-200 text-xl font-bold">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Main Content Split */}
            <div className="flex-1 flex gap-6 min-h-0">
                {/* Left: Summary */}
                <div className="flex-[2] bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col">
                    <div className="w-32 h-5 bg-slate-800 rounded mb-6 flex items-center px-3">
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Readme.md</span>
                    </div>
                    <div className="space-y-3 flex-1 text-slate-500 text-sm leading-relaxed font-mono">
                        <p>GitScope is a powerful tool for analyzing GitHub repositories. It helps you understand the codebase, track commits, and gain insights into the project's health.</p>
                        <p className="opacity-50">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        <div className="h-4" />
                        <p className="opacity-50">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>
                    </div>
                </div>

                {/* Right: Contributors */}
                <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col">
                    <div className="w-24 h-5 bg-slate-800 rounded mb-6 flex items-center px-3">
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Team</span>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: "Sarah Drasner", role: "Core Team" },
                            { name: "Dan Abramov", role: "Maintainer" },
                            { name: "Kent C. Dodds", role: "Contributor" },
                            { name: "Lee Robinson", role: "Developer" }
                        ].map((person, i) => (
                            <div key={i} className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                                    {person.name[0]}
                                </div>
                                <div className="flex-1">
                                    <div className="text-slate-300 text-sm font-medium">{person.name}</div>
                                    <div className="text-slate-600 text-xs">{person.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewMockup;

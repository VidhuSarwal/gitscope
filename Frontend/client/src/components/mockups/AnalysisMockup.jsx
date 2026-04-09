import React from 'react';

const AnalysisMockup = () => {
    return (
        <div className="w-full h-full bg-[#0F172A] flex font-sans select-none">
            {/* Sidebar */}
            <div className="w-64 border-r border-slate-800 bg-slate-900/30 p-4 flex flex-col">
                <div className="flex items-center space-x-2 mb-6 opacity-70">
                    <div className="w-3 h-3 rounded-full bg-slate-600" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Explorer</span>
                </div>
                <div className="space-y-3 pl-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center space-x-2 opacity-60">
                            <div className="w-4 h-4 bg-slate-700 rounded" />
                            <div className={`h-3 bg-slate-700 rounded ${i === 2 ? 'w-24 bg-blue-500/50' : 'w-16'}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Tabs */}
                <div className="h-10 border-b border-slate-800 flex items-center px-4 space-x-4 bg-slate-900/30">
                    <div className="px-3 py-1 bg-slate-800 rounded text-xs text-slate-300 flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                        <span>validation.js</span>
                    </div>
                </div>

                {/* Split View */}
                <div className="flex-1 flex">
                    {/* Code Area */}
                    <div className="flex-1 p-6 font-mono text-sm space-y-1 opacity-80">
                        <div className="flex"><span className="text-purple-400 mr-2">export</span> <span className="text-blue-400">const</span> <span className="text-yellow-200 ml-2">validateUser</span> = (user) ={'>'} {'{'}</div>
                        <div className="pl-4 flex"><span className="text-purple-400">if</span> (!user.email) <span className="text-purple-400">throw</span> <span className="text-blue-400">new</span> <span className="text-yellow-200">Error</span>...</div>
                        <div className="pl-4 text-slate-500">// Check for existing session</div>
                        <div className="pl-4 flex"><span className="text-blue-400">const</span> session = <span className="text-purple-400">await</span> db.find(user.id);</div>
                        <div className="pl-4 flex"><span className="text-purple-400">return</span> session.isValid;</div>
                        <div>{'}'}</div>
                    </div>

                    {/* Chat/Analysis Panel */}
                    <div className="w-80 border-l border-slate-800 bg-slate-900/30 p-4 flex flex-col">
                        <div className="flex justify-end mb-4">
                            <div className="bg-blue-600 text-white text-xs px-3 py-2 rounded-lg rounded-tr-sm max-w-[90%]">
                                Where is the user validation logic?
                            </div>
                        </div>
                        <div className="flex justify-start mb-4">
                            <div className="bg-slate-800 text-slate-300 text-xs px-3 py-2 rounded-lg rounded-tl-sm max-w-[90%] border border-slate-700">
                                <p className="mb-2">It's located in <span className="text-blue-400 font-mono bg-slate-900 px-1 rounded">src/utils/validation.js</span>.</p>
                                <div className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[10px] text-slate-400">
                                    export const validateUser...
                                </div>
                            </div>
                        </div>
                        <div className="mt-auto">
                            <div className="h-8 bg-slate-800/50 rounded-lg border border-slate-700" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisMockup;

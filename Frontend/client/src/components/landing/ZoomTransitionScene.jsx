import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import OverviewMockup from '../mockups/OverviewMockup';
import CommitsMockup from '../mockups/CommitsMockup';
import AnalysisMockup from '../mockups/AnalysisMockup';

const features = [
    {
        id: 1,
        title: "Deep Codebase Understanding",
        description: "Don't just read code—understand it. GitScope analyzes your entire repository structure, dependencies, and logic flow.",
        component: <OverviewMockup />,
        color: "from-blue-600/20 to-indigo-600/20"
    },
    {
        id: 2,
        title: "Turn Commits into Stories",
        description: "Stop digging through git logs. GitScope transforms your commit history into a clear, narrative timeline.",
        component: <CommitsMockup />,
        color: "from-purple-600/20 to-pink-600/20"
    },
    {
        id: 3,
        title: "Chat with Your Code",
        description: "Ask questions like 'Where is the auth logic?' and get instant, context-aware answers pointing to the exact lines of code.",
        component: <AnalysisMockup />,
        color: "from-emerald-600/20 to-teal-600/20"
    }
];

const ZoomTransitionScene = () => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    // Transform vertical scroll into horizontal movement
    const x = useTransform(scrollYProgress, [0, 1], ["10%", "-85%"]);

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-[#0F172A]">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">

                {/* Section Header (Fades out as you scroll) */}
                <motion.div
                    style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
                    className="absolute top-12 left-0 right-0 text-center z-10 px-4"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        From Code to <span className="text-blue-500">Clarity</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Scroll to explore the platform
                    </p>
                </motion.div>

                <motion.div style={{ x }} className="flex gap-12 px-12 md:px-24">
                    {features.map((feature) => (
                        <div key={feature.id} className="relative group">
                            {/* Card Container */}
                            <div className="w-[85vw] md:w-[70vw] lg:w-[60vw] aspect-video bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative z-10">
                                {/* Window Controls */}
                                <div className="h-8 bg-white/5 border-b border-white/5 flex items-center px-4 space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                </div>

                                {/* Component Area */}
                                <div className="relative w-full h-full">
                                    {feature.component}
                                </div>
                            </div>

                            {/* Glow Effect */}
                            <div className={`absolute -inset-1 bg-gradient-to-r ${feature.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 -z-10`} />

                            {/* Caption */}
                            <div className="mt-8 text-center">
                                <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-400 text-lg max-w-xl mx-auto">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default ZoomTransitionScene;

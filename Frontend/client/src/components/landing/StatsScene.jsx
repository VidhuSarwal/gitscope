import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../../animations/transitions';

const STATS = [
    { value: '50K+', label: 'Repositories Analyzed' },
    { value: '1.2M+', label: 'Commits Processed' },
    { value: '99.9%', label: 'Uptime' },
];

const StatsScene = () => {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    {STATS.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            variants={fadeUp}
                            className="py-8 md:py-0"
                        >
                            <div className="text-5xl md:text-6xl font-bold text-blue-600 mb-2 tracking-tight">
                                {stat.value}
                            </div>
                            <div className="text-gray-500 font-medium uppercase tracking-wider text-sm">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsScene;

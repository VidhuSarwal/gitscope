import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CTADark = () => {
    const navigate = useNavigate();

    return (
        <section className="py-32 relative overflow-hidden text-white bg-slate-900">
            {/* Dark Background */}
            <div className="absolute inset-0 bg-slate-900 -z-20" />


            {/* Particles Removed */}

            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
                >
                    Start Your Journey with GitScope
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-xl text-blue-200 mb-10"
                >
                    Your AI-powered GitHub assistant awaits.
                </motion.p>

                <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(37, 99, 235, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/signup')}
                    className="px-10 py-5 bg-blue-600 text-white rounded-full font-bold text-xl shadow-2xl shadow-blue-900/50 hover:bg-blue-500 transition-all flex items-center mx-auto"
                >
                    Get Started <ArrowRight className="ml-2 w-6 h-6" />
                </motion.button>
            </div>
        </section>
    );
};

export default CTADark;

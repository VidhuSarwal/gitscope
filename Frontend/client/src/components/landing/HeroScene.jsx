import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Play, Gitlab } from 'lucide-react';
import { containerStagger, fadeUp } from '../../animations/transitions';
import { useNavigate } from 'react-router-dom';

import googleLogo from '../../assets/logos/google.svg';
import samsungLogo from '../../assets/logos/samsung.svg';
import tiLogo from '../../assets/logos/ti.svg';

gsap.registerPlugin(ScrollTrigger);

const HeroScene = () => {
    const heroRef = useRef(null);
    const blobRef = useRef(null);
    const navigate = useNavigate();
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect();
                setMousePosition({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                });
            }
        };

        const heroElement = heroRef.current;
        if (heroElement) {
            heroElement.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            if (heroElement) {
                heroElement.removeEventListener('mousemove', handleMouseMove);
            }
        };
    }, []);

    useEffect(() => {
        // Blob Animation
        gsap.to(blobRef.current, {
            scale: 1.1,
            y: -20,
            duration: 6,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });

        // Scroll Fade Out
        gsap.to(heroRef.current, {
            scrollTrigger: {
                trigger: heroRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true
            },
            opacity: 0,
            scale: 0.95,
            y: 50
        });
    }, []);

    return (
        <section
            ref={heroRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-32"
            style={{
                background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.08), transparent 40%)`
            }}
        >
            {/* Background Gradient Blob */}
            <div
                ref={blobRef}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-50 -z-10"
            />

            <motion.div
                variants={containerStagger}
                initial="hidden"
                animate="show"
                className="max-w-5xl mx-auto px-6 text-center relative z-10"
            >
                {/* Large Cat Logo */}
                <motion.div variants={fadeUp} className="mb-8 flex justify-center">
                    <img src="/favicon.png" alt="GitScope Logo" className="h-52 w-52 rounded-2xl " />
                </motion.div>

                <motion.div variants={fadeUp} className="mb-6 flex justify-center">
                    <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium border border-blue-100 inline-flex items-center">
                        <span className="w-2 h-2 rounded-full bg-blue-600 mr-2 animate-pulse" />
                        Early Beta arriving Jan 2026
                    </span>
                </motion.div>

                <motion.h1
                    variants={fadeUp}
                    className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight mb-8 leading-[1.1]"
                >
                    Understand Any <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                        Codebase Instantly.
                    </span>
                </motion.h1>

                <motion.p
                    variants={fadeUp}
                    className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
                >
                    Analyze, Visualize, and Summarize codebases in ✨
                    <span className="font-semibold text-gray-800">Seconds</span>
                    ✨.
                </motion.p>

                <motion.div
                    variants={fadeUp}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/signup')}
                        className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold text-lg shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-colors flex items-center"
                    >
                        Try GitScope  <ArrowRight className="ml-2 w-5 h-5" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-white text-gray-700 rounded-full font-semibold text-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors flex items-center"
                    >
                        <Play className="ml-2 w-5 h-5 mr-2 fill-current" /> Watch Demo
                    </motion.button>
                </motion.div>

                {/* Trusted By Section */}
                <motion.div variants={fadeUp} className="flex flex-col items-center space-y-4">
                    <p className="text-lg font-medium text-gray-500">
                        Trusted by engineers at
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Google */}
                        <img src={googleLogo} alt="Google" className="h-12 w-auto" />

                        {/* Samsung */}
                        <img src={samsungLogo} alt="Samsung" className="h-12 w-auto" />

                        {/* Texas Instruments */}
                        <img src={tiLogo} alt="Texas Instruments" className="h-12 w-auto" />

                        {/* GitLab */}
                        <div className="flex items-center space-x-2">
                            <Gitlab className="w-9 h-9 text-[#FC6D26]" />
                            <span className="font-bold text-xl text-gray-800">GitLab</span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>


        </section>
    );
};

export default HeroScene;

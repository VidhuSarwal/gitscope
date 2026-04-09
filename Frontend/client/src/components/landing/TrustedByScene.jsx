import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import googleLogo from '../../assets/logos/google.svg';
import samsungLogo from '../../assets/logos/samsung.svg';
import tiLogo from '../../assets/logos/ti.svg';

const LOGOS = [
    { name: 'Google', logo: googleLogo },
    { name: 'Samsung', logo: samsungLogo },
    { name: 'Texas Instruments', logo: tiLogo },
];

const TrustedByScene = () => {
    const marqueeRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(".marquee-content", {
                xPercent: -50,
                repeat: -1,
                duration: 20,
                ease: "linear",
            });
        }, marqueeRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="py-12 bg-white border-y border-gray-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 text-center mb-10">
                <p className="text-lg font-medium text-gray-500">
                    Trusted by engineers at
                </p>
            </div>

            <div ref={marqueeRef} className="relative w-full flex overflow-hidden mask-linear-fade">
                <div className="marquee-content flex items-center space-x-20 whitespace-nowrap px-8">
                    {[...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS].map((logo, i) => (
                        <div
                            key={i}
                            className="flex items-center space-x-3 opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer grayscale hover:grayscale-0"
                        >
                            <img
                                src={logo.logo}
                                alt={logo.name}
                                className="h-12 w-auto object-contain"
                            />
                            <span className="text-2xl font-bold text-gray-700">{logo.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustedByScene;

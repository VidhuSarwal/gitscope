import React from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import HeroScene from '../components/landing/HeroScene';
import FeatureScene from '../components/landing/FeatureScene';
import ZoomTransitionScene from '../components/landing/ZoomTransitionScene';
import CTADark from '../components/landing/CTADark';
import FooterScene from '../components/landing/FooterScene';

const Landing = () => {
    return (
        <div className="bg-white min-h-screen font-sans selection:bg-blue-200 selection:text-blue-900">
            <LandingNavbar />
            <main>
                <HeroScene />
                <FeatureScene />
                <ZoomTransitionScene />
                <CTADark />
            </main>
            <FooterScene />
        </div>
    );
};

export default Landing;

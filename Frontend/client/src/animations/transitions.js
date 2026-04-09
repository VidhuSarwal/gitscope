export const EASING = {
    default: [0.23, 1, 0.32, 1],
};

export const DUR = {
    fast: 0.2,
    base: 0.6,
    slow: 1.2,
};

export const containerStagger = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: DUR.base,
            ease: EASING.default,
        }
    },
};

export const fadeIn = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            duration: DUR.base,
            ease: EASING.default,
        }
    },
};

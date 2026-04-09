const Loader = ({ text = 'Loading...', fullScreen = false }) => {
    const baseClasses = "flex flex-col items-center justify-center w-full";
    const screenClasses = fullScreen
        ? "min-h-screen bg-[#0F172A] pt-16"
        : "min-h-[200px] h-full bg-transparent";

    return (
        <div className={`${baseClasses} ${screenClasses}`}>
            <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 text-sm font-medium animate-pulse">{text}</p>
        </div>
    );
};

export default Loader;

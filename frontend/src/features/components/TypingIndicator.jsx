const TypingIndicator = () => {
    return (
        <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-2xl text-sm text-muted animate-pulse">
                Processing...
            </div>
        </div>
    );
};

export default TypingIndicator;

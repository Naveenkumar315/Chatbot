import { CloseOutlined, EyeOutlined } from "@ant-design/icons";

const SourcePanel = ({ sources, onClose, onViewPDF }) => {
    return (
        <div className="w-[38%] bg-white rounded-xl shadow-md flex flex-col overflow-hidden animate-slideInRight">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Sources</h3>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Close sources panel"
                >
                    <CloseOutlined className="text-gray-600 text-lg" />
                </button>
            </div>

            {/* Sources List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {sources.map((source, index) => (
                    <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                        <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">File Name:</p>
                            <p className="text-sm text-gray-600">{source.fileName}</p>
                        </div>

                        <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">Page No:</p>
                            <p className="text-sm text-gray-600">{source.pageNumber}</p>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">View PDF:</p>
                            <div className="flex gap-2">
                                {source.forms?.map((form, formIndex) => (
                                    <button
                                        key={formIndex}
                                        onClick={() => onViewPDF(form.url, form.name, source.pageNumber)}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 
                                                 rounded-lg border border-blue-200 hover:bg-blue-100 
                                                 transition-colors text-sm"
                                    >
                                        <EyeOutlined className="text-base" />
                                        <span>{form.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                {sources.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p>No sources available</p>
                    </div>
                )}
            </div>

            {/* Footer Stats */}
            <div className="border-t border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Timing</p>
                            <p className="font-semibold text-gray-800">0.18 Sec</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-xs text-gray-500">Key Search Hits</p>
                        <p className="font-semibold text-gray-800">4.96 Sec</p>
                    </div>

                    <div className="text-right">
                        <p className="text-xs text-gray-500">Total Hits Taken</p>
                        <p className="font-semibold text-gray-800">5.15 Sec</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SourcePanel;
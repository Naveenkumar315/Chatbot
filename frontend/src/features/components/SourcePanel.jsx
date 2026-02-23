import files from "../../file";
import { useChartStore } from "../chat/store/chat.store";
import { useUIStore } from "../chat/store/ui.store";
import { useSettingsStore } from "../chat/store/settings.store";

const SourcePanel = () => {
    const { closePanel, openPdf } = useUIStore();
    const selectedMessage = useChartStore((s) => s.selectedMessage);
    const theme = useSettingsStore((s) => s.theme)

    console.log('sources', selectedMessage);

    const sources = selectedMessage?.source || [];

    const handleOpenPdf = (src) => {
        console.log('Opening PDF with source:', src);

        // Create proper PDF data structure with fullpath
        const pdfData = {
            file: src.file,
            page: src.page,
            fullpath: src.fullpath || src.path || `${src.directory}/${src.file}` // Try multiple fields
        };

        console.log('PDF data being sent:', pdfData);
        openPdf(pdfData);
    };

    return (
        <div className="h-full flex flex-col w-full overflow-hidden">

            {/* Header */}
            <div className={`flex justify-between items-center p-4 border-b border-b-border-gray flex-shrink-0 ${theme === "light" ? "bg-white" : "bg-bg-dark-main"} `}>
                <span className={`font-semibold text-lg custom-font-jura ${theme === "light" ? "text-slate-800" : "text-[#BBBBBB]"}`}>
                    Sources
                </span>
                <button
                    onClick={closePanel}
                    className="text-gray-500 hover:text-gray-700 text-xl leading-none cursor-pointer"
                >
                    ✕
                </button>
            </div>

            {/* Sources List - Scrollable */}
            <div className={`flex-1 ${theme === "light" ? "bg-white" : "bg-bg-dark-main"} overflow-y-auto`}>
                <div className="p-4">
                    {sources.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            No sources available
                        </div>
                    ) : (
                        sources.map((src, index) => {
                            console.log('Source item:', src); // Debug log

                            return (
                                <div
                                    key={index}
                                    className={`border border-border-gray rounded-lg p-3 mb-3 ${theme === "light" ? "bg-white" : "bg-bg-dark-header"} `}
                                >
                                    {/* File Name */}
                                    <div className="flex mb-1 text-[13px]">
                                        <span className={`w-20 text-gray-500 flex-shrink-0 ${theme === "light" ? "text-gray-500" : "text-[#969696]"}`}>
                                            File:
                                        </span>
                                        <span className={`font-medium truncate ${theme === "light" ? "text-gray-800" : "text-white"}`}>
                                            {src.file || 'Unknown'}
                                        </span>
                                    </div>

                                    {/* Page No */}
                                    <div className="flex mb-3 text-[13px]">
                                        <span className={`w-20 text-gray-500 flex-shrink-0 ${theme === "light" ? "text-gray-500" : "text-[#969696]"}`}>
                                            Page:
                                        </span>
                                        <span className={`font-medium ${theme === "light" ? "text-gray-800" : "text-white"}`}>
                                            {src.page || 'N/A'}
                                        </span>
                                    </div>

                                    {/* Debug: Show fullpath if available */}
                                    {(src.fullpath || src.path) && (
                                        <div className="flex mb-3 text-[11px] ">
                                            <span className={`w-20 flex-shrink-0 ${theme === "light" ? "text-gray-500" : "text-[#969696]"}`}>
                                                Path:
                                            </span>
                                            <span className={`truncate ${theme === "light" ? "text-gray-500" : "text-[#BBBBBB]"}`}>
                                                {src.fullpath || src.path}
                                            </span>
                                        </div>
                                    )}

                                    {/* View PDF */}
                                    <div>
                                        <div className={`text-[12px] mb-1 ${theme === "light" ? "text-gray-500" : "text-[#BBBBBB]"}`}>
                                            View PDF:
                                        </div>

                                        <div
                                            onClick={() => handleOpenPdf(src)}
                                            className={`flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer transition text-[13px]
                                            ${theme === "light"
                                                    ? "border-border-gray hover:bg-gray-50 text-gray-700"
                                                    : "border-gray-600 hover:bg-gray-700 text-[#BBBBBB]"}`}
                                        >
                                            <img
                                                src={files.file_Icon}
                                                alt="pdf"
                                                className="w-4 h-4 flex-shrink-0"
                                            />

                                            <span className="truncate flex-1">
                                                {src.file || 'View PDF'}
                                            </span>

                                            <img
                                                src={files.vector_Eye}
                                                alt="view"
                                                className="w-4 h-4 flex-shrink-0"
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default SourcePanel;
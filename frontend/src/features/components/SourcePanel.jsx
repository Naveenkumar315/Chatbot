import files from "../../file";
import { useChartStore } from "../chat/store/chat.store";
import { useUIStore } from "../chat/store/ui.store";
import { useSettingsStore } from "../chat/store/settings.store";

const TimingCard = ({ theme, timing }) => {
    console.log('timing', timing);

    const isDark = theme !== "light";

    const stats = [
        { label: "Key Search Time", value: timing?.['key search time'] ?? "0.00", unit: "Sec" },
        { label: "Search Response Time", value: timing?.["search response time"] ?? "0.00", unit: "Sec" },
        { label: "Total Time Taken", value: timing?.["total time taken"] ?? "0.00", unit: "Sec" },
    ];

    return (
        <div
            className={`rounded-xl border p-4 flex items-center gap-3 italic ${
                isDark
                    ? "bg-[#05201c] border-[#0e8f7e]"
                    : "bg-[#f4fffe] border-[#93e6eb]"
            }`}
            style={{
                boxShadow: isDark
                    ? "0 2px 16px 0 rgba(0,201,167,0.05)"
                    : "0 2px 16px 0 rgba(0,180,180,0.08)",
                fontFamily: "'Jura', sans-serif",
            }}
        >
            {/* Icon + Label */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <img src={files.timing_logo} alt="timing" className="" />
                <span
                    className="font-bold text-[15px] tracking-wide"
                    style={{ color: theme === "light" ? "#141414" : "#fff" }}
                >
                    Timing
                </span>
            </div>

            {/* Slanted Divider */}
            <div
                className="h-10 w-px flex-shrink-0"
                // style={{
                //     background: isDark ? "#0e8f7e" : "#a8e6e6",
                //     transform: "skewX(-12deg)",
                // }}
            />

            {/* Stats */}
            <div className="flex flex-1 items-center">
                {stats.map((stat, i) => (
                    <div key={stat.label} className="flex flex-1 items-center">
                        <div className="flex flex-col items-center flex-1">
                            <div className="flex items-baseline gap-1">
                                <span
                                    className="font-bold text-[17px]"
                                    style={{ color: "#00C9A7" }}
                                >
                                    {stat.value}
                                </span>

                                <span
                                    className="text-[11px] font-semibold"
                                    style={{ color: "#00C9A7" }}
                                >
                                    {stat.unit}
                                </span>
                            </div>

                            <span
                                className="text-[10px] mt-0.5 text-center whitespace-nowrap"
                                style={{
                                    color: isDark
                                        ? "#6b7f8f"
                                        : "#8aabab",
                                }}
                            >
                                {stat.label}
                            </span>
                        </div>

                        {/* Slanted Divider Between Stats */}
                        {i < stats.length - 1 && (
                            <div
                                className="h-8 w-px flex-shrink-0"
                                style={{
                                    background: isDark
                                        ? "#0e8f7e"
                                        : "#a8e6e6",
                                    transform: "skewX(-12deg)",
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const SourcePanel = () => {
    const { closePanel, openPdf } = useUIStore();
    const selectedMessage = useChartStore((s) => s.selectedMessage);
    const theme = useSettingsStore((s) => s.theme);

    const sources = selectedMessage?.source || [];
    const timing = selectedMessage?.timing || null;

    const handleOpenPdf = (src) => {
        const pdfData = {
            file: src.file,
            page: src.page,
            fullpath: src.fullpath || src.path || `${src.directory}/${src.file}`,
        };
        openPdf(pdfData);
    };

    return (
        <div className="h-full flex flex-col w-full overflow-hidden">

            {/* Header */}
            <div
                className={`flex justify-between items-center p-4 border-b border-b-border-gray flex-shrink-0 ${theme === "light" ? "bg-white" : "bg-bg-dark-main"
                    }`}
            >
                <span
                    className={`font-semibold text-lg custom-font-jura ${theme === "light" ? "text-slate-800" : "text-[#BBBBBB]"
                        }`}
                >
                    Sources
                </span>
                <button
                    onClick={closePanel}
                    className="text-gray-500 hover:text-gray-700 text-xl leading-none cursor-pointer"
                >
                    ✕
                </button>
            </div>

            {/* Sources - Scrollable */}
            <div
                className={`flex-1 ${theme === "light" ? "bg-white" : "bg-bg-dark-main"
                    } overflow-y-auto`}
            >
                <div className="p-4">

                    {/* ── Sources ── */}
                    {sources.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            No sources available
                        </div>
                    ) : (
                        sources.map((src, index) => (
                            <div
                                key={index}
                                className={`border border-border-gray rounded-lg p-3 mb-3 ${theme === "light" ? "bg-white" : "bg-bg-dark-header"
                                    }`}
                            >
                                {/* File */}
                                <div className="flex mb-1 text-[13px]">
                                    <span className={`w-20 flex-shrink-0 ${theme === "light" ? "text-gray-500" : "text-[#969696]"}`}>
                                        File:
                                    </span>
                                    <span className={`font-medium truncate ${theme === "light" ? "text-gray-800" : "text-white"}`}>
                                        {src.file || "Unknown"}
                                    </span>
                                </div>

                                {/* Page */}
                                <div className="flex mb-3 text-[13px]">
                                    <span className={`w-20 flex-shrink-0 ${theme === "light" ? "text-gray-500" : "text-[#969696]"}`}>
                                        Page:
                                    </span>
                                    <span className={`font-medium ${theme === "light" ? "text-gray-800" : "text-white"}`}>
                                        {src.page || "N/A"}
                                    </span>
                                </div>

                                {/* Path */}
                                {(src.fullpath || src.path) && (
                                    <div className="flex mb-3 text-[11px]">
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
                                        <img src={theme === "light" ? files.file_Icon : files.file_Icon_dark} alt="pdf" className="flex-shrink-0" />
                                        <span className="truncate flex-1">{src.file || "View PDF"}</span>
                                        <img src={files.vector_Eye} alt="view" className=" flex-shrink-0" />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* ── Timing Card - Static Footer ── */}
            <div className={`flex-shrink-0 p-2 border-t border-border-gray ${theme === "light" ? "bg-white" : "bg-bg-dark-main"}`}>
                <TimingCard theme={theme} timing={timing} />
            </div>

        </div>
    );
};

export default SourcePanel;
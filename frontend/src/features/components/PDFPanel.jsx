import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useUIStore } from "../chat/store/ui.store";
import files from "../../file";
import axios from "axios";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useSettingsStore } from "../chat/store/settings.store";

// Worker from public folder
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const PDFPanel = () => {
    const { closePanel, backToSource, pdfData } = useUIStore();

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.1);
    const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
    const theme = useSettingsStore((s) => s.theme)

    // Fetch PDF when pdfData changes
    useEffect(() => {
        if (!pdfData?.fullpath) return;

        let objectUrl;

        const fetchPdf = async () => {
            try {
                debugger
                const fullPath = pdfData.fullpath;
                const filename = fullPath.split(/[/\\]/).pop();
                const directory = fullPath.replace(/[/\\][^/\\]+$/, "");

                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/pdf`,
                    {
                        params: { directory, filename },
                        responseType: "blob",
                    }
                );

                console.log("response", response);


                objectUrl = URL.createObjectURL(response.data);
                setPdfBlobUrl(objectUrl);

                // Reset zoom + page on new PDF
                setScale(1.1);
                setPageNumber(pdfData.page ? Number(pdfData.page) : 1);
            } catch (err) {
                console.error("PDF fetch error:", err);
            }
        };

        fetchPdf();

        // Cleanup to prevent memory leak
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [pdfData]);

    const onLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);

        const requestedPage = Number(pdfData?.page) || 1;

        if (requestedPage > numPages) {
            setPageNumber(numPages);
        } else if (requestedPage < 1) {
            setPageNumber(1);
        } else {
            setPageNumber(requestedPage);
        }
    };

    const goPrev = () => setPageNumber((p) => Math.max(p - 1, 1));
    const goNext = () =>
        setPageNumber((p) => Math.min(p + 1, numPages || 1));

    return (
        <div className="flex flex-col h-full bg-white w-full max-w-full overflow-hidden">

            {/* HEADER */}
            <div className={`flex justify-between items-center px-4 py-2 border-b flex-shrink-0
    ${theme === "light"
                    ? "bg-gray-50 border-border-gray text-[#303030] hover:text-black"
                    : "bg-[#141414] border-gray-700 text-[#f2f2f2]"}`}>

                {/* Back */}
                <div
                    onClick={backToSource}
                    role="button"
                    tabIndex={0}
                    className="flex items-center gap-2 text-sm   cursor-pointer select-none"
                >
                    <img
                        src={files.vector_Left_Arrow}
                        alt="Back"
                        className="w-3 h-3"
                    />
                    Back to Sources
                </div>

                {/* Close */}
                <button
                    onClick={closePanel}
                    className="text-gray-500 hover:text-gray-700 text-xl leading-none cursor-pointer"
                >
                    ✕
                </button>
            </div>

            {/* CONTROL BAR */}
            <div className={`flex justify-between items-center px-4 py-2 border-b flex-shrink-0
    ${theme === "light"
                    ? "bg-white border-border-gray text-gray-800"
                    : "bg-bg-dark-header border-gray-700 text-[#f2f2f2]"}`}>

                {/* Zoom Controls */}
                <div className="flex items-center gap-3 w-[260px]">
                    <span className="text-xs w-[45px] text-right font-medium">
                        {Math.round(scale * 100)}%
                    </span>

                    <input
                        type="range"
                        min="0.5"
                        max="3"
                        step="0.05"
                        value={scale}
                        onChange={(e) => setScale(Number(e.target.value))}
                        className={`flex-1 cursor-pointer ${theme === "light" ? "accent-black" : "accent-white"}`}
                    />

                    <button
                        onClick={() => setScale(1.1)}
                        className={`h-7 px-3 border rounded text-xs transition
                ${theme === "light"
                                ? "bg-white border-border-gray hover:bg-gray-100"
                                : "bg-[#141414] border-gray-600 hover:bg-gray-700 text-[#f2f2f2]"}`}
                    >
                        Reset
                    </button>
                </div>

                {/* Page Controls */}
                {numPages && (
                    <div className="flex items-center gap-1 text-xs">
                        <button
                            onClick={goPrev}
                            disabled={pageNumber <= 1}
                            className={`h-6 w-6 flex items-center justify-center border rounded disabled:opacity-50 transition
                    ${theme === "light"
                                    ? "bg-white border-border-gray hover:bg-gray-100"
                                    : "bg-[#141414] border-gray-600 hover:bg-gray-700"}`}
                        >
                            <img src={files.chevron_left} alt="Previous" className="w-4 h-4" />
                        </button>

                        <span className="text-center px-1">
                            {pageNumber} / {numPages}
                        </span>

                        <button
                            onClick={goNext}
                            disabled={pageNumber >= numPages}
                            className={`h-6 w-6 flex items-center justify-center border rounded disabled:opacity-50 transition
                    ${theme === "light"
                                    ? "bg-white border-border-gray hover:bg-gray-100"
                                    : "bg-[#141414] border-gray-600 hover:bg-gray-700"}`}
                        >
                            <img src={files.chevron_right} alt="Next" className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* PDF VIEWER - Strictly contained with no layout influence */}
            <div className={`flex-1 overflow-auto  w-full min-h-0 ${theme === "light" ? "bg-gray-100" : "bg-bg-dark-main"}`} style={{ contain: 'strict' }}>
                <div className="flex justify-center items-start py-6">
                    {pdfBlobUrl && (
                        <Document
                            file={pdfBlobUrl}
                            onLoadSuccess={onLoadSuccess}
                        >
                            <Page
                                pageNumber={pageNumber}
                                scale={scale}
                                className="shadow-md"
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                            />
                        </Document>
                    )}
                </div>
            </div>


        </div>
    );
};

export default PDFPanel;
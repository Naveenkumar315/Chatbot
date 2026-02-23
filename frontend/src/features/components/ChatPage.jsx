import Split from "react-split";
import ChatContainer from "./ChatContainer";
import ChatInput from "./ChatInput";
import DisclaimerBar from "./DisclaimerBar";
import { useUIStore } from "../chat/store/ui.store";

import files from "../../file";
import RightPanel from "./RightPanel";
import { useSettingsStore } from "../chat/store/settings.store";

const ChatPage = () => {
    const { isSplit } = useUIStore();
    const theme = useSettingsStore((s) => s.theme)

    const ChatSection = () => (
        <div className="h-full bg-white shadow-md flex flex-col overflow-hidden">
            {/* Header */}
            <div className="relative h-[80px] w-full overflow-hidden flex-shrink-0">
                <img
                    src={theme === "light" ? files.background_light_Without_text : files.bg_light_WithoutText_dark}
                    alt=""
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <h2 className={`text-4xl font-bold italic ${theme === "light" ? "text-slate-800" : "text-white"}`}>
                        Genie
                    </h2>
                    <p className={`text-sm italic font-bold ${theme === "light" ? "text-slate-600" : "text-white"}`}>
                        Your go-to assistant for all company policy questions.
                    </p>
                </div>
            </div>

            <ChatContainer />
            <ChatInput />
            <DisclaimerBar />
        </div>
    );

    return (
        <div className={`${theme === "dark" ? "bg-bg-dark-main" : "bg-bg-gray"} h-screen flex flex-col overflow-hidden`}>
            {/* TOP SPACING */}
            <div className={`${!isSplit ? "h-[60px]" : "h-[50px]"} flex-shrink-0`} />

            {/* MAIN CONTENT AREA */}
            <div className="flex flex-1 px-4 pb-4 overflow-hidden min-h-0 max-w-full">
                {!isSplit ? (
                    /* SINGLE VIEW - CHAT ONLY */
                    <div className="w-[750px] mx-auto bg-white rounded-xl shadow-md flex flex-col h-full overflow-hidden">
                        <ChatSection />
                    </div>
                ) : (
                    /* SPLIT VIEW - CHAT + PDF/SOURCE */
                    <Split
                        className="flex flex-1 h-full"
                        sizes={[50, 50]}
                        minSize={300}
                        maxSize={Infinity}
                        expandToMin={false}
                        gutterSize={4}
                        gutterAlign="center"
                        snapOffset={30}
                        dragInterval={1}
                        direction="horizontal"
                        cursor="col-resize"
                        style={{ width: '100%' }}
                    >
                        {/* LEFT PANEL - CHAT */}
                        <div className="overflow-hidden h-full flex-shrink-0" style={{ position: 'relative' }}>
                            <ChatSection />
                        </div>

                        {/* RIGHT PANEL - PDF/SOURCE */}
                        <div className="bg-white border-l overflow-hidden h-full flex-shrink-0" style={{ position: 'relative' }}>
                            <RightPanel />
                        </div>
                    </Split>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
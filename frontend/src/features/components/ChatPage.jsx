import ChatContainer from "./ChatContainer";
import ChatInput from "./ChatInput";
import SourceModal from "./SourceModal";
import PDFViewerModal from "./PDFViewerModal";
import DisclaimerBar from "./DisclaimerBar";
import { StarFilled } from "@ant-design/icons";

import files from "../../file";

const ChatPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-[60px] px-4">

            {/* Chat Card */}
            <div className="w-full max-w-[750px] bg-white rounded-xl shadow-md 
                flex flex-col overflow-hidden 
                h-[calc(100vh-120px)]">


                <div className="relative h-[80px] w-full overflow-hidden">
                    <img
                        src={files.background_light_Without_text}
                        alt=""
                        className="w-full h-full object-cover"
                    />

                    {/* Overlay Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                        <h2 className="text-4xl font-bold text-slate-800 italic">
                            Genie <img src={files.group_} alt="Group" className="inline-block w-10" />
                        </h2>
                        <p className="text-sm text-slate-600 mt-2 italic font-bold">
                            Your go-to assistant for all company policy questions.
                        </p>
                    </div>
                </div>



                <ChatContainer />
                <ChatInput />

            </div>

            {/* Disclaimer aligned with card */}
            <DisclaimerBar />

            <SourceModal />
            <PDFViewerModal />

        </div>
    );
};

export default ChatPage;

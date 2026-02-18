import { useState } from "react";
import files from "../../file";
import { useChartStore } from "../chat/store/chat.store";
import { useSettingsStore } from "../chat/store/settings.store";
import { useSendMessage } from "../hooks/useSendMessage";

const ChatInput = () => {
    const [input, setInput] = useState("");
    const addMessage = useChartStore((state) => state.addMessage)
    const country = useSettingsStore((s) => s.country);
    const { mutate } = useSendMessage();

    const handleSend = () => {
        if (!input.trim()) return;

        addMessage({
            _id: Date.now(),
            type: "user",
            text: input
        })

        mutate({
            question: input,
            country,
        });

        setInput("");
    };

    return (
        <div className="border-t border-border-black px-3 py-2 bg-bg-gray">
            <div className="flex items-center gap-3">

                <div className="relative flex-1">

                    {/* Icon inside input */}
                    <img
                        src={files.ai_assistant}
                        alt=""
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
                    />

                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyUp={(e) => {
                            if (e.key == "Enter") {
                                handleSend();
                            }
                        }}
                        placeholder="Type..."
                        className="w-full border border-border-black bg-white rounded pl-10 pr-4 h-[40px] text-sm 
                        focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 
                        transition-all duration-200"

                    />

                </div>

                <button
                    onClick={handleSend}

                    className="h-[35px] w-[35px] flex items-center justify-center bg-primary text-white rounded shadow-sm hover:bg-[#1C8BC2] hover:shadow-md transition-all duration-200 cursor-pointer"
                >

                    <img src={files.send_horizontal} alt="" className="w-4 h-4" />
                </button>


            </div>

        </div>
    );
};

export default ChatInput;

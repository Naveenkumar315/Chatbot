import files from "../../file";
import { useChartStore } from "../chat/store/chat.store";
import ReactionBar from "./ReactionBar";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useState } from "react";


const ChatMessage = ({ message }) => {
    const isUser = message?.type === "user";

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!message?.text) return;

        navigator.clipboard.writeText(message.text);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };


    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-8`}>
            <div className={`relative max-w-[70%] group flex ${isUser ? "flex-row-reverse" : "flex-row"} gap-2 items-start`}>

                {/* Avatar */}
                <div className="flex-shrink-0">
                    {isUser ? (
                        <img
                            src={files.ai_assistant}
                            alt="User"
                            className=" rounded-full object-cover"
                        />
                    ) : (
                        <img
                            src={files.ai_assistant}
                            alt="CA Genie"
                            className=" rounded-full object-cover"
                        />
                    )}
                </div>

                {/* Message Content */}
                <div className="flex-1">
                    {/* Invisible hover extender */}
                    {!isUser && (
                        <div className="absolute -bottom-10 left-0 w-full h-12 z-0" />
                    )}

                    {/* Name */}
                    <div className={`text-xs text-gray-500 mb-1 ${isUser ? "text-right" : "text-left"}`}>
                        {isUser ? "You" : "CA Genie"}
                    </div>

                    {/* Message Bubble */}
                    <div
                        className={`px-2 pr-5 py-1 text-[12px] rounded shadow-sm relative z-10
                        ${isUser
                                ? "bg-primary text-white rounded-br-md"
                                : "bg-gray-100 text-text rounded-bl-md"
                            }`}
                    >
                        {/* Copy Button */}
                        {
                            !isUser && (

                                <div
                                    onClick={handleCopy}
                                    className="absolute top-3 right-3 cursor-pointer 
                                opacity-0 group-hover:opacity-100 
                                transition-all duration-200 text-[11px] font-medium"
                                >
                                    {copied ? (
                                        <span className="text-green-500"> ✓</span>
                                    ) : (
                                        <img src={files.copy} alt="Copy" className="w-3 h-3" />
                                    )}
                                </div>
                            )
                        }

                        <div className="flex items-end justify-between gap-2">
                            <span className="flex-1">{message?.text}</span>

                            {(
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    {!isUser && (<InfoCircleOutlined
                                        className="text-[14px] cursor-pointer !text-yellow-400 !hover:text-yellow-600 transition"
                                    />)}

                                    {message?.reaction && (
                                        <div className={`absolute -bottom-3  ${isUser ? "right-0" : "left-0"}
                                            transition-all duration-200`}>
                                            <span className="inline-flex items-center px-1.5 py-0.5 
                                            bg-white shadow rounded-full text-xs border border-gray-300">
                                                {message.reaction}
                                            </span>
                                        </div>
                                    )}

                                </div>
                            )}
                        </div>
                    </div>

                    {/* Floating ReactionBar */}
                    {(
                        <div className="absolute -bottom-10 right-0 
                              opacity-0 group-hover:opacity-100 
                              transition-opacity duration-200 z-20">
                            <ReactionBar
                                messageId={message._id}
                                currentReaction={message?.reaction || null}
                            />
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ChatMessage;
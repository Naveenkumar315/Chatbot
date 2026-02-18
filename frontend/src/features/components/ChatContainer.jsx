import { useRef, useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import { useChartStore } from "../chat/store/chat.store";

const ChatContainer = () => {
    const messages = useChartStore((state) => state.message);
    const isTyping = useChartStore((state) => state.isTyping);
    const loadMoreMessages = useChartStore((state) => state.loadMoreMessages); // Add this to your store

    const containerRef = useRef(null);
    const bottomRef = useRef(null);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const previousScrollHeight = useRef(0);
    const previousMessageCount = useRef(messages?.length || 0);

    useEffect(() => {
        setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: "auto" });
        }, 100);
    }, []);

    useEffect(() => {
        if (isTyping) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [isTyping]);

    useEffect(() => {
        const currentMessageCount = messages?.length || 0;

        // Only scroll if message count increased (new message sent)
        if (currentMessageCount > previousMessageCount.current) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }

        previousMessageCount.current = currentMessageCount;
    }, [messages]);


    // Handle scroll for loading history
    const handleScroll = async () => {
        if (!containerRef.current || isLoadingHistory || !hasMore) return;

        const { scrollTop } = containerRef.current;

        // Load more when scrolled to top
        if (scrollTop < 100) {
            setIsLoadingHistory(true);
            previousScrollHeight.current = containerRef.current.scrollHeight;

            try {
                // Call your API to load more messages
                const moreMessages = await loadMoreMessages();

                if (!moreMessages || moreMessages.length === 0) {
                    setHasMore(false);
                }

                // Maintain scroll position after loading
                setTimeout(() => {
                    if (containerRef.current) {
                        const newScrollHeight = containerRef.current.scrollHeight;
                        containerRef.current.scrollTop = newScrollHeight - previousScrollHeight.current;
                    }
                }, 0);
            } catch (error) {
                console.error("Error loading messages:", error);
            } finally {
                setIsLoadingHistory(false);
            }
        }
    };

    return (
        <div
            ref={containerRef}
            // onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-white scroll-smooth"
        >
            {/* Loading indicator for history */}
            {isLoadingHistory && (
                <div className="flex justify-center py-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
            )}

            {/* No more messages indicator */}
            {!hasMore && messages.length > 0 && (
                <div className="text-center text-gray-400 text-sm py-2">
                    No more messages
                </div>
            )}

            {/* Messages */}
            {messages?.map((msg) => (
                <ChatMessage key={msg._id} message={msg} />
            ))}

            {/* Typing indicator */}
            {isTyping && <TypingIndicator />}

            {/* Invisible element to scroll to */}
            <div ref={bottomRef} />
        </div>
    );
};

export default ChatContainer;
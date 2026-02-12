import { useReaction } from "../hooks/useReaction";

const emojis = ["👍", "❤️", "😂", "😕", "🔥", "👏", "😮"];

const ReactionBar = ({ messageId, currentReaction = null }) => {
    const { mutate } = useReaction();

    const handleEmojiClick = (emoji) => {
        // If clicking the same emoji, remove it. Otherwise, replace with new one.
        const action = currentReaction === emoji ? 'remove' : 'add';

        mutate({
            messageId,
            emoji,
            action
        });
    };

    return (
        <div className="flex gap-2 mt-2 text-sm text-muted bg-gray-50 shadow-md rounded-lg px-1 py-1">
            {emojis.map((emoji) => {
                const isSelected = currentReaction === emoji;

                return (
                    <span
                        key={emoji}
                        onClick={() => handleEmojiClick(emoji)}
                        className={`cursor-pointer hover:scale-125 transition-transform text-lg
                            ${isSelected ? 'bg-blue-100 rounded-full px-1 scale-110' : ''}`}
                    >
                        {emoji}
                    </span>
                );
            })}
        </div>
    );
};

export default ReactionBar;
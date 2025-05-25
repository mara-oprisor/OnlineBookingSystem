import ReactMarkdown from "react-markdown";
import useAIChat from "../hooks/useAIChat";

function AIChatPage() {
    const {
        messages,
        draft,
        setDraft,
        scrollRef,
        sendMessage,
        handleKeyDown,
    } = useAIChat();

    return (
        <div className="chat-container">
            <h2 className="chat-title">AI Chat</h2>

            <div className="chat-history" ref={scrollRef}>
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={`chat-bubble ${m.role === "assistant" ? "assistant" : "user"}`}
                    >
                        <ReactMarkdown>{m.text}</ReactMarkdown>
                    </div>
                ))}
            </div>

            <div className="chat-input-row">
        <textarea
            className="chat-textarea"
            placeholder="Type your question…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
        />
                <button
                    className="chat-send-btn btn btn-primary"
                    onClick={sendMessage}
                    disabled={!draft.trim()}
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default AIChatPage;

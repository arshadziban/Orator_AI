import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import '../styles/FormattedOutput.css'

export default function FormattedOutput({ messages = [], onClear, isLoading }) {
  const [copiedId, setCopiedId] = useState(null)
  const chatContainerRef = useRef(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleCopy = (text, messageId) => {
    navigator.clipboard.writeText(text)
    setCopiedId(`${messageId}-${Date.now()}`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const removeCitations = (text) => {
    // Remove markdown-style citations like [1], [2], etc.
    return text.replace(/\[\d+\]/g, '').trim()
  }

  if (messages.length === 0) {
    return (
      <div className="output-section empty-state">
        <div className="empty-message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <h3>Start a Conversation</h3>
          <p>Record your voice or upload audio to begin</p>
        </div>
      </div>
    )
  }

  return (
    <div className="output-section">
      <div className="chat-header">
        <div>
          <h2>Chat</h2>
          <p>{messages.length} message{messages.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn-clear" onClick={onClear} disabled={isLoading}>
          New Chat
        </button>
      </div>

      <div className="chat-container" ref={chatContainerRef}>
        {messages.map((msg) => (
          <div key={msg.id} className="chat-exchange">
            {/* User Message */}
            <div className="message user">
              <div className="message-bubble user-bubble">
                {msg.original_text}
              </div>
              <button
                className={`btn-copy-message ${
                  copiedId === `${msg.id}-original` ? 'copied' : ''
                }`}
                onClick={() => handleCopy(msg.original_text, `${msg.id}-original`)}
                title="Copy message"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                </svg>
              </button>
            </div>

            {/* Bot Response */}
            <div className="message bot">
              <div className="message-bubble bot-bubble">
                <ReactMarkdown>{removeCitations(msg.formal_text)}</ReactMarkdown>
              </div>
              <button
                className={`btn-copy-message ${
                  copiedId === `${msg.id}-formal` ? 'copied' : ''
                }`}
                onClick={() => handleCopy(msg.formal_text, `${msg.id}-formal`)}
                title="Copy message"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                </svg>
              </button>
            </div>

            {/* Message Stats */}
            <div className="message-stats-compact">
              <div className="stat-item-simple">
                <span className="stat-number">{msg.original_text.length}</span>
                <span className="stat-arrow">→</span>
                <span className="stat-number highlight">{msg.formal_text.length}</span>
                <span className="stat-name">characters</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item-simple">
                <span className="stat-number">{msg.original_text.split(/\s+/).filter(w => w).length}</span>
                <span className="stat-arrow">→</span>
                <span className="stat-number highlight">{msg.formal_text.split(/\s+/).filter(w => w).length}</span>
                <span className="stat-name">words</span>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="loading-indicator">
            <div className="spinner-small"></div>
            <p>Processing audio...</p>
          </div>
        )}
      </div>
    </div>
  )
}

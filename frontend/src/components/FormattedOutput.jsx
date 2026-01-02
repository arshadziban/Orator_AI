import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import '../styles/FormattedOutput.css'

/**
 * FormattedOutput Component
 * 
 * Displays the chat conversation history including:
 * - User's transcribed input from audio
 * - AI chatbot's response
 * - Message statistics and formatting
 */
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
          <p>Record your voice or upload audio to begin chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div className="output-section">
      <div className="chat-header">
        <div>
          <h2>Conversation</h2>
          <p>{messages.length} message{messages.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn-clear" onClick={onClear} disabled={isLoading}>
          New Chat
        </button>
      </div>

      <div className="chat-container" ref={chatContainerRef}>
        {messages.map((msg) => (
          <div key={msg.id} className="chat-exchange">
            {/* User Message - Transcribed from Audio */}
            <div className="message user">
              <div className="message-bubble user-bubble">
                <span className="message-label">You (transcribed):</span>
                {msg.user_input}
              </div>
              <button
                className={`btn-copy-message ${
                  copiedId === `${msg.id}-user` ? 'copied' : ''
                }`}
                onClick={() => handleCopy(msg.user_input, `${msg.id}-user`)}
                title="Copy message"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                </svg>
              </button>
            </div>

            {/* Chatbot Response */}
            <div className="message bot">
              <div className="message-bubble bot-bubble">
                <span className="message-label">OratorAI Chatbot:</span>
                <ReactMarkdown>{removeCitations(msg.chatbot_response)}</ReactMarkdown>
              </div>
              <button
                className={`btn-copy-message ${
                  copiedId === `${msg.id}-bot` ? 'copied' : ''
                }`}
                onClick={() => handleCopy(msg.chatbot_response, `${msg.id}-bot`)}
                title="Copy response"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                </svg>
              </button>
            </div>

            {/* Message Statistics */}
            <div className="message-stats-compact">
              <div className="stat-item-simple">
                <span className="stat-number">{msg.user_input.length}</span>
                <span className="stat-arrow">→</span>
                <span className="stat-number highlight">{msg.chatbot_response.length}</span>
                <span className="stat-name">characters</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item-simple">
                <span className="stat-number">{msg.user_input.split(/\s+/).filter(w => w).length}</span>
                <span className="stat-arrow">→</span>
                <span className="stat-number highlight">{msg.chatbot_response.split(/\s+/).filter(w => w).length}</span>
                <span className="stat-name">words</span>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="loading-indicator">
            <div className="spinner-small"></div>
            <p>Processing audio and generating response...</p>
          </div>
        )}
      </div>
    </div>
  )
}

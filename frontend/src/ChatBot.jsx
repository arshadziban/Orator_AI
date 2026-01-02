import React, { useState, useRef } from 'react'
import AudioRecorder from './components/AudioRecorder'
import FormattedOutput from './components/FormattedOutput'
import './styles/ChatBot.css'

/**
 * ChatBot Component
 * 
 * Main chatbot interface with audio transcription capability.
 * Users can record or upload audio which is transcribed to text
 * and processed by the AI chatbot for intelligent responses.
 */
export default function ChatBot() {
  const [isLoading, setIsLoading] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [error, setError] = useState(null)

  const handleTranscribe = async (audioBlob) => {
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', audioBlob, 'audio.wav')

      const response = await fetch('http://localhost:8000/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      setChatMessages([...chatMessages, {
        id: Date.now(),
        type: 'message',
        user_input: data.transcribed_text,
        chatbot_response: data.chatbot_response,
        timestamp: new Date().toLocaleTimeString()
      }])
    } catch (err) {
      setError(err.message || 'Failed to transcribe audio')
      console.error('Transcription error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('http://localhost:8000/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      setChatMessages([...chatMessages, {
        id: Date.now(),
        type: 'message',
        user_input: data.transcribed_text,
        chatbot_response: data.chatbot_response,
        timestamp: new Date().toLocaleTimeString()
      }])
    } catch (err) {
      setError(err.message || 'Failed to transcribe audio')
      console.error('Transcription error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setChatMessages([])
    setError(null)
  }

  return (
    <div className="chatbot-container">
      <header className="chatbot-header">
        <div className="header-content">
          <div className="header-branding">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1v22M4.22 4.22l15.56 15.56M19.78 4.22L4.22 19.78" />
              </svg>
            </div>
            <div className="header-text">
              <h1>OratorAI</h1>
              <p>AI-Powered Conversational Chatbot with Audio Transcription</p>
            </div>
          </div>
        </div>
      </header>

      <main className="chatbot-main">
        <div className="content-wrapper">
          <div className="chat-layout">
            {/* Chat history area */}
            <FormattedOutput
              messages={chatMessages}
              onClear={handleClear}
              isLoading={isLoading}
            />

            {/* Input area - Hidden */}
            <div className="input-section" style={{ display: 'none' }}>
              <div className="input-card">
                <h2>Record Audio</h2>
              

                <AudioRecorder
                  onTranscribe={handleTranscribe}
                  isLoading={isLoading}
                />

                {isLoading && (
                  <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Processing audio and generating response...</p>
                  </div>
                )}

                {error && (
                  <div className="error-message">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <div>
                      <strong>Error</strong>
                      <p>{error}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="chatbot-footer">
        <div className="footer-content">
          <p>&copy; 2024 OratorAI. Intelligent Chatbot with Voice Input.</p>
          <div className="footer-mic">
            <AudioRecorder
              onTranscribe={handleTranscribe}
              isLoading={isLoading}
            />
            {isLoading && <p className="recording-status">Processing...</p>}
            {error && <p className="error-status">{error}</p>}
          </div>
        </div>
      </footer>
    </div>
  )
}

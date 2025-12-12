import React, { useState, useRef, useEffect } from 'react';

export default function AIFitnessCoach() {
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      text: "Namaste! 🏋️‍♂️ I'm your AI Fitness Coach! Ask me anything about fitness, workouts, nutrition, or motivation. I'm here to help you achieve your fitness goals! 💪✨",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);
    
    // Add user message
    setMessages(prev => [...prev, {
      type: 'user',
      text: userMessage,
      timestamp: new Date().toISOString()
    }]);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/ai/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessages(prev => [...prev, {
          type: 'ai',
          text: data.response,
          timestamp: data.timestamp
        }]);
      } else {
        setMessages(prev => [...prev, {
          type: 'ai',
          text: `Sorry, I'm having trouble right now. Please try again later. Error: ${data.error}`,
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        type: 'ai',
        text: 'Sorry, I\'m having trouble connecting. Please check your internet connection and try again.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0b0f14 0%, #131a22 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#121821',
        borderRadius: '16px',
        border: '1px solid #1f2731',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(90deg, rgba(255,255,255,.05), rgba(255,255,255,.02))',
          padding: '24px',
          textAlign: 'center',
          borderBottom: '1px solid #1f2731'
        }}>
          <h1 style={{
            margin: '0 0 8px 0',
            color: 'white',
            fontSize: '32px',
            fontWeight: '800',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
          }}>
            🤖 AI Fitness Coach
          </h1>
          <p style={{
            margin: 0,
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '16px',
            fontWeight: '500'
          }}>
            Your personal AI trainer for fitness, nutrition, and motivation! 💪✨
          </p>
        </div>

        {/* Chat Header */}
        <div style={{
          background: 'rgba(17,21,27,.88)',
          borderBottom: '1px solid #1f2731',
          padding: '16px',
          textAlign: 'center'
        }}>
          <h3 style={{
            margin: 0,
            color: 'white',
            fontSize: '20px',
            fontWeight: '600'
          }}>
            💬 Chat with Your AI Fitness Coach
          </h3>
        </div>

        {/* Chat Content */}
        <div style={{ padding: '24px', minHeight: '500px' }}>
          <div style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              marginBottom: '20px',
              padding: '16px',
              background: '#0f141b',
              borderRadius: '8px',
              border: '1px solid #334155'
            }}>
              {messages.map((msg, index) => (
                <div key={index} style={{
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start'
                }}>
                                     <div style={{
                     maxWidth: '70%',
                     padding: '12px 16px',
                     borderRadius: '18px',
                     background: msg.type === 'user' 
                       ? '#0ea5e9'
                       : '#1f2937',
                     color: msg.type === 'user' ? 'white' : '#e5e7eb',
                     border: msg.type === 'ai' ? '1px solid #374151' : 'none',
                     boxShadow: msg.type === 'user' ? '0 4px 15px rgba(14, 165, 233, 0.4)' : '0 4px 15px rgba(0, 0, 0, 0.1)',
                     wordWrap: 'break-word',
                     whiteSpace: 'pre-wrap'
                   }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  marginBottom: '16px'
                }}>
                                     <div style={{
                     padding: '12px 16px',
                     borderRadius: '18px',
                     background: '#1f2937',
                     color: '#e5e7eb',
                     border: '1px solid #374151',
                     display: 'flex',
                     alignItems: 'center',
                     gap: '8px'
                   }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <span>AI Coach is typing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-end'
            }}>
                               <textarea
                   value={inputMessage}
                   onChange={(e) => setInputMessage(e.target.value)}
                   onKeyPress={handleKeyPress}
                   placeholder="Ask your AI Fitness Coach anything... 💪"
                   style={{
                     flex: 1,
                     padding: '16px',
                     borderRadius: '25px',
                     border: '1px solid #334155',
                     background: '#0f141b',
                     color: '#e5e7eb',
                     fontSize: '16px',
                     resize: 'none',
                     minHeight: '50px',
                     maxHeight: '120px',
                     outline: 'none',
                     fontFamily: 'inherit'
                   }}
                 />
                               <button
                   onClick={sendMessage}
                   disabled={isLoading || !inputMessage.trim()}
                   style={{
                     padding: '16px 24px',
                     borderRadius: '25px',
                     border: 'none',
                     background: '#f59e0b',
                     color: '#0b0f14',
                     fontSize: '16px',
                     fontWeight: '600',
                     cursor: isLoading || !inputMessage.trim() ? 'not-allowed' : 'pointer',
                     opacity: isLoading || !inputMessage.trim() ? 0.6 : 1,
                     transition: 'all 0.3s ease',
                     boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)'
                   }}
                                   onMouseOver={(e) => {
                     if (!isLoading && inputMessage.trim()) {
                       e.target.style.transform = 'translateY(-2px)';
                       e.target.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.6)';
                     }
                   }}
                   onMouseOut={(e) => {
                     e.target.style.transform = 'translateY(0)';
                     e.target.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.4)';
                   }}
              >
                {isLoading ? '⏳' : '🚀'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for loading animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

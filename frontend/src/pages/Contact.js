import { useState } from "react";

export default function Contact(){
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitStatus({
        type: 'error',
        message: 'Please fill in all fields!'
      });
      return;
    }

    if (!formData.email.includes('@')) {
      setSubmitStatus({
        type: 'error',
        message: 'Please enter a valid email address!'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate form submission (you can replace this with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitStatus({
        type: 'success',
        message: 'Message sent successfully! We\'ll get back to you soon.'
      });
      
      // Clear form
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      message: ''
    });
    setSubmitStatus(null);
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #0b0f14 0%, #131a22 100%)',
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        background: '#121821',
        borderRadius: '16px',
        border: '1px solid #1f2731',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: 'linear-gradient(90deg, rgba(255,255,255,.05), rgba(255,255,255,.02))',
          padding: '32px',
          borderBottom: '1px solid #1f2731'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '800',
            color: 'white',
            margin: '0 0 16px 0',
            textAlign: 'center',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
          }}>
            📞 Contact Us
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#e2e8f0',
            textAlign: 'center',
            margin: '0',
            lineHeight: '1.6'
          }}>
            We'd love to hear from you. Drop a message and our team will respond quickly.
          </p>
        </div>

        <div style={{padding: '32px'}}>
          <form onSubmit={handleSubmit} style={{
            maxWidth: '640px',
            margin: '0 auto',
            display: 'grid',
            gap: '20px'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '8px'
              }}>
                Your Name *
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input"
                placeholder="Enter your full name"
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '16px',
                  border: '2px solid #334155',
                  borderRadius: '12px',
                  background: '#0f141b',
                  color: 'white',
                  transition: 'all 0.3s ease'
                }}
                required
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '8px'
              }}>
                Email Address *
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input"
                placeholder="Enter your email address"
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '16px',
                  border: '2px solid #334155',
                  borderRadius: '12px',
                  background: '#0f141b',
                  color: 'white',
                  transition: 'all 0.3s ease'
                }}
                required
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '8px'
              }}>
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="input"
                placeholder="Tell us how we can help you..."
                rows={6}
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '16px',
                  border: '2px solid #334155',
                  borderRadius: '12px',
                  background: '#0f141b',
                  color: 'white',
                  resize: 'vertical',
                  transition: 'all 0.3s ease',
                  fontFamily: 'inherit'
                }}
                required
              />
            </div>

            {/* Status Messages */}
            {submitStatus && (
              <div style={{
                padding: '16px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                textAlign: 'center',
                background: submitStatus.type === 'success' 
                  ? 'rgba(34, 197, 94, 0.1)' 
                  : 'rgba(239, 68, 68, 0.1)',
                border: `2px solid ${
                  submitStatus.type === 'success' 
                    ? 'rgba(34, 197, 94, 0.3)' 
                    : 'rgba(239, 68, 68, 0.3)'
                }`,
                color: submitStatus.type === 'success' ? '#22c55e' : '#ef4444'
              }}>
                {submitStatus.message}
              </div>
            )}

            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              marginTop: '20px'
            }}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '16px 32px',
                  fontSize: '16px',
                  fontWeight: '700',
                  background: isSubmitting 
                    ? '#64748b' 
                    : 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isSubmitting 
                    ? 'none' 
                    : '0 4px 15px rgba(14, 165, 233, 0.4)',
                  minWidth: '140px'
                }}
              >
                {isSubmitting ? '⏳ Sending...' : '📤 Send Message'}
              </button>
              
              <button
                type="button"
                onClick={handleReset}
                disabled={isSubmitting}
                style={{
                  padding: '16px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  background: 'transparent',
                  color: '#e2e8f0',
                  border: '2px solid #334155',
                  borderRadius: '12px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  minWidth: '140px'
                }}
              >
                🗑️ Clear Form
              </button>
            </div>
          </form>

          <div style={{
            marginTop: '40px',
            padding: '32px',
            background: '#0f141b',
            borderRadius: '16px',
            border: '1px solid #334155'
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: 'white',
              margin: '0 0 24px 0',
              textAlign: 'center'
            }}>
              📍 Other Ways to Reach Us
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px'
            }}>
              <div style={{
                textAlign: 'center',
                padding: '24px',
                background: 'rgba(255,255,255,.02)',
                borderRadius: '12px',
                border: '1px solid #334155'
              }}>
                <div style={{
                  fontSize: '32px',
                  marginBottom: '16px'
                }}>
                  📧
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '8px'
                }}>
                  Email Support
                </div>
                <div style={{
                  color: '#0ea5e9',
                  fontSize: '16px',
                  fontWeight: '500'
                }}>
                  support@musclemate.fit
                </div>
              </div>

              <div style={{
                textAlign: 'center',
                padding: '24px',
                background: 'rgba(255,255,255,.02)',
                borderRadius: '12px',
                border: '1px solid #334155'
              }}>
                <div style={{
                  fontSize: '32px',
                  marginBottom: '16px'
                }}>
                  📞
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '8px'
                }}>
                  Phone Support
                </div>
                <div style={{
                  color: '#0ea5e9',
                  fontSize: '16px',
                  fontWeight: '500'
                }}>
                  +91 99999 99999
                </div>
              </div>

              <div style={{
                textAlign: 'center',
                padding: '24px',
                background: 'rgba(255,255,255,.02)',
                borderRadius: '12px',
                border: '1px solid #334155'
              }}>
                <div style={{
                  fontSize: '32px',
                  marginBottom: '16px'
                }}>
                  ⏰
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '8px'
                }}>
                  Response Time
                </div>
                <div style={{
                  color: '#22c55e',
                  fontSize: '16px',
                  fontWeight: '500'
                }}>
                  Within 24 hours
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



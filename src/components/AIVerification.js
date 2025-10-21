import { useState } from 'react';
import { Bot, CheckCircle, XCircle, Clock, AlertCircle, Sparkles } from 'lucide-react';

const AIVerification = ({ task, attachments, onVerify, onClose }) => {
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [userNotes, setUserNotes] = useState('');

  const handleVerify = async () => {
    setVerifying(true);
    
    // Simulate AI verification process
    setTimeout(() => {
      // Mock AI verification result
      const mockResult = {
        status: Math.random() > 0.3 ? 'verified' : 'needs_review',
        confidence: Math.floor(Math.random() * 30) + 70,
        feedback: Math.random() > 0.3 
          ? 'Task completion verified successfully. All requirements met.'
          : 'Please provide additional details or evidence of task completion.',
        suggestions: [
          'Great work on completing this task!',
          'Consider adding more detailed notes for future reference.',
          'The attached screenshots clearly show progress.'
        ],
        verifiedAt: new Date()
      };
      
      setVerificationResult(mockResult);
      setVerifying(false);
      
      if (mockResult.status === 'verified') {
        setTimeout(() => {
          onVerify(mockResult);
        }, 2000);
      }
    }, 3000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle size={48} style={{ color: 'var(--success)' }} />;
      case 'needs_review':
        return <AlertCircle size={48} style={{ color: 'var(--warning)' }} />;
      case 'rejected':
        return <XCircle size={48} style={{ color: 'var(--error)' }} />;
      default:
        return <Clock size={48} style={{ color: 'var(--accent)' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'var(--success)';
      case 'needs_review': return 'var(--warning)';
      case 'rejected': return 'var(--error)';
      default: return 'var(--accent)';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1500
    }}>
      <div style={{
        background: 'var(--cardBg)',
        padding: '30px',
        borderRadius: '12px',
        maxWidth: '500px',
        width: '90%',
        border: '2px solid var(--border)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <div style={{ marginBottom: '15px' }}>
            {verifying ? (
              <div style={{ display: 'inline-block', animation: 'spin 2s linear infinite' }}>
                <Bot size={48} style={{ color: 'var(--accent)' }} />
              </div>
            ) : verificationResult ? (
              getStatusIcon(verificationResult.status)
            ) : (
              <Sparkles size={48} style={{ color: 'var(--accent)' }} />
            )}
          </div>
          
          <h3 style={{ margin: '0 0 10px 0', color: 'var(--textPrimary)' }}>
            {verifying ? 'AI Verification in Progress...' : 
             verificationResult ? 'Verification Complete' : 
             'AI Task Verification'}
          </h3>
          
          <p style={{ margin: 0, color: 'var(--textSecondary)', fontSize: '14px' }}>
            {verifying ? 'Analyzing task completion and attachments' :
             verificationResult ? `Status: ${verificationResult.status.replace('_', ' ').toUpperCase()}` :
             'Submit your task for AI-powered verification'}
          </p>
        </div>

        {!verificationResult && !verifying && (
          <>
            <div style={{
              background: 'var(--border)',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '20px'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: 'var(--textPrimary)', fontSize: '14px' }}>
                Task: {task.title}
              </h4>
              <div style={{ fontSize: '12px', color: 'var(--textSecondary)' }}>
                <div>Attachments: {attachments.length} file(s)</div>
                <div>Priority: {task.priority || 'medium'}</div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--textPrimary)', fontSize: '14px', fontWeight: '500' }}>
                Additional Notes (Optional)
              </label>
              <textarea
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="Describe what you accomplished..."
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid var(--border)',
                  borderRadius: '6px',
                  minHeight: '80px',
                  resize: 'vertical',
                  color: 'var(--textPrimary)',
                  background: 'var(--cardBg)'
                }}
              />
            </div>

            <div style={{
              background: 'rgba(255, 138, 101, 0.1)',
              border: '1px solid var(--accent)',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '20px',
              fontSize: '12px',
              color: 'var(--textPrimary)'
            }}>
              <strong>💡 Tip:</strong> Include clear screenshots, detailed notes, or progress reports for better verification results.
            </div>
          </>
        )}

        {verifying && (
          <div style={{
            background: 'var(--border)',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            <div style={{ marginBottom: '15px' }}>
              <div style={{
                width: '100%',
                height: '8px',
                background: 'var(--cardBg)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '70%',
                  height: '100%',
                  background: 'var(--accent)',
                  animation: 'progress 2s ease-in-out infinite'
                }} />
              </div>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--textSecondary)' }}>
              Analyzing task requirements and submitted evidence...
            </div>
          </div>
        )}

        {verificationResult && (
          <div style={{
            background: `rgba(${verificationResult.status === 'verified' ? '76, 175, 80' : '255, 152, 0'}, 0.1)`,
            border: `2px solid ${getStatusColor(verificationResult.status)}`,
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--textPrimary)', marginBottom: '5px' }}>
                AI Confidence: {verificationResult.confidence}%
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: 'var(--cardBg)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${verificationResult.confidence}%`,
                  height: '100%',
                  background: getStatusColor(verificationResult.status),
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--textPrimary)', marginBottom: '8px' }}>
                Feedback:
              </div>
              <div style={{ fontSize: '13px', color: 'var(--textSecondary)' }}>
                {verificationResult.feedback}
              </div>
            </div>

            {verificationResult.suggestions && verificationResult.suggestions.length > 0 && (
              <div>
                <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--textPrimary)', marginBottom: '8px' }}>
                  Suggestions:
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: 'var(--textSecondary)' }}>
                  {verificationResult.suggestions.map((suggestion, index) => (
                    <li key={index} style={{ marginBottom: '4px' }}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          {!verificationResult && !verifying && (
            <>
              <button
                onClick={handleVerify}
                disabled={attachments.length === 0}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: attachments.length === 0 ? '#ccc' : 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: attachments.length === 0 ? 'not-allowed' : 'pointer',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Bot size={18} />
                Verify with AI
              </button>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#ccc',
                  color: 'var(--textPrimary)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </>
          )}

          {verificationResult && (
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                background: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              {verificationResult.status === 'verified' ? 'Done' : 'Close'}
            </button>
          )}
        </div>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(400%); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default AIVerification;
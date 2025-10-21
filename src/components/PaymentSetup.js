import { useState } from 'react';
import { CreditCard, Shield, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

const PaymentSetup = ({ userId, onClose, onLinked }) => {
  const [step, setStep] = useState(1);
  const [paymentData, setPaymentData] = useState({
    email: '',
    accountType: 'paylites',
    agreedToTerms: false
  });
  const [linking, setLinking] = useState(false);
  const [linkStatus, setLinkStatus] = useState(null);

  const handleLinkAccount = async () => {
    if (!paymentData.email || !paymentData.agreedToTerms) {
      return;
    }

    setLinking(true);
    
    // Simulate payment platform API call
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate for demo
      
      if (success) {
        setLinkStatus({
          success: true,
          message: 'Payment account linked successfully!',
          accountId: 'PAY_' + Math.random().toString(36).substr(2, 9).toUpperCase()
        });
        onLinked({
          paymentEmail: paymentData.email,
          paymentProvider: paymentData.accountType,
          linkedAt: new Date()
        });
      } else {
        setLinkStatus({
          success: false,
          message: 'Failed to link account. Please try again or contact support.'
        });
      }
      
      setLinking(false);
    }, 2000);
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
      zIndex: 1000
    }}>
      <div style={{
        background: 'var(--cardBg)',
        padding: '30px',
        borderRadius: '12px',
        maxWidth: '500px',
        width: '90%',
        border: '2px solid var(--border)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h2 style={{ margin: 0, color: 'var(--textPrimary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CreditCard size={24} style={{ color: 'var(--accent)' }} />
            Payment Setup
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: 'var(--textSecondary)'
            }}
          >
            ×
          </button>
        </div>

        {!linkStatus && (
          <>
            {/* Step Indicator */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', gap: '10px' }}>
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: step >= s ? 'var(--accent)' : 'var(--border)',
                    color: step >= s ? 'white' : 'var(--textSecondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {s}
                </div>
              ))}
            </div>

            {step === 1 && (
              <div>
                <h3 style={{ color: 'var(--textPrimary)', marginBottom: '15px' }}>Choose Payment Provider</h3>
                <p style={{ color: 'var(--textSecondary)', fontSize: '14px', marginBottom: '20px' }}>
                  Link your payment account to participate in challenges and earn rewards.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '15px',
                    border: `2px solid ${paymentData.accountType === 'paylites' ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: paymentData.accountType === 'paylites' ? 'rgba(255, 138, 101, 0.1)' : 'transparent'
                  }}>
                    <input
                      type="radio"
                      name="accountType"
                      value="paylites"
                      checked={paymentData.accountType === 'paylites'}
                      onChange={(e) => setPaymentData({ ...paymentData, accountType: e.target.value })}
                      style={{ marginRight: '12px', width: '18px', height: '18px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500', color: 'var(--textPrimary)' }}>Paylites</div>
                      <div style={{ fontSize: '12px', color: 'var(--textSecondary)' }}>Fast and secure payments</div>
                    </div>
                    <Shield size={20} style={{ color: 'var(--success)' }} />
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '15px',
                    border: `2px solid ${paymentData.accountType === 'paypal' ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: paymentData.accountType === 'paypal' ? 'rgba(255, 138, 101, 0.1)' : 'transparent'
                  }}>
                    <input
                      type="radio"
                      name="accountType"
                      value="paypal"
                      checked={paymentData.accountType === 'paypal'}
                      onChange={(e) => setPaymentData({ ...paymentData, accountType: e.target.value })}
                      style={{ marginRight: '12px', width: '18px', height: '18px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500', color: 'var(--textPrimary)' }}>PayPal</div>
                      <div style={{ fontSize: '12px', color: 'var(--textSecondary)' }}>Widely accepted worldwide</div>
                    </div>
                    <Shield size={20} style={{ color: 'var(--success)' }} />
                  </label>
                </div>

                <button
                  onClick={() => setStep(2)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--accent)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Continue
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 style={{ color: 'var(--textPrimary)', marginBottom: '15px' }}>Enter Account Details</h3>
                <p style={{ color: 'var(--textSecondary)', fontSize: '14px', marginBottom: '20px' }}>
                  Provide your {paymentData.accountType} email address to link your account.
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--textPrimary)', fontWeight: '500' }}>
                    {paymentData.accountType === 'paylites' ? 'Paylites' : 'PayPal'} Email
                  </label>
                  <input
                    type="email"
                    value={paymentData.email}
                    onChange={(e) => setPaymentData({ ...paymentData, email: e.target.value })}
                    placeholder="your@email.com"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid var(--border)',
                      borderRadius: '6px',
                      color: 'var(--textPrimary)',
                      background: 'var(--cardBg)'
                    }}
                  />
                </div>

                <div style={{
                  background: 'rgba(255, 152, 0, 0.1)',
                  border: '1px solid var(--warning)',
                  borderRadius: '6px',
                  padding: '12px',
                  marginBottom: '20px',
                  fontSize: '12px',
                  color: 'var(--textPrimary)'
                }}>
                  <strong>🔒 Security Note:</strong> Your payment information is encrypted and secure. We never store your payment credentials.
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setStep(1)}
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
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!paymentData.email}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: paymentData.email ? 'var(--accent)' : '#ccc',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: paymentData.email ? 'pointer' : 'not-allowed',
                      fontWeight: '500'
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 style={{ color: 'var(--textPrimary)', marginBottom: '15px' }}>Review & Confirm</h3>
                
                <div style={{
                  background: 'var(--border)',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '20px'
                }}>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--textSecondary)', marginBottom: '4px' }}>Provider</div>
                    <div style={{ fontWeight: '500', color: 'var(--textPrimary)' }}>
                      {paymentData.accountType === 'paylites' ? 'Paylites' : 'PayPal'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--textSecondary)', marginBottom: '4px' }}>Email</div>
                    <div style={{ fontWeight: '500', color: 'var(--textPrimary)' }}>{paymentData.email}</div>
                  </div>
                </div>

                <label style={{
                  display: 'flex',
                  alignItems: 'start',
                  gap: '10px',
                  marginBottom: '20px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={paymentData.agreedToTerms}
                    onChange={(e) => setPaymentData({ ...paymentData, agreedToTerms: e.target.checked })}
                    style={{ marginTop: '3px', width: '18px', height: '18px' }}
                  />
                  <span style={{ fontSize: '13px', color: 'var(--textPrimary)' }}>
                    I agree to the{' '}
                    <a href="#" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                      Privacy Policy
                    </a>
                  </span>
                </label>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setStep(2)}
                    disabled={linking}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#ccc',
                      color: 'var(--textPrimary)',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: linking ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleLinkAccount}
                    disabled={!paymentData.agreedToTerms || linking}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: (!paymentData.agreedToTerms || linking) ? '#ccc' : 'var(--success)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: (!paymentData.agreedToTerms || linking) ? 'not-allowed' : 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    {linking ? 'Linking...' : 'Link Account'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {linkStatus && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '20px' }}>
              {linkStatus.success ? (
                <CheckCircle size={64} style={{ color: 'var(--success)' }} />
              ) : (
                <AlertCircle size={64} style={{ color: 'var(--error)' }} />
              )}
            </div>
            
            <h3 style={{ color: 'var(--textPrimary)', marginBottom: '10px' }}>
              {linkStatus.success ? 'Account Linked!' : 'Link Failed'}
            </h3>
            
            <p style={{ color: 'var(--textSecondary)', marginBottom: '20px' }}>
              {linkStatus.message}
            </p>

            {linkStatus.success && (
              <div style={{
                background: 'rgba(76, 175, 80, 0.1)',
                border: '1px solid var(--success)',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '20px',
                fontSize: '13px'
              }}>
                <div style={{ fontWeight: '500', marginBottom: '5px' }}>Account ID</div>
                <div style={{ fontFamily: 'monospace', color: 'var(--textSecondary)' }}>
                  {linkStatus.accountId}
                </div>
              </div>
            )}

            <button
              onClick={linkStatus.success ? onClose : () => setLinkStatus(null)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              {linkStatus.success ? 'Done' : 'Try Again'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSetup;
import { useState, useEffect } from 'react';
import { User, Mail, CreditCard, Settings, Upload, Camera } from 'lucide-react';

const UserProfile = ({ user, onClose, onSave }) => {
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    bio: '',
    profilePicture: user?.photoURL || '',
    preferences: {
      emailNotifications: true,
      pushNotifications: true,
      weeklyReport: true
    },
    paymentLinked: false,
    paymentEmail: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(profileData.profilePicture);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setProfileData({ ...profileData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(profileData);
    setIsEditing(false);
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
        maxHeight: '90vh',
        overflowY: 'auto',
        border: '2px solid var(--border)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: 'var(--textPrimary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={24} style={{ color: 'var(--accent)' }} />
            User Profile
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

        {/* Profile Picture */}
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: imagePreview ? `url(${imagePreview})` : 'var(--accent)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              color: 'white',
              fontWeight: 'bold',
              border: '4px solid var(--border)'
            }}>
              {!imagePreview && (profileData.displayName?.charAt(0) || user?.email?.charAt(0) || 'U')}
            </div>
            {isEditing && (
              <label style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                background: 'var(--accent)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '2px solid white'
              }}>
                <Camera size={18} color="white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>
        </div>

        {/* Profile Information */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--textPrimary)', fontWeight: '500' }}>
            Display Name
          </label>
          <input
            type="text"
            value={profileData.displayName}
            onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
            disabled={!isEditing}
            style={{
              width: '100%',
              padding: '10px',
              border: '2px solid var(--border)',
              borderRadius: '6px',
              background: isEditing ? 'var(--cardBg)' : 'var(--border)',
              color: 'var(--textPrimary)'
            }}
            placeholder="Enter your name"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--textPrimary)', fontWeight: '500' }}>
            <Mail size={16} style={{ display: 'inline', marginRight: '5px' }} />
            Email
          </label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            style={{
              width: '100%',
              padding: '10px',
              border: '2px solid var(--border)',
              borderRadius: '6px',
              background: 'var(--border)',
              color: 'var(--textSecondary)'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--textPrimary)', fontWeight: '500' }}>
            Bio
          </label>
          <textarea
            value={profileData.bio}
            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            disabled={!isEditing}
            style={{
              width: '100%',
              padding: '10px',
              border: '2px solid var(--border)',
              borderRadius: '6px',
              background: isEditing ? 'var(--cardBg)' : 'var(--border)',
              color: 'var(--textPrimary)',
              minHeight: '80px',
              resize: 'vertical'
            }}
            placeholder="Tell us about yourself..."
          />
        </div>

        {/* Payment Status */}
        <div style={{
          background: profileData.paymentLinked ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)',
          border: `2px solid ${profileData.paymentLinked ? 'var(--success)' : 'var(--warning)'}`,
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <CreditCard size={20} style={{ color: profileData.paymentLinked ? 'var(--success)' : 'var(--warning)' }} />
            <span style={{ fontWeight: '500', color: 'var(--textPrimary)' }}>
              Payment Account
            </span>
            <span style={{
              marginLeft: 'auto',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              background: profileData.paymentLinked ? 'var(--success)' : 'var(--warning)',
              color: 'white',
              fontWeight: '500'
            }}>
              {profileData.paymentLinked ? 'Linked' : 'Not Linked'}
            </span>
          </div>
          {profileData.paymentLinked ? (
            <div style={{ fontSize: '14px', color: 'var(--textSecondary)' }}>
              {profileData.paymentEmail}
            </div>
          ) : (
            <button
              onClick={() => {/* Payment linking logic */}}
              style={{
                width: '100%',
                padding: '8px',
                background: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Link Payment Account
            </button>
          )}
        </div>

        {/* Preferences */}
        <div style={{
          background: 'var(--border)',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <Settings size={20} style={{ color: 'var(--accent)' }} />
            <span style={{ fontWeight: '500', color: 'var(--textPrimary)' }}>Preferences</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={profileData.preferences.emailNotifications}
                onChange={(e) => setProfileData({
                  ...profileData,
                  preferences: { ...profileData.preferences, emailNotifications: e.target.checked }
                })}
                disabled={!isEditing}
                style={{ width: '18px', height: '18px' }}
              />
              <span style={{ fontSize: '14px', color: 'var(--textPrimary)' }}>Email Notifications</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={profileData.preferences.pushNotifications}
                onChange={(e) => setProfileData({
                  ...profileData,
                  preferences: { ...profileData.preferences, pushNotifications: e.target.checked }
                })}
                disabled={!isEditing}
                style={{ width: '18px', height: '18px' }}
              />
              <span style={{ fontSize: '14px', color: 'var(--textPrimary)' }}>Push Notifications</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={profileData.preferences.weeklyReport}
                onChange={(e) => setProfileData({
                  ...profileData,
                  preferences: { ...profileData.preferences, weeklyReport: e.target.checked }
                })}
                disabled={!isEditing}
                style={{ width: '18px', height: '18px' }}
              />
              <span style={{ fontSize: '14px', color: 'var(--textPrimary)' }}>Weekly Progress Report</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
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
                Edit Profile
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
                Close
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'var(--success)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setImagePreview(profileData.profilePicture);
                }}
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
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
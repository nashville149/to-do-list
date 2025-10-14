import React from 'react';
import { useCalendarIntegration } from '../hooks/useCalendarIntegration';

const CalendarIntegration = ({ task, onClose }) => {
  const {
    isGoogleCalendarConnected,
    connectGoogleCalendar,
    disconnectGoogleCalendar,
    createCalendarEvent,
    downloadICSFile,
    getOutlookURL,
    getGoogleCalendarURL
  } = useCalendarIntegration();

  const handleGoogleCalendarSync = async () => {
    if (!isGoogleCalendarConnected) {
      const connected = await connectGoogleCalendar();
      if (!connected) return;
    }
    
    const eventId = await createCalendarEvent(task);
    if (eventId) {
      alert('Task added to Google Calendar!');
      onClose();
    } else {
      alert('Failed to add task to Google Calendar');
    }
  };

  const handleOutlookSync = () => {
    window.open(getOutlookURL(task), '_blank');
    onClose();
  };

  const handleGoogleCalendarWeb = () => {
    window.open(getGoogleCalendarURL(task), '_blank');
    onClose();
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
        background: '#FFF8F5', 
        padding: '30px', 
        borderRadius: '12px', 
        width: '400px',
        border: '2px solid #FFCCBC'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>📅 Add to Calendar</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ marginBottom: '15px', padding: '10px', background: '#f9f9f9', borderRadius: '4px' }}>
          <strong>{task.title}</strong>
          <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
            Duration: {task.duration} minutes
            {task.dueDate && (
              <div>Due: {new Date(task.dueDate.toDate()).toLocaleString()}</div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={handleGoogleCalendarSync}
            style={{
              padding: '12px 20px',
              background: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            📅 {isGoogleCalendarConnected ? 'Add to Google Calendar (API)' : 'Connect Google Calendar'}
          </button>

          <button
            onClick={handleGoogleCalendarWeb}
            style={{
              padding: '12px 20px',
              background: '#34a853',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            🌐 Open in Google Calendar
          </button>

          <button
            onClick={handleOutlookSync}
            style={{
              padding: '12px 20px',
              background: '#0078d4',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            📧 Open in Outlook Calendar
          </button>

          <button
            onClick={() => downloadICSFile(task)}
            style={{
              padding: '12px 20px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            💾 Download .ics File (Universal)
          </button>
        </div>

        <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
          <p>• Google Calendar API requires setup with your API keys</p>
          <p>• Web links work with any calendar app</p>
          <p>• .ics files work with all calendar applications</p>
        </div>
      </div>
    </div>
  );
};

export default CalendarIntegration;
import { useState, useEffect } from 'react';

export const useCalendarIntegration = () => {
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(false);
  const [gapi, setGapi] = useState(null);

  useEffect(() => {
    // Load Google Calendar API
    const loadGoogleAPI = () => {
      if (window.gapi) {
        window.gapi.load('client:auth2', initializeGapi);
      } else {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => window.gapi.load('client:auth2', initializeGapi);
        document.body.appendChild(script);
      }
    };

    const initializeGapi = async () => {
      await window.gapi.client.init({
        apiKey: 'YOUR_GOOGLE_API_KEY', // Replace with your API key
        clientId: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your client ID
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar'
      });
      setGapi(window.gapi);
    };

    loadGoogleAPI();
  }, []);

  const connectGoogleCalendar = async () => {
    if (!gapi) return false;
    
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      await authInstance.signIn();
      setIsGoogleCalendarConnected(true);
      return true;
    } catch (error) {
      console.error('Google Calendar connection failed:', error);
      return false;
    }
  };

  const disconnectGoogleCalendar = () => {
    if (gapi) {
      const authInstance = gapi.auth2.getAuthInstance();
      authInstance.signOut();
      setIsGoogleCalendarConnected(false);
    }
  };

  const createCalendarEvent = async (task) => {
    if (!gapi || !isGoogleCalendarConnected) return null;

    const event = {
      summary: task.title,
      description: task.notes || `Task: ${task.title}`,
      start: {
        dateTime: task.dueDate ? new Date(task.dueDate.toDate()).toISOString() : new Date().toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: task.dueDate ? 
          new Date(new Date(task.dueDate.toDate()).getTime() + (task.duration * 60000)).toISOString() :
          new Date(Date.now() + (task.duration * 60000)).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      reminders: {
        useDefault: false,
        overrides: task.reminderTime ? [
          { method: 'popup', minutes: Math.floor((new Date(task.dueDate?.toDate()) - new Date(task.reminderTime.toDate())) / 60000) }
        ] : []
      }
    };

    try {
      const response = await gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event
      });
      return response.result.id;
    } catch (error) {
      console.error('Failed to create calendar event:', error);
      return null;
    }
  };

  const generateICSFile = (task) => {
    const startDate = task.dueDate ? new Date(task.dueDate.toDate()) : new Date();
    const endDate = new Date(startDate.getTime() + (task.duration * 60000));
    
    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Productivity App//Task Event//EN
BEGIN:VEVENT
UID:${task.id}@productivityapp.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${task.title}
DESCRIPTION:${task.notes || `Task: ${task.title}`}
PRIORITY:${task.priority === 'high' ? '1' : task.priority === 'medium' ? '5' : '9'}
END:VEVENT
END:VCALENDAR`;

    return icsContent;
  };

  const downloadICSFile = (task) => {
    const icsContent = generateICSFile(task);
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${task.title.replace(/[^a-z0-9]/gi, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getOutlookURL = (task) => {
    const startDate = task.dueDate ? new Date(task.dueDate.toDate()) : new Date();
    const endDate = new Date(startDate.getTime() + (task.duration * 60000));
    
    const params = new URLSearchParams({
      subject: task.title,
      body: task.notes || `Task: ${task.title}`,
      startdt: startDate.toISOString(),
      enddt: endDate.toISOString()
    });

    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
  };

  const getGoogleCalendarURL = (task) => {
    const startDate = task.dueDate ? new Date(task.dueDate.toDate()) : new Date();
    const endDate = new Date(startDate.getTime() + (task.duration * 60000));
    
    const formatGoogleDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: task.title,
      dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
      details: task.notes || `Task: ${task.title}`,
      location: ''
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  return {
    isGoogleCalendarConnected,
    connectGoogleCalendar,
    disconnectGoogleCalendar,
    createCalendarEvent,
    downloadICSFile,
    getOutlookURL,
    getGoogleCalendarURL,
    generateICSFile
  };
};
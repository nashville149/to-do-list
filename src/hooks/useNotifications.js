import { useEffect } from 'react';

export const useNotifications = (tasks, user) => {
  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!tasks || !user) return;

    const checkReminders = () => {
      const now = new Date();
      
      tasks.forEach(task => {
        if (task.reminderTime && !task.reminderSent && !task.completed) {
          const reminderTime = new Date(task.reminderTime.toDate());
          
          // Check if reminder time has passed (within 1 minute window)
          if (now >= reminderTime && now - reminderTime < 60000) {
            sendNotification(task);
            // Mark reminder as sent (you'd update this in Firestore)
          }
        }
        
        // Check for overdue tasks
        if (task.dueDate && !task.completed) {
          const dueDate = new Date(task.dueDate.toDate());
          if (now > dueDate && task.status !== 'overdue') {
            sendOverdueNotification(task);
          }
        }
      });
    };

    // Check every minute
    const interval = setInterval(checkReminders, 60000);
    
    // Check immediately
    checkReminders();

    return () => clearInterval(interval);
  }, [tasks, user]);

  const sendNotification = (task) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Reminder: ${task.title}`, {
        body: `Time to work on: ${task.title}`,
        icon: '/favicon.ico',
        tag: `reminder-${task.id}`
      });
    }
    
    // Browser notification fallback
    if ('Notification' in window && Notification.permission !== 'granted') {
      alert(`Reminder: ${task.title}`);
    }
  };

  const sendOverdueNotification = (task) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Overdue: ${task.title}`, {
        body: `This task is now overdue!`,
        icon: '/favicon.ico',
        tag: `overdue-${task.id}`
      });
    }
  };

  const sendEmailReminder = async (task) => {
    // This would integrate with an email service like EmailJS or Firebase Functions
    console.log(`Email reminder would be sent for: ${task.title}`);
    
    // Example EmailJS integration (you'd need to set this up)
    /*
    try {
      await emailjs.send('service_id', 'template_id', {
        to_email: user.email,
        task_title: task.title,
        due_date: task.dueDate ? new Date(task.dueDate.toDate()).toLocaleString() : 'No due date'
      });
    } catch (error) {
      console.error('Failed to send email:', error);
    }
    */
  };

  return { sendNotification, sendEmailReminder };
};
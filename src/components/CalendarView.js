import React, { useState } from 'react';

const CalendarView = ({ tasks, onSelectTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getTasksForDate = (date) => {
    if (!date) return [];
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate.toDate());
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={() => navigateMonth(-1)} style={{ padding: '10px 15px' }}>← Prev</button>
        <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
        <button onClick={() => navigateMonth(1)} style={{ padding: '10px 15px' }}>Next →</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '10px' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} style={{ 
            padding: '10px', 
            textAlign: 'center', 
            fontWeight: 'bold',
            background: '#FFCCBC'
          }}>
            {day}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {days.map((date, index) => {
          const dayTasks = getTasksForDate(date);
          const isToday = date && date.toDateString() === new Date().toDateString();
          
          return (
            <div key={index} style={{
              minHeight: '100px',
              padding: '5px',
              border: '1px solid #FFCCBC',
              backgroundColor: date ? (isToday ? '#FFE0B2' : '#FFF8F5') : '#f5f5f5'
            }}>
              {date && (
                <>
                  <div style={{ fontWeight: isToday ? 'bold' : 'normal', marginBottom: '5px' }}>
                    {date.getDate()}
                  </div>
                  {dayTasks.map(task => (
                    <div key={task.id} 
                         onClick={() => onSelectTask(task.id)}
                         style={{
                           fontSize: '10px',
                           padding: '2px 4px',
                           margin: '1px 0',
                           backgroundColor: task.completed ? '#c8e6c9' : '#ffcdd2',
                           borderRadius: '3px',
                           cursor: 'pointer',
                           overflow: 'hidden',
                           textOverflow: 'ellipsis',
                           whiteSpace: 'nowrap'
                         }}>
                      {task.title}
                    </div>
                  ))}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
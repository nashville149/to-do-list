# Productivity Web App

A full-stack React + Firebase productivity app with to-do lists and Pomodoro timer.

## Features

- **Authentication**: Email/password login and registration
- **To-Do List**: Create, update, complete, and delete tasks
- **Pomodoro Timer**: 25-minute focus sessions with 5-minute breaks
- **Session Tracking**: All Pomodoro sessions saved to Firestore
- **Dashboard**: View total focus time and per-task statistics

## Firestore Schema

### Tasks Collection
```
tasks/{taskId}
├── title: string
├── completed: boolean
├── userId: string
└── createdAt: timestamp
```

### Pomodoro Sessions Collection
```
pomodoroSessions/{sessionId}
├── userId: string
├── taskId: string (optional)
├── startTime: timestamp
├── endTime: timestamp
├── duration: number (seconds)
├── type: "focus" | "break"
└── createdAt: timestamp
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure Firebase:
   - Create a Firebase project
   - Enable Authentication (Email/Password)
   - Enable Firestore
   - Update `src/firebase/config.js` with your config
   - Deploy `firestore.rules` to your Firebase project

3. Start the app:
```bash
npm start
```

## Security

Firestore rules ensure users can only access their own data:
- Tasks are filtered by `userId`
- Pomodoro sessions are filtered by `userId`
- All operations require authentication
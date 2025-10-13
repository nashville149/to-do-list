class TodoApp {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = 'all';
        this.editingTaskId = null;
        
        this.initializeElements();
        this.bindEvents();
        this.render();
    }

    initializeElements() {
        this.taskInput = document.getElementById('taskInput');
        this.taskDate = document.getElementById('taskDate');
        this.addBtn = document.getElementById('addBtn');
        this.taskList = document.getElementById('taskList');
        this.taskCount = document.getElementById('taskCount');
        this.emptyState = document.getElementById('emptyState');
        this.filterBtns = document.querySelectorAll('.filter-btn');
    }

    bindEvents() {
        this.addBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });
    }

    addTask() {
        const text = this.taskInput.value.trim();
        if (!text) return;

        const task = {
            id: Date.now(),
            text: text,
            status: 'incomplete', // incomplete, done, undone
            date: this.taskDate.value || null,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.render();
        
        this.taskInput.value = '';
        this.taskDate.value = '';
    }

    toggleTaskStatus(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        // Cycle through statuses: incomplete -> done -> undone -> incomplete
        switch(task.status) {
            case 'incomplete':
                task.status = 'done';
                break;
            case 'done':
                task.status = 'undone';
                break;
            case 'undone':
                task.status = 'incomplete';
                break;
        }

        this.saveTasks();
        this.render();
    }

    editTask(id) {
        this.editingTaskId = id;
        this.render();
    }

    saveEdit(id, newText) {
        const task = this.tasks.find(t => t.id === id);
        if (task && newText.trim()) {
            task.text = newText.trim();
            this.saveTasks();
        }
        this.editingTaskId = null;
        this.render();
    }

    cancelEdit() {
        this.editingTaskId = null;
        this.render();
    }

    deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.saveTasks();
            this.render();
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        this.render();
    }

    getFilteredTasks() {
        if (this.currentFilter === 'all') {
            return this.tasks;
        }
        return this.tasks.filter(task => task.status === this.currentFilter);
    }

    getStatusIcon(status) {
        switch(status) {
            case 'done': return '✅';
            case 'undone': return '❌';
            case 'incomplete': return '⬜';
            default: return '⬜';
        }
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.status}`;
        
        if (this.editingTaskId === task.id) {
            li.innerHTML = `
                <div class="task-status">${this.getStatusIcon(task.status)}</div>
                <input type="text" class="edit-input" value="${task.text}" id="edit-${task.id}">
                <div class="task-actions">
                    <button class="save-btn" onclick="app.saveEdit(${task.id}, document.getElementById('edit-${task.id}').value)">Save</button>
                    <button class="cancel-btn" onclick="app.cancelEdit()">Cancel</button>
                </div>
            `;
            
            // Focus the input after rendering
            setTimeout(() => {
                const input = document.getElementById(`edit-${task.id}`);
                if (input) {
                    input.focus();
                    input.select();
                }
            }, 0);
        } else {
            li.innerHTML = `
                <div class="task-status" onclick="app.toggleTaskStatus(${task.id})">${this.getStatusIcon(task.status)}</div>
                <div class="task-content">
                    <div class="task-text ${task.status}">${task.text}</div>
                    ${task.date ? `<div class="task-date">📅 ${this.formatDate(task.date)}</div>` : ''}
                </div>
                <div class="task-actions">
                    <button class="edit-btn" onclick="app.editTask(${task.id})">Edit</button>
                    <button class="delete-btn" onclick="app.deleteTask(${task.id})">Delete</button>
                </div>
            `;
        }
        
        return li;
    }

    updateStats() {
        const total = this.tasks.length;
        const done = this.tasks.filter(t => t.status === 'done').length;
        const incomplete = this.tasks.filter(t => t.status === 'incomplete').length;
        const undone = this.tasks.filter(t => t.status === 'undone').length;
        
        this.taskCount.textContent = `${total} tasks (✅ ${done} • ⬜ ${incomplete} • ❌ ${undone})`;
    }

    render() {
        const filteredTasks = this.getFilteredTasks();
        
        this.taskList.innerHTML = '';
        
        if (filteredTasks.length === 0) {
            this.emptyState.classList.add('show');
            this.taskList.classList.add('hidden');
        } else {
            this.emptyState.classList.remove('show');
            this.taskList.classList.remove('hidden');
            
            filteredTasks.forEach(task => {
                this.taskList.appendChild(this.createTaskElement(task));
            });
        }
        
        this.updateStats();
    }

    saveTasks() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const saved = localStorage.getItem('todoTasks');
        return saved ? JSON.parse(saved) : [];
    }
}

// Initialize the app
const app = new TodoApp();
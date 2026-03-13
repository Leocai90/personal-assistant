import { format, isAfter, isBefore, addDays } from 'date-fns';

export const checkReminders = (todos) => {
  const now = new Date();
  const reminders = [];

  todos.forEach(todo => {
    if (todo.reminderDate && !todo.completed) {
      const reminderDate = new Date(todo.reminderDate);
      const daysUntil = Math.ceil((reminderDate - now) / (1000 * 60 * 60 * 24));

      if (daysUntil <= 3 && daysUntil >= 0) {
        reminders.push({
          todoId: todo.id,
          title: todo.title,
          reminderDate: reminderDate,
          daysUntil,
          priority: daysUntil <= 1 ? 'high' : daysUntil <= 2 ? 'medium' : 'low'
        });
      }
    }
  });

  return reminders.sort((a, b) => a.daysUntil - b.daysUntil);
};

export const getDueSoonTodos = (todos, days = 3) => {
  const now = new Date();
  const futureDate = addDays(now, days);

  return todos.filter(todo => {
    if (!todo.dueDate || todo.completed) return false;
    const dueDate = new Date(todo.dueDate);
    return isAfter(dueDate, now) && isBefore(dueDate, futureDate);
  }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
};

export const getOverdueTodos = (todos) => {
  const now = new Date();

  return todos.filter(todo => {
    if (!todo.dueDate || todo.completed) return false;
    const dueDate = new Date(todo.dueDate);
    return isBefore(dueDate, now);
  }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
};

export const getPriorityTodos = (todos) => {
  return todos
    .filter(todo => !todo.completed)
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 5);
};

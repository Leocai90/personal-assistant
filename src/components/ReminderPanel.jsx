import React, { useState, useEffect } from 'react';
import { Bell, X, Check, AlertTriangle, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { checkReminders, getDueSoonTodos, getOverdueTodos, getPriorityTodos } from '../utils/reminder';

const ReminderPanel = ({ todos, onDismiss }) => {
  const [reminders, setReminders] = useState([]);
  const [dueSoon, setDueSoon] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [highPriority, setHighPriority] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    updateReminders();
    const interval = setInterval(updateReminders, 60000); // 每分钟更新一次
    return () => clearInterval(interval);
  }, [todos]);

  const updateReminders = () => {
    setReminders(checkReminders(todos));
    setDueSoon(getDueSoonTodos(todos, 3));
    setOverdue(getOverdueTodos(todos));
    setHighPriority(getPriorityTodos(todos));
  };

  const hasAnyReminders = reminders.length > 0 || dueSoon.length > 0 || overdue.length > 0;

  if (!hasAnyReminders) {
    return null;
  }

  const tabs = [
    { id: 'all', label: '全部提醒', count: reminders.length + dueSoon.length + overdue.length },
    { id: 'reminders', label: '到期提醒', count: reminders.length },
    { id: 'dueSoon', label: '即将到期', count: dueSoon.length },
    { id: 'overdue', label: '已逾期', count: overdue.length },
    { id: 'priority', label: '高优先级', count: highPriority.length }
  ];

  const getCurrentContent = () => {
    switch (activeTab) {
      case 'reminders':
        return reminders.map(r => (
          <ReminderCard key={r.todoId} reminder={r} type="reminder" />
        ));
      case 'dueSoon':
        return dueSoon.map(todo => (
          <TodoCard key={todo.id} todo={todo} type="dueSoon" />
        ));
      case 'overdue':
        return overdue.map(todo => (
          <TodoCard key={todo.id} todo={todo} type="overdue" />
        ));
      case 'priority':
        return highPriority.map(todo => (
          <TodoCard key={todo.id} todo={todo} type="priority" />
        ));
      default:
        return (
          <>
            {reminders.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  到期提醒
                </h3>
                {reminders.map(r => (
                  <ReminderCard key={r.todoId} reminder={r} type="reminder" />
                ))}
              </div>
            )}
            {overdue.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-red-500 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  已逾期
                </h3>
                {overdue.map(todo => (
                  <TodoCard key={todo.id} todo={todo} type="overdue" />
                ))}
              </div>
            )}
            {dueSoon.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-orange-500 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  即将到期（3天内）
                </h3>
                {dueSoon.map(todo => (
                  <TodoCard key={todo.id} todo={todo} type="dueSoon" />
                ))}
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg p-6 border border-amber-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-8 h-8 text-amber-500" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {reminders.length + dueSoon.length + overdue.length}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">智能提醒</h2>
        </div>
        <button
          onClick={onDismiss}
          className="p-2 hover:bg-white rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-amber-100'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {getCurrentContent()}
      </div>
    </div>
  );
};

const ReminderCard = ({ reminder, type }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`p-4 rounded-xl border ${getPriorityColor(reminder.priority)} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-800">{reminder.title}</h4>
        {reminder.daysUntil === 0 && (
          <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">今天</span>
        )}
        {reminder.daysUntil === 1 && (
          <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">明天</span>
        )}
        {reminder.daysUntil > 1 && (
          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">{reminder.daysUntil}天后</span>
        )}
      </div>
      <p className="text-sm opacity-75 flex items-center gap-1">
        <Calendar className="w-3 h-3" />
        {format(reminder.reminderDate, 'yyyy年MM月dd日 HH:mm')}
      </p>
    </div>
  );
};

const TodoCard = ({ todo, type }) => {
  const getCardStyle = () => {
    switch (type) {
      case 'overdue':
        return 'bg-red-50 border-red-200';
      case 'dueSoon':
        return 'bg-orange-50 border-orange-200';
      case 'priority':
        return `bg-${todo.priority === 'high' ? 'red' : todo.priority === 'medium' ? 'orange' : 'green'}-50 border-${todo.priority === 'high' ? 'red' : todo.priority === 'medium' ? 'orange' : 'green'}-200`;
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getPriorityBadge = () => {
    const labels = { high: '高', medium: '中', low: '低' };
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-orange-500',
      low: 'bg-green-500'
    };
    return (
      <span className={`text-xs ${colors[todo.priority]} text-white px-2 py-1 rounded-full`}>
        {labels[todo.priority]}
      </span>
    );
  };

  return (
    <div className={`p-4 rounded-xl border ${getCardStyle()} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-800">{todo.title}</h4>
        {getPriorityBadge()}
      </div>
      {todo.dueDate && (
        <p className="text-sm opacity-75 flex items-center gap-1 mb-2">
          <Calendar className="w-3 h-3" />
          {format(new Date(todo.dueDate), 'yyyy年MM月dd日')}
        </p>
      )}
      {type === 'overdue' && (
        <p className="text-xs text-red-600 font-medium flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          已逾期 {Math.floor((new Date() - new Date(todo.dueDate)) / (1000 * 60 * 60 * 24))} 天
        </p>
      )}
    </div>
  );
};

export default ReminderPanel;

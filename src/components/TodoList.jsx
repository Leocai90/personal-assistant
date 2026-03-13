import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Circle, Trash2, Edit2, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { storage, storageKeys } from '../utils/storage';

const TodoList = ({ onTodoUpdate }) => {
  const [todos, setTodos] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    reminderDate: ''
  });

  useEffect(() => {
    const savedTodos = storage.get(storageKeys.TODOS);
    if (savedTodos) {
      setTodos(savedTodos);
    }
  }, []);

  useEffect(() => {
    if (onTodoUpdate) {
      onTodoUpdate(todos);
    }
  }, [todos, onTodoUpdate]);

  const handleSave = () => {
    if (!formData.title.trim()) return;

    const newTodo = {
      id: editingTodo ? editingTodo.id : Date.now(),
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      dueDate: formData.dueDate || null,
      reminderDate: formData.reminderDate || null,
      completed: editingTodo ? editingTodo.completed : false,
      createdAt: editingTodo ? editingTodo.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let updatedTodos;
    if (editingTodo) {
      updatedTodos = todos.map(todo => todo.id === editingTodo.id ? newTodo : todo);
    } else {
      updatedTodos = [newTodo, ...todos];
    }

    setTodos(updatedTodos);
    storage.set(storageKeys.TODOS, updatedTodos);
    resetForm();
  };

  const handleToggleComplete = (id) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    storage.set(storageKeys.TODOS, updatedTodos);
  };

  const handleDelete = (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    storage.set(storageKeys.TODOS, updatedTodos);
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setFormData({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      dueDate: todo.dueDate || '',
      reminderDate: todo.reminderDate || ''
    });
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      reminderDate: ''
    });
    setEditingTodo(null);
    setIsAdding(false);
  };

  const getFilteredAndSortedTodos = () => {
    let filtered = [...todos];

    if (filter !== 'all') {
      if (filter === 'completed') {
        filtered = filtered.filter(todo => todo.completed);
      } else if (filter === 'pending') {
        filtered = filtered.filter(todo => !todo.completed);
      } else {
        filtered = filtered.filter(todo => todo.priority === filter);
      }
    }

    if (sortBy === 'priority') {
      filtered.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    } else if (sortBy === 'dueDate') {
      filtered.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    } else if (sortBy === 'created') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return filtered;
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const isDueSoon = (dueDate) => {
    if (!dueDate) return false;
    const now = new Date();
    const due = new Date(dueDate);
    const daysUntil = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    return daysUntil >= 0 && daysUntil <= 3;
  };

  const filteredTodos = getFilteredAndSortedTodos();
  const pendingCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
          <h2 className="text-2xl font-bold text-gray-800">待办事项</h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
            已完成: {completedCount}
          </span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            待处理: {pendingCount}
          </span>
        </div>
      </div>

      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full mb-6 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-medium"
        >
          <Plus className="w-5 h-5" />
          添加新任务
        </button>
      )}

      {isAdding && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">
            {editingTodo ? '编辑任务' : '创建新任务'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">任务标题 *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="输入任务标题..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all min-h-[80px]"
                placeholder="添加任务描述..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">优先级</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="high">高优先级</option>
                  <option value="medium">中优先级</option>
                  <option value="low">低优先级</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="priority">按优先级</option>
                  <option value="dueDate">按截止日期</option>
                  <option value="created">按创建时间</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  截止日期
                </label>
                <input
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  提醒日期
                </label>
                <input
                  type="datetime-local"
                  value={formData.reminderDate}
                  onChange={(e) => setFormData({ ...formData, reminderDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all font-medium"
              >
                {editingTodo ? '更新' : '保存'}
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {['all', 'pending', 'completed', 'high', 'medium', 'low'].map(f => {
          const labels = {
            all: '全部',
            pending: '待处理',
            completed: '已完成',
            high: '高优先级',
            medium: '中优先级',
            low: '低优先级'
          };
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filter === f
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {labels[f]}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>没有找到待办事项</p>
          </div>
        ) : (
          filteredTodos.map((todo) => {
            const overdue = isOverdue(todo.dueDate);
            const dueSoon = isDueSoon(todo.dueDate);
            const priorityColors = {
              high: 'border-l-red-500',
              medium: 'border-l-orange-500',
              low: 'border-l-green-500'
            };

            return (
              <div
                key={todo.id}
                className={`p-4 border-l-4 rounded-xl border border-gray-200 hover:shadow-md transition-all ${priorityColors[todo.priority]} ${
                  todo.completed ? 'bg-gray-50 opacity-60' : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleComplete(todo.id)}
                    className="mt-1 flex-shrink-0"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 hover:text-blue-500" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className={`font-semibold ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {todo.title}
                      </h4>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!todo.completed && (
                          <>
                            <button
                              onClick={() => handleEdit(todo)}
                              className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4 text-blue-500" />
                            </button>
                            <button
                              onClick={() => handleDelete(todo.id)}
                              className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {todo.description && (
                      <p className="text-sm text-gray-600 mb-2">{todo.description}</p>
                    )}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        todo.priority === 'high' ? 'bg-red-100 text-red-700' :
                        todo.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {todo.priority === 'high' ? '高优先级' : todo.priority === 'medium' ? '中优先级' : '低优先级'}
                      </span>
                      {todo.dueDate && (
                        <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${
                          overdue ? 'bg-red-500 text-white' :
                          dueSoon ? 'bg-orange-500 text-white' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {overdue && <AlertTriangle className="w-3 h-3" />}
                          {format(new Date(todo.dueDate), 'MM/dd HH:mm')}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {format(new Date(todo.createdAt), '创建于 yyyy-MM-dd')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TodoList;

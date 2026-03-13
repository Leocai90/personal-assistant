import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Lightbulb, CheckSquare, Bell, Github } from 'lucide-react';
import IdeaBoard from './components/IdeaBoard';
import TodoList from './components/TodoList';
import ReminderPanel from './components/ReminderPanel';
import { storage, storageKeys } from './utils/storage';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showReminder, setShowReminder] = useState(true);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const savedTodos = storage.get(storageKeys.TODOS);
    if (savedTodos) {
      setTodos(savedTodos);
    }
  }, []);

  const handleTodoUpdate = (updatedTodos) => {
    setTodos(updatedTodos);
  };

  const tabs = [
    { id: 'dashboard', label: '仪表板', icon: Sparkles },
    { id: 'ideas', label: '灵感板', icon: Lightbulb },
    { id: 'todos', label: '待办事项', icon: CheckSquare },
    { id: 'reminders', label: '智能提醒', icon: Bell },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm mb-1">待处理任务</p>
                    <p className="text-3xl font-bold">
                      {todos.filter(t => !t.completed).length}
                    </p>
                  </div>
                  <CheckSquare className="w-10 h-10 opacity-80" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm mb-1">已完成任务</p>
                    <p className="text-3xl font-bold">
                      {todos.filter(t => t.completed).length}
                    </p>
                  </div>
                  <CheckSquare className="w-10 h-10 opacity-80" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm mb-1">完成率</p>
                    <p className="text-3xl font-bold">
                      {todos.length > 0
                        ? Math.round((todos.filter(t => t.completed).length / todos.length) * 100)
                        : 0}%
                    </p>
                  </div>
                  <Sparkles className="w-10 h-10 opacity-80" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <TodoList onTodoUpdate={handleTodoUpdate} />
              </div>
              <div>
                <IdeaBoard />
              </div>
            </div>
          </div>
        );
      case 'ideas':
        return <IdeaBoard />;
      case 'todos':
        return <TodoList onTodoUpdate={handleTodoUpdate} />;
      case 'reminders':
        return <ReminderPanel todos={todos} onDismiss={() => setShowReminder(false)} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                个人助理
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden flex items-center"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 pt-2 pb-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showReminder && activeTab !== 'reminders' && (
          <div className="mb-6">
            <ReminderPanel todos={todos} onDismiss={() => setShowReminder(false)} />
          </div>
        )}
        {renderContent()}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">
              个人助理 - 记录灵感，管理任务，智能提醒
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="text-sm">GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

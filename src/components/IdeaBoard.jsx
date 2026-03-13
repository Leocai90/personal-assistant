import React, { useState, useEffect } from 'react';
import { Lightbulb, Plus, X, Tag, Calendar, Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { storage, storageKeys } from '../utils/storage';

const IdeaBoard = () => {
  const [ideas, setIdeas] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIdea, setEditingIdea] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    category: 'general'
  });

  useEffect(() => {
    const savedIdeas = storage.get(storageKeys.IDEAS);
    if (savedIdeas) {
      setIdeas(savedIdeas);
    }
  }, []);

  const handleSave = () => {
    if (!formData.title.trim()) return;

    const newIdea = {
      id: editingIdea ? editingIdea.id : Date.now(),
      title: formData.title,
      content: formData.content,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      category: formData.category,
      createdAt: editingIdea ? editingIdea.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let updatedIdeas;
    if (editingIdea) {
      updatedIdeas = ideas.map(idea => idea.id === editingIdea.id ? newIdea : idea);
    } else {
      updatedIdeas = [newIdea, ...ideas];
    }

    setIdeas(updatedIdeas);
    storage.set(storageKeys.IDEAS, updatedIdeas);
    resetForm();
  };

  const handleEdit = (idea) => {
    setEditingIdea(idea);
    setFormData({
      title: idea.title,
      content: idea.content,
      tags: idea.tags.join(', '),
      category: idea.category
    });
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    const updatedIdeas = ideas.filter(idea => idea.id !== id);
    setIdeas(updatedIdeas);
    storage.set(storageKeys.IDEAS, updatedIdeas);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      tags: '',
      category: 'general'
    });
    setEditingIdea(null);
    setIsEditing(false);
  };

  const categories = [
    { value: 'general', label: '通用', color: 'bg-blue-500' },
    { value: 'project', label: '项目', color: 'bg-green-500' },
    { value: 'learning', label: '学习', color: 'bg-purple-500' },
    { value: 'life', label: '生活', color: 'bg-yellow-500' },
    { value: 'business', label: '工作', color: 'bg-red-500' }
  ];

  const getCategoryInfo = (category) => {
    return categories.find(c => c.value === category) || categories[0];
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Lightbulb className="w-8 h-8 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-800">灵感板</h2>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            新想法
          </button>
        )}
      </div>

      {isEditing && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">
            {editingIdea ? '编辑想法' : '记录新想法'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="给你的想法一个标题..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">详细内容</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all min-h-[120px]"
                placeholder="描述你的想法详情..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">标签（用逗号分隔）</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="例如: 重要, 实验, 未来"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all font-medium"
              >
                {editingIdea ? '更新' : '保存'}
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

      <div className="space-y-4">
        {ideas.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Lightbulb className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>还没有记录任何想法</p>
            <p className="text-sm">点击上方按钮记录你的第一个想法</p>
          </div>
        ) : (
          ideas.map((idea) => {
            const categoryInfo = getCategoryInfo(idea.category);
            return (
              <div
                key={idea.id}
                className="p-5 border border-gray-200 rounded-xl hover:shadow-md transition-all bg-gradient-to-r from-white to-gray-50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`${categoryInfo.color} text-white text-xs px-2 py-1 rounded-full`}>
                      {categoryInfo.label}
                    </span>
                    <span className="text-sm text-gray-400">
                      {format(new Date(idea.updatedAt), 'yyyy-MM-dd HH:mm')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(idea)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-blue-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(idea.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{idea.title}</h3>
                {idea.content && (
                  <p className="text-gray-600 mb-3 leading-relaxed">{idea.content}</p>
                )}
                {idea.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {idea.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default IdeaBoard;

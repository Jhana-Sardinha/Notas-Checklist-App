import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, Save, Search, Filter, Archive, Copy, Download, Upload, Moon, Sun, ChevronUp, ChevronDown, ArchiveRestore } from 'lucide-react';

export default function NotesApp() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryEmoji, setNewCategoryEmoji] = useState('📝');
  const [newCategoryColor, setNewCategoryColor] = useState('#EF2917');
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [viewingNote, setViewingNote] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showArchived, setShowArchived] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const emojiOptions = ['📝', '✨', '🎯', '💡', '🌟', '🎨', '🚀', '💼', '🏠', '📚', '🎵', '☕', '🍕', '🎮', '💪', '🌈', '🔥', '💻', '📱', '🎬'];
  const colorOptions = ['#EF2917', '#3C6E71', '#604D53', '#D9D9D9', '#FFFFFF'];

  useEffect(() => {
    const saved = localStorage.getItem('notesAppData');
    const savedDarkMode = localStorage.getItem('darkMode');
    if (saved) {
      const data = JSON.parse(saved);
      setCategories(data);
      if (data.length > 0) setActiveCategory(data[0].id);
    }
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notesAppData', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const addCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory = {
        id: Date.now(),
        name: newCategoryName.trim(),
        emoji: newCategoryEmoji,
        color: newCategoryColor,
        notes: []
      };
      setCategories([...categories, newCategory]);
      setActiveCategory(newCategory.id);
      setNewCategoryName('');
      setNewCategoryEmoji('📝');
      setNewCategoryColor('#EF2917');
      setShowCategoryInput(false);
    }
  };

  const deleteCategory = (categoryId) => {
    const newCategories = categories.filter(cat => cat.id !== categoryId);
    setCategories(newCategories);
    if (activeCategory === categoryId && newCategories.length > 0) {
      setActiveCategory(newCategories[0].id);
    } else if (newCategories.length === 0) {
      setActiveCategory(null);
    }
  };

  const startNewNote = () => {
    setEditingNote({
      id: null,
      title: '',
      content: '',
      type: 'text',
      priority: 'normal',
      checklistItems: [],
      archived: false
    });
  };

  const saveNote = () => {
    if (!editingNote.title.trim()) return;
    
    const now = new Date().toISOString();
    if (editingNote.id) {
      setCategories(categories.map(cat =>
        cat.id === activeCategory
          ? {
              ...cat,
              notes: cat.notes.map(note =>
                note.id === editingNote.id ? { ...editingNote, modifiedAt: now } : note
              )
            }
          : cat
      ));
    } else {
      const newNote = { ...editingNote, id: Date.now(), createdAt: now, modifiedAt: now };
      setCategories(categories.map(cat => 
        cat.id === activeCategory 
          ? { ...cat, notes: [...cat.notes, newNote] }
          : cat
      ));
    }
    setEditingNote(null);
  };

  const deleteNote = (noteId) => {
    setCategories(categories.map(cat =>
      cat.id === activeCategory
        ? { ...cat, notes: cat.notes.filter(note => note.id !== noteId) }
        : cat
    ));
    setViewingNote(null);
  };

  const toggleArchiveNote = (noteId) => {
    setCategories(categories.map(cat =>
      cat.id === activeCategory
        ? {
            ...cat,
            notes: cat.notes.map(note =>
              note.id === noteId ? { ...note, archived: !note.archived } : note
            )
          }
        : cat
    ));
    setViewingNote(null);
  };

  const duplicateNote = (note) => {
    const duplicated = {
      ...note,
      id: Date.now(),
      title: `${note.title} (cópia)`,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString()
    };
    setCategories(categories.map(cat =>
      cat.id === activeCategory
        ? { ...cat, notes: [...cat.notes, duplicated] }
        : cat
    ));
  };

  const moveNote = (noteId, direction) => {
    const currentCat = categories.find(cat => cat.id === activeCategory);
    if (!currentCat) return;
    
    const notes = currentCat.notes;
    const index = notes.findIndex(n => n.id === noteId);
    if (index === -1) return;
    
    if (direction === 'up' && index > 0) {
      const newNotes = [...notes];
      [newNotes[index], newNotes[index - 1]] = [newNotes[index - 1], newNotes[index]];
      setCategories(categories.map(cat =>
        cat.id === activeCategory ? { ...cat, notes: newNotes } : cat
      ));
    } else if (direction === 'down' && index < notes.length - 1) {
      const newNotes = [...notes];
      [newNotes[index], newNotes[index + 1]] = [newNotes[index + 1], newNotes[index]];
      setCategories(categories.map(cat =>
        cat.id === activeCategory ? { ...cat, notes: newNotes } : cat
      ));
    }
  };

  const toggleChecklistItem = (itemId) => {
    if (viewingNote) {
      const updatedNote = {
        ...viewingNote,
        checklistItems: viewingNote.checklistItems.map(item =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        ),
        modifiedAt: new Date().toISOString()
      };
      setViewingNote(updatedNote);
      setCategories(categories.map(cat =>
        cat.id === activeCategory
          ? {
              ...cat,
              notes: cat.notes.map(note =>
                note.id === viewingNote.id ? updatedNote : note
              )
            }
          : cat
      ));
    }
  };

  const addChecklistItemToEditing = () => {
    setEditingNote({
      ...editingNote,
      checklistItems: [...editingNote.checklistItems, { id: Date.now(), text: '', completed: false }]
    });
  };

  const updateChecklistItemInEditing = (itemId, updates) => {
    setEditingNote({
      ...editingNote,
      checklistItems: editingNote.checklistItems.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    });
  };

  const deleteChecklistItemInEditing = (itemId) => {
    setEditingNote({
      ...editingNote,
      checklistItems: editingNote.checklistItems.filter(item => item.id !== itemId)
    });
  };

  const exportData = () => {
    const dataStr = JSON.stringify(categories, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `notas-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          setCategories(imported);
          if (imported.length > 0) setActiveCategory(imported[0].id);
          alert('Dados importados com sucesso!');
        } catch (error) {
          alert('Erro ao importar arquivo. Verifique se é um backup válido.');
        }
      };
      reader.readAsText(file);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getPriorityColor = (priority) => {
    if (darkMode) {
      switch(priority) {
        case 'high': return 'bg-red-900/50 text-red-200 border-red-700';
        case 'medium': return 'bg-yellow-900/50 text-yellow-200 border-yellow-700';
        case 'low': return 'bg-green-900/50 text-green-200 border-green-700';
        default: return 'bg-gray-700 text-gray-300 border-gray-600';
      }
    }
    switch(priority) {
      case 'high': return 'text-red-700 border-red-300';
      case 'medium': return 'text-yellow-700 border-yellow-300';
      case 'low': return 'text-green-700 border-green-300';
      default: return 'text-gray-600 border-gray-300';
    }
  };

  const currentCategory = categories.find(cat => cat.id === activeCategory);
  
  const filteredNotes = currentCategory?.notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || note.priority === priorityFilter;
    const matchesArchived = showArchived ? note.archived : !note.archived;
    return matchesSearch && matchesPriority && matchesArchived;
  }) || [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: darkMode ? '#1a1a1a' : '#D9D9D9' }}>
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2" style={{ color: darkMode ? '#FFFFFF' : '#604D53' }}>
              Minhas Notas ✨
            </h1>
            <p className="text-sm sm:text-base" style={{ color: darkMode ? '#D9D9D9' : '#3C6E71' }}>
              Organize suas ideias de forma simples
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-lg transition-colors shadow-lg"
            style={{ backgroundColor: darkMode ? '#604D53' : '#FFFFFF', color: darkMode ? '#FFFFFF' : '#604D53' }}
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        <div className="rounded-2xl shadow-xl overflow-hidden" style={{ backgroundColor: darkMode ? '#2a2a2a' : '#FFFFFF' }}>
          
          <div className="border-b-2 p-3" style={{ borderColor: darkMode ? '#404040' : '#D9D9D9', backgroundColor: darkMode ? '#333' : '#FFFFFF' }}>
            <div className="flex items-center gap-2 overflow-x-auto">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap transition-all text-sm sm:text-base font-medium"
                  style={{
                    backgroundColor: activeCategory === cat.id ? (darkMode ? '#404040' : '#3C6E71') : (darkMode ? '#333' : '#D9D9D9'),
                    color: activeCategory === cat.id ? (darkMode ? cat.color : '#FFFFFF') : (darkMode ? '#9da3a4' : '#604D53'),
                    boxShadow: activeCategory === cat.id ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  <span className="text-lg">{cat.emoji}</span>
                  <span>{cat.name}</span>
                  {activeCategory === cat.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCategory(cat.id);
                      }}
                      className="ml-1 hover:opacity-70"
                    >
                      <X size={16} />
                    </button>
                  )}
                </button>
              ))}
              
              {!showCategoryInput ? (
                <button
                  onClick={() => setShowCategoryInput(true)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 text-white rounded-lg hover:opacity-90 whitespace-nowrap text-sm sm:text-base font-medium"
                  style={{ backgroundColor: '#EF2917' }}
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline">Nova Categoria</span>
                  <span className="sm:hidden">Nova</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={newCategoryEmoji}
                    onChange={(e) => setNewCategoryEmoji(e.target.value)}
                    className="px-2 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 text-lg"
                    style={{
                      backgroundColor: darkMode ? '#404040' : '#FFFFFF',
                      borderColor: darkMode ? '#555' : '#D9D9D9',
                      color: darkMode ? '#FFFFFF' : '#604D53'
                    }}
                  >
                    {emojiOptions.map(emoji => (
                      <option key={emoji} value={emoji}>{emoji}</option>
                    ))}
                  </select>
                  <select
                    value={newCategoryColor}
                    onChange={(e) => setNewCategoryColor(e.target.value)}
                    className="px-2 py-2 border-2 rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: darkMode ? '#404040' : '#FFFFFF',
                      borderColor: darkMode ? '#555' : '#D9D9D9',
                      color: darkMode ? '#FFFFFF' : '#604D53'
                    }}
                  >
                    {colorOptions.map(color => (
                      <option key={color} value={color}>
                        {color === '#EF2917' ? 'Vermelho' : color === '#3C6E71' ? 'Verde Azulado' : color === '#604D53' ? 'Marrom' : color === '#D9D9D9' ? 'Cinza' : 'Branco'}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                    placeholder="Nome..."
                    className="px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base"
                    style={{
                      backgroundColor: darkMode ? '#404040' : '#FFFFFF',
                      borderColor: darkMode ? '#555' : '#D9D9D9',
                      color: darkMode ? '#FFFFFF' : '#604D53'
                    }}
                    autoFocus
                  />
                  <button
                    onClick={addCategory}
                    className="p-2 text-white rounded-lg hover:opacity-90"
                    style={{ backgroundColor: '#3C6E71' }}
                  >
                    <Save size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setShowCategoryInput(false);
                      setNewCategoryName('');
                    }}
                    className="p-2 text-white rounded-lg hover:opacity-90"
                    style={{ backgroundColor: '#EF2917' }}
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {!currentCategory ? (
              <div className="text-center py-12 sm:py-16" style={{ color: darkMode ? '#9da3a4' : '#604D53' }}>
                <p className="text-lg mb-2">🌈 Nenhuma categoria ainda</p>
                <p className="text-sm sm:text-base">Crie sua primeira categoria para começar!</p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2" style={{ color: darkMode ? '#FFFFFF' : '#604D53' }}>
                      <span className="text-2xl">{currentCategory.emoji}</span>
                      {currentCategory.name}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={startNewNote}
                        className="flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 font-medium"
                        style={{ backgroundColor: '#EF2917' }}
                      >
                        <Plus size={18} />
                        Nova Nota
                      </button>
                      <button
                        onClick={exportData}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg hover:opacity-90"
                        style={{
                          backgroundColor: darkMode ? '#404040' : '#3C6E71',
                          color: '#FFFFFF'
                        }}
                      >
                        <Download size={18} />
                        <span className="hidden sm:inline">Exportar</span>
                      </button>
                      <label className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg hover:opacity-90 cursor-pointer"
                        style={{
                          backgroundColor: darkMode ? '#404040' : '#3C6E71',
                          color: '#FFFFFF'
                        }}
                      >
                        <Upload size={18} />
                        <span className="hidden sm:inline">Importar</span>
                        <input type="file" accept=".json" onChange={importData} className="hidden" />
                      </label>
                      <button
                        onClick={() => setShowArchived(!showArchived)}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg hover:opacity-90"
                        style={{
                          backgroundColor: showArchived ? '#604D53' : (darkMode ? '#404040' : '#D9D9D9'),
                          color: showArchived ? '#FFFFFF' : (darkMode ? '#D9D9D9' : '#604D53')
                        }}
                      >
                        <Archive size={18} />
                        <span className="hidden sm:inline">{showArchived ? 'Ver Ativas' : 'Ver Arquivadas'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={20} style={{ color: darkMode ? '#9da3a4' : '#604D53' }} />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar notas..."
                        className="w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2"
                        style={{
                          backgroundColor: darkMode ? '#404040' : '#FFFFFF',
                          borderColor: darkMode ? '#555' : '#D9D9D9',
                          color: darkMode ? '#FFFFFF' : '#604D53'
                        }}
                      />
                    </div>
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2" size={20} style={{ color: darkMode ? '#9da3a4' : '#604D53' }} />
                      <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="pl-10 pr-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 w-full sm:w-auto"
                        style={{
                          backgroundColor: darkMode ? '#404040' : '#FFFFFF',
                          borderColor: darkMode ? '#555' : '#D9D9D9',
                          color: darkMode ? '#FFFFFF' : '#604D53'
                        }}
                      >
                        <option value="all">Todas Prioridades</option>
                        <option value="high">🔴 Alta</option>
                        <option value="medium">🟡 Média</option>
                        <option value="low">🟢 Baixa</option>
                        <option value="normal">Normal</option>
                      </select>
                    </div>
                  </div>
                </div>

                {filteredNotes.length === 0 ? (
                  <div className="text-center py-12 sm:py-16" style={{ color: darkMode ? '#9da3a4' : '#604D53' }}>
                    <p className="text-lg">📋 {showArchived ? 'Nenhuma nota arquivada' : 'Nenhuma nota encontrada'}</p>
                    <p className="text-sm sm:text-base">{showArchived ? 'Arquive notas para vê-las aqui!' : searchTerm || priorityFilter !== 'all' ? 'Tente ajustar os filtros' : 'Clique em "Nova Nota" para adicionar!'}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredNotes.map((note, index) => (
                      <div
                        key={note.id}
                        className="p-4 rounded-xl border-2 hover:shadow-lg transition-all"
                        style={{
                          backgroundColor: darkMode ? '#404040' : '#FFFFFF',
                          borderColor: darkMode ? '#555' : '#3C6E71'
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <button
                            onClick={() => setViewingNote(note)}
                            className="flex-1 text-left min-w-0"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">
                                {note.type === 'text' ? '📝' : note.type === 'checklist' ? '✅' : '📝✅'}
                              </span>
                              <h3 className="font-semibold text-base sm:text-lg truncate" style={{ color: darkMode ? '#FFFFFF' : '#604D53' }}>
                                {note.title}
                              </h3>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                              <span className={`px-2 py-1 rounded-full border ${getPriorityColor(note.priority)}`} style={{ backgroundColor: darkMode ? 'transparent' : '#D9D9D9' }}>
                                {note.priority === 'high' ? '🔴 Alta' : note.priority === 'medium' ? '🟡 Média' : note.priority === 'low' ? '🟢 Baixa' : 'Normal'}
                              </span>
                              {note.createdAt && (
                                <span style={{ color: darkMode ? '#9da3a4' : '#3C6E71' }}>
                                  Criada: {formatDate(note.createdAt)}
                                </span>
                              )}
                            </div>
                          </button>
                          <div className="flex gap-1 flex-shrink-0">
                            <button
                              onClick={() => moveNote(note.id, 'up')}
                              disabled={index === 0}
                              className="p-2 rounded-lg transition-colors"
                              style={{
                                color: index === 0 ? (darkMode ? '#555' : '#D9D9D9') : (darkMode ? '#9da3a4' : '#3C6E71'),
                                cursor: index === 0 ? 'not-allowed' : 'pointer'
                              }}
                            >
                              <ChevronUp size={18} />
                            </button>
                            <button
                              onClick={() => moveNote(note.id, 'down')}
                              disabled={index === filteredNotes.length - 1}
                              className="p-2 rounded-lg transition-colors"
                              style={{
                                color: index === filteredNotes.length - 1 ? (darkMode ? '#555' : '#D9D9D9') : (darkMode ? '#9da3a4' : '#3C6E71'),
                                cursor: index === filteredNotes.length - 1 ? 'not-allowed' : 'pointer'
                              }}
                            >
                              <ChevronDown size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {viewingNote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setViewingNote(null)}>
          <div 
            className="rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: darkMode ? '#2a2a2a' : '#FFFFFF' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-bold pr-4" style={{ color: darkMode ? '#FFFFFF' : '#604D53' }}>
                  {viewingNote.title}
                </h2>
                <button
                  onClick={() => setViewingNote(null)}
                  className="p-2 rounded-lg flex-shrink-0 hover:opacity-70"
                  style={{ color: darkMode ? '#FFFFFF' : '#604D53' }}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                <span className={`inline-block px-3 py-1 rounded-full text-sm border ${getPriorityColor(viewingNote.priority)}`} style={{ backgroundColor: darkMode ? '#404040' : '#D9D9D9' }}>
                  {viewingNote.priority === 'high' ? '🔴 Alta Prioridade' : viewingNote.priority === 'medium' ? '🟡 Média Prioridade' : viewingNote.priority === 'low' ? '🟢 Baixa Prioridade' : 'Prioridade Normal'}
                </span>
                {viewingNote.createdAt && (
                  <span className="text-sm px-3 py-1" style={{ color: darkMode ? '#9da3a4' : '#3C6E71' }}>
                    Criada: {formatDate(viewingNote.createdAt)}
                  </span>
                )}
                {viewingNote.modifiedAt && viewingNote.modifiedAt !== viewingNote.createdAt && (
                  <span className="text-sm px-3 py-1" style={{ color: darkMode ? '#9da3a4' : '#3C6E71' }}>
                    Modificada: {formatDate(viewingNote.modifiedAt)}
                  </span>
                )}
              </div>

              {(viewingNote.type === 'text' || viewingNote.type === 'both') && viewingNote.content && (
                <div className="mb-4 p-4 rounded-lg whitespace-pre-wrap text-sm sm:text-base" style={{
                  backgroundColor: darkMode ? '#404040' : '#D9D9D9',
                  color: darkMode ? '#FFFFFF' : '#604D53'
                }}>
                  {viewingNote.content}
                </div>
              )}

              {(viewingNote.type === 'checklist' || viewingNote.type ==='both') && viewingNote.checklistItems.length > 0 && (
                <div className="space-y-2 mb-6">
                  {viewingNote.checklistItems.map(item => (
                    <label key={item.id} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:opacity-80" style={{ backgroundColor: darkMode ? '#404040' : '#D9D9D9' }}>
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleChecklistItem(item.id)}
                        className="w-5 h-5 rounded"
                        style={{ accentColor: '#EF2917' }}
                      />
                      <span className={`flex-1 text-sm sm:text-base ${item.completed ? 'line-through' : ''}`} style={{ color: item.completed ? (darkMode ? '#9da3a4' : '#3C6E71') : (darkMode ? '#FFFFFF' : '#604D53') }}>
                        {item.text}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t-2" style={{ borderColor: darkMode ? '#404040' : '#D9D9D9' }}>
                <button
                  onClick={() => {
                    setEditingNote(viewingNote);
                    setViewingNote(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg hover:opacity-90 font-medium"
                  style={{ backgroundColor: '#3C6E71' }}
                >
                  <Edit2 size={18} />
                  Editar
                </button>
                <button
                  onClick={() => {
                    duplicateNote(viewingNote);
                    setViewingNote(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg hover:opacity-90 font-medium"
                  style={{ backgroundColor: '#604D53' }}
                >
                  <Copy size={18} />
                  Duplicar
                </button>
                <button
                  onClick={() => toggleArchiveNote(viewingNote.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg hover:opacity-90 font-medium"
                  style={{
                    backgroundColor: viewingNote.archived ? '#3C6E71' : '#D9D9D9',
                    color: viewingNote.archived ? '#FFFFFF' : '#604D53'
                  }}
                >
                  {viewingNote.archived ? <ArchiveRestore size={18} /> : <Archive size={18} />}
                  {viewingNote.archived ? 'Desarquivar' : 'Arquivar'}
                </button>
                <button
                  onClick={() => deleteNote(viewingNote.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg hover:opacity-90 font-medium"
                  style={{ backgroundColor: '#EF2917' }}
                >
                  <Trash2 size={18} />
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingNote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setEditingNote(null)}>
          <div 
            className="rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: darkMode ? '#2a2a2a' : '#FFFFFF' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-bold" style={{ color: darkMode ? '#FFFFFF' : '#604D53' }}>
                  {editingNote.id ? 'Editar Nota' : 'Nova Nota'}
                </h2>
                <button
                  onClick={() => setEditingNote(null)}
                  className="p-2 rounded-lg hover:opacity-70"
                  style={{ color: darkMode ? '#FFFFFF' : '#604D53' }}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: darkMode ? '#FFFFFF' : '#604D53' }}>
                    Título
                  </label>
                  <input
                    type="text"
                    value={editingNote.title}
                    onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                    placeholder="Título da nota..."
                    className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: darkMode ? '#404040' : '#FFFFFF',
                      borderColor: darkMode ? '#555' : '#D9D9D9',
                      color: darkMode ? '#FFFFFF' : '#604D53'
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: darkMode ? '#FFFFFF' : '#604D53' }}>
                      Tipo
                    </label>
                    <select
                      value={editingNote.type}
                      onChange={(e) => setEditingNote({ ...editingNote, type: e.target.value })}
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: darkMode ? '#404040' : '#FFFFFF',
                        borderColor: darkMode ? '#555' : '#D9D9D9',
                        color: darkMode ? '#FFFFFF' : '#604D53'
                      }}
                    >
                      <option value="text">📝 Texto</option>
                      <option value="checklist">✅ Checklist</option>
                      <option value="both">📝✅ Ambos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: darkMode ? '#FFFFFF' : '#604D53' }}>
                      Prioridade
                    </label>
                    <select
                      value={editingNote.priority}
                      onChange={(e) => setEditingNote({ ...editingNote, priority: e.target.value })}
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: darkMode ? '#404040' : '#FFFFFF',
                        borderColor: darkMode ? '#555' : '#D9D9D9',
                        color: darkMode ? '#FFFFFF' : '#604D53'
                      }}
                    >
                      <option value="normal">Normal</option>
                      <option value="low">🟢 Baixa</option>
                      <option value="medium">🟡 Média</option>
                      <option value="high">🔴 Alta</option>
                    </select>
                  </div>
                </div>

                {(editingNote.type === 'text' || editingNote.type === 'both') && (
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: darkMode ? '#FFFFFF' : '#604D53' }}>
                      Conteúdo
                    </label>
                    <textarea
                      value={editingNote.content}
                      onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                      placeholder="Escreva sua nota aqui..."
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 resize-none"
                      style={{
                        backgroundColor: darkMode ? '#404040' : '#FFFFFF',
                        borderColor: darkMode ? '#555' : '#D9D9D9',
                        color: darkMode ? '#FFFFFF' : '#604D53'
                      }}
                      rows={6}
                    />
                  </div>
                )}

                {(editingNote.type === 'checklist' || editingNote.type === 'both') && (
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: darkMode ? '#FFFFFF' : '#604D53' }}>
                      Itens da Checklist
                    </label>
                    <div className="space-y-2 mb-3">
                      {editingNote.checklistItems.map(item => (
                        <div key={item.id} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item.text}
                            onChange={(e) => updateChecklistItemInEditing(item.id, { text: e.target.value })}
                            placeholder="Novo item..."
                            className="flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2"
                            style={{
                              backgroundColor: darkMode ? '#404040' : '#FFFFFF',
                              borderColor: darkMode ? '#555' : '#D9D9D9',
                              color: darkMode ? '#FFFFFF' : '#604D53'
                            }}
                          />
                          <button
                            onClick={() => deleteChecklistItemInEditing(item.id)}
                            className="p-2 rounded-lg hover:opacity-70"
                            style={{ color: '#EF2917' }}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={addChecklistItemToEditing}
                      className="w-full py-3 border-2 border-dashed rounded-lg font-medium hover:opacity-70"
                      style={{
                        borderColor: darkMode ? '#555' : '#D9D9D9',
                        color: darkMode ? '#FFFFFF' : '#604D53'
                      }}
                    >
                      + Adicionar Item
                    </button>
                  </div>
                )}

                <button
                  onClick={saveNote}
                  disabled={!editingNote.title.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  style={{ backgroundColor: '#EF2917' }}
                >
                  <Save size={20} />
                  Salvar Nota
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

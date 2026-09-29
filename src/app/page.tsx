'use client';

import { useState, useEffect, useRef } from 'react';
import NoteItem from '@/components/NoteItem';
import { v4 as uuidv4 } from 'uuid';

type Note = { id: string; title: string; description: string; date: string };

function Icon({
  name,
  className = 'h-5 w-5',
}: {
  name: 'plus' | 'search' | 'file' | 'home' | 'note' | 'clock' | 'x';
  className?: string;
}) {
  const paths = {
    plus: <path d="M12 5v14M5 12h14" />,
    search: <path d="m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />,
    file: <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5ZM14 2v5h5M9 13h6M9 17h4" />,
    home: <path d="m3 11 9-8 9 8v9a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2v-9Z" />,
    note: <path d="M8 2h8l4 4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h2ZM16 2v5h5M8 12h8M8 16h5" />,
    clock: <path d="M12 8v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    x: <path d="M18 6 6 18M6 6l12 12" />,
  };

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export default function Home() {
  // State for notes array
  const [notes, setNotes] = useState<Array<Note>>([]);
  const [hasLoadedNotes, setHasLoadedNotes] = useState(false);
  // State for form inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // State for editing
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  // State for duplicate warning
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [activeNav, setActiveNav] = useState<'home' | 'notes' | 'new'>('home');
  const createSectionRef = useRef<HTMLElement | null>(null);
  const notesSectionRef = useRef<HTMLElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  // Load notes from localStorage when app starts
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
    setHasLoadedNotes(true);
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (!hasLoadedNotes) return;
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [hasLoadedNotes, notes]);

  // Check for duplicate notes (same title and description)
  useEffect(() => {
    if (title.trim() === '' || description.trim() === '') {
      setDuplicateWarning(false);
      return;
    }
    const isDuplicate = notes.some(
      note =>
        note.title.toLowerCase().trim() === title.toLowerCase().trim() &&
        note.description.toLowerCase().trim() === description.toLowerCase().trim()
    );
    setDuplicateWarning(isDuplicate);
  }, [title, description, notes]);

  // Handle adding a note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === '' || description.trim() === '') {
      alert('Please fill in both fields');
      return;
    }
    if (duplicateWarning) {
      alert('This note already exists.');
      return;
    }
    const newNote = {
      id: uuidv4(),
      title: title.trim(),
      description: description.trim(),
      date: new Date().toISOString(),
    };
    setNotes([...notes, newNote]);
    setTitle('');
    setDescription('');
  };

  // Handle deleting a note
  const handleDeleteNote = (id: string) => {
    const selectedNote = notes.find(note => note.id === id);
    if (selectedNote) {
      setNoteToDelete(selectedNote);
    }
  };

  const confirmDeleteNote = () => {
    if (noteToDelete) {
      setNotes(notes.filter(note => note.id !== noteToDelete.id));
      setNoteToDelete(null);
    }
  };

  // Handle editing a note
  const handleEditNote = (id: string) => {
    const noteToEdit = notes.find(note => note.id === id);
    if (noteToEdit) {
      setEditingNoteId(id);
      setEditTitle(noteToEdit.title);
      setEditDescription(noteToEdit.description);
    }
  };

  // Handle saving edited note
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTitle.trim() === '' || editDescription.trim() === '') {
      alert('Please fill in both fields');
      return;
    }
    // Check for duplicate with other notes (excluding the one being edited)
    const isDuplicate = notes.some(
      note =>
        note.id !== editingNoteId &&
        note.title.toLowerCase().trim() === editTitle.toLowerCase().trim() &&
        note.description.toLowerCase().trim() === editDescription.toLowerCase().trim()
    );
    if (isDuplicate) {
      alert('This note already exists.');
      return;
    }
    const updatedNotes = notes.map(note =>
      note.id === editingNoteId
        ? { ...note, title: editTitle.trim(), description: editDescription.trim(), date: new Date().toISOString() }
        : note
    );
    setNotes(updatedNotes);
    setEditingNoteId(null);
    setEditTitle('');
    setEditDescription('');
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const scrollToCreateNote = () => {
    setActiveNav('new');
    createSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => titleInputRef.current?.focus(), 250);
  };

  const scrollToNotes = () => {
    setActiveNav('notes');
    notesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToHome = () => {
    setActiveNav('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const latestNote = [...notes].sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime())[0];
  const filteredNotes = notes.filter(note => {
    const query = searchQuery.toLowerCase().trim();
    return (
      query === '' ||
      note.title.toLowerCase().includes(query) ||
      note.description.toLowerCase().includes(query)
    );
  });

  return (
    <main className="min-h-screen bg-[#F3F3F1] px-4 py-6 text-[#0A0A0A] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-32">
      <header className="flex items-center justify-between gap-4 pt-2">
        <div>
          <p className="text-sm font-medium text-[#777777]">Welcome back</p>
          <h1 className="mt-1 text-[2rem] font-semibold tracking-[-0.04em] text-[#0A0A0A] sm:text-4xl">
            My Notes
          </h1>
        </div>
        <button
          type="button"
          onClick={scrollToNotes}
          className="grid h-12 w-12 place-items-center rounded-full border border-[#E8E8E5] bg-white text-[#0A0A0A] shadow-[0_12px_30px_rgba(20,20,20,0.06)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(20,20,20,0.1)] focus:outline-none focus:ring-4 focus:ring-black/10"
          aria-label="Search notes"
        >
          <Icon name="search" />
        </button>
      </header>

      <section className="rounded-[28px] bg-[#0A0A0A] p-6 text-white shadow-[0_24px_60px_rgba(10,10,10,0.18)] transition duration-200 hover:-translate-y-0.5 sm:p-8">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-white">
              <Icon name="file" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.03em]">Capture your ideas</h2>
              <p className="mt-1 max-w-sm text-sm leading-6 text-white/68 sm:text-base">
                Write something before you forget.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={scrollToCreateNote}
            className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-[#0A0A0A] transition duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/20"
            aria-label="Create a new note"
          >
            <Icon name="plus" />
          </button>
        </div>
      </section>

      <section id="overview" className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-[-0.03em]">Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-[26px] border border-[#E8E8E5] bg-white p-5 shadow-[0_18px_40px_rgba(20,20,20,0.05)]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#777777]">Total Notes</p>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#F7F7F5] text-[#0A0A0A]">
                <Icon name="note" className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-5 text-4xl font-semibold tracking-[-0.05em]">{notes.length}</p>
          </article>
          <article className="rounded-[26px] border border-[#E8E8E5] bg-white p-5 shadow-[0_18px_40px_rgba(20,20,20,0.05)]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#777777]">Recently Updated</p>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#F7F7F5] text-[#0A0A0A]">
                <Icon name="clock" className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-5 truncate text-lg font-semibold tracking-[-0.02em]">
              {latestNote ? latestNote.title : 'No updates yet'}
            </p>
            <p className="mt-1 text-sm text-[#777777]">
              {latestNote ? new Date(latestNote.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Create your first note'}
            </p>
          </article>
        </div>
      </section>

      <section ref={createSectionRef} id="create-note" className="scroll-mt-6 rounded-[28px] border border-[#E8E8E5] bg-white p-5 shadow-[0_20px_50px_rgba(20,20,20,0.06)] sm:p-7">
        <form onSubmit={handleAddNote} className="space-y-5">
          <div>
            <p className="text-sm font-medium text-[#777777]">New entry</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em]">Create Note</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <label className="space-y-2">
              <span className="text-sm font-medium text-[#3B3B38]">Title</span>
              <input
                ref={titleInputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-[18px] border border-transparent bg-[#F7F7F5] px-4 py-4 text-[15px] text-[#0A0A0A] outline-none transition duration-200 placeholder:text-[#9A9A95] focus:border-[#0A0A0A] focus:bg-white focus:ring-4 focus:ring-black/5"
                placeholder="Idea title"
                required
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-[#3B3B38]">Description</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-32 w-full resize-none rounded-[18px] border border-transparent bg-[#F7F7F5] px-4 py-4 text-[15px] leading-6 text-[#0A0A0A] outline-none transition duration-200 placeholder:text-[#9A9A95] focus:border-[#0A0A0A] focus:bg-white focus:ring-4 focus:ring-black/5"
                rows={4}
                placeholder="Write the details here..."
                required
              />
            </label>
          </div>
          {duplicateWarning && (
            <p className="rounded-2xl bg-[#F7F7F5] px-4 py-3 text-sm font-medium text-[#6F4E37]">
              This note already exists.
            </p>
          )}
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0A0A0A] px-6 py-4 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
            disabled={duplicateWarning || title.trim() === '' || description.trim() === ''}
          >
            <Icon name="plus" className="h-4 w-4" />
            Add Note
          </button>
        </form>
      </section>

      <section ref={notesSectionRef} id="notes" className="scroll-mt-6 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">Your Notes</h2>
            <p className="mt-1 text-sm font-medium text-[#777777]">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'}
            </p>
          </div>
          <label className="relative block w-full sm:max-w-sm">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777777]">
              <Icon name="search" className="h-4 w-4" />
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-[#E8E8E5] bg-white py-3 pl-11 pr-4 text-sm outline-none transition duration-200 placeholder:text-[#9A9A95] focus:border-[#0A0A0A] focus:ring-4 focus:ring-black/5"
              placeholder="Search notes"
            />
          </label>
        </div>

        {notes.length === 0 ? (
          <div className="rounded-[28px] border border-[#E8E8E5] bg-white px-6 py-14 text-center shadow-[0_20px_50px_rgba(20,20,20,0.05)]">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-[#F7F7F5] text-[#0A0A0A]">
              <Icon name="file" className="h-7 w-7" />
            </div>
            <h3 className="mt-6 text-xl font-semibold tracking-[-0.02em]">No notes yet</h3>
            <p className="mt-2 text-sm text-[#777777]">Your ideas will appear here.</p>
            <button
              type="button"
              onClick={scrollToCreateNote}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#0A0A0A] px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5"
            >
              Create your first note
            </button>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="rounded-[28px] border border-[#E8E8E5] bg-white p-8 text-center text-sm font-medium text-[#777777]">
            No notes match your search.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredNotes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
              />
            ))}
          </div>
        )}
      </section>
      </div>

      {editingNoteId && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/25 px-4 py-6 backdrop-blur-sm">
          <form
            onSubmit={handleSaveEdit}
            className="w-full max-w-lg animate-[modalIn_180ms_ease-out] rounded-[28px] border border-[#E8E8E5] bg-white p-5 shadow-[0_30px_80px_rgba(10,10,10,0.2)] sm:p-7"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#777777]">Edit mode</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em]">Edit Note</h2>
              </div>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="grid h-10 w-10 place-items-center rounded-full bg-[#F7F7F5] text-[#0A0A0A] transition hover:bg-[#ECECEA]"
                aria-label="Close edit note"
              >
                <Icon name="x" className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <label className="space-y-2 block">
                <span className="text-sm font-medium text-[#3B3B38]">Edit title</span>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-[18px] border border-transparent bg-[#F7F7F5] px-4 py-4 text-[15px] outline-none transition duration-200 focus:border-[#0A0A0A] focus:bg-white focus:ring-4 focus:ring-black/5"
                  required
                />
              </label>
              <label className="space-y-2 block">
                <span className="text-sm font-medium text-[#3B3B38]">Edit description</span>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="min-h-36 w-full resize-none rounded-[18px] border border-transparent bg-[#F7F7F5] px-4 py-4 text-[15px] leading-6 outline-none transition duration-200 focus:border-[#0A0A0A] focus:bg-white focus:ring-4 focus:ring-black/5"
                  rows={5}
                  required
                />
              </label>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-full border border-[#E8E8E5] px-5 py-3 text-sm font-semibold transition duration-200 hover:bg-[#F7F7F5]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-[#0A0A0A] px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {noteToDelete && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/25 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-sm animate-[modalIn_180ms_ease-out] rounded-[28px] border border-[#E8E8E5] bg-white p-6 text-center shadow-[0_30px_80px_rgba(10,10,10,0.2)]">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#F7F7F5] text-[#0A0A0A]">
              <Icon name="x" className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-xl font-semibold tracking-[-0.02em]">Delete this note?</h2>
            <p className="mt-2 text-sm leading-6 text-[#777777]">This action cannot be undone.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setNoteToDelete(null)}
                className="rounded-full border border-[#E8E8E5] px-4 py-3 text-sm font-semibold transition hover:bg-[#F7F7F5]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteNote}
                className="rounded-full bg-[#0A0A0A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2A1515]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-5 left-1/2 z-40 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-full border border-white/70 bg-white/85 p-2 shadow-[0_18px_50px_rgba(10,10,10,0.14)] backdrop-blur-xl lg:bottom-7">
        <div className="grid grid-cols-3 gap-1">
          {[
            { key: 'home' as const, label: 'Home', icon: 'home' as const, action: scrollToHome },
            { key: 'notes' as const, label: 'Notes', icon: 'note' as const, action: scrollToNotes },
            { key: 'new' as const, label: 'New', icon: 'plus' as const, action: scrollToCreateNote },
          ].map(item => (
            <button
              key={item.key}
              type="button"
              onClick={item.action}
              className={`flex items-center justify-center gap-2 rounded-full px-3 py-3 text-xs font-semibold transition duration-200 ${
                activeNav === item.key ? 'bg-[#F0F0EE] text-[#0A0A0A]' : 'text-[#777777] hover:bg-[#F7F7F5] hover:text-[#0A0A0A]'
              }`}
            >
              <Icon name={item.icon} className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </main>
  );
}

# Notes Application

A simple, modern, responsive notes application built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- Add notes with title and description
- View all created notes
- Edit existing notes
- Delete notes with confirmation
- Duplicate note detection (prevents adding notes with identical title and description)
- Persistent storage using localStorage
- Responsive design for mobile and desktop

## Project Structure

```
notes-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   └── components/
│       └── NoteItem.tsx
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── postcss.config.js
```

## Installation and Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How useState Works

We use `useState` hooks to manage the following state variables:

- `notes`: Array storing all note objects (each with `id`, `title`, `description`, and `date`)
- `title` / `description`: Form input fields for creating new notes
- `editingNoteId`: ID of the note currently being edited (null when not in edit mode)
- `editTitle` / `editDescription`: Form inputs for editing an existing note
- `duplicateWarning`: Boolean flag that shows when a duplicate note is detected

Each state variable triggers a re-render when updated, ensuring the UI stays in sync with the application state.

## How useEffect Works

We use three `useEffect` hooks:

1. **Load notes from localStorage** (runs once on startup):
   ```javascript
   useEffect(() => {
     const savedNotes = localStorage.getItem('notes');
     if (savedNotes) {
       setNotes(JSON.parse(savedNotes));
     }
   }, []); // Empty dependency array means this runs only once
   ```

2. **Save notes to localStorage** (runs whenever notes change):
   ```javascript
   useEffect(() => {
     localStorage.setItem('notes', JSON.stringify(notes));
   }, [notes]); // Runs whenever the notes array changes
   ```

3. **Check for duplicate notes** (runs when title, description, or notes change):
   ```javascript
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
   ```

## Duplicate-Note Detection

The duplicate check runs in a `useEffect` that monitors the `title`, `description`, and `notes` array. When both form inputs are non-empty, it compares the new note's title and description (case-insensitive and trimmed) against all existing notes. If a match is found:

- Sets `duplicateWarning` state to `true`
- Disables the "Add Note" button
- Shows the warning message: "This note already exists."
- Prevents the duplicate note from being added when the form is submitted

## Testing Checklist

Follow these steps to verify all functionality:

1. Open the app at http://localhost:3000
2. Add a note with title "First note" and description "Test content"
3. Verify the note appears in the list
4. Add a second note with different title and description
5. Attempt to add a duplicate note (same title and description as the first note)
6. Verify the warning appears and the Add button is disabled
7. Edit the first note (change its title and/or description)
8. Verify the changes persist in the list
9. Delete the second note
10. Confirm the deletion and verify only the first note remains
11. Refresh the page
12. Verify all changes persist (notes remain after reload)

## Git Commands

To initialize the repository, commit the project, and push to GitHub:

```bash
# Check current status
git status

# Add all new files
git add .

# Commit changes
git commit -m "Initialize notes application with Next.js, TypeScript, and Tailwind CSS"

# Push to GitHub (assuming origin remote exists)
git push origin master
```

Note: For a new repository, you would first need to:
```bash
git remote add origin <your-repository-url>
git branch -M master
git push -u origin master
```

## Design Highlights

- Modern minimal dashboard with clean typography
- Responsive layout (1 column on mobile, 2 on tablet, 3 on desktop)
- Rounded cards with subtle shadows
- Professional color palette with blue accents
- Clear visual hierarchy and spacing
- Smooth hover and focus states on interactive elements
- Friendly empty state when no notes exist
- Note count displayed above the list

## Notes

- This application uses only frontend technologies (no backend or database)
- All data persists in the browser's localStorage
- Built with Next.js 14, React 18, TypeScript, and Tailwind CSS
- Follows React best practices with clear useState and useEffect implementations
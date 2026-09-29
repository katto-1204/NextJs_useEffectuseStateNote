# Exercise 3 — Short Video Testing Guide

Record for about **3–4 minutes**. Start the app with:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use an incognito window if you want an empty notes list.

## Test Data

| Title | Description |
| --- | --- |
| Grocery List | Buy milk, bread, eggs, and coffee. |
| Project Tasks | Finish the homepage and test the notes application. |

## Recording Steps

1. **Introduce the app.** Show the design, form, notes area, and note count. Say that it uses React `useState`, `useEffect`, and a separate `NoteItem` component.
2. **Test required fields.** Show that **Add Note** stays disabled until both title and description are entered.
3. **Add two notes.** Use the test data above. Show both notes and confirm the count becomes `2`.
4. **Test duplicates.** Enter the exact Grocery List note again. Show **This note already exists.** and the disabled **Add Note** button.
5. **Update a note.** Edit Grocery List to `Weekend Grocery List`, add `and fruit` to its description, then save.
6. **Delete a note.** Try deleting Project Tasks, click **Cancel**, open delete again, then confirm **Delete**. Show the count becomes `1`.
7. **Test persistence.** Refresh the page and show that Weekend Grocery List remains.
8. **Show the code.** Briefly show `useState` and `useEffect` in `src/app/page.tsx`, then show `src/components/NoteItem.tsx`.
9. **Finish.** Show the public GitHub repository link and state that add, view, update, delete, duplicate detection, and local storage all work.

## Final Checklist

- [ ] Add, view, update, and delete are shown.
- [ ] Duplicate detection is shown.
- [ ] Refresh persistence is shown.
- [ ] `useState`, `useEffect`, and `NoteItem` are shown.
- [ ] The public GitHub link is included.
- [ ] Text and audio are clear.

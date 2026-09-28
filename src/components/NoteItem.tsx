import { useState } from 'react';

function Icon({
  name,
  className = 'h-4 w-4',
}: {
  name: 'pencil' | 'trash';
  className?: string;
}) {
  const paths = {
    pencil: <path d="m16.9 3.8 3.3 3.3M3 21l4.2-.8L19.1 8.3a2.3 2.3 0 0 0-3.3-3.3L3.9 16.9 3 21Z" />,
    trash: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" />,
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

interface NoteItemProps {
  note: {
    id: string;
    title: string;
    description: string;
    date: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NoteItem({ note, onEdit, onDelete }: NoteItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Format the date for display
  const formattedDate = new Date(note.date).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`group flex min-h-64 flex-col rounded-[26px] border border-[#E8E8E5] bg-white p-5 shadow-[0_18px_40px_rgba(20,20,20,0.05)] transition duration-200 ${
        isHovered ? '-translate-y-1 shadow-[0_24px_55px_rgba(20,20,20,0.09)]' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#8A8A85]">{formattedDate}</p>
      <div className="mt-5 flex-1">
        <h3 className="text-xl font-semibold leading-tight tracking-[-0.03em] text-[#0A0A0A]">{note.title}</h3>
        <p className="mt-3 line-clamp-5 text-sm leading-6 text-[#5F5F5A]">{note.description}</p>
      </div>
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#F0F0EE] pt-4">
        <span className="text-xs font-medium text-[#9A9A95]">Note</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(note.id)}
            className="inline-flex items-center gap-2 rounded-full bg-[#0A0A0A] px-4 py-2 text-xs font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-black focus:outline-none focus:ring-4 focus:ring-black/10"
          >
            <Icon name="pencil" />
            Edit
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="grid h-9 w-9 place-items-center rounded-full bg-[#F7F7F5] text-[#0A0A0A] transition duration-200 hover:bg-[#2A1515] hover:text-white focus:outline-none focus:ring-4 focus:ring-black/10"
            aria-label={`Delete ${note.title}`}
          >
            <Icon name="trash" />
          </button>
        </div>
      </div>
    </div>
  );
}

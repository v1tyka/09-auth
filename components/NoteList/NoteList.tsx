import css from "./NoteList.module.css";

import Link from "next/link";
import toast from "react-hot-toast";
import { Note } from "@/types/note";
import { deleteNote } from "@/lib/api/clientApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success(`Note "${data.title}" deleted.`);
    },
    onError: () => {
      toast.error(`Failed to delete note.`);
    },
  });

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li className={css.listItem} key={note.id}>
          <Link href={`/notes/${note.id}`} className={css.titleLink}>
            <h2 className={css.title}>{note.title}</h2>
          </Link>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button className={css.more}>
              <Link href={`/notes/${note.id}`}>View details</Link>
            </button>
            <button
              className={css.delete}
              onClick={() => mutation.mutate(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

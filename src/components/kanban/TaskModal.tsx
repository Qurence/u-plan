"use client";
import { useState } from "react";

export function TaskModal({
  open,
  onClose,
  task,
  onUpdate,
  onDelete,
  labels,
  onLabelAdd,
  onLabelRemove,
  checklists,
  onChecklistAdd,
  onChecklistToggle,
  comments,
  onCommentAdd,
  attachments,
  onAttachmentAdd,
  onAttachmentRemove,
}: {
  open: boolean;
  onClose: () => void;
  task: any;
  onUpdate: (data: any) => void;
  onDelete: () => void;
  labels: any[];
  onLabelAdd: (labelId: string) => void;
  onLabelRemove: (labelId: string) => void;
  checklists: any[];
  onChecklistAdd: (title: string) => void;
  onChecklistToggle: (checklistId: string, itemId: string) => void;
  comments: any[];
  onCommentAdd: (text: string) => void;
  attachments: any[];
  onAttachmentAdd: (file: File) => void;
  onAttachmentRemove: (id: string) => void;
}) {
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description || "");
  const [comment, setComment] = useState("");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-brand-ui hover:text-brand-accent text-2xl font-bold cursor-pointer">×</button>
        <input
          className="w-full text-2xl font-bold bg-transparent border-none outline-none mb-2 text-brand-dark dark:text-white"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onBlur={() => onUpdate({ title: editTitle })}
        />
        <textarea
          className="w-full min-h-[60px] bg-transparent border-none outline-none text-brand-ui dark:text-brand-soft mb-4"
          value={editDesc}
          onChange={e => setEditDesc(e.target.value)}
          onBlur={() => onUpdate({ description: editDesc })}
          placeholder="Добавить более подробное описание..."
        />
        {/* Метки */}
        <div className="flex flex-wrap gap-2 mb-4">
          {labels.map(label => (
            <span key={label.id} className="px-3 py-1 rounded-xl text-xs font-semibold" style={{ background: label.color }}>{label.name}</span>
          ))}
          {/* TODO: Кнопка добавления/редактирования меток */}
        </div>
        {/* Чек-листы */}
        <div className="mb-4">
          {checklists.map(cl => (
            <div key={cl.id} className="mb-2">
              <div className="font-semibold text-brand-dark dark:text-white mb-1">{cl.title}</div>
              <ul className="pl-4">
                {cl.items.map((item: any) => (
                  <li key={item.id} className="flex items-center gap-2 mb-1">
                    <input type="checkbox" checked={item.checked} onChange={() => onChecklistToggle(cl.id, item.id)} />
                    <span className={item.checked ? "line-through text-brand-ui/60" : ""}>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {/* TODO: Кнопка добавления чек-листа */}
        </div>
        {/* Вложения */}
        <div className="mb-4 flex gap-2 flex-wrap">
          {attachments.map(att => (
            <div key={att.id} className="flex flex-col items-center">
              <img src={att.url} alt="attachment" className="w-20 h-20 object-cover rounded-xl" />
              <button onClick={() => onAttachmentRemove(att.id)} className="text-xs text-red-500 mt-1">Удалить</button>
            </div>
          ))}
          {/* TODO: Кнопка добавления вложения */}
        </div>
        {/* Комментарии */}
        <div className="mb-4">
          <div className="font-semibold text-brand-dark dark:text-white mb-2">Комментарии и события</div>
          <div className="flex gap-2 mb-2">
            <input
              className="flex-1 rounded-xl border border-brand-ui/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent bg-white dark:bg-zinc-900 text-brand-dark dark:text-white placeholder:text-brand-ui/60"
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Напишите комментарий..."
            />
            <button onClick={() => { if (comment.trim()) { onCommentAdd(comment); setComment(""); } }} className="bg-brand-accent hover:bg-brand-secondary text-white font-semibold px-4 rounded-xl shadow-soft transition-all duration-200 text-sm cursor-pointer">Отправить</button>
          </div>
          <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
            {comments.map(c => (
              <div key={c.id} className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-brand-ui/20 text-brand-dark font-bold text-xs">{c.author?.name?.[0] ?? "?"}</span>
                <span className="text-sm text-brand-dark dark:text-white font-medium">{c.author?.name ?? c.author?.email}</span>
                <span className="text-xs text-brand-ui/60">{c.text}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Быстрые действия и удаление */}
        <div className="flex gap-4 mt-6">
          <button onClick={onDelete} className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-2xl shadow-soft transition-all text-base cursor-pointer">Удалить</button>
          <button onClick={onClose} className="bg-brand-ui hover:bg-brand-secondary text-white font-semibold px-6 py-2 rounded-2xl shadow-soft transition-all text-base cursor-pointer">Закрыть</button>
        </div>
      </div>
    </div>
  );
} 
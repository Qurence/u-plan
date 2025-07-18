"use client";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useState, useRef } from "react";
import { TaskModal } from "./TaskModal";
import { useAblyChannel } from "@/lib/useAblyChannel";
import { useRouter } from "next/navigation";

// Типы для категорий и задач (заглушки, заменить на реальные)
type Task = { id: string; title: string; description?: string };
type Category = { id: string; name: string; organizationId: string; tasks: Task[] };

type Props = {
  initialCategories: Category[];
  orgId: string;
};

// Новый компонент меню ⋯ для карточки задачи
function TaskMenu({ onEdit, onArchive, onDelete }: { onEdit: () => void; onArchive: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <div className="relative">
      <button ref={ref} className="text-brand-ui hover:text-brand-accent p-1 rounded-full" onClick={e => { e.stopPropagation(); setOpen(v => !v); }}>
        <span>⋯</span>
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-20 min-w-[160px] bg-white dark:bg-zinc-900 rounded-xl shadow-lg py-2 flex flex-col animate-fade-in-up border border-brand-ui/10">
          <button className="px-4 py-2 text-left hover:bg-brand-soft/30 transition" onClick={e => { e.stopPropagation(); setOpen(false); onEdit(); }}>✏️ Редактировать</button>
          <button className="px-4 py-2 text-left hover:bg-brand-soft/30 transition" onClick={e => { e.stopPropagation(); setOpen(false); onArchive(); }}>📦 Архивировать</button>
          <button className="px-4 py-2 text-left text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition" onClick={e => { e.stopPropagation(); setOpen(false); onDelete(); }}>🗑️ Удалить</button>
        </div>
      )}
    </div>
  );
}

// Новый компонент меню ⋯ для колонки (категории)
function CategoryMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <div className="relative">
      <button ref={ref} className="text-brand-ui hover:text-brand-accent p-1 rounded-full" onClick={e => { e.stopPropagation(); setOpen(v => !v); }}>
        <span>⋯</span>
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-20 min-w-[160px] bg-white dark:bg-zinc-900 rounded-xl shadow-lg py-2 flex flex-col animate-fade-in-up border border-brand-ui/10">
          <button className="px-4 py-2 text-left hover:bg-brand-soft/30 transition" onClick={e => { e.stopPropagation(); setOpen(false); onEdit(); }}>✏️ Редактировать</button>
          <button className="px-4 py-2 text-left text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition" onClick={e => { e.stopPropagation(); setOpen(false); onDelete(); }}>🗑️ Удалить</button>
        </div>
      )}
    </div>
  );
}

// Новый компонент карточки задачи
function TaskCard({ task, onClick, children }: { task: any; onClick: () => void; children?: React.ReactNode }) {
  return (
    <div
      className="relative bg-white dark:bg-zinc-800 rounded-xl shadow p-3 border border-brand-ui/10 mb-2 cursor-pointer hover:shadow-xl transition-all"
      onClick={onClick}
    >
      {/* Метки */}
      <div className="flex flex-wrap gap-1 mb-1">
        {task.labels?.map((label: any) => (
          <span key={label.id} className="px-2 py-1 rounded text-xs font-bold" style={{ background: label.color }}>{label.name}</span>
        ))}
      </div>
      {/* Обложка */}
      {task.cover && (
        <img src={task.cover} alt="cover" className="w-full h-32 object-cover rounded-xl mb-2" />
      )}
      {/* Название */}
      <div className="font-semibold text-brand-dark dark:text-white">{task.title}</div>
      {/* Описание */}
      {task.description && (
        <div className="text-brand-ui dark:text-brand-soft text-xs line-clamp-1">{task.description}</div>
      )}
      {/* Иконки */}
      <div className="flex items-center gap-2 mt-2 text-xs text-brand-ui/80">
        {task.attachments?.length > 0 && <span title="Вложения">📎 {task.attachments.length}</span>}
        {task.comments?.length > 0 && <span title="Комментарии">💬 {task.comments.length}</span>}
        {task.checklists?.length > 0 && <span title="Чек-листы">☑️ {task.checklists.length}</span>}
        {task.deadline && <span title="Дедлайн">⏰ {new Date(task.deadline).toLocaleDateString()}</span>}
        {/* Участники */}
        <div className="flex -space-x-2 ml-auto">
          {task.members?.slice(0, 3).map((u: any) => (
            <span key={u.id} className="w-6 h-6 rounded-full bg-brand-ui/30 flex items-center justify-center text-xs font-bold border-2 border-white dark:border-zinc-900">{u.name?.[0]}</span>
          ))}
          {task.members?.length > 3 && (
            <span className="w-6 h-6 rounded-full bg-brand-ui/30 flex items-center justify-center text-xs font-bold border-2 border-white dark:border-zinc-900">+{task.members.length - 3}</span>
          )}
        </div>
      </div>
      {/* Меню */}
      <div className="absolute top-2 right-2">{children}</div>
    </div>
  );
}

// Модалка подтверждения удаления
function ConfirmModal({ open, onClose, onConfirm, text }: { open: boolean; onClose: () => void; onConfirm: () => void; text: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-xs p-6 relative animate-fade-in-up flex flex-col items-center">
        <div className="text-lg font-semibold text-brand-dark dark:text-white mb-4 text-center">{text}</div>
        <div className="flex gap-4 mt-2">
          <button onClick={onClose} className="bg-brand-ui hover:bg-brand-secondary text-white font-semibold px-6 py-2 rounded-2xl shadow-soft transition-all text-base cursor-pointer">Отмена</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-2xl shadow-soft transition-all text-base cursor-pointer">Удалить</button>
        </div>
      </div>
    </div>
  );
}

export function KanbanBoard({ initialCategories, orgId }: Props) {
  const sensors = useSensors(useSensor(PointerSensor));
  const router = useRouter();
  // Состояния для модалки задачи
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  // Состояния для модалок удаления
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  // Заглушки для данных задачи
  const labels: any[] = [];
  const checklists: any[] = [];
  const comments: any[] = [];
  const attachments: any[] = [];
  // Заглушки для функций-обработчиков
  const handleUpdate = (data: any) => {};
  const handleDelete = () => {};
  const handleLabelAdd = (labelId: string) => {};
  const handleLabelRemove = (labelId: string) => {};
  const handleChecklistAdd = (title: string) => {};
  const handleChecklistToggle = (checklistId: string, itemId: string) => {};
  const handleCommentAdd = (text: string) => {};
  const handleAttachmentAdd = (file: File) => {};
  const handleAttachmentRemove = (id: string) => {};

  // Подключение к Ably для realtime-обновлений
  useAblyChannel(`org-${orgId}`, () => {
    router.refresh();
  });

  // Удаление задачи через API endpoint
  const handleDeleteTask = async (taskId: string) => {
    await fetch("/api/tasks/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: taskId, orgId }),
    });
    router.refresh();
    setDeleteTaskId(null);
  };
  // Удаление категории через API endpoint
  const handleDeleteCategory = async (categoryId: string) => {
    await fetch("/api/categories/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: categoryId, orgId }),
    });
    router.refresh();
    setDeleteCategoryId(null);
  };

  // Создание задачи через API endpoint
  const handleTaskCreate = async (categoryId: string, title: string) => {
    await fetch("/api/tasks/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        categoryId,
        organizationId: orgId,
      }),
    });
    router.refresh();
  };
  // Создание категории через API endpoint
  const handleCategoryCreate = async (name: string) => {
    await fetch("/api/categories/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        organizationId: orgId,
      }),
    });
    router.refresh();
  };
  // Перемещение задачи (drag & drop)
  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    // TODO: реализовать API для перемещения задачи и публикацию события в Ably
    router.refresh();
  }

  // UI
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-4 min-h-[400px]">
        <SortableContext items={initialCategories.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {initialCategories.map(category => (
            <div key={category.id} className="flex-1 min-w-[260px] bg-white/80 dark:bg-zinc-900/80 rounded-2xl shadow-lg p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-brand-dark dark:text-white text-lg">{category.name}</div>
                <CategoryMenu onEdit={() => {}} onDelete={() => setDeleteCategoryId(category.id)} />
              </div>
              {/* TODO: Кнопка редактирования/удаления категории */}
              <form onSubmit={e => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const input = form.elements.namedItem("title") as HTMLInputElement;
                if (input.value.trim()) {
                  handleTaskCreate(category.id, input.value.trim());
                  input.value = "";
                }
              }} className="flex gap-2 mb-2">
                <input name="title" type="text" required minLength={2} maxLength={64} placeholder="Новая задача..." className="flex-1 rounded-xl border border-brand-ui/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent bg-white dark:bg-zinc-900 text-brand-dark dark:text-white placeholder:text-brand-ui/60" />
                <button type="submit" className="bg-brand-accent hover:bg-brand-secondary active:scale-95 text-white font-semibold px-4 rounded-xl shadow-soft transition-all duration-200 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-accent/60">+</button>
              </form>
              <SortableContext items={category.tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-3">
                  {category.tasks.length === 0 && <div className="text-brand-ui/70 text-sm">Нет задач</div>}
                  {category.tasks.map(task => (
                    <TaskCard key={task.id} task={task} onClick={() => { setSelectedTask(task); setModalOpen(true); }}>
                      <TaskMenu onEdit={() => { setSelectedTask(task); setModalOpen(true); }} onArchive={() => {}} onDelete={() => setDeleteTaskId(task.id)} />
                    </TaskCard>
                  ))}
                </div>
              </SortableContext>
            </div>
          ))}
          {/* Кнопка создания категории */}
          <div className="flex flex-col min-w-[220px] justify-start items-center bg-white/60 dark:bg-zinc-900/60 rounded-2xl shadow-lg p-4 gap-3 h-fit mt-2">
            <form onSubmit={e => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const input = form.elements.namedItem("name") as HTMLInputElement;
              if (input.value.trim()) {
                handleCategoryCreate(input.value.trim());
                input.value = "";
              }
            }} className="flex flex-col gap-2 w-full">
              <input name="name" type="text" required minLength={2} maxLength={32} placeholder="Новая категория..." className="rounded-xl border border-brand-ui/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent bg-white dark:bg-zinc-900 text-brand-dark dark:text-white placeholder:text-brand-ui/60" />
              <button type="submit" className="bg-brand-accent hover:bg-brand-secondary active:scale-95 text-white font-semibold px-4 py-2 rounded-xl shadow-soft transition-all duration-200 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-accent/60">Добавить</button>
            </form>
          </div>
        </SortableContext>
      </div>
      <TaskModal
        open={modalOpen && !!selectedTask}
        onClose={() => setModalOpen(false)}
        task={selectedTask || {}}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        labels={labels}
        onLabelAdd={handleLabelAdd}
        onLabelRemove={handleLabelRemove}
        checklists={checklists}
        onChecklistAdd={handleChecklistAdd}
        onChecklistToggle={handleChecklistToggle}
        comments={comments}
        onCommentAdd={handleCommentAdd}
        attachments={attachments}
        onAttachmentAdd={handleAttachmentAdd}
        onAttachmentRemove={handleAttachmentRemove}
      />
      {/* Модалки подтверждения удаления */}
      <ConfirmModal open={!!deleteTaskId} onClose={() => setDeleteTaskId(null)} onConfirm={() => handleDeleteTask(deleteTaskId!)} text="Удалить задачу?" />
      <ConfirmModal open={!!deleteCategoryId} onClose={() => setDeleteCategoryId(null)} onConfirm={() => handleDeleteCategory(deleteCategoryId!)} text="Удалить категорию со всеми задачами?" />
    </DndContext>
  );
} 
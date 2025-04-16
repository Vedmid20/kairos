'use client';

import Modal from 'react-modal';
import { X } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description: string;
  deadline: string;
  created_at: string;
  updated_at: string;
  reporter_name: string;
  type_name: string;
}

interface TaskModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  task: Task | null;
  onEdit: () => void;
  onDelete: () => void;
}

Modal.setAppElement('#__next');

export default function TaskModal({ isOpen, onRequestClose, task, onEdit, onDelete }: TaskModalProps) {
  if (!task) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-white dark:bg-grey rounded-2xl shadow-xl w-[80rem] h-full max-h-[45rem] overflow-auto p-6 mx-auto m-auto relative outline-none"
      overlayClassName="fixed inset-0 bg-black/50 flex items-start justify-center z-50">
        <div className="flex justify-between">
            <h2 className="text-xl font-bold mb-4">Тут буде тікет ID</h2>
            <button onClick={onRequestClose} className="text-gray-500 hover:text-black my-auto">
                <X className="w-5 h-5" />
            </button>
        </div>


        <div className="">
        <div className="">
            <div className="space-y-2">
                <h2 className='text-2xl mb-3'>{task.title}</h2>
                <p className='bg-black/10 p-2 rounded-lg border-t-8 border-black/10 dark:bg-white/15 dark:border-white/20'>{task.description}</p>
                <p>Deadline <span className="px-2 bg-black/10 rounded-full">{task.deadline}</span></p>
                <p>Type <span className="px-2 bg-violet-500/50 rounded-full">{task.type_name}</span></p>
                <p><span className="font-semibold">Репортер:</span> {task.reporter_name}</p>
                <p><span className="font-semibold">Створено:</span> {task.created_at}</p>
                <p><span className="font-semibold">Оновлено:</span> {task.updated_at}</p>
            </div>

            <div className="flex justify-start mt-6">
                <button
                onClick={onEdit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                >
                Змінити
                </button>
                <button
                onClick={onDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                Видалити
                </button>
            </div>
        </div>

        <div className="">

        </div>
        </div>
    
      
    </Modal>
  );
}

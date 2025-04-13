import React, { useState } from "react";
import '@/app/styles/globals.scss';
import '@/app/styles/mixins.scss';
import { Trash } from "lucide-react";

interface SelectionToastProps {
  selectedCount: number;
  onDelete: () => void;
}

const SelectionToast: React.FC<SelectionToastProps> = ({ selectedCount, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  if (selectedCount === 0) return null;

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    setShowConfirm(false);
    onDelete();
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <div className="fixed bottom-5 text-white left-1/2 bg-black/50 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg flex items-center gap-4 ">
        <span>{selectedCount} tickets selected</span>
        <button
          onClick={handleDeleteClick}
          className="text-white p-2 px-4 rounded-lg hover:bg-red-500/50 hover:text-white flex gap-2">
          <Trash/>Delete
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white dark:bg-grey p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg mb-4">Are you sure you want to delete {selectedCount} ticket(s)?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-500/50 text-white px-4 py-2 rounded transition-all">
                Confirm
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SelectionToast;

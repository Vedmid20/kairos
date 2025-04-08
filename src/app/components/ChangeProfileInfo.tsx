import React, { useState } from "react";
import '@/app/styles/globals.scss';
import '@/app/styles/mixins.scss';

interface ChangeInfoProps {
  editableFields: Record<string, string>;
  user: Record<string, string>;
  onChange: () => void;
}

const ChangeProfileInfo: React.FC<ChangeInfoProps> = ({ onChange, editableFields, user }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const hasChanges = Object.keys(editableFields).some(key => editableFields[key] !== user[key]);

  if (!hasChanges) return null;

  const handlePatchClick = () => setShowConfirm(true);
  const confirmPatch = () => {
    setShowConfirm(false);
    onChange();
  };
  const cancelPatch = () => setShowConfirm(false);

  return (
    <>
      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 border-2 px-6 py-3 rounded-lg shadow-lg flex items-center gap-4">
        <span>Do you want to change your info?</span>
        <button
          onClick={handlePatchClick}
          className="header-button p-2 px-4 rounded-lg hover:bg-violet-500/50 hover:text-white flex gap-2">
          Change
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white dark:bg-grey p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg mb-4">Are you sure you want to change your info?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmPatch}
                className="bg-violet-500/50 hover:bg-violet-600/50 text-white px-4 py-2 rounded transition-all">
                Confirm
              </button>
              <button
                onClick={cancelPatch}
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

export default ChangeProfileInfo;

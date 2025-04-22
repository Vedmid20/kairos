import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

if (typeof window !== 'undefined') {
  Modal.setAppElement('#__next');
}

const schema = yup.object({
  task_type_name: yup.string()
    .required('Type name is required')
    .min(2, 'Type name must be at least 2 characters')
    .max(20, 'Type name cant be most than 20 characters'),
});

export default function CreateTicketTypeModal({ isOpen, onClose, onCreated }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [token, setToken] = useState<string | null>(null);
  const projectID = Cookies.get('selectedProject');

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const onSubmit = async (data: any) => {
    try {
      await axios.post(`http://localhost:8008/api/v1/task-types/?projectId=${projectID}`, {
        task_type_name: data.task_type_name,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      reset();
      onClose();
      if (onCreated) onCreated();
    } catch (error) {
      console.error("Error creating task type:", error.response?.data || error.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Create Ticket Type Modal"
      className="relative z-30 max-w-md w-full p-6 bg-white dark:bg-grey rounded-lg shadow-lg"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      closeTimeoutMS={200}>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Create a new ticket type</h2>
        <button onClick={onClose} className="text-lg">
          <X />
        </button>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={{
          hidden: { opacity: 0, y: '5%' },
          visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 75, damping: 7 } },
          exit: { opacity: 0, y: '25%' },
        }}
        className="mt-4">
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="task_type_name" className='flex'>Type name<p className='text-red-400 ml-1'>*</p></label>
            <input
              id="task_type_name"
              type="text"
              {...register('task_type_name')}
              placeholder="Enter type name"
              className="w-72 p-2 rounded border"
            />
            {errors.task_type_name && <p className="error">{errors.task_type_name.message}</p>}
          </div>

          <button type="submit" className="form-button mt-4 w-full">
            Create
          </button>
        </form>
      </motion.div>
    </Modal>
  );
}

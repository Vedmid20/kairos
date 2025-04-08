import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import '../styles/globals.scss';
import '../styles/mixins.scss';
import './components-styles.scss';
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Cookies from 'js-cookie';

if (typeof window !== 'undefined') {
  Modal.setAppElement('#__next');
}

const schema = yup.object({
  title: yup.string()
    .matches(/^[a-zA-Z0-9 _.,!]+$/, 'Title can only contain letters, numbers')
    .min(2, 'Title must be at least 2 characters long')
    .max(200, 'Title cant be longer than 200 characters')
    .required('Title is required'),
  description: yup.string()
    .matches(/^[a-zA-Z0-9 _.,!?@*%]+$/, 'Description can only contain letters, numbers and !?@*%')
    .min(5, 'Description must be at least 5 characters long')
    .max(1000, 'Description cant be longer than 1000 characters')
    .required('Description is required'),
  deadline: yup.string().required('Deadline is required'),
  type: yup.string().required('Type is required'),
});

export default function ChangeTicketModal({ isOpen, onClose, ticket }) {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [taskTypes, setTaskTypes] = useState<{ id: number, task_type_name: string }[]>([]);
  const projectID = Cookies.get('selectedProject');
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded: any = jwtDecode(storedToken);
        setUserId(decoded.user_id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
      if (ticket?.type && taskTypes.length > 0) {
        setValue("type", ticket.type);
      }
    }, [ticket?.type, taskTypes, setValue]);

  useEffect(() => {
    if (isOpen && token) {
      document.body.style.overflow = 'hidden';
      axios.get('http://127.0.0.1:8008/api/v1/task-types/', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => setTaskTypes(response.data))
      .catch(error => console.error("Error fetching task types:", error));
      if (ticket) {
        setValue("title", ticket.title);
        setValue("description", ticket.description);
        setValue("deadline", ticket.deadline);
        setValue("type", ticket.type);
      }
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, token, JSON.stringify(ticket), setValue]);

  const onSubmit = async (data: any) => {
    if (!userId) {
      console.error("User is not authenticated");
      return;
    }

    try {
      console.log(ticket.id)
      await axios.patch(`http://127.0.0.1:8008/api/v1/tasks/${ticket.id}/`, {
        project: projectID,
        title: data.title,
        description: data.description,
        reporter: userId,
        deadline: data.deadline,
        type: data.type,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Ticket updated successfully");
      reset();
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error updating ticket:", error.response?.data || error.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Edit Ticket Modal"
      className="relative z-50 max-w-lg w-full p-6 bg-white dark:bg-grey rounded-lg shadow-lg"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      closeTimeoutMS={200}>

      <div className="flex">
        <h2 className="text-xl">Edit Ticket</h2>
        <button
          onClick={onClose}
          className="absolute right-10 text-lg font-semibold text-gray-500 hover:text-gray-700">
          x
        </button>
      </div>
      <hr className='mt-5' />

      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={{
          hidden: { opacity: 0, y: '5%' },
          visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 75, damping: 7 } },
          exit: { opacity: 0, y: '25%' },
        }}
        transition={{ duration: 0.3 }}
        className="relative z-50">

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="title" className='flex'>Title<p className='text-red-400'>*</p></label>
            <input id='title' type="text" {...register('title')} placeholder='Enter title' />
            {errors.title && <p className="error">{errors.title.message}</p>}
          </div>

          <div className="form-group mr-36">
            <label htmlFor="type" className='flex'>Type<p className='text-red-400'>*</p></label>
            <select id='type' {...register('type')} className="selector bg-transparent rounded-lg dark:bg-grey" defaultValue={ticket?.type || ""} >
              <option value="" disabled>Select a type</option>
              {taskTypes.map(type => (
                <option key={type.id} value={type.id}>{type.task_type_name}</option>
              ))}
            </select>
            {errors.type && <p className="error">{errors.type.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="description" className='flex'>Description<p className='text-red-400'>*</p></label>
            <textarea id='description' {...register('description')} placeholder='Enter description' className="resize-none h-52 text-[.8rem] w-96" />
            {errors.description && <p className="error">{errors.description.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="deadline" className='flex'>Deadline<p className='text-red-400'>*</p></label>
            <input type='date' id='deadline' {...register('deadline')} />
            {errors.deadline && <p className="error">{errors.deadline.message}</p>}
          </div>

          <button type="submit" className='form-button'>
            Update
          </button>
        </form>
      </motion.div>
    </Modal>
  );
}

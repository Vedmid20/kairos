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
import { X } from 'lucide-react';
import CreateTicketTypeModal from './CreateTicketType';

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
    .max(2500, 'Description cant be longer than 2500 characters')
    .required('Description is required'),
  deadline: yup.string().required('Deadline is required'),
  type: yup.string().required('Type is required'),
});

export default function CreateTicketModal({ isOpen, onClose, children }) {
  const { register, handleSubmit, setError, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [taskTypes, setTaskTypes] = useState<{ id: number, task_type_name: string }[]>([]);
  const projectID = Cookies.get('selectedProject')
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      setToken(storedToken);
      console.log(projectID);
      
      try {
        const decoded: any = jwtDecode(storedToken);
        setUserId(decoded.user_id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      axios.get(`http://localhost:8008/api/v1/task-types/?projectId=${projectID}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => setTaskTypes(response.data)
      )
      .catch(error => console.error("Error fetching task types:", error));
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, token]);

  const onSubmit = async (data: any) => {
    if (!userId) {
      console.error("User is not authenticated");
      return;
    }

    try {
      await axios.post('http://localhost:8008/api/v1/tasks/', {
        project: projectID,
        title: data.title,
        description: data.description,
        reporter: userId,
        deadline: data.deadline,
        type: data.type,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Ticket created successfully");
      reset();
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error creating ticket:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    console.log("Updated taskTypes:", taskTypes);
  }, [taskTypes]);
  

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Create Ticket Modal"
      className="relative z-50 max-w-lg w-full p-6 bg-white dark:bg-grey rounded-lg shadow-lg"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      closeTimeoutMS={200}>
      
      <div className="flex z-50">
        <h2 className="text-xl">Create a new ticket</h2>
        <button
          onClick={onClose}
          className="absolute right-10 text-lg font-semibold ">
          <X />
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

          <div className="form-group">
            <label htmlFor="type" className='flex'>Type<p className='text-red-400'>*</p></label>
            <div className="flex gap-2">

              <select id='type' {...register('type')} className="selector bg-transparent rounded-lg dark:bg-grey px-2">
                <option value="" disabled>Select a type</option>
                {taskTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.task_type_name}</option>
                ))}
              </select>
                <button type="button" className='m-auto rounded-lg dark:bg-grey selector px-3' onClick={() => setIsTypeModalOpen(true)}>Add new</button>

            </div>
            {errors.type && <p className="error">{errors.type.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="description" className='flex'>Description<p className='text-red-400'>*</p></label>
            <textarea id='description' {...register('description')} placeholder='Enter description' className="!transform-none resize-none h-52 text-[.8rem] w-96" />
            {errors.description && <p className="error">{errors.description.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="deadline" className='flex'>Deadline<p className='text-red-400'>*</p></label>
            <input type='date' id='deadline' {...register('deadline')} />
            {errors.deadline && <p className="error">{errors.deadline.message}</p>}
          </div>

          <button type="submit" className='form-button'>
            Create
          </button>
        </form>
        
        {children}
      </motion.div>
      <CreateTicketTypeModal
        isOpen={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
        onCreated={() => {
          axios.get(`http://localhost:8008/api/v1/task-types/?projectId=${projectID}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          .then(response => setTaskTypes(response.data));
        }}
      />

    </Modal>
  );
}

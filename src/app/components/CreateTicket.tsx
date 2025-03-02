import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import '../styles/globals.scss';
import '../styles/mixins.scss';
import './components-styles.scss'
import {useRouter} from "next/navigation";
import {jwtDecode} from "jwt-decode";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";

Modal.setAppElement('#__next');

const schema = yup.object({
  title: yup
    .string()
    .matches(/^[a-zA-Z0-9 _.,!]+$/, 'Title can only contain letters, numbers')
    .min(2, 'Title must be at least 2 characters long')
    .max(200, 'Title cant be longer then 200 characters')
    .required('Title is required'),
  description: yup
    .string()
    .matches(/^[a-zA-Z0-9 _.,!?@*%]+$/, 'Description can only contain letters, numbers and !?@*%')
    .min(5, 'Description must be at least 5 characters long')
    .max(1000, 'Description cant be longer then 1000 characters')
    .required('Description is required'),
  deadline: yup
    .string()
    .required('Deadline is required'),
  type: yup
    .string()
    .required('Type is required')
});

export default function CreateTicketModal({ isOpen, onClose, children }) {
  const { register, handleSubmit, setError, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
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
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

    const modalVariants = {
        hidden: { opacity: 0, y: '5%' },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 75, damping: 7 } },
        exit: { opacity: 0, y: '25%' },
    };


  return (
      <Modal
          isOpen={isOpen}
          onRequestClose={onClose}
          contentLabel="Example Modal"
          className="relative z-50 max-w-lg w-full p-6 bg-white rounded-lg shadow-lg"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          closeTimeoutMS={200}>
        <div className="flex">
          <h2 className="text-xl">Create a new ticket</h2>
          <button
              onClick={onClose}
              className="absolute right-3 text-lg font-semibold text-gray-500 hover:text-gray-700">
            Close
          </button>
        </div>
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            transition={{duration: 0.3}}
            className="relative z-50">
          <div className="form">
            <form action="">

              <div className="form-group">
                <label htmlFor="type" className='flex'>Type<p className='text-red-400'>*</p></label>

                {errors.type && <p className="error">{errors.type.message}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="title" className='flex'>Title<p className='text-red-400'>*</p></label>
                <input
                    id='title'
                    type="text"
                    {...register('title', {required: 'Title is required'})}
                    placeholder='Enter title'
                />
                {errors.title && <p className="error">{errors.title.message}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="description" className='flex'>Description<p className='text-red-400'>*</p></label>
                <textarea
                    id='description'
                    {...register('description', {required: 'Description is required'})}
                    placeholder='Enter description'
                    className="resize-none"
                />
                {errors.description && <p className="error">{errors.description.message}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="deadline" className='flex'>Deadline<p className='text-red-400'>*</p></label>
                <input
                    type='date'
                    id='deadline'
                    {...register('deadline', {required: 'Deadline is required'})}
                />
                {errors.deadline && <p className="error">{errors.deadline.message}</p>}
              </div>

            </form>
          </div>
          {children}
        </motion.div>
      </Modal>
  );
}

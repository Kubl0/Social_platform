import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { addChatMessage } from '../components/api';
import { useSession } from 'next-auth/react';

interface ChatFormProps {
    userId: string;
    secondUser: string;
    // onSend: (message: string) => void;
    onSend: () => void;
}

const ChatForm: React.FC<ChatFormProps> = ({userId, secondUser, onSend}) => {
    const {data: session} = useSession();

    const formik = useFormik({
        initialValues: {
            message: '',
            userId: userId,
            secondUser: secondUser,
        },
        validationSchema: Yup.object({
            message: Yup.string().required('Message is required'),
        }),
        onSubmit: (values) => {
            // onSend(values.message);
            onSend();
            addChatMessage(userId, secondUser, values.message, session).then((r) => {
                formik.resetForm();
            });
        },
    });

    
    return (
        <form onSubmit={formik.handleSubmit}>
          <div className="w-full">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              rows={3}
            />
            {formik.touched.message && formik.errors.message && (
              <div className="text-red-500 text-sm">{formik.errors.message}</div>
            )}
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full"
            >
              Send
            </button>
          </div>
        </form>
      );
      
    };
            
export default ChatForm;
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { addPost } from './api';
import { useSession } from 'next-auth/react';

interface PostFormProps {
    onClose: () => void; // Callback function for close button
    wallId: string;
}

const PostForm: React.FC<PostFormProps> = ({onClose, wallId}) => {
    const { data: session } = useSession();

    const formik = useFormik({
        initialValues: {
            postContent: '',
            wallId: wallId,
        },
        validationSchema: Yup.object({
            postContent: Yup.string().required('Post content is required'),
        }),
        onSubmit: (values) => {
            addPost(values, session).then((r) => {
                if(r === 200){
                    onClose();
                    window.location.reload();
                }
            });
            formik.resetForm();
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
                <label htmlFor="postContent" className="block text-sm font-medium text-gray-700">
                    Post Content
                </label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={formik.values.postContent}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    rows={3}
                />
                {formik.touched.postContent && formik.errors.postContent && (
                    <div className="text-red-500 text-sm">{formik.errors.postContent}</div>
                )}
            </div>
            <div className="flex justify-between">
                <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2" onClick={onClose}>
                    Close
                </button>
                <button
                    type="submit"
                    className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Post
                </button>

            </div>
        </form>
    );
};

export default PostForm;

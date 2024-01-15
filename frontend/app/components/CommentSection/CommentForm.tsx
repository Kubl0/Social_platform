import React from 'react';
import { Field, Form, Formik } from 'formik';

interface CommentFormProps {
    onSubmit: any;
    error: string | null;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit, error }) => (
    <Formik initialValues={{ newComment: '' }} onSubmit={onSubmit}>
        <Form className="mt-4">
            <Field
                type="text"
                name="newComment"
                placeholder="Add a new comment..."
                className={`border p-2 w-full rounded-md ${error ? 'border-red-500' : ''}`}
            />

            <div className="flex flex-row">
                <div className="text-red-500 text-sm w-[90%]">{error}</div>
                <div className="flex justify-end w-full mt-2">
                    <button
                        type="submit"
                        className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Add Comment
                    </button>
                </div>
            </div>
        </Form>
    </Formik>
);

export default CommentForm;

import React, { useEffect, useState } from 'react';
import {addComment, getComments} from '@/app/components/api';
import { Comment } from '@/types/apiTypes';
import {Field, Form, Formik, FormikHelpers} from "formik";
import {useSession} from "next-auth/react";

interface CommentsComponentProps {
    postId: string;
    onClose: () => void;
}

const CommentsComponent: React.FC<CommentsComponentProps> = ({ postId, onClose }) => {
    const { data: session } = useSession();
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        getComments(postId).then((fetchedComments) => {
            setComments(fetchedComments);
        });
    }, [postId]);

    const handleNewCommentSubmit = async (values: { newComment: string }, { resetForm }: FormikHelpers<{ newComment: string }>) => {
        await addComment(postId, values.newComment, session);

        const updatedComments = await getComments(postId);
        setComments(updatedComments);
        resetForm();
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 w-[40%] rounded-lg h-[80%] overflow-y-auto">
                <div className="flex flex-row justify-between sticky">
                <h2 className="text-2xl font-semibold mb-4">Comments</h2>
                <button
                    className="px-4 mb-4 py-1 rounded-md border border-red-500 bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring focus:border-red-700"
                    onClick={onClose}
                >Close</button>
                </div>
                {comments.map((comment) => (
                    <div key={comment.id}>
                        <div className="p-3">
                            <div className="flex justify-between">
                            <span className="font-semibold">{comment.userId}</span>
                            <span className="text-sm text-gray-500"> {comment.date}</span>
                            </div>
                            <span className="text-sm text-gray-500 "> {comment.content}</span>
                        </div>
                    </div>
                ))}
                <Formik
                    initialValues={{ newComment: '' }}
                    onSubmit={handleNewCommentSubmit}
                >
                    <Form className="mt-4">
                        <Field
                            type="text"
                            name="newComment"
                            placeholder="Add a new comment..."
                            className="border p-2 w-full"
                        />
                        <div className="flex justify-end w-full mt-2">
                            <button type="submit" className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                Add Comment
                            </button>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    );
};

export default CommentsComponent;

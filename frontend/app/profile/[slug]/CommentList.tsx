import React, {useEffect, useState} from 'react';
import {addComment, getComments, getUser} from '@/app/components/api';
import {Comment, FoundUser} from '@/types/apiTypes';
import {Field, Form, Formik, FormikHelpers} from "formik";
import {useSession} from "next-auth/react";
import Image from "next/image";

interface CommentsComponentProps {
    postId: string;
    onClose: () => void;
    refresh: () => void;
}

const CommentsComponent: React.FC<CommentsComponentProps> = ({postId, onClose, refresh}) => {
    const {data: session} = useSession();
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentUserData, setCommentUserData] = useState<{ [key: string]: FoundUser }>({});
    const [refreshComments, setRefreshComments] = useState(false);

    useEffect(() => {
        getComments(postId).then((fetchedComments) => {
            setComments(fetchedComments);
            const userDataPromises = fetchedComments.map(comment =>
                getUser(comment.userId).then(user => ({userId: comment.userId, user}))
            );

            // Wait for all promises to resolve
            Promise.all(userDataPromises).then(usersData => {
                const userMap = Object.fromEntries(usersData.map(({userId, user}) => [userId, user]));
                setCommentUserData(userMap);
            });
        });
    }, [postId, refreshComments]);

    const handleNewCommentSubmit = async (values: { newComment: string }, {resetForm}: FormikHelpers<{
        newComment: string
    }>) => {
        await addComment(postId, values.newComment, session);

        const updatedComments = await getComments(postId);
        setComments(updatedComments);
        refresh();
        setRefreshComments(!refreshComments);
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
                    >Close
                    </button>
                </div>
                {comments.map((comment) => (
                    <div key={comment.id}>
                        <div className="p-3">
                            <div className="flex justify-between">
                                <div className="flex items-center">
                                    {/* Display user profile picture */}
                                    <Image
                                        src={commentUserData[comment.userId]?.profilePicture ?? 'https://www.charitycomms.org.uk/wp-content/uploads/2019/02/placeholder-image-square.jpg'}
                                        alt="Profile"
                                        className="rounded-full mr-2"
                                        width={25}
                                        height={25}
                                    />
                                    <span className="text-md font-semibold">
                                {commentUserData[comment.userId]?.username}
                                </span>
                                </div>
                                <span className="text-sm text-gray-500"> {comment.date}</span>
                            </div>
                            <div className="flex flex-row justify-between mt-2">
                                <span className="text-sm text-gray-500 "> {comment.content}</span>
                                <div className="">
                                    {session?.user?.id === comment.userId && (
                                        <div className="mt-[-5px]">
                                            <button
                                                className="text-sm text-slate-600 cursor-pointer mr-3"
                                                onClick={() => {
                                                    alert('edit')
                                                }
                                                }
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="text-sm text-slate-600 cursor-pointer"
                                                onClick={() => {
                                                    alert('delete')
                                                }}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <Formik
                    initialValues={{newComment: ''}}
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
                            <button type="submit"
                                    className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
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

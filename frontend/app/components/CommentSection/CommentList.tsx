import React, {useEffect, useState} from 'react';
import {addComment, getComments, getUser, removeComment, updateComment, getPost} from '@/app/components/api';
import {Comment, FoundUser, Post} from '@/types/apiTypes';
import {FormikHelpers} from 'formik';
import {useSession} from 'next-auth/react';
import {Session} from 'next-auth';
import CommentForm from "@/app/components/CommentSection/CommentForm";
import CommentItem from "@/app/components/CommentSection/CommentItem";
import Gravatar from "react-gravatar";
import DOMPurify from "dompurify";

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
    const [editComment, setEditComment] = useState('');
    const [editPostContent, setEditPostContent] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [editError, setEditError] = useState<string | null>(null);
    const [post, setPost] = useState<Post | null>(null)
    const [postUser, setPostUser] = useState<FoundUser | null>(null)

    useEffect(() => {
        getComments(postId).then((fetchedComments) => {
            setComments(fetchedComments);
            const userDataPromises = fetchedComments.map((comment) =>
                getUser(comment.userId).then((user) => ({userId: comment.userId, user}))
            );

            // Wait for all promises to resolve
            Promise.all(userDataPromises).then((usersData) => {
                const userMap = Object.fromEntries(usersData.map(({userId, user}) => [userId, user]));
                setCommentUserData(userMap);
            });

            getPost(postId).then(post => {
                setPost(post)
                getUser(post.userId).then(user =>{
                    setPostUser(user)
                })
            })

            if(post == null || postUser == null){
                setRefreshComments(!refreshComments)
            }


        });
    }, [postId, refreshComments, post, postUser]);

    const handleNewCommentSubmit = async (
        values: { newComment: string },
        {resetForm}: FormikHelpers<{ newComment: string }>
    ) => {
        handleCancelEdit();
        await addComment(postId, values.newComment, session).then(async (r: any) => {
            if (r.status === 200) {
                resetForm();
                setRefreshComments(!refreshComments);
                refresh();
                setError(null)
            } else {
                setError(await r.text())
                setEditComment('');
                setEditPostContent('');
                setEditError("")
            }
        });
    };

    const handleEditClick = (postId: string, content: string) => {
        setEditComment(postId);
        setEditPostContent(content);
    };

    const handleSaveEdit = async (
        postId: string,
        session: Session | null,
        commentId: string,
        editPostContent: string
    ) => {
        await updateComment(postId, commentId, editPostContent, session).then(async (r: any) => {
                if (r.status !== 200) {
                    setEditError("Comment must not be empty")
                } else {
                    setEditComment('');
                    setEditPostContent('');
                    setRefreshComments(!refreshComments);
                    refresh();
                }
            }
        );
    };

    const handleCancelEdit = () => {
        setEditComment('');
        setEditPostContent('');
        setEditError("");
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 w-[40%] rounded-lg h-[80%] overflow-y-auto">
                <div
                    className="relative flex flex-col min-w-0 break-words bg-white mb-10 shadow-lg rounded-lg p-5">
                    <div className="flex-auto lg:pt-2 pl-5 pb-2">
                        <div className="flex flex-row items-center mb-2 justify-between">
                            <div className="flex items-center">
                                {/* Display user profile picture */}
                                <Gravatar email={postUser?.email ? postUser?.email : ""} size={30} className="rounded-full mr-2"/>
                                <p>{postUser?.username}</p>
                            </div>
                            <p className="text-sm text-slate-600 uppercase ml-2 align mr-5">{post?.date}</p>
                        </div>
                        <h4 className="text-[1.1em] leading-normal mb-2 text-slate-700" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post?.content ? post?.content : "") }} />
                    </div>
                </div>
                <div className="flex flex-row justify-between sticky">
                    <h2 className="text-2xl font-semibold mb-4">Comments</h2>
                    <button
                        className="px-4 mb-4 py-1 rounded-md border border-red-500 bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring focus:border-red-700"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
                {comments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        userData={commentUserData[comment.userId] || {}}
                        session={session}
                        onEditClick={handleEditClick}
                        onRemoveComment={() => {
                            removeComment(comment.id, session, postId).then(() => {
                                setRefreshComments(!refreshComments);
                            });
                        }}
                        isEditing={editComment === comment.id}
                        editPostContent={editPostContent}
                        onCancelEdit={handleCancelEdit}
                        onSaveEdit={() => handleSaveEdit(postId, session, comment.id, editPostContent)}
                        onEditContentChange={(e) => setEditPostContent(e.target.value)}
                        editError={editError}
                    />
                ))}
                <CommentForm onSubmit={handleNewCommentSubmit} error={error} />
            </div>
        </div>
    );
};

export default CommentsComponent;

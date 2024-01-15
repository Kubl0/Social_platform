// CommentUtils.ts
import { addComment, updateComment, removeComment } from '@/app/components/api';
import { Session } from 'next-auth';
import React from "react";

export const handleNewCommentSubmit = async (
    postId: string,
    values: { newComment: string },
    session: Session | null,
    setRefreshComments: React.Dispatch<React.SetStateAction<boolean>>,
    refresh: () => void,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    handleCancelEdit: () => void,
    resetForm: () => void
) => {
    handleCancelEdit();
    try {
        const r = await addComment(postId, values.newComment, session);
        // @ts-ignore
        if (r.status === 200) {
            resetForm();
            setRefreshComments((prev) => !prev);
            refresh();
            setError(null);
        } else {
            // @ts-ignore
            setError(await r.text());
        }
    } catch (error) {
        // Handle error
        console.error('Error adding comment:', error);
    }
};

export const handleEditClick = (postId: string, content: string, setEditComment: React.Dispatch<React.SetStateAction<string>>, setEditPostContent: React.Dispatch<React.SetStateAction<string>>) => {
    setEditComment(postId);
    setEditPostContent(content);
};

export const handleSaveEdit = async (
    postId: string,
    session: Session | null,
    commentId: string,
    editPostContent: string,
    setEditComment: React.Dispatch<React.SetStateAction<string>>,
    setEditPostContent: React.Dispatch<React.SetStateAction<string>>,
    setRefreshComments: React.Dispatch<React.SetStateAction<boolean>>,
    refresh: () => void,
    setEditError: React.Dispatch<React.SetStateAction<string | null>>
) => {
    try {
        const r = await updateComment(postId, commentId, editPostContent, session);
        // @ts-ignore
        if (r.status !== 200) {
            setEditError('Comment must not be empty');
        } else {
            setEditComment('');
            setEditPostContent('');
            setRefreshComments((prev) => !prev);
            refresh();
        }
    } catch (error) {
        // Handle error
        console.error('Error updating comment:', error);
    }
};

export const handleCancelEdit = (setEditComment: React.Dispatch<React.SetStateAction<string>>, setEditPostContent: React.Dispatch<React.SetStateAction<string>>, setEditError: React.Dispatch<React.SetStateAction<string | null>>) => {
    setEditComment('');
    setEditPostContent('');
    setEditError('');
};

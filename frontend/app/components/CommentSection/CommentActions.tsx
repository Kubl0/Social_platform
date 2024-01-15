// CommentActions.tsx
import React from 'react';
import { Comment } from '@/types/apiTypes';
import { Session } from 'next-auth';

interface CommentActionsProps {
    comment: Comment;
    session: Session | null;
    onEditClick: () => void;
    onRemoveComment: () => void;
}

interface CommentEditProps {
    editPostContent: string;
    onCancelEdit: () => void;
    onSaveEdit: () => void;
    onEditContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    editError: string | null;
}

export const CommentActions: React.FC<CommentActionsProps> = ({ comment, session, onEditClick, onRemoveComment }) => (
    <div className="flex flex-row">
        {session?.user?.id === comment.userId && (
            <div className="mt-[-5px]">
            <button className="text-sm text-slate-600 cursor-pointer mr-3" onClick={onEditClick}>
          ✏️
        </button>
        <button className="text-sm text-slate-600 cursor-pointer" onClick={onRemoveComment}>
          🗑️
        </button>
        </div>
)}
{session?.user?.type === 'admin' && session?.user?.id !== comment.userId && (
    <button className="text-sm text-slate-600 cursor-pointer" onClick={onRemoveComment}>
        🗑️
      </button>
)}
</div>
);

export const CommentEdit: React.FC<CommentEditProps> = ({
                                                     editPostContent,
                                                     onCancelEdit,
                                                     onSaveEdit,
                                                     onEditContentChange,
                                                     editError,
                                                 }) => (
    <div className="flex flex-col w-full">
        <div className="flex flex-row w-full">
      <textarea
          value={editPostContent}
          onChange={onEditContentChange}
          className="w-full h-10 text-sm p-2 border rounded"
      />
            <button onClick={onCancelEdit} className="text-md text-slate-600 cursor-pointer w-0 relative left-[-50px]">
                ❌
            </button>
            <button onClick={onSaveEdit} className="text-md text-slate-600 cursor-pointer w-0 relative left-[-27px]">
                ✔️
            </button>
        </div>
        <div className={`text-red-500 text-sm w-[90%]`}>{editError}</div>
    </div>
);



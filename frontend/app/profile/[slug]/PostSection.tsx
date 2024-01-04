import React, { useEffect, useState } from 'react';
import { getUserName } from '@/app/components/api';
import { PostSectionProps } from '@/types/apiTypes';
import CommentList from "@/app/profile/[slug]/CommentList";
import LikeList from "@/app/profile/[slug]/LikeList";
import PostForm from "@/app/components/PostForm";



const PostSection: React.FC<PostSectionProps> = ({ posts , slug}) => {
    const [usernames, setUsernames] = useState<{ [key: string]: string }>({});
    const [selectedLike, setSelectedLike] = useState<string | null>(null);
    const [selectedComment, setSelectedComment] = useState<string | null>(null);
    const [isAddPostPopupOpen, setIsAddPostPopupOpen] = useState(false);

    useEffect(() => {
        posts?.forEach(post => {
            getUserName(post.userId).then(username => {
                setUsernames(prevUsernames => ({ ...prevUsernames, [post.userId]: username }));
            });
        });
    }, [posts]);

    const handleAddPostClick = () => {
        setIsAddPostPopupOpen(true);
    };

    const handleCloseAddPostPopup = () => {
        setIsAddPostPopupOpen(false);
    };

    const renderAddPostPopup = () => (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-[40%]">
                <h2 className="text-2xl font-semibold mb-4">Add Post</h2>
                <div className="">
                    <PostForm onClose={handleCloseAddPostPopup} slug={slug} />
                </div>
            </div>
        </div>
    );

    const handlePopupOpen = (postId: string, type: 'like' | 'comment') => {
        type === 'like' ? setSelectedLike(postId) : setSelectedComment(postId);
    };

    const handleClosePopup = () => {
        setSelectedLike(null);
        setSelectedComment(null);
    };

    const renderPopup = (title: string, content: React.ReactNode) => (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">{title}</h2>
                {content}
                <button className="mt-4" onClick={handleClosePopup}>
                    Close
                </button>
            </div>
        </div>
    );

    const renderCommentsComponent = () => selectedComment && (
        <CommentList postId={selectedComment} onClose={() => setSelectedComment(null)} />
    );

    const renderLikesComponent = () => selectedLike && (
        <LikeList />
    );


    return (
        <div className="flex flex-wrap justify-center w-full">
            <div className="relative mx-auto md:max-w-[96%] mt-6 break-words bg-white w-full mb-6 shadow-lg rounded-xl pb-3">
                <div className="py-6 border-b border-gray-300 text-center">
                    <div className="flex justify-center items-center">
                        <div className="w-full lg:w-10/12 flex items-center justify-between">
                            <span>&nbsp;</span>
                            <h4 className="text-2xl font-semibold leading-normal text-slate-700">&nbsp;&nbsp;&nbsp;Posts</h4>
                            <button
                                type="submit"
                                className="text-2xl font-semibold leading-normal bg-violet-600 px-2.5 pb-[2px] rounded-full text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                onClick={handleAddPostClick}
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
                {(posts?.length === 0) && (
                    <div className="flex justify-center items-center">
                        <div className="w-full flex items-center justify-center mt-12 mb-10">
                            <h4 className="text-2xl font-semibold leading-normal text-slate-700">No posts yet</h4>
                        </div>
                    </div>
                )}
                {posts?.map(post => (
                    <div key={post.id} className="w-full px-4 pt-5">
                        <div className="relative flex flex-col min-w-0 break-words bg-white mb-2 shadow-lg rounded-lg p-5">
                            <div className="flex-auto lg:pt-2 pl-5 pb-2">
                                <div className="flex flex-row items-center mb-2 justify-between">
                                    <p className="text-xl text-slate-600 font-bold uppercase">{usernames[post.userId]}</p>
                                    <p className="text-sm text-slate-600 uppercase ml-2 align mr-5">{post.date}</p>
                                </div>
                                <h4 className="text-[1.1em] leading-normal mb-2 text-slate-700">{post.content}</h4>
                                <div className="flex flex-row items-center">
                                    <button
                                        className="text-sm text-slate-600 mt-3 cursor-pointer"
                                        onClick={() => handlePopupOpen(post.id, 'like')}
                                    >
                                        {post.likes.length} likes
                                    </button>
                                    &nbsp;&nbsp;
                                    <button
                                        className="text-sm text-slate-600 mt-3 cursor-pointer"
                                        onClick={() => handlePopupOpen(post.id, 'comment')}
                                    >
                                        {post.comments.length} comments
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {isAddPostPopupOpen && renderAddPostPopup()}
            {selectedLike && renderPopup('Likes', renderLikesComponent())}
            {selectedComment && renderPopup('Comments', renderCommentsComponent())}
        </div>
    );
};

export default PostSection;

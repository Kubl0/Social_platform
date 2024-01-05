import React, { useEffect, useState } from 'react';
import { getUserName } from '@/app/components/api';
import { PostSectionProps } from '@/types/apiTypes';
import CommentList from "@/app/profile/[slug]/CommentList";
import LikeList from "@/app/profile/[slug]/LikeList";
import { useSession } from "next-auth/react";


const FriendsPosts: React.FC<PostSectionProps> = ({ posts, slug }) => {
    const [usernames, setUsernames] = useState<{ [key: string]: string }>({});
    const [selectedLike, setSelectedLike] = useState<string | null>(null);
    const [selectedComment, setSelectedComment] = useState<string | null>(null);
    const [user, setUser] = useState("");
    const { data: session } = useSession();
    const [sortingOption, setSortingOption] = useState("");

    useEffect(() => {


        posts?.forEach(post => {
            getUserName(post.wallId).then(userName => {
                setUser(userName);
            });
            getUserName(post.userId).then(username => {
                setUsernames(prevUsernames => ({ ...prevUsernames, [post.userId]: username }));
            });
        });


    }, [posts, session?.user?.id]);



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

    const sortByComments = () => {
        setSortingOption("comments");
        posts?.sort((a, b) => {
            return b.comments.length - a.comments.length;
        });
    }

    const sortByLikes = () => {
        setSortingOption("likes");
        posts?.sort((a, b) => {
            return b.likes.length - a.likes.length;
        });
    }

    const sortByDate = () => {
        setSortingOption("date");
        posts?.sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
    }

    const viewRandomPosts = () => {
        setSortingOption("random");
        posts?.sort((a, b) => {
            return 0.5 - Math.random();
        });
    }





    return (
        <div className="flex flex-wrap justify-center w-full">
            <div
                className="relative mx-auto md:max-w-[96%] mt-6 break-words bg-white w-full mb-6 shadow-lg rounded-xl pb-3">
                <div className="flex justify-center">
                    <div className="flex flex-row items-center">
                        <button
                            className="text-sm text-slate-600 mt-3 cursor-pointer"
                            onClick={() => sortByComments()}
                        >
                            Sort by comments
                        </button>
                        &nbsp;&nbsp;
                        <button
                            className="text-sm text-slate-600 mt-3 cursor-pointer"
                            onClick={() => sortByLikes()}
                        >
                            Sort by likes
                        </button>
                        &nbsp;&nbsp;
                        <button
                            className="text-sm text-slate-600 mt-3 cursor-pointer"
                            onClick={() => sortByDate()}
                        >
                            Sort by date
                        </button>
                        &nbsp;&nbsp;
                        <button className="text-sm text-slate-600 mt-3 cursor-pointer" onClick={() => viewRandomPosts()}>
                            View random posts
                        </button>
                    </div>
                </div>

                <div className="py-6 border-b border-gray-300 text-center">
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

                        <div
                            className="relative flex flex-col min-w-0 break-words bg-white mb-2 shadow-lg rounded-lg p-5">

                            <div className="flex-auto lg:pt-2 pl-5 pb-2">
                                <div className="flex flex-row items-center mb-2 justify-between">
                                    <p className="text-xl text-slate-600 font-bold uppercase">
                                        {user !== usernames[post.userId] ? `${usernames[post.userId]} > ${user}` : usernames[post.userId]}
                                    </p>
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
            {selectedLike && renderPopup('Likes', renderLikesComponent())}
            {selectedComment && renderPopup('Comments', renderCommentsComponent())}
        </div>
    );
};

export default FriendsPosts;

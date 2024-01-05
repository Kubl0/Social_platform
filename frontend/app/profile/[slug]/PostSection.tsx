import React, {useEffect, useState} from 'react';
import {addLike, getUser, getUserName, isFriend, removeLike, isLiked} from '@/app/components/api';
import {FoundUser, PostSectionProps} from '@/types/apiTypes';
import CommentList from "@/app/profile/[slug]/CommentList";
import LikeList from "@/app/profile/[slug]/LikeList";
import PostForm from "@/app/components/PostForm";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import Image from "next/image";


const PostSection: React.FC<PostSectionProps> = ({posts, slug, refresh}) => {
    const [userProfileData, setUserProfileData] = useState<{ [key: string]: FoundUser }>({});
    const [usernames, setUsernames] = useState<{ [key: string]: string }>({});
    const [selectedLike, setSelectedLike] = useState<string | null>(null);
    const [selectedComment, setSelectedComment] = useState<string | null>(null);
    const [isAddPostPopupOpen, setIsAddPostPopupOpen] = useState(false);
    const [user, setUser] = useState("");
    const [isFriendCheck, setIsFriendCheck] = useState(false);
    const {data: session} = useSession();
    const [likedStatus, setLikedStatus] = useState<{ [key: string]: boolean }>({});
    const [hoveredPostId, setHoveredPostId] = useState<string | null>(null);


    useEffect(() => {
        getUserName(slug).then(username => {
            setUser(username);
        });

        posts?.forEach(post => {
            getUserName(post.userId).then(() => {

                getUserName(post.userId).then(username => {
                    setUsernames(prevUsernames => ({...prevUsernames, [post.userId]: username}));
                });
                    // Fetch user data including profile picture
                getUser(post.userId).then(userData => {
                    setUserProfileData(prevData => ({...prevData, [post.userId]: userData}));
                });

                isLiked(post.id, session).then(isLiked => {
                    setLikedStatus(prevLikedStatus => ({...prevLikedStatus, [post.id]: isLiked}));
                });
            });
        });

        isFriend(slug, session?.user?.id).then(isFriend => {
                setIsFriendCheck(isFriend);
            }
        );

    }, [slug, posts, session]);

    const handleAddPostClick = () => {
        setIsAddPostPopupOpen(true);
    };

    const handleCloseAddPostPopup = () => {
        setIsAddPostPopupOpen(false);
        refresh();
    };

    const renderAddPostPopup = () => (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-[40%]">
                <h2 className="text-2xl font-semibold mb-4">Add Post</h2>
                <div className="">
                    <PostForm onClose={handleCloseAddPostPopup} wallId={slug}/>
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
        <CommentList postId={selectedComment} refresh={refresh} onClose={() => {
            setSelectedComment(null)
        }}/>
    );

    const renderLikesComponent = () => selectedLike && (
        <LikeList postId={selectedLike} onClose={() => {
            setSelectedLike(null)
        }}/>
    );


    function handleLikeClick(id: string, session: Session | null) {
        addLike(id, session).then(() => {
            refresh();
        });
    }

    function handleUnlikeClick(id: string, session: Session | null) {
        removeLike(id, session).then(() => {
            refresh();
        });
    }

    return (
        <div className="flex flex-wrap justify-center w-full">
            <div
                className="relative mx-auto md:max-w-[96%] mt-6 break-words bg-white w-full mb-6 shadow-lg rounded-xl pb-3">
                <div className="py-6 border-b border-gray-300 text-center">
                    <div className="flex justify-center items-center">
                        <div
                            className={`w-full lg:w-10/12 flex items-center justify-${isFriendCheck ? 'between' : 'center'}`}>
                            <span>&nbsp;</span>
                            <h4 className="text-2xl font-semibold leading-normal text-slate-700">&nbsp;&nbsp;&nbsp;Posts</h4>
                            {isFriendCheck && (
                                <button
                                    type="submit"
                                    className="text-2xl font-semibold leading-normal bg-violet-600 px-2.5 pb-[2px] rounded-full text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    onClick={handleAddPostClick}
                                >
                                    +
                                </button>
                            )}
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
                    <div key={post.id} className="w-full px-4 pt-5" onMouseEnter={() => setHoveredPostId(post.id)}
                         onMouseLeave={() => setHoveredPostId(null)}>
                        <div
                            className="relative flex flex-col min-w-0 break-words bg-white mb-2 shadow-lg rounded-lg p-5">
                            <div className="flex-auto lg:pt-2 pl-5 pb-2">
                                <div className="flex flex-row items-center mb-2 justify-between">
                                    <div className="flex items-center">
                                        {/* Display user profile picture */}
                                        <Image
                                            src={userProfileData[post.userId]?.profilePicture ?? 'https://www.charitycomms.org.uk/wp-content/uploads/2019/02/placeholder-image-square.jpg'}
                                            alt="Profile"
                                            className="rounded-full mr-2"
                                            width={30}
                                            height={30}
                                        />
                                        <p className="text-xl text-slate-600 font-bold uppercase">
                                            {user !== usernames[post.userId] ? `${usernames[post.userId]} > ${user}` : usernames[post.userId]}
                                        </p>
                                    </div>
                                    <p className="text-sm text-slate-600 uppercase ml-2 align mr-5">{post.date}</p>
                                </div>
                                <h4 className="text-[1.1em] leading-normal mb-2 text-slate-700">{post.content}</h4>
                                <div className="flex flex-row items-center justify-between">
                                    <div>
                                        <button onClick={() => {
                                            likedStatus[post.id] ? handleUnlikeClick(post.id, session) : handleLikeClick(post.id, session)
                                        }}
                                        className={`border p-1 rounded-full ${likedStatus[post.id] ? 'bg-violet-500' : 'bg-violet-100'}`}
                                        >
                                            👍
                                        </button>
                                        &nbsp;&nbsp;
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
                                    <div className={`mr-5 ${hoveredPostId === post.id ? 'visible' : 'hidden'}`}>
                                        {session?.user?.id === post.userId && (
                                            <>
                                                <button
                                                    className="text-lg text-slate-600 cursor-pointer mr-3"
                                                    onClick={() => {
                                                        alert('edit')
                                                    }
                                                    }
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="text-lg text-slate-600 cursor-pointer"
                                                    onClick={() => {
                                                        alert('delete')
                                                    }}
                                                >
                                                    🗑️
                                                </button>

                                            </>
                                        )}
                                    </div>
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

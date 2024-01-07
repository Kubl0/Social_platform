import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
    addLike,
    deletePost,
    getUser,
    getUserName,
    isFriend,
    isLiked,
    removeLike,
    updatePost,
} from '@/app/components/api';
import {FoundUser, Post, PostSectionProps} from '@/types/apiTypes';
import CommentList from '@/app/components/CommentSection/CommentList';
import LikeList from '@/app/components/PostSection/LikeList';
import PostForm from '@/app/components/PostForm';
import Image from 'next/image';

const PostSection: React.FC<PostSectionProps> = ({ posts, slug, refresh }) => {
    const [userProfileData, setUserProfileData] = useState<{ [key: string]: FoundUser }>({});
    const [usernames, setUsernames] = useState<{ [key: string]: string }>({});
    const [selectedLike, setSelectedLike] = useState<string | null>(null);
    const [selectedComment, setSelectedComment] = useState<string | null>(null);
    const [isAddPostPopupOpen, setIsAddPostPopupOpen] = useState(false);
    const [isFriendCheck, setIsFriendCheck] = useState(false);
    const { data: session } = useSession();
    const [likedStatus, setLikedStatus] = useState<{ [key: string]: boolean }>({});
    const [hoveredPostId, setHoveredPostId] = useState<string | null>(null);
    const [editPost, setEditPost] = useState('');
    const [wallUser, setWallUser] = useState<{ [key: string]: string }>({});
    const [editPostContent, setEditPostContent] = useState('');

    useEffect(() => {
        async function initialProcessPosts(posts: Post[] | null) {
            for (const post of posts ?? []) {
                const username = await getUserName(post.userId);
                setUsernames((prevUsernames) => ({ ...prevUsernames, [post.userId]: username }));

                const userData = await getUser(post.userId);
                setUserProfileData((prevData) => ({ ...prevData, [post.userId]: userData }));

                const isPostLiked = await isLiked(post.id, session);
                setLikedStatus((prevLikedStatus) => ({ ...prevLikedStatus, [post.id]: isPostLiked }));
            }
        }(initialProcessPosts(posts).then());

        async function processPosts(posts: Post[] | null) {
            for (const post of posts ?? []) {
                if (post.wallId !== null && post.wallId !== post.userId) {
                    const wallUsername = await getUserName(post.wallId);
                    setWallUser((prevUsernames) => ({...prevUsernames, [post.wallId]: wallUsername}));
                }
            }
        }(processPosts(posts).then());

        isFriend(slug, session?.user?.id).then((friendStatus) => setIsFriendCheck(friendStatus));
    }, [slug, posts, session]);

    const handleAddPostClick = () => setIsAddPostPopupOpen(true);

    const handleCloseAddPostPopup = () => {
        setIsAddPostPopupOpen(false);
        refresh();
    };

    const handlePopupOpen = (postId: string, type: 'like' | 'comment') => {
        type === 'like' ? setSelectedLike(postId) : setSelectedComment(postId);
    };

    const handleClosePopup = () => {
        setSelectedLike(null);
        setSelectedComment(null);
    };

    const handleLikeClick = (id: string) => addLike(id, session).then(refresh);

    const handleUnlikeClick = (id: string) => removeLike(id, session).then(refresh);

    const handleEditClick = (postId: string, content: string) => {
        setEditPost(postId);
        setEditPostContent(content);
    };

    const handleSaveEdit = async (postId: string) => {
        await updatePost(postId, editPostContent, session);
        setEditPost('');
        setEditPostContent('');
        refresh();
    };

    const handleCancelEdit = () => {
        setEditPost('');
        setEditPostContent('');
    };

    const renderAddPostPopup = () => (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-[40%]">
                <h2 className="text-2xl font-semibold mb-4">Add Post</h2>
                <div className="">
                    <PostForm onClose={handleCloseAddPostPopup} wallId={slug} />
                </div>
            </div>
        </div>
    );

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

    const renderCommentsComponent = () => selectedComment && <CommentList postId={selectedComment} refresh={refresh} onClose={() => setSelectedComment(null)} />;

    const renderLikesComponent = () => selectedLike && <LikeList postId={selectedLike} onClose={() => setSelectedLike(null)} />;

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
                                            {wallUser[post.wallId] !== usernames[post.userId] && wallUser[post.wallId] !== undefined ? `<a href={\`/profile/${post.userId}\`} className="text-black hover:underline flex flex-row">${usernames[post.userId]}</a> > 
                                            <a href={\`/profile/${post.wallId}\`} className="text-black hover:underline flex flex-row">${wallUser[post.wallId]}</a>` : <a href={`/profile/${post.userId}`} className="text-black hover:underline flex flex-row">{usernames[post.userId]}</a>
                                            }
                                        </p>
                                    </div>
                                    <p className="text-sm text-slate-600 uppercase ml-2 align mr-5">{post.date}</p>
                                </div>
                                {editPost !== post.id ? (
                                    <h4 className="text-[1.1em] leading-normal mb-2 text-slate-700">{post.content}</h4>
                                ) : (
                                    <div className="w-full">
                                        <textarea
                                            value={editPostContent}
                                            onChange={(e) => setEditPostContent(e.target.value)}
                                            className="w-[98%] h-20 p-2 border rounded"
                                        />
                                        <div className="flex justify-end mr-5">
                                        <button
                                            className="text-lg text-slate-600 cursor-pointer mr-3"
                                            onClick={() => handleSaveEdit(post.id)}
                                        >
                                            ✔️
                                        </button>
                                        <button
                                            className="text-lg text-slate-600 cursor-pointer"
                                            onClick={handleCancelEdit}
                                        >
                                            ❌
                                        </button>
                                        </div>
                                    </div>
                                )}
                                <div className="flex flex-row items-center justify-between">
                                    <div>
                                        <button onClick={() => {
                                            likedStatus[post.id] ? handleUnlikeClick(post.id) : handleLikeClick(post.id)
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
                                        {session?.user?.id === post.userId && editPost !== post.id && (
                                            <>
                                                <button
                                                    className="text-lg text-slate-600 cursor-pointer mr-3"
                                                    onClick={() => {
                                                        handleEditClick(post.id, post.content);
                                                    }
                                                    }
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="text-lg text-slate-600 cursor-pointer"
                                                    onClick={() => {
                                                        deletePost(post.id, session).then(() => {
                                                            refresh();
                                                        });
                                                    }}
                                                >
                                                    🗑️
                                                </button>

                                            </>
                                        )}
                                        {session?.user?.type === 'admin' && session?.user?.id !== post.userId && (
                                            <button
                                                className="text-lg text-slate-600 cursor-pointer"
                                                onClick={() => {
                                                    deletePost(post.id, session).then(() => {
                                                        refresh();
                                                    });
                                                }}
                                            >
                                                🗑️
                                            </button>
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

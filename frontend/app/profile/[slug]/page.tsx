'use client'

import React, {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import ProfileHeader from './ProfileHeader';
import PostSection from './PostSection';
import {getPosts, getUser, getPostsByWallId} from "@/app/components/api";
import {FoundUser, Post} from "@/types/apiTypes";
import FriendRequestList from "@/app/profile/[slug]/FriendRequestList";
import FriendList from "@/app/profile/[slug]/FriendList";


const ProfilePage: React.FC<{ params: { slug: string } }> = ({ params }) => {
    const { data: session } = useSession();
    const { slug } = params;
    const [isFriendRequestListVisible, setFriendRequestListVisible] = useState(false);

    const handleMouseEnter = () => {
        setFriendRequestListVisible(true);
    }

    const handleMouseLeave = () => {
        setFriendRequestListVisible(false);
    }

    const [foundUser, setFoundUser] = useState<FoundUser | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const user = await getUser(slug);
                setFoundUser(user);

                const ownPosts = await getPosts(slug);
                const friendPosts = await getPostsByWallId(slug);

                const combinedPosts = [...ownPosts, ...friendPosts];
                const uniquePosts = Array.from(new Set(combinedPosts.map(post => post.id)))
                    .map(postId => combinedPosts.find(post => post.id === postId));

                // Sort posts by date
                uniquePosts.sort((a, b) => {
                    if (a && b) {
                        return new Date(b.date).getTime() - new Date(a.date).getTime();
                    }
                    return 0;
                }
                );

                // @ts-ignore
                setPosts(uniquePosts);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }
        fetchData().then(r => r);
    }, [slug]);

    return (
        <div>
        {!isFriendRequestListVisible && <div className="absolute top-[22%] bg-violet-600 w-[3%] h-[38%] text-center rounded-l-3xl font-bold p-2 verticaltext text-white text-lg" onMouseEnter={handleMouseEnter}>FRIEND REQUESTS</div>}
        <div className="flex justify-center">
            <div className="w-[20%]" onMouseLeave={handleMouseLeave}>
                <div className="friend-request-container" style={{ opacity: isFriendRequestListVisible ? 1 : 0, visibility: isFriendRequestListVisible ? 'visible' : 'hidden' }}>
                    <FriendRequestList slug={slug} session={session} />
                </div>
            </div>
            <div className="flex flex-col items-center w-[60%]">
                <ProfileHeader foundUser={foundUser} session={session} params={params} />
                <PostSection posts={posts} slug={slug}/>
            </div>
            <div className="w-[20%]">
                <FriendList friends={foundUser?.friends} slug={slug} session={session} />
            </div>
        </div>
        </div>
    );
};

export default ProfilePage;

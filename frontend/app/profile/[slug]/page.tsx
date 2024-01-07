'use client'

import React, {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import ProfileHeader from './ProfileHeader';
import PostSection from '../../components/PostSection/PostSection';
import {getUser, getPostsByWallId} from "@/app/components/api";
import {FoundUser, Post} from "@/types/apiTypes";
import FriendRequestList from "@/app/profile/[slug]/FriendRequestList";
import FriendList from "@/app/components/FriendList";


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
    const [refresh, setRefresh] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                if (!slug) {
                    return;
                }
                const user = await getUser(slug);
                setFoundUser(user);

                const friendPosts = await getPostsByWallId(slug);

                // @ts-ignore
                setPosts(friendPosts);
            } catch (error) {
                setError("Something went wrong. Please try again later.");
            }

        }
        fetchData().then(r => r);
    }, [slug, refresh]);

    const handleRefresh = () => {
        setRefresh(!refresh);
    }

    if(slug == "undefined") {
        window.location.href = "/";
    }

    if(error) {
        return (
            <div className="flex justify-center items-center h-screen mt-[-10%]">
                <div className="border-2 border-red-400 text-white p-8 rounded-md shadow-lg">
                    <h1 className="text-3xl font-bold text-center text-red-400">{error}</h1>
                </div>
            </div>
        )
    }

    return (
        <div>
        {!isFriendRequestListVisible && session?.user.id == slug && <div className="absolute top-[22%] bg-violet-600 w-[3%] h-[38%] text-center rounded-l-3xl font-bold p-2 verticaltext text-white text-lg" onMouseEnter={handleMouseEnter}>FRIEND REQUESTS</div>}
        <div className="flex justify-center">
            <div className="w-[20%]" onMouseLeave={handleMouseLeave}>
                <div className="friend-request-container" style={{ opacity: isFriendRequestListVisible ? 1 : 0, visibility: isFriendRequestListVisible ? 'visible' : 'hidden' }}>
                    <FriendRequestList slug={slug} session={session} refresh={handleRefresh} refreshReq={refresh}/>
                </div>
            </div>
            <div className="flex flex-col items-center w-[60%]">
                <ProfileHeader foundUser={foundUser} session={session} params={params} />
                <PostSection posts={posts} slug={slug} refresh={handleRefresh}/>
            </div>
            <div className="w-[20%]">
                <FriendList friends={foundUser?.friends} slug={slug} session={session} refresh={handleRefresh} />
            </div>
        </div>
        </div>
    );
};

export default ProfilePage;

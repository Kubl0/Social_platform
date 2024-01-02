'use client'

import React, {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import ProfileHeader from './ProfileHeader';
import PostSection from './PostSection';
import {getPosts, getUser} from "@/app/components/api";
import {FoundUser, Post} from "@/types/apiTypes";


const ProfilePage: React.FC<{ params: { slug: string } }> = ({ params }) => {
    const { data: session } = useSession();
    const { slug } = params;

    const [foundUser, setFoundUser] = useState<FoundUser | null>(null);
    const [posts, setPosts] = useState<Post[] | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const user = await getUser(slug);
                setFoundUser(user);
                const fetchedPosts = await getPosts(slug);
                setPosts(fetchedPosts);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }
        fetchData().then(r => r);
    }, [slug]);

    return (
        <>
            <ProfileHeader foundUser={foundUser} session={session} params={params} />
            <PostSection posts={posts} />
        </>
    );
};

export default ProfilePage;

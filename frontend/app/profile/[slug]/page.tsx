'use client'

import React, {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import ProfileHeader from './ProfileHeader';
import PostSection from './PostSection';

interface FoundUser {
    username: string;
    profilePicture: string;
    description: string;
    email: string;
}

interface Post {
    id: string;
    content: string;
    date: string;
    userId: string;
    likes: Array<string>;
    comments: Array<Comment>;
}

interface Comment {
    id: string;
    userId: string;
    postId: string;
    content: string;
    date: string;
}

async function getUser(slug: string): Promise<FoundUser> {
    const response = await fetch(`http://localhost:8080/api/users/get/${slug}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Error fetching user data');
    }

    return response.json();
}

async function getPosts(slug: string): Promise<Post[]> {
    const response = await fetch(`http://localhost:8080/api/users/getPosts/${slug}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Error fetching user data');
    }

    const posts = await response.json();

    return posts.map((post: any) => ({
        ...post,
        date: new Date(Number(post.date)).toLocaleDateString(),
    }));
}

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
                const posts = await getPosts(slug);
                setPosts(posts);
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

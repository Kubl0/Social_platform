
import React from "react";

interface Post {
    id: string;
    content: string;
    date: Date;
    userId: string;
    likes: Array<string>;
    comments: Array<Comment>;

    map(arg0: (post: any) => JSX.Element): React.ReactNode;
}

interface Comment {
    id: string;
    userId: string;
    postId: string;
    content: string;
    date: string;
}

async function getPosts(slug: string): Promise<Post> {
    const response = await fetch(`http://localhost:8080/api/users/getPosts/${slug}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Error fetching user data');
    }

    let posts = await response.json();

    posts = posts.map((post: any) => {
        post.date = new Date(Number(post.date)).toLocaleDateString();
        return post;
    });

    return posts;
}

export default async function PostList({ slug }: { slug: string }) {
    const posts = await getPosts(slug);
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {posts.map((post) => (
                <div key={post.id} className="bg-white shadow overflow-hidden sm:rounded-lg w-[600px]">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{post.title}</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">{post.date}</p>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                <dt className="text-sm font-medium text-gray-500">Content</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{post.content}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            ))}
        </div>
    );
}
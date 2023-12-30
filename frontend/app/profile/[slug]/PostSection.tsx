import React, {useEffect, useState} from 'react';

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

interface PostSectionProps {
    posts: Post[] | null;
}

const getUserName = (userId: string) => {
    return fetch(`http://localhost:8080/api/users/get/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((data) => {
            return data.username;
        });
}

const PostSection: React.FC<PostSectionProps> = ({ posts }) => {
    const [usernames, setUsernames] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        // Fetch usernames for all post users
        if (posts) {
            posts.forEach((post) => {
                getUserName(post.userId).then((username) => {
                    setUsernames((prevUsernames) => ({
                        ...prevUsernames,
                        [post.userId]: username,
                    }));
                });
            });
        }
    }, [posts]);

    return (
        <div className="flex flex-wrap justify-center">
            <div className="relative mx-auto md:max-w-[50%] mt-6 break-words bg-white w-full mb-6 shadow-lg rounded-xl">
                {posts?.map((post) => (
                    <div key={post.id} className="w-full lg:w-9/12 px-4">
                        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg">
                            <div className="flex-auto p-5 lg:p-10">
                                <p className="text-sm text-slate-600 font-bold uppercase">{usernames[post.userId] + ' ' + post.date}</p>
                                <h4 className="text-2xl font-semibold leading-normal mb-2 text-slate-700">{post.content}</h4>
                                <p className="text-sm text-slate-600 mt-3">{post.likes.length} likes</p>
                                <p className="text-sm text-slate-600 mt-3">{post.comments.length} comments</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostSection;

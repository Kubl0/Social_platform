import {Session} from "next-auth";
import {Comment, EditUser, FoundUser, Post, Values} from "@/types/apiTypes";

const API_URL = 'http://localhost:8080/api/users/';

export async function updateUser(slug: string, userData: EditUser, session: Session): Promise<Response> {
    if (!session?.accessToken) {
        throw new Error('Not authenticated');
    }
    return await fetch(`${API_URL}update/${slug}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + session?.accessToken
        },
        body: JSON.stringify(userData),
    });
}

export async function getUserEditData(setEditedUser: (arg0: EditUser) => void, slug: string) {
    try {
        const response = await fetch(`${API_URL}get/${slug}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const user = await response.json();
        setEditedUser(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

export async function getUserName(userId: string) {
    return fetch(`${API_URL}get/${userId}`, {
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

export async function getPosts(slug: string): Promise<Post[]> {
    const response = await fetch(`${API_URL}getPosts/${slug}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Error fetching user data');
    }

    let posts: Post[] = await response.json();

    posts = posts.map((post: any) => {
        post.date = new Date(Number(post.date)).toLocaleString([], {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        });
        return post;
    });

    return posts;
}

export async function getComments(postId: string): Promise<Comment[]> {
    const response = await fetch(`${API_URL}getComments/${postId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Error fetching user data');
    }

    let comments: Comment[] = await response.json();

    comments = comments.map((comment: any) => {
        comment.date = new Date(Number(comment.date)).toLocaleString([], {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        });
        return comment;
    });

    return comments;
}

export async function getUser(slug: string): Promise<FoundUser> {
    const response = await fetch(`${API_URL}get/${slug}`, {
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

export async function addUser(values: Values) {
    try {
        const res = await fetch(`${API_URL}register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: values.email,
                username: values.username,
                password: values.password,
            }),
        });

        if (res.status === 200) {
            return { type: "success", message: await res.text() };
        } else {
            return { type: "error", message: await res.text() };
        }
    } catch (error) {
        return { type: "error", message: error };
    }
}

export const addComment = async (postId: string, commentContent: string, session: Session | null) => {
    try {
        const response = await fetch(`${API_URL}addComment/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.accessToken
            },
            body: JSON.stringify({
                content: commentContent,
                userId: session?.user?.id,
            }),
        });

        if (!response.ok) {
            return new Error('Failed to add comment');
        }

        // Assuming the server returns the newly added comment
        return await response.text();
    } catch (error) {
        console.error('Error adding comment:', error);
        return error;
    }
};

export const addPost = async (postContent: string, session: Session | null) => {
    try{
        const response = await fetch(`${API_URL}addPost/${session?.user.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.accessToken
            },
            body: JSON.stringify({
                content: postContent,
            }),
        });

        if (!response.ok) {
            return new Error('Failed to add post');
        }

        // Assuming the server returns the newly added post
        return response.status;
    } catch (error) {
        console.error('Error adding post:', error);
        throw error;
    }
}

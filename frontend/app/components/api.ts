import {Session} from "next-auth";

import {Comment, EditUser, FoundUser, Post, Values, SendPost} from "@/types/apiTypes";

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

export const getPostsByWallId = async (wallId: string) => {
    try {
        const response = await fetch(`${API_URL}getPostsByWallId/${wallId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

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
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
}

export const isFriend = async (userId: string, friendId: string | undefined) => {
    try {
        const response = await fetch(`${API_URL}isFriend/${userId}/${friendId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await response.json();
    } catch (error) {
        console.error('Error fetching friend status:', error);
        throw error;
    }
}

export async function getUser(id: string): Promise<FoundUser> {
    const response = await fetch(`${API_URL}get/${id}`, {
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
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: values.email,
                username: values.username,
                password: values.password,
            }),
        });

        if (res.status === 200) {
            return {type: "success", message: await res.text()};
        } else {
            return {type: "error", message: await res.text()};
        }
    } catch (error) {
        return {type: "error", message: error};
    }
}

export const addComment = async (postId: string, commentContent: string, session: Session | null) => {
    try {
        return await fetch(`${API_URL}addComment/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.accessToken
            },
            body: JSON.stringify({
                content: commentContent,
                userId: session?.user?.id,
            }),
        })
    } catch (error) {
        console.error('Error adding comment:', error);
        return error;
    }
};

export const addPost = async (postContent: SendPost, session: Session | null) => {
    try {
        const response = await fetch(`${API_URL}addPost/${session?.user.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.accessToken
            },
            body: JSON.stringify({
                content: postContent.postContent,
                wallId: postContent.wallId,
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


export const getFriendRequests = async (slug: string) => {
    try {
        const response = await fetch(`${API_URL}getFriendRequests/${slug}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await response.json();
    } catch (error) {
        console.error('Error fetching friend requests:', error);
        throw error;
    }
}

export const removeFriendRequest = async (friendRequestId: string, session: Session | null) => {
    try {
        const response = await fetch(`${API_URL}deleteFriendRequest/${session?.user?.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.accessToken
            },
            body: friendRequestId,
        });

        if (!response.ok) {
            return new Error('Failed to remove friend request');
        }

        return response
    } catch (error) {
        console.error('Error removing friend request:', error);
        throw error;
    }
}

export const acceptFriendRequest = async (friendRequestId: string, session: Session | null) => {
    try {
        const response = await fetch(`${API_URL}acceptFriendRequest/${session?.user?.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.accessToken
            },
            body: friendRequestId,
        });

        if (!response.ok) {
            return new Error('Failed to accept friend request');
        }

        return response
    } catch (error) {
        console.error('Error accepting friend request:', error);
        throw error;
    }
}

export const getAllFriends = async (friends: string[]) => {
    const res: FoundUser[] = [];
    for (const element of friends) {
        const friend = await getUser(element);
        res.push(friend);
    }

    return res;
}

export const addFriendRequest = async (friendName: string, session: Session | null) => {
    try {
        const response = await fetch(`${API_URL}addFriendRequest/${session?.user?.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.accessToken
            },
            body: friendName,
        });

        if (!response.ok) {
            return response
        }

        return response
    } catch (error) {
        console.error('Error adding friend:', error);
        throw error;
    }

}

export const searchUsers = async (searchTerm: string) => {
    try {
        const response = await fetch(`${API_URL}search/${searchTerm}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await response.json();
    } catch (error) {
        console.error('Error searching users:', error);
        throw error;
    }
}


export const getAllFriendsPosts = async (userId: string) => {
    try {
        const response = await fetch(`${API_URL}getPostsFromFriends/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

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
    catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
}

export const deleteFriend = async (friendId: string, session: Session | null) => {
    try {
        const response = await fetch(`${API_URL}deleteFriend/${session?.user?.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.accessToken
            },
            body: friendId,
        });

        if (!response.ok) {
            return new Error('Failed to delete friend');
        }

        return response
    } catch (error) {
        console.error('Error deleting friend:', error);
        throw error;
    }
}

export const addLike = async (postId: string, session: Session | null) => {
    try {
        const response = await fetch(`${API_URL}addLike/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + session?.accessToken
                },
                body: session?.user?.id,
            }
        );

        if (!response.ok) {
            return new Error('Failed to add like');
        }

        return response
    } catch (error) {
        console.error('Error adding like:', error);
        throw error;
    }
}

export const removeLike = async (postId: string, session: Session | null) => {
    try {
        const response = await fetch(`${API_URL}deleteLike/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.accessToken
            },
            body: session?.user?.id,
        });

        if (!response.ok) {
            return new Error('Failed to remove like');
        }

        return response

    } catch (error) {
        console.error('Error removing like:', error);
        throw error;
    }
}

export const getLikes = async (postId: string) => {
    try {
        const response = await fetch(`${API_URL}getLikes/${postId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching likes:', error);
        throw error;
    }
}

export const isLiked = async (postId: string, session: Session | null) => {
    try {
        const response = await fetch(`${API_URL}isLiked/${postId}/${session?.user?.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await response.json();
    } catch (error) {
        console.error('Error fetching like status:', error);
        throw error;
    }
}

export const removeComment = async (commentId: string, session: Session | null, postId: string) => {
    try {
        const response = await fetch(`${API_URL}deleteComment/${postId}/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.accessToken
            },
        });

        if (!response.ok) {
            return new Error('Failed to remove comment');
        }

        return response
    } catch (error) {
        console.error('Error removing comment:', error);
        throw error;
    }
}

export const deletePost = async (postId: string, session: Session | null) => {
    try {
        const response = await fetch(`${API_URL}deletePost/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.accessToken
            },
        });

        if (!response.ok) {
            return new Error('Failed to delete post');
        }

        return response
    }
    catch (error) {
        return error;
    }
}

export const updatePost = async (postId: string, postContent: string, session: Session | null) => {
    try{
        const response = await fetch(`${API_URL}updatePost/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.accessToken
            },
            body: postContent,
        });

        if (!response.ok) {
            return new Error('Failed to update post');
        }

        return response
    }
    catch (error) {
        return error;
    }
}

export const updateComment = async (postId: string, commentId: string, commentContent: string, session: Session | null) => {
    try{
        return await fetch(`${API_URL}updateComment/${postId}/${commentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.accessToken
            },
            body: commentContent || '',
        })
    }
    catch (error) {
        return error;
    }
}

export const removeUser = async (userId: string | undefined, session: Session | null) => {
    try {
        const response = await fetch(`${API_URL}removeUser/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.accessToken
            }
        });

        if (!response.ok) {
            return new Error('Failed to remove user');
        }
        return response

    } catch (error) {
        return error;
    }
}


export const getChatMessages = async (userId: string, friendId: string) => {
    try {
        const response = await fetch(`${API_URL}getChatMessages/${userId}/${friendId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await response.json();
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        throw error;
    }
}

export const addChatMessage = async (userId: string, friendId: string, message: string) => {
    try {
        const response = await fetch(`${API_URL}addChatMessage/${userId}/${friendId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        if (!response.ok) {
            return new Error('Failed to add chat message');
        }

        return response
    } catch (error) {
        console.error('Error adding chat message:', error);
        throw error;
    }
}

export const getAllPosts = async (session: Session | null) => {
    try {
        const response = await fetch(`${API_URL}getAllPosts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.accessToken
            },
        });



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
    catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
}

export const getAllUsers = async (session: Session | null) => {
    try {
        const response = await fetch(`${API_URL}list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.accessToken
            },
        });

        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

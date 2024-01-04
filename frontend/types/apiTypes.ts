import {Session} from "next-auth";

export interface EditUser {
    username: string;
    profilePicture: string;
    description: string;
    email: string;
}

export interface FoundUser {
    username: string;
    profilePicture: string;
    description: string;
    email: string;
    friends: string[];
}

export interface FriendRequest {
    id: string;
    senderId: string;
    receiverId: string;
    status: string;
    date: string;
}

export interface ProfileHeaderProps {
    foundUser: FoundUser | null;
    session: Session | null;
    params: { slug: string };
}

export interface Post {
    id: string;
    content: string;
    date: string;
    userId: string;
    likes: Array<string>;
    comments: Array<Comment>;
    wallId: string;
}
export interface Comment {
    id: string;
    userId: string;
    content: string;
    date: string;
}

export interface SendPost {
    postContent: string;
    wallId: string;
}

export interface Values {
    email: string;
    username: string;
    password: string;
}

export interface LoginValues {
    username: string;
    password: string;
}

export interface PostSectionProps {
    posts: Post[] | null;
    slug: string;
}
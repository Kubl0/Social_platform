'use client'
import {useSession} from "next-auth/react";
import {FoundUser, Post} from "@/types/apiTypes";
import {useEffect, useState} from "react";
import {getAllPosts, getAllUsers} from "@/app/components/api";
import PostSection from "@/app/components/PostSection/PostSection";
import UserList from "@/app/components/UserList";
import {redirect} from "next/navigation";

export default function Admin() {
    const {data: session} = useSession();
    const [allUsers, setAllUsers] = useState<FoundUser[]>([]);
    const [allPosts, setAllPosts] = useState<Post[]>([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                if (session?.user?.type == "admin") {
                const users = await getAllUsers(session);
                setAllUsers(users);
                const posts = await getAllPosts(session);
                setAllPosts(posts);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }
        fetchData().then(r => r);
    }, [refresh, session]);

    const handleRefresh = () => {
        setRefresh(!refresh);
    }

    if(session?.user?.type !== "admin") {
        redirect("/");
    }



    return (
        <div className="flex flex-row justify-between">
            <div className="w-[15%] mt-[1%] ml-[-1%]">
                <UserList users={allUsers} refresh={handleRefresh}/>
            </div>
            <div className="w-[85%]">
                <PostSection posts={allPosts} slug={"home"} refresh={handleRefresh}/>
            </div>
        </div>
    )
}

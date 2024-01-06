'use client'


import PostForm from "@/app/components/PostForm";
import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import FriendList from "./components/FriendList";
import {FoundUser, Post} from "@/types/apiTypes";
import {getUser, getAllFriendsPosts} from "@/app/components/api";
import Link from "next/link";
import FriendsPosts from "./homepageassets/FriendsPosts";



const Home: React.FC<{ params: { slug: string } }> = ({ params }) => {
    const [refresh, setRefresh] = useState(false);
    const [isHovered, setIsHovered] = useState('');
    const { slug } = params;
    const {data: session} = useSession();
    const [, setIsAddPostPopupOpen] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [foundUser, setFoundUser] = useState<FoundUser | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                if (session?.user?.id) {
                const user = await getUser(session?.user?.id);
                setFoundUser(user);
                const friendPosts = await getAllFriendsPosts(session?.user?.id);
                setPosts(friendPosts);
                }


            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }
        fetchData().then(r => r);
    }, [slug, session, refresh]);

    const handleCloseAddPostPopup = () => {
        setIsAddPostPopupOpen(false);
    };

    const handleRefresh = () => {
        setRefresh(!refresh);
    }


    if(!session) {
        return (
            <div>
                <p>You are not logged in</p>
            </div>
        );
    }

    return (
        <div className="flex justify-center mt-8">
          {/* Left Sidebar */}
          <div className={`flex-none w-1/5 px-4 fixed left-0`}
          >
            <div>
              <button className={`p-4 rounded ${isHovered === 'left' ? 'bg-violet-100' : ""}`}
            onMouseEnter={() => setIsHovered('left')}
            onMouseLeave={() => setIsHovered('')}>Options</button>
              <button className={`p-4 rounded ${isHovered === 'profile' ? 'bg-violet-100' : ""} flex gap-2`}
            onMouseEnter={() => setIsHovered('profile')}
            onMouseLeave={() => setIsHovered('')}>
                Your, profile - <Link href={`/profile/${session.user?.id}`} className="hover:text-blue-700">{session.user?.username}</Link></button>
            </div>
          </div>
    
          {/* Middle Content */}
          <div className="flex-grow w-3/5 px-4">
            <p className="flex justify-center">Main Content (Posts)</p>
            <div className=" p-4 flex justify-center" >
              <div className="w-1/2">
              <PostForm onClose={handleCloseAddPostPopup} wallId={`${session.user?.id}`} />
                  <FriendsPosts posts={posts} slug={slug} refresh={handleRefresh} />

              </div>
            </div>
          </div>
    
          {/* Right Sidebar */}
          <div className="flex-none w-1/5 px-4 fixed right-0">
            <div>
                <FriendList friends={foundUser?.friends} slug={slug} session={session} refresh={handleRefresh}/>

              
            </div>
          </div>
        </div>
      );
}

export default Home;
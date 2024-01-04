'use client'


import PostForm from "@/app/components/PostForm";
import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import { Session } from "next-auth";
import FriendList from "./homepageassets/FriendList";
import {FoundUser} from "@/types/apiTypes";
import {getUser} from "@/app/components/api";

const Home: React.FC<{ params: { slug: string } }> = ({ params }) => {

    const [isHovered, setIsHovered] = useState('');
    const { slug } = params;

    const {data: session} = useSession();

    const [, setIsAddPostPopupOpen] = useState(false);

    const handleCloseAddPostPopup = () => {
        setIsAddPostPopupOpen(false);
    };

    const [foundUser, setFoundUser] = useState<FoundUser | null>(null);

    if(!session) {
        return (
            <div>
                <p>You are not logged in</p>
            </div>
        );
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const user = await getUser(slug);
                setFoundUser(user);
                console.log(foundUser);
                
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }
        fetchData().then(r => r);
    }, [slug]);

    


    //generalnie ten popup jak bedziesz robil i mial koncepcje jak w tym profilu to mozesz zajumac kod stamtąd, jedynie wallId zmienic na glowne tak jak jest teraz, a tak to lux
    //narazie tak dla testu to wrzucilem, sam formularz dziala ale wiadomo, nie jest tam gdzie powinien byc

    return (
        <div className="flex justify-center mt-8">
          {/* Left Sidebar */}
          <div className={`flex-none w-1/5 px-4`}
          >
            <div>
              <p className={`p-4 rounded ${isHovered === 'left' ? 'bg-violet-100' : ""}`}
            onMouseEnter={() => setIsHovered('left')}
            onMouseLeave={() => setIsHovered('')}>Options</p>
              <p className={`p-4 rounded ${isHovered === 'profile' ? 'bg-violet-100' : ""}`}
            onMouseEnter={() => setIsHovered('profile')}
            onMouseLeave={() => setIsHovered('')}>
                Your, profile - {session.user?.username}</p>
            </div>
          </div>
    
          {/* Middle Content */}
          <div className="flex-grow w-3/5 px-4">
            <p className="flex justify-center">Main Content (Posts)</p>
            <div className=" p-4 flex justify-center" >
              <div className="w-1/2">
              <PostForm onClose={handleCloseAddPostPopup} wallId={"/"} />
              </div>
            </div>
          </div>
    
          {/* Right Sidebar */}
          <div className="flex-none w-1/5 px-4">
            <p className="mb-2 mr-2">Friend List</p>
            <div>
                <FriendList friends={foundUser?.friends} slug={slug} session={session} />
              
            </div>
          </div>
        </div>
      );
}

export default Home;
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { getUser, getChatMessages, addChatMessage, getAllFriends } from "@/app/components/api";
import { FoundUser, Message, Conversation } from "@/types/apiTypes";
import ChatForm from "./ChatForm";
import { getUserName } from "@/app/components/api";
import Image from "next/image";
import Link from "next/link";
const Chatting: React.FC<{ params: { slug: string }}> = () => {
    const { data: session } = useSession();
    const [selectedFriend, setSelectedFriend] = useState<FoundUser | null>(null);
    const [conversations, setConversations] = useState<Message[]>([]);
    const [friends, setFriends] = useState<FoundUser[]>([]);
    const [friendNames, setFriendNames] = useState("");
    

    useEffect(() => {
        async function fetchData() {
            try {
                if (session?.user?.id) {


                    const user = await getUser(session?.user?.id);
                    setFriends(await getAllFriends(user.friends));

                }
            } catch (error) {
                console.error('Error fetching user or friends:', error);
            }
        }

        fetchData();
    }, [session?.user?.id]);

    useEffect(() => {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'visible';
      };
    }, []);
    

    const handleFriendClick = async (friendId: string) => {
        try {
            const friend = await getUser(friendId);
            setSelectedFriend(friend);
            const messages = await getChatMessages(session!.user?.id, friendId);
            
            
            const friendName = await getUserName(friendId);
            setFriendNames(friendName);

            const senderNamePromises = messages.map((message: Message) => getUserName(message.senderId));
            const senderNames = await Promise.all(senderNamePromises);
            const conversations = messages.map((message: Message, index: number) => {
                return {
                    ...message,
                    senderId: senderNames[index],
                };
            });
            setConversations(conversations);
            console.log(conversations)
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };


    return (
        <div className='flex w-screen'>
          {/* Left side - Display Friends List */}
          <div className='p-4 border-r overflow-y-auto '>
            <h2 className='text-lg font-semibold mb-4'>Friends</h2>
            <ul>
              {friends.map((friend) => (
                <li
                  key={friend.id}
                  className={`mb-2 cursor-pointer hover:bg-purple-300 p-2 rounded ${
                    selectedFriend?.id === friend.id ? 'bg-purple-300' : ''
                  }`}
                  onClick={() => handleFriendClick(friend.id)}
                >
                  {friend.username}
                </li>
              ))}
            </ul>
          </div>
      
          {/* Middle - Display Chat Messages */}

          <div className='flex-1 flex flex-col'>
  {selectedFriend && (
    <div className='p-4  flex flex-col h-[83%] '>
      <div className="border-b flex ">
        <Image
          src={
            selectedFriend?.profilePicture ??
            'https://www.charitycomms.org.uk/wp-content/uploads/2019/02/placeholder-image-square.jpg'
          }
          alt="profile picture"
          className="rounded-full mr-3"
          width={40}
          height={40}
        />
        <p className="mt-1 font-semibold">- <Link href={`/profile/${selectedFriend.id}`}>{selectedFriend.username}</Link></p>
      </div>
      <div className="overflow-y-auto flex-1">
        {conversations.map((message) => (
          <div key={message.id}>
            <p>{message.senderId}</p>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
      
    </div>
  )}

  {/* Bottom - Display ChatForm */}
  {selectedFriend && (
    <div className='p-4 bg-purple-300 absolute bottom-0'>
      <ChatForm userId={session!.user?.id} secondUser={selectedFriend.id} />
    </div>
  )}
</div>


        </div>
      );
      
      
};

export default Chatting;

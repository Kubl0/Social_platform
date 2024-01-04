import React, {useEffect, useState} from "react";
import { getAllFriends } from "../components/api";
import Image from "next/image";


const FriendList: React.FC<{ slug: string; session: any; friends: string[] | undefined }> = ({ slug, session, friends }) => {

    const [friendList, setFriendList] = useState<any[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                if (friends) {
                    const fetchedFriends = await getAllFriends(friends);
                    setFriendList(fetchedFriends);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }

        fetchData().then((r) => r);
    }, [friends]);

    return (
        <div className="bg-violet-100 rounded pb-2 w-[90%]">
            <div className="flex flex-col mt-[45%] overflow-y-auto h-[50%]">
                {friendList.length > 0 ? (
                    <div className="pl-[5%]">
                        {friendList.map((friend) => (
                            <div
                                key={friend.id}
                                className="text-sm flex items-center justify-between w-[70%]"
                            >
                                <div className="flex items-center">
                                    <Image
                                        src={friend.profilePicture}
                                        alt="Profile picture"
                                        width={30}
                                        height={30}
                                        className="rounded-full"
                                    />
                                    <p className="ml-2">{friend.username}</p>
                                </div>
                                <div className="flex items-center">
                                    {session?.user?.id === slug && (
                                        <button className="bg-red-500 text-white px-2 rounded-xl pb-0.5">
                                            -
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center">No friends yet</p>
                )}
            </div>
        </div>
    )
}

export default FriendList;
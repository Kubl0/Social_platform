import React, {useState} from "react";
import Image from "next/image";
import {removeUser} from "@/app/components/api";
import {useSession} from "next-auth/react";

const UserList: React.FC<{ users: any[], refresh: () => void }> = ({users, refresh}) => {
    const {data: session} = useSession();
    const [hoveredUser, setHoveredUser] = useState<string | null>(null);

    return (
        <div className="bg-violet-100 rounded-3xl pb-5 w-[90%] ml-10">
            <div className="flex flex-col h-[45vh]">
                <div className="pt-2 pb-2 mb-3 flex items-center justify-between pl-10">
                    <div></div>
                    <h2 className="text-xl font-bold uppercase text-center">
                        User List
                    </h2>
                    <div className="mr-10"></div>
                </div>
                {users.length - 1 > 0 ? (
                    <div className="pl-[5%] overflow-y-auto">
                        {users.map((user) => (
                            // Exclude current user
                            user.id !== session?.user?.id && (
                                <div
                                    key={user.id}
                                    className="text-sm flex items-center justify-between w-[70%] ml-4"
                                    onMouseEnter={() => setHoveredUser(user.id)}
                                    onMouseLeave={() => setHoveredUser(null)}
                                >
                                    <div className="flex">
                                        <div className="mb flex flex-row mb-5">
                                            <a href={`/profile/${user.id}`}
                                               className="text-black hover:underline flex flex-row">
                                                <Image
                                                    src={
                                                        user?.profilePicture ??
                                                        'https://www.charitycomms.org.uk/wp-content/uploads/2019/02/placeholder-image-square.jpg'
                                                    }
                                                    alt="profile picture"
                                                    className="rounded-full mr-3"
                                                    width={40}
                                                    height={40}
                                                />
                                                <p className="w-[75%] font-bold text-lg mt-1">{user.username}</p>
                                            </a>
                                            {hoveredUser === user.id && session?.user?.type === "admin" && (
                                                <button
                                                    onClick={() => {
                                                        removeUser(user?.id, session).then((r: any) => {
                                                            if (r.status === 200) {
                                                                alert("User banned")
                                                                refresh();
                                                            }
                                                        });
                                                    }}
                                                    className="bg-red-300 ml-3 px-2 h-6 mt-2 rounded-md text-xs text-red-800 font-bold"
                                                >
                                                    <p className="emoji font-bold text-sm">X</p>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="text-sm">No users to display</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserList;
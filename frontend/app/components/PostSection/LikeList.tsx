import React, { useEffect, useState } from 'react';
import { getLikes, getUser } from "@/app/components/api";
import { FoundUser } from "@/types/apiTypes";
import Image from "next/image";

const LikeList: React.FC<{ postId: string, onClose: () => void }> = ({ postId, onClose }) => {
    const [likes, setLikes] = useState<string[]>([]);
    const [userProfiles, setUserProfiles] = useState<{ [key: string]: FoundUser }>({});

    useEffect(() => {
        getLikes(postId).then((likesArray) => {
            setLikes(likesArray);

            // Use Promise.all to wait for all getUser promises to resolve
            Promise.all(likesArray.map((userId: string) => getUser(userId)))
                .then((userProfilesArray) => {
                    const updatedUserProfiles = likesArray.reduce((acc: { [x: string]: any; }, userId: string | number, index: number) => {
                        acc[userId] = userProfilesArray[index];
                        return acc;
                    }, {});
                    setUserProfiles((prevUserProfiles) => ({ ...prevUserProfiles, ...updatedUserProfiles }));
                });
        });
    }, [postId]);

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 w-[40%] rounded-lg h-[80%] overflow-y-auto">
                <div className="flex flex-row justify-between sticky">
                    <h2 className="text-2xl font-semibold mb-4">Likes</h2>
                    <button
                        className="px-4 mb-4 py-1 rounded-md border border-red-500 bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring focus:border-red-700"
                        onClick={onClose}
                    >Close
                    </button>
                </div>
                {likes.map((like) => (
                    <div key={like}>
                        <div className="p-3">
                            <div className="flex flex-row justify-between">
                                <div className="flex flex-row">
                                    <Image
                                        src={userProfiles[like]?.profilePicture ?? 'https://www.charitycomms.org.uk/wp-content/uploads/2019/02/placeholder-image-square.jpg'}
                                        alt="Profile"
                                        className="rounded-full mr-2"
                                        width={25}
                                        height={25}
                                    />
                                    <p className="text-md font-semibold">{userProfiles[like]?.username}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LikeList;

import React, {useEffect, useState} from 'react';
import {acceptFriendRequest, getFriendRequests, removeFriendRequest} from '@/app/components/api';
import {FriendRequest} from '@/types/apiTypes';

const FriendRequestList: React.FC<{ slug: string; session: any }> = ({slug, session}) => {
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

    const handleCancelClick = async (friendRequestId: string) => {
        try {
            const result = await removeFriendRequest(friendRequestId, session);

            console.log('Friend request removed successfully:', result);
        } catch (error) {
            console.error('Error removing friend request:', error);
        }
    };

    const handleAcceptClick = async (friendRequestId: string) => {
        try {
            const result = await acceptFriendRequest(friendRequestId, session);

            console.log('Friend request removed successfully:', result);
        } catch (error) {
            console.error('Error removing friend request:', error);
        }
    }

    useEffect(() => {
        if (session?.user?.id) {
            getFriendRequests(session?.user?.id as string).then((r) => setFriendRequests(r));
        }
    }, [session]);

    return session?.user?.id === slug ? (
        <div className="friend-request-list bg-violet-100 rounded-r-3xl pb-2 w-[90%]">
            <div className="flex flex-col mt-[45%] overflow-y-auto h-[50%]">
                <div className="pt-2 pb-2 bg-violet-100 rounded-tr-3xl mb-3">
                    <h2 className="text-xl font-bold uppercase text-center">Friend Requests</h2>
                </div>
                {friendRequests.length > 0 ? (
                    <>
                        <div className="pl-[5%]">
                            <h3 className="text-md font-semibold mb-2">Incoming</h3>
                            {friendRequests
                                .filter(friendRequest => friendRequest.receiverId === session?.user?.id)
                                .map((incomingRequest) => (
                                    <div key={incomingRequest.id} className="text-sm flex items-center justify-between w-[70%]">
                                        <div className="flex">
                                            <div className="mb flex flex-row mb-5">
                                                <p className="w-[75%]">{incomingRequest.senderId}</p>
                                                <button
                                                    className="bg-green-300 text-white px-3 ml-5 h-8 mt-[-5px] rounded-md font-medium mr-3"
                                                    onClick={() => handleAcceptClick(incomingRequest.id)}
                                                >
                                                    ✔️
                                                </button>
                                                <button
                                                    className="bg-red-300 px-4 h-8 mt-[-5px] rounded-md text-sm text-red-800 font-bold"
                                                    onClick={() => handleCancelClick(incomingRequest.id)}
                                                >
                                                    X
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                        <div className="pl-[5%]">
                            <h3 className="text-md font-semibold mb-2">Sent</h3>
                            {friendRequests
                                .filter(friendRequest => friendRequest.senderId === session?.user?.id)
                                .map((sentRequest) => (
                                    <div key={sentRequest.id} className="flex items-center justify-between w-[70%]">
                                        <div className="flex flex-row mb-5">
                                            <p className="text-sm w-[75%]">{sentRequest.receiverId}</p>
                                            <button
                                                className="bg-red-300 px-7 h-8 mt-[-5px] rounded-md text-sm text-red-800 font-bold ml-5"
                                                onClick={() => handleCancelClick(sentRequest.id)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </>
                ) : (
                    <p className="text-center">No friend requests</p>
                )}
            </div>
        </div>
    ) : (
        <div></div>
    );
};

export default FriendRequestList;

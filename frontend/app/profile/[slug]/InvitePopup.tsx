import React, {useState} from "react";
import {addFriendRequest} from "@/app/components/api";
import {useSession} from 'next-auth/react';

const InvitePopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [inviteUsername, setInviteUsername] = useState("");
    const [error, setError] = useState("");
    const { data: session } = useSession();

    const handleInvite = () => {
        if (!inviteUsername.trim()) {
            setError("Please enter a username");
            return;
        }

        addFriendRequest(inviteUsername, session).then(async r => {
            if (r.status != 200) {
                setError(await r.text())
            }
            else{
                setInviteUsername("");
                setError("")
                onClose();
            }
        });
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-md  w-[25%]">
                <label htmlFor="inviteUsername" className="block mb-2">
                    Invite a Friend:
                </label>
                <input
                    type="text"
                    id="inviteUsername"
                    value={inviteUsername}
                    onChange={(e) => setInviteUsername(e.target.value)}
                    className={`border p-2 w-full mb-2 ${error ? 'border-red-500' : ''} rounded-xl`}
                    placeholder="Enter username"
                />
                {error && (
                    <span className="error-indicator" data-tooltip={error}>
                !
            </span>
                )}
                <div className="flex justify-between">
                    <button onClick={onClose} className="ml-2 text-gray-500">
                        Cancel
                    </button>
                    <button onClick={handleInvite} className="bg-blue-500 text-white p-2 rounded-md">
                        Invite
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvitePopup;
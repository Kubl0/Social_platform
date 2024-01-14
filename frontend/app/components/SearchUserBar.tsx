// components/UserSearch.tsx
import React, { useState, useEffect } from 'react';
import { FoundUser } from '@/types/apiTypes';
import {searchUsers} from "@/app/components/api";
import Gravatar from "react-gravatar";

const UserSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<FoundUser[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            if (searchTerm.trim() === '') {
                setFilteredUsers([]);
                return;
            }

            try {
                const response = await searchUsers(searchTerm);
                setFilteredUsers(response);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [searchTerm]);

    return (
        <div className="flex items-center flex-col">
            <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border rounded-md px-2 py-1 w-full z-10"
            />
            <ul className="list-none absolute top-[35px] w-[19.7%] bg-violet-200 rounded-b-xl z-0">
                {filteredUsers.map(user => (
                    <li key={user.id} className="mb-3 mt-5 ml-5">
                        <a href={`/profile/${user.id}`} className="text-black hover:underline flex flex-row">
                            <Gravatar email={user?.email ? user?.email : ""} size={30} className="shadow-xl rounded-full mr-3"/>
                            <p className="mt-1 font-bold">{user.username}</p>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserSearch;

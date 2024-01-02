'use client';

import React, {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {Session} from "next-auth";
import {EditUser, updateUser, getUserEditData} from "@/app/components/api";


export default function EditProfilePage({params}: Readonly<{ params: { slug: string } }>) {
    const {data: session} = useSession();
    const {slug} = params;

    const [editedUser, setEditedUser] = useState<EditUser>({
        username: '',
        profilePicture: '',
        description: '',
        email: '',
    });

    useEffect(() => {
        getUserEditData(setEditedUser, slug).then(r => r);
    }, [slug]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setEditedUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const res = await updateUser(slug, editedUser, session as Session).then(r => r);
        if (res.ok) {
            alert("User updated successfully!")
            setTimeout(() => {
            window.location.href = `/profile/${slug}`;
            }, 500);
        }
        else {
            alert("User update failed!")
        }
    };

    return (
        <>
            {session?.user?.id === params.slug ? (
            <div className="px-6 mt-40">
                <div className="flex flex-wrap justify-center">
                    <div
                        className="relative max-w-md mx-auto md:max-w-2xl mt-6 min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl">
                        <div className="w-full text-center mt-10">
                            <form onSubmit={handleSubmit} className="text-center">
                                <h3 className="text-2xl text-slate-700 font-bold leading-normal">
                                    Edit Profile
                                </h3>
                                <div className="mt-6">
                                    <label htmlFor="username" className="text-slate-600 font-bold">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={editedUser.username}
                                        onChange={handleInputChange}
                                        className="form-input mt-1 block w-full"
                                    />
                                </div>
                                <div className="mt-6">
                                    <label htmlFor="profilePicture" className="text-slate-600 font-bold">
                                        Profile Picture URL
                                    </label>
                                    <input
                                        type="text"
                                        id="profilePicture"
                                        name="profilePicture"
                                        value={editedUser.profilePicture}
                                        onChange={handleInputChange}
                                        className="form-input mt-1 block w-full"
                                    />
                                </div>
                                <div className="mt-6">
                                    <label htmlFor="description" className="text-slate-600 font-bold">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={editedUser.description}
                                        onChange={handleInputChange}
                                        className="form-input mt-1 block w-full"
                                    />
                                </div>
                                <div className="mt-6">
                                    <label htmlFor="email" className="text-slate-600 font-bold">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={editedUser.email}
                                        onChange={handleInputChange}
                                        className="form-input mt-1 block w-full"
                                    />
                                </div>
                                <div className="mt-10">
                                    <button
                                        type="submit"
                                        className="group relative flex justify-center w-[120px] rounded-full border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
                ) : (
                <div className="px-6 mt-40">
                    <div className="flex flex-wrap justify-center">
                        <div className="max-w-md md:max-w-2xl min-w-0 break-words bg-white w-full shadow-lg rounded-xl">
                            <div className="w-full text-center mb-10 mt-10">
                                <h3 className="text-2xl text-slate-700 font-bold leading-normal">
                                    You are not authorized to edit this profile.
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
                )}
        </>
    );
}


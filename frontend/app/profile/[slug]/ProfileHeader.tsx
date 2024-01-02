// ProfileHeader.tsx
import React from 'react';
import Link from 'next/link';
import {ProfileHeaderProps} from "@/types/apiTypes";
import Image from "next/image";

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ foundUser, session, params }) => {
    return (
        <div className="px-6 mt-20">
            <div className="flex flex-wrap justify-center">
                <div className="relative mx-auto md:max-w-[50%] mt-6 break-words bg-white w-full mb-6 shadow-lg rounded-xl">
                    <div className="w-full flex justify-center">
                        <div className="relative">
                            <div className="mt-[-50px]">
                                <Image
                                    alt={foundUser?.username ?? 'User profile picture'}
                                    src={
                                        foundUser?.profilePicture ??
                                        'https://www.charitycomms.org.uk/wp-content/uploads/2019/02/placeholder-image-square.jpg'
                                    }
                                    className="shadow-xl rounded-full align-middle border-none mx-auto max-w-[200px]"
                                    width={200}
                                    height={200}
                                />
                            </div>
                            {session && session?.user.id === params.slug && (
                                <div className="absolute top-3 left-9">
                                    <Link href={`/profile/${session.user.id}/edit`}>
                                        <button className="group relative flex justify-center w-[40px] top-[100px] left-[100px] rounded-full border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                            <p className="emoji">✏️</p>
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-full text-center mt-10">
                        <div className="text-center">
                            <h3 className="text-2xl text-slate-700 font-bold leading-normal">{foundUser?.username}</h3>
                            <div className="text-sm leading-normal mt-0 mb-2 text-slate-600 font-bold uppercase">
                                <i className="fas fa-map-marker-alt mr-2 text-lg text-slate-700"></i> {foundUser?.email}
                            </div>
                            <div className="mb-2 text-slate-600 mt-10 pb-5">
                                <i className="fas fa-briefcase mr-2 text-lg text-slate-700 mb"></i>
                                {foundUser?.description ?? 'No description provided.'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;

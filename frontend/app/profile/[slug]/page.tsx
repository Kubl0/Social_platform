'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface FoundUser {
    username: string;
    profilePicture: string;
    description: string;
    email: string;
}

async function getUser(slug: string): Promise<FoundUser> {
    const response = await fetch(`http://localhost:8080/api/users/get/${slug}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Error fetching user data');
    }

    return response.json();
}

export default function ProfilePage({ params }: { params: { slug: string } }) {
    const { data: session } = useSession();
    const { slug } = params;

    const [foundUser, setFoundUser] = useState<FoundUser | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const user = await getUser(slug);
                setFoundUser(user);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }
        fetchData();
    }, [slug]);

    return (
        <>
            <div className="px-6 mt-40">
                <div className="flex flex-wrap justify-center">
                    <div className="relative max-w-md mx-auto md:max-w-2xl mt-6 min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl">
                        <div className="w-full flex justify-center">
                            <div className="relative">
                                <img
                                    alt="..."
                                    src={foundUser?.profilePicture || "https://www.charitycomms.org.uk/wp-content/uploads/2019/02/placeholder-image-square.jpg"}
                                    className="shadow-xl rounded-full align-middle border-none mx-auto max-w-[150px]"
                                />
                                {session &&
                                    session?.user.id === params.slug && (
                                        <div className="absolute top-3 left-9">
                                            <Link href={`/profile/${session.user.id}/edit`}>
                                                <button className="group relative flex justify-center w-[40px] top-[100px] left-[60px] rounded-full border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                                    <p className="emoji">✏️</p>
                                                </button>
                                            </Link>
                                        </div>
                                    )}
                            </div>
                        </div>
                        <div className="w-full text-center mt-10">
                            <div className="text-center">
                                <h3 className="text-2xl text-slate-700 font-bold leading-normal">
                                    {foundUser?.username}
                                </h3>
                                <div className="text-sm leading-normal mt-0 mb-2 text-slate-600 font-bold uppercase">
                                    <i className="fas fa-map-marker-alt mr-2 text-lg text-slate-700"></i>{' '}
                                    {foundUser?.email}
                                </div>
                                <div className="mb-2 text-slate-600 mt-10">
                                    <i className="fas fa-briefcase mr-2 text-lg text-slate-700"></i>
                                    {foundUser?.description || 'No description provided.'}
                                </div>

                            </div>
                            <p></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

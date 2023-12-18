'use client'

import {useSession} from "next-auth/react";
import Link from "next/link";

export default function ProfilePage({params}: { params: { slug: string } }) {
    const {data: session} = useSession();

    return (
        <>
            {session ? (
                <div className="px-6 mt-40">
                    <div className="flex flex-wrap justify-center">
                        <div className="relative max-w-md mx-auto md:max-w-2xl mt-6 min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl">
                            <div className="w-full flex justify-center">
                                <div className="relative">
                                    <img
                                        alt="..."
                                        src={"https://www.charitycomms.org.uk/wp-content/uploads/2019/02/placeholder-image-square.jpg"}
                                        className="shadow-xl rounded-full align-middle border-none mx-auto max-w-[150px]"
                                    />
                                    {session &&
                                        (session.user.id === params.slug) && (
                                            <div className="absolute top-3 left-9">
                                                <Link href={`/users/${session.user.id}/edit`}>
                                                    <button
                                                        className="group relative flex justify-center w-[40px] top-[100px] left-[60px] rounded-full border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
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
                                    {session.user?.username}
                                </h3>
                            </div>
                            <p>ID: {params.slug} </p>
                            <p>Email: {session.user?.email} </p>
                            </div>
                        </div>
                    </div>
                </div>

            ) : (
                <div>
                    <h1>Not Logged In</h1>
                </div>
            )}
        </>

    )
}
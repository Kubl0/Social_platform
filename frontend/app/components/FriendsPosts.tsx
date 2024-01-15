import React, { useState } from 'react';
import { PostSectionProps } from '@/types/apiTypes';
import PostSection from "@/app/components/PostSection/PostSection";


const FriendsPosts: React.FC<PostSectionProps> = ({ posts, slug, refresh }) => {
    const [,setSortingOption] = useState("");

    const sortByComments = () => {
        setSortingOption("comments");
        posts?.sort((a, b) => {
            return b.comments.length - a.comments.length;
        });
    }

    const sortByLikes = () => {
        setSortingOption("likes");
        posts?.sort((a, b) => {
            return b.likes.length - a.likes.length;
        });
    }

    const sortByDate = () => {
        setSortingOption("date");
        posts?.sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
    }

    const viewRandomPosts = () => {
        setSortingOption("random");
        posts?.sort(() => {
            return 0.5 - Math.random();
        });
    }


    return (
        <div className="flex flex-wrap justify-center w-full">
            <div
                className="relative mx-auto md:max-w-[96%] mt-6 break-words bg-white w-full mb-6 shadow-lg rounded-xl pb-3">
                <div className="flex justify-center">
                    <div className="flex flex-row items-center">
                        <button
                            className="text-sm text-slate-600 mt-3 cursor-pointer"
                            onClick={() => sortByComments()}
                        >
                            Sort by comments
                        </button>
                        &nbsp;&nbsp;
                        <button
                            className="text-sm text-slate-600 mt-3 cursor-pointer"
                            onClick={() => sortByLikes()}
                        >
                            Sort by likes
                        </button>
                        &nbsp;&nbsp;
                        <button
                            className="text-sm text-slate-600 mt-3 cursor-pointer"
                            onClick={() => sortByDate()}
                        >
                            Sort by date
                        </button>
                        &nbsp;&nbsp;
                        <button className="text-sm text-slate-600 mt-3 cursor-pointer" onClick={() => viewRandomPosts()}>
                            View random posts
                        </button>
                    </div>
                </div>

                <PostSection posts={posts} slug={slug} refresh={refresh}/>
            </div>
        </div>
    );
};

export default FriendsPosts;

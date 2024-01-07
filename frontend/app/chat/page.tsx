'use client'
import React, {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {Session} from "next-auth";
import Chatting from "./Chatting";
const Chat: React.FC<{ params: { slug: string }}> = ({params}) => {
    const {data: session} = useSession();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const { slug } = params;
    return (
        <div className='flex h-screen'>
            <div className='bg-'>
                <Chatting params={{slug}}/>
            </div>
        </div>
    )
}

export default Chat;

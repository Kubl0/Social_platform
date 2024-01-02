'use client';

import { motion } from 'framer-motion';
import LoginForm from '@/app/auth/login/loginForm';
import {useState} from "react";

export default function Login() {
    const [message, setMessage] = useState<{ type: string; content: string }>({ type: '', content: '' });

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {message.type && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: message.type ? 1 : 0, y: message.type ? 0 : -20 }}
                    transition={{ duration: 0.5 }}
                    className={`${
                        message.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'
                    } px-4 py-3 rounded absolute top-[130px] mb-4`}
                    role="alert"
                >
                    <strong className="font-bold">{message.type === 'success' ? 'Success!' : 'Error!'}</strong>
                    <span className="block sm:inline"> {message.content}</span>
                </motion.div>
            )}
            <h2 className="mt-[150px] text-center text-3xl font-bold tracking-tight text-gray-90">Sign in to your account</h2>

            <LoginForm setMessage={setMessage} />
        </div>
    );
}

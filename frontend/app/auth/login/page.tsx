// Main login page
'use client';

import Link from 'next/link';
import {motion} from 'framer-motion';
import {Formik, Field, Form, FormikHelpers} from 'formik';
import {useState} from 'react';
import {signIn} from "next-auth/react";
import {LoginValues} from "@/app/components/actions";

export default function Login() {
    const [message, setMessage] = useState({type: '', content: ''});


    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {message.type && (
                <motion.div
                    initial={{opacity: 0, y: -20}}
                    animate={{opacity: message.type ? 1 : 0, y: message.type ? 0 : -20}}
                    transition={{duration: 0.5}}
                    className={`${
                        message.type === 'success'
                            ? 'bg-green-100 border-green-400 text-green-700'
                            : 'bg-red-100 border-red-400 text-red-700'
                    } px-4 py-3 rounded absolute top-[130px] mb-4`}
                    role="alert"
                >
                    <strong className="font-bold">{message.type === 'success' ? 'Success!' : 'Error!'}</strong>
                    <span className="block sm:inline"> {message.content}</span>
                </motion.div>
            )}
            <h2 className="mt-[150px] text-center text-3xl font-bold tracking-tight text-gray-90">Sign in to your
                account</h2>
            <Formik
                initialValues={{username: '', password: ''}}
                onSubmit={
                    async (values: LoginValues, {setSubmitting}: FormikHelpers<LoginValues>) => {
                        await signIn('credentials', {
                            username: values.username,
                            password: values.password,
                            redirect: false,
                            callbackUrl: '/',
                        }).then((res) => {
                            if (res?.error) {
                                setMessage({type: 'error', content: "Invalid username or password"});
                            } else {
                                setMessage({type: 'success', content: 'Logged in successfully'});
                                setTimeout(() => {
                                        window.location.href = '/';
                                    }
                                    , 750);
                            }
                        }).catch((error) => {
                                setMessage({type: 'error', content: error.message});
                            }
                        ).finally(() => {
                                setSubmitting(false);
                            }
                        );
                    }
                }
            >
                {
                    ({touched, errors}) => (
                        <Form className="mt-8 space-y-6">
                            <div className="flex flex-col">
                                <div className="flex flex-row">
                                    <Field
                                        className="w-[451px] shadow-inner justify-center relative block appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="Username"
                                    />
                                    {touched.username && errors.username && (
                                        <span className="error-indicator" data-tooltip={errors.username}>
                                        !
                                    </span>
                                    )}
                                </div>

                                <div className="flex flex-row">
                                    <Field
                                        className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Password"
                                    />
                                    {touched.password && errors.password && (
                                        <span className="error-indicator" data-tooltip={errors.password}>
                                        !
                                    </span>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="group relative flex w-[451px] justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg
                                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </span>
                                Sign in
                            </button>

                            <p className="text-center text-gray-600 text-sm">
                                or{" "}
                                <Link href={'/auth/register'}
                                      className="font-medium text-indigo-600 hover:text-indigo-500">
                                    register
                                </Link>
                            </p>
                        </Form>
                    )
                }
            </Formik>
        </div>
    )
        ;
}

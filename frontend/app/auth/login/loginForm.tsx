import {Form, Formik, Field, FormikHelpers} from 'formik';
import {signIn} from 'next-auth/react';
import {LoginFormProps, LoginValues} from '@/types/apiTypes';
import Link from "next/link";
import React from "react";

export default function LoginForm({ setMessage }: Readonly<LoginFormProps>) {
    const handleSubmit = async (values: LoginValues, { setSubmitting }: FormikHelpers<LoginValues>) => {
        try {
            const res = await signIn('credentials', {
                username: values.username,
                password: values.password,
                redirect: false,
                callbackUrl: '/',
            });

            if (setMessage) {
                if (res?.error) {
                    setMessage({ type: 'error', content: 'Invalid username or password' });
                } else {
                    setMessage({ type: 'success', content: 'Logged in successfully' });
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 750);
                }
            }
        } catch (error) {
            if (setMessage) {
                // @ts-ignore
                setMessage({ type: 'error', content: error.message });
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik initialValues={{ username: "", password: "" }} onSubmit={handleSubmit}>
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
                        </div>

                        <div className="flex flex-row">
                            <Field
                                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="group relative flex w-[451px] justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
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
                        </div>
                        Sign in
                    </button>
                    <p className="text-center text-gray-600 text-sm">
                        or{" "}
                        <Link
                            href={"/auth/register"}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            register
                        </Link>
                    </p>
                </Form>
        </Formik>
);
}

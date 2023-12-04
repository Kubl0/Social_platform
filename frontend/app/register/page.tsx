// Main register page
'use client'

import Link from "next/link";
import {Formik, Field, Form, FormikHelpers} from "formik";
import "@/app/register/styles.css";
import * as Yup from "yup";
import {addUser} from "@/app/actions";

import {Values} from "@/app/actions";

export default function Register() {

    const validate = Yup.object({
        email: Yup.string()
            .email('Email is invalid')
            .required('Email is required'),
        username: Yup.string()
            .min(5, 'Username must be at least 6 characters')
            .required('Username is required'),
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .required('Password is required'),
    })


    return (
        <Formik initialValues={{email: '', username: '', password: ''}} validationSchema={validate}
                onSubmit={(values: Values, {setSubmitting}: FormikHelpers<Values>) => {
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        setSubmitting(false);
                        addUser(values).then(r => alert(r.message));
                    }, 500);
                }}>
            {({touched, errors}) => (
                <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <h2 className="text-center text-3xl font-bold tracking-tight text-gray-90 mt-[150px]">
                        Register new account
                    </h2>
                    <Form className="mt-8 space-y-6">
                        <div className="flex flex-col">
                            <div className="flex flex-row">
                                <Field
                                    className="w-[451px] shadow-inner justify-center relative block appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                />
                                {touched.email && errors.email && (
                                    <span className="error-indicator" data-tooltip={errors.email}>!</span>
                                )}
                            </div>

                            <div className="flex flex-row">
                                <Field
                                    className="w-[451px] shadow-inner justify-center relative block appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="Username"
                                />
                                {touched.username && errors.username && (
                                    <span className="error-indicator" data-tooltip={errors.username}>!</span>
                                )}
                            </div>

                            <div className="flex flex-row">
                                <Field
                                    className="relative shadow-inner block w-[451px] appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                />
                                {touched.password && errors.password && (
                                    <span className="error-indicator" data-tooltip={errors.password}>!</span>
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
          </span>Register
                    </button>

                    <div className="flex flex-col text-center text-gray-500 text-sm justify-center items-center">
                        <p className="mb-2">Already have an account?</p>
                        <Link
                            href={"/login"}
                            className="center-group relative flex w-[200px] justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Back to login
                        </Link>
                    </div>
                </Form>
            </div>
            )}
        </Formik>
    );
};

'use client'
import {useSession} from "next-auth/react";

export default function TestPage() {
    const {data: session } = useSession();

    async function testToken() {
        const response = await fetch('http://localhost:8080/api/users/test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.accessToken
            },
        }).then(res => res.text())
        alert(response)
    }
    return (
        <div>
            <h1>Test Page</h1>
            <button onClick={() => testToken()}>Test Token</button>
            <br/>
            Token: {session?.accessToken}
        </div>
    )
}

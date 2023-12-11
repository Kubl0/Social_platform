

export interface Values {
    email: string;
    username: string;
    password: string;
}

export interface LoginValues {
    username: string;
    password: string;
}


export async function addUser(values: Values) {
    try {
        const res = await fetch('http://localhost:8080/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: values.email,
                username: values.username,
                password: values.password,
            }),
        });

        if (res.status === 200) {
            return { type: "success", message: await res.text() };
        } else {
            return { type: "error", message: await res.text() };
        }
    } catch (error) {
        return { type: "error", message: error };
    }
}


'use server'
export interface Values {
    email: string;
    username: string;
    password: string;
}

export async function addUser(values: Values) {
    try {
        const res = await fetch('http://localhost:8080/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        });

        if (res.status === 200) {
            return {type: "success", message: await res.text()};
        }
        else {
            return {type: "error", message: await res.text()};
        }
    }
    catch (error) {
        console.log(error);
        return {type: "error", message: error};
    }
}

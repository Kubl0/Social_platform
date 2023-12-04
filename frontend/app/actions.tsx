'use server'
export interface Values {
    email: string;
    username: string;
    password: string;
}

export async function addUser(values: Values) {
    try {
        console.log(values)
        return { message: 'Created' }
    } catch (e) {
        return { message: 'Failed to create' }
    }
}
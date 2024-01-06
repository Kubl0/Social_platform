
declare module "next-auth" {

    interface User {
        user: {
            id: string
            username: string
            email: string
            password: string
        }
        accessToken: string
        message: string
        success: boolean
    }

    interface Session {
        user: {
            id: string
            username: string
            type: string
        }
        accessToken: string
    }

    interface JWT {
        accessToken: string
    }
}

export declare module 'next-auth' {}
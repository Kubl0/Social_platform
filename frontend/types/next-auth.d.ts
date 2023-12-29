
declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */

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
        }
        accessToken: string
    }

    interface JWT {
        accessToken: string
    }
}
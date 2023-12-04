// components/Navbar.tsx
import Link from 'next/link';

export default function Navbar() {
    return (
        <div className="flex justify-between items-center bg-gray-800 pb-2.5 pr-2.5 pl-2.5">
            <div className="flex items-center">
                <Link href="/">
                    <button className="bg-gray-700 text-white px-3 h-8 mt-2 rounded-md text-sm font-medium mr-3">
                        Home
                    </button>
                </Link>

                <Link href="/">
                    <button className="bg-gray-700 text-white px-3 h-8 mt-2 rounded-md text-sm font-medium mr-3">
                        Any Page
                    </button>
                </Link>
            </div>

            <div className="flex items-center">
                <Link href={"/login"}>
                    <button className="bg-gray-700 text-white px-3 h-8 mt-2 rounded-md text-sm font-medium">
                        Login
                    </button>
                </Link>
            </div>
        </div>
    );
}

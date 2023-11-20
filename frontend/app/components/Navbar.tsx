// components/Navbar.tsx
import Link from 'next/link';

const Navbar = () => {
    return (
        <nav>
            <Link href="/">
                Home
            </Link>
            <Link href={"/login"}>
                Log in
            </Link>
            {/* Dodaj więcej linków nawigacyjnych, jeśli to konieczne */}
        </nav>
    );
};

export default Navbar;

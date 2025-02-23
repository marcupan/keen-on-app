import Link from "next/link";

export default function Header() {
    return (
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            KeenOn App
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/home" className="hover:text-blue-600">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-blue-600">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-blue-600">
                  Sign Up
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    );
}

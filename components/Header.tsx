"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <header className="bg-white shadow mb-4">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:opacity-80">
          KeenOn App
        </Link>
        <nav>
          <ul className="flex space-x-4">
            {isLoggedIn ? (
              <>
                <li>
                  <Link href="/" className="hover:text-blue-600">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-blue-600">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link href="/folders" className="hover:text-blue-600">
                    Folders
                  </Link>
                </li>
                <li>
                  <Link href="/cards" className="hover:text-blue-600">
                    Cards
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="hover:text-blue-600"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
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
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

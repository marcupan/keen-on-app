import React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import Providers from '@/app/providers';
import Header from '@/components/Header';

import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'KeenOn Card Generate',
	description: 'Language learning card generate web app',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
			>
				<Providers>
					<Header />

					<main className="container mx-auto px-4 py-8">
						{children}
					</main>
				</Providers>
			</body>
		</html>
	);
}

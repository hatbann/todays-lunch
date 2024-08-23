import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.scss';
import Recoil from '@/components/common/Recoil';
import Header from '@/components/common/Header';
import Main from './main';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Today's lunch",
  description: 'What is your lunch?',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Recoil>
          <Header />
          <Main>{children}</Main>
        </Recoil>
      </body>
    </html>
  );
}

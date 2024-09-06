import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.scss';
import Recoil from '@/components/common/Recoil';
import Header from '@/components/common/Header';
import Main from './main';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: '오늘의 도시락',
  description:
    '맛있는 도시락, 함께 나누는 즐거움 🍱!  나만의 특별한 도시락 레시피를 공유하고, 다른 사람들의 창의적인 아이디어도 만나보세요. 간편하면서도 건강한 도시락 레시피로 매일 새로운 맛을 즐기세요! 여러분의 도시락 이야기를 기다립니다',
  openGraph: {
    title: "Today's lunch",
    description:
      '맛있는 도시락, 함께 나누는 즐거움 🍱!  나만의 특별한 도시락 레시피를 공유하고, 다른 사람들의 창의적인 아이디어도 만나보세요. 간편하면서도 건강한 도시락 레시피로 매일 새로운 맛을 즐기세요! 여러분의 도시락 이야기를 기다립니다',
    url: 'https://todayslunch.vercel.app/',
    siteName: 'Todays Lunch',
    images: [
      {
        url: '/images/png/logo.png',
        width: 700,
        height: 630,
      },
    ],
    locale: 'ko-KR',
    type: 'website',
  },
  verification: {
    google: 'UGkMOJplAyKAPziRSSgLOeaEOMHH3h6lwBQbfv93gnI',
  },
  alternates: {
    canonical: 'https://todayslunch.vercel.app',
  },
  authors: [
    {
      url: 'https://github.com/hatbann',
      name: 'Hyebin Cho',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'todayslunch',
    description:
      '맛있는 도시락, 함께 나누는 즐거움 🍱!  나만의 특별한 도시락 레시피를 공유하고, 다른 사람들의 창의적인 아이디어도 만나보세요. 간편하면서도 건강한 도시락 레시피로 매일 새로운 맛을 즐기세요! 여러분의 도시락 이야기를 기다립니다',
    url: 'https://todayslunch.vercel.app/',
    image: '/images/png/logo.png',
    author: {
      '@type': 'Hyebin Cho',
      name: 'https://github.com/hatbann',
    },
    datePublished: '2024-09-06T14:35:00+07:00',
    dateModified: '2024-09-06T14:35:00+07:00',
    publisher: {
      '@type': 'Organization',
      name: '오늘의 도시락',
      logo: {
        '@type': 'ImageObject',
        url: '/images/png/logo.png',
      },
    },
    headline: '오늘의 도시락',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://todayslunch.vercel.app/',
    },
    articleSection: '오늘의 도시락',
    articleBody:
      '맛있는 도시락, 함께 나누는 즐거움 🍱!  나만의 특별한 도시락 레시피를 공유하고, 다른 사람들의 창의적인 아이디어도 만나보세요. 간편하면서도 건강한 도시락 레시피로 매일 새로운 맛을 즐기세요! 여러분의 도시락 이야기를 기다립니다',
    thumbnailUrl: '/images/png/logo.png',
  };
  return (
    <html lang="en">
      <Head>
        <link rel="canonical" href="https://todayslunch.vercel.app/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdData, null, 2),
          }}
        />
      </Head>
      <body>
        <Recoil>
          <Header />
          <Main>{children}</Main>
        </Recoil>
      </body>
    </html>
  );
}

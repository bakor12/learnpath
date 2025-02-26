// src/pages/translate.tsx
import React from 'react';
import Head from 'next/head';
import Translator from '@/components/ui/Translator';
import { getSession } from 'next-auth/react';

export default function TranslatePage() {
  return (
    <>
      <Head>
        <title>Translator</title>
        <meta name="description" content="Translate text between languages." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container-padded page-section">
        <h1 className="text-3xl font-bold mb-6">Translator</h1>
        <Translator />
      </main>
    </>
  );
}

import type { GetServerSidePropsContext } from 'next';

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    return {
        props: { session },
    };
}
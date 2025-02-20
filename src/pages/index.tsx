// src/pages/index.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react'; // Import

const Home: NextPage = () => {
  const { data: session, status } = useSession(); // Get session

  return (
    <div>
      <Head>
        <title>AI-Powered Learning Paths</title>
        <meta name="description" content="Personalized learning paths powered by AI." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full space-y-8">
          <h1 className="text-center text-5xl font-extrabold text-gray-900">
            Unlock Your Potential with AI
          </h1>
          <p className="mt-6 text-center text-xl text-gray-600">
            Get a personalized learning roadmap tailored to your skills, goals, and learning style.
          </p>

          {/* Call to Action Section */}
          <div className="mt-8 space-y-4 sm:space-y-0 sm:flex sm:justify-center sm:space-x-4">
            {!session && (
                <>
                    <Link href="/signup">
                        <div className="cursor-pointer flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                            Get Started
                        </div>
                    </Link>
                    <Link href="/login">
                        <div className="cursor-pointer flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                            Sign In
                        </div>
                    </Link>
                </>
            )}
            {session && (
                <>
                    <Link href="/learning-path">
                        <div className="cursor-pointer flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
                            View Learning Path
                        </div>
                    </Link>
                    <button onClick={() => signOut()} className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200">
                        Sign Out
                    </button>
                </>
            )}
          </div>
            {session && (
                <p className="mt-4 text-center text-gray-600">
                    Logged in as {session.user?.email}
                </p>
            )}

          {/* Features Section (Example) */}
          <div className="mt-12">
            <h2 className="text-center text-3xl font-semibold text-gray-800">
              Key Features
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature Card 1 */}
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                      {/* Replace with an appropriate icon */}
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Personalized Roadmaps</h3>
                    <p className="mt-5 text-base text-gray-500">
                      AI-generated learning paths tailored to your unique skills and goals.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Card 2 */}
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                      {/* Replace with an appropriate icon */}
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Skill Gap Analysis</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Identify your skill gaps and get recommendations for improvement.
                    </p>
                  </div>
                </div>
              </div>
                {/* Feature Card 3 */}
                <div className="pt-6">
                    <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                        <div className="-mt-6">
                            <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                                {/* Replace with an appropriate icon */}
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Progress Tracking</h3>
                            <p className="mt-5 text-base text-gray-500">
                                Track your progress and stay motivated with visual feedback.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
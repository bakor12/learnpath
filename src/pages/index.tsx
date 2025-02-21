// src/pages/index.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
//import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Animation variants for staggered animations
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const Home: NextPage = () => {
    const { data: session } = useSession();
    //const [ setScrollPosition] = useState(0); // Keep scrollPosition for hero background
    //const [isMenuOpen, setIsMenuOpen] = useState(false); // Keep isMenuOpen for potential mobile menu later

    

    // Testimonials data
    const testimonials = [
        {
            id: 1,
            name: "Alex Johnson",
            role: "Frontend Developer",
            image: "/images/testimonial-1.jpg",
            quote: "This platform transformed how I approach learning. The AI-generated path was perfectly tailored to my skill gaps."
        },
        {
            id: 2,
            name: "Sarah Chen",
            role: "UX Designer",
            image: "/images/testimonial-2.jpg",
            quote: "I saved months of research time. The learning path adapted as I progressed, focusing on exactly what I needed."
        },
        {
            id: 3,
            name: "Michael Torres",
            role: "Data Scientist",
            image: "/images/testimonial-3.jpg",
            quote: "The skill assessment was incredibly accurate. It identified gaps I didn't even know I had and recommended perfect resources."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50">
            <Head>
                <title>LearnPath AI | Personalized Learning Journeys</title>
                <meta name="description" content="AI-powered personalized learning paths that adapt to your unique skills, goals, and learning style." />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Hero Section */}
            <main>
                <div className="relative pt-28 pb-16 sm:pt-36 lg:pt-40 lg:pb-24 overflow-hidden">
                    {/* Background decoration elements */}
                    <div className="hidden lg:block absolute top-0 bottom-0 left-3/4 w-screen bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-l-3xl"></div>
                    <svg className="absolute right-full transform translate-y-1/3 translate-x-1/4 md:translate-y-1/2 sm:translate-x-1/2 lg:translate-x-full" width="404" height="784" fill="none" viewBox="0 0 404 784">
                        <defs>
                            <pattern id="pattern-squares" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                <rect x="0" y="0" width="4" height="4" fill="rgba(99, 102, 241, 0.2)" />
                            </pattern>
                        </defs>
                        <rect width="404" height="784" fill="url(#pattern-squares)" />
                    </svg>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                            {/* Main content */}
                            <motion.div
                                className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:flex-col lg:justify-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                {session && (
                                    <div className="inline-flex mb-6 px-4 py-1.5 bg-indigo-100 rounded-full">
                                        <span className="text-sm font-medium text-indigo-800">
                                            Welcome back, {session.user?.name || session.user?.email}
                                        </span>
                                    </div>
                                )}

                                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                                    <span className="block">Discover Your</span>
                                    <span className="block mt-1 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                        Perfect Learning Path
                  </span>
                                </h1>

                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                                    Our AI analyzes your current skills, identifies gaps, and creates a personalized roadmap that adapts as you learn. Skip the guesswork and focus on what matters most for your growth.
                </p>

                                <div className="mt-8 sm:mt-10">
                                    {!session && (
                                        <div className="sm:flex sm:justify-center lg:justify-start">
                                            <Link href="/signup">
                                                <div className="cursor-pointer rounded-md shadow px-5 py-3 bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full text-center sm:w-auto">
                                                    Create Your Learning Path
                        </div>
                                            </Link>
                                            <Link href="/login">
                                                <div className="cursor-pointer mt-3 sm:mt-0 sm:ml-3 rounded-md shadow px-5 py-3 bg-white text-indigo-600 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full text-center sm:w-auto">
                                                    Sign In
                        </div>
                                            </Link>
                                        </div>
                                    )}

                                    {session && (
                                        <div className="sm:flex sm:justify-center lg:justify-start">
                                            <Link href="/learning-path">
                                                <div className="cursor-pointer rounded-md shadow px-5 py-3 bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full text-center sm:w-auto">
                                                    Continue Your Learning Path
                        </div>
                                            </Link>
                                            <Link href="/skill-assessment">
                                                <div className="cursor-pointer mt-3 sm:mt-0 sm:ml-3 rounded-md shadow px-5 py-3 bg-white text-indigo-600 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full text-center sm:w-auto">
                                                    Update Skills Assessment
                        </div>
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* Trust indicators */}
                                <div className="mt-12 flex flex-col sm:flex-row items-center justify-start space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>10,000+ users</span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Powered by Gemini AI</span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>100% personalized</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Hero image/animation */}
                            <motion.div
                                className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                                    <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                                        <div className="aspect-w-10 aspect-h-7 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-10">
                                            <div className="bg-white/10 backdrop-blur-sm w-full max-w-md rounded-xl overflow-hidden shadow-xl">
                                                <div className="p-4 border-b border-white/20">
                                                    <div className="flex space-x-1">
                                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                    </div>
                                                </div>

                                                <div className="p-5 bg-white/5">
                                                    <div className="h-4 w-3/4 bg-white/20 rounded mb-4"></div>
                                                    <div className="h-4 w-1/2 bg-white/20 rounded mb-4"></div>

                                                    <div className="my-5 flex space-x-2">
                                                        <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center">
                                                            <svg className="h-6 w-6 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <div className="h-3 w-24 bg-white/40 rounded mb-2"></div>
                                                            <div className="h-3 w-32 bg-white/20 rounded"></div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2 mt-6">
                                                        <div className="h-3 w-full bg-white/10 rounded"></div>
                                                        <div className="h-3 w-full bg-white/10 rounded"></div>
                                                        <div className="h-3 w-3/4 bg-white/10 rounded"></div>
                                                    </div>

                                                    <div className="mt-6 p-3 rounded-lg bg-indigo-700/20 border border-indigo-300/30">
                                                        <div className="flex items-center">
                                                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                                                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                                </svg>
                                                            </div>
                                                            <div className="ml-3">
                                                                <div className="h-2 w-32 bg-indigo-200 rounded mb-1"></div>
                                                                <div className="h-2 w-20 bg-indigo-100 rounded"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <span className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white"></span>
                                        <span className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white"></span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Trusted by section */}
                <div className="bg-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <p className="text-center text-base font-medium text-gray-500">
                            Trusted by leading organizations and thousands of learners
            </p>
                        <div className="mt-6 grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5">
                            <div className="col-span-1 flex justify-center items-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                                <Image className="h-8" src="https://tailwindui.com/img/logos/tuple-logo-gray-400.svg" alt="Tuple" width={50} height={50}/>
                            </div>
                            <div className="col-span-1 flex justify-center items-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                                <Image className="h-8" src="https://tailwindui.com/img/logos/mirage-logo-gray-400.svg" alt="Mirage" width={50} height={50}/>
                            </div>
                            <div className="col-span-1 flex justify-center items-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                                <Image className="h-8" src="https://tailwindui.com/img/logos/statickit-logo-gray-400.svg" alt="StaticKit" width={50} height={50}/>
                            </div>
                            <div className="col-span-1 flex justify-center items-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                                <Image className="h-8" src="https://tailwindui.com/img/logos/transistor-logo-gray-400.svg" alt="Transistor" width={50} height={50}/>
                            </div>
                            <div className="col-span-1 flex justify-center items-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                                <Image className="h-8" src="https://tailwindui.com/img/logos/workcation-logo-gray-400.svg" alt="Workcation" width={50} height={50}/>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature Section */}
                <section id="features" className="py-16 bg-white overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full uppercase tracking-wider mb-3">
                                Features
              </span>
                            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                                The smarter way to learn
              </h2>
                            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                                Our AI-powered platform creates truly personalized learning experiences
                                that evolve with your progress.
              </p>
                        </motion.div>

                        <motion.div
                            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {/* Feature 1 */}
                            <motion.div
                                className="relative group"
                                variants={itemVariants}
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg opacity-50 blur-sm group-hover:opacity-75 transition duration-300"></div>
                                <div className="relative h-full bg-white p-6 rounded-lg shadow-sm">
                                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-5">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Skill Assessment</h3>
                                    <p className="text-gray-600 mb-4">
                                        Our AI analyzes your current abilities through interactive assessments and portfolio reviews, identifying both strengths and opportunity areas.
                  </p>
                                    <ul className="space-y-2 text-sm text-gray-500">
                                        <li className="flex items-start">
                                            <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Upload resume or portfolio for analysis</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Interactive skill gap identification</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Detailed skill proficiency mapping</span>
                                        </li>
                                    </ul>
                                </div>
                            </motion.div>

                            {/* Feature 2 */}
                            <motion.div
                                className="relative group"
                                variants={itemVariants}
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg opacity-50 blur-sm group-hover:opacity-75 transition duration-300"></div>
                                <div className="relative h-full bg-white p-6 rounded-lg shadow-sm">
                                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-5">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Dynamic Learning Paths</h3>
                                    <p className="text-gray-600 mb-4">
                                        Unlike static courses, our AI constantly adapts your learning journey based on progress, pace, and performance to optimize your growth.
                  </p>
                                    <ul className="space-y-2 text-sm text-gray-500">
                                        <li className="flex items-start">
                                            <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Personalized resource recommendations</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Adaptive difficulty progression</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Learning style compatibility matching</span>
                                        </li>
                                    </ul>
                                </div>
                            </motion.div>

                            {/* Feature 3 */}
                            <motion.div
                                className="relative group"
                                variants={itemVariants}
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg opacity-50 blur-sm group-hover:opacity-75 transition duration-300"></div>
                                <div className="relative h-full bg-white p-6 rounded-lg shadow-sm">
                                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-5">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Curated Resources</h3>
                                    <p className="text-gray-600 mb-4">
                                        We hand-pick the best learning materials from across the web, saving you time and ensuring high-quality content.
                  </p>
                                    <ul className="space-y-2 text-sm text-gray-500">
                                        <li className="flex items-start">
                                            <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Articles, videos, tutorials, and more</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Content quality and relevance filtering</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Regularly updated resource library</span>
                                        </li>
                                    </ul>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="py-16 bg-gradient-to-b from-white to-indigo-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full uppercase tracking-wider mb-3">
                                How It Works
              </span>
                            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                                Start learning in minutes
              </h2>
                            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                                A simple, step-by-step process to get your personalized learning journey.
              </p>
                        </motion.div>

                        <div className="lg:grid lg:grid-cols-7 lg:gap-8">
                            {/* Step 1 */}
                            <motion.div
                                className="lg:col-span-2"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                                            1
                    </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Create an Account</h3>
                                        <p className="mt-2 text-gray-600">
                                            Sign up for free and tell us a bit about your learning goals.
                    </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Arrow 1 */}
                            <motion.div
                                className="hidden lg:flex items-center justify-center"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: 0.4 }}
                            >
                                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </motion.div>

                            {/* Step 2 */}
                            <motion.div
                                className="mt-10 lg:mt-0 lg:col-span-2"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                            >
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                                            2
                    </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Assess Your Skills</h3>
                                        <p className="mt-2 text-gray-600">
                                            Take our AI-powered assessment or upload your resume/portfolio.
                    </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Arrow 2 */}
                            <motion.div
                                className="hidden lg:flex items-center justify-center"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: 0.8 }}
                            >
                                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </motion.div>

                            {/* Step 3 */}
                            <motion.div
                                className="mt-10 lg:mt-0 lg:col-span-2"
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 1.0 }}
                            >
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                                            3
                    </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Get Your Path</h3>
                                        <p className="mt-2 text-gray-600">
                                            Receive your personalized learning path and start learning!
                    </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Mobile steps (accordion) */}
                        <div className="mt-12 lg:hidden">
                            <div className="space-y-4">
                                {/* Step 1 */}
                                <div className="border rounded-lg">
                                    <button
                                        className="w-full flex items-center justify-between px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none"
                                        onClick={() => { /* Toggle accordion item */ }}
                                    >
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-base mr-3">
                                                1
                      </div>
                                            <span className="text-base font-medium text-gray-900">Create an Account</span>
                                        </div>
                                        <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="px-4 pb-4">
                                        <p className="text-gray-600">
                                            Sign up for free and tell us a bit about your learning goals.
                    </p>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="border rounded-lg">
                                    <button
                                        className="w-full flex items-center justify-between px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none"
                                        onClick={() => { /* Toggle accordion item */ }}
                                    >
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-base mr-3">
                                                2
                      </div>
                                            <span className="text-base font-medium text-gray-900">Assess Your Skills</span>
                                        </div>
                                        <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="px-4 pb-4">
                                        <p className="text-gray-600">
                                            Take our AI-powered assessment or upload your resume/portfolio.
                    </p>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="border rounded-lg">
                                    <button
                                        className="w-full flex items-center justify-between px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none"
                                        onClick={() => { /* Toggle accordion item */ }}
                                    >
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-base mr-3">
                                                3
                      </div>
                                            <span className="text-base font-medium text-gray-900">Get Your Path</span>
                                        </div>
                                        <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="px-4 pb-4">
                                        <p className="text-gray-600">
                                            Receive your personalized learning path and start learning!
                    </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimonials" className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            className="text-center mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full uppercase tracking-wider mb-3">
                                Testimonials
              </span>
                            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                                What learners are saying
              </h2>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.map((testimonial) => (
                                <motion.div
                                    key={testimonial.id}
                                    className="bg-gray-50 rounded-lg shadow-md p-6 flex flex-col"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.2 * testimonial.id }}
                                >
                                    <div className="flex-grow">
                                        <p className="text-gray-600 italic mb-4">
                                        &quot{testimonial.quote}&quot
                    </p>
                                    </div>
                                    <div className="flex items-center mt-4">
                                        <Image
                                            className="w-12 h-12 rounded-full mr-4 object-cover"
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            width={100}
                                            height={100}
                                        />
                                        <div>
                                            <h4 className="text-base font-medium text-gray-900">{testimonial.name}</h4>
                                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Call to Action Section */}
                <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                            Ready to accelerate your learning?
            </h2>
                        <p className="mt-4 max-w-2xl text-xl text-indigo-100 mx-auto">
                            Start your personalized learning journey today.  It&quots free to get started.
            </p>
                        <div className="mt-8">
                            {!session && (
                                <Link href="/signup">
                                    <div className="inline-block px-6 py-3 rounded-md shadow-md bg-white text-indigo-600 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        Create Your Free Learning Path
                  </div>
                                </Link>
                            )}
                            {session && (
                                <Link href="/learning-path">
                                    <div className="inline-block px-6 py-3 rounded-md shadow-md bg-white text-indigo-600 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        Go to My Learning Path
                  </div>
                                </Link>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;
import { useState, useEffect, useRef, RefObject } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
//import Link from 'next/link';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
//import { useInView } from 'framer-motion';

// Custom hook for detecting if element is in viewport
function useOnScreen(ref: React.RefObject<HTMLElement>, threshold = 0.1) {
    const [isIntersecting, setIntersecting] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIntersecting(entry.isIntersecting);
            },
            {
                rootMargin: '0px',
                threshold,
            }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [ref, threshold]);

    return isIntersecting;
}

// Team member interface
interface TeamMember {
    id: number;
    name: string;
    role: string;
    bio: string;
    image: string;
    linkedin?: string; // Optional LinkedIn profile URL
    twitter?: string;  // Optional Twitter profile URL
}

// Testimonial interface
interface Testimonial {
    id: number;
    content: string;
    author: string;
    role: string;
    company: string;
}

const AboutPage: NextPage = () => {
    // Refs for scroll animations
    const missionRef = useRef<HTMLDivElement>(null);
    const storyRef = useRef<HTMLDivElement>(null);
    const teamRef = useRef<HTMLDivElement>(null);
    const testimonialsRef = useRef<HTMLDivElement>(null);
    // Check if sections are in viewport
    const missionInView = useOnScreen(missionRef as RefObject<HTMLElement>, 0.2);
    const storyInView = useOnScreen(storyRef as RefObject<HTMLElement>, 0.2);
    const teamInView = useOnScreen(teamRef as RefObject<HTMLElement>, 0.2);
    const testimonialsInView = useOnScreen(testimonialsRef as RefObject<HTMLElement>, 0.2);

    // State for active testimonial
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    // Mock data - in production, this would come from an API
    const teamMembers: TeamMember[] = [
        {
            id: 1,
            name: 'Abu Bakor',
            role: 'Founder & CEO',
            bio: 'Former education technology researcher with 10+ years of experience developing adaptive learning systems. Passionate about democratizing quality education through technology.',
            image: '/team/alex.jpg',
            linkedin: 'https://www.linkedin.com/in/alexrivera/', // Replace with actual LinkedIn URL
            twitter: 'https://twitter.com/alexrivera', // Replace with actual Twitter URL
        },
        {
            id: 2,
            name: 'Tasmia Khatun',
            role: 'Chief AI Officer',
            bio: 'PhD in Machine Learning with specialization in natural language processing. Led AI initiatives at leading EdTech companies before joining our mission.',
            image: '/team/priya.jpg',
            linkedin: 'https://www.linkedin.com/in/priyasharma/', // Replace with actual LinkedIn URL
        },
        {
            id: 3,
            name: 'Ferdous',
            role: 'Head of Learning Design',
            bio: 'Educational psychologist focused on optimizing learning experiences. Previously designed curriculum for top online learning platforms.',
            image: '/team/marcus.jpg',
            twitter: 'https://twitter.com/marcusjohnson', // Replace with actual Twitter URL
        },
        {
            id: 4,
            name: 'Akhi',
            role: 'UX/UI Director',
            bio: 'Award-winning designer specializing in accessible, intuitive interfaces. Advocate for inclusive design that serves learners of all abilities.',
            image: '/team/sophia.jpg',
            linkedin: 'https://www.linkedin.com/in/sophiachen/', // Replace with actual LinkedIn URL
        },
    ];

    const testimonials: Testimonial[] = [
        {
            id: 1,
            content: "This platform transformed my learning journey. The personalized roadmap identified exactly where I needed to focus, and I've made more progress in 3 months than in the past year of self-directed study.",
            author: "Jamie Rodriguez",
            role: "Software Developer",
            company: "TechNova Inc."
        },
        {
            id: 2,
            content: "As someone with a non-traditional background, I struggled to know what to learn next. This platform analyzed my resume and created a perfect learning path that helped me transition careers successfully.",
            author: "Taylor Washington",
            role: "Data Analyst",
            company: "FinServe Global"
        },
        {
            id: 3,
            content: "The adaptive learning paths adjust to my progress in real-time. When I struggled with a concept, it automatically provided alternative resources that matched my visual learning style.",
            author: "Sam Patel",
            role: "UX Designer",
            company: "CreativeFlow Studio"
        },
    ];

    // Animation controls
    const controlsMission = useAnimation();
    const controlsStory = useAnimation();
    const controlsTeam = useAnimation();
    const controlsTestimonials = useAnimation();

    // Handle animations based on scroll position
    useEffect(() => {
        if (missionInView) {
            controlsMission.start({
                y: 0,
                opacity: 1,
                transition: { duration: 0.8, ease: "easeOut" }
            });
        }

        if (storyInView) {
            controlsStory.start({
                y: 0,
                opacity: 1,
                transition: { duration: 0.8, ease: "easeOut" }
            });
        }

        if (teamInView) {
            controlsTeam.start({
                y: 0,
                opacity: 1,
                transition: { duration: 0.8, ease: "easeOut" }
            });
        }

        if (testimonialsInView) {
            controlsTestimonials.start({
                y: 0,
                opacity: 1,
                transition: { duration: 0.8, ease: "easeOut" }
            });
        }
    }, [missionInView, storyInView, teamInView, testimonialsInView, controlsMission, controlsStory, controlsTeam, controlsTestimonials]);

    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 8000);

        return () => clearInterval(interval);
    }, [testimonials.length]);

    // Handle manual testimonial navigation
    const handleTestimonialChange = (index: number) => {
        setActiveTestimonial(index);
    };

    return (
        <>
            <Head>
                <title>About Us | AI-Powered Learning Pathways</title>
                <meta name="description" content="Learn about our mission to revolutionize personalized education through AI-powered learning pathways tailored to your skills and goals." />
                <meta property="og:title" content="About Us | AI-Powered Learning Pathways" />
                <meta property="og:description" content="Discover how we're using AI to create personalized learning journeys that adapt to your unique needs and learning style." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://yourlearningapp.com/about" />
                <meta property="og:image" content="https://yourlearningapp.com/images/about-meta.jpg" />
            </Head>

            <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 text-foreground">
                {/* Hero Section */}
                <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-90 z-10"></div>
                    <div className="absolute inset-0 z-0">
                        {/* Use Next.js Image component for optimized image loading */}
                        <Image
                            src="/images/about-hero.jpg" // Replace with your actual image path
                            alt="Hero image showing diverse people learning"
                            layout="fill"
                            objectFit="cover"
                            objectPosition="center"
                            priority // Prioritize loading this image
                        />
                    </div>
                    <div className="relative h-full flex flex-col justify-center items-center text-white z-20 px-4 sm:px-6 lg:px-8">
                        <motion.h1
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Revolutionizing How We Learn
                        </motion.h1>
                        <motion.p
                            className="text-xl md:text-2xl text-center max-w-3xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            Using AI to create personalized learning experiences that adapt to your unique journey
                        </motion.p>
                    </div>

                    {/* Decorative elements */}
                    <motion.div
                        className="absolute bottom-0 left-0 w-full h-16 z-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                    >
                        <svg className="w-full h-full" viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0,37 C240,74 480,0 720,37 C960,74 1200,0 1440,37 L1440,74 L0,74 Z" fill="white" className="dark:fill-gray-900" />
                        </svg>
                    </motion.div>
                </section>

                {/* Our Mission Section */}
                <section ref={missionRef} className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            className="flex flex-col lg:flex-row items-center gap-12"
                            initial={{ opacity: 0, y: 50 }}
                            animate={controlsMission}
                        >
                            <div className="lg:w-1/2">
                                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-600 dark:text-blue-400">Our Mission</h2>
                                <p className="text-lg mb-6 leading-relaxed">
                                    We believe that education should adapt to the learner, not the other way around.
                                    Our mission is to create a learning ecosystem where technology understands your
                                    unique skills, goals, and learning style to craft the perfect educational journey.
                                </p>
                                <p className="text-lg mb-8 leading-relaxed">
                                    By leveraging advanced AI algorithms through the Gemini API, we analyze your current
                                    knowledge, identify skill gaps, and curate personalized learning paths that evolve as you grow.
                                    Our platform continuously optimizes your learning experience, ensuring you&aposre always
                                    progressing in the most efficient and effective way possible.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Personalized Learning Paths</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Adaptive Feedback</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Learning Style Recognition</span>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:w-1/2 relative">
                                <div className="relative rounded-lg overflow-hidden shadow-xl">
                                    {/* Use Next.js Image for optimized image loading */}
                                    <Image
                                        src="/images/mission-image.jpg" // Replace with your actual image path
                                        alt="Illustration of personalized learning"
                                        width={600} // Provide width and height for better performance
                                        height={450}
                                        layout="responsive"
                                        objectFit="cover"
                                    />
                                </div>

                                {/* Decorative elements */}
                                <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-400 dark:bg-yellow-500/70 rounded-full opacity-30 z-0"></div>
                                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-500 dark:bg-blue-600/70 rounded-full opacity-20 z-0"></div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Our Story Section */}
                <section ref={storyRef} className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={controlsStory}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-purple-600 dark:text-purple-400">Our Story</h2>

                            <div className="relative">
                                {/* Timeline line */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-indigo-500 rounded"></div>

                                {/* Timeline items */}
                                <div className="space-y-24">
                                    {/* Item 1 */}
                                    <div className="relative z-10">
                                        <div className="flex flex-col md:flex-row items-center">
                                            <div className="md:w-1/2 md:pr-12 md:text-right">
                                                <h3 className="text-2xl font-bold mb-3 text-blue-600 dark:text-blue-400">The Spark</h3>
                                                <p className="text-lg leading-relaxed">
                                                    Our founder, Alex, witnessed firsthand the frustration of students trying to navigate the overwhelming sea of online courses and resources. There was a clear problem: despite having access to more educational content than ever before, learners were struggling to find the right path forward.
                                                </p>
                                            </div>
                                            <div className="mx-auto md:mx-0 my-6 md:my-0 flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-gray-700 shadow-md z-10">
                                                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">1</span>
                                            </div>
                                            <div className="md:w-1/2 md:pl-12">
                                                <div className="rounded-lg bg-white dark:bg-gray-700 shadow-md overflow-hidden">
                                                    {/* Use Next.js Image for optimized image loading */}
                                                    <Image
                                                        src="/images/story-1.jpg" // Replace with your actual image path
                                                        alt="Team brainstorming"
                                                        width={600}
                                                        height={400}
                                                        layout="responsive"
                                                        objectFit="cover"
                                                    />
                                                    <div className="p-6">
                                                        <h4 className="font-bold mb-2">2018</h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300">Initial research into adaptive learning systems and the development of our core algorithm concept.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Item 2 */}
                                    <div className="relative z-10">
                                        <div className="flex flex-col md:flex-row items-center">
                                            <div className="md:w-1/2 md:pr-12 md:text-right order-1 md:order-1">
                                                <div className="rounded-lg bg-white dark:bg-gray-700 shadow-md overflow-hidden">
                                                    {/* Use Next.js Image for optimized image loading */}
                                                    <Image
                                                        src="/images/story-2.jpg" // Replace with your actual image path
                                                        alt="Early prototype testing"
                                                        width={600}
                                                        height={400}
                                                        layout="responsive"
                                                        objectFit="cover"
                                                    />
                                                    <div className="p-6">
                                                        <h4 className="font-bold mb-2">2020</h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300">First prototype launched, featuring basic skill gap analysis and recommendation engine.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mx-auto md:mx-0 my-6 md:my-0 flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-gray-700 shadow-md z-10 order-0 md:order-2">
                                                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">2</span>
                                            </div>
                                            <div className="md:w-1/2 md:pl-12 order-2 md:order-3">
                                                <h3 className="text-2xl font-bold mb-3 text-purple-600 dark:text-purple-400">The Prototype</h3>
                                                <p className="text-lg leading-relaxed">
                                                    After two years of development, we launched our first beta with a small group of eager learners. The results were promising – users reported significantly better focus and motivation when following our personalized learning paths compared to generic curriculums.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Item 3 */}
                                    <div className="relative z-10">
                                        <div className="flex flex-col md:flex-row items-center">
                                            <div className="md:w-1/2 md:pr-12 md:text-right">
                                                <h3 className="text-2xl font-bold mb-3 text-indigo-600 dark:text-indigo-400">The Evolution</h3>
                                                <p className="text-lg leading-relaxed">
                                                    With the integration of advanced AI capabilities through the Gemini API, our platform took a quantum leap forward. We could now analyze learning styles, process resume text for skill extraction, and generate truly adaptive pathways that evolve with each user interaction.
                                                </p>
                                            </div>
                                            <div className="mx-auto md:mx-0 my-6 md:my-0 flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-gray-700 shadow-md z-10">
                                                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">3</span>
                                            </div>
                                            <div className="md:w-1/2 md:pl-12">
                                                <div className="rounded-lg bg-white dark:bg-gray-700 shadow-md overflow-hidden">
                                                    {/* Use Next.js Image for optimized image loading */}
                                                    <Image
                                                        src="/images/story-3.jpg" // Replace with your actual image path
                                                        alt="Team celebrating a milestone"
                                                        width={600}
                                                        height={400}
                                                        layout="responsive"
                                                        objectFit="cover"
                                                    />
                                                    <div className="p-6">
                                                        <h4 className="font-bold mb-2">2023</h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300">Launch of our AI-powered platform with dynamic learning path generation and real-time adaptation.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Item 4 */}
                                    <div className="relative z-10">
                                        <div className="flex flex-col md:flex-row items-center">
                                            <div className="md:w-1/2 md:pr-12 md:text-right order-1 md:order-1">
                                                <div className="rounded-lg bg-white dark:bg-gray-700 shadow-md overflow-hidden">
                                                    {/* Use Next.js Image for optimized image loading */}
                                                    <Image
                                                        src="/images/story-4.jpg" // Replace with your actual image path
                                                        alt="Diverse group of learners using the platform"
                                                        width={600}
                                                        height={400}
                                                        layout="responsive"
                                                        objectFit="cover"
                                                    />
                                                    <div className="p-6">
                                                        <h4 className="font-bold mb-2">Today</h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300">Continuous improvement with a growing community of learners helping shape the future of personalized education.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mx-auto md:mx-0 my-6 md:my-0 flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-gray-700 shadow-md z-10 order-0 md:order-2">
                                                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">4</span>
                                            </div>
                                            <div className="md:w-1/2 md:pl-12 order-2 md:order-3">
                                                <h3 className="text-2xl font-bold mb-3 text-green-600 dark:text-green-400">The Present</h3>
                                                <p className="text-lg leading-relaxed">
                                                    Today, our platform serves thousands of learners across diverse fields, from software development to design, business, and beyond. We&aposre constantly refining our algorithms based on user feedback and learning outcomes, making education more accessible and effective for everyone.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Team Section */}
                <section ref={teamRef} className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={controlsTeam}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-green-600 dark:text-green-400">Meet Our Team</h2>
                            <p className="text-lg text-center max-w-3xl mx-auto mb-16">
                                Our diverse team of experts combines deep knowledge in AI, education, psychology, and design to create a revolutionary learning experience.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {teamMembers.map((member, index) => (
                                    <motion.div
                                        key={member.id}
                                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.1 * index }}
                                        whileHover={{ y: -5 }}
                                    >
                                        {/* Use Next.js Image for optimized image loading */}
                                        <div className="relative h-64">
                                         <Image
                                            src={member.image}
                                            alt={`Photo of ${member.name}`}
                                            layout="fill"
                                            objectFit="cover"
                                            objectPosition="center"
                                            className="rounded-t-xl"
                                         />
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                                            <p className="text-purple-600 dark:text-purple-400 font-medium mb-4">{member.role}</p>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm">{member.bio}</p>

                                            <div className="mt-6 flex space-x-3">
                                                {member.twitter && (
                                                    <a href={member.twitter} className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" aria-label={`Follow ${member.name} on Twitter`}>
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" >
                                                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                                        </svg>
                                                    </a>
                                                )}
                                                {member.linkedin && (
                                                    <a href={member.linkedin} className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" aria-label={`Connect with ${member.name} on LinkedIn`}>
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 1.598 1.028 2.493.786.078-.614.348-1.027.632-1.258-2.36-0.268-4.844-1.182-4.844-5.255 0-1.16.415-2.112 1.093-2.856-.11-.269-.475-1.351.104-2.821 0 0 .892-.286 2.923 1.09.846-.236 1.748-.354 2.648-.358.9.004 1.803.122 2.648.358 2.03-1.377 2.922-1.09 2.922-1.09.58 1.47.216 2.552.106 2.82-.68.745-1.094 1.697-1.094 2.857 0 4.08-2.488 4.982-4.854 5.245.387.332.717.992.717 2.003 0 1.448-.012 2.619-.012 2.986 0 5.533-4.477 10-10 10zM6.5 9.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm11 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8 16.75a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75v-.01zM16 16.75a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75v-.01z" />
                                                        </svg>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section ref={testimonialsRef} className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={controlsTestimonials}
                            className="text-center"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">What Learners Are Saying</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
                                See how our platform has helped learners achieve their goals and transform their careers.
                            </p>

                            <div className="relative">
                                {/* Testimonial Carousel */}
                                <AnimatePresence initial={false}>
                                    <motion.div
                                        key={testimonials[activeTestimonial].id}
                                        className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-8 md:p-12 mx-auto max-w-4xl"
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        transition={{ duration: 0.6, ease: "easeInOut" }}
                                    >
                                        <blockquote className="text-xl md:text-2xl italic leading-relaxed text-gray-700 dark:text-gray-200">
                                            “{testimonials[activeTestimonial].content}”
                                        </blockquote>
                                        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
                                            <div className="flex-shrink-0">
                                                {/* Placeholder image - replace with actual user avatars if available */}
                                                <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                                            </div>
                                            <div>
                                                <p className="font-bold text-purple-600 dark:text-purple-400">{testimonials[activeTestimonial].author}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{testimonials[activeTestimonial].role}, {testimonials[activeTestimonial].company}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Navigation Dots */}
                                <div className="mt-8 flex justify-center space-x-2">
                                    {testimonials.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleTestimonialChange(index)}
                                            className={`w-3 h-3 rounded-full transition-colors ${
                                                index === activeTestimonial
                                                    ? 'bg-purple-600 dark:bg-purple-400'
                                                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-purple-400 dark:hover:bg-purple-500'
                                            }`}
                                            aria-label={`Go to testimonial ${index + 1}`}
                                        ></button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default AboutPage;
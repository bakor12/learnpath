import { useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// Types for our policy sections
interface PolicySection {
  id: string;
  title: string;
  content: string | string[];
  lastUpdated?: string;
}

const PrivacyPolicy = () => {
  // Track scroll position for table of contents highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section) => {
        if (section instanceof HTMLElement) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          const sectionId = section.getAttribute('id');
          const tocLink = document.querySelector(`a[href="#${sectionId}"]`);

          if (tocLink && scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            tocLink.classList.add('text-blue-600', 'dark:text-blue-400', 'font-medium');
          } else if (tocLink) {
            tocLink.classList.remove('text-blue-600', 'dark:text-blue-400', 'font-medium');
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Policy sections data
  const policySections: PolicySection[] = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      content: [
        'Personal information such as name, email, and profile details',
        'Learning progress and assessment data',
        'Usage data and analytics',
        'Device and browser information',
      ],
      lastUpdated: '2024-02-23',
    },
    {
      id: 'information-usage',
      title: 'How We Use Your Information',
      content: [
        'Personalizing your learning experience',
        'Improving our AI-powered recommendations',
        'Analyzing platform usage and performance',
        'Communication about your learning progress',
      ],
    },
    {
      id: 'data-protection',
      title: 'Data Protection',
      content: `We implement industry-standard security measures to protect your personal information. 
      This includes encryption, secure data storage, and regular security audits. We ensure compliance 
      with relevant data protection regulations and maintain transparent data handling practices.`,
    },
    // Add more sections as needed
  ];

  return (
    <>
      <Head>
        <title>Privacy Policy | AI-Powered Learning Platform</title>
        <meta name="description" content="Our commitment to protecting your privacy and data while using our AI-powered learning platform" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <main className="container-padded">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16 md:py-24"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Your privacy matters to us. Learn how we protect your data while delivering 
              personalized learning experiences.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-16">
            {/* Table of Contents - Fixed on Desktop */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Contents
                </h2>
                <nav className="space-y-2">
                  {policySections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <motion.div 
              className="lg:col-span-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {policySections.map((section) => (
                  <motion.section
                    key={section.id}
                    id={section.id}
                    variants={sectionVariants}
                    className="mb-12"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                        {section.title}
                      </h2>
                      
                      {Array.isArray(section.content) ? (
                        <ul className="space-y-4">
                          {section.content.map((item, index) => (
                            <li 
                              key={index}
                              className="flex items-start"
                            >
                              <span className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-blue-600 dark:bg-blue-400 mr-3" />
                              <span className="text-gray-700 dark:text-gray-300">{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {section.content}
                        </p>
                      )}

                      {section.lastUpdated && (
                        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                          Last updated: {new Date(section.lastUpdated).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </motion.section>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default PrivacyPolicy;
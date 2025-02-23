import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';

// Types for our terms sections and acceptance status
interface TermsSection {
  id: string;
  title: string;
  content: string;
  lastUpdated: string;
}

interface TermsPageProps {
  initialTermsSections: TermsSection[];
}

// Helper function to format dates consistently
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Animation variants for scroll reveal effects
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Component for individual terms sections with collapsible content
const TermsSectionComponent = ({ section }: { section: TermsSection }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      variants={sectionVariants}
      className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {section.title}
        </h3>
        <svg
          className={`w-5 h-5 transform transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? "auto" : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-6 py-4">
          <div className="prose dark:prose-invert max-w-none">
            {section.content}
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Last updated: {formatDate(section.lastUpdated)}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Terms acceptance banner component
const AcceptanceBanner = ({
  onAccept,
  onDecline
}: {
  onAccept: () => void;
  onDecline: () => void;
}) => (
  <motion.div
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg"
  >
    <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Please review and accept our Terms and Conditions to continue using our services.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onDecline}
            className="btn-secondary text-sm px-4 py-2"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            className="btn-primary text-sm px-4 py-2"
          >
            Accept Terms
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

// Quick navigation component for jumping to sections
const QuickNav = ({
  sections,
  activeSection
}: {
  sections: TermsSection[];
  activeSection: string;
}) => (
  <nav className="hidden lg:block sticky top-24 w-64 ml-8">
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Quick Navigation
      </h4>
      <ul className="space-y-2">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={`block text-sm py-2 px-3 rounded-md transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  </nav>
);

// Main Terms page component
const TermsPage: React.FC<TermsPageProps> = ({ initialTermsSections }) => {
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>();
  const [activeSection, setActiveSection] = useState<string>("");

  // Effect to check terms acceptance status from localStorage
  useEffect(() => {
    const accepted = localStorage.getItem('termsAccepted');
    setAcceptedTerms(accepted === 'true');
  }, []);

  // Effect to handle scroll spy for navigation
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section-id]');
      let currentSection = '';
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100) {
          currentSection = section.getAttribute('data-section-id') || '';
        }
      });
      
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAcceptTerms = () => {
    localStorage.setItem('termsAccepted', 'true');
    setAcceptedTerms(true);
  };

  const handleDeclineTerms = () => {
    localStorage.setItem('termsAccepted', 'false');
    setAcceptedTerms(false);
  };

  return (
    <>
      <Head>
        <title>Terms and Conditions | Learning Path Generator</title>
        <meta name="description" content="Review our terms and conditions for using the Learning Path Generator platform" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto lg:max-w-none lg:flex lg:items-start lg:gap-8">
            <main className="flex-1">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Terms and Conditions
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Please read these terms and conditions carefully before using our services.
                </p>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {initialTermsSections.map((section) => (
                  <div key={section.id} data-section-id={section.id}>
                    <TermsSectionComponent section={section} />
                  </div>
                ))}
              </motion.div>
            </main>

            <QuickNav
              sections={initialTermsSections}
              activeSection={activeSection}
            />
          </div>
        </div>

        {acceptedTerms === false && (
          <AcceptanceBanner
            onAccept={handleAcceptTerms}
            onDecline={handleDeclineTerms}
          />
        )}
      </div>
    </>
  );
};

// Get initial props for static generation
export const getStaticProps = async () => {
  // In a real application, this would fetch from an API or CMS
  const initialTermsSections: TermsSection[] = [
    {
      id: 'introduction',
      title: 'Introduction',
      content: 'These terms and conditions outline the rules and regulations for the use of our Learning Path Generator...',
      lastUpdated: '2024-02-23'
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property Rights',
      content: 'Our platform and its original content, features, and functionality are owned by us and are protected by international copyright...',
      lastUpdated: '2024-02-23'
    },
    // Add more sections as needed
  ];

  return {
    props: {
      initialTermsSections
    },
    // Revalidate every 24 hours
    revalidate: 86400
  };
};

export default TermsPage;
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { ChevronDown,  Search, X } from 'lucide-react';
import { Card } from '@/components/ui/card';

// Type definitions for our FAQ data
interface FAQCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
}

// FAQ page component
const FAQPage: React.FC = () => {
  // State management
  const [faqData, setFaqData] = useState<FAQItem[]>([]);
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filteredFAQs, setFilteredFAQs] = useState<FAQItem[]>([]);

  // Fetch FAQ data on component mount
  useEffect(() => {
    const fetchFAQData = async (): Promise<void> => {
      try {
        // In a real application, this would be an API call
        // For now, we'll use mock data
        setFaqData(mockFAQData);
        setCategories(mockCategories);
        setFilteredFAQs(mockFAQData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching FAQ data:', error);
        setIsLoading(false);
      }
    };

    fetchFAQData();
  }, []);

  // Filter FAQs based on search query and selected category
  useEffect(() => {
    if (faqData.length === 0) return;

    const query = searchQuery.toLowerCase().trim();
    
    const filtered = faqData.filter((faq) => {
      const matchesQuery = !query || 
        faq.question.toLowerCase().includes(query) || 
        faq.answer.toLowerCase().includes(query);
      
      const matchesCategory = activeCategory === 'all' || faq.categoryId === activeCategory;
      
      return matchesQuery && matchesCategory;
    });

    setFilteredFAQs(filtered);
  }, [searchQuery, activeCategory, faqData]);

  // Toggle FAQ item expansion
  const toggleExpand = (id: string): void => {
    const newExpandedItems = new Set(expandedItems);
    
    if (newExpandedItems.has(id)) {
      newExpandedItems.delete(id);
    } else {
      newExpandedItems.add(id);
    }
    
    setExpandedItems(newExpandedItems);
  };

  // Clear search query
  const clearSearch = (): void => {
    setSearchQuery('');
  };

  // Handle category selection
  const handleCategoryChange = (categoryId: string): void => {
    setActiveCategory(categoryId);
    // Reset expanded items when changing categories
    setExpandedItems(new Set());
  };

  // Animation variants for motion components
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <>
      <Head>
        <title>FAQ - Learning Path Personalization Platform</title>
        <meta name="description" content="Frequently asked questions about our AI-powered learning path platform" />
      </Head>

      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <motion.section 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Find answers to common questions about our AI-powered learning path platform
            </p>
          </motion.section>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8 relative"
          >
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for questions or answers..."
                className="form-input pl-10 pr-10 py-3 w-full rounded-full border-gray-300 dark:border-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                aria-label="Search FAQs"
              />
              {searchQuery && (
                <button 
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  aria-label="Clear search"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Category Navigation */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-10"
          >
            <div className="flex flex-wrap justify-center gap-2 md:gap-4">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                All Questions
              </button>
              
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {category.icon}
                  {category.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* FAQ Content */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse flex flex-col space-y-4 w-full max-w-3xl">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl w-full"></div>
                ))}
              </div>
            </div>
          ) : filteredFAQs.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {filteredFAQs.map((faq) => {
                const isExpanded = expandedItems.has(faq.id);
                
                return (
                  <motion.div key={faq.id} variants={itemVariants}>
                    <Card
                      variant="bordered"
                      isHoverable
                      className="overflow-hidden"
                    >
                      <button
                        onClick={() => toggleExpand(faq.id)}
                        className="w-full p-6 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-t-xl"
                        aria-expanded={isExpanded}
                        aria-controls={`faq-answer-${faq.id}`}
                      >
                        <h3 className="text-lg md:text-xl font-medium text-gray-900 dark:text-white">
                          {faq.question}
                        </h3>
                        <ChevronDown
                          className={`flex-shrink-0 h-5 w-5 text-gray-500 transition-transform duration-300 ${
                            isExpanded ? 'transform rotate-180' : ''
                          }`}
                        />
                      </button>
                      
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          id={`faq-answer-${faq.id}`}
                          className="px-6 pb-6 text-gray-600 dark:text-gray-300"
                        >
                          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                            <div 
                              className="prose prose-blue dark:prose-invert max-w-none"
                              dangerouslySetInnerHTML={{ __html: faq.answer }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  No matching questions found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search query or category filter to find what you&apos;re looking for.
                </p>
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Clear search
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-16 text-center bg-blue-50 dark:bg-gray-800/50 rounded-2xl p-8 shadow-sm border border-blue-100 dark:border-gray-700"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Still have questions?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-xl mx-auto">
              If you couldn&apos;t find the answer to your question, feel free to reach out to our support team.
            </p>
            <Link
              href="/support"
              className="btn-primary"
            >
              Contact Support
            </Link>
          </motion.div>
        </div>
      </main>
    </>
  );
};

// Mock categories with icons
const mockCategories: FAQCategory[] = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Basic questions about our platform',
    icon: <div className="h-4 w-4 bg-emerald-500 rounded-full" />
  },
  {
    id: 'learning-paths',
    name: 'Learning Paths',
    description: 'Questions about personalized learning paths',
    icon: <div className="h-4 w-4 bg-blue-500 rounded-full" />
  },
  {
    id: 'ai-technology',
    name: 'AI Technology',
    description: 'Questions about our AI implementation',
    icon: <div className="h-4 w-4 bg-purple-500 rounded-full" />
  },
  {
    id: 'account',
    name: 'Account & Privacy',
    description: 'Questions about accounts and data privacy',
    icon: <div className="h-4 w-4 bg-amber-500 rounded-full" />
  },
  {
    id: 'technical',
    name: 'Technical Support',
    description: 'Technical questions and troubleshooting',
    icon: <div className="h-4 w-4 bg-red-500 rounded-full" />
  }
];

// Mock FAQ data
const mockFAQData: FAQItem[] = [
  {
    id: '1',
    question: 'What is an AI-powered learning path?',
    answer: 'An AI-powered learning path is a personalized educational journey created specifically for you based on your existing skills, learning goals, and preferred learning style. Our platform uses advanced AI algorithms to analyze your current knowledge base and create a tailored roadmap with curated resources that help you achieve your learning objectives in the most efficient way possible.',
    categoryId: 'getting-started'
  },
  {
    id: '2',
    question: 'How does the skill assessment work?',
    answer: 'Our skill assessment works in multiple ways:<ul class="list-disc pl-5 mt-2 space-y-1"><li>You can upload your resume or LinkedIn profile for automatic skill detection</li><li>Take interactive quizzes that adapt to your knowledge level</li><li>Self-evaluate your proficiency in various areas</li><li>Import badges and certificates from other platforms</li></ul>The AI analyzes this information to create a comprehensive map of your current skills and identifies the most beneficial areas for growth.',
    categoryId: 'getting-started'
  },
  {
    id: '3',
    question: 'Can I change my learning path once it\'s created?',
    answer: 'Absolutely! Your learning path is dynamic and can be adjusted at any time. As you progress, you might discover new interests or realize certain areas need more attention. You can:<ul class="list-disc pl-5 mt-2 space-y-1"><li>Add or remove specific skills from your learning goals</li><li>Adjust the difficulty level of recommended resources</li><li>Prioritize certain topics over others</li><li>Request alternative learning resources if the current ones don\'t match your learning style</li></ul>The AI will recalibrate your path while preserving your overall learning objectives.',
    categoryId: 'learning-paths'
  },
  {
    id: '4',
    question: 'How often is my learning path updated?',
    answer: 'Your learning path is updated in several ways:<ol class="list-decimal pl-5 mt-2 space-y-1"><li><strong>Automatically</strong>: As you complete modules and demonstrate new skills, the AI adjusts future recommendations.</li><li><strong>Periodically</strong>: The system reviews your progress every two weeks and suggests potential optimizations.</li><li><strong>On-demand</strong>: You can request a full recalibration at any time, especially after acquiring significant new skills or changing your learning goals.</li><li><strong>Resource updates</strong>: When better learning resources become available for your specific needs, they are automatically incorporated.</li></ol>',
    categoryId: 'learning-paths'
  },
  {
    id: '5',
    question: 'What types of resources are included in the learning paths?',
    answer: 'Our learning paths include a diverse range of resources to accommodate different learning styles and needs:<ul class="list-disc pl-5 mt-2 space-y-1"><li>Video tutorials and courses from top educational platforms</li><li>Interactive coding environments and exercises</li><li>Comprehensive articles and guides</li><li>E-books and academic papers</li><li>Quizzes and assessments to test your knowledge</li><li>Community discussions and forum posts</li><li>Project-based learning opportunities</li><li>Podcast episodes and audio content</li></ul>Each resource is carefully vetted for quality and relevance to your specific learning objectives.',
    categoryId: 'learning-paths'
  },
  {
    id: '6',
    question: 'How does the AI determine my learning style?',
    answer: 'Our AI determines your learning style through multiple approaches:<ol class="list-decimal pl-5 mt-2 space-y-1"><li><strong>Initial assessment</strong>: You can take a brief learning style quiz when setting up your profile</li><li><strong>Behavioral analysis</strong>: The system observes which types of resources you engage with most and complete successfully</li><li><strong>Explicit feedback</strong>: Ratings you provide after completing learning modules help refine the understanding of your preferences</li><li><strong>Completion patterns</strong>: The AI notes whether you prefer to finish shorter modules in one sitting or break larger content into segments</li></ol>This multi-faceted approach ensures that recommendations increasingly align with how you learn best.',
    categoryId: 'ai-technology'
  },
  {
    id: '7',
    question: 'Is my data secure and private?',
    answer: 'Yes, we take data security and privacy very seriously:<ul class="list-disc pl-5 mt-2 space-y-1"><li>All personal data is encrypted both in transit and at rest</li><li>We follow GDPR, CCPA, and other relevant privacy regulations</li><li>Your learning data is never sold to third parties</li><li>You maintain ownership of all your uploaded content</li><li>You can request complete data deletion at any time</li><li>Our AI training processes anonymize user data</li></ul>We use your information solely to improve your learning experience and the overall functionality of our platform.',
    categoryId: 'account'
  },
  {
    id: '8',
    question: 'What happens if I get stuck on a learning module?',
    answer: 'If you get stuck on a learning module, you have several options:<ul class="list-disc pl-5 mt-2 space-y-1"><li><strong>Alternative resources</strong>: The system can suggest different resources that cover the same topic from another angle or learning style</li><li><strong>Prerequisite check</strong>: The AI can identify if you\'re missing foundational knowledge and recommend bridging content</li><li><strong>Community support</strong>: Connect with peers who have successfully completed the same module</li><li><strong>AI assistance</strong>: Get hints and guided explanations for difficult concepts</li><li><strong>Expert help</strong>: For premium users, request assistance from subject matter experts</li></ul>Our goal is to ensure you never remain stuck for long, as this can diminish motivation and learning momentum.',
    categoryId: 'technical'
  },
  {
    id: '9',
    question: 'How accurate is the Gemini API in assessing my skills?',
    answer: 'The Gemini API achieves high accuracy in skill assessment through several mechanisms:<ul class="list-disc pl-5 mt-2 space-y-1"><li>Advanced natural language processing to analyze resume content and self-descriptions</li><li>Pattern recognition across thousands of skill relationships and dependencies</li><li>Continuous learning from user feedback and progression data</li><li>Cross-referencing skills with standardized competency frameworks</li></ul>While no AI system is perfect, our accuracy rates typically exceed 90% for technical skills and 85% for soft skills. The system also expresses confidence levels with each assessment, allowing for human verification when confidence is lower.',
    categoryId: 'ai-technology'
  },
  {
    id: '10',
    question: 'Can I use the platform offline?',
    answer: 'While our platform primarily requires an internet connection for full functionality, we do offer several offline capabilities:<ul class="list-disc pl-5 mt-2 space-y-1"><li>Downloaded resources can be accessed without connection</li><li>Progress tracking is stored locally and synced when you reconnect</li><li>Mobile apps cache your current learning modules for offline use</li><li>Practice exercises and coding environments have offline modes with limited functionality</li></ul>For extended offline use, we recommend downloading necessary resources in advance using the "Save for Offline" feature in each module.',
    categoryId: 'technical'
  }
];

export default FAQPage;
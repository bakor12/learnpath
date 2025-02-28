import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, X, HelpCircle, CreditCard, Users, Zap } from 'lucide-react';
import { useRouter } from 'next/router';

// Define price plan types
interface Feature {
  name: string;
  included: boolean;
  tooltip?: string;
}

interface PricePlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    annually: number;
  };
  features: Feature[];
  highlighted?: boolean;
  buttonText: string;
  badge?: string;
}

const Pricing: React.FC = () => {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  const [isTooltipVisible, setTooltipVisible] = useState<string | null>(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // Pricing plans data
  const pricingPlans: PricePlan[] = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for getting started with personalized learning paths',
      price: {
        monthly: 0,
        annually: 0,
      },
      features: [
        { name: 'Basic skill assessment', included: true },
        { name: 'Limited learning path generation', included: true, tooltip: 'Generate up to 3 learning paths per month' },
        { name: 'Access to free resources only', included: true },
        { name: 'Standard AI-powered recommendations', included: true },
        { name: 'Basic progress tracking', included: true },
        { name: 'Community support', included: true },
        { name: 'Premium content access', included: false },
        { name: 'Advanced learning analytics', included: false },
        { name: 'Priority updates to learning paths', included: false },
      ],
      buttonText: 'Start For Free',
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Unlock advanced features for serious learners',
      price: {
        monthly: 12.99,
        annually: 9.99,
      },
      features: [
        { name: 'Comprehensive skill assessment', included: true },
        { name: 'Unlimited learning path generation', included: true },
        { name: 'Access to premium resources', included: true, tooltip: 'Curated selection of premium courses and materials' },
        { name: 'Enhanced AI-powered recommendations', included: true },
        { name: 'Detailed progress tracking', included: true },
        { name: 'Email support', included: true },
        { name: 'Premium content access', included: true },
        { name: 'Advanced learning analytics', included: true },
        { name: 'Priority updates to learning paths', included: false },
      ],
      buttonText: 'Start Pro Plan',
      highlighted: true,
      badge: 'Popular',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Custom solutions for teams and organizations',
      price: {
        monthly: 29.99,
        annually: 24.99,
      },
      features: [
        { name: 'Team skill assessment dashboard', included: true },
        { name: 'Unlimited learning paths for all members', included: true },
        { name: 'Access to all premium & exclusive resources', included: true },
        { name: 'Advanced AI-powered team recommendations', included: true, tooltip: 'Personalized for each team member plus group synergy analysis' },
        { name: 'Team progress analytics', included: true },
        { name: 'Dedicated support manager', included: true },
        { name: 'Premium content access', included: true },
        { name: 'Advanced learning analytics', included: true },
        { name: 'Priority updates to learning paths', included: true },
      ],
      buttonText: 'Contact Sales',
    },
  ];

  // Calculate savings percentages
  const calculateSavings = (plan: PricePlan): number => {
    if (plan.price.annually === 0) return 0;
    return Math.round(((plan.price.monthly - plan.price.annually) / plan.price.monthly) * 100);
  };

  // Handle plan selection
  const handleSelectPlan = (planId: string) => {
    if (planId === 'enterprise') {
      // Redirect to contact form for enterprise
      router.push('/contact?plan=enterprise');
    } else {
      // Redirect to signup with the selected plan
      router.push(`/signup?plan=${planId}&billing=${billingCycle}`);
    }
  };

  return (
    <>
      <Head>
        <title>Pricing Plans | Learning Path AI</title>
        <meta name="description" content="Choose the perfect plan to accelerate your learning journey with AI-powered personalized learning paths" />
      </Head>

      <div className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
        <div className="container-padded page-section">
          {/* Page header */}
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Choose Your <span className="text-blue-600 dark:text-blue-400">Learning Journey</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Unlock personalized learning paths tailored to your unique skills and goals
            </p>

            {/* Billing toggle */}
            <div className="inline-flex items-center bg-white dark:bg-gray-800 p-1 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annually')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 relative ${
                  billingCycle === 'annually'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Annually
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1 py-0.5 rounded-full">
                  Save
                </span>
              </button>
            </div>
          </motion.div>

          {/* Pricing cards */}
          <motion.div
            className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {pricingPlans.map((plan) => (
              <motion.div
                key={plan.id}
                variants={itemVariants}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl ${
                  plan.highlighted ? 'ring-2 ring-blue-500 dark:ring-blue-400 md:scale-105' : 'border border-gray-200 dark:border-gray-700'
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <span className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-blue-400 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    {plan.badge}
                  </span>
                )}

                {/* Plan header */}
                <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{plan.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 h-12">{plan.description}</p>
                  
                  <div className="mt-6 mb-6">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ${billingCycle === 'monthly' ? plan.price.monthly : plan.price.annually}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {plan.price.monthly > 0 ? '/month' : ''}
                    </span>
                    
                    {billingCycle === 'annually' && plan.price.monthly > 0 && (
                      <div className="mt-2 text-green-600 dark:text-green-400 text-sm font-medium flex items-center justify-center">
                        <Zap className="h-4 w-4 mr-1" />
                        Save {calculateSavings(plan)}% annually
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center ${
                      plan.highlighted
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                    }`}
                  >
                    {plan.id === 'enterprise' ? <Users className="mr-2 h-5 w-5" /> : <CreditCard className="mr-2 h-5 w-5" />}
                    {plan.buttonText}
                  </button>
                </div>

                {/* Features list */}
                <ul className="p-6 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                      )}
                      <span className="text-gray-700 dark:text-gray-300 flex-1">
                        {feature.name}
                        {feature.tooltip && (
                          <div className="relative inline-block">
                            <HelpCircle
                              className="h-4 w-4 text-gray-400 inline-block ml-1 cursor-pointer"
                              onMouseEnter={() => setTooltipVisible(`${plan.id}-${index}`)}
                              onMouseLeave={() => setTooltipVisible(null)}
                            />
                            {isTooltipVisible === `${plan.id}-${index}` && (
                              <div className="absolute z-10 w-64 p-2 mt-2 text-sm text-white bg-gray-800 rounded-md shadow-lg -left-32 top-full">
                                {feature.tooltip}
                              </div>
                            )}
                          </div>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* FAQs Section */}
          <div className="mt-24 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            
            <motion.div className="space-y-6">
              {[
                {
                  question: "Can I change plans later?",
                  answer: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be prorated for the remaining time. When downgrading, changes will take effect at the end of your current billing cycle."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards, PayPal, and for Enterprise plans, we also support invoice payment."
                },
                {
                  question: "Is there a refund policy?",
                  answer: "Yes, we offer a 14-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team within 14 days of your purchase for a full refund."
                },
                {
                  question: "Do you offer discounts for students or educators?",
                  answer: "Yes! We offer a 50% discount for verified students and educators. Contact our support team with your academic credentials to apply for the discount."
                }
              ].map((faq, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{faq.question}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* CTA Section */}
          <motion.div 
            className="mt-20 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Still have questions?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/support" className="btn-secondary">
                Contact Support
              </Link>
              <Link href="/demo" className="btn-primary">
                Schedule a Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Pricing;
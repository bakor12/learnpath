import React, { useState, useRef} from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Mail, Phone, MessageSquare, MapPin, Send, Check, AlertCircle } from 'lucide-react';

// Types for form data and validation
interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface SupportCategory {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Support page component
const SupportPage: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  
  // Animation variants
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Form reference for scrolling
  const formRef = useRef<HTMLFormElement>(null);
  
  // Support categories data
  const supportCategories: SupportCategory[] = [
    {
      id: 'general',
      icon: <MessageSquare className="w-6 h-6 text-blue-500" />,
      title: 'General Inquiries',
      description: 'Questions about our platform, services, or company information.'
    },
    {
      id: 'technical',
      icon: <AlertCircle className="w-6 h-6 text-purple-500" />,
      title: 'Technical Support',
      description: 'Issues with your account, learning path, or platform functionality.'
    },
    {
      id: 'feedback',
      icon: <Send className="w-6 h-6 text-green-500" />,
      title: 'Feedback & Suggestions',
      description: 'Share your ideas on how we can improve our learning path platform.'
    }
  ];
  
  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Validate email with regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Validate subject
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    // Validate message
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulating API call with timeout
      // In a real application, you would make an API call to your backend
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Success case
      setSubmitStatus('success');
      setStatusMessage('Your message has been sent successfully. We will get back to you soon!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
    } catch (error) {
      // Error case
      setSubmitStatus('error');
      setStatusMessage('There was an error sending your message. Please try again later.');
      console.error('Support form submission error:', error);
    } finally {
      setIsSubmitting(false);
      
      // Auto-reset status after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
        setStatusMessage('');
      }, 5000);
    }
  };
  
  // Scroll to form when a support category is clicked
  const scrollToForm = (category: string): void => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
      
      // Pre-fill subject based on category
      const subjectMap: Record<string, string> = {
        general: 'General Inquiry',
        technical: 'Technical Support Request',
        feedback: 'Feedback & Suggestions'
      };
      
      setFormData((prev) => ({
        ...prev,
        subject: subjectMap[category] || prev.subject
      }));
    }
  };
  
  // Render status alert based on submission status
  const renderStatusAlert = (): React.ReactNode => {
    if (submitStatus === 'idle') return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className={`p-4 mb-6 rounded-lg flex items-center ${
          submitStatus === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
        }`}
      >
        {submitStatus === 'success' ? (
          <Check className="w-5 h-5 mr-2" />
        ) : (
          <AlertCircle className="w-5 h-5 mr-2" />
        )}
        <p>{statusMessage}</p>
      </motion.div>
    );
  };
  
  return (
    <>
      <Head>
        <title>Support & Contact | AI Learning Path Generator</title>
        <meta name="description" content="Get help and support for your personalized AI learning journey. Contact our team with questions, feedback, or technical issues." />
      </Head>
      
      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              How Can We Help You?
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our support team is dedicated to ensuring your learning journey is smooth and successful. 
              Choose a category below or contact us directly.
            </p>
          </motion.div>
          
          {/* Support Categories */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
            variants={itemVariants}
          >
            {supportCategories.map((category) => (
              <motion.div 
                key={category.id}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="cursor-pointer"
                onClick={() => scrollToForm(category.id)}
              >
                <Card className="h-full hover:border-blue-400 hover:shadow-md transition-all duration-300">
                  <Card.Header>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                      {category.icon}
                    </div>
                    <Card.Title>{category.title}</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <p className="text-gray-600 dark:text-gray-300">{category.description}</p>
                  </Card.Content>
                  <Card.Footer>
                    <button 
                      className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                      onClick={() => scrollToForm(category.id)}
                    >
                      Get Help →
                    </button>
                  </Card.Footer>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Contact Information */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
            variants={itemVariants}
          >
            <Card className="lg:col-span-1">
              <Card.Header>
                <Card.Title>Contact Information</Card.Title>
                <Card.Description>
                  Reach out to us using any of the following methods
                </Card.Description>
              </Card.Header>
              <Card.Content className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">Email</h4>
                    <p className="text-gray-600 dark:text-gray-300">support@learningpath.ai</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">We respond within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">Phone</h4>
                    <p className="text-gray-600 dark:text-gray-300">+1 (888) 123-4567</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Mon-Fri, 9AM-5PM EST</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">Office</h4>
                    <p className="text-gray-600 dark:text-gray-300">123 Learning Street</p>
                    <p className="text-gray-600 dark:text-gray-300">Suite 456</p>
                    <p className="text-gray-600 dark:text-gray-300">San Francisco, CA 94103</p>
                  </div>
                </div>
              </Card.Content>
              <Card.Footer>
                <div className="flex space-x-4">
                  <Link href="https://twitter.com/learningpathAI" target="_blank" rel="noopener noreferrer">
                    <span className="sr-only">Twitter</span>
                    <svg className="w-6 h-6 text-gray-600 hover:text-blue-500 transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </Link>
                  <Link href="https://www.linkedin.com/company/learningpathAI" target="_blank" rel="noopener noreferrer">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="w-6 h-6 text-gray-600 hover:text-blue-700 transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </Link>
                  <Link href="https://github.com/learningpathAI" target="_blank" rel="noopener noreferrer">
                    <span className="sr-only">GitHub</span>
                    <svg className="w-6 h-6 text-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </Card.Footer>
            </Card>
            
            {/* Contact Form */}
            <Card className="lg:col-span-2">
              <Card.Header>
                <Card.Title>Send Us a Message</Card.Title>
                <Card.Description>
                  Fill out the form below and we&apos;ll get back to you as soon as possible
                </Card.Description>
              </Card.Header>
              <Card.Content>
                {renderStatusAlert()}
                
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`form-input ${errors.name ? 'border-red-500 dark:border-red-400' : ''}`}
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`form-input ${errors.email ? 'border-red-500 dark:border-red-400' : ''}`}
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`form-input ${errors.subject ? 'border-red-500 dark:border-red-400' : ''}`}
                      placeholder="How can we help you?"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.subject}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      className={`form-input resize-none ${errors.message ? 'border-red-500 dark:border-red-400' : ''}`}
                      placeholder="Please describe your issue or question in detail..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.message}</p>
                    )}
                  </div>
                  
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="btn-primary w-full sm:w-auto flex items-center justify-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </Card.Content>
            </Card>
          </motion.div>
          
          {/* FAQ Section Teaser */}
          <motion.div 
            className="text-center py-12 px-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
            variants={itemVariants}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Have a question?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Check our comprehensive FAQ section where we&apos;ve answered the most common questions about our AI Learning Path platform.
            </p>
            <Link href="/faq" className="btn-primary">
              Visit FAQ Page
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
};

export default SupportPage;
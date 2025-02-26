import React, { useState, useRef } from 'react';
import Head from 'next/head';
//import Image from 'next/image';
import FileUpload from '@/components/ui/FileUpload';
import QuestionForm from '@/components/ui/QuestionForm';
import { getSession } from 'next-auth/react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { GetServerSidePropsContext } from 'next';
import { UploadResponse, UploadResult } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Book, Brain, FileQuestion, CheckCircle2 } from 'lucide-react';

interface HomeProps {
  username?: string;
}

export default function Home({  }: HomeProps) {
  const [uploadedDocIds, setUploadedDocIds] = useState<string[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<UploadResult[]>([]);
  const [showUploaded, setShowUploaded] = useState<boolean>(false);
  const questionSectionRef = useRef<HTMLDivElement>(null);

  const handleUploadSuccess = (results: UploadResponse): void => {
    const successfulResults = results.results.filter((result) => result.status === 'success');
    const successfulDocIds = successfulResults
      .map((result) => result.doc_id)
      .filter((id): id is string => id !== undefined);
    
    setUploadedDocIds(successfulDocIds);
    setUploadedDocs(successfulResults);
    
    // Scroll to question section with a small delay
    if (successfulDocIds.length > 0) {
      setTimeout(() => {
        questionSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    }
  };

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
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <>
      <Head>
        <title>Learning Platform | Your AI-Powered Document Assistant</title>
        <meta name="description" content="Upload documents and get AI-powered answers to your questions instantly." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-background to-accent-bg pb-16">
        {/* Hero Section */}
        <section className="container-padded py-12 md:py-20">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6 inline-block"
            >
              <div className="relative w-16 h-16 mx-auto mb-4">
                <Brain className="w-full h-full text-primary" />
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse" style={{ animationDuration: '3s' }}></div>
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Welcome to Your <span className="text-primary">Learning Platform</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Upload your PDF documents and ask questions to get instant, AI-powered insights and answers.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <motion.a 
                href="#upload-section"
                className="flex items-center justify-center gap-2 text-primary hover:text-primary-hover mx-auto w-max"
                whileHover={{ y: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Get Started
                <ChevronDown className="animate-bounce" size={20} />
              </motion.a>
            </motion.div>
          </motion.div>
        </section>
        
        {/* Features Section */}
        <motion.section 
          className="container-padded py-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={itemVariants} className="card p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <FileQuestion className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ask Anything</h3>
              <p className="text-muted-foreground">Get instant answers to your questions about uploaded documents</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="card p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Book className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Learn Faster</h3>
              <p className="text-muted-foreground">Extract key insights from your documents with AI assistance</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="card p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Save Time</h3>
              <p className="text-muted-foreground">Quickly find information without reading entire documents</p>
            </motion.div>
          </div>
        </motion.section>

        {/* Upload Section */}
        <section id="upload-section" className="container-padded mb-16">
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <Book className="text-primary" /> 
                Upload Documents
              </h2>
              
              {uploadedDocs.length > 0 && (
                <button 
                  onClick={() => setShowUploaded(!showUploaded)}
                  className="text-sm flex items-center gap-1 text-primary hover:text-primary-hover"
                >
                  {uploadedDocs.length} file{uploadedDocs.length !== 1 ? 's' : ''} uploaded
                  <ChevronDown 
                    className={`transition-transform ${showUploaded ? 'rotate-180' : ''}`}
                    size={16}
                  />
                </button>
              )}
            </div>
            
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <FileUpload onUploadSuccess={handleUploadSuccess} />
            </motion.div>
            
            <AnimatePresence>
              {showUploaded && uploadedDocs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mb-8"
                >
                  <div className="bg-accent-bg dark:bg-gray-800 rounded-md p-4">
                    <h3 className="font-medium mb-3">Uploaded Documents</h3>
                    <ul className="space-y-2">
                      {uploadedDocs.map((doc) => (
                        <li key={doc.doc_id} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-success" />
                          <span className="truncate">{doc.filename}</span>
                          <span className="text-xs text-muted-foreground ml-auto">ID: {doc.doc_id}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Question Section */}
        <section ref={questionSectionRef} className="container-padded">
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {uploadedDocIds.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2">
                  <FileQuestion className="text-primary" />
                  Ask a Question
                </h2>
                <QuestionForm docIds={uploadedDocIds} documentCount={uploadedDocs.length} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Alert variant="info" className="border-l-4 border-l-blue-500">
                  <AlertTitle className="flex items-center gap-2">
                    <FileQuestion size={18} />
                    Ready to get started?
                  </AlertTitle>
                  <AlertDescription>
                    Upload PDF documents above to begin asking questions and getting AI-powered answers.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </motion.div>
        </section>
      </main>
    </>
  );
}

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

  // Extract username from session if available
  const username = session.user?.name || "User";

  return {
    props: { 
      session,
      username
    },
  };
}
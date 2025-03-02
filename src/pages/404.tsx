import { JSX, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Search, RefreshCw } from 'lucide-react';

/**
 * Custom 404 Error Page
 * 
 * Provides an engaging user experience when navigating to a non-existent route.
 * Features animations, suggested navigation options, and automatic redirection.
 */
const Custom404: React.FC = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  // Handle countdown timer for auto-redirect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      } else {
        setIsRedirecting(true);
        router.push('/');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router]);

  // Animation variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Handle back navigation
  const handleGoBack = (): void => {
    router.back();
  };

  // SVG elements for the visual components
  const NotFoundIllustration = (): JSX.Element => (
    <motion.svg 
      width="300" 
      height="200" 
      viewBox="0 0 300 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mx-auto mb-8"
    >
      <motion.path
        d="M150 20C182.279 20 210.234 40.5 218.564 68.9081C226.894 97.3162 250.681 117.816 278.961 117.816C307.24 117.816 300 146.224 300 174.632C300 203.04 255.172 190 226.894 190H73.1058C44.8276 190 0 203.04 0 174.632C0 146.224 -7.24025 117.816 21.0395 117.816C49.3193 117.816 73.1058 97.3162 81.4361 68.9081C89.7663 40.5 117.721 20 150 20Z"
        fill="#3B82F6"
        opacity="0.1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.text 
        x="110" 
        y="120" 
        fontSize="72" 
        fontWeight="bold" 
        fill="currentColor"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        404
      </motion.text>
      <motion.rect 
        x="140" 
        y="130" 
        width="20" 
        height="20" 
        fill="#3B82F6"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ delay: 1, duration: 0.5 }}
      />
      <motion.circle 
        cx="180" 
        cy="140" 
        r="10" 
        fill="#EF4444"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ delay: 1.2, duration: 0.5 }}
      />
      <motion.path 
        d="M100,140 L120,140" 
        stroke="#10B981" 
        strokeWidth="5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1.4, duration: 0.5 }}
      />
    </motion.svg>
  );

  return (
    <>
      <Head>
        <title>Page Not Found | My Learning App</title>
        <meta name="description" content="We couldn't find the page you were looking for." />
      </Head>

      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-accent-bg p-4">
        <motion.div 
          className="max-w-2xl w-full mx-auto card p-8 shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <NotFoundIllustration />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-4xl font-bold mb-4"
            >
              Page Not Found
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-muted-foreground mb-8"
            >
              Oops! We couldn&apos;t find the page you&apos;re looking for.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="max-w-md mx-auto mb-8"
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Try searching for something else..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input pr-10"
                  aria-label="Search query"
                />
                <button 
                  type="submit" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Search"
                >
                  <Search size={18} />
                </button>
              </form>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-4 justify-center mb-8"
            >
              <Link href="/" passHref>
                <motion.span 
                  className="btn-primary flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Home size={18} />
                  <span>Go to Home</span>
                </motion.span>
              </Link>

              <button 
                onClick={handleGoBack} 
                className="btn-secondary flex items-center gap-2"
              >
                <ArrowLeft size={18} />
                <span>Go Back</span>
              </button>

              <Link href="/learning-path" passHref>
                <motion.span 
                  className="btn-secondary flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw size={18} />
                  <span>Learning Paths</span>
                </motion.span>
              </Link>
            </motion.div>

            {!isRedirecting ? (
              <motion.p 
                variants={itemVariants}
                className="text-sm text-muted-foreground"
              >
                Redirecting to home page in {countdown} seconds...
              </motion.p>
            ) : (
              <motion.p 
                variants={itemVariants}
                className="text-sm text-muted-foreground flex items-center justify-center gap-2"
              >
                <span>Redirecting</span>
                <motion.span
                  animate={{ 
                    opacity: [0.4, 1, 0.4], 
                    y: [0, -3, 0] 
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.5 
                  }}
                  className="flex"
                >
                  <span className="w-1 h-1 bg-primary rounded-full mx-0.5"></span>
                  <span className="w-1 h-1 bg-primary rounded-full mx-0.5"></span>
                  <span className="w-1 h-1 bg-primary rounded-full mx-0.5"></span>
                </motion.span>
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      </main>
    </>
  );
};

export default Custom404;
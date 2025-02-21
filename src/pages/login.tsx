import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import type { NextPage } from 'next';
import { motion } from 'framer-motion';

// Animation variants
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

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

// Custom hook for authentication logic
const useAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  // If redirect param is present, store it for after login
  const { redirect } = router.query;
  const redirectPath = typeof redirect === 'string' ? redirect : '/';

  useEffect(() => {
    // Check for stored email if available
    const storedEmail = localStorage.getItem('rememberedEmail');
    if (storedEmail) {
      setEmail(storedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validate inputs
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      setIsLoading(false);
      return;
    }

    try {
      // Handle "remember me" functionality
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        // Successful login animation before redirect
        setTimeout(() => {
          router.push(redirectPath);
        }, 800);
      }
    } catch (err: unknown) {
      setError('Authentication failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    rememberMe,
    setRememberMe,
    handleLogin,
  };
};

const Login: NextPage = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    rememberMe,
    setRememberMe,
    handleLogin,
  } = useAuth();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Illustration for larger screens */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
        <div className="h-full flex flex-col items-center justify-center text-white p-12">
          <div className="max-w-md">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold mb-6"
            >
              Welcome Back
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg mb-12 text-white/90"
            >
              Continue your learning journey and access your personalized dashboard.
            </motion.p>
            
            {/* Abstract decorative elements */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, type: "spring" }}
              className="relative w-full h-64 mb-8"
            >
              <div className="absolute top-0 right-12 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm"></div>
              <div className="absolute bottom-8 left-8 w-32 h-32 bg-white/5 rounded-xl backdrop-blur-sm transform rotate-12"></div>
              <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-white/10 rounded-lg backdrop-blur-md"></div>
              <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white/10 rounded-full backdrop-blur-md"></div>
            </motion.div>
            
            <motion.div 
              variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2,
                    delayChildren: 0.9,
                  }
                }
              }}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div 
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 }
                }}
                className="flex items-center space-x-4"
              >
                <div className="p-2 bg-white/10 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-lg">Track your progress</p>
              </motion.div>
              
              <motion.div 
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 }
                }}
                className="flex items-center space-x-4"
              >
                <div className="p-2 bg-white/10 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-lg">Access saved content</p>
              </motion.div>
              
              <motion.div 
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 }
                }}
                className="flex items-center space-x-4"
              >
                <div className="p-2 bg-white/10 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-lg">Continue where you left off</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white"
      >
        <div className="w-full max-w-md">
          <motion.div variants={itemVariants} className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Sign In</h1>
            <p className="text-gray-600">Welcome back! Please enter your details</p>
          </motion.div>

          <form onSubmit={handleLogin}>
            <motion.div variants={itemVariants} className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
                placeholder="your.email@example.com"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
                placeholder="••••••••"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center mb-6">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all 
                  ${isLoading 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-lg hover:shadow-indigo-500/30'
                  }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="mt-8 text-center">
            <p className="text-gray-600">
              Don&apost have an account?{' '}
              <Link href="/register" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                Sign up for free
              </Link>
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            className="mt-12 pt-8 border-t border-gray-200"
          >
            <div className="text-center mb-4">
              <p className="text-sm text-gray-500">Or continue with</p>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                className="flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors"
                onClick={() => signIn('google', { callbackUrl: '/' })}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.26644 9.76453C6.19903 6.93863 8.85469 4.90909 12.0002 4.90909C13.6912 4.90909 15.2184 5.50909 16.4184 6.49091L19.9093 3C17.7821 1.14545 15.0548 0 12.0002 0C7.27031 0 3.19799 2.6983 1.24023 6.65002L5.26644 9.76453Z" fill="#EA4335"/>
                  <path d="M16.0406 18.0142C14.9508 18.718 13.5659 19.0909 11.9998 19.0909C8.86633 19.0909 6.21896 17.0807 5.27682 14.2773L1.2373 17.3349C3.19263 21.2926 7.26484 24.0001 11.9998 24.0001C14.9327 24.0001 17.7352 22.959 19.834 21.0012L16.0406 18.0142Z" fill="#34A853"/>
                  <path d="M19.8342 20.9978C22.0292 18.9503 23.4545 15.9019 23.4545 11.9982C23.4545 11.2891 23.3455 10.5255 23.1818 9.81641H12V14.4528H18.4364C18.1188 16.0119 17.2663 17.2194 16.0407 18.0108L19.8342 20.9978Z" fill="#4A90E2"/>
                  <path d="M5.27698 14.2759C5.03833 13.5455 4.90909 12.7636 4.90909 11.9991C4.90909 11.2437 5.03444 10.4709 5.26644 9.7627L1.23999 6.64844C0.436587 8.25884 0 10.0738 0 11.9991C0 13.918 0.444781 15.7286 1.23746 17.3334L5.27698 14.2759Z" fill="#FBBC05"/>
                </svg>
              </button>
              
              <button
                type="button"
                className="flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors"
                onClick={() => signIn('github', { callbackUrl: '/' })}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.585 9.015 20.58C6 21.135 5.22 19.845 4.98 19.17C4.845 18.825 4.26 17.76 3.75 17.475C3.33 17.25 2.73 16.695 3.735 16.68C4.68 16.665 5.355 17.55 5.58 17.91C6.66 19.725 8.385 19.215 9.075 18.9C9.18 18.12 9.495 17.595 9.84 17.295C7.17 16.995 4.38 15.96 4.38 11.37C4.38 10.065 4.845 8.985 5.61 8.145C5.49 7.845 5.07 6.615 5.73 4.965C5.73 4.965 6.735 4.65 9.03 6.195C9.99 5.925 11.01 5.79 12.03 5.79C13.05 5.79 14.07 5.925 15.03 6.195C17.325 4.635 18.33 4.965 18.33 4.965C18.99 6.615 18.57 7.845 18.45 8.145C19.215 8.985 19.68 10.05 19.68 11.37C19.68 15.975 16.875 16.995 14.205 17.295C14.64 17.67 15.015 18.39 15.015 19.515C15.015 21.12 15 22.41 15 22.815C15 23.13 15.225 23.505 15.825 23.385C18.2072 22.5807 20.2772 21.0497 21.7437 19.0074C23.2101 16.965 23.9993 14.5143 24 12C24 5.37 18.63 0 12 0Z"/>
                </svg>
              </button>
              
              <button
                type="button"
                className="flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors"
                onClick={() => signIn('apple', { callbackUrl: '/' })}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.5778 12.2442C17.5504 9.78168 19.5438 8.16285 19.661 8.07737C18.448 7.37542 16.7445 7.27046 16.0831 7.26201C14.7137 7.23661 13.4133 8.18866 12.7365 8.18866C12.0597 8.18866 11.0057 7.28999 9.82777 7.31961C8.31071 7.34924 6.94193 8.10644 6.17686 9.23395C4.64116 11.5009 5.74643 14.8713 7.21694 16.7634C7.97355 17.6834 8.8425 18.6947 9.99595 18.6609C11.1075 18.627 11.5464 17.9759 12.8911 17.9759C14.2359 17.9759 14.6326 18.6609 15.7949 18.644C16.9994 18.627 17.7475 17.736 18.4713 16.8074C19.3391 15.7453 19.6835 14.7172 19.7109 14.6581C19.6835 14.6411 17.6037 13.7974 17.5778 12.2442Z"/>
                  <path d="M15.9147 6.05243C16.5297 5.29945 16.9407 4.3643 16.8 3.42911C15.977 3.46295 14.9369 4.03138 14.3219 4.76588C13.7896 5.38639 13.285 6.37684 13.4392 7.26201C14.3494 7.32433 15.2997 6.80541 15.9147 6.05243Z"/>
                </svg>
              </button>
            </div>
          </motion.div>

          <motion.p 
            variants={itemVariants}
            className="mt-8 text-center text-xs text-gray-500"
          >
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-indigo-600 hover:text-indigo-800">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-indigo-600 hover:text-indigo-800">
              Privacy Policy
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
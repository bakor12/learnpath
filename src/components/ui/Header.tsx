// src/components/ui/Header.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import Image from 'next/image';

/**
 * Header component that provides navigation and authentication controls
 * Responsive design with mobile menu functionality
 */
const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Track scroll position to change header appearance on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle user logout
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  // Animation variants for the mobile menu
  const menuVariants = {
    open: { opacity: 1, height: 'auto', transition: { duration: 0.3 } },
    closed: { opacity: 0, height: 0, transition: { duration: 0.3 } }
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white dark:bg-gray-900 shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo and navigation links */}
          <div className="flex items-center">
            <Link href="/" passHref>
              <span className="flex items-center cursor-pointer">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-8 h-8 text-indigo-600"
                >
                  <path d="M22 10v6M2 10l10-8 10 8-10 8z"></path>
                  <path d="M6 12v8h12v-8"></path>
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">LearnPath</span>
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex ml-10 space-x-8">
              <NavLink href="/" label="Home" active={router.pathname === '/'} />
              <NavLink href="/generated" label="Generated" active={router.pathname === '/explore'} />
              <NavLink href="/paths" label="Learning Paths" active={router.pathname.startsWith('/paths')} />
              <NavLink href="/resources" label="Resources" active={router.pathname === '/resources'} />
            </nav>
          </div>

          {/* Authentication and profile section */}
          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              // Loading state
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : session ? (
              // Logged in state
              <div className="relative group">
                <button 
                  className="flex items-center focus:outline-none" 
                  aria-label="Open user menu"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <div className="relative w-10 h-10 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center overflow-hidden border-2 border-indigo-600">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image} 
                        alt={session.user.name || 'User'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-semibold">
                        {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                      </span>
                    )}
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  </div>
                  <span className="hidden md:block ml-2 font-medium text-gray-700 dark:text-gray-200">
                    {session.user?.name?.split(' ')[0] || 'User'}
                  </span>
                </button>

                {/* User dropdown menu - appears on hover on desktop */}
                <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                  <Link href="/profile" passHref>
                    <span className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      Profile
                    </span>
                  </Link>
                  <Link href="/settings" passHref>
                    <span className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      Settings
                    </span>
                  </Link>
                  <Link href="/dashboard" passHref>
                    <span className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      Dashboard
                    </span>
                  </Link>
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              // Logged out state
              <div className="flex items-center space-x-4">
                <Link href="/login" passHref>
                  <span className="text-gray-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 font-medium cursor-pointer">
                    Log in
                  </span>
                </Link>
                <Link href="/signup" passHref>
                  <span className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 cursor-pointer">
                    Sign up
                  </span>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <motion.div
          initial="closed"
          animate={isMobileMenuOpen ? "open" : "closed"}
          variants={menuVariants}
          className="md:hidden overflow-hidden"
        >
          <nav className="flex flex-col mt-4 pb-4 space-y-2">
            <MobileNavLink href="/" label="Home" active={router.pathname === '/'} onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavLink href="/generated" label="Generated" active={router.pathname === '/explore'} onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavLink href="/paths" label="Learning Paths" active={router.pathname.startsWith('/paths')} onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavLink href="/resources" label="Resources" active={router.pathname === '/resources'} onClick={() => setIsMobileMenuOpen(false)} />
            
            {session && (
              <>
                <hr className="my-2 border-gray-200 dark:border-gray-700" />
                <MobileNavLink href="/profile" label="Profile" active={router.pathname === '/profile'} onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavLink href="/settings" label="Settings" active={router.pathname === '/settings'} onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavLink href="/dashboard" label="Dashboard" active={router.pathname === '/dashboard'} onClick={() => setIsMobileMenuOpen(false)} />
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                >
                  Sign out
                </button>
              </>
            )}
          </nav>
        </motion.div>
      </div>
    </header>
  );
};

// Desktop Navigation Link Component
interface NavLinkProps {
  href: string;
  label: string;
  active: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label, active }) => {
  return (
    <Link href={href} passHref>
      <span className={`relative inline-block cursor-pointer font-medium transition-colors duration-200 ${
        active 
          ? 'text-indigo-600 dark:text-indigo-400' 
          : 'text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400'
      }`}>
        {label}
        {active && (
          <span className="absolute bottom-0 left-0 h-0.5 w-full bg-indigo-600 dark:bg-indigo-400"></span>
        )}
      </span>
    </Link>
  );
};

// Mobile Navigation Link Component
interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ href, label, active, onClick }) => {
  return (
    <Link href={href} passHref>
      <span
        className={`px-4 py-2 text-base cursor-pointer rounded-md transition-colors duration-200 ${
          active
            ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        onClick={onClick}
      >
        {label}
      </span>
    </Link>
  );
};

export default Header;
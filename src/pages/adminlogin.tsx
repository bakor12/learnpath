// src/pages/adminlogin.tsx
import { useState, useEffect } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdminSession = async () => {
      const session = await getSession();
      if (session && session.user) {
          // Check if the user has admin privileges
          const res = await fetch('/api/admin'); // Use the admin API to check isAdmin
          if (res.ok) {
            router.push('/admindash'); // Redirect to admin dashboard
          }
      }
    };
    checkAdminSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
          // Check if user is admin after successful login
          const session = await getSession();
          if(session && session.user){
            const res = await fetch('/api/admin');
            if(res.ok){
                router.push('/admindash');
            } else {
                setError("You are not authorized to access the admin panel.");
            }
          }
      }
    } catch (err) {
      setError(`An unexpected error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Head>
        <title>Admin Login</title>
        <meta name="description" content="Admin login page" />
    </Head>
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">
          Admin Login
        </h1>
        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-300 rounded-md" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-input mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-input mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default AdminLogin;
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
//import Image from 'next/image';
import type { NextPage } from 'next';
import { motion } from 'framer-motion';

// --- FIX: Define an interface for the form data ---
interface FormValues {
  name: string;
  email: string;
  password: string;
}

// Custom hook for form validation
const useFormValidation = (
  initialValues: FormValues, // --- FIX: Use the FormValues type
  validate: (values: FormValues) => Partial<FormValues> // --- FIX: Use FormValues for the validate parameter
) => {
  const [values, setValues] = useState<FormValues>(initialValues); // --- FIX: Use FormValues
  const [errors, setErrors] = useState<Partial<FormValues>>({}); // --- FIX: Use Partial<FormValues> (errors might not have all fields)
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({}); // --- FIX: Use Record to track touched fields
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
    }
  }, [values, touched, validate]); // Added 'validate' to dependency array

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });
  };

  const handleSubmit = async (onSubmit: (values: FormValues) => Promise<void>) => { // --- FIX: values is of type FormValues
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setTouched(
      Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}) as Partial<Record<keyof FormValues, boolean>>
    );

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      await onSubmit(values);
      setIsSubmitting(false);
    }
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  };
};

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
    },
  },
};

const validateForm = (values: FormValues) => { // --- FIX:  Use FormValues
  const errors: Partial<FormValues> = {};

  // Name validation
  if (!values.name) {
    errors.name = 'Name is required';
  } else if (values.name.length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  // Email validation
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  // Password validation
  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(values.password)) {
    errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
  }

  return errors;
};

const Signup: NextPage = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const {
    values, // Destructuring is fine now, types are known
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormValidation(
    { name: '', email: '', password: '' }, // Initial values are compatible with FormValues
    validateForm
  );

  // Calculate password strength
  useEffect(() => {
    // --- FIX: Access password through values ---
    if (!values.password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    // Length check
    if (values.password.length >= 8) strength += 25;
    // Contains lowercase
    if (/[a-z]/.test(values.password)) strength += 25;
    // Contains uppercase
    if (/[A-Z]/.test(values.password)) strength += 25;
    // Contains number
    if (/\d/.test(values.password)) strength += 25;

    setPasswordStrength(strength);
  }, [values.password]); // --- FIX: Depend on values.password

  const getStrengthColor = () => {
    if (passwordStrength < 50) return 'bg-red-500';
    if (passwordStrength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const onSubmit = async (values: FormValues) => { // --- FIX: values is of type FormValues
    setServerError(null);
    try {
      const response = await fetch('/api/profile/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.message || 'Registration failed. Please try again.');
      } else {
        // Show success animation before redirecting
        setTimeout(() => {
          router.push('/login');
        }, 1000);
      }
    } catch (err: unknown) {
      // Type check err before accessing message property
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Form */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white"
      >
        <div className="w-full max-w-md">
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join our community and start your learning journey</p>
          </motion.div>

          <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit);
          }}>
            <motion.div variants={itemVariants} className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={values.name} // No more TS errors here!
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    touched.name && errors.name
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                  } shadow-sm transition-all`}
                  placeholder="Your Name"
                />
                {touched.name && errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={values.email} // No more TS errors here!
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    touched.email && errors.email
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                  } shadow-sm transition-all`}
                  placeholder="your.email@example.com"
                />
                {touched.email && errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={values.password} // --- FIX: Use values.password
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    touched.password && errors.password
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                  } shadow-sm transition-all`}
                  placeholder="Create a strong password"
                />
                {values.password && ( // --- FIX: Check values.password here too
                  <div className="mt-2">
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getStrengthColor()} transition-all duration-300`}
                        style={{ width: `${passwordStrength}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {passwordStrength < 50 ? 'Weak password' :
                       passwordStrength < 75 ? 'Medium strength' : 'Strong password'}
                    </p>
                  </div>
                )}
                {touched.password && errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </div>
            </motion.div>

            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg"
              >
                {serverError}
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all
                  ${isSubmitting
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-lg hover:shadow-indigo-500/30'
                  }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create account'
                )}
              </button>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Illustration */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="h-full flex flex-col items-center justify-center text-white p-12">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold mb-6">Start Your Learning Journey Today</h2>
            <p className="text-lg mb-12 text-white/80">
              Join thousands of students and professionals who are transforming their skills and careers.
            </p>

            {/* Decorative elements */}
            <div className="relative w-full h-64 mb-8">
              {/* This would be better with an actual SVG illustration, but for now using placeholder */}
              <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-lg backdrop-blur-md transform rotate-12"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-lg backdrop-blur-md transform -rotate-6"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/20 rounded-full backdrop-blur-sm"></div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p>Access to premium learning materials</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p>Interactive learning experiences</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p>Certificate upon completion</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
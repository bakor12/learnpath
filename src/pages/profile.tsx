// src/pages/profile.tsx
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import ProfileForm from '../components/auth/ProfileForm';
import { useEffect, useState } from 'react';
import { User } from '../types';

const Profile: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/login'); // Redirect if not logged in
      return;
    }
    const fetchUserProfile = async () => {
        if (session?.user?.id) {
            try {
                const res = await fetch(`/api/profile/${session.user.id}`);
                if (res.ok) {
                    const userData = await res.json();
                    setUser(userData); // Set initial user data
                } else {
                    console.error("Failed to fetch user profile");
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    fetchUserProfile();

  }, [status, router, session?.user?.id]);

    const handleUpdateSuccess = () => {
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000); // Hide message after 3 seconds
    };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!session || !user) {
    return <div>You must be logged in to view this page.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
      {updateSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline"> Your profile has been updated.</span>
          </div>
      )}
      <ProfileForm
        initialSkills={user.skills}
        initialLearningGoals={user.learningGoals}
        initialLearningStyle={user.learningStyle}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
};

export default Profile;
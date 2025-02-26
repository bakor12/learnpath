// src/pages/admindash.tsx
import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { User, LearningModule } from '../types'; // Import the User type
import Head from 'next/head';

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
    const [newModule, setNewModule] = useState<Partial<LearningModule>>({
        title: '',
        description: '',
        estimatedTime: '',
        difficulty: 'beginner',
        resourceLinks: [],
        prerequisites: [],
    });
    const [moduleAddSuccess, setModuleAddSuccess] = useState<boolean | null>(null);
    const [moduleAddError, setModuleAddError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const session = await getSession();
        if (!session) {
          router.push('/adminlogin'); // Redirect to login if not authenticated
          return;
        }

        const res = await fetch('/api/admin');
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            router.push('/adminlogin'); // Redirect if unauthorized or forbidden
          } else {
            setError('Failed to fetch users');
          }
          return;
        }
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(`An unexpected error occurred: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'resourceLinks' || name === 'prerequisites') {
          setNewModule({ ...newModule, [name]: value.split(',') });
        }
        else{
            setNewModule({ ...newModule, [name]: value });
        }

    };

    const handleAddModule = async (e: React.FormEvent) => {
        e.preventDefault();
        setModuleAddError('');
        setModuleAddSuccess(null);

        try {
            const res = await fetch('/api/admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...newModule, action: 'addModule' }),
            });

            if (res.ok) {
                setModuleAddSuccess(true);
                setNewModule({  // Reset form
                    title: '',
                    description: '',
                    estimatedTime: '',
                    difficulty: 'beginner',
                    resourceLinks: [],
                    prerequisites: [],
                });
            } else {
                const errorData = await res.json();
                setModuleAddError(errorData.message || 'Failed to add module');
            }
        } catch (error) {
            setModuleAddError(`An unexpected error occurred: ${error}`);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const res = await fetch('/api/admin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ action: 'deleteUser', userId }),
                });

                if (res.ok) {
                    // Remove the deleted user from the state
                    setUsers(users.filter(user => user.id !== userId));
                } else {
                    const errorData = await res.json();
                    alert(errorData.message || 'Failed to delete user');
                }
            } catch (error) {
                alert(`An unexpected error occurred: ${error}`);
            }
        }
    };


  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-600">{error}</div>;
  }

  return (
    <>
        <Head>
            <title>Admin Dashboard</title>
            <meta name="description" content="Admin dashboard" />
        </Head>
    <div className="container-padded page-section">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="btn-secondary bg-red-500 hover:bg-red-600 text-white"
                                            >
                                                Delete
                                            </button>
                                        </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

            {/* Add Learning Module Section */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">Add Learning Module</h2>
                {moduleAddSuccess && (
                    <div className="alert alert-success mb-4">Module added successfully!</div>
                )}
                {moduleAddError && (
                    <div className="alert alert-error mb-4">{moduleAddError}</div>
                )}
                <form onSubmit={handleAddModule} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                        <input type="text" id="title" name="title" value={newModule.title || ''} onChange={handleInputChange} className="form-input" required />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea id="description" name="description" value={newModule.description || ''} onChange={handleInputChange} className="form-input" required />
                    </div>
                    <div>
                        <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estimated Time</label>
                        <input type="text" id="estimatedTime" name="estimatedTime" value={newModule.estimatedTime || ''} onChange={handleInputChange} className="form-input" required />
                    </div>
                    <div>
                        <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Difficulty</label>
                        <select id="difficulty" name="difficulty" value={newModule.difficulty || 'beginner'} onChange={handleInputChange} className="form-input">
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="resourceLinks" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Resource Links (comma-separated)</label>
                        <input type="text" id="resourceLinks" name="resourceLinks" value={(newModule.resourceLinks || []).join(',')} onChange={handleInputChange} className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="prerequisites" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prerequisites (comma-separated IDs)</label>
                        <input type="text" id="prerequisites" name="prerequisites" value={(newModule.prerequisites || []).join(',')} onChange={handleInputChange} className="form-input" />
                    </div>
                    <button type="submit" className="btn-primary">Add Module</button>
                </form>
            </section>
    </div>
    </>
  );
};

export default AdminDashboard;
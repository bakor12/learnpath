// src/pages/resources.tsx
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { Recommendation, LearningModule } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { BookmarkIcon, PlayIcon } from 'lucide-react';
import { debounce } from 'lodash'; // Import lodash's debounce function

// Types for the resources page
interface ResourceFilters {
  type: 'all' | 'article' | 'video' | 'course' | 'other';
  difficulty: 'all' | 'beginner' | 'intermediate' | 'advanced';
  searchQuery: string;
}

interface ResourceStats {
  totalResources: number;
  completedResources: number;
  savedResources: number;
  inProgressResources: number;
}

// Custom hook for resource management
const useResources = (filters: ResourceFilters) => {
  const { data: session } = useSession();
  const { data, error, mutate } = useSWR<{
    recommendations: Recommendation[];
    modules: LearningModule[];
  }>(
    session
      ? `/api/learning-path/resources?type=${filters.type}&difficulty=${filters.difficulty}&search=${filters.searchQuery}`
      : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    resources: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

// Animations configuration
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

const ResourcesPage = () => {
  const [filters, setFilters] = useState<ResourceFilters>({
    type: 'all',
    difficulty: 'all',
    searchQuery: '',
  });

  const [stats, setStats] = useState<ResourceStats>({
    totalResources: 0,
    completedResources: 0,
    savedResources: 0,
    inProgressResources: 0,
  });

  const { resources, isLoading, isError, mutate } = useResources(filters);

  // Debounced search handler
  const handleSearch = useCallback(
    (query: string) => {
      setFilters((prev) => ({ ...prev, searchQuery: query }));
    },
    []
  );

  // Resource interaction handlers
  const handleResourceAction = async (
    resourceId: string,
    action: 'save' | 'complete' | 'start'
  ) => {
    try {
      const response = await fetch(
        `/api/learning-path/resources/${resourceId}/${action}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) throw new Error('Failed to update resource status');

      // Optimistic update
      mutate();

      // Update stats
      setStats((prev) => {
        const newStats = { ...prev };
        switch (action) {
          case 'complete':
            newStats.completedResources++;
            newStats.inProgressResources--;
            break;
          case 'start':
            newStats.inProgressResources++;
            break;
          case 'save':
            newStats.savedResources++;
            break;
        }
        return newStats;
      });
    } catch (error) {
      console.error('Error updating resource:', error);
      // Show error notification
    }
  };

  // Resource card component with animations
  const ResourceCard = ({
    resource,
  }: {
    resource: Recommendation | LearningModule;
  }) => (
    <motion.div
      layout
      {...fadeInUp}
      className="card p-6 hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{resource.title}</h3>
          <p className="text-muted-foreground">{resource.description}</p>

          <div className="flex gap-2 mt-3">
            {'type' in resource && (
              <span className={`badge badge-${getBadgeColor(resource.type)}`}>
                {resource.type}
              </span>
            )}
            {'difficulty' in resource && (
              <span
                className={`badge badge-${getDifficultyColor(resource.difficulty)}`}
              >
                {resource.difficulty}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() =>
              handleResourceAction(
                'id' in resource ? resource.id : '', // Use type guard and provide default
                'save'
              )
            }
            className="btn-secondary p-2"
            aria-label="Save resource"
          >
            <BookmarkIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() =>
              handleResourceAction(
                'id' in resource ? resource.id : '', // Use type guard and provide default
                'start'
              )
            }
            className="btn-primary p-2"
            aria-label="Start learning"
          >
            <PlayIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  // Stats dashboard component
  const StatsDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {Object.entries(stats).map(([key, value]) => (
        <Card key={key} className="p-4">
          <h4 className="text-sm font-medium text-muted-foreground">
            {formatStatLabel(key)}
          </h4>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </Card>
      ))}
    </div>
  );

  // Filters section
  const FiltersSection = () => (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <input
        type="text"
        placeholder="Search resources..."
        className="form-input"
        onChange={(e) => debounce(handleSearch, 300)(e.target.value)} // Use lodash debounce
      />

      <select
        className="form-input"
        value={filters.type}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            type: e.target.value as ResourceFilters['type'],
          }))
        }
      >
        <option value="all">All Types</option>
        <option value="article">Articles</option>
        <option value="video">Videos</option>
        <option value="course">Courses</option>
        <option value="other">Other</option>
      </select>

      <select
        className="form-input"
        value={filters.difficulty}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            difficulty: e.target.value as ResourceFilters['difficulty'],
          }))
        }
      >
        <option value="all">All Levels</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>
    </div>
  );

  // Utility functions
  const getBadgeColor = (type: Recommendation['type']) => {
    const colors = {
      article: 'blue',
      video: 'purple',
      course: 'green',
      other: 'gray',
    };
    return colors[type] || 'gray';
  };

  const getDifficultyColor = (difficulty: LearningModule['difficulty']) => {
    const colors = {
      beginner: 'green',
      intermediate: 'blue',
      advanced: 'purple',
    };
    return colors[difficulty];
  };

  const formatStatLabel = (key: string): string => {
    return key
      .split(/(?=[A-Z])/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Main render
  return (
    <div className="container-padded">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Learning Resources</h1>
          <p className="text-lg text-muted-foreground">
            Discover personalized learning materials tailored to your goals and
            progress.
          </p>
        </header>

        <StatsDashboard />

        <FiltersSection />

        {isError && (
          <Alert variant="error">
            <AlertDescription>
              Failed to load resources. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {resources?.recommendations.map((resource) => (
                <ResourceCard
                  key={'id' in resource ? resource.id : Math.random().toString()} // Use type guard and unique key
                  resource={resource}
                />
              ))}
              {resources?.modules.map((module) => (
                <ResourceCard key={module.id} resource={module} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;
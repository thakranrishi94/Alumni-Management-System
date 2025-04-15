"use client"
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

// Define types
type JobType = 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'FREELANCE';

interface User {
  name: string;
}

interface Alumni {
  user: User;
}

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string;
  jobType: JobType;
  location: string;
  salaryRange?: string;
  lastDateToApply: string;
  applicationLink?: string;
  createdAt: string;
  alumni: Alumni;
}

interface Filters {
  jobType: string;
  location: string;
  search: string;
}

// Job type badge component
const JobTypeBadge = ({ type }: { type: JobType }) => {
  const variants = {
    FULL_TIME: 'bg-blue-100 text-blue-800',
    PART_TIME: 'bg-purple-100 text-purple-800',
    INTERNSHIP: 'bg-green-100 text-green-800',
    FREELANCE: 'bg-orange-100 text-orange-800'
  };

  return (
    <Badge variant="outline" className={`px-2 py-1 font-medium ${variants[type]}`}>
      {type.replace('_', ' ')}
    </Badge>
  );
};

// Location badge component
const LocationBadge = ({ location }: { location: string }) => {
  const getLocationVariant = (loc: string) => {
    if (loc.toLowerCase().includes('remote')) return 'bg-green-100 text-green-800';
    if (loc.toLowerCase().includes('hybrid')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Badge variant="outline" className={`px-2 py-1 font-medium ${getLocationVariant(location)}`}>
      {location}
    </Badge>
  );
};

export default function JobOpportunities() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    jobType: '',
    location: '',
    search: ''
  });
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          throw new Error('API URL is not defined');
        }
        
        const response = await fetch(`${apiUrl}/job/job-opportunities/all`);
        if (!response.ok) throw new Error('Failed to fetch job opportunities');
        
        const data = await response.json();
        setJobs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching job opportunities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Filter jobs based on search and filters
  const filteredJobs = jobs.filter(job => {
    // Filter by search term
    const searchMatch = 
      filters.search === '' || 
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.description.toLowerCase().includes(filters.search.toLowerCase());
    
    // Filter by job type
    const jobTypeMatch = filters.jobType === '' || job.jobType === filters.jobType;
    
    // Filter by location
    const locationMatch = 
      filters.location === '' || 
      job.location.toLowerCase().includes(filters.location.toLowerCase());
    
    return searchMatch && jobTypeMatch && locationMatch;
  });

  // Calculate days remaining until application deadline
  const getDaysRemaining = (deadlineDate: string): number => {
    const today = new Date();
    const deadline = new Date(deadlineDate);
    const diffTime = deadline.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Get application status badge
  const getApplicationStatus = (deadlineDate: string) => {
    const daysRemaining = getDaysRemaining(deadlineDate);
    
    if (daysRemaining < 0) {
      return (
        <div className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-600 font-medium">
          Closed
        </div>
      );
    } else if (daysRemaining === 0) {
      return (
        <div className="bg-orange-50 px-2 py-1 rounded-full text-xs text-orange-600 font-medium">
          Closes today
        </div>
      );
    } else if (daysRemaining <= 3) {
      return (
        <div className="bg-red-50 px-2 py-1 rounded-full text-xs text-red-600 font-medium">
          {daysRemaining} days left
        </div>
      );
    } else {
      return (
        <div className="bg-green-50 px-2 py-1 rounded-full text-xs text-green-600 font-medium">
          {daysRemaining} days left
        </div>
      );
    }
  };

  // Handle job selection and modal open
  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  return (
    <>
      <Head>
        <title>Alumni Job Opportunities</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Job Opportunities</h1>
        
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">Filter Opportunities</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by title, company, or description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Job Type Filter */}
              <div>
                <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type
                </label>
                <select
                  id="jobType"
                  name="jobType"
                  value={filters.jobType}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="FREELANCE">Freelance</option>
                </select>
              </div>
              
              {/* Location Filter */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="Filter by location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Results section */}
        <div className="mt-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 p-4 rounded-md text-red-700 text-center">
              {error}
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-yellow-50 p-8 rounded-lg text-center">
              <h3 className="text-xl font-medium text-yellow-700">No job opportunities found</h3>
              <p className="mt-2 text-yellow-600">
                Try adjusting your filters or check back later for new opportunities.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-2">
                    <h2 className="text-lg font-bold text-gray-800 line-clamp-1">{job.title}</h2>
                    <p className="text-md text-gray-600">{job.company}</p>
                  </CardHeader>
                  
                  <CardContent className="py-2">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <JobTypeBadge type={job.jobType} />
                      <LocationBadge location={job.location} />
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between items-center border-t pt-3">
                    {getApplicationStatus(job.lastDateToApply)}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleJobSelect(job)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Job Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {selectedJob && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{selectedJob.title}</DialogTitle>
              <DialogDescription className="text-lg text-gray-600">
                {selectedJob.company}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="flex flex-wrap gap-2">
                <JobTypeBadge type={selectedJob.jobType} />
                <LocationBadge location={selectedJob.location} />
                {selectedJob.salaryRange && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-600">
                    {selectedJob.salaryRange}
                  </Badge>
                )}
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Description</h4>
                <p className="text-gray-600 text-sm whitespace-pre-line">{selectedJob.description}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Requirements</h4>
                <p className="text-gray-600 text-sm whitespace-pre-line">{selectedJob.requirements}</p>
              </div>
              
              <div className="space-y-1 text-sm text-gray-500 pt-2 border-t">
                <p>
                  <span className="font-medium">Posted by:</span> {selectedJob.alumni.user.name}
                </p>
                <p>
                  <span className="font-medium">Posted on:</span> {format(new Date(selectedJob.createdAt), 'MMM dd, yyyy')}
                </p>
                <p>
                  <span className="font-medium">Deadline:</span> {format(new Date(selectedJob.lastDateToApply), 'MMM dd, yyyy')}
                  {getDaysRemaining(selectedJob.lastDateToApply) < 0 && (
                    <span className="ml-2 text-gray-600 font-medium">(Closed)</span>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
              
              {selectedJob.applicationLink && getDaysRemaining(selectedJob.lastDateToApply) >= 0 && (
                <a 
                  href={selectedJob.applicationLink}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Apply Now
                </a>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
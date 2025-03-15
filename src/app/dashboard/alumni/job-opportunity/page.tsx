"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  Plus, 
  Search, 
  ExternalLink,
  Edit
} from "lucide-react";
import { format } from "date-fns";

type JobOpportunity = {
  id: number;
  title: string;
  company: string;
  location: string;
  jobType: "FULL_TIME" | "PART_TIME" | "INTERNSHIP" | "FREELANCE";
  description: string;
  requirements: string;
  salaryRange?: string;
  applicationLink?: string;
  lastDateToApply: string;
  alumniId: number;
  alumni: {
    user: {
      name: string;
    }
  }
};

export default function JobOpportunitiesPage() {
  const [jobOpportunities, setJobOpportunities] = useState<JobOpportunity[]>([]);
  const [myJobOpportunities, setMyJobOpportunities] = useState<JobOpportunity[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobOpportunity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMyListings, setShowMyListings] = useState(false);
  const [isCreateJobDialogOpen, setIsCreateJobDialogOpen] = useState(false);
  const [isUpdateJobDialogOpen, setIsUpdateJobDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentJob, setCurrentJob] = useState<JobOpportunity | null>(null);
  const { toast } = useToast();

  // Job Form States
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState<JobOpportunity['jobType']>("FULL_TIME");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [applicationLink, setApplicationLink] = useState("");
  const [lastDateToApply, setLastDateToApply] = useState("");
  const token = Cookies.get('ams_token');

  // Fetch All Job Opportunities with useCallback
  const fetchAllJobOpportunities = useCallback(async () => {
    try {
      const response = await axios.get<JobOpportunity[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/job/get-opportunities`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setJobOpportunities(response.data);
      if (!showMyListings) {
        setFilteredJobs(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch job opportunities:", error);
      toast({
        title: "Error",
        description: "Failed to fetch job opportunities",
        variant: "destructive"
      });
      setLoading(false);
    }
  }, [toast, token, showMyListings]);

  // Fetch My Job Opportunities with useCallback
  const fetchMyJobOpportunities = useCallback(async () => {
    try {
      const response = await axios.get<JobOpportunity[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/job/my-opportunities`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setMyJobOpportunities(response.data);
      if (showMyListings) {
        setFilteredJobs(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch my job opportunities:", error);
      toast({
        title: "Error",
        description: "Failed to fetch your job listings",
        variant: "destructive"
      });
      setLoading(false);
    }
  }, [toast, token, showMyListings]);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchAllJobOpportunities();
      await fetchMyJobOpportunities();
    };
    
    fetchInitialData();
  }, [fetchAllJobOpportunities, fetchMyJobOpportunities]);

  // Handle toggle between all jobs and my jobs
  useEffect(() => {
    setFilteredJobs(showMyListings ? myJobOpportunities : jobOpportunities);
  }, [showMyListings, jobOpportunities, myJobOpportunities]);

  // Search Functionality
  useEffect(() => {
    const jobsToFilter = showMyListings ? myJobOpportunities : jobOpportunities;
    const filtered = jobsToFilter.filter(job => 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredJobs(filtered);
  }, [searchQuery, showMyListings, jobOpportunities, myJobOpportunities]);

  // Create Job Opportunity
  const handleCreateJobOpportunity = async () => {
    try {
      // Validation
      const requiredFields = {
        'Job Title': title,
        'Company': company,
        'Location': location,
        'Job Type': jobType,
        'Description': description,
        'Requirements': requirements,
        'Last Date to Apply': lastDateToApply
      };

      for (const [fieldName, value] of Object.entries(requiredFields)) {
        if (!value || value.toString().trim() === '') {
          toast({
            title: `${fieldName} Required`,
            description: `${fieldName} is required`,
            variant: "destructive"
          });
          return;
        }
      }

      
      const jobData = {
        title,
        company,
        location,
        jobType,
        description,
        requirements,
        salaryRange,
        applicationLink,
        lastDateToApply
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/job`, 
        jobData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Refresh job opportunities
      await fetchAllJobOpportunities();
      await fetchMyJobOpportunities();

      // Reset form and close dialog
      setIsCreateJobDialogOpen(false);
      resetForm();

      toast({
        title: "Success",
        description: "Job opportunity shared successfully"
      });
    } catch (error) {
      console.error("Failed to create job opportunity:", error);
      toast({
        title: "Error",
        description: "Failed to share job opportunity",
        variant: "destructive"
      });
    }
  };

  // Update Job Opportunity
  const handleUpdateJobOpportunity = async () => {
    if (!currentJob) return;
    
    try {
      // Validation
      const requiredFields = {
        'Job Title': title,
        'Company': company,
        'Location': location,
        'Job Type': jobType,
        'Description': description,
        'Requirements': requirements,
        'Last Date to Apply': lastDateToApply
      };

      for (const [fieldName, value] of Object.entries(requiredFields)) {
        if (!value || value.toString().trim() === '') {
          toast({
            title: `${fieldName} Required`,
            description: `${fieldName} is required`,
            variant: "destructive"
          });
          return;
        }
      }

      const jobData = {
        title,
        company,
        location,
        jobType,
        description,
        requirements,
        salaryRange,
        applicationLink,
        lastDateToApply
      };

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/job/job-opportunities/${currentJob.id}/update-by-alumni`, 
        jobData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Refresh job opportunities
      await fetchAllJobOpportunities();
      await fetchMyJobOpportunities();

      // Reset form and close dialog
      setIsUpdateJobDialogOpen(false);
      setCurrentJob(null);
      resetForm();

      toast({
        title: "Success",
        description: "Job opportunity updated successfully"
      });
    } catch (error) {
      console.error("Failed to update job opportunity:", error);
      toast({
        title: "Error",
        description: "Failed to update job opportunity",
        variant: "destructive"
      });
    }
  };

  // Open Update Dialog
  const openUpdateDialog = (job: JobOpportunity) => {
    setCurrentJob(job);
    setTitle(job.title);
    setCompany(job.company);
    setLocation(job.location);
    setJobType(job.jobType);
    setDescription(job.description);
    setRequirements(job.requirements);
    setSalaryRange(job.salaryRange || "");
    setApplicationLink(job.applicationLink || "");
    setLastDateToApply(job.lastDateToApply);
    setIsUpdateJobDialogOpen(true);
  };

  const resetForm = () => {
    setTitle("");
    setCompany("");
    setLocation("");
    setJobType("FULL_TIME");
    setDescription("");
    setRequirements("");
    setSalaryRange("");
    setApplicationLink("");
    setLastDateToApply("");
  };

  // Function to format job type with proper spacing
  const formatJobType = (jobType: string) => {
    return jobType.replace('_', ' ');
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-lg">Loading...</span>
    </div>
  );

  return (
    <div className="bg-gray-100 w-full min-h-screen">
      <main className="p-4 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Job Opportunities</h1>
            <p className="text-gray-600">Explore and share job opportunities</p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="flex w-full sm:w-auto">
              <Button 
                variant={!showMyListings ? "default" : "outline"}
                onClick={() => setShowMyListings(false)}
                className="flex-1 sm:flex-auto"
              >
                All Opportunities
              </Button>
              <Button 
                variant={showMyListings ? "default" : "outline"}
                onClick={() => setShowMyListings(true)}
                className="flex-1 ml-2 sm:flex-auto"
              >
                My Listings
              </Button>
            </div>
            <Button 
              onClick={() => setIsCreateJobDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" /> Share Opportunity
            </Button>
          </div>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            className="pl-10 pr-4 py-2"
            placeholder="Search jobs by title, company, or location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow p-8">
            <p className="text-lg text-gray-600">
              {showMyListings 
                ? "You haven't shared any job opportunities yet." 
                : "No job opportunities available at the moment."}
            </p>
            {showMyListings && (
              <Button 
                onClick={() => setIsCreateJobDialogOpen(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-500"
              >
                <Plus className="mr-2 h-4 w-4" /> Share Your First Opportunity
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => {
              const canEdit = showMyListings || myJobOpportunities.some(myJob => myJob.id === job.id);
              
              return (
                <div 
                  key={job.id} 
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow relative"
                >
                  {canEdit && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute top-2 right-2 p-1 h-8 w-8"
                      onClick={() => openUpdateDialog(job)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold">{job.title}</h2>
                      <p className="text-gray-600">{job.company}</p>
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                      {formatJobType(job.jobType)}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-700">{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-700">
                        Apply by {format(new Date(job.lastDateToApply), 'PP')}
                      </span>
                    </div>
                    {job.salaryRange && (
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-700">{job.salaryRange}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>

                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-sm text-gray-500">
                      Posted by {job.alumni.user.name}
                    </span>
                    {job.applicationLink && (
                      <a 
                        href={job.applicationLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        Apply <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Create Job Opportunity Dialog */}
      <Dialog open={isCreateJobDialogOpen} onOpenChange={setIsCreateJobDialogOpen}>
        <DialogContent className="w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Share Job Opportunity</DialogTitle>
            <DialogDescription>Fill in the job details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Job Title & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Label>Job Title</Label>
                <Input 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter job title"
                />
              </div>
              <div className="flex flex-col">
                <Label>Company</Label>
                <Input 
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company name"
                />
              </div>
            </div>

            {/* Location & Job Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Label>Location</Label>
                <Input 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Job location"
                />
              </div>
              <div className="flex flex-col">
                <Label>Job Type</Label>
                <Select 
                  value={jobType}
                  onValueChange={(value: JobOpportunity['jobType']) => setJobType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">Full Time</SelectItem>
                    <SelectItem value="PART_TIME">Part Time</SelectItem>
                    <SelectItem value="INTERNSHIP">Internship</SelectItem>
                    <SelectItem value="FREELANCE">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <Label>Job Description</Label>
              <Input 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed job description"
              />
            </div>

            {/* Requirements */}
            <div className="flex flex-col">
              <Label>Requirements</Label>
              <Input 
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Skills and qualifications required"
              />
            </div>

            {/* Optional Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Label>Salary Range (Optional)</Label>
                <Input 
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  placeholder="e.g., $50,000 - $70,000"
                />
              </div>
              <div className="flex flex-col">
                <Label>Application Link (Optional)</Label>
                <Input 
                  value={applicationLink}
                  onChange={(e) => setApplicationLink(e.target.value)}
                  placeholder="External application URL"
                />
              </div>
            </div>

           {/* Last Date to Apply */}
           <div className="flex flex-col">
              <Label>Last Date to Apply</Label>
              <Input 
                type="date"
                value={lastDateToApply}
                onChange={(e) => setLastDateToApply(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateJobDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateJobOpportunity}
                className="bg-blue-600 hover:bg-blue-500"
              >
                Share Opportunity
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Job Opportunity Dialog */}
      <Dialog open={isUpdateJobDialogOpen} onOpenChange={setIsUpdateJobDialogOpen}>
        <DialogContent className="w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Job Opportunity</DialogTitle>
            <DialogDescription>Edit the job details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Job Title & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Label>Job Title</Label>
                <Input 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter job title"
                />
              </div>
              <div className="flex flex-col">
                <Label>Company</Label>
                <Input 
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company name"
                />
              </div>
            </div>

            {/* Location & Job Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Label>Location</Label>
                <Input 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Job location"
                />
              </div>
              <div className="flex flex-col">
                <Label>Job Type</Label>
                <Select 
                  value={jobType}
                  onValueChange={(value: JobOpportunity['jobType']) => setJobType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">Full Time</SelectItem>
                    <SelectItem value="PART_TIME">Part Time</SelectItem>
                    <SelectItem value="INTERNSHIP">Internship</SelectItem>
                    <SelectItem value="FREELANCE">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <Label>Job Description</Label>
              <Input 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed job description"
              />
            </div>

            {/* Requirements */}
            <div className="flex flex-col">
              <Label>Requirements</Label>
              <Input 
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Skills and qualifications required"
              />
            </div>

            {/* Optional Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Label>Salary Range (Optional)</Label>
                <Input 
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  placeholder="e.g., $50,000 - $70,000"
                />
              </div>
              <div className="flex flex-col">
                <Label>Application Link (Optional)</Label>
                <Input 
                  value={applicationLink}
                  onChange={(e) => setApplicationLink(e.target.value)}
                  placeholder="External application URL"
                />
              </div>
            </div>

           {/* Last Date to Apply */}
           <div className="flex flex-col">
              <Label>Last Date to Apply</Label>
              <Input 
                type="date"
                value={lastDateToApply}
                onChange={(e) => setLastDateToApply(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsUpdateJobDialogOpen(false);
                  setCurrentJob(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateJobOpportunity}
                className="bg-blue-600 hover:bg-blue-500"
              >
                Update Opportunity
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
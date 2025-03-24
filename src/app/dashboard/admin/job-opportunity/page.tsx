"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Clock,
  Calendar,
  MapPin,
  Search,
  AlertCircle,
  User
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";

// Types
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
  requestStatus: "PENDING" | "APPROVED" | "REJECTED";
  alumni: {
    user: {
      name: string;
    };
  };
  createdAt: string;
};

export default function JobOpportunitiesAdminPanel() {
  const [jobOpportunities, setJobOpportunities] = useState<JobOpportunity[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobOpportunity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const { toast } = useToast();
  const token=Cookies.get('ams_token')
  // Fetch job opportunities
  useEffect(() => {
    const fetchJobOpportunities = async () => {
      try {
        const response = await axios.get<JobOpportunity[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/job/job-opportunities/admin`,{
            headers:{
              Authorization: `Bearer ${token}`
            }
          }
        );
        setJobOpportunities(response.data);
        setFilteredJobs(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch job opportunities:", error);
        toast({
          title: "Error",
          description: "Failed to fetch job opportunities",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchJobOpportunities();
  }, [toast, token]);

  // Search functionality
  useEffect(() => {
    const filtered = jobOpportunities.filter(job =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.alumni.user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredJobs(filtered);
  }, [searchQuery, jobOpportunities]);

  // Handle job status update
  const handleJobStatusUpdate = async (jobId: number, status: "APPROVED" | "REJECTED") => {
    try {
      setUpdateLoading(true);
      
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/job/job-opportunities/${jobId}/status`,
        { requestStatus: status },{
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      // Update local state
      const updatedJobs = jobOpportunities.map(job => 
        job.id === jobId ? { ...job, requestStatus: status } : job
      );
      
      setJobOpportunities(updatedJobs);
      setFilteredJobs(updatedJobs);
      
      // Update selected job status
      if (selectedJob && selectedJob.id === jobId) {
        setSelectedJob({ ...selectedJob, requestStatus: status });
      }
      
      toast({
        title: "Success",
        description: `Job opportunity ${status.toLowerCase()}`,
      });
    } catch (error) {
      console.error("Failed to update job opportunity status:", error);
      toast({
        title: "Error",
        description: "Failed to update job opportunity status",
        variant: "destructive",
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  // View job details
  const handleViewDetails = (job: JobOpportunity) => {
    setSelectedJob(job);
    setIsDialogOpen(true);
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="bg-gray-100 w-full">
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Job Opportunities</h1>
            <p className="text-gray-600">Manage and Review Job Postings</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="mt-6 relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            className="pl-10 pr-4 py-2"
            type="text"
            placeholder="Search by job title, company, or host..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Job Opportunities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => handleViewDetails(job)}
              className="bg-white p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Briefcase className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold">{job.title}</h2>
                  <p className="text-gray-600">{job.company}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <p className="text-gray-700">
                    <strong>Posted by:</strong> {job.alumni.user.name}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <p className="text-gray-700">{job.location}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <p className="text-gray-700">
                    <strong>Closes:</strong> {format(new Date(job.lastDateToApply), 'PP')}
                  </p>
                </div>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${job.requestStatus === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  job.requestStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'}`}>
                  {job.requestStatus}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Job Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] max-h-[90vh] overflow-hidden sm:max-w-7xl">
          <DialogHeader className="sticky top-0 z-10">
            <DialogTitle className="text-xl md:text-2xl font-bold">Job Opportunity Details</DialogTitle>
          </DialogHeader>
          
          {selectedJob && (
            <div className="overflow-y-auto max-h-[calc(90vh-8rem)] pr-2">
              <div className="space-y-6 py-4">
                {/* Header Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold">{selectedJob.title}</h2>
                  <p className="text-gray-600">{selectedJob.company}</p>
                </div>

                {/* Responsive Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Column 1: Basic Info */}
                  <div className="space-y-4 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-blue-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold">Posted By</p>
                        <p className="truncate">{selectedJob.alumni.user.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-green-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold">Location</p>
                        <p className="truncate">{selectedJob.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-purple-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold">Job Type</p>
                        <p className="truncate">{selectedJob.jobType.replace('_', ' ')}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-orange-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold">Last Date to Apply</p>
                        <p className="truncate">
                          {format(new Date(selectedJob.lastDateToApply), 'PP')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Job Details */}
                  <div className="space-y-4 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mt-1 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold">Description</p>
                        <p className="whitespace-pre-wrap break-words">{selectedJob.description}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Briefcase className="h-5 w-5 text-indigo-500 mt-1 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold">Requirements</p>
                        <p className="whitespace-pre-wrap break-words">{selectedJob.requirements}</p>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Actions & Additional Details */}
                  <div className="space-y-4 p-4 rounded-lg">
                    {selectedJob.salaryRange && (
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-green-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold">Salary Range</p>
                          <p className="truncate">{selectedJob.salaryRange}</p>
                        </div>
                      </div>
                    )}

                    {selectedJob.applicationLink && (
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="h-5 w-5 text-blue-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold">Application Link</p>
                          <a 
                            href={selectedJob.applicationLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline truncate"
                          >
                            Apply Now
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Show status controls for all job opportunities */}
                    <div className="space-y-4 pt-4 border-t mt-4">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          variant="outline"
                          className={`border-red-300 text-red-600 hover:bg-red-50 w-full sm:w-auto ${
                            selectedJob.requestStatus === "REJECTED" ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          onClick={() => handleJobStatusUpdate(selectedJob.id, "REJECTED")}
                          disabled={updateLoading || selectedJob.requestStatus === "REJECTED"}
                        >
                          {updateLoading && selectedJob.requestStatus !== "REJECTED" ? "Processing..." : "Reject"}
                        </Button>
                        <Button
                          className={`bg-green-600 hover:bg-green-500 text-white w-full sm:w-auto ${
                            selectedJob.requestStatus === "APPROVED" ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          onClick={() => handleJobStatusUpdate(selectedJob.id, "APPROVED")}
                          disabled={updateLoading || selectedJob.requestStatus === "APPROVED"}
                        >
                          {updateLoading && selectedJob.requestStatus !== "APPROVED" ? "Processing..." : "Approve"}
                        </Button>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Current status: <span className={`font-medium ${
                          selectedJob.requestStatus === 'APPROVED' ? 'text-green-600' :
                          selectedJob.requestStatus === 'REJECTED' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>{selectedJob.requestStatus}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
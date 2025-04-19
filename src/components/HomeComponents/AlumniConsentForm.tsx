"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";

// Types
type Alumni = {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

type EventType = "WEBINAR" | "WORKSHOP" | "SEMINAR" | "LECTURE";

export default function AlumniConsentForm({ 
  isOpen, 
  onClose, 
  onEventCreated 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onEventCreated: () => Promise<void>;
}) {
  // Alumni state
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [selectedAlumniId, setSelectedAlumniId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for button loading
  const { toast } = useToast();

  // Form states
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventType, setEventType] = useState<EventType>("WEBINAR");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [eventTime, setEventTime] = useState("");
  const [eventDuration, setEventDuration] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [eventAgenda, setEventAgenda] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");

  // Fetch alumni list
  useEffect(() => {
    const fetchAlumni = async () => {
      if (isOpen) {
        try {
          setLoading(true);
          const response = await axios.get<Alumni[]>(`${process.env.NEXT_PUBLIC_API_URL}/alumni`);
          setAlumni(response.data);
        } catch (error) {
          console.error("Failed to fetch alumni:", error);
          toast({
            title: "Error",
            description: "Failed to load alumni list",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAlumni();
  }, [isOpen, toast]);

  // Reset form
  const resetForm = () => {
    setSelectedAlumniId(null);
    setEventTitle("");
    setEventDescription("");
    setEventType("WEBINAR");
    setSelectedDate(undefined);
    setEventTime("");
    setEventDuration("");
    setTargetAudience("");
    setEventAgenda("");
    setSpecialRequirements("");
  };

  // Handle form submission
  const handleCreateEvent = async () => {
    try {
      setIsSubmitting(true); // Set submitting state to true when starting

      // Validation checks
      if (!selectedAlumniId) {
        toast({
          title: "Alumni Selection",
          description: "Please select an alumni",
          variant: "destructive",
        });
        setIsSubmitting(false); // Reset submitting state
        return;
      }

      const requiredFields = {
        'Event Title': eventTitle,
        'Event Description': eventDescription,
        'Event Type': eventType,
        'Event Date': selectedDate,
        'Event Time': eventTime,
        'Event Duration': eventDuration,
        'Target Audience': targetAudience,
        'Event Agenda': eventAgenda,
        'Special Requirements': specialRequirements
      };

      // Check each required field
      for (const [fieldName, value] of Object.entries(requiredFields)) {
        if (!value || value.toString().trim() === '') {
          toast({
            title: `${fieldName}`,
            description: `${fieldName} is required`,
            variant: "destructive",
          });
          setIsSubmitting(false); // Reset submitting state
          return;
        }
      }

      // Additional specific validations
      if (!selectedDate) {
        toast({
          title: "Validation Error",
          description: "Please select a date",
          variant: "destructive",
        });
        setIsSubmitting(false); // Reset submitting state
        return;
      }

      // Time format validation
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(eventTime)) {
        toast({
          title: "Validation Error",
          description: "Please enter a valid time in HH:MM format",
          variant: "destructive",
        });
        setIsSubmitting(false); // Reset submitting state
        return;
      }

      // Duration format suggestion
      if (!eventDuration.includes('hour') && !eventDuration.includes('min')) {
        toast({
          title: "Validation Error",
          description: "Please specify duration in hours or minutes (e.g., '2 hours' or '30 minutes')",
          variant: "destructive",
        });
        setIsSubmitting(false); // Reset submitting state
        return;
      }

      const eventDate = new Date(selectedDate);
      eventDate.setUTCHours(0, 0, 0, 0);

      const formattedEventDate = selectedDate ? 
    format(selectedDate, 'yyyy-MM-dd') : 
    null;
      // Prepare event data
      const eventData = {
        alumniId: selectedAlumniId,
        facultyId: null,
        eventTitle,
        eventDescription,
        eventType,
        eventDate: formattedEventDate,
        eventTime,
        eventDuration,
        targetAudience,
        eventAgenda,
        specialRequirements,
        requestStatus: "PENDING" as const,
      };

      const token = Cookies.get('ams_token');
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/event/createEventForAlumniByAdmin`, eventData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Refresh event list
      await onEventCreated();
      resetForm();
      onClose();

      toast({
        title: "Success",
        description: "Alumni event created successfully",
      });
    } catch (error) {
      console.error("Failed to create alumni event:", error);
      toast({
        title: "Error",
        description: "Failed to create alumni event",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false); // Reset submitting state regardless of outcome
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-full sm:max-w-2xl mx-2 md:mx-auto overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold">Create Alumni Event</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">Create an event on behalf of an alumni</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 py-2">
          {/* Alumni Selection */}
          <div className="flex flex-col">
            <Label htmlFor="alumniSelect" className="text-sm sm:text-base">Select Alumni</Label>
            <Select
              value={selectedAlumniId?.toString() || ""}
              onValueChange={(value) => setSelectedAlumniId(Number(value))}
              disabled={loading || isSubmitting}
            >
              <SelectTrigger className="w-full mt-1 text-sm sm:text-base">
                <SelectValue placeholder={loading ? "Loading alumni..." : "Select an alumni"} />
              </SelectTrigger>
              <SelectContent className="max-h-40 sm:max-h-56 overflow-y-auto">
                {alumni.map((alumniItem) => (
                  <SelectItem key={alumniItem.id} value={alumniItem.id.toString()}>
                    <div className="flex items-center space-x-2 text-xs sm:text-sm">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                      <span className="truncate">{alumniItem.user.name} ({alumniItem.user.email})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Row 1: Event Title & Event Type */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-4">
            <div className="flex flex-col">
              <Label htmlFor="eventTitle" className="text-sm sm:text-base">Event Title</Label>
              <Input
                id="eventTitle"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="w-full mt-1 text-sm sm:text-base"
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="eventType" className="text-sm sm:text-base">Event Type</Label>
              <Select
                value={eventType}
                onValueChange={(value: EventType) => setEventType(value)}
                disabled={isSubmitting}
                required
              >
                <SelectTrigger className="w-full mt-1 text-sm sm:text-base">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WEBINAR">Webinar</SelectItem>
                  <SelectItem value="WORKSHOP">Workshop</SelectItem>
                  <SelectItem value="SEMINAR">Seminar</SelectItem>
                  <SelectItem value="LECTURE">Lecture</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Date & Time */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-4">
            <div className="flex flex-col">
              <Label htmlFor="eventDate" className="text-sm sm:text-base">Date</Label>
              <Input
                id="eventDate"
                type="date"
                value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="w-full mt-1 text-sm sm:text-base"
                min={format(new Date(), 'yyyy-MM-dd')}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="eventTime" className="text-sm sm:text-base">Time</Label>
              <Input
                id="eventTime"
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="w-full mt-1 text-sm sm:text-base"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {/* Row 3: Duration & Target Audience */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-4">
            <div className="flex flex-col">
              <Label htmlFor="eventDuration" className="text-sm sm:text-base">Duration</Label>
              <Input
                id="eventDuration"
                value={eventDuration}
                onChange={(e) => setEventDuration(e.target.value)}
                placeholder="e.g., 2 hours"
                className="w-full mt-1 text-sm sm:text-base"
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="targetAudience" className="text-sm sm:text-base">Target Audience</Label>
              <Input
                id="targetAudience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full mt-1 text-sm sm:text-base"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {/* Row 4: Description & Agenda */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-4">
            <div className="flex flex-col">
              <Label htmlFor="eventDescription" className="text-sm sm:text-base">Description</Label>
              <Input
                id="eventDescription"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                className="w-full mt-1 text-sm sm:text-base"
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="eventAgenda" className="text-sm sm:text-base">Agenda</Label>
              <Input
                id="eventAgenda"
                value={eventAgenda}
                onChange={(e) => setEventAgenda(e.target.value)}
                className="w-full mt-1 text-sm sm:text-base"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {/* Special Requirements */}
          <div className="flex flex-col">
            <Label htmlFor="specialRequirements" className="text-sm sm:text-base">Special Requirements</Label>
            <Input
              id="specialRequirements"
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              className="w-full mt-1 text-sm sm:text-base"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 pt-3 sm:pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-gray-300 text-xs sm:text-sm py-1 h-8 sm:h-10"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateEvent}
              className="bg-blue-600 hover:bg-blue-500 text-xs sm:text-sm py-1 h-8 sm:h-10"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Alumni Event"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
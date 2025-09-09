import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, MapPin, Users, Upload } from "lucide-react";
import { PhotoGallery } from "@/components/files/PhotoGallery";
import { CertificateList } from "@/components/files/CertificateList";
import { ReportViewer } from "@/components/files/ReportViewer";
import { FeedbackForms } from "@/components/files/FeedbackForms";
import { OtherFiles } from "@/components/files/OtherFiles";

// Mock event data - in real app this would come from API/context
const mockEvent = {
  id: "1",
  title: "Annual Tech Fest 2024",
  description: "A comprehensive showcase of cutting-edge technology and innovation featuring presentations by students, workshops by industry experts, and competitive programming challenges. This three-day event brings together tech enthusiasts, entrepreneurs, and professionals to share knowledge and collaborate on future innovations.",
  date: "March 15-17, 2024",
  location: "Main Auditorium & Tech Labs",
  status: "active" as const,
  category: "technical" as const,
  attendees: 450,
  image: "🚀",
  organizer: "Computer Science Department",
  agenda: [
    "Day 1: Opening Ceremony & Keynote Speeches",
    "Day 2: Technical Workshops & Project Exhibitions",
    "Day 3: Competitions & Award Ceremony"
  ]
};

// Mock user role - in real app this would come from auth context
const userRole: "admin" | "core_member" | "member" = "core_member";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success";
      case "upcoming":
        return "bg-primary/10 text-primary";
      case "completed":
        return "bg-muted/10 text-muted-foreground";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "technical":
        return "bg-accent/10 text-accent";
      case "cultural":
        return "bg-warning/10 text-warning";
      case "sports":
        return "bg-destructive/10 text-destructive";
      case "academic":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  const canUpload = ["admin", "core_member"].includes(userRole);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/events")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Button>
      </div>

      {/* Event Header Card */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{mockEvent.image}</div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Badge className={getStatusColor(mockEvent.status)}>
                    {mockEvent.status}
                  </Badge>
                  <Badge className={getCategoryColor(mockEvent.category)}>
                    {mockEvent.category}
                  </Badge>
                </div>
                <CardTitle className="text-2xl">{mockEvent.title}</CardTitle>
              </div>
            </div>
            {canUpload && (
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Files
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="other">Other Files</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Event Details */}
            <Card className="lg:col-span-2 shadow-card">
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {mockEvent.description}
                </p>
                
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-semibold">Agenda</h4>
                  <ul className="space-y-2">
                    {mockEvent.agenda.map((item, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Event Info Sidebar */}
            <div className="space-y-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Event Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Date</p>
                        <p className="text-sm text-muted-foreground">{mockEvent.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{mockEvent.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Attendees</p>
                        <p className="text-sm text-muted-foreground">{mockEvent.attendees} registered</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Organizer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{mockEvent.organizer}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="photos">
          <PhotoGallery eventId={id} canUpload={canUpload} />
        </TabsContent>

        <TabsContent value="certificates">
          <CertificateList eventId={id} canUpload={canUpload} />
        </TabsContent>

        <TabsContent value="reports">
          <ReportViewer eventId={id} canUpload={canUpload} />
        </TabsContent>

        <TabsContent value="feedback">
          <FeedbackForms eventId={id} canUpload={canUpload} />
        </TabsContent>

        <TabsContent value="other">
          <OtherFiles eventId={id} canUpload={canUpload} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventDetail;
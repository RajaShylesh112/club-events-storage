import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  FileText, 
  Users, 
  Archive,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp
} from "lucide-react";

interface DashboardStats {
  totalEvents: number;
  activeProposals: number;
  archivedEvents: number;
  totalUsers: number;
}

const Dashboard = () => {
  const [userRole, setUserRole] = useState<string>("member");
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 24,
    activeProposals: 8,
    archivedEvents: 156,
    totalUsers: 342
  });

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "member";
    setUserRole(role);
  }, []);

  const AdminDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Proposals</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.activeProposals}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Archived Events</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{stats.archivedEvents}</div>
            <p className="text-xs text-muted-foreground">Historical records</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Active members</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Pending Proposals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { title: "Annual Tech Fest 2024", author: "Sarah Chen", date: "2 days ago" },
              { title: "Cultural Night - Diwali Celebration", author: "Rajesh Kumar", date: "1 week ago" },
              { title: "Career Guidance Workshop", author: "Emily Johnson", date: "3 days ago" },
            ].map((proposal, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <h4 className="font-medium">{proposal.title}</h4>
                  <p className="text-sm text-muted-foreground">By {proposal.author} • {proposal.date}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="success" size="sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button variant="destructive" size="sm">
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const CoreMemberDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              My Proposals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">5</div>
            <p className="text-xs text-muted-foreground">3 approved, 2 pending</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">3</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Uploads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">2</div>
            <p className="text-xs text-muted-foreground">Files needed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Quick Actions
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="hero" size="lg" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create New Proposal
            </Button>
            <Button variant="accent" size="lg" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Event
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Proposals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: "Tech Workshop Series", status: "approved" },
                { title: "Student Mentorship Program", status: "pending" },
                { title: "Innovation Challenge", status: "rejected" },
              ].map((proposal, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{proposal.title}</span>
                  <Badge 
                    variant={proposal.status === "approved" ? "default" : 
                            proposal.status === "pending" ? "secondary" : "destructive"}
                  >
                    {proposal.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const MemberDashboard = () => (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Active Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { 
                title: "Annual Tech Fest 2024", 
                date: "March 15-17, 2024", 
                status: "Registration Open",
                image: "🎉"
              },
              { 
                title: "Cultural Night", 
                date: "March 22, 2024", 
                status: "Coming Soon",
                image: "🎭"
              },
              { 
                title: "Career Fair", 
                date: "April 5, 2024", 
                status: "Applications Open",
                image: "💼"
              },
            ].map((event, index) => (
              <Card key={index} className="border-2 border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="text-center text-2xl mb-2">{event.image}</div>
                  <CardTitle className="text-center text-sm">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <p className="text-xs text-muted-foreground">{event.date}</p>
                  <Badge variant="secondary" className="text-xs">
                    {event.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Quick Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto p-4 flex-col">
              <FileText className="h-8 w-8 mb-2" />
              <span>Event Feedback</span>
              <span className="text-xs text-muted-foreground">Submit feedback</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col">
              <Calendar className="h-8 w-8 mb-2" />
              <span>Event Calendar</span>
              <span className="text-xs text-muted-foreground">View all events</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDashboard = () => {
    switch (userRole) {
      case "admin":
        return <AdminDashboard />;
      case "core":
        return <CoreMemberDashboard />;
      default:
        return <MemberDashboard />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {userRole === "admin" ? "Administrator" : 
                         userRole === "core" ? "Core Member" : "Member"}
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your events today.
          </p>
        </div>
      </div>
      
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
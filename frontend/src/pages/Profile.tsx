import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { useAuth } from "../lib/useAuth";
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Phone, 
  Edit,
  Save,
  X,
  Activity,
  Clock,
  FileText,
  Award
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  role: string;
  department: string;
  joinDate: string;
  phone: string;
  lastLogin: string;
}

interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  details: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "Loading...",
    email: "Loading...",
    role: "member",
    department: "Computer Science",
    joinDate: "September 2023",
    phone: "+1 (555) 123-4567",
    lastLogin: "March 8, 2024 - 2:30 PM"
  });

  const [editableProfile, setEditableProfile] = useState<UserProfile>(profile);

  const activityLogs: ActivityLog[] = [
    {
      id: "1",
      action: "Logged in",
      timestamp: "2024-03-08 14:30",
      details: "Successful login from Chrome browser"
    },
    {
      id: "2",
      action: "Viewed event",
      timestamp: "2024-03-08 14:25",
      details: "Opened 'Annual Tech Fest 2024' details"
    },
    {
      id: "3",
      action: "Profile updated",
      timestamp: "2024-03-07 16:45",
      details: "Updated phone number"
    },
    {
      id: "4",
      action: "Proposal submitted",
      timestamp: "2024-03-06 11:20",
      details: "Created 'Innovation Workshop' proposal"
    },
    {
      id: "5",
      action: "File uploaded",
      timestamp: "2024-03-05 09:15",
      details: "Uploaded event certificate"
    }
  ];

  // Update profile when user data changes
  useEffect(() => {
    if (user) {
      const updatedProfile = {
        ...profile,
        name: user.name || "No Name",
        email: user.email || "No Email",
        role: user.role || "member",
      };
      
      setProfile(updatedProfile);
      setEditableProfile(updatedProfile);
    }
  }, [user, profile]);

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: { label: "Administrator", color: "bg-destructive/10 text-destructive", icon: "👑" },
      core_member: { label: "Core Member", color: "bg-warning/10 text-warning", icon: "⭐" },
      member: { label: "Member", color: "bg-success/10 text-success", icon: "👤" }
    };
    return badges[role as keyof typeof badges] || badges.member;
  };

  const handleSave = () => {
    setProfile(editableProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableProfile(profile);
    setIsEditing(false);
  };

  const badge = getRoleBadge(profile.role);

  const getStatsForRole = () => {
    switch (profile.role) {
      case "admin":
        return [
          { label: "Total Events Managed", value: "24", icon: Calendar },
          { label: "Proposals Reviewed", value: "45", icon: FileText },
          { label: "Users Managed", value: "342", icon: User },
          { label: "System Uptime", value: "99.9%", icon: Activity }
        ];
      case "core_member":
        return [
          { label: "Proposals Created", value: "8", icon: FileText },
          { label: "Events Organized", value: "12", icon: Calendar },
          { label: "Files Uploaded", value: "28", icon: Award },
          { label: "Member Since", value: "2023", icon: Clock }
        ];
      default:
        return [
          { label: "Events Attended", value: "15", icon: Calendar },
          { label: "Feedback Submitted", value: "6", icon: FileText },
          { label: "Profile Views", value: "23", icon: User },
          { label: "Member Since", value: "2023", icon: Clock }
        ];
    }
  };

  const stats = getStatsForRole();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account information and view activity history
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="default" size="sm" onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{profile.name}</h3>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${badge.color} mt-1`}>
                    <span>{badge.icon}</span>
                    {badge.label}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editableProfile.name}
                        onChange={(e) => setEditableProfile({...editableProfile, name: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editableProfile.email}
                        onChange={(e) => setEditableProfile({...editableProfile, email: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editableProfile.phone}
                        onChange={(e) => setEditableProfile({...editableProfile, phone: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Department</Label>
                    {isEditing ? (
                      <Input
                        value={editableProfile.department}
                        onChange={(e) => setEditableProfile({...editableProfile, department: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.department}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Join Date</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.joinDate}</span>
                    </div>
                  </div>

                  <div>
                    <Label>Last Login</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.lastLogin}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityLogs.map((log, index) => (
                  <div key={log.id}>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{log.action}</p>
                          <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{log.details}</p>
                      </div>
                    </div>
                    {index < activityLogs.length - 1 && <div className="ml-1 w-px h-4 bg-border" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="font-semibold">{stat.value}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Download Data
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Award className="h-4 w-4 mr-2" />
                View Certificates
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
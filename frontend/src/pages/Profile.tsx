import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { useAuth } from "../lib/useAuth";
import { 
  User as UserIcon, 
  Mail as MailIcon, 
  Calendar as CalendarIcon, 
  Edit, 
  Save, 
  X 
} from "lucide-react";
import api from "../lib/api";
import { useToast } from "../hooks/use-toast";

interface SimpleProfile {
  name: string;
  email: string;
  role: string;
  google_sub: string;
  created_at: string;
  updated_at: string;
  password: string;
  picture: string;
}

const Profile = () => {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState<SimpleProfile>({
    name: "Loading...",
    email: "Loading...",
    role: "user",
    google_sub: "",
    created_at: "",
    updated_at: "",
    password: "********",
    picture: "",
  });

  const [editableProfile, setEditableProfile] = useState<Pick<SimpleProfile, "name" | "email">>({
    name: profile.name,
    email: profile.email,
  });

  // Sync from auth user
  useEffect(() => {
    if (!user) return;
    const next: SimpleProfile = {
      name: user.name || "",
      email: user.email || "",
      role: user.role || "user",
      google_sub: user.google_sub || "",
      created_at: user.created_at || "",
      updated_at: user.updated_at || "",
      password: "********",
      picture: user.picture || "",
    };

    setProfile((prev) => {
      const updated = { ...prev, ...next };
      if (
        prev.name === updated.name &&
        prev.email === updated.email &&
        prev.role === updated.role &&
        prev.picture === updated.picture &&
        prev.created_at === updated.created_at &&
        prev.updated_at === updated.updated_at &&
        prev.google_sub === updated.google_sub
      ) {
        return prev;
      }
      return updated;
    });

    setEditableProfile({ name: next.name, email: next.email });
  }, [user]);

  const initials = (profile.name || "").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U";

  const handleSave = async () => {
    try {
      const payload: Partial<{ name: string; email: string }> = {
        name: editableProfile.name,
        email: editableProfile.email,
      };
      const res = await api.users.updateMe(payload);
      if (res.data) {
        // Update auth user and local profile
        setUser(res.data);
        setProfile((prev) => ({
          ...prev,
          name: res.data!.name,
          email: res.data!.email,
          picture: res.data!.picture || prev.picture,
        }));
        toast({ title: "Profile updated", description: "Your profile has been saved." });
        setIsEditing(false);
      } else if (res.error) {
        toast({ title: "Update failed", description: res.error });
      }
    } catch (e) {
      toast({ title: "Update failed", description: "An error occurred while saving." });
    }
  };

  const handleCancel = () => {
    setEditableProfile({ name: profile.name, email: profile.email });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account information
        </p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
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
              {/* If you add AvatarImage in your UI lib, you can show the real picture */}
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{profile.name || "Unnamed"}</h3>
              <div className="mt-1 inline-flex px-2 py-1 rounded-full text-xs bg-muted text-foreground/80">
                {profile.role}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input id="name" value={editableProfile.name} onChange={(e) => setEditableProfile({ ...editableProfile, name: e.target.value })} />
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.name}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                {isEditing ? (
                  <Input id="email" type="email" value={editableProfile.email} onChange={(e) => setEditableProfile({ ...editableProfile, email: e.target.value })} />
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <MailIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.email}</span>
                  </div>
                )}
              </div>

              <div>
                <Label>Role</Label>
                <div className="mt-1 text-sm">{profile.role}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Google Sub</Label>
                <div className="mt-1 text-sm break-all">{profile.google_sub || "—"}</div>
              </div>

              <div>
                <Label>Created At</Label>
                <div className="flex items-center gap-2 mt-1">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.created_at || "—"}</span>
                </div>
              </div>

              <div>
                <Label>Updated At</Label>
                <div className="flex items-center gap-2 mt-1">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.updated_at || "—"}</span>
                </div>
              </div>

              <div>
                <Label>Password</Label>
                <div className="mt-1 text-sm">{profile.password}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
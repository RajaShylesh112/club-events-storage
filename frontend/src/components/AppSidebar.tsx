import { useState } from "react";
import { 
  Home, 
  Calendar, 
  FileText, 
  Archive, 
  User, 
  Users,
  Settings,
  LogOut,
  ChevronRight,
  Code
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "./ui/sidebar";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { useAuth } from "../lib/auth";
import collegeLogo from "../assets/college-logo.png";

// CSS overrides for sidebar dark mode
import { useEffect } from "react";
import "./AppSidebar.css";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Events", url: "/events", icon: Calendar },
  { title: "Proposals", url: "/proposals", icon: FileText },
  { title: "Archive", url: "/archive", icon: Archive },
  { title: "Profile", url: "/profile", icon: User },
  { title: "API Demo", url: "/api-demo", icon: Code },
];

const adminItems = [
  { title: "User Management", url: "/users", icon: Users },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [adminExpanded, setAdminExpanded] = useState(false);
  
  // Get user from auth context
  const { user, logout } = useAuth();
  const userRole = user?.role || localStorage.getItem("userRole") || "member";
  
  const collapsed = state === "collapsed";

  // Override CSS variables to ensure dark mode for the sidebar
  useEffect(() => {
    // Set CSS variables for sidebar dark mode
    document.documentElement.style.setProperty('--sidebar-background', '#18181b'); // zinc-900
    document.documentElement.style.setProperty('--sidebar-foreground', '#f4f4f5'); // zinc-100
    document.documentElement.style.setProperty('--sidebar-border', '#27272a');     // zinc-800
  }, []);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path: string) => currentPath === path;
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    `group flex w-full items-center gap-2 overflow-hidden rounded-md px-2 py-2 text-left text-sm transition-all ${
      isActive 
        ? "bg-zinc-800 text-zinc-100 shadow-sm font-medium" 
        : "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 hover:translate-x-1"
    }`;

  const getRoleBadge = () => {
    const badges = {
      admin: { label: "Admin", color: "bg-zinc-800 text-destructive border-zinc-700" },
      core_member: { label: "Core", color: "bg-zinc-800 text-warning border-zinc-700" },
      member: { label: "Member", color: "bg-zinc-800 text-success border-zinc-700" }
    };
    return badges[userRole as keyof typeof badges] || badges.member;
  };

  const badge = getRoleBadge();

  return (
    <Sidebar className={`dark-sidebar ${collapsed ? "w-16" : "w-64"} !bg-zinc-900 !text-zinc-100 transition-all duration-300`} collapsible="icon">
      <SidebarHeader className="!border-b !border-zinc-800 p-4 !bg-zinc-900">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center shadow-card animate-pulse-slow">
              <img 
                src={collegeLogo} 
                alt="Event Portal Logo" 
                className="w-6 h-6 object-contain filter brightness-0 invert"
              />
            </div>
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h2 className="font-bold text-base text-zinc-100">Event Portal</h2>
              <div className={`text-xs px-2 py-1 rounded-md border ${badge.color} inline-block mt-1 font-medium`}>
                {badge.label}
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 !bg-zinc-900">
        {/* Main Navigation */}
        <SidebarGroup className="!bg-zinc-900">
          <SidebarGroupLabel className={`px-2 text-xs font-semibold !text-zinc-400 ${collapsed ? "sr-only" : ""}`}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent className="!bg-zinc-900">
            <SidebarMenu className="space-y-1 !bg-zinc-900">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title} className="!bg-zinc-900">
                  <SidebarMenuButton asChild tooltip={item.title} className="!bg-zinc-900">
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && (
                        <span className="animate-fade-in">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section */}
        {userRole === "admin" && (
          <SidebarGroup className="!bg-zinc-900">
            <Collapsible open={adminExpanded} onOpenChange={setAdminExpanded}>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className={`admin-trigger flex w-full items-center gap-2 px-2 text-xs font-semibold !text-zinc-400 hover:!text-zinc-200 !bg-zinc-900 ${collapsed ? "sr-only" : ""}`}>
                  System Admin
                  {!collapsed && (
                    <ChevronRight className={`ml-auto h-3 w-3 transition-transform ${adminExpanded ? "rotate-90" : ""}`} />
                  )}
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent className="animate-fade-in !bg-zinc-900">
                <SidebarGroupContent className="!bg-zinc-900">
                  <SidebarMenu className="space-y-1 !bg-zinc-900">
                    {adminItems.map((item) => (
                      <SidebarMenuItem key={item.title} className="!bg-zinc-900">
                        <SidebarMenuButton asChild tooltip={item.title} className="!bg-zinc-900">
                          <NavLink to={item.url} className={getNavCls}>
                            <item.icon className="h-4 w-4 shrink-0" />
                            {!collapsed && (
                              <span className="animate-fade-in">{item.title}</span>
                            )}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="!border-t !border-zinc-800 p-4 !bg-zinc-900">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 shadow-card hover-lift">
            {user?.picture ? (
              <img src={user.picture} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <AvatarFallback className="!bg-zinc-800 !text-zinc-100 text-sm font-bold">
                {user?.name ? user.name.charAt(0).toUpperCase() : userRole.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0 animate-fade-in">
              <p className="text-sm font-semibold text-zinc-100 truncate">
                {user ? user.name : 
                 userRole === "admin" ? "System Admin" : 
                 userRole === "core_member" ? "Event Coordinator" : "Participant"}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="p-0 h-auto text-xs text-zinc-400 hover:text-destructive hover:scale-105 transition-all duration-200"
              >
                <LogOut className="h-3 w-3 mr-1" />
                Sign out
              </Button>
            </div>
          )}
          {collapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-8 h-8 p-0 text-zinc-300 hover:text-destructive hover:scale-105 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
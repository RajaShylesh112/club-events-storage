import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Users, Search, Filter, Grid, List } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  status: "active" | "completed" | "upcoming";
  category: "academic" | "cultural" | "sports" | "technical";
  attendees: number;
  image: string;
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Annual Tech Fest 2024",
    description: "A showcase of cutting-edge technology and innovation by students and industry experts.",
    date: "March 15-17, 2024",
    location: "Main Auditorium",
    status: "upcoming",
    category: "technical",
    attendees: 450,
    image: "🚀"
  },
  {
    id: "2",
    title: "Cultural Night - Diwali Celebration",
    description: "Traditional dance performances, music, and authentic cuisine from across India.",
    date: "March 22, 2024",
    location: "College Grounds",
    status: "active",
    category: "cultural",
    attendees: 320,
    image: "🪔"
  },
  {
    id: "3",
    title: "Inter-College Basketball Championship",
    description: "Competitive basketball tournament featuring teams from multiple colleges.",
    date: "February 28, 2024",
    location: "Sports Complex",
    status: "completed",
    category: "sports",
    attendees: 200,
    image: "🏀"
  },
  {
    id: "4",
    title: "Career Guidance Workshop",
    description: "Industry professionals sharing insights on career paths and job market trends.",
    date: "April 5, 2024",
    location: "Conference Hall",
    status: "upcoming",
    category: "academic",
    attendees: 150,
    image: "💼"
  },
  {
    id: "5",
    title: "Hackathon 2024",
    description: "48-hour coding marathon to solve real-world problems with innovative solutions.",
    date: "March 1-3, 2024",
    location: "Computer Lab",
    status: "completed",
    category: "technical",
    attendees: 80,
    image: "💻"
  },
  {
    id: "6",
    title: "Annual Day Celebration",
    description: "Grand celebration featuring awards ceremony, performances, and alumni meet.",
    date: "April 20, 2024",
    location: "Main Auditorium",
    status: "upcoming",
    category: "cultural",
    attendees: 600,
    image: "🎉"
  }
];

const Events = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

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

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const EventCard = ({ event }: { event: Event }) => (
    <Card className="shadow-card hover:shadow-elegant transition-all duration-300 hover:scale-105 cursor-pointer">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="text-4xl mb-2">{event.image}</div>
          <div className="flex gap-2">
            <Badge className={getStatusColor(event.status)}>
              {event.status}
            </Badge>
            <Badge className={getCategoryColor(event.category)}>
              {event.category}
            </Badge>
          </div>
        </div>
        <CardTitle className="text-lg">{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {event.date}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {event.location}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {event.attendees} attendees
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={() => window.location.href = `/events/${event.id}`}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );

  const EventListItem = ({ event }: { event: Event }) => (
    <Card className="shadow-card hover:shadow-elegant transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="text-3xl">{event.image}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold truncate">{event.title}</h3>
              <div className="flex gap-2">
                <Badge className={getStatusColor(event.status)}>
                  {event.status}
                </Badge>
                <Badge className={getCategoryColor(event.category)}>
                  {event.category}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
              {event.description}
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {event.date}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {event.location}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {event.attendees} attendees
              </div>
            </div>
          </div>
          <Button 
            variant="outline"
            onClick={() => window.location.href = `/events/${event.id}`}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Events</h1>
          <p className="text-muted-foreground">
            Discover and manage college events and activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events Display */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredEvents.length} of {events.length} events
          </p>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <EventListItem key={event.id} event={event} />
            ))}
          </div>
        )}

        {filteredEvents.length === 0 && (
          <Card className="shadow-card">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-lg font-semibold mb-2">No events found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Events;
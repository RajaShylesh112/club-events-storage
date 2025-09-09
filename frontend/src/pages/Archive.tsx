import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Users, Search, RotateCcw, Trash2, Archive as ArchiveIcon } from "lucide-react";

interface ArchivedEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: "academic" | "cultural" | "sports" | "technical";
  attendees: number;
  archivedDate: string;
  image: string;
}

const mockArchivedEvents: ArchivedEvent[] = [
  {
    id: "1",
    title: "Hackathon 2024",
    description: "48-hour coding marathon to solve real-world problems with innovative solutions.",
    date: "March 1-3, 2024",
    location: "Computer Lab",
    category: "technical",
    attendees: 80,
    archivedDate: "March 4, 2024",
    image: "💻"
  },
  {
    id: "2",
    title: "Inter-College Basketball Championship",
    description: "Competitive basketball tournament featuring teams from multiple colleges.",
    date: "February 28, 2024",
    location: "Sports Complex",
    category: "sports",
    attendees: 200,
    archivedDate: "March 1, 2024",
    image: "🏀"
  },
  {
    id: "3",
    title: "Science Exhibition 2023",
    description: "Student projects showcasing innovative scientific research and experiments.",
    date: "December 15, 2023",
    location: "Science Building",
    category: "academic",
    attendees: 350,
    archivedDate: "December 16, 2023",
    image: "🔬"
  },
  {
    id: "4",
    title: "Winter Cultural Festival",
    description: "Multi-day celebration featuring music, dance, and traditional performances.",
    date: "December 5-7, 2023",
    location: "Main Auditorium",
    category: "cultural",
    attendees: 500,
    archivedDate: "December 8, 2023",
    image: "🎭"
  },
  {
    id: "5",
    title: "Alumni Networking Event",
    description: "Professional networking event connecting current students with alumni.",
    date: "November 20, 2023",
    location: "Conference Hall",
    category: "academic",
    attendees: 120,
    archivedDate: "November 21, 2023",
    image: "🎓"
  }
];

const Archive = () => {
  const [archivedEvents, setArchivedEvents] = useState<ArchivedEvent[]>(mockArchivedEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const userRole = localStorage.getItem("userRole") || "member";

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

  const filteredEvents = archivedEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleRestore = (id: string) => {
    // In real app, this would restore the event to active status
    console.log("Restoring event:", id);
  };

  const handlePermanentDelete = (id: string) => {
    setArchivedEvents(archivedEvents.filter(event => event.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <ArchiveIcon className="h-8 w-8" />
            Archive
          </h1>
          <p className="text-muted-foreground">
            Browse and manage archived events and historical records
          </p>
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
                  placeholder="Search archived events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
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

      {/* Archive Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Archived</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{archivedEvents.length}</div>
            <p className="text-xs text-muted-foreground">Events in archive</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Year</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {archivedEvents.filter(e => e.date.includes("2024")).length}
            </div>
            <p className="text-xs text-muted-foreground">2024 events</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Most Popular</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">Cultural</div>
            <p className="text-xs text-muted-foreground">Event category</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Attendees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {archivedEvents.reduce((sum, event) => sum + event.attendees, 0)}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Archived Events Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredEvents.length} of {archivedEvents.length} archived events
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="shadow-card hover:shadow-elegant transition-all duration-300 opacity-90">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl opacity-70">{event.image}</div>
                    <div>
                      <CardTitle className="text-lg text-muted-foreground">{event.title}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        <ArchiveIcon className="h-3 w-3 mr-1" />
                        Archived
                      </Badge>
                    </div>
                  </div>
                  <Badge className={getCategoryColor(event.category)}>
                    {event.category}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {event.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Event Date: {event.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {event.attendees} attendees
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ArchiveIcon className="h-4 w-4" />
                    Archived: {event.archivedDate}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1">
                    View Details
                  </Button>
                  
                  {userRole === "admin" && (
                    <>
                      <Button 
                        variant="accent" 
                        size="sm"
                        onClick={() => handleRestore(event.id)}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Restore
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handlePermanentDelete(event.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <Card className="shadow-card">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4 opacity-50">📦</div>
              <h3 className="text-lg font-semibold mb-2">No archived events found</h3>
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

export default Archive;
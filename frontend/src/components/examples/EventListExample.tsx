/**
 * Example component demonstrating API usage
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth';
import api, { Event } from '../../lib/api';

interface EventListProps {
  limit?: number;
}

export default function EventListExample({ limit = 5 }: EventListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Only fetch events if authenticated
    if (isAuthenticated) {
      const fetchEvents = async () => {
        try {
          setLoading(true);
          // Using our API service to fetch events
          // Only fetch approved events, not drafts or archived
          const fetchedEvents = await api.events.getAllEvents({ 
            status: 'approved',
            limit: limit.toString()
          });
          setEvents(fetchedEvents);
        } catch (err) {
          console.error('Failed to fetch events:', err);
          setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
          setLoading(false);
        }
      };
      
      fetchEvents();
    }
  }, [isAuthenticated, limit]);
  
  if (!isAuthenticated) {
    return <div>Please log in to view events</div>;
  }
  
  if (loading) {
    return <div>Loading events...</div>;
  }
  
  if (error) {
    return <div>Error loading events: {error}</div>;
  }
  
  if (events.length === 0) {
    return <div>No events found</div>;
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Upcoming Events</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div key={event._id} className="p-4 rounded-lg border border-border bg-card">
            <h3 className="font-semibold">{event.title}</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(event.start_time).toLocaleDateString()} - {new Date(event.end_time).toLocaleDateString()}
            </p>
            <p className="mt-2 line-clamp-2">{event.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm">Organizer ID: {event.organizer_id.substring(0, 8)}...</span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                event.status === 'approved' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/useAuth';
import { eventsApi, Event } from '../../lib/api';

interface ProposalListProps {
  limit?: number;
}

export default function ProposalListExample({ limit = 5 }: ProposalListProps) {
  const [proposals, setProposals] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Only fetch proposals if authenticated
    if (isAuthenticated) {
      const fetchProposals = async () => {
        try {
          setLoading(true);
          // Using our API service to fetch proposals (events with draft status)
          const response = await eventsApi.getAll('pending');
          if (response.data) {
            setProposals(response.data);
          } else {
            setError(response.error || 'Failed to fetch proposals');
          }
        } catch (err) {
          console.error('Failed to fetch proposals:', err);
          setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
          setLoading(false);
        }
      };
      
      fetchProposals();
    }
  }, [isAuthenticated]);
  
  if (!isAuthenticated) {
    return <div>Please log in to view proposals</div>;
  }
  
  if (loading) {
    return <div>Loading proposals...</div>;
  }
  
  if (error) {
    return <div>Error loading proposals: {error}</div>;
  }
  
  if (proposals.length === 0) {
    return <div>No proposals found</div>;
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Event Proposals</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {proposals.map((proposal) => (
          <div key={proposal._id} className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{proposal.title}</h3>
              <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">
              Proposed: {new Date(proposal.start_time).toLocaleDateString()}
            </p>
            
            <p className="mt-2 mb-4 line-clamp-2">{proposal.description}</p>
            
            <div className="flex gap-2 mt-4">
              <button 
                className="px-3 py-1 text-sm rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors"
                onClick={async () => {
                  try {
                    await eventsApi.approve(proposal._id);
                    // Refresh proposals
                    const response = await eventsApi.getAll('pending');
                    if (response.data) {
                      setProposals(response.data);
                    }
                  } catch (err) {
                    console.error('Failed to approve proposal:', err);
                  }
                }}
              >
                Approve
              </button>
              
              <button 
                className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
                onClick={async () => {
                  try {
                    if (confirm('Are you sure you want to delete this proposal?')) {
                      await eventsApi.delete(proposal._id);
                      // Refresh proposals
                      const response = await eventsApi.getAll('pending');
                      if (response.data) {
                        setProposals(response.data);
                      }
                    }
                  } catch (err) {
                    console.error('Failed to delete proposal:', err);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

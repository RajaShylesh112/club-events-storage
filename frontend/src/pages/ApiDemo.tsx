import React, { useState } from 'react';
import EventListExample from '../components/examples/EventListExample';
import ProposalListExample from '../components/examples/ProposalListExample';
import FileListExample from '../components/examples/FileListExample';
import { useAuth } from '../lib/useAuth';

export default function ApiDemo() {
  const [activeTab, setActiveTab] = useState('events');
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold mb-4">API Demo</h1>
        <p className="text-center">Please log in to view the API demo.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">API Demo</h1>
      <p className="mb-6">This page demonstrates the usage of the API service to interact with the backend.</p>
      
      {/* Tab Navigation */}
      <div className="border-b border-border mb-6">
        <nav className="flex space-x-8">
          <button 
            onClick={() => setActiveTab('events')}
            className={`py-3 border-b-2 font-medium text-sm ${
              activeTab === 'events' ? 'border-primary' : 'border-transparent hover:border-border'
            }`}
          >
            Events
          </button>
          <button 
            onClick={() => setActiveTab('proposals')}
            className={`py-3 border-b-2 font-medium text-sm ${
              activeTab === 'proposals' ? 'border-primary' : 'border-transparent hover:border-border'
            }`}
          >
            Proposals
          </button>
          <button 
            onClick={() => setActiveTab('files')}
            className={`py-3 border-b-2 font-medium text-sm ${
              activeTab === 'files' ? 'border-primary' : 'border-transparent hover:border-border'
            }`}
          >
            Files
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="py-4">
        {activeTab === 'events' && (
          <div>
            <div className="mb-8 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">API Usage Example</h3>
              <pre className="text-xs overflow-x-auto p-2 bg-background rounded border border-border">
                {`// Get approved events
const events = await api.events.getAllEvents({ status: 'approved' });

// Get a single event
const event = await api.events.getEventById(eventId);

// Create a new event
const newEvent = await api.events.createEvent({
  title: "New Event",
  description: "Event description",
  start_time: "2023-06-15T18:00:00Z",
  end_time: "2023-06-15T20:00:00Z"
});`}
              </pre>
            </div>
            <EventListExample />
          </div>
        )}
        
        {activeTab === 'proposals' && (
          <div>
            <div className="mb-8 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">API Usage Example</h3>
              <pre className="text-xs overflow-x-auto p-2 bg-background rounded border border-border">
                {`// Get draft events (proposals)
const proposals = await api.events.getProposals();

// Approve a proposal
await api.events.approveEvent(proposalId);

// Update a proposal
await api.events.updateEvent(proposalId, { 
  title: "Updated Title",
  description: "Updated description"
});

// Delete a proposal
await api.events.deleteEvent(proposalId);`}
              </pre>
            </div>
            <ProposalListExample />
          </div>
        )}
        
        {activeTab === 'files' && (
          <div>
            <div className="mb-8 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">API Usage Example</h3>
              <pre className="text-xs overflow-x-auto p-2 bg-background rounded border border-border">
                {`// Upload a file
const fileInput = document.querySelector('input[type="file"]');
if (fileInput.files.length > 0) {
  const response = await api.files.uploadFile(fileInput.files[0]);
}

// Delete a file
await api.files.deleteFile(fileId);`}
              </pre>
            </div>
            <FileListExample />
          </div>
        )}
      </div>
    </div>
  );
}

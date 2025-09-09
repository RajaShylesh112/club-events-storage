import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../lib/auth';
import api, { File as FileModel } from '../../lib/api';

interface FileListProps {
  eventId?: string; // Optional - if provided, only files for this event will be shown
}

export default function FileListExample({ eventId }: FileListProps) {
  const [files, setFiles] = useState<FileModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isAuthenticated } = useAuth();
  
  // Function to fetch files
  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      // In a real implementation, you would have an API endpoint to get files by event ID
      // For this example, we'll show a placeholder implementation
      const response = await fetch(`http://localhost:8000/files${eventId ? `?event_id=${eventId}` : ''}`);
      if (!response.ok) throw new Error('Failed to fetch files');
      const fetchedFiles = await response.json();
      setFiles(fetchedFiles);
    } catch (err) {
      console.error('Failed to fetch files:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [eventId]);
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchFiles();
    }
  }, [isAuthenticated, fetchFiles]);
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setUploading(true);
    
    try {
      const response = await api.files.uploadFile(file);
      console.log('File uploaded:', response);
      // Refresh files list
      fetchFiles();
    } catch (err) {
      console.error('Failed to upload file:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleDeleteFile = async (fileId: string) => {
    try {
      await api.files.deleteFile(fileId);
      // Refresh files list
      fetchFiles();
    } catch (err) {
      console.error('Failed to delete file:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };
  
  if (!isAuthenticated) {
    return <div>Please log in to view files</div>;
  }
  
  if (loading) {
    return <div>Loading files...</div>;
  }
  
  if (error) {
    return <div>Error loading files: {error}</div>;
  }
  
  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };
  
  // Helper function to get icon based on file type
  const getFileIcon = (fileType: string): string => {
    if (fileType.includes('image')) return '📷';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('excel') || fileType.includes('sheet')) return '📊';
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return '📊';
    return '📁';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Files</h2>
        
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`inline-block px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </label>
        </div>
      </div>
      
      {files.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">No files have been uploaded yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {files.map((file) => (
            <div key={file._id} className="p-4 rounded-lg border border-border bg-card flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-2xl mr-3">
                  {getFileIcon(file.mime_type)}
                </div>
                <div>
                  <p className="font-medium">{file.filename}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)} • {new Date(file.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  className="p-2 text-sm rounded-md hover:bg-muted transition-colors"
                  onClick={() => window.open(`http://localhost:8000/files/${file._id}`, '_blank')}
                >
                  View
                </button>
                
                <button 
                  className="p-2 text-sm text-red-500 rounded-md hover:bg-red-50 transition-colors"
                  onClick={() => handleDeleteFile(file._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Download, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface Photo {
  id: string;
  url: string;
  filename: string;
  caption?: string;
  uploadedBy: string;
  uploadedAt: string;
}

// Mock photos data
const mockPhotos: Photo[] = [
  {
    id: "1",
    url: "/api/placeholder/400/300",
    filename: "opening_ceremony_1.jpg",
    caption: "Opening ceremony with keynote speaker",
    uploadedBy: "John Doe",
    uploadedAt: "2024-03-15"
  },
  {
    id: "2", 
    url: "/api/placeholder/400/300",
    filename: "tech_demo_2.jpg",
    caption: "Students demonstrating AI projects",
    uploadedBy: "Jane Smith",
    uploadedAt: "2024-03-16"
  },
  {
    id: "3",
    url: "/api/placeholder/400/300", 
    filename: "workshop_3.jpg",
    caption: "Hands-on coding workshop session",
    uploadedBy: "Mike Johnson",
    uploadedAt: "2024-03-16"
  },
  {
    id: "4",
    url: "/api/placeholder/400/300",
    filename: "awards_ceremony_4.jpg",
    caption: "Award ceremony for winners",
    uploadedBy: "Sarah Wilson", 
    uploadedAt: "2024-03-17"
  },
  {
    id: "5",
    url: "/api/placeholder/400/300",
    filename: "group_photo_5.jpg",
    caption: "Team photo of all participants",
    uploadedBy: "Alex Brown",
    uploadedAt: "2024-03-17"
  },
  {
    id: "6",
    url: "/api/placeholder/400/300",
    filename: "exhibition_6.jpg", 
    caption: "Project exhibition displays",
    uploadedBy: "Lisa Davis",
    uploadedAt: "2024-03-16"
  }
];

interface PhotoGalleryProps {
  eventId?: string;
  canUpload: boolean;
}

export const PhotoGallery = ({ eventId, canUpload }: PhotoGalleryProps) => {
  const [photos] = useState<Photo[]>(mockPhotos);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const previousPhoto = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1;
    setCurrentIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  };

  const nextPhoto = () => {
    const newIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  };

  const downloadPhoto = (photo: Photo) => {
    // Mock download functionality
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = photo.filename;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Photo Gallery</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {photos.length} photos available
              </p>
            </div>
            {canUpload && (
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Photos
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Photo Grid */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <Card 
              key={photo.id} 
              className="group cursor-pointer overflow-hidden shadow-card hover:shadow-elegant transition-all duration-300"
              onClick={() => openLightbox(photo, index)}
            >
              <div className="aspect-square relative">
                <img
                  src={photo.url}
                  alt={photo.caption || photo.filename}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                  <Maximize2 className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadPhoto(photo);
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium truncate">{photo.caption || photo.filename}</p>
                <p className="text-xs text-muted-foreground">
                  by {photo.uploadedBy} • {photo.uploadedAt}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-lg font-semibold mb-2">No photos yet</h3>
            <p className="text-muted-foreground mb-4">
              {canUpload 
                ? "Be the first to upload photos from this event"
                : "Photos will appear here once uploaded by organizers"
              }
            </p>
            {canUpload && (
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Upload First Photo
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Lightbox Modal */}
      <Dialog open={!!selectedPhoto} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-4xl w-full p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedPhoto?.caption || selectedPhoto?.filename}</span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => selectedPhoto && downloadPhoto(selectedPhoto)}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={closeLightbox}
                  className="p-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedPhoto && (
            <div className="relative">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption || selectedPhoto.filename}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              
              {/* Navigation */}
              <Button
                size="sm"
                variant="ghost"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2"
                onClick={previousPhoto}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                size="sm"
                variant="ghost" 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2"
                onClick={nextPhoto}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>

              {/* Photo Info */}
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{selectedPhoto.filename}</p>
                    {selectedPhoto.caption && (
                      <p className="text-muted-foreground mt-1">{selectedPhoto.caption}</p>
                    )}
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>Uploaded by {selectedPhoto.uploadedBy}</p>
                    <p>{selectedPhoto.uploadedAt}</p>
                    <p className="mt-2">{currentIndex + 1} of {photos.length}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, File, FileSpreadsheet, Presentation, Archive, Image } from "lucide-react";

interface OtherFile {
  id: string;
  name: string;
  type: "spreadsheet" | "presentation" | "archive" | "document" | "image" | "other";
  description?: string;
  uploadedBy: string;
  uploadedAt: string;
  fileSize: string;
  downloadUrl: string;
  mimeType: string;
}

// Mock other files data
const mockOtherFiles: OtherFile[] = [
  {
    id: "1",
    name: "Participant_Registration_List.xlsx",
    type: "spreadsheet",
    description: "Complete list of registered participants with contact details",
    uploadedBy: "Registration Team",
    uploadedAt: "2024-03-15",
    fileSize: "2.1 MB",
    downloadUrl: "/files/registration_list.xlsx",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  },
  {
    id: "2",
    name: "Event_Presentation_Slides.pptx", 
    type: "presentation",
    description: "Opening ceremony presentation slides",
    uploadedBy: "Event Committee",
    uploadedAt: "2024-03-14",
    fileSize: "15.7 MB",
    downloadUrl: "/files/presentation_slides.pptx",
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  },
  {
    id: "3",
    name: "Event_Resources_Archive.zip",
    type: "archive",
    description: "Compressed archive containing all workshop materials and resources",
    uploadedBy: "Workshop Coordinators", 
    uploadedAt: "2024-03-18",
    fileSize: "45.3 MB",
    downloadUrl: "/files/resources_archive.zip",
    mimeType: "application/zip"
  },
  {
    id: "4",
    name: "Venue_Floor_Plan.pdf",
    type: "document", 
    description: "Detailed floor plan of the event venue with room assignments",
    uploadedBy: "Logistics Team",
    uploadedAt: "2024-03-12",
    fileSize: "892 KB", 
    downloadUrl: "/files/venue_floor_plan.pdf",
    mimeType: "application/pdf"
  },
  {
    id: "5",
    name: "Sponsor_Logos_Pack.zip",
    type: "archive",
    description: "High-resolution logos of all event sponsors",
    uploadedBy: "Marketing Team",
    uploadedAt: "2024-03-10", 
    fileSize: "8.4 MB",
    downloadUrl: "/files/sponsor_logos.zip",
    mimeType: "application/zip"
  },
  {
    id: "6",
    name: "Budget_Breakdown.xlsx",
    type: "spreadsheet",
    description: "Detailed budget allocation and expense tracking",
    uploadedBy: "Finance Team",
    uploadedAt: "2024-03-20",
    fileSize: "1.3 MB",
    downloadUrl: "/files/budget_breakdown.xlsx", 
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  }
];

interface OtherFilesProps {
  eventId?: string;
  canUpload: boolean;
}

export const OtherFiles = ({ eventId, canUpload }: OtherFilesProps) => {
  const [otherFiles] = useState<OtherFile[]>(mockOtherFiles);

  const getFileIcon = (type: string) => {
    switch (type) {
      case "spreadsheet":
        return <FileSpreadsheet className="h-6 w-6 text-success" />;
      case "presentation":
        return <Presentation className="h-6 w-6 text-warning" />;
      case "archive":
        return <Archive className="h-6 w-6 text-accent" />;
      case "image":
        return <Image className="h-6 w-6 text-primary" />;
      case "document":
        return <File className="h-6 w-6 text-destructive" />;
      default:
        return <File className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case "spreadsheet":
        return "bg-success/10 text-success";
      case "presentation":
        return "bg-warning/10 text-warning";
      case "archive":
        return "bg-accent/10 text-accent";
      case "image":
        return "bg-primary/10 text-primary";
      case "document":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  const downloadFile = (file: OtherFile) => {
    // Mock download functionality
    console.log(`Downloading file: ${file.name}`);
    const link = document.createElement('a');
    link.href = file.downloadUrl;
    link.download = file.name;
    link.click();
  };

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toUpperCase() || 'FILE';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Other Files</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {otherFiles.length} miscellaneous files available
              </p>
            </div>
            {canUpload && (
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Upload File
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Files List */}
      {otherFiles.length > 0 ? (
        <div className="grid gap-4">
          {otherFiles.map((file) => (
            <Card key={file.id} className="shadow-card hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-muted/10">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{file.name}</h3>
                        <Badge className={getFileTypeColor(file.type)}>
                          {getFileExtension(file.name)}
                        </Badge>
                      </div>
                      {file.description && (
                        <p className="text-muted-foreground text-sm">
                          {file.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>By {file.uploadedBy}</span>
                        <span>•</span>
                        <span>{file.uploadedAt}</span>
                        <span>•</span>
                        <span>{file.fileSize}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => downloadFile(file)}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-lg font-semibold mb-2">No files yet</h3>
            <p className="text-muted-foreground mb-4">
              {canUpload 
                ? "Upload presentations, spreadsheets, and other event files"
                : "Files will appear here once uploaded by organizers"
              }
            </p>
            {canUpload && (
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Upload File
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
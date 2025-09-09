import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, FileText, BarChart, Clock } from "lucide-react";

interface FeedbackForm {
  id: string;
  title: string;
  type: "survey_export" | "response_data" | "analysis_report";
  description: string;
  responseCount: number;
  collectionPeriod: string;
  uploadedBy: string;
  uploadedAt: string;
  fileSize: string;
  downloadUrl: string;
}

// Mock feedback forms data
const mockFeedbackForms: FeedbackForm[] = [
  {
    id: "1",
    title: "Post-Event Feedback Survey",
    type: "survey_export",
    description: "Complete export of participant feedback responses including ratings and comments.",
    responseCount: 387,
    collectionPeriod: "March 17-20, 2024",
    uploadedBy: "Survey Team",
    uploadedAt: "2024-03-21",
    fileSize: "1.2 MB",
    downloadUrl: "/feedback/survey_export.xlsx"
  },
  {
    id: "2",
    title: "Workshop Satisfaction Responses",
    type: "response_data",
    description: "Raw response data from workshop satisfaction forms collected during the event.",
    responseCount: 234,
    collectionPeriod: "March 16-17, 2024", 
    uploadedBy: "Workshop Coordinators",
    uploadedAt: "2024-03-18",
    fileSize: "892 KB",
    downloadUrl: "/feedback/workshop_responses.csv"
  },
  {
    id: "3",
    title: "Feedback Analysis Summary", 
    type: "analysis_report",
    description: "Statistical analysis and insights derived from all feedback forms with recommendations.",
    responseCount: 387,
    collectionPeriod: "March 17-20, 2024",
    uploadedBy: "Data Analytics Team",
    uploadedAt: "2024-03-22",
    fileSize: "2.1 MB", 
    downloadUrl: "/feedback/analysis_summary.pdf"
  },
  {
    id: "4",
    title: "Speaker Evaluation Forms",
    type: "response_data",
    description: "Evaluation forms filled by participants for each keynote speaker and presenter.",
    responseCount: 298,
    collectionPeriod: "March 15-17, 2024",
    uploadedBy: "Program Committee", 
    uploadedAt: "2024-03-19",
    fileSize: "654 KB",
    downloadUrl: "/feedback/speaker_evaluations.xlsx"
  },
  {
    id: "5",
    title: "Event Organization Feedback",
    type: "survey_export",
    description: "Feedback specifically about event organization, logistics, and overall experience.",
    responseCount: 342,
    collectionPeriod: "March 17-19, 2024", 
    uploadedBy: "Organization Team",
    uploadedAt: "2024-03-20",
    fileSize: "981 KB",
    downloadUrl: "/feedback/organization_feedback.xlsx"
  }
];

interface FeedbackFormsProps {
  eventId?: string;
  canUpload: boolean;
}

export const FeedbackForms = ({ eventId, canUpload }: FeedbackFormsProps) => {
  const [feedbackForms] = useState<FeedbackForm[]>(mockFeedbackForms);

  const getFormTypeColor = (type: string) => {
    switch (type) {
      case "survey_export":
        return "bg-primary/10 text-primary";
      case "response_data":
        return "bg-success/10 text-success";
      case "analysis_report":
        return "bg-accent/10 text-accent";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  const getFormTypeIcon = (type: string) => {
    switch (type) {
      case "survey_export":
        return <FileText className="h-5 w-5 text-primary" />;
      case "response_data":
        return <BarChart className="h-5 w-5 text-success" />;
      case "analysis_report":
        return <FileText className="h-5 w-5 text-accent" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const downloadForm = (form: FeedbackForm) => {
    // Mock download functionality
    console.log(`Downloading feedback form: ${form.title}`);
    const link = document.createElement('a');
    link.href = form.downloadUrl;
    link.download = form.title.replace(/\s+/g, '_').toLowerCase() + getFileExtension(form.downloadUrl);
    link.click();
  };

  const getFileExtension = (url: string) => {
    return url.substring(url.lastIndexOf('.'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Feedback Forms</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {feedbackForms.length} feedback files available
              </p>
            </div>
            {canUpload && (
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Feedback Data
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Feedback Forms List */}
      {feedbackForms.length > 0 ? (
        <div className="grid gap-4">
          {feedbackForms.map((form) => (
            <Card key={form.id} className="shadow-card hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-muted/10">
                        {getFormTypeIcon(form.type)}
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{form.title}</h3>
                          <Badge className={getFormTypeColor(form.type)}>
                            {form.type.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {form.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => downloadForm(form)}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                  
                  {/* Statistics and Meta */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <BarChart className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">{form.responseCount}</span> responses
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Period:</span> {form.collectionPeriod}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Uploaded:</span> {form.uploadedAt} by {form.uploadedBy}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>File size: {form.fileSize}</span>
                    <span>Format: {getFileExtension(form.downloadUrl).substring(1).toUpperCase()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-semibold mb-2">No feedback data yet</h3>
            <p className="text-muted-foreground mb-4">
              {canUpload 
                ? "Upload feedback forms and survey data"
                : "Feedback data will appear here once uploaded by organizers"
              }
            </p>
            {canUpload && (
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Feedback Data
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
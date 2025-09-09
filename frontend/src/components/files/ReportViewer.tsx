import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Download, FileText, Eye, X } from "lucide-react";

interface Report {
  id: string;
  title: string;
  type: "event_summary" | "financial" | "feedback_analysis" | "attendance";
  description: string;
  uploadedBy: string;
  uploadedAt: string;
  fileSize: string;
  downloadUrl: string;
  previewUrl?: string;
}

// Mock reports data
const mockReports: Report[] = [
  {
    id: "1",
    title: "Tech Fest 2024 - Event Summary Report",
    type: "event_summary",
    description: "Comprehensive overview of the event including highlights, participation statistics, and outcomes.",
    uploadedBy: "Event Coordinator",
    uploadedAt: "2024-03-18",
    fileSize: "2.4 MB",
    downloadUrl: "/reports/event_summary.pdf",
    previewUrl: "/reports/preview/event_summary.pdf"
  },
  {
    id: "2",
    title: "Financial Expense Report",
    type: "financial", 
    description: "Detailed breakdown of event expenses including venue, catering, prizes, and logistics costs.",
    uploadedBy: "Finance Team",
    uploadedAt: "2024-03-19",
    fileSize: "1.8 MB", 
    downloadUrl: "/reports/financial.pdf",
    previewUrl: "/reports/preview/financial.pdf"
  },
  {
    id: "3",
    title: "Participant Feedback Analysis",
    type: "feedback_analysis",
    description: "Analysis of participant feedback forms with insights and recommendations for future events.",
    uploadedBy: "Research Team",
    uploadedAt: "2024-03-20",
    fileSize: "3.1 MB",
    downloadUrl: "/reports/feedback_analysis.pdf",
    previewUrl: "/reports/preview/feedback_analysis.pdf"
  },
  {
    id: "4", 
    title: "Attendance and Registration Report",
    type: "attendance",
    description: "Daily attendance figures, registration statistics, and demographic breakdown of participants.",
    uploadedBy: "Registration Team", 
    uploadedAt: "2024-03-18",
    fileSize: "892 KB",
    downloadUrl: "/reports/attendance.pdf", 
    previewUrl: "/reports/preview/attendance.pdf"
  }
];

interface ReportViewerProps {
  eventId?: string;
  canUpload: boolean;
}

export const ReportViewer = ({ eventId, canUpload }: ReportViewerProps) => {
  const [reports] = useState<Report[]>(mockReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case "event_summary":
        return "bg-primary/10 text-primary";
      case "financial":
        return "bg-success/10 text-success";
      case "feedback_analysis":
        return "bg-accent/10 text-accent";
      case "attendance":
        return "bg-warning/10 text-warning";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  const downloadReport = (report: Report) => {
    // Mock download functionality
    console.log(`Downloading report: ${report.title}`);
    const link = document.createElement('a');
    link.href = report.downloadUrl;
    link.download = report.title.replace(/\s+/g, '_').toLowerCase() + '.pdf';
    link.click();
  };

  const previewReport = (report: Report) => {
    setSelectedReport(report);
  };

  const closePreview = () => {
    setSelectedReport(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Reports</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {reports.length} reports available
              </p>
            </div>
            {canUpload && (
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Report
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Reports List */}
      {reports.length > 0 ? (
        <div className="grid gap-4">
          {reports.map((report) => (
            <Card key={report.id} className="shadow-card hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{report.title}</h3>
                        <Badge className={getReportTypeColor(report.type)}>
                          {report.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {report.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>By {report.uploadedBy}</span>
                        <span>•</span>
                        <span>{report.uploadedAt}</span>
                        <span>•</span>
                        <span>{report.fileSize}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {report.previewUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => previewReport(report)}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          Preview
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm" 
                        onClick={() => downloadReport(report)}
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-semibold mb-2">No reports yet</h3>
            <p className="text-muted-foreground mb-4">
              {canUpload 
                ? "Upload event reports and documentation"
                : "Reports will appear here once uploaded by organizers"
              }
            </p>
            {canUpload && (
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Report
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* PDF Preview Modal */}
      <Dialog open={!!selectedReport} onOpenChange={closePreview}>
        <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5" />
                <span>{selectedReport?.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => selectedReport && downloadReport(selectedReport)}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={closePreview}
                  className="p-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedReport && (
            <div className="flex-1 p-6 pt-0">
              <div className="w-full h-full bg-muted/10 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-4">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto" />
                  <div>
                    <p className="font-medium">PDF Preview</p>
                    <p className="text-sm text-muted-foreground">
                      PDF viewer would be embedded here in a real application
                    </p>
                    <Button
                      className="mt-4 gap-2"
                      onClick={() => downloadReport(selectedReport)}
                    >
                      <Download className="h-4 w-4" />
                      Download to View
                    </Button>
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
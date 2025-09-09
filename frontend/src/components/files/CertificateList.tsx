import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, FileText, Award, Users, User } from "lucide-react";

interface Certificate {
  id: string;
  name: string;
  type: "participation" | "achievement" | "completion";
  recipient?: string;
  issuedDate: string;
  downloadUrl: string;
  fileSize: string;
}

// Mock certificates data
const mockCertificates: Certificate[] = [
  {
    id: "1",
    name: "Tech Fest 2024 - Participation Certificate",
    type: "participation",
    issuedDate: "2024-03-17",
    downloadUrl: "/certificates/participation.pdf",
    fileSize: "245 KB"
  },
  {
    id: "2", 
    name: "Best Innovation Award - AI Category",
    type: "achievement",
    recipient: "Team Alpha",
    issuedDate: "2024-03-17", 
    downloadUrl: "/certificates/innovation_award.pdf",
    fileSize: "312 KB"
  },
  {
    id: "3",
    name: "Workshop Completion - Machine Learning",
    type: "completion",
    recipient: "All Attendees",
    issuedDate: "2024-03-16",
    downloadUrl: "/certificates/ml_workshop.pdf", 
    fileSize: "198 KB"
  },
  {
    id: "4",
    name: "First Prize - Hackathon Competition",
    type: "achievement", 
    recipient: "Team Innovators",
    issuedDate: "2024-03-17",
    downloadUrl: "/certificates/first_prize.pdf",
    fileSize: "287 KB"
  },
  {
    id: "5",
    name: "Judge Appreciation Certificate", 
    type: "participation",
    recipient: "Dr. Sarah Johnson",
    issuedDate: "2024-03-17",
    downloadUrl: "/certificates/judge_cert.pdf",
    fileSize: "156 KB"
  }
];

interface CertificateListProps {
  eventId?: string;
  canUpload: boolean;
}

export const CertificateList = ({ eventId, canUpload }: CertificateListProps) => {
  const [certificates] = useState<Certificate[]>(mockCertificates);

  const getCertificateIcon = (type: string) => {
    switch (type) {
      case "achievement":
        return <Award className="h-5 w-5 text-warning" />;
      case "completion":
        return <FileText className="h-5 w-5 text-success" />;
      case "participation":
        return <Users className="h-5 w-5 text-primary" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getCertificateTypeColor = (type: string) => {
    switch (type) {
      case "achievement":
        return "bg-warning/10 text-warning";
      case "completion": 
        return "bg-success/10 text-success";
      case "participation":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  const downloadCertificate = (certificate: Certificate) => {
    // Mock download functionality
    console.log(`Downloading certificate: ${certificate.name}`);
    const link = document.createElement('a');
    link.href = certificate.downloadUrl;
    link.download = certificate.name.replace(/\s+/g, '_').toLowerCase() + '.pdf';
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Certificates</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {certificates.length} certificates available for download
              </p>
            </div>
            {canUpload && (
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Certificate
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Certificates List */}
      {certificates.length > 0 ? (
        <div className="grid gap-4">
          {certificates.map((certificate) => (
            <Card key={certificate.id} className="shadow-card hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-muted/10">
                      {getCertificateIcon(certificate.type)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{certificate.name}</h3>
                        <Badge className={getCertificateTypeColor(certificate.type)}>
                          {certificate.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {certificate.recipient && (
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {certificate.recipient}
                          </div>
                        )}
                        <span>Issued: {certificate.issuedDate}</span>
                        <span>{certificate.fileSize}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline" 
                    onClick={() => downloadCertificate(certificate)}
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
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-lg font-semibold mb-2">No certificates yet</h3>
            <p className="text-muted-foreground mb-4">
              {canUpload 
                ? "Upload certificates for participants and winners"
                : "Certificates will appear here once uploaded by organizers"
              }
            </p>
            {canUpload && (
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Certificate
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Edit, 
  Trash2,
  User
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Proposal {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  category: string;
}

const mockProposals: Proposal[] = [
  {
    id: "1",
    title: "Annual Tech Fest 2024",
    description: "A comprehensive technology festival featuring workshops, competitions, and industry talks.",
    author: "Sarah Chen",
    date: "2024-03-08",
    status: "approved",
    category: "Technical"
  },
  {
    id: "2",
    title: "Cultural Night - Diwali Celebration",
    description: "Traditional dance performances, music, and authentic cuisine celebration.",
    author: "Rajesh Kumar",
    date: "2024-03-01",
    status: "pending",
    category: "Cultural"
  },
  {
    id: "3",
    title: "Career Guidance Workshop",
    description: "Industry professionals sharing insights on career paths and job market trends.",
    author: "Emily Johnson",
    date: "2024-02-25",
    status: "pending",
    category: "Academic"
  },
  {
    id: "4",
    title: "Green Campus Initiative",
    description: "Environmental awareness program with tree plantation and waste management workshops.",
    author: "Michael Brown",
    date: "2024-02-20",
    status: "rejected",
    category: "Environmental"
  }
];

const Proposals = () => {
  const [userRole, setUserRole] = useState<string>("member");
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: "",
    description: "",
    category: ""
  });

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "member";
    setUserRole(role);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-success/10 text-success";
      case "pending":
        return "bg-warning/10 text-warning";
      case "rejected":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleCreateProposal = () => {
    if (!newProposal.title || !newProposal.description) return;

    const proposal: Proposal = {
      id: Date.now().toString(),
      title: newProposal.title,
      description: newProposal.description,
      author: userRole === "admin" ? "Administrator" : 
               userRole === "core" ? "Core Member" : "Member",
      date: new Date().toISOString().split('T')[0],
      status: "pending",
      category: newProposal.category || "General"
    };

    setProposals([proposal, ...proposals]);
    setNewProposal({ title: "", description: "", category: "" });
    setIsCreateDialogOpen(false);
  };

  const handleApprove = (id: string) => {
    setProposals(proposals.map(p => 
      p.id === id ? { ...p, status: "approved" as const } : p
    ));
  };

  const handleReject = (id: string) => {
    setProposals(proposals.map(p => 
      p.id === id ? { ...p, status: "rejected" as const } : p
    ));
  };

  const AdminView = () => (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            All Proposals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <Card key={proposal.id} className="border-2 border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{proposal.title}</h3>
                        <Badge className={getStatusColor(proposal.status)}>
                          {getStatusIcon(proposal.status)}
                          {proposal.status}
                        </Badge>
                        <Badge variant="outline">{proposal.category}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{proposal.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {proposal.author}
                        </div>
                        <div>Submitted: {new Date(proposal.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                    {proposal.status === "pending" && (
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleApprove(proposal.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleReject(proposal.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const CoreMemberView = () => {
    const userProposals = proposals.filter(p => 
      p.author === "Core Member" || p.author === "Sarah Chen" || p.author === "Emily Johnson"
    );

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">My Proposals</h2>
            <p className="text-muted-foreground">Create and manage your event proposals</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Create Proposal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Proposal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newProposal.title}
                    onChange={(e) => setNewProposal({...newProposal, title: e.target.value})}
                    placeholder="Enter proposal title"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newProposal.category}
                    onChange={(e) => setNewProposal({...newProposal, category: e.target.value})}
                    placeholder="e.g., Technical, Cultural, Academic"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProposal.description}
                    onChange={(e) => setNewProposal({...newProposal, description: e.target.value})}
                    placeholder="Describe your proposal in detail"
                    rows={4}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleCreateProposal} className="flex-1">
                    Submit Proposal
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{userProposals.length}</div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {userProposals.filter(p => p.status === "approved").length}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {userProposals.filter(p => p.status === "pending").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Proposal History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userProposals.map((proposal) => (
                <Card key={proposal.id} className="border border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{proposal.title}</h4>
                          <Badge className={getStatusColor(proposal.status)}>
                            {getStatusIcon(proposal.status)}
                            {proposal.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {proposal.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Submitted: {new Date(proposal.date).toLocaleDateString()}
                        </p>
                      </div>
                      {proposal.status === "pending" && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const MemberView = () => (
    <Card className="shadow-card">
      <CardContent className="p-12 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold mb-2">Proposal Submission</h3>
        <p className="text-muted-foreground mb-6">
          Only Core Members and Administrators can create and manage proposals.
        </p>
        <p className="text-sm text-muted-foreground">
          If you have an event idea, please contact a Core Member or Administrator.
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Proposals</h1>
        <p className="text-muted-foreground">
          {userRole === "admin" 
            ? "Review and manage all event proposals" 
            : userRole === "core"
            ? "Create and track your event proposals"
            : "View proposal system information"}
        </p>
      </div>

      {userRole === "admin" && <AdminView />}
      {userRole === "core" && <CoreMemberView />}
      {userRole === "member" && <MemberView />}
    </div>
  );
};

export default Proposals;
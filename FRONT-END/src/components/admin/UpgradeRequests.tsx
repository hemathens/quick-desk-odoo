import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck } from "lucide-react";

export default function UpgradeRequests() {
  return (
    <Card className="card-elegant">
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserCheck className="w-5 h-5 mr-2 text-primary" />
          Upgrade Requests
        </CardTitle>
        <CardDescription>Review and approve role upgrade requests.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <UserCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Upgrade Requests</h3>
          <p className="text-muted-foreground">Upgrade requests management interface coming soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
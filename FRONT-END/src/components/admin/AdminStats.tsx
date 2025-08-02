import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function AdminStats() {
  return (
    <Card className="card-elegant">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-primary" />
          Analytics & Reports
        </CardTitle>
        <CardDescription>View detailed analytics and generate reports.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
          <p className="text-muted-foreground">Advanced analytics and reporting coming soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
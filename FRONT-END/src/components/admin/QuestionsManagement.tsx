import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

export default function QuestionsManagement() {
  return (
    <Card className="card-elegant">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="w-5 h-5 mr-2 text-primary" />
          Questions Management
        </CardTitle>
        <CardDescription>Manage and moderate questions and answers.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Questions Management</h3>
          <p className="text-muted-foreground">Questions management interface coming soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
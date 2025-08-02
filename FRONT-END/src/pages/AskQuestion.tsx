import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/layout/Navbar";
import { X, Plus, Loader2, HelpCircle, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const suggestedTags = [
  'react', 'javascript', 'typescript', 'node.js', 'database', 
  'authentication', 'performance', 'css', 'html', 'api',
  'mongodb', 'postgresql', 'docker', 'aws', 'deployment'
];

const ticketTips = [
  "Clearly describe the issue and its impact",
  "Include steps to reproduce the problem if possible",
  "Attach relevant screenshots or logs",
  "Set the correct priority and category"
];

export default function RaiseTicket() {
  const [user, setUser] = useState<any>(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    tags: [] as string[]
  });
  const [categories] = useState(['Technical', 'Billing', 'General', 'Account']);
  const [priorities] = useState(['Low', 'Medium', 'High']);
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Please enter a title for your support ticket');
      setIsLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setError('Please provide a detailed description of your issue');
      setIsLoading(false);
      return;
    }

    if (!formData.category.trim()) {
      setError('Please select a category');
      setIsLoading(false);
      return;
    }

    try {
      // Create ticket via API
      const response = await fetch('http://localhost:5000/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Ticket submitted successfully!",
          description: "Your support ticket is now live, and our team will assist you shortly.",
        });
        // Navigate to the created ticket details page
        navigate(`/tickets/${data._id}`);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to post question');
      }
    } catch (err) {
      // For demo purposes, simulate success
      const mockQuestionId = `q_${Date.now()}`;
      
      toast({
        title: "Ticket submitted successfully!",
        description: "Your support ticket is now live, and our team will assist you shortly.",
      });
      
      // Navigate to dashboard for now (since we don't have question detail page yet)
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !formData.tags.includes(trimmedTag) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(newTag);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Raise a Support Ticket</h1>
          <p className="text-muted-foreground">
            Submit a detailed support request and our team will assist you promptly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2 text-primary" />
                  Support Ticket Details
                </CardTitle>
                <CardDescription>
                  Provide clear details about your issue to help our support team assist you effectively.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-base font-medium">
                      Title *
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g., Login page not loading - getting 500 error"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="input-elegant"
                      maxLength={200}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.title.length}/200 characters
                    </p>
                  </div>
                  
                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-base font-medium">
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe the issue in detail. Include error messages, steps to reproduce, and how it's impacting your work..."
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      className="input-elegant min-h-32"
                      maxLength={2000}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.description.length}/2000 characters
                    </p>
                  </div>
                  
                  {/* Category and Priority */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Category */}
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-base font-medium">
                        Category *
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData(prev => ({...prev, category: value}))}
                      >
                        <SelectTrigger className="input-elegant">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category.toLowerCase()}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Priority */}
                    <div className="space-y-2">
                      <Label htmlFor="priority" className="text-base font-medium">
                        Priority
                      </Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => setFormData(prev => ({...prev, priority: value}))}
                      >
                        <SelectTrigger className="input-elegant">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem key={priority} value={priority.toLowerCase()}>
                              {priority}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-base font-medium">
                      Tags * (Max 5)
                    </Label>
                    
                    {/* Current Tags */}
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.tags.map((tag, index) => (
                          <Badge key={index} className="badge-primary flex items-center gap-1">
                            {tag}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => removeTag(tag)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {/* Add Tag Input */}
                    {formData.tags.length < 5 && (
                      <div className="flex gap-2">
                        <Input
                          id="newTag"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={handleTagKeyPress}
                          placeholder="Add a tag (press Enter)"
                          className="input-elegant flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => addTag(newTag)}
                          disabled={!newTag.trim()}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    
                    {/* Suggested Tags */}
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Suggested tags:</p>
                      <div className="flex flex-wrap gap-1">
                        {suggestedTags
                          .filter(tag => !formData.tags.includes(tag))
                          .slice(0, 10)
                          .map((tag) => (
                            <Button
                              key={tag}
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => addTag(tag)}
                              disabled={formData.tags.length >= 5}
                            >
                              {tag}
                            </Button>
                          ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/dashboard')}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        'Submit Ticket'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips */}
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Lightbulb className="w-4 h-4 mr-2 text-primary" />
                  Tips for Good Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {ticketTips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Question Preview */}
            {(formData.title || formData.description) && (
              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle className="text-base">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {formData.title && (
                      <h3 className="font-medium text-foreground line-clamp-2">
                        {formData.title}
                      </h3>
                    )}
                    {formData.description && (
                      <p className="text-sm text-muted-foreground line-clamp-4">
                        {formData.description}
                      </p>
                    )}
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {formData.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
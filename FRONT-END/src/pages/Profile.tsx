import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/layout/Navbar";
import { 
  User, 
  Mail, 
  Globe, 
  Calendar, 
  Award, 
  ArrowUp, 
  MessageCircle, 
  Heart,
  Edit3,
  Save,
  X,
  Shield,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' }
];

const categories = [
  'Frontend Development', 'Backend Development', 'Mobile Development',
  'DevOps', 'Data Science', 'Machine Learning', 'UI/UX Design',
  'Database', 'Cloud Computing', 'Cybersecurity'
];

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    website: '',
    language: 'en',
    interests: [] as string[]
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Set form data with existing user info
    setFormData({
      name: parsedUser.name || '',
      bio: parsedUser.bio || '',
      location: parsedUser.location || '',
      website: parsedUser.website || '',
      language: parsedUser.language || 'en',
      interests: parsedUser.interests || []
    });
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user data in localStorage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgradeRequest = async () => {
    setUpgradeLoading(true);
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Upgrade request submitted",
        description: "Your request to become an agent has been submitted for review.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit upgrade request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUpgradeLoading(false);
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'badge-primary';
      case 'agent':
        return 'badge-success';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const mockStats = {
    questionsAsked: 12,
    questionsAnswered: 28,
    upvotesReceived: 156,
    reputation: 1240,
    memberSince: '2024-01-15'
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Card */}
            <Card className="card-elegant animate-slide-up">
              <CardContent className="p-6 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {user.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
                <p className="text-muted-foreground mb-3">{user.email}</p>
                
                <Badge className={`${getRoleBadgeClass(user.role)} mb-4`}>
                  <Shield className="w-3 h-3 mr-1" />
                  {user.role}
                </Badge>
                
                {user.role === 'user' && (
                  <Button 
                    className="btn-outline w-full"
                    onClick={handleUpgradeRequest}
                    disabled={upgradeLoading}
                  >
                    {upgradeLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <ArrowUp className="w-4 h-4 mr-2" />
                        Request Agent Status
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="card-elegant animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Award className="w-5 h-5 mr-2 text-primary" />
                  Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Questions Asked</span>
                  <span className="font-medium">{mockStats.questionsAsked}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Questions Answered</span>
                  <span className="font-medium">{mockStats.questionsAnswered}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Upvotes Received</span>
                  <span className="font-medium flex items-center">
                    <Heart className="w-3 h-3 mr-1 text-red-500" />
                    {mockStats.upvotesReceived}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Reputation</span>
                  <span className="font-bold text-primary">{mockStats.reputation}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Member Since</span>
                  <span className="font-medium">{new Date(mockStats.memberSince).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card className="card-elegant animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      <User className="w-5 h-5 mr-2 text-primary" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Update your profile information and preferences.
                    </CardDescription>
                  </div>
                  <Button
                    variant={isEditing ? "outline" : "default"}
                    onClick={isEditing ? () => setIsEditing(false) : () => setIsEditing(true)}
                    className={isEditing ? "" : "btn-outline"}
                  >
                    {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="input-elegant"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="e.g., San Francisco, CA"
                      value={formData.location}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="input-elegant"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="input-elegant min-h-24"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.bio.length}/500 characters
                  </p>
                </div>

                {/* Website and Language */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      placeholder="https://your-website.com"
                      value={formData.website}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="input-elegant"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    <Select 
                      value={formData.language} 
                      onValueChange={(value) => handleSelectChange('language', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="input-elegant">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border border-border">
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Interests */}
                <div className="space-y-2">
                  <Label>Areas of Interest</Label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge
                        key={category}
                        variant={formData.interests.includes(category) ? "default" : "outline"}
                        className={`cursor-pointer transition-all ${
                          formData.interests.includes(category) 
                            ? 'badge-primary' 
                            : 'hover:border-primary hover:text-primary'
                        } ${!isEditing ? 'cursor-default' : ''}`}
                        onClick={() => isEditing && handleInterestToggle(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isEditing ? 'Click to toggle interests' : `${formData.interests.length} selected`}
                  </p>
                </div>

                {/* Save Button */}
                {isEditing && (
                  <div className="flex justify-end pt-4">
                    <Button 
                      onClick={handleSave}
                      disabled={isLoading}
                      className="btn-primary"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
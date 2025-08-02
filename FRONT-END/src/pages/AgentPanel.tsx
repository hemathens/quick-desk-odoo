import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TicketCard from "@/components/cards/TicketCard";
import Navbar from "@/components/layout/Navbar";
import { 
  Search, 
  Filter, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  MessageSquare,
  TrendingUp,
  Users,
  Target,
  Timer
} from "lucide-react";

// Mock data for development
const mockStats = {
  openTickets: 12,
  resolvedToday: 5,
  avgResponseTime: '2.5h',
  satisfaction: '94%'
};

const mockQuestions = [
  {
    id: '1',
    title: 'Unable to login to account',
    description: 'I am having trouble logging into my account. It says invalid credentials.',
    author: { name: 'John Doe', email: 'john@example.com' },
    priority: 'high',
    status: 'open',
    tags: ['login', 'authentication'],
    upvotes: 3,
    answers: 1,
    assignedTo: null,
    createdAt: new Date().toISOString()
  }
];

export default function AgentPanel() {
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(mockStats);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [filteredQuestions, setFilteredQuestions] = useState(mockQuestions);

  const navigate = useNavigate();

  const fetchAgentData = async () => {
    try {
      const ticketsResponse = await fetch(`http://localhost:5000/dashboard/agent/tickets`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const statsResponse = await fetch(`http://localhost:5000/dashboard/agent/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const ticketsData = await ticketsResponse.json();
      const statsData = await statsResponse.json();

      setTickets(ticketsData || []);
      setStats(statsData || {});
    } catch (error) {
      console.error('Failed to fetch agent data:', error);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'agent' && parsedUser.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    setUser(parsedUser);
  }, [navigate]);

  useEffect(() => {
    if (user?.role === 'agent' || user?.role === 'admin') {
      fetchAgentData();
    }
  }, [user]);

  const handleAssignToSelf = async (ticketId: string) => {
    try {
      await fetch('http://localhost:5000/tickets/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ticketId })
      });
      fetchAgentData();
    } catch (error) {
      console.error('Failed to assign ticket:', error);
    }
  };

  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    try {
      await fetch(`http://localhost:5000/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      fetchAgentData();
    } catch (error) {
      console.error('Failed to update ticket status:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">Agent Panel</h1>
          <p className="text-muted-foreground">
            Manage and respond to support tickets and questions.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-elegant animate-slide-up">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Open Tickets</p>
                  <p className="text-2xl font-bold">{mockStats.openTickets}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elegant animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <div>
                  <p className="text-sm text-muted-foreground">Resolved Today</p>
                  <p className="text-2xl font-bold">{mockStats.resolvedToday}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elegant animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Timer className="w-5 h-5 text-warning" />
                <div>
                  <p className="text-sm text-muted-foreground">Avg Response</p>
                  <p className="text-2xl font-bold">{mockStats.avgResponseTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elegant animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Satisfaction</p>
                  <p className="text-2xl font-bold">{mockStats.satisfaction}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="card-elegant mb-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets, tags, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 input-elegant"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="answered">Answered</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border">
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tickets List */}
        <Card className="card-elegant animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-primary" />
              Support Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Tickets</TabsTrigger>
                <TabsTrigger value="assigned">Assigned to Me</TabsTrigger>
                <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="space-y-4">
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((question) => (
                    <div key={question.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-2">
                          <Badge className={`text-xs ${getPriorityColor(question.priority)}`}>
                            {question.priority} priority
                          </Badge>
                          {question.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          {!question.assignedTo && question.status === 'open' && (
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => handleAssignToSelf(question.id)}
                            >
                              Assign to Me
                            </Button>
                          )}
                          {question.assignedTo === user.email && (
                            <Select 
                              value={question.status} 
                              onValueChange={(value) => handleUpdateStatus(question.id, value)}
                            >
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-card border border-border">
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="answered">Answered</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-medium text-foreground mb-2 hover:text-primary cursor-pointer transition-colors">
                        {question.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {question.description}
                      </p>
                      
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <span>By {question.author.name}</span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(question.createdAt).toLocaleDateString()}
                          </span>
                          {question.assignedTo && (
                            <span className="text-primary">
                              Assigned to {question.assignedTo === user.email ? 'you' : question.assignedTo}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>{question.upvotes} upvotes</span>
                          <span>{question.answers} answers</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No tickets found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your filters or check back later for new tickets.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
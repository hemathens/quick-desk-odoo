import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TicketCard from "@/components/cards/TicketCard";
import Navbar from "@/components/layout/Navbar";
import { 
  Search, 
  Plus, 
  Filter, 
  TrendingUp, 
  MessageCircle, 
  Users, 
  Clock 
} from "lucide-react";

// Mock data
export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [filteredTickets, setFilteredTickets] = useState([]);

useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Fetch data according to the role
      const token = localStorage.getItem('token');
      const baseURL = 'http://localhost:5000';
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      let statsEndpoint;
      if (parsedUser.role === 'admin') {
        statsEndpoint = `${baseURL}/dashboard/admin/overview`;
      } else if (parsedUser.role === 'agent') {
        statsEndpoint = `${baseURL}/dashboard/agent/overview`;
      } else {
        statsEndpoint = `${baseURL}/dashboard/user/stats`;
      }
      
      // Fetch dashboard stats
      fetch(statsEndpoint, { headers })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Stats data:', data);
          setStats(data);
          // Don't set tickets from stats, get them separately
        })
        .catch(error => console.error('Error fetching stats:', error));
      
      // Fetch tickets separately
      fetch(`${baseURL}/dashboard/tickets`, { headers })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Tickets data:', data);
          setTickets(data.tickets || []);
        })
        .catch(error => console.error('Error fetching tickets:', error));
    }
  }, []);

  useEffect(() => {
    // Filter tickets based on search and filters
    let filtered = tickets;
    
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.tags.includes(selectedCategory));
    }
    
    // Sort tickets
    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => b.upvotes - a.upvotes);
    } else if (sortBy === 'unresolved') {
      filtered = filtered.filter(t => t.status === 'open');
    }
    
    setFilteredTickets(filtered);
  }, [tickets, searchQuery, selectedCategory, sortBy]);

  const handleVote = (ticketId: string, type: 'up' | 'down') => {
    // Handle voting logic here
    console.log(`Voted ${type} on ticket ${ticketId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-muted-foreground">
              Manage your support tickets and track their resolution status.
            </p>
          </div>
          <Link to="/ask">
            <Button className="btn-primary mt-4 sm:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              Raise Ticket
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-elegant">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {user?.role === 'admin' ? 'Total Tickets' : 
                     user?.role === 'agent' ? 'Assigned Tickets' : 'My Tickets'}
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.ticketCount || stats.assignedTickets || stats.myTickets || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elegant">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-success" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {user?.role === 'admin' ? 'Active Users' : 
                     user?.role === 'agent' ? 'Resolved Today' : 'My Questions'}
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.activeUsers || stats.resolvedToday || stats.myQuestions || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elegant">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-warning" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {user?.role === 'admin' ? 'Tickets Today' : 
                     user?.role === 'agent' ? 'Pending Tickets' : 'Open Tickets'}
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.ticketsToday || stats.pendingTickets || 
                     (stats.ticketsByStatus?.find(s => s._id === 'open')?.count) || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elegant">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {user?.role === 'admin' ? 'Avg Response' : 
                     user?.role === 'agent' ? 'Total Resolved' : 'Resolved Tickets'}
                  </p>
                  <p className="text-2xl font-bold">
                    {user?.role === 'admin' ? (stats.avgResponseTime || '0h') :
                     user?.role === 'agent' ? (stats.totalResolved || 0) :
                     (stats.ticketsByStatus?.find(s => s._id === 'resolved')?.count || 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="card-elegant mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets, tags, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 input-elegant"
                />
              </div>
              
              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="account">Account</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="unresolved">Unresolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tickets List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Support Tickets ({filteredTickets.length})
            </h2>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">
                {sortBy === 'recent' ? 'Recent' : sortBy === 'popular' ? 'Popular' : 'Unresolved'}
              </Badge>
              {selectedCategory !== 'all' && (
                <Badge className="badge-primary text-xs">
                  {selectedCategory}
                </Badge>
              )}
            </div>
          </div>

          {filteredTickets.length > 0 ? (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onVote={handleVote}
                  showActions={user?.email === ticket.author.name}
                />
              ))}
            </div>
          ) : (
            <Card className="card-elegant">
              <CardContent className="p-8 text-center">
                <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No tickets found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filters, or be the first to raise a ticket!
                </p>
                <Link to="/ask">
                  <Button className="btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Raise the first ticket
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Circle, 
  MoreHorizontal,
  User,
  Calendar,
  Tag,
  Bell,
  ArrowUpDown,
  Eye,
  MessageCircle,
  UserCheck
} from 'lucide-react';
import { mockAppData } from '../../mockApp';

const SupportAgentDashboard = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('my_tickets'); // 'my_tickets' or 'all_tickets'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updated_desc');

  // Get tickets based on active tab
  const getTickets = () => {
    if (activeTab === 'my_tickets') {
      return mockAppData.getTicketsByAgent(currentUser.id);
    }
    return mockAppData.tickets;
  };

  // Filter and sort tickets
  const filteredTickets = getTickets()
    .filter(ticket => {
      const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
      const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'created_desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'created_asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'updated_desc':
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case 'updated_asc':
          return new Date(a.updatedAt) - new Date(b.updatedAt);
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return 0;
      }
    });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <Circle className="w-4 h-4 text-sage-dusty" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-red-500 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Quick stats
  const myTicketsCount = mockAppData.getTicketsByAgent(currentUser.id).length;
  const openTicketsCount = mockAppData.getTicketsByStatus('open').length;
  const inProgressCount = mockAppData.getTicketsByStatus('in_progress').length;
  const todayTicketsCount = mockAppData.tickets.filter(ticket => 
    new Date(ticket.createdAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="dashboard-title-section">
          <h1 className="dashboard-title">Support Dashboard</h1>
          <p className="dashboard-subtitle">
            Manage and respond to customer support tickets
          </p>
        </div>
        
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-value">{myTicketsCount}</span>
            <span className="stat-label">My Tickets</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{openTicketsCount}</span>
            <span className="stat-label">Open</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{inProgressCount}</span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{todayTicketsCount}</span>
            <span className="stat-label">Today</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'my_tickets' ? 'active' : ''}`}
          onClick={() => setActiveTab('my_tickets')}
        >
          <UserCheck className="w-4 h-4 mr-2" />
          My Tickets ({myTicketsCount})
        </button>
        <button 
          className={`tab-button ${activeTab === 'all_tickets' ? 'active' : ''}`}
          onClick={() => setActiveTab('all_tickets')}
        >
          <Bell className="w-4 h-4 mr-2" />
          All Tickets ({mockAppData.tickets.length})
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="agent-filters">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search tickets by ID or subject..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-grid">
          <div className="filter-item">
            <Filter className="filter-icon" />
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          
          <div className="filter-item">
            <AlertCircle className="filter-icon" />
            <select
              className="filter-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div className="filter-item">
            <Tag className="filter-icon" />
            <select
              className="filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {mockAppData.categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-item">
            <ArrowUpDown className="filter-icon" />
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="updated_desc">Latest Updated</option>
              <option value="created_desc">Newest First</option>
              <option value="created_asc">Oldest First</option>
              <option value="priority">By Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="agent-tickets-list">
        {filteredTickets.length === 0 ? (
          <div className="empty-state">
            <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tickets found
            </h3>
            <p className="text-gray-600">
              {activeTab === 'my_tickets' 
                ? 'You have no assigned tickets matching the current filters'
                : 'No tickets match your current search and filter criteria'
              }
            </p>
          </div>
        ) : (
          <div className="agent-tickets-grid">
            {filteredTickets.map(ticket => (
              <div key={ticket.id} className="agent-ticket-card">
                <div className="ticket-card-header">
                  <div className="ticket-id-priority">
                    <span className="ticket-id">{ticket.id}</span>
                    <span className={`priority-badge ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  
                  <div className="ticket-status-actions">
                    <div className="ticket-status">
                      {getStatusIcon(ticket.status)}
                      <span className="status-label">
                        {mockAppData.ticketStatuses[ticket.status]?.label}
                      </span>
                    </div>
                    <button className="action-btn">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="ticket-card-content">
                  <h3 className="ticket-subject">{ticket.subject}</h3>
                  <p className="ticket-description">
                    {ticket.description.length > 100 
                      ? `${ticket.description.substring(0, 100)}...`
                      : ticket.description
                    }
                  </p>
                </div>
                
                <div className="ticket-card-meta">
                  <div className="meta-row">
                    <div className="meta-item">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{mockAppData.getUserById(ticket.createdBy)?.name}</span>
                    </div>
                    <div className="meta-item">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span>{ticket.category}</span>
                    </div>
                  </div>
                  
                  <div className="meta-row">
                    <div className="meta-item">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Created {formatDate(ticket.createdAt)}</span>
                    </div>
                    <div className="meta-item">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>Updated {formatDate(ticket.updatedAt)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="ticket-card-footer">
                  {ticket.responses.length > 0 && (
                    <div className="response-indicator">
                      <MessageCircle className="w-4 h-4" />
                      <span>{ticket.responses.length} response{ticket.responses.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  
                  <div className="ticket-actions">
                    {ticket.assignedTo !== currentUser.id && activeTab === 'all_tickets' && (
                      <button className="btn-secondary btn-sm">
                        Assign to Me
                      </button>
                    )}
                    <button className="btn-primary btn-sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View & Respond
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportAgentDashboard;
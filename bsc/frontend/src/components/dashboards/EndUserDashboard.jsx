import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Circle, 
  MoreHorizontal,
  Eye,
  MessageCircle
} from 'lucide-react';
import { mockAppData } from '../../mockApp';

const EndUserDashboard = ({ currentUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateTicket, setShowCreateTicket] = useState(false);

  // Get user's tickets
  const userTickets = mockAppData.getTicketsByUser(currentUser.id);
  
  // Filter tickets based on search and status
  const filteredTickets = userTickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
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
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="dashboard-title-section">
          <h1 className="dashboard-title">My Support Tickets</h1>
          <p className="dashboard-subtitle">
            Track and manage your support requests
          </p>
        </div>
        
        <button 
          className="btn-primary"
          onClick={() => setShowCreateTicket(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Ticket
        </button>
      </div>

      {/* Filters and Search */}
      <div className="dashboard-filters">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search tickets..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-container">
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
      </div>

      {/* Tickets List */}
      <div className="tickets-list">
        {filteredTickets.length === 0 ? (
          <div className="empty-state">
            <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery || statusFilter !== 'all' ? 'No matching tickets' : 'No tickets yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first support ticket to get started'
              }
            </p>
            {(!searchQuery && statusFilter === 'all') && (
              <button 
                className="btn-primary"
                onClick={() => setShowCreateTicket(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Ticket
              </button>
            )}
          </div>
        ) : (
          <div className="tickets-grid">
            {filteredTickets.map(ticket => (
              <div key={ticket.id} className="ticket-card">
                <div className="ticket-header">
                  <div className="ticket-id-status">
                    <span className="ticket-id">{ticket.id}</span>
                    <div className="ticket-status">
                      {getStatusIcon(ticket.status)}
                      <span className="status-label">
                        {mockAppData.ticketStatuses[ticket.status]?.label}
                      </span>
                    </div>
                  </div>
                  
                  <div className="ticket-actions">
                    <button className="action-btn">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="ticket-content">
                  <h3 className="ticket-subject">{ticket.subject}</h3>
                  <div className="ticket-meta">
                    <span className="ticket-category">{ticket.category}</span>
                    <span className={`ticket-priority ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="ticket-description">
                    {ticket.description}
                  </p>
                </div>
                
                <div className="ticket-footer">
                  <div className="ticket-timestamp">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>Updated {formatDate(ticket.updatedAt)}</span>
                  </div>
                  
                  <div className="ticket-footer-actions">
                    {ticket.responses.length > 0 && (
                      <div className="response-indicator">
                        <MessageCircle className="w-4 h-4" />
                        <span>{ticket.responses.length}</span>
                      </div>
                    )}
                    <button className="btn-secondary btn-sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Ticket Modal (simplified for demo) */}
      {showCreateTicket && (
        <div className="modal-overlay" onClick={() => setShowCreateTicket(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create New Support Ticket</h2>
              <button 
                className="modal-close"
                onClick={() => setShowCreateTicket(false)}
              >
                ×
              </button>
            </div>
            
            <form className="ticket-form">
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Brief description of your issue"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select">
                  <option value="">Select a category</option>
                  {mockAppData.categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="form-select">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows="4"
                  placeholder="Detailed description of your issue..."
                ></textarea>
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowCreateTicket(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-primary"
                  onClick={() => setShowCreateTicket(false)}
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EndUserDashboard;
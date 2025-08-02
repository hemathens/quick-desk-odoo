import React, { useState } from 'react';
import { 
  Users, 
  Folder, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Shield,
  UserCheck,
  UserX,
  Calendar,
  Activity,
  Settings
} from 'lucide-react';
import { mockAppData } from '../../mockApp';

const AdminPanel = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'categories'
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);

  // Filter users
  const filteredUsers = mockAppData.users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter categories
  const filteredCategories = mockAppData.categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'support_agent':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'end_user':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'text-green-600 bg-green-50 border-green-200'
      : 'text-red-600 bg-red-50 border-red-200';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Quick stats
  const totalUsers = mockAppData.users.length;
  const activeUsers = mockAppData.users.filter(user => user.status === 'active').length;
  const totalCategories = mockAppData.categories.length;
  const totalTickets = mockAppData.tickets.length;

  const renderUserManagement = () => (
    <div className="admin-content">
      <div className="admin-section-header">
        <div>
          <h2 className="admin-section-title">User Management</h2>
          <p className="admin-section-subtitle">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowAddUser(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add User
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="table-row">
                <td>
                  <div className="user-cell">
                    <div className="user-avatar-sm">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="user-name">{user.name}</div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`role-badge ${getRoleColor(user.role)}`}>
                    {user.role.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${getStatusColor(user.status)}`}>
                    {user.status === 'active' ? (
                      <><UserCheck className="w-3 h-3 mr-1" /> Active</>
                    ) : (
                      <><UserX className="w-3 h-3 mr-1" /> Inactive</>
                    )}
                  </span>
                </td>
                <td className="table-date">
                  {formatDate(user.createdAt)}
                </td>
                <td className="table-date">
                  {formatDate(user.lastLogin)}
                </td>
                <td>
                  <div className="table-actions">
                    <button className="action-btn">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="action-btn text-red-600 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="action-btn">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="modal-overlay" onClick={() => setShowAddUser(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New User</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAddUser(false)}
              >
                ×
              </button>
            </div>
            
            <form className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter full name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="user@company.com"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select className="form-select">
                    <option value="end_user">End User</option>
                    <option value="support_agent">Support Agent</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddUser(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-primary"
                  onClick={() => setShowAddUser(false)}
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderCategoryManagement = () => (
    <div className="admin-content">
      <div className="admin-section-header">
        <div>
          <h2 className="admin-section-title">Category Management</h2>
          <p className="admin-section-subtitle">
            Manage ticket categories and their settings
          </p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowAddCategory(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Category
        </button>
      </div>

      <div className="categories-grid">
        {filteredCategories.map(category => (
          <div key={category.id} className="category-card">
            <div className="category-header">
              <div className="category-color" style={{ backgroundColor: category.color }}></div>
              <div className="category-actions">
                <button className="action-btn">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="action-btn text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="category-content">
              <h3 className="category-name">{category.name}</h3>
              <p className="category-description">{category.description}</p>
            </div>
            
            <div className="category-stats">
              <div className="stat-item">
                <Folder className="w-4 h-4 text-gray-400" />
                <span>{category.ticketCount} tickets</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="modal-overlay" onClick={() => setShowAddCategory(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New Category</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAddCategory(false)}
              >
                ×
              </button>
            </div>
            
            <form className="admin-form">
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter category name"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  placeholder="Describe what this category covers..."
                ></textarea>
              </div>
              
              <div className="form-group">
                <label className="form-label">Color</label>
                <input
                  type="color"
                  className="form-input"
                  defaultValue="#9cae9a"
                />
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddCategory(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-primary"
                  onClick={() => setShowAddCategory(false)}
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="dashboard-title-section">
          <h1 className="dashboard-title">Admin Panel</h1>
          <p className="dashboard-subtitle">
            Manage users, categories, and system settings
          </p>
        </div>
        
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-value">{activeUsers}</span>
            <span className="stat-label">Active Users</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{totalCategories}</span>
            <span className="stat-label">Categories</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{totalTickets}</span>
            <span className="stat-label">Total Tickets</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users className="w-4 h-4 mr-2" />
          User Management
        </button>
        <button 
          className={`tab-button ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          <Folder className="w-4 h-4 mr-2" />
          Category Management
        </button>
      </div>

      {/* Search */}
      <div className="admin-search">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {activeTab === 'users' ? renderUserManagement() : renderCategoryManagement()}
    </div>
  );
};

export default AdminPanel;
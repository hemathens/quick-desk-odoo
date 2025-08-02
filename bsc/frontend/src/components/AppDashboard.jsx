import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  MoreHorizontal,
  Clock,
  AlertCircle,
  CheckCircle,
  Circle,
  Users,
  Folder,
  BarChart3
} from 'lucide-react';
import { mockAppData, mockAuth } from '../mockApp';
import EndUserDashboard from './dashboards/EndUserDashboard';
import SupportAgentDashboard from './dashboards/SupportAgentDashboard';
import AdminPanel from './dashboards/AdminPanel';

const AppDashboard = () => {
  const [currentUser, setCurrentUser] = useState(mockAuth.getCurrentUser());
  const [showUserMenu, setShowUserMenu] = useState(false);

  // For demo purposes - role switcher
  const switchRole = (role) => {
    const user = mockAuth.switchUserRole(role);
    setCurrentUser(user);
    setShowUserMenu(false);
  };

  // Render appropriate dashboard based on user role
  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'support_agent':
        return <SupportAgentDashboard currentUser={currentUser} />;
      case 'admin':
        return <AdminPanel currentUser={currentUser} />;
      case 'end_user':
      default:
        return <EndUserDashboard currentUser={currentUser} />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'support_agent':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="app-dashboard">
      {/* Top Navigation Header */}
      <header className="app-header">
        <div className="app-nav-container">
          {/* Logo and App Name */}
          <div className="app-logo">
            <h1>QuickDesk</h1>
            <span className="app-subtitle">Support Portal</span>
          </div>

          {/* Header Actions */}
          <div className="header-actions">
            {/* Notifications */}
            <button className="header-action-btn">
              <Bell className="w-5 h-5" />
              {currentUser.notifications > 0 && (
                <span className="notification-badge">{currentUser.notifications}</span>
              )}
            </button>

            {/* User Menu */}
            <div className="user-menu-container">
              <button 
                className="user-menu-trigger"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="user-avatar">
                  {currentUser.avatar}
                </div>
                <div className="user-info">
                  <span className="user-name">{currentUser.name}</span>
                  <span className={`user-role-badge ${getRoleBadgeColor(currentUser.role)}`}>
                    {currentUser.role.replace('_', ' ')}
                  </span>
                </div>
              </button>

              {showUserMenu && (
                <div className="user-menu-dropdown">
                  <div className="user-menu-section">
                    <div className="user-menu-header">
                      <span>Switch Role (Demo)</span>
                    </div>
                    <button 
                      className="user-menu-item"
                      onClick={() => switchRole('end_user')}
                    >
                      <User className="w-4 h-4" />
                      End User
                    </button>
                    <button 
                      className="user-menu-item"
                      onClick={() => switchRole('support_agent')}
                    >
                      <Users className="w-4 h-4" />
                      Support Agent
                    </button>
                    <button 
                      className="user-menu-item"
                      onClick={() => switchRole('admin')}
                    >
                      <Settings className="w-4 h-4" />
                      Administrator
                    </button>
                  </div>
                  
                  <div className="user-menu-divider"></div>
                  
                  <div className="user-menu-section">
                    <button className="user-menu-item">
                      <Settings className="w-4 h-4" />
                      Account Settings
                    </button>
                    <button className="user-menu-item text-red-600">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="app-main">
        {renderDashboard()}
      </main>
    </div>
  );
};

export default AppDashboard;
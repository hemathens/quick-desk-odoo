// Enhanced mock data for QuickDesk internal application

export const mockAppData = {
  // Current user context (can be switched for testing different roles)
  currentUser: {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "end_user", // "end_user", "support_agent", "admin"
    avatar: "SJ",
    notifications: 3
  },

  // Mock users for admin management
  users: [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      role: "end_user",
      status: "active",
      createdAt: "2024-01-15",
      lastLogin: "2025-01-02"
    },
    {
      id: 2,
      name: "Mike Rodriguez", 
      email: "mike.rodriguez@company.com",
      role: "support_agent",
      status: "active",
      createdAt: "2024-02-20",
      lastLogin: "2025-01-02"
    },
    {
      id: 3,
      name: "Emily Chen",
      email: "emily.chen@company.com", 
      role: "admin",
      status: "active",
      createdAt: "2024-01-10",
      lastLogin: "2025-01-01"
    },
    {
      id: 4,
      name: "David Park",
      email: "david.park@company.com",
      role: "end_user",
      status: "active",
      createdAt: "2024-03-12",
      lastLogin: "2024-12-28"
    },
    {
      id: 5,
      name: "Lisa Thompson",
      email: "lisa.thompson@company.com",
      role: "support_agent",
      status: "inactive",
      createdAt: "2024-02-25",
      lastLogin: "2024-11-15"
    }
  ],

  // Ticket categories
  categories: [
    {
      id: 1,
      name: "Technical Issue",
      description: "Software bugs, system errors, and technical problems",
      color: "#9cae9a",
      ticketCount: 12
    },
    {
      id: 2,
      name: "Account & Billing",
      description: "Payment, subscription, and account-related inquiries",
      color: "#666666", 
      ticketCount: 8
    },
    {
      id: 3,
      name: "Feature Request",
      description: "Suggestions for new features or improvements",
      color: "#404040",
      ticketCount: 5
    },
    {
      id: 4,
      name: "General Support",
      description: "General questions and how-to requests",
      color: "#9cae9a",
      ticketCount: 15
    },
    {
      id: 5,
      name: "Integration Help",
      description: "API, third-party integrations, and setup assistance", 
      color: "#666666",
      ticketCount: 7
    }
  ],

  // Mock tickets data
  tickets: [
    {
      id: "QD-2025-001",
      subject: "Dashboard loading issues in Chrome",
      description: "The main dashboard takes over 30 seconds to load in Chrome browser. Works fine in Firefox.",
      category: "Technical Issue",
      priority: "high",
      status: "open",
      createdBy: 1,
      assignedTo: 2,
      createdAt: "2025-01-02T10:30:00Z",
      updatedAt: "2025-01-02T11:45:00Z",
      responses: []
    },
    {
      id: "QD-2025-002", 
      subject: "Cannot access billing information",
      description: "Getting a 404 error when trying to view billing details in account settings.",
      category: "Account & Billing",
      priority: "medium",
      status: "in_progress",
      createdBy: 4,
      assignedTo: 2,
      createdAt: "2025-01-01T14:20:00Z",
      updatedAt: "2025-01-02T09:15:00Z",
      responses: [
        {
          id: 1,
          author: "Mike Rodriguez",
          message: "I'm looking into this issue. Can you tell me which browser you're using?",
          timestamp: "2025-01-02T09:15:00Z",
          type: "agent_response"
        }
      ]
    },
    {
      id: "QD-2025-003",
      subject: "Add dark mode theme option",
      description: "Would love to have a dark mode option for the interface, especially for extended use sessions.",
      category: "Feature Request", 
      priority: "low",
      status: "open",
      createdBy: 1,
      assignedTo: null,
      createdAt: "2024-12-30T16:45:00Z",
      updatedAt: "2024-12-30T16:45:00Z",
      responses: []
    },
    {
      id: "QD-2024-156",
      subject: "How to export ticket data",
      description: "Need help understanding how to export all ticket data for our monthly reports.",
      category: "General Support",
      priority: "medium", 
      status: "resolved",
      createdBy: 4,
      assignedTo: 5,
      createdAt: "2024-12-28T11:30:00Z",
      updatedAt: "2024-12-29T10:20:00Z",
      responses: [
        {
          id: 1,
          author: "Lisa Thompson",
          message: "You can export ticket data from the Reports section. Go to Reports > Export Data and select your date range.",
          timestamp: "2024-12-29T10:20:00Z",
          type: "agent_response"
        }
      ]
    },
    {
      id: "QD-2024-155",
      subject: "API integration documentation unclear",
      description: "The webhook setup section in the API docs is missing key configuration details.",
      category: "Integration Help",
      priority: "medium",
      status: "in_progress", 
      createdBy: 1,
      assignedTo: 2,
      createdAt: "2024-12-27T09:15:00Z",
      updatedAt: "2025-01-01T15:30:00Z",
      responses: [
        {
          id: 1,
          author: "Mike Rodriguez", 
          message: "Thanks for pointing this out. I've forwarded this to our documentation team for updates.",
          timestamp: "2025-01-01T15:30:00Z",
          type: "agent_response"
        }
      ]
    },
    {
      id: "QD-2024-154",
      subject: "Subscription renewal failed",
      description: "My card was charged but subscription shows as expired. Need immediate assistance.",
      category: "Account & Billing",
      priority: "high",
      status: "resolved",
      createdBy: 4,
      assignedTo: 2,
      createdAt: "2024-12-26T13:45:00Z", 
      updatedAt: "2024-12-26T16:20:00Z",
      responses: [
        {
          id: 1,
          author: "Mike Rodriguez",
          message: "I've manually updated your subscription status. You should see the change reflected in your account within 5 minutes.",
          timestamp: "2024-12-26T16:20:00Z", 
          type: "agent_response"
        }
      ]
    }
  ],

  // Helper functions
  getUserById: (id) => mockAppData.users.find(user => user.id === id),
  
  getTicketsByUser: (userId) => mockAppData.tickets.filter(ticket => ticket.createdBy === userId),
  
  getTicketsByAgent: (agentId) => mockAppData.tickets.filter(ticket => ticket.assignedTo === agentId),
  
  getTicketsByStatus: (status) => mockAppData.tickets.filter(ticket => ticket.status === status),

  getTicketsByCategory: (category) => mockAppData.tickets.filter(ticket => ticket.category === category),

  // Status and priority configurations
  ticketStatuses: {
    open: { label: "Open", color: "#9cae9a", bgColor: "rgba(156, 174, 154, 0.1)" },
    in_progress: { label: "In Progress", color: "#666666", bgColor: "rgba(102, 102, 102, 0.1)" }, 
    resolved: { label: "Resolved", color: "#404040", bgColor: "rgba(64, 64, 64, 0.1)" },
    closed: { label: "Closed", color: "#2c2c2c", bgColor: "rgba(44, 44, 44, 0.1)" }
  },

  ticketPriorities: {
    low: { label: "Low", color: "#9cae9a" },
    medium: { label: "Medium", color: "#666666" },
    high: { label: "High", color: "#2c2c2c" },
    urgent: { label: "Urgent", color: "#d32f2f" }
  }
};

// Mock authentication functions
export const mockAuth = {
  switchUserRole: (role) => {
    // Switch user for testing different dashboards
    const roleUsers = {
      end_user: { id: 1, name: "Sarah Johnson", email: "sarah.johnson@company.com", role: "end_user", avatar: "SJ" },
      support_agent: { id: 2, name: "Mike Rodriguez", email: "mike.rodriguez@company.com", role: "support_agent", avatar: "MR" },
      admin: { id: 3, name: "Emily Chen", email: "emily.chen@company.com", role: "admin", avatar: "EC" }
    };
    
    mockAppData.currentUser = roleUsers[role] || roleUsers.end_user;
    return mockAppData.currentUser;
  },

  getCurrentUser: () => mockAppData.currentUser,

  logout: () => {
    // Reset to default user
    mockAppData.currentUser = {
      id: 1,
      name: "Sarah Johnson", 
      email: "sarah.johnson@company.com",
      role: "end_user",
      avatar: "SJ"
    };
  }
};
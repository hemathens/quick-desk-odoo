import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Users, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { mockAuth } from '../mockApp';

const Registration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('registration'); // 'registration' or 'success'

  const roleOptions = [
    {
      id: 'end_user',
      title: 'I am an End User',
      subtitle: 'I need support and want to create tickets',
      icon: <User className="w-6 h-6" />,
      description: 'Perfect for team members who need help and support'
    },
    {
      id: 'support_agent',
      title: 'I am a Support Agent',
      subtitle: 'I provide support and manage tickets',
      icon: <Users className="w-6 h-6" />,
      description: 'Ideal for support team members who help resolve issues'
    },
    {
      id: 'admin',
      title: 'I am an Administrator',
      subtitle: 'I manage users, categories, and system settings',
      icon: <Shield className="w-6 h-6" />,
      description: 'For administrators who oversee the entire system'
    }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.role) {
      newErrors.role = 'Please select your role';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRoleSelect = (roleId) => {
    setFormData(prev => ({
      ...prev,
      role: roleId
    }));
    
    // Clear role error
    if (errors.role) {
      setErrors(prev => ({
        ...prev,
        role: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Switch to the selected role in mock auth
      mockAuth.switchUserRole(formData.role);
      
      setStep('success');
      setIsLoading(false);
      
      // Redirect to appropriate dashboard after short delay
      setTimeout(() => {
        navigate('/app');
      }, 1500);
    }, 1000);
  };

  const getSelectedRoleInfo = () => {
    return roleOptions.find(role => role.id === formData.role);
  };

  if (step === 'success') {
    const selectedRole = getSelectedRoleInfo();
    
    return (
      <div className="registration-page">
        <div className="registration-container">
          <div className="registration-content">
            {/* Success State */}
            <div className="success-state">
              <div className="success-icon">
                <CheckCircle className="w-16 h-16 text-sage-dusty" />
              </div>
              
              <h1 className="success-title">Welcome to QuickDesk!</h1>
              <p className="success-subtitle">
                Your account has been created successfully as a <strong>{selectedRole?.title.replace('I am ', '')}</strong>
              </p>
              
              <div className="success-role-card">
                <div className="role-icon">
                  {selectedRole?.icon}
                </div>
                <div className="role-info">
                  <h3>{selectedRole?.title}</h3>
                  <p>{selectedRole?.description}</p>
                </div>
              </div>
              
              <div className="success-actions">
                <div className="loading-indicator">
                  <div className="loading-spinner"></div>
                  <span>Taking you to your dashboard...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="registration-page">
      <div className="registration-container">
        <div className="registration-content">
          {/* Header */}
          <div className="registration-header">
            <h1 className="registration-title">Join QuickDesk</h1>
            <p className="registration-subtitle">
              Create your account and get started with professional support management
            </p>
          </div>

          {/* Registration Form */}
          <form className="registration-form" onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="form-section">
              <h3 className="form-section-title">Your Information</h3>
              
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  className={`form-input ${errors.fullName ? 'error' : ''}`}
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
                {errors.fullName && <span className="form-error">{errors.fullName}</span>}
              </div>
              
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="your.email@company.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>
            </div>

            {/* Role Selection */}
            <div className="form-section">
              <h3 className="form-section-title">Choose Your Role</h3>
              <p className="form-section-subtitle">
                Select the option that best describes how you'll use QuickDesk
              </p>
              
              <div className="role-selection">
                {roleOptions.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    className={`role-card ${formData.role === role.id ? 'selected' : ''}`}
                    onClick={() => handleRoleSelect(role.id)}
                  >
                    <div className="role-icon">
                      {role.icon}
                    </div>
                    <div className="role-content">
                      <h4 className="role-title">{role.title}</h4>
                      <p className="role-subtitle">{role.subtitle}</p>
                      <p className="role-description">{role.description}</p>
                    </div>
                    <div className="role-selector">
                      <div className={`radio-indicator ${formData.role === role.id ? 'selected' : ''}`}>
                        {formData.role === role.id && <div className="radio-dot"></div>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {errors.role && <span className="form-error">{errors.role}</span>}
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button
                type="submit"
                className="registration-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner small"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create My Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="registration-footer">
            <p>
              Already have an account?{' '}
              <button 
                className="link-button"
                onClick={() => navigate('/app')}
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
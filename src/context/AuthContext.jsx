import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          // Verify/Sync user data from database to ensure fresh profile info
          const parsedUser = JSON.parse(savedUser);
          const response = await api.get(`/users/${parsedUser.id}`);
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
          console.error('Failed to sync auth user:', error);
          // If server fails or user is deleted, clear local storage
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.get(`/users?email=${encodeURIComponent(email)}`);
      const foundUsers = response.data;
      
      if (foundUsers.length === 0) {
        toast.error('Account not found with this email.');
        return false;
      }

      const matchedUser = foundUsers[0];
      if (matchedUser.password !== password) {
        toast.error('Incorrect password.');
        return false;
      }

      setUser(matchedUser);
      localStorage.setItem('token', `fake-jwt-token-${matchedUser.id}`);
      localStorage.setItem('user', JSON.stringify(matchedUser));
      toast.success(`Welcome back, ${matchedUser.name}!`);
      return matchedUser;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login.');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      // Check if email already exists
      const existing = await api.get(`/users?email=${encodeURIComponent(userData.email)}`);
      if (existing.data.length > 0) {
        toast.error('An account with this email already exists.');
        return false;
      }

      // Format custom fields based on role
      const newUser = {
        ...userData,
        avatar: userData.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`, // Default avatar
        bio: userData.bio || '',
        skills: userData.role === 'seeker' ? (userData.skills || []) : undefined,
        company: userData.role === 'employer' ? (userData.company || '') : undefined,
      };

      const response = await api.post('/users', newUser);
      const createdUser = response.data;

      setUser(createdUser);
      localStorage.setItem('token', `fake-jwt-token-${createdUser.id}`);
      localStorage.setItem('user', JSON.stringify(createdUser));
      toast.success('Registration successful!');
      return createdUser;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred during registration.');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully.');
  };

  const updateProfile = async (updatedData) => {
    if (!user) return false;
    try {
      const response = await api.put(`/users/${user.id}`, {
        ...user,
        ...updatedData
      });
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      toast.success('Profile updated successfully!');
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile.');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

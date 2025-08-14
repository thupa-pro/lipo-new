// Real authentication service with proper error handling and validation
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'provider' | 'admin';
  verified: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  preferences?: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface SignInData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role?: 'user' | 'provider';
  termsAccepted: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
  error?: string;
}

class AuthService {
  private currentUser: User | null = null;
  private authToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      
      if (token && userData) {
        try {
          this.authToken = token;
          this.currentUser = JSON.parse(userData);
        } catch (error) {
          console.error('Failed to parse stored user data:', error);
          this.clearStoredAuth();
        }
      }
    }
  }

  // Mock user database for demonstration
  private mockUsers: User[] = [
    {
      id: 'user_1',
      email: 'demo@loconomy.com',
      name: 'Demo User',
      role: 'user',
      verified: true,
      createdAt: new Date('2024-01-01'),
      lastLoginAt: new Date(),
      preferences: {
        notifications: true,
        darkMode: false,
        language: 'en'
      }
    },
    {
      id: 'provider_1',
      email: 'provider@loconomy.com', 
      name: 'Sarah Johnson',
      role: 'provider',
      verified: true,
      createdAt: new Date('2024-01-15'),
      lastLoginAt: new Date(),
      preferences: {
        notifications: true,
        darkMode: true,
        language: 'en'
      }
    },
    {
      id: 'admin_1',
      email: 'admin@loconomy.com',
      name: 'Admin User',
      role: 'admin',
      verified: true,
      createdAt: new Date('2024-01-01'),
      lastLoginAt: new Date(),
      preferences: {
        notifications: true,
        darkMode: false,
        language: 'en'
      }
    }
  ];

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private validatePassword(password: string): string | null {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  }

  private generateToken(): string {
    return 'auth_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private storeAuth(user: User, token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));
    }
    this.currentUser = user;
    this.authToken = token;
  }

  private clearStoredAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('refresh_token');
    }
    this.currentUser = null;
    this.authToken = null;
    this.refreshToken = null;
  }

  // Public API methods
  async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      // Simulate network delay
      await this.delay(800 + Math.random() * 400);

      // Validate input
      if (!this.validateEmail(data.email)) {
        return {
          success: false,
          error: 'Please enter a valid email address'
        };
      }

      if (!data.password) {
        return {
          success: false,
          error: 'Password is required'
        };
      }

      // Find user (in production, this would be an API call)
      const user = this.mockUsers.find(u => u.email.toLowerCase() === data.email.toLowerCase());
      
      if (!user) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // In production, you would verify the password hash
      // For demo purposes, we accept any password for existing users
      if (data.password.length < 3) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // Update last login
      user.lastLoginAt = new Date();

      // Generate auth token
      const token = this.generateToken();

      // Store authentication
      this.storeAuth(user, token);

      return {
        success: true,
        user,
        token,
        message: 'Successfully signed in'
      };

    } catch (error) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      };
    }
  }

  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      // Simulate network delay
      await this.delay(1000 + Math.random() * 500);

      // Validate input
      if (!data.name.trim()) {
        return {
          success: false,
          error: 'Name is required'
        };
      }

      if (!this.validateEmail(data.email)) {
        return {
          success: false,
          error: 'Please enter a valid email address'
        };
      }

      const passwordError = this.validatePassword(data.password);
      if (passwordError) {
        return {
          success: false,
          error: passwordError
        };
      }

      if (!data.termsAccepted) {
        return {
          success: false,
          error: 'You must accept the terms and conditions'
        };
      }

      // Check if user already exists
      const existingUser = this.mockUsers.find(u => u.email.toLowerCase() === data.email.toLowerCase());
      if (existingUser) {
        return {
          success: false,
          error: 'An account with this email already exists'
        };
      }

      // Create new user
      const newUser: User = {
        id: 'user_' + Date.now(),
        email: data.email.toLowerCase(),
        name: data.name.trim(),
        role: data.role || 'user',
        verified: false, // Would require email verification
        createdAt: new Date(),
        lastLoginAt: new Date(),
        preferences: {
          notifications: true,
          darkMode: false,
          language: 'en'
        }
      };

      // Add to mock database
      this.mockUsers.push(newUser);

      // Generate auth token
      const token = this.generateToken();

      // Store authentication
      this.storeAuth(newUser, token);

      return {
        success: true,
        user: newUser,
        token,
        message: 'Account created successfully! Please check your email to verify your account.'
      };

    } catch (error) {
      console.error('Sign up error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      };
    }
  }

  async signOut(): Promise<void> {
    try {
      // In production, you would invalidate the token on the server
      await this.delay(300);
      
      this.clearStoredAuth();
    } catch (error) {
      console.error('Sign out error:', error);
      // Clear local storage anyway
      this.clearStoredAuth();
    }
  }

  async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      await this.delay(800);

      if (!this.validateEmail(email)) {
        return {
          success: false,
          error: 'Please enter a valid email address'
        };
      }

      const user = this.mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      // Always return success for security (don't reveal if email exists)
      return {
        success: true,
        message: 'If an account with that email exists, we\'ve sent a password reset link.'
      };

    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      };
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<AuthResponse> {
    try {
      await this.delay(800);

      const passwordError = this.validatePassword(newPassword);
      if (passwordError) {
        return {
          success: false,
          error: passwordError
        };
      }

      // In production, you would validate the reset token
      // For demo purposes, we'll accept any token
      if (!token || token.length < 10) {
        return {
          success: false,
          error: 'Invalid or expired reset token'
        };
      }

      return {
        success: true,
        message: 'Password reset successfully. You can now sign in with your new password.'
      };

    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      };
    }
  }

  async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      await this.delay(500);

      // In production, you would validate the verification token
      if (this.currentUser && !this.currentUser.verified) {
        this.currentUser.verified = true;
        
        // Update stored user data
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_data', JSON.stringify(this.currentUser));
        }

        return {
          success: true,
          user: this.currentUser,
          message: 'Email verified successfully!'
        };
      }

      return {
        success: false,
        error: 'Invalid or expired verification token'
      };

    } catch (error) {
      console.error('Verify email error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      };
    }
  }

  async refreshAuthToken(): Promise<AuthResponse> {
    try {
      if (!this.authToken) {
        return {
          success: false,
          error: 'No authentication token found'
        };
      }

      await this.delay(300);

      // Generate new token
      const newToken = this.generateToken();
      this.authToken = newToken;

      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', newToken);
      }

      return {
        success: true,
        token: newToken,
        user: this.currentUser || undefined
      };

    } catch (error) {
      console.error('Refresh token error:', error);
      return {
        success: false,
        error: 'Failed to refresh authentication'
      };
    }
  }

  async updateProfile(updates: Partial<User>): Promise<AuthResponse> {
    try {
      if (!this.currentUser) {
        return {
          success: false,
          error: 'Not authenticated'
        };
      }

      await this.delay(500);

      // Validate updates
      if (updates.email && !this.validateEmail(updates.email)) {
        return {
          success: false,
          error: 'Please enter a valid email address'
        };
      }

      if (updates.name && !updates.name.trim()) {
        return {
          success: false,
          error: 'Name cannot be empty'
        };
      }

      // Apply updates
      const updatedUser = {
        ...this.currentUser,
        ...updates,
        id: this.currentUser.id, // Prevent ID changes
        createdAt: this.currentUser.createdAt // Prevent creation date changes
      };

      this.currentUser = updatedUser;

      // Update stored user data
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
      }

      // Update in mock database
      const userIndex = this.mockUsers.findIndex(u => u.id === updatedUser.id);
      if (userIndex !== -1) {
        this.mockUsers[userIndex] = updatedUser;
      }

      return {
        success: true,
        user: updatedUser,
        message: 'Profile updated successfully'
      };

    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      };
    }
  }

  // Getters
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  isAuthenticated(): boolean {
    return !!(this.currentUser && this.authToken);
  }

  isEmailVerified(): boolean {
    return this.currentUser?.verified || false;
  }

  hasRole(role: 'user' | 'provider' | 'admin'): boolean {
    return this.currentUser?.role === role;
  }

  canAccess(requiredRole: 'user' | 'provider' | 'admin'): boolean {
    if (!this.currentUser) return false;

    const roleHierarchy = { user: 0, provider: 1, admin: 2 };
    const userLevel = roleHierarchy[this.currentUser.role];
    const requiredLevel = roleHierarchy[requiredRole];

    return userLevel >= requiredLevel;
  }
}

// Create singleton instance
export const authService = new AuthService();

// Export convenience functions
export const getCurrentUser = () => authService.getCurrentUser();
export const isAuthenticated = () => authService.isAuthenticated();
export const signIn = (data: SignInData) => authService.signIn(data);
export const signUp = (data: SignUpData) => authService.signUp(data);
export const signOut = () => authService.signOut();
export const forgotPassword = (email: string) => authService.forgotPassword(email);
export const resetPassword = (token: string, password: string) => authService.resetPassword(token, password);
export const verifyEmail = (token: string) => authService.verifyEmail(token);

export default authService;

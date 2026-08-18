export const AUTH_KEYS = {
  SESSION: 'vertex_session_v1',
  AUTH_STATUS: 'vertex_auth_v1',
};

export const MOCK_USERS = [
  {
    id: 'usr_customer',
    name: 'Fahad Mazari',
    email: 'customer@vertex.com',
    phone: '03001234567',
    role: 'Customer',
    password: 'Password123!',
  },
  {
    id: 'usr_seller',
    name: 'Vertex Seller Store',
    email: 'seller@vertex.com',
    phone: '03117654321',
    role: 'Seller',
    password: 'Password123!',
  },
  {
    id: 'usr_admin',
    name: 'Vertex Administrator',
    email: 'admin@vertex.com',
    phone: '03229988776',
    role: 'Admin',
    password: 'Password123!',
  }
];

export const AUTH_MESSAGES = {
  INVALID_CREDENTIALS: 'The email address or password you entered is incorrect.',
  EMAIL_ALREADY_EXISTS: 'An account with this email address already exists.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  RESET_LINK_SENT: 'A password reset link has been sent to your email address.',
  VERIFICATION_LINK_SENT: 'Verification email sent. Please check your inbox.',
  VERIFICATION_SUCCESS: 'Your email address has been successfully verified! You can now log in.',
  PASSWORD_RESET_SUCCESS: 'Your password has been successfully updated.',
  REGISTRATION_SUCCESS: 'Account created successfully! Please verify your email.',
};

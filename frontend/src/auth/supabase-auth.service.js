import { API_BASE_URL } from '@/config/serverApiConfig';
import axios from 'axios';
import errorHandler from '@/request/errorHandler';
import successHandler from '@/request/successHandler';

/**
 * Supabase-compatible authentication service
 * Works with the new Supabase backend
 */

export const supabaseLogin = async ({ email, password }) => {
  try {
    const response = await axios.post(API_BASE_URL + `auth/login`, {
      email,
      password,
    });

    const { status, data } = response;

    successHandler(
      { data, status },
      {
        notifyOnSuccess: false,
        notifyOnFailed: true,
      }
    );

    // Store token if provided
    if (data?.token) {
      localStorage.setItem('auth_token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    }

    return data;
  } catch (error) {
    return errorHandler(error);
  }
};

export const supabaseRegister = async ({ email, password, firstName, lastName }) => {
  try {
    const response = await axios.post(API_BASE_URL + `auth/register`, {
      email,
      password,
      firstName: firstName || '',
      lastName: lastName || '',
    });

    const { status, data } = response;

    successHandler(
      { data, status },
      {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      }
    );

    // Store token if provided
    if (data?.token) {
      localStorage.setItem('auth_token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    }

    return data;
  } catch (error) {
    return errorHandler(error);
  }
};

export const supabaseResetPassword = async ({ email }) => {
  try {
    const response = await axios.post(API_BASE_URL + `auth/reset-password-request`, {
      email,
    });

    const { status, data } = response;

    successHandler(
      { data, status },
      {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      }
    );

    return data;
  } catch (error) {
    return errorHandler(error);
  }
};

export const supabaseUpdatePassword = async ({ resetToken, password }) => {
  try {
    const response = await axios.post(API_BASE_URL + `auth/reset-password`, {
      resetToken,
      password,
    });

    const { status, data } = response;

    successHandler(
      { data, status },
      {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      }
    );

    return data;
  } catch (error) {
    return errorHandler(error);
  }
};

export const supabaseLogout = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      await axios.post(
        API_BASE_URL + `auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    localStorage.removeItem('auth_token');
    delete axios.defaults.headers.common['Authorization'];

    successHandler(
      { status: 200 },
      {
        notifyOnSuccess: false,
        notifyOnFailed: true,
      }
    );

    return { success: true };
  } catch (error) {
    // Clear token anyway even if logout request fails
    localStorage.removeItem('auth_token');
    delete axios.defaults.headers.common['Authorization'];
    return errorHandler(error);
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('auth_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem('auth_token');
  delete axios.defaults.headers.common['Authorization'];
};

// Initialize token on app load
export const initializeAuth = () => {
  const token = getAuthToken();
  if (token) {
    setAuthToken(token);
  }
};

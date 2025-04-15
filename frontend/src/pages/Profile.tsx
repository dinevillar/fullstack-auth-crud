import React, { useState } from 'react';
import { resetPassword as resetPasswordApi } from '../services/api';
import { getUser, updateUser } from '../services/authenticatedApi'
import { Button, CircularProgress } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../store'

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Profile({resetPassword} : {resetPassword: boolean}) {
  const user = useSelector((state: RootState) => state.auth.user);
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      setLoading(true);
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match')
      }
      if (resetPassword) {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        if (!token) {
          throw new Error('Invalid reset password token')
        }
        await resetPasswordApi(token, formData.password);
        setSuccessMessage('Password reset successfully!');
        setTimeout(() => {
          navigate('/login')
        }, 1000)
      } else if (user) {
        await updateUser(user.userId || user.id, {...formData, password: formData.password || undefined});
        setSuccessMessage('Profile updated successfully!');
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const fetchUser = async (id: string) => {
      try {
        const userData = await getUser(id)
        setFormData({
          name: userData.name,
          email: userData.email,
          password: '',
          confirmPassword: ''
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        setErrorMessage('Failed to fetch user data.');
      }
    }
    if (user && !resetPassword) {
      fetchUser(user.userId || user.id)
    }
  }, [ user ])

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
      {successMessage && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{successMessage}</div>}
      {errorMessage && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        {!resetPassword && (
          <>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
          </>
        )}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit"
                  variant="contained"
                  color="primary"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}>
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
}

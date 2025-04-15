import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LogIn } from 'lucide-react';
import { loginUser } from '../api/auth.ts'
import { setAuth } from '../store/slices/authSlice.ts'
import { Button, CircularProgress} from '@mui/material';
import { apiUrl } from '../api/client.ts'
import { jwtDecode } from 'jwt-decode'


export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { user, token } = await loginUser({ email, password })
      localStorage.setItem('authToken', token);
      dispatch(setAuth({ user }));
      navigate('/');
    } catch (err: any) {
      console.log(err)
      setMessage({
        type: 'error',
        text: err.response?.data?.message || err.message || 'An error occurred during login. Please try again.',
      })
      console.error(err)
    } finally {
      setPassword('')
      setIsLoading(false)
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = `${apiUrl}/auth/google`;
  }

  React.useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      try {
        const user = jwtDecode<{ id: string; email: string }>(token);
        localStorage.setItem('authToken', token);
        dispatch(setAuth({ user }));
        navigate('/');
      } catch ( err ) {
        console.error('Invalid token', err);
        setMessage({
          type: 'error',
          text: err.response?.data?.message || err.message || 'An error occurred during login. Please try again.',
        })
      }
    }
  }, [location.search, dispatch, navigate])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <LogIn className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {message && (
            <div
              className={`mb-4 rounded-md p-4 text-sm ${
                message.type === 'error'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {message.text}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={isLoading}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={isLoading}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  disabled={isLoading}
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <Button type="submit"
                      variant="contained"
                      color="primary"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={isLoading}
                      startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>

            <div>
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 mr-2" />
                Sign in with Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

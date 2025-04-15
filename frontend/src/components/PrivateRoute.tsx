import React, { useEffect, useState } from 'react';
    import { Navigate } from 'react-router-dom';
    import { useSelector, useDispatch } from 'react-redux';
    import { RootState } from '../store';
    import { setAuth } from '../store/slices/authSlice.ts';
    import { jwtDecode } from 'jwt-decode';

    interface PrivateRouteProps {
      children: React.ReactNode;
    }

    const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
      const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
      const dispatch = useDispatch();
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
          try {
            const user = jwtDecode<{ id: string; email: string }>(authToken);
            dispatch(setAuth({ user }));
          } catch (error) {
            console.error('Invalid token:', error);
          }
        }
        setLoading(false);
      }, [dispatch]);

      if (loading) {
        return <div>Loading...</div>; // Show a loading state while checking authentication
      }

      return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
    };

    export default PrivateRoute;

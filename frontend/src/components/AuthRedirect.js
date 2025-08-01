import { useAuth } from 'contexts/AuthContext';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthRedirect = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      // Check if user is on auth pages
      const isAuthPage = location.pathname.startsWith('/auth');
      const isMaintenancePage = location.pathname.startsWith('/maintenance');
      const isContactPage = location.pathname === '/contact-us';

      // Allow access to maintenance and contact pages without authentication
      if (isMaintenancePage || isContactPage) {
        return;
      }

      if (user && isAuthPage) {
        // User is authenticated and on auth page, redirect to dashboard
        navigate('/dashboard');
      } else if (!user && !isAuthPage) {
        // User is not authenticated and not on auth page, redirect to login
        navigate('/auth/login');
      }
    }
  }, [user, loading, navigate, location]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return children;
};

export default AuthRedirect;

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const withAuthAdmin = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication status
    const [isLoading, setIsLoading] = useState(true); // Track loading status

    useEffect(() => {
      const user = localStorage.getItem('user'); // Assuming 'user' is a JSON string with email and password
      const parsedUser = user ? JSON.parse(user) : null;

      // Check authentication
      if (parsedUser && parsedUser.email === 'admin@gmail.com') {
        setIsAuthenticated(true); // User is authenticated
      } else {
        router.push('/Dashboard'); // Redirect to login if not authenticated
      }

      setIsLoading(false); // Set loading to false once check is complete
    }, [router]);

    // Show a loading state until the authentication check is complete
    if (isLoading) {
      return <div>Loading...</div>; // You can customize this loading message or component
    }

    // Render the wrapped component only if the user is authenticated
    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuthAdmin;

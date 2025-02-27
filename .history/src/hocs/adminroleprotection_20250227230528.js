// hocs/withRoleProtection.js
import { useSession } from 'next-auth/react'; // If using NextAuth.js
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const adminroleprotection = (WrappedComponent, allowedRoles) => {
  const ProtectedComponent = (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Use useEffect to handle the redirection
    useEffect(() => {
      if (status === 'loading') {
        return; // Do nothing while loading
      }

      // Redirect if the user is not authenticated or does not have the required role
      if (!session || !allowedRoles.includes(session.user.role)) {
        router.push('/unauthorized'); // Redirect to unauthorized page
      }
    }, [session, status, router]);

    // Show a loading state while checking the session
    if (status === 'loading') {
      return <p>Loading...</p>;
    }

    // Render the wrapped component if the user is authorized
    if (session && allowedRoles.includes(session.user.role)) {
      return <WrappedComponent {...props} />;
    }

    // Return null if the user is not authorized
    return null;
  };

  // Add a display name for debugging
  ProtectedComponent.displayName = `withRoleProtection(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ProtectedComponent;
};

export default adminroleprotection;
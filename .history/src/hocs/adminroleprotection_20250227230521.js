 hocs/withRoleProtection.js
import { useSession } from 'next-auth/react'; 
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const adminroleprotection = (WrappedComponent, allowedRoles) => {
  const ProtectedComponent = (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();

     
    useEffect(() => {
      if (status === 'loading') {
        return;  
      }

       
      if (!session || !allowedRoles.includes(session.user.role)) {
        router.push('/unauthorized');  
      }
    }, [session, status, router]);

     
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

   
  ProtectedComponent.displayName = `withRoleProtection(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ProtectedComponent;
};

export default adminroleprotection;
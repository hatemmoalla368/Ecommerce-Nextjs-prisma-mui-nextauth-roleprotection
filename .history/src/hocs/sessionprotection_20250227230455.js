// hocs/withRoleProtection.js
import { useSession } from 'next-auth/react'; // If using NextAuth.js
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const sessionprotection = (WrappedComponent, allowedRoles) => {
  const ProtectedComponent = (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Use useEffect to handle the redirection
    useEffect(() => {
      if (status === 'loading') {
        return; // Do nothing while loading
      }

      
      if (!session ) {
        router.push('/unauthorized');  
      }
    }, [session, status, router]);

     
    if (status === 'loading') {
      return <p>Loading...</p>;
    }

    
    if (session ) {
      return <WrappedComponent {...props} />;
    }

     
    return null;
  };

   
  ProtectedComponent.displayName = `withsessionProtection(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ProtectedComponent;
};

export default sessionprotection;
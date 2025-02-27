
import { useSession } from 'next-auth/react'; 
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const sessionprotection = (WrappedComponent, allowedRoles) => {
  const ProtectedComponent = (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();

     
    useEffect(() => {
      if (status === 'loading') {
        return;  
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
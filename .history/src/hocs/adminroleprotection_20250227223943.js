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

     
    if (session && allowedRoles.includes(session.user.role)) {
      return <WrappedComponent {...props} />;
    }

     
    return null;
  };

   
  ProtectedComponent.displayName = `withRoleProtection(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ProtectedComponent;
};

export default adminroleprotection;
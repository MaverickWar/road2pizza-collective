import { memo, useState } from 'react';
import TopNav from './TopNav';
import MainNav from './MainNav';
import { LoginDialog } from './LoginDialog';
import { useAuth } from './AuthProvider';

const Navigation = () => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { user } = useAuth();
  
  console.log('Rendering Navigation component');
  
  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full z-50">
        <TopNav onLoginClick={() => setShowLoginDialog(true)} />
        <MainNav />
      </header>

      {!user && (
        <LoginDialog 
          isOpen={showLoginDialog} 
          onClose={() => setShowLoginDialog(false)} 
        />
      )}
    </>
  );
};

export default memo(Navigation);
import TopNav from './TopNav';
import MainNav from './MainNav';

const Navigation = () => {
  console.log('Rendering Navigation component');
  
  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50">
      <TopNav />
      <MainNav />
    </header>
  );
};

export default Navigation;
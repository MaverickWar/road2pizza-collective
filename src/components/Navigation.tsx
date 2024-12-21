import TopNav from './TopNav';
import MainNav from './MainNav';

const Navigation = () => {
  return (
    <header className="fixed top-0 w-full z-50">
      <TopNav />
      <MainNav />
    </header>
  );
};

export default Navigation;
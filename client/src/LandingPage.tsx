import { useNavigate } from 'react-router-dom';
const LandingPage = () => {
  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken');
  const email = localStorage.getItem('userEmail');

  if (!authToken) {
    navigate('/login');
    return null;
  }

  return (
    <div className="flex flex-col align-center text-center w-75 h-20 px-10 rounded-md shadow-[0_0_5px_rgba(0,0,0,0.1)]">
      <p className="text-red-400 text-sm font-bold mt-5 mb-1 drop-shadow-xs">
        Welcome, {email ? email : 'User'}!
      </p>
    </div>
  );
};

export default LandingPage;

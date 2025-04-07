import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import LogIn from './LogIn';
import SignUp from './SignUp';
import LandingPage from './LandingPage';
import ProtectedRoute from './ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LogIn />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/landing-page" element={<LandingPage />}></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

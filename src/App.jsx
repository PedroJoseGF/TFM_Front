import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/userContext';
import Home from './views/Home/Home';
import NotFound from './views/NotFound/NotFound';
import Procedures from './views/Procedures/Procedures';
import MyFolder from './views/MyFolder/MyFolder';
import Advertisements from './views/Advertisements/Advertisements';
import Login from './views/Login/Login';
import Navbar from './layouts/Navbar/Navbar';
import Footer from './layouts/Footer/Footer';
import './App.css';

function App() {

  return (
    <UserProvider>
      <Router>
        <div className="app">
          <Navbar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/procedures/:type" element={<Procedures />} />
              <Route path="/myfolder/:type" element={<MyFolder />} />
              <Route path="/advertisements" element={<Advertisements />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </UserProvider>
  );
};

export default App;
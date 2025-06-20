import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/userContext';
import Home from './views/Home/Home';
import AdminUsers from './views/AdminUsers/AdminUsers';
import AdminAnnouncements from './views/AdminAnnouncements/AdminAnnouncements';
import AdminProcedures from './views/AdminProcedures/AdminProcedures';
import NotFound from './views/NotFound/NotFound';
import Procedures from './views/Procedures/Procedures';
import MyFolder from './views/MyFolder/MyFolder';
import Announcements from './views/Announcements/Announcements';
import Login from './views/Login/Login';
import RestorePassword from './views/RestorePassword/RestorePassword';
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
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/login" element={<Login />} />
              <Route path="/myfolder/profile/admin-users" element={<AdminUsers />} />
              <Route path="/myfolder/profile/admin-announcements" element={<AdminAnnouncements />} />
              <Route path="/myfolder/profile/admin-procedures" element={<AdminProcedures />} />
              <Route path="/restore-password/:id" element={<RestorePassword />} />
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
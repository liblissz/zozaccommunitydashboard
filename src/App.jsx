import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import {
  Menu, Bell, Moon, Sun, Search, DownloadCloud, ChevronRight, Filter,
  MoreVertical, Plus, CalendarCheck, DollarSign,

} from 'lucide-react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Main from './pages/MainContent/Main';
import Users from './pages/Users/Users';
import OurTeam from './pages/OurTeam/OurTeam';
import Posts from './pages/OurPost/Posts';
import LoginSignup from './pages/LoginSignup/LoginSignup';
import AccountSettings from './pages/Acountsettings/AccountSettings';
import AboutUser from './pages/AboutUser/AboutUser';
import PostVideo from './pages/OurPost/PostVideo';
import NotificationListener from './pages/NotificationListener/NotificationListener';
import Project from './pages/Project/Project';
import Analytics from './pages/Analytics/Analytics';
import Everyproject from './pages/EveryProject/Everyproject';
import Allprojects from './pages/Allprojects/Allprojects';
import Normaluser from './pages/Normaluser/Normaluser';
import UserOrders from './pages/UserOrders/UserOrders';



const App = () => {
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('auth-token'));

  useEffect(() => {
    const handleWindowResize = () => {
      setSidebarHidden(window.innerWidth <= 576);
    };
    window.addEventListener('resize', handleWindowResize);
    handleWindowResize();
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest('.notification') &&
        !e.target.closest('.profile')
      ) {
        document.querySelector('.notification-menu')?.classList.remove('show');
        document.querySelector('.profile-menu')?.classList.remove('show');
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleTheme = (e) => {
    document.body.classList.toggle('dark', e.target.checked);
  };

  const toggleSidebar = () => {
    setSidebarHidden(!sidebarHidden);
  };

  const toggleNotification = () => {
    document.querySelector('.notification-menu')?.classList.toggle('show');
    document.querySelector('.profile-menu')?.classList.remove('show');
  };

  const toggleProfile = () => {
    document.querySelector('.profile-menu')?.classList.toggle('show');
    document.querySelector('.notification-menu')?.classList.remove('show');
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  

  return (
    <BrowserRouter >
     <NotificationListener/>
      < >
        {!isLoggedIn ? (
          <LoginSignup onLoginSuccess={handleLoginSuccess} />
        ) : (
          <div className="app-container">
            <Sidebar sidebarHidden={sidebarHidden} />
            <section id="content">
              <Header
                notificationRef={notificationRef}
                profileRef={profileRef}
                toggleSidebar={toggleSidebar}
                toggleTheme={toggleTheme}
                toggleNotification={toggleNotification}
                toggleProfile={toggleProfile}
              />
             
              <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/Posts" element={<Posts />} />
                <Route path="/Users" element={<Users />} />
                <Route path="/Video" element={<PostVideo />} />
                <Route path="/Team" element={<OurTeam />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/addproject" element={<Project />} />
                <Route path="/allprojects" element={<Allprojects />} />
                <Route path="/orders" element={<UserOrders />} />
                <Route path="/normaluser/:id" element={<Normaluser/>}/>
                <Route path="/user/:id" element={<AccountSettings/>}/>
                 <Route path="/team/:id" element={<AboutUser/>}/>
                 <Route path="/everyproject/:id" element={<Everyproject/>}/>
                  <Route path="/everyproject/:id" element={<Everyproject/>}/>
                 
              </Routes>
            </section>
          </div>
        )}
      </>
    </BrowserRouter>
  );
};

export default App;

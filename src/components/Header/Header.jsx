import React, { useState, useEffect } from 'react';
import { Menu, Bell, Moon, Sun, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Header.css';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import toast, { Toaster } from 'react-hot-toast';

const Header = ({
  notificationRef,
  profileRef,
  toggleSidebar,
  toggleTheme,
  toggleNotification,
  toggleProfile,
}) => {
  const token = localStorage.getItem('auth-token');
  const [userprofile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [search, setsearch] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const res = await axios.get('https://zozacbackend.onrender.com/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserProfile(res.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const [admins, setadmins] = useState([])
  const [projects, setprojects] = useState([])

  // Polling every 10 seconds to check for new notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('https://zozacbackend.onrender.com/api/notifications');
        setNotifications(res.data);
      } catch (error) {
        console.error(error);
      }
    };

const fetchadmins = async()=>{
  try {
    setLoading(true)
    const res = await axios.get('https://zozacbackend.onrender.com/api/signup/admin');
    setadmins(res.data)
  } catch (error) {

    toast.error(error)
  }finally{
    setLoading(false)
  }
}
const fetchProjectsadmin = async()=>{
  try {
    setLoading(true)
    const res = await axios.get('https://zozacbackend.onrender.com/api/company/project/post');
    setprojects(res.data)
  } catch (error) {

    toast.error(error)
  }finally{
    setLoading(false)
  }
}
fetchProjectsadmin()
fetchadmins()

    fetchNotifications(); // initial load

    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000); // every 10 seconds

    return () => clearInterval(interval); // cleanup
  }, []);

  const handleLogout = () => {
    if (
      !window.confirm(
        'Are you sure you want to logout of this page? You will be prompted to log in again. This system is highly secured ☠'
      )
    ) {
      return;
    } else {
      localStorage.removeItem('auth-token');
      window.location.replace('/');
    }
  };

  return (
    <nav>
               <Toaster position="top-center" reverseOrder={false} />
      <Menu className="menu-toggle" id="menu" onClick={toggleSidebar} />

      <a href="#" className="nav-link">
        Categories
      </a>

      <form action="#">
        <div className="form-input">
          <input type="search" placeholder="Search..." autoComplete='disabled'  value={search} onChange={(e)=> setsearch(e.target.value)}/>
          <button type="submit" className="search-btn">
            <Search />
          </button>
        </div>
        <div className={search.length=== 0 ? "nonedisplay" :'search-content'}>
        
 <ul>


  {loading &&   <div className="all1"><ClipLoader/></div>}
  {admins.length === 0 && <p>no user found here</p>}
{/* Filter and render Projects */}
{projects.filter((project) =>
  project.title.toLowerCase().includes(search.toLowerCase()) ||
  project.description.toLowerCase().includes(search.toLowerCase())
).length === 0 ? (
  <p>No project found</p>
) : (
  projects
    .filter((project) =>
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase())
    )
    .map((project, index) => (
      <Link to={`/everyproject/${project._id}`} key={index}>
        <li>
          <img
            src={project.projectImg}
            alt="Project"
            style={{ width: "40px", borderRadius: "50%" }}
          />
          <p>{project.title}</p>
        </li>
      </Link>
    ))
)}

{/* Filter and render Admins */}
{admins.filter((admin) =>
  admin.username.toLowerCase().includes(search.toLowerCase())
).length === 0 ? (
  <p>No admin found</p>
) : (
  admins
    .filter((admin) =>
      admin.username.toLowerCase().includes(search.toLowerCase())
    )
    .map((admin, index) => (
      <Link to={`/team/${admin._id}`} key={index}>
        <li>
          <img
            src={admin.profileImage}
            alt="Admin"
            style={{ width: "40px", borderRadius: "50%" }}
          />
          <p>{admin.username}</p>
        </li>
      </Link>
    ))
)}


</ul>

  
        </div>
      </form>

      <input
        type="checkbox"
        className="checkbox"
        id="switch-mode"
        hidden
        onChange={toggleTheme}
      />

      <label className="swith-lm" htmlFor="switch-mode">
        <Moon className="blue" />
        <Sun className="blue" />
        <div className="ball"></div>
      </label>

      {notifications.length > 0 && (
        <>
          <a
            href="#"
            className="notification"
            ref={notificationRef}
            onClick={toggleNotification}
          >
            <Bell />
            <span className="num">{notifications.length}</span>
          </a>
          <div className="notification-menu">
            <ul>
              {loading && <ClipLoader />}
              {notifications.map((item, i) => (
                <li key={i}>
                  <strong>New picturePost Made: <br /> <br />
                  {item.title}</strong>: {item.message}
                  <br />
                  {notifications.date}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {loading && (
        <div className="loading-spinner">
          <ClipLoader />
        </div>
      )}

      {userprofile && (
        <>
          <a
            className="profile"
            style={{ cursor: 'pointer' }}
            ref={profileRef}
            onClick={toggleProfile}
          >
            <img src={userprofile.profileImage} alt="Profile"  />
          </a>

          <div className="profile-menu">
            <ul>
              <li>
                <a
                  style={{
                    color: 'blue',
                    fontSize: '19px',
                    textTransform: 'capitalize',
                  }}
                >
                  {userprofile.username}
                </a>
              </li>
              <Link to={`/user/${userprofile._id}`}>
                <li>
                  <a>Settings</a>
                </li>
              </Link>
              <li>
                <a style={{ cursor: 'pointer' }} onClick={handleLogout}>
                  Log Out
                </a>
              </li>
            </ul>
          </div>
        </>
      )}
    </nav>
  );
};

export default Header;

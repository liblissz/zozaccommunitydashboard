import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import './AboutUser.css';
import { Bell, BellIcon, MessageCircleIcon, PhoneIcon, ProjectorIcon, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import StarRating from '../Acountsettings/StarRating';

const AboutUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBioShortened, setIsBioShortened] = useState(true);
  const [project, setproject] = useState([])
  const bioText = user?.about || "No bio available.";
  const shortenedBio = bioText.substring(0, 100) + "...";
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`https://zozacbackend.onrender.com/api/user/${id}`);
        if (res.status === 200) {
          setUser(res.data);
       
        }
      } catch (error) {
        console.error(error);
        toast.error("User not found");
      } finally {
        setLoading(false);
      }
    };



    const fetchproject = async () => {
      try {
        const fetchuserproject = await axios.get(`https://zozacbackend.onrender.com/api/user/add-project/${id}`)
        setproject(fetchuserproject.data)
       
      } catch (error) {
        toast.error(error)
      }

    }
    fetchUser();
    fetchproject()

  }, [id]);


  const pieChartData = {
    labels: project.map((item) => item.title),
    datasets: [
      {
        label: "Projects",
        data: project.map((item) => item.completed ? 1 : 0),
        backgroundColor: [
          "#36A2EB",
          "#FF6384",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#8A2BE2",
          "#00CED1",
          "#FF4500",
          "#228B22",
        ],
        borderColor: "#333",
        borderWidth: 1,
      },
    ],
  };
  const [hovered, setHovered] = useState(null);
  const token = localStorage.getItem('auth-token'); // if user token is needed

const handleRatingChange = async (projectId, rating) => {
  try {
    const response = await axios.put(
      `https://zozacbackend.onrender.com/api/user/rate-project/${id}/${projectId}`,  // Adjust the URL to your API
      { rating },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const updatedProject = response.data;

    // Update the project state locally to refresh UI with new rating data
    setproject((prevProjects) =>
      prevProjects.map((proj) => (proj._id === projectId ? updatedProject : proj))
    );

    toast.success('Rating updated!');
  } catch (error) {
    toast.error('Failed to update rating');
    console.error(error);
  }
};


  if (loading) return <div className='loading'><ClipLoader className='clip' size={50} /></div>;
  if (!user) return <p className="text-center text-danger">User not found </p>;

  return (
    <>


      <div className="container">
        <div className="profile-header">
          <div className="profile-img">
            <a href={user.profileImage} target="_blank" rel="noopener noreferrer" >
              <img src={user?.profileImage || './bg.jpg'} width="200" alt="Profile" />
            </a>
          </div>
          <div className="profile-nav-info">
            <h3 className="user-name">{user?.username}</h3>
            <div className="address">
              <p id="state" className="state">{user.email}</p>
              <span id="country" className="country"></span>
            </div>
          </div>
          <div className="profile-option">
            <div className="notification notify">
              <ProjectorIcon />
              <span className="alert-message">{project.length}</span>
            </div>
          </div>
        </div>

        <div className="main-bd">
          <div className="left-side">
            <div className="profile-side">
              <p className="mobile-no"><PhoneIcon size={19} /> {user?.number}</p>
              <p className="user-mail"><MessageCircleIcon size={19} /> {user?.email}</p>
              <div className="user-bio">
                <h3>User Bio:</h3>
                <p className="bio">
                  {isBioShortened ? (
                    <>
                      {shortenedBio}
                      <span onClick={() => setIsBioShortened(false)} id="see-more-bio"> See More</span>
                    </>
                  ) : (
                    <>
                      {bioText}
                      <span onClick={() => setIsBioShortened(true)} id="see-less-bio"> See Less</span>
                    </>
                  )}
                </p>
              </div>
              <div className="profile-btn">
                <a href={`tel: ${user.number}`} > <button className="chatbtn" id="chatBtn"><PhoneIcon /> Call</button></a>
                <a href={`mailto :${user.email} `}><button className="createbtn" id="Create-post"><MessageCircleIcon /> Email</button></a>
              </div>
              <div className="user-rating">
                <h3 className="rating" style={{ fontSize: "32px" }}>Projects</h3>
                <div className="rate">
                  <div className="star-outer">
                    <div className="star-inner">
                      <Star size={15} className="text-yellow-500" />
                      <Star size={15} className="text-yellow-500" />
                      <Star size={15} className="text-yellow-500" />
                      <Star size={15} className="text-yellow-500" />
                      <Star size={15} className="text-yellow-500" />
                    </div>
                  </div>
                  <span className="no-of-user-rate"><span>{project.length}</span>&nbsp;&nbsp;Projects</span>
                </div>
              </div>
            </div>
          </div>

          <div className="right-side">

            <div className="profile-body" >

          
            </div>
          </div>
              <div className='chartssection' style={{ width: '100%', maxWidth: '600px', height: "450px",  margin: '10px auto' }}>
                <h3 style={{ textAlign: 'center' }}>Project Status Overview</h3>

                {project.length > 0 ?
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={project.map((item, index) => ({ name: item.title, value: item.completed ? 1 : 0 }))}
                        cx="50%"
                        cy="50%"
                        label
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {
                          project.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={pieChartData.datasets[0].backgroundColor[index % pieChartData.datasets[0].backgroundColor.length]} />
                          ))
                        }
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer> :
                  <p>No project to show</p>}



              </div>

        </div>
        
      </div>







<div className="mto">
<ResponsiveContainer className={"allunit"} width="70%" height={400}>
  <BarChart
    data={project.map(item => ({
      title: item.title,
      Completed: item.completed ? 1 : 0,
      Incomplete: item.completed ? 0 : 1,
    }))}
    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
  >
    <XAxis dataKey="title" />
    <YAxis allowDecimals={false} />
    <Tooltip />
    <Legend />
    <Bar dataKey="Completed" fill="#36A2EB" />
    <Bar dataKey="Incomplete" fill="#FF6384" />
  </BarChart>
</ResponsiveContainer>
</div>





<div className='up'>
      <div className="search-container">
  <input
    type="text"
    placeholder="🔍 Search projects..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="search-input"
  />
</div>

     <div className="fleproject">
     
{project
.filter(item=>(
  item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
   item.description.toLowerCase().includes(searchTerm.toLowerCase())
))

.map((item, i) => (
  <div className="project-card" key={i}>
    <img src={item.imageUrlwork} alt={item.title} className="project-image" />

    <div className="project-content">
      <h3 className="project-title">{item.title}</h3>
      <p className="project-description">{item.description}</p>
      <p className="project-description"> Created on: {new Date(item.date).toLocaleString()}</p>

      <StarRating
        rating={item.averageRating || 0}
        onRate={(rate) => handleRatingChange(item._id, rate)}
      />

    <p style={{ marginTop: 4 }} className='rate'>
  Average rating: {
    item.ratings?.length
      ? (item.ratings.reduce((sum, r) => sum + r.value, 0) / item.ratings.length).toFixed(1)
      : "0.0"
  } ⭐ ({item.ratings?.length || 0} ratings)
</p>


      <a href={item.GithubLink} target="_blank" rel="noopener noreferrer" className="github-link">
        🔗 View on GitHub
      </a>

      <p className={`project-status ${item.completed ? 'completed' : 'incomplete'}`}>
        {item.completed ? '✅ Completed' : '🚧 In Progress'}
      </p>
    </div>
  </div>
))}

</div>
</div>

    </>
  );
};

export default AboutUser;

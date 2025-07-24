import React, { useEffect, useState } from 'react';
import './Account.css';
import Shownav from '../../components/SHownav/Shownav';
import upload from '../../assets/upload_area.svg';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { StarIcon } from 'lucide-react';
import StarRating from './StarRating'; // adjust path as needed


const AccountSettings = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [enable, setEnable] = useState(true);
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    number: '',
    about: '',
  });

  const token = localStorage.getItem('auth-token');
  const [projectdetails, setprojectdetails] = useState([]);




  // Keep track of current user ratings per project locally
const [userRatings, setUserRatings] = useState({});

// When fetching projects, also fetch user ratings if available
useEffect(() => {
  const fetchAll = async () => {
    try {
      const profileRes = await axios.get('https://zozacbackend.onrender.com/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(profileRes.data);

      setFormData({
        username: profileRes.data.username,
        email: profileRes.data.email,
        number: profileRes.data.number,
        about: profileRes.data.about,
      });

      const projectRes = await axios.get(`https://zozacbackend.onrender.com/api/user/projects/${profileRes.data._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setprojectdetails(projectRes.data);

      const ratings = {};
      projectRes.data.forEach(proj => {
        ratings[proj._id] = proj.userRating || 0;
      });

      setUserRatings(ratings);
    } catch (error) {
      toast.error("Error loading data");
      console.error(error);
    }
  };

  fetchAll();
}, []);






  const handleEnableToggle = (e) => {
    e.preventDefault();
    setEnable(!enable);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const [projectpic, setprojectpic] = useState(null);
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [completed, setcompleted] = useState(false);
  const [GithubLink, setGithubLink] = useState("");

  const uploadprojectpic = async () => {
    if (!projectpic) return null;
    const data = new FormData();
    data.append('file', projectpic);
    data.append('upload_preset', 'images-zozac');
    try {
      const res = await axios.post('https://api.cloudinary.com/v1_1/dbq5gkepx/image/upload', data);
      return res.data.secure_url;
    } catch (error) {
      toast.error('Image upload failed', error);
      return null;
    }
  };

 const handleSubmitproject = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    // Upload image first
    const uploaded = await uploadprojectpic(); // Make sure this returns a valid URL

    // Send project data to backend
    await axios.post(`https://zozacbackend.onrender.com/api/user/add-project/${user._id}`, {
      title,
      description,
      completed,
      GithubLink,
      imageUrlwork: uploaded
    });

    toast.success("✅ Project uploaded successfully!");

    // Reset form
    settitle("");
    setdescription("");
    setcompleted(false);
    setGithubLink("");
    setprojectpic(null);

  } catch (error) {
    toast.error("❌ Project submission failed");
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  const uploadFile = async () => {
    if (!image) return null;
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'images-zozac');
    try {
      const res = await axios.post('https://api.cloudinary.com/v1_1/dbq5gkepx/image/upload', data);
      return res.data.secure_url;
    } catch (error) {
      toast.error('Image upload failed', error);
      return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let imageUrl = user.profileImage;
      if (image) {
        const uploaded = await uploadFile();
        if (!uploaded) return;
        imageUrl = uploaded;
      }
      await axios.put(`https://zozacbackend.onrender.com/user/edit/${user._id}`, {
        ...formData,
        profileImage: imageUrl,
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Update failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const pieChartData = {
    labels: projectdetails.map((item) => item.title),
    datasets: [
      {
        label: "Projects",
        data: projectdetails.map((item) => item.completed ? 1 : 0),
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

  const [searchTerm, setSearchTerm] = useState("");

  if (loading) return <div className='loading'><ClipLoader className='clip' size={50} /></div>;






const handleRatingChange = async (projectId, rating) => {
  try {
    // PUT rating for this project by this user to backend
    await axios.put(
      `https://zozacbackend.onrender.com/api/user/rate-project/${user._id}/${projectId}`,
      { rating },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Update local userRatings state for immediate UI feedback
    setUserRatings((prev) => ({
      ...prev,
      [projectId]: rating,
    }));

    toast.success('Rating updated!');
  } catch (error) {
    toast.error('Failed to update rating');
    console.error(error);
  }
};








  return (
    <>
      <div className='bv'>
        <Toaster position="top-center" reverseOrder={false} />
        <main>
          <Shownav name="Your Profile" />
        </main>
        <div id="card">
          <img id="avatar" src={image ? URL.createObjectURL(image) : user.profileImage || upload} alt="avatar" />
          <div id="info">
            <div>
              <p id="name">{formData.username}</p>
              <p id="activity">{formData.about}</p>
            </div>
            <form onSubmit={handleSubmit} className='formal'>
              <div className="wraping">
                <input type="text" name="username" value={formData.username} onChange={handleChange} disabled={enable} />
                <b onClick={handleEnableToggle}>edit</b>
              </div>
              <div className="wraping">
                <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={enable} />
                <b onClick={handleEnableToggle}>edit</b>
              </div>
              <div className="wraping">
                <input type="text" name="number" value={formData.number} onChange={handleChange} disabled={enable} />
                <b onClick={handleEnableToggle}>edit</b>
              </div>
              <div className="wraping">
                <input type="text" name="about" value={formData.about} onChange={handleChange} disabled={enable} />
                <b onClick={handleEnableToggle}>edit</b>
              </div>
              <div className="wraping">
                <label htmlFor="image-input">
                  <img src={image ? URL.createObjectURL(image) : user.profileImage || upload} alt="Upload" className="addproduct-thumbnail-image" />
                </label>
                <input id="image-input" type="file" accept="image/*" hidden onChange={handleImageChange} />
              </div>
              <button id="btn" type="submit" style={{ cursor: loading ? "not-allowed" : "pointer" }} disabled={loading}>
                {loading ? <ClipLoader /> : "Update"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className='all'>
        <form onSubmit={handleSubmitproject} className='unsubmit'>
          <div className="inputcontent">
            <input type="text" value={title} onChange={(e) => settitle(e.target.value)} placeholder='Title*' />
          </div>
          <div className="inputcontent">
            <input type="text" value={description} onChange={(e) => setdescription(e.target.value)} placeholder='description*' />
          </div>
          <div className="inputcontent">
            <input type="text" value={GithubLink} onChange={(e) => setGithubLink(e.target.value)} placeholder='GithubLink*' />
          </div>
          <div className="inputcontent">
            <label htmlFor="project-image-input">
              <img src={projectpic ? URL.createObjectURL(projectpic) : upload} alt="Upload" className="addproduct-thumbnail-imag" />
            </label>
            <input id="project-image-input" type="file" accept="image/*" hidden onChange={(e) => setprojectpic(e.target.files[0])} />
          </div>
          <div className="inputcontent">
            <label htmlFor="">completed?</label>
            <input type="checkbox" className='err' checked={completed} onChange={(e) => setcompleted(e.target.checked)} />
          </div>
          <div className="inputcontent">
            <button type='submit' disabled={loading}>{loading ? <ClipLoader /> : "Submit Project"}</button>
          </div>
        </form>
      </div>

      <div className='chartssection' style={{ width: '100%', maxWidth: '500px', margin: '40px auto' }}>
        <h3 style={{ textAlign: 'center' }}>Project Status Overview</h3>
        
      {projectdetails.length > 0 ? (
  <ResponsiveContainer width="100%" height={400}>
    <PieChart>
      <Pie
        data={projectdetails.map(item => ({
          name: item.title,
          value: item.completed ? 1 : 0
        }))}
        cx="50%"
        cy="50%"
        outerRadius={150}
        fill="#8884d8"
        label
        dataKey="value"
      >
        {projectdetails.map((_, index) => (
          <Cell
            key={`cell-${index}`}
            fill={pieChartData.datasets[0].backgroundColor[
              index % pieChartData.datasets[0].backgroundColor.length
            ]}
          />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
) : (
  <p style={{ textAlign: 'center' }}>No projects available for chart</p>
)}

      </div>

      
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



      {projectdetails
  .filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .map((item, i) => (
    <div className="project-card" key={item._id || i}>
      <img src={item.imageUrlwork} alt={item.title} className="project-image" />

      <div className="project-content">
        <h3 className="project-title">{item.title}</h3>
        <p className="project-description">{item.description}</p>

        <a href={item.GithubLink} target="_blank" rel="noopener noreferrer" className="github-link">
          🔗 View on GitHub
        </a>

        <p className={`project-status ${item.completed ? 'completed' : 'incomplete'}`}>
          {item.completed ? '✅ Completed' : '🚧 In Progress'}
        </p>

        <div className="rating-section">
          <label>Rate this project:</label>
          <StarRating
        rating={item.averageRating || 0}
        onRate={(rate) => handleRatingChange(item._id, rate)}
      />

    <p style={{ marginTop: 4 }}>
  Average rating: {
    item.ratings?.length
      ? (item.ratings.reduce((sum, r) => sum + r.value, 0) / item.ratings.length).toFixed(1)
      : "0.0"
  } ⭐ ({item.ratings?.length || 0} ratings)
</p>

        </div>
      </div>
    </div>
  ))
}

     
{/* {projectdetails
  .filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .map((item, i) => (
    <div className="project-card" key={i}>
      <img src={item.imageUrlwork} alt={item.title} className="project-image" />

      <div className="project-content">
        <h3 className="project-title">{item.title}</h3>
        <p className="project-description">{item.description}</p>
       <p>rating</p>
       <p>
<StarIcon/>
<StarIcon/>
<StarIcon/>
<StarIcon/>
<StarIcon/>
       </p>
       
        <a href={item.GithubLink} target="_blank" rel="noopener noreferrer" className="github-link">
          🔗 View on GitHub
        </a>

        <p className={`project-status ${item.completed ? 'completed' : 'incomplete'}`}>
          {item.completed ? '✅ Completed' : '🚧 In Progress'}
        </p>
      </div>
    </div>
  ))} */}
  

</div>


    </>
  );
};

export default AccountSettings;

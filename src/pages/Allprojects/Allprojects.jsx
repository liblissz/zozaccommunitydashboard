import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';


const Allprojects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [projectdetails, setProjectdetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('https://zozacbackend.onrender.com/api/company/project/post');
        setProjectdetails(res.data);
      } catch (error) {
        toast.error('Failed to load projects');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

 

  if (loading)
    return (
      <div className="loading">
        <ClipLoader className="clip" size={50} />
      </div>
    );

  const filteredProjects = projectdetails.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
  
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


        {filteredProjects.map((item, i) => (
           
          <div className="project-card" key={i}>
            
            <img
              src={item.projectImg || "https://via.placeholder.com/300x200"}
              alt={item.title}
              className="project-image"
            />

            <div className="project-content">
              <h3 className="project-title">{item.title}</h3>
              <p className="project-description">{item.description}</p>

            

              <p className={`project-status ${item.isCompleted ? 'completed' : 'incomplete'}`}>
                {item.isCompleted ? '✅ Completed' : '🚧 In Progress'}
              </p>

             <Link to={`/everyproject/${item._id}`}><button className='btn'>Know More</button></Link>
           
              
            </div>
           
          </div>
          
        ))}
      </div>
    </>
  );
};

export default Allprojects;

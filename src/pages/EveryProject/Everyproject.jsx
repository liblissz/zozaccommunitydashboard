import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import upload from '../../assets/upload_area.svg';
import { ClipLoader } from 'react-spinners';
import './Everyproject.css'

const Everyproject = () => {
  const { id } = useParams();
  const [info, setInfo] = useState(null);
   const [image, setImage] = useState(null);
    const [completed, setcompleted] = useState(false)
    const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await axios.get(`https://zozacbackend.onrender.com/api/company/project/post/${id}`);
        setInfo(res.data);
      } catch (error) {
        toast.error("Failed to fetch project data.");
        console.error(error);
      }
    };

    fetchInfo();
  }, [id]);

  if (!info) return <p style={{ padding: "20px" }}>Loading project...</p>;

  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "Invalid Date" : d.toLocaleDateString();
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

  

  const handleSubmitproject = async (e) => {
    e.preventDefault();
    try {

      setLoading(true);
        const uploaded = await uploadFile();

      if (image) {
        if (!uploaded) return;
      }
   await axios.put(`https://zozacbackend.onrender.com/api/company/project/post/${id}`,
   {
    projectImg: uploaded,
     isCompleted: completed
   }
   );
      toast.success("status updated successfully");
    } catch (error) {
      toast.error("Update failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
   <>
   
 {info.projectImg === null ?
<p  className="for">upload and image for this project</p>
  : <div className="for">
    <div className="content-wrapper">
      <div className="card">
        <div className="card-image">
          <img src={info.projectImg} alt="Card visual" />
        </div>
        <div className="card-body">
          <div className="card-tags">
         
              <div className="tag" >{info.isCompleted ? "✅ Completed" : "⏳ Pending"}</div>
          
          </div>
          <div className="card-content">
            <div className="card-title">{info.title}</div>
            <p>{info.description}</p>
          </div>
          <div className="card-footer">
            <button className="card-btn">Project view</button>
          </div>
        </div>
      </div>
    </div>
    </div>}
   
   
   
   
   
   
   
   
   
   
   
    <div className="project-wrapper">
      <h2 className="project-title" >{info.title || "Untitled Project"}</h2>

      <div className="project-info" >
        <p><strong>Description:</strong> {info.description || "No description provided."}</p>
        <p><strong>Category:</strong> {info.category || "N/A"}</p>
        <p><strong>Impact:</strong> {info.impact || "N/A"}</p>
        <p><strong>Budget:</strong> {info.budget ? `${info.budget} frs` : "N/A"}</p>
        <p><strong>Expected Completion:</strong> {info.expectedCompletionTime ? `${info.expectedCompletionTime} hrs` : "N/A"}</p>
        <p><strong>Start Date:</strong> {formatDate(info.startDate)}</p>
        <p><strong>End Date:</strong> {formatDate(info.endDate)}</p>
    
        <p><strong>Status:</strong> {info.isCompleted ? "✅ Completed" : "⏳ Pending"}</p>
      </div>
    </div>
 <form onSubmit={handleSubmitproject} className="project-form">
          
          <div className="inputcontent">
            <label htmlFor="">image for this project:</label>
            <label htmlFor="project-image-input">
              <img src={image ? URL.createObjectURL(image) : upload} alt="Upload" className="addproduct-thumbnail-imag" />
            </label>
            <input id="project-image-input" type="file" accept="image/*" hidden onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="inputcontent">
            <label htmlFor=""> completed:</label>
            <input type="checkbox" className='err' checked={completed} onChange={(e) => setcompleted(e.target.checked)} />
          </div>
          <div className="inputcontent">
            <button type='submit' disabled={loading}>{loading ? <ClipLoader /> : "Update Status"}</button>
          </div>
          </form>
    </>
  );
};

export default Everyproject;

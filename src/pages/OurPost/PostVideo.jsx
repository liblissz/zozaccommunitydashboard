import React, { useState } from 'react';
import upload from '../../assets/upload_area.svg';
import { UploadIcon } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';


const PostVideo = () => {
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [Loading, setLoading] = useState(false);

  const uploadVideoFile = async () => {
    if (!video) {
      toast.error('No video file selected');
      return null;
    }

    const data = new FormData();
    data.append('file', video);
    data.append('upload_preset', 'video-zozac'); // Correct preset

    try {
        setLoading(true)
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dbq5gkepx/video/upload',
        data
      );
      return res.data.secure_url;
    } catch (error) {
      console.error('❌ Video upload failed:', error);
      toast.error('Video upload failed');
      return null;
    }finally{
        setLoading(false)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !desc || !price) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!video) {
      toast.error('Please select a video file');
      return;
    }

    try {
      setLoading(true);
      const videoUrl = await uploadVideoFile();
     

      if (!videoUrl) return;

      // OPTIONAL: send to backend
      await axios.post('https://zozacbackend.onrender.com/admin/video/post', {
        title: title,
         content: desc, 
         price:price , 
         VidUrl:videoUrl
      });
   

      setVideo(null);
      setTitle('');
      setDesc('');
      setPrice('');

    } catch (error) {
      console.error(error);
      toast.error('❌ Error posting video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="whole">
           <Toaster position="top-center" reverseOrder={false} />
      <form className='form' onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title" className="label">Title:</label>
          <input type="text" className='inputs' value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <label htmlFor="desc" className="label">Description:</label>
          <input type="text" className='inputs desc' value={desc} onChange={(e) => setDesc(e.target.value)} />
        </div>

        <div>
          <label htmlFor="price" className="label">Price:</label>
          <input type="text" className='inputs' value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>

        <div className="addproduct-itemfield">
          <label htmlFor="video-input" className='label1'>Video*</label>
          <label htmlFor="video-input" style={{ cursor: 'pointer' }}>
            {video ? (
              <video
                src={URL.createObjectURL(video)}
                controls
                width="200"
                height="150"
                style={{ display: 'block', marginBottom: '10px' }}
              />
            ) : (
              <img
                src={upload}
                alt="Upload Video"
                className="addproduct-thumbnail-image"
                width="100"
                height="100"
              />
            )}
          </label>
          <input
            id="video-input"
            type="file"
            accept="video/*"
            hidden
            onChange={(e) => setVideo(e.target.files[0])}
          />
        </div>

        <button type="submit" className={Loading? "restricted-area" :'btn'} disabled={Loading}>
          {Loading ? <ClipLoader size={18} /> : <>Post <UploadIcon /></>}
        </button>
      </form>
    </div>
  );
};

export default PostVideo;

import React, { useEffect, useState } from 'react';
import Shownav from '../../components/SHownav/Shownav';
import upload from '../../assets/upload_area.svg';
import rating from '../../assets/rating_starts.png'

import './Posts.css';
import { ArrowBigRightIcon, CommandIcon, Heart, ListCheckIcon, MessageCircle, Send, ShareIcon, Upload, UploadIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
const Posts = () => {
  const [image, setImage] = useState(null);

  const [makepost, setmakepost] = useState(false)
  const [isvideo, setisvideo] = useState(true)
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };


  const [Loading, setLoading] =useState(false)
  const [title, settitle] = useState("")
  const [content, setcontent] = useState("")
  const [price, setprice] = useState("")




const uploadFile = async () => {
    if (!image) {
      toast.error('Unable to upload image, file is missing');
      return null;
    }

    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'images-zozac');

    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dbq5gkepx/image/upload',
        data
      );
      const { secure_url } = res.data;
      return secure_url;
    } catch (error) {
      console.error('❌ Error uploading image:', error.response?.data || error);
      toast.error('Image upload failed');
      return null;
    }
  };

  // Signup form submit
  const handleSubmitSignup = async (e) => {
    e.preventDefault();

    if (!title || !content || !price) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!image) {
      toast.error('Please select an image');
      return;
    }

    try {
      setLoading(true);

      const imgURL = await uploadFile();

      if (!imgURL) {
        return;
      }

      const response = await axios.post('https://zozacbackend.onrender.com/admin/picture/post', {
        title: title,
        content: content,
        price: price,
        ImageUrl: imgURL,
      });
 if(response.status === 200){
  toast.success("Post Made Sucessfully")
 }
      // Reset form
      setcontent("")
      settitle("")
      setprice("")
      setImage(null);

    } catch (error) {
      toast.error(error.response?.data?.message || 'Error during signup');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [picturepost, setpicturepost] = useState([])
    const [videopost, setvideopost] = useState([])

  useEffect(()=>{
     
    const fetchPicturePosts = async ()=>{
      try {
          setLoading(true)
        const fetch = await axios.get("https://zozacbackend.onrender.com/admin/picture/post")
        setpicturepost(fetch.data)
      } catch (error) {
        toast.error("error fetching posts", error)
      }finally{
          setLoading(false)
      }
    }
fetchPicturePosts()

const fetchVideoPosts = async ()=>{
  try {
    setLoading(true)
  const res = await axios.get("https://zozacbackend.onrender.com/admin/video/post")
    setvideopost(res.data)

  } catch (error) {
    toast.error(error)
  }finally{
    setLoading(false)
  }
  
}
fetchVideoPosts()
  },[])






  return (
    <>
     <Toaster position="top-center" reverseOrder={false} />
      <main>
        <Shownav name="Posts" />
      </main>
      {makepost ?
        <>
    <button className='btn' onClick={() => setmakepost(false)}>various Post <ArrowBigRightIcon /></button>
     <Link to={'/Video'}> <button className='btn'>Post a video</button></Link>
 </>
        :
      
   <button className='btn' onClick={() => setmakepost(true)}>make a Post <ArrowBigRightIcon /></button>
     
   }

 
{
  makepost?  "" : (isvideo? <button className='btn' onClick={()=> setisvideo(false)} >Veiw Picture   <ArrowBigRightIcon /></button>:
    <button className='btn'onClick={()=> setisvideo(true)}  >Veiw Video  <ArrowBigRightIcon /></button>
  )
}
      {makepost  ? <div className="middle">
        <div className="postprompt">
          <form className='form' onSubmit={handleSubmitSignup}>
            <div>
              <label htmlFor="title" className="label">Title:</label>
              <input type="text" name="title" className='inputs' placeholder="Title*"
              value={title}
              onChange={(e) => settitle(e.target.value)}  />
            </div>

            <div>
              <label htmlFor="desc" className="label">Description:</label>
              <input type="text" name="desc" className='inputs desc' placeholder="Description*" 
              value={content}
              onChange={(e)=> setcontent(e.target.value)} />
            </div>
             <div>
              <label htmlFor="price" className="label">Price:</label>
              <input type="text" name="price" className='inputs' placeholder="Price*"  
              value={price}
              onChange={(e)=> setprice(e.target.value)}/>
            </div>
            <div id="file">
           


              <div className="addproduct-itemfield">
                <label htmlFor='image-input' className='label1'>Image*</label>
                <label htmlFor="image-input">
                  <img
                    src={image ? URL.createObjectURL(image) : upload}
                    alt="Upload Image"
                    className="addproduct-thumbnail-image"
                  />
                </label>
                <input
                  id="image-input"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </div>
            </div>
           
            <button type="submit" className={Loading? "restricted-area" :'btn'} disabled={Loading}>{Loading?  <ClipLoader/> : <>Post <UploadIcon /></>}</button>



          </form>

        </div>

      </div> :

// various posts


( isvideo ? 
<>
{Loading && <div className='middle'><ClipLoader/></div>}

  {videopost.map((item, i) => (
    <div className='wrapper' key={i}>
      <div className='picture-item'>
        <div className='picture-item-img-container'>
          <video src={item.VidUrl} className="picture-item-image" controls />
          <div className="picture-item-counter"></div>
        </div>

        <div className="picture-item-info">
          <div className="picture-item-rating">
            <p>{item.title}</p>
            <img src={rating} alt="Rating" />
          </div>
          <div id="position">
            <p className="picture-item-decription">{item.description}</p>
            <p className="picture-item-price">Price:</p>
            <p className="picture-item-price">{item.price}</p>
          </div>

          
        </div>
      </div>
    </div>
  ))}
</>

:
<div>
{Loading && <div className='middle'><ClipLoader/></div>}
  {picturepost.map((item, i) => (
    <div className='wrapper' key={i}>
      <div className='picture-item'>
        <div className='picture-item-img-container'>
          <img
            src={item.ImageUrl}
            alt={item.title}
            className="picture-item-image"
          />
          <div className="picture-item-counter"></div>
        </div>

        <div className="picture-item-info">
          <div className="picture-item-rating">
            <p>{item.title}</p>
            <img src={rating} alt="rating" />
          </div>
          <div id="position">
            <p className="picture-item-decription">{item.content}</p>
            <p className="picture-item-pric">Price:</p>
            <p className="picture-item-price">{item.price}</p>
          </div>

          
        </div>
      </div>
    </div>
  ))}
</div>

)
}
    </>
  );
};

export default Posts;

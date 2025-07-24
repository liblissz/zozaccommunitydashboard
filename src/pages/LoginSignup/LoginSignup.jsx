import React, { useRef, useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { Turtle, UserIcon } from 'lucide-react';
import upload from '../../assets/upload_area.svg';
import './LoginSignup.css';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';




const LoginSignup = () => {
  const signupPasswordRef = useRef(null);
  const loginPasswordRef = useRef(null);
  const toggleRef = useRef(null);



  const [signup, setSignup] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Controlled form states
  const [username, setUsername] = useState('');
  const [about, setAbout] = useState('');
  const [number, setNumber] = useState('');
  const [email, setUseremail] = useState('');
  const [password, setPassword] = useState('');

  //for login'

  const [emailcheck, setemailcheck] = useState("")
  const [passwordcheck, setpasswordcheck] = useState("")
  const navigate = useNavigate('')
  useEffect(() => {
    const toggle = toggleRef.current;
    const input = signup ? signupPasswordRef.current : loginPasswordRef.current;

    const handleToggle = () => {
      if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
        toggle.classList.toggle('form__pass-toggle--active');
      }
    };

    if (toggle) toggle.addEventListener('click', handleToggle);

    const follower = document.querySelector('.cursor-follower');
    const move = (e) => {
      if (follower) {
        follower.style.top = `${e.clientY}px`;
        follower.style.left = `${e.clientX}px`;
      }
    };
    document.addEventListener('mousemove', move);

    return () => {
      if (toggle) toggle.removeEventListener('click', handleToggle);
      document.removeEventListener('mousemove', move);
    };
  }, [signup]);

  // Upload picture handler
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

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

    if (!username || !about || !number || !email || !password) {
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
        setLoading(false);
        return;
      }

      const response = await axios.post('https://zozacbackend.onrender.com/api/signup/admin', {
        username,
        email,
        about,
        number,
        password,
        profileImage: imgURL,
      });

      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem('auth-token', token);
        toast.success(response.data.message || 'User registered successfully!');
        window.location.replace('/');
        // Navigate to dashboard or homepage after signup
        // navigate('/dashboard');
      } else {
        toast.error('Signup failed');
      }

      // Reset form
      setUsername('');
      setAbout('');
      setNumber('');
      setPassword('');
      setUseremail('');
      setImage(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error during signup');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("https://zozacbackend.onrender.com/api/login/admin", {
        email: emailcheck,
        password: passwordcheck,
      });

      const token = response.data.token;

      if (token) {
        localStorage.setItem("auth-token", token);
        toast.success("You have successfully logged in 🤩");
        navigate('/')
        window.location.replace('/');
        // Redirect to dashboard if needed
      } else {
        toast.error("Token not received. Login failed.");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        (error.response?.status === 401
          ? "Incorrect password"
          : error.response?.status === 404
            ? "User not found 🤕"
            : "Login failed");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  const [OTP, setOTP] = useState(false)






 const [emailupdate, setEmailup] = useState('');
const [otp, setOtp] = useState('');
const [newPassword, setNewPassword] = useState('');
const [step, setStep] = useState(1);
const [message, setMessage] = useState('');

const sendOtp = async (e) => {
  e.preventDefault()
  try {
    setLoading(true)
    const res = await axios.post('https://zozacbackend.onrender.com/api/auth/request-reset-password', { email : emailupdate });
    if (res.data.success) {
      
      if (res.data.message === "OTP sent to your email") {
  alert('OTP sent to your email.');
  setStep(2);
  alert("OTP sent successfully");
} else {
  setMessage(res.data.message || "Unexpected response");
  alert(res.data.message || "Unexpected response")
}

    }
  } catch (err) {
    setMessage(err.response?.data?.error || "Error sending OTP");
    alert(err)
  }
  finally{
    setLoading(false)
  }
};
const [emailnow, setemailnow] = useState("")

const verifyOtp = async (e) => {
      e.preventDefault()
  try {
  setLoading(true)
    const res = await axios.post('https://zozacbackend.onrender.com/api/auth/reset-password', {
      email: emailnow, 
      otp: otp,
      newPassword: newPassword
    });

    if (res.status === 200) {
      setMessage("OTP Verified! Enter your new password.");
      setStep(3);
    } else {
      setMessage(res.data.message || "OTP verification failed");
    }
  } catch (err) {
    setMessage(err.response?.data?.message || "Verification failed");
  }finally{
    setLoading(false)
  }
};





  return (
   <>
   {OTP && (
  <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
    <h2 className="text-2xl font-bold mb-4 text-center">🔐 Password Reset</h2>

    {step === 1 && (
      <form onSubmit={sendOtp}>
        <input
          className="w-full p-2 border mb-4 rounded"
          type="email"
          placeholder="Enter your email"
          value={emailupdate}
          onChange={(e) => setEmailup(e.target.value)}
        />
        <button
          type='submit'
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading? <ClipLoader/> :"Send OTP"}
        </button>
      </form>
    )}

    {step === 2 && (
      <div>
        <input
          className="w-full p-2 border mb-4 rounded"
          type="text"
          placeholder="Enter Email*"
          value={emailnow}
          onChange={(e) => setemailnow(e.target.value)}
        />
        <input
          className="w-full p-2 border mb-4 rounded"
          type="text"
          placeholder="Enter OTP*"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
          <input
          className="w-full p-2 border mb-4 rounded"
          type="password"
          placeholder="New Password*"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          onClick={verifyOtp}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
    {loading? <ClipLoader/> :"Verify OTP"}
        </button>
      </div>
    )}

    {step === 3 && (
      <div>
       <p className="text-green-700 font-semibold text-center">
        Password reset complete. You can now log in.
      </p>
      <button className='btn' onClick={()=>setOTP(false)}>login</button>
     
      </div>
    )}

    

    
  </div>
)}

      <Toaster position="top-center" reverseOrder={false} />
      <div className="cursor-follower"></div>

      {signup ? (
        <form onSubmit={handleSubmitSignup} className={OTP? "none":"body"}>
          <section className="form__section">
            <div className="forms">
              <div className="form__title">Sign Up Form</div>
              <div className="form__sub-title">Join Us!</div>

              <div className="form__input-wrapper">
                <input
                  className="form__input"
                  placeholder="Username*"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <div className="form__input-icon">
                  <UserIcon size={50} className="user-icon" />
                </div>
              </div>

              <div className="form__input-wrapper">
                <input
                  className="form__input"
                  placeholder="Email*"
                  type="email"
                  value={email}
                  onChange={(e) => setUseremail(e.target.value)}
                />
                <div className="form__input-icon">
                  <UserIcon size={50} className="user-icon" />
                </div>
              </div>

              <div className="form__input-wrapper">
                <input
                  className="form__input"
                  placeholder="About you and Your Country Of origin*"
                  type="text"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                />
                <div className="form__input-icon">
                  <UserIcon size={50} className="user-icon" />
                </div>
              </div>

              <div className="form__input-wrapper">
                <input
                  className="form__input"
                  placeholder="Number*"
                  type="text"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                />
                <div className="form__input-icon">
                  <UserIcon size={50} className="user-icon" />
                </div>
              </div>

              <div className="form__input-wrapper">
                <input
                  className="form__input form__input--has-svg"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  ref={signupPasswordRef}
                />
                <div className="form__input-icon">
                  <svg
                    width="34"
                    height="34"
                    viewBox="0 0 24 24"
                    className="user-icon"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z" />
                    <path d="M16.28 13.61c-1.13 1.13-2.75 1.48-4.18 1.03L9.51 17.22c-.18.19-.55.31-.82.27l-1.2-.16c-.4-.05-.76-.43-.83-.82l-.16-1.2c-.04-.27.09-.64.27-.83l2.58-2.58a4.048 4.048 0 0 1 5.89-5.89c1.63 1.63 1.63 4.27 0 5.9Z" />
                  </svg>
                </div>
                <div className="form__pass-toggle" ref={toggleRef}>
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <path
                      d="M0.83 10S4.17 3.33 10 3.33C15.83 3.33 19.17 10 19.17 10S15.83 16.67 10 16.67C4.17 16.67 0.83 10 0.83 10Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="form__input-wrapper">
                <label htmlFor="image-input">
                  <img
                    src={image ? URL.createObjectURL(image) : upload}
                    alt="Upload"
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

              <div className="down">
                <button
                  className="form__submit-btn"
                  style={{ cursor: loading ? "not-allowed" : "pointer" }}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <ClipLoader size={20} color="#fff" /> : 'Sign Up'}
                </button>
                <div className="form__sign-up">
                  Already have an account?{' '}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setSignup(false);
                    }}
                  >
                    Login
                  </a>
                </div>
              </div>
            </div>
          </section>
        </form>
      ) : (
        <div className={OTP? "none" :"body"}>
          <section className="form__section">
            <form className="forms" onSubmit={handleLogin}>
              <div className="form__title">Login Form</div>
              <div className="form__sub-title">Welcome Back!</div>

              <div className="form__input-wrapper">
                <input className="form__input" placeholder="Username or Email" type="text"
                  value={emailcheck}
                  onChange={(e) => setemailcheck(e.target.value)} />
                <div className="form__input-icon">
                  <UserIcon size={50} className="user-icon" style={{ color: '#ff200' }} />
                </div>
              </div>

              <div className="form__input-wrapper">
                <input
                  className="form__input form__input--has-svg"
                  placeholder="Password"
                  type="password"
                  ref={loginPasswordRef}
                  value={passwordcheck}
                  onChange={(e) => setpasswordcheck(e.target.value)}
                />
                <div className="form__input-icon">
                  <svg width="34" height="34" viewBox="0 0 24 24" className="user-icon">
                    <path
                      d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M16.28 13.61c-1.13 1.13-2.75 1.48-4.18 1.03L9.51 17.22c-.18.19-.55.31-.82.27l-1.2-.16c-.4-.05-.76-.43-.83-.82l-.16-1.2c-.04-.27.09-.64.27-.83l2.58-2.58a4.048 4.048 0 0 1 5.89-5.89c1.63 1.63 1.63 4.27 0 5.9Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <div className="form__pass-toggle" ref={toggleRef}>
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <path
                      d="M0.83 10S4.17 3.33 10 3.33C15.83 3.33 19.17 10 19.17 10S15.83 16.67 10 16.67C4.17 16.67 0.83 10 0.83 10Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
        
              <a  onClick={()=> setOTP(true)} style={{cursor: "pointer"}} className="form__forget">
                Forgot Password?
              </a>
           

              <button className="form__submit-btn" type="submit"    style={{ cursor: loading ? "not-allowed" : "pointer" }}  disabled={loading}>
                {loading ? <ClipLoader /> : "Log In"}
              </button>

              <div className="form__sign-up">
                Don't have an account?{' '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setSignup(true);
                  }}
                >
                  Sign up
                </a>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
};

export default LoginSignup;

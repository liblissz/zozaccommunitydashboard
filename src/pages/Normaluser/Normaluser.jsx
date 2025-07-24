import React, { useEffect, useState } from 'react'
import './Normal.css'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { ClipLoader } from 'react-spinners'
const Normaluser = () => {

const {id} = useParams()
const [userdata, setuserdata] = useState([])
const [loading, setloading] = useState(false)
    useEffect(()=>{

        const fetchuser = async()=>{
try {
    setloading(true)
    const user = await axios.get(`https://zozacbackend.onrender.com/normal/users/${id}`)
    setuserdata(user.data)
    
} catch (error) {
    toast.error(error)
}finally{
    setloading(false)
}
        }
fetchuser()
    },[id])


   {loading && <div className='loading'><ClipLoader className='clip' size={50} /></div> || "loading.........."}
  return (
    <div className='center'>
      <div className="content-wrapper">
      <div className="card">
        <div className="card-image">
          <img
            src={userdata.image}
            alt="Card Image"
          />
        </div>
        <div className="card-body">
          <div className="card-tags">
            <div className="tag">{userdata.name}</div>
            <div className="tag">{userdata.number}</div>
          </div>
          <div className="card-content">
            <div className="card-title">{userdata.email}</div>
            <p>
             {userdata.about}
            </p>
          </div>
          <div className="card-footer">
            <button className="card-btn">{userdata.name}</button>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Normaluser

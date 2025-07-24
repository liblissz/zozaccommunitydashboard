import React, { useEffect, useState } from 'react'
import './UserOrder.css'
import axios from 'axios'
import toast from 'react-hot-toast'
const UserOrders = () => {

const [orders, setorders] = useState([])

const [loading, setloading] = useState(false)

 useEffect(()=>{
 const fetchorder = async ()=>{
  try {
    setloading(true)
    const allorders = await axios.get("https://zozacbackend.onrender.com/get/orders")
    setorders(allorders.data)
  } catch (error) {
    toast.error(error)
  }finally{
    setloading(false)
  }
 }
fetchorder()

 },[])
const [searchTerm,setSearchTerm] = useState("")
  return (
   <>
      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Search Orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="elephant">
        {loading && "loading....."}

       {orders.filter(item =>(
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.details.toLowerCase().includes(searchTerm.toLowerCase())
       ))
       
       
       .map((item,i)=>(
<div className="lion lionBlue" key={i}>
          <div className="tiger tigerBlue">{item.name}</div>
          <div className="wolf">{item.email}</div>
          <div className="fox">
           {item.details}
          </div>
          <div className="bear">
          <p className='wolf'>I knew about zozac from: {item.want}</p>
          <p className='wolf'>Phone Number: {item.phonenumber}</p>
          <p className='wolf'>WhatsApp Number: {item.whatsappnumber}</p>
          <p className='wolf'>Get To Me Through: {item.gettous}</p>



          </div>
        </div>
       )) }

       

        
      </div>

     
    </>
  )
}

export default UserOrders

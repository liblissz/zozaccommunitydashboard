import axios from 'axios'
import { Filter, Search } from 'lucide-react'
import {Link} from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { ClipLoader } from 'react-spinners'

const Team = () => {
  const [user, setusers] = useState([])
  const [loading, setloding] = useState(false)
  //    [
  //   { name: 'Micheal John', date: '18-10-2021', status: 'Completed' },

  // ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setloding(true)
        const allusers = await axios.get("https://zozacbackend.onrender.com/api/signup/admin")
        setusers(allusers.data)
        //  if(!allusers){
        //   toast.error("error getting users")
        //  }

      } catch (error) {
        toast.error(error)
      } finally {
        setloding(false)
      }

    }

    fetchUsers()
  }, [])
  return (
    <>

      <div className="order">
        <div className="head">
          <h3>ZOZAC TEAM</h3>
        <Link to={"/Team"}>
          <Filter />
          </Link>
        </div>
        <table>
          <thead>
            <tr><th>User</th><th>Joined At:</th><th>About User</th></tr>
          </thead>
          <tbody>
            {loading && <ClipLoader />}
            {user.length === 0 && <p>No User Found</p>}
            {user.length > 0 && user.map((user, i) => (
              <tr key={i}>
                <td>
                  <img
                    src={user.profileImage}
                    alt={user.username}
                    className="user-avatar"
                  />
                  <p>{user.username}</p>
                </td>
                <td style={{fontSize: "14px"}}>{user.date}</td>
                <td>
                  <Link to={`/team/${user._id}`}>
                  <button
                    type="button"
                    style={{
                      display: "inline-block",
                      padding: "5px 10px",
                      maxWidth: "100px",
                      fontSize: "18px",
                      color: "#fff",
                      backgroundColor: "#2d5b1a", 
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                      boxShadow: "0 2px 6px rgba(2, 82, 12, 0.4)",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#0056b3")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#007BFF")}
                  >
                    About 
                  </button>
                  </Link>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>

  )
}

export default Team

import axios from 'axios';
import { Filter, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {Link} from "react-router-dom"

const Userweb = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get('https://zozacbackend.onrender.com/normal/users');
        setUsers(res.data);
      } catch (error) {
        toast.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="order">
      <div className="head">
        <h3>OUR USERS</h3>
 
        <Filter />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Date Joined</th>
              <th>More</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={i}>
                <td className="user-cell">
                  <img
                    src={user.image || 'https://via.placeholder.com/40'}
                    alt={user.name}
                    className="user-avatar"
                  />
                  <p style={{
                    fontSize: "12px"
                  }}>{user.name}</p>
                </td>
                <td style={{
                  fontSize: "12px"
                }}>{user.date}</td>
                <td>
              <Link to={`/normaluser/${user._id}`} style={{cursor: "pointer"}}>

                  <span style={{
                  fontSize: "12px"
                }}>
                   <button  style={{
                    padding: "5px",
                    height: "40px",
                    width: "70px",
                    fontSize: "12px",
                    background: "#2d5b1a",
                    borderRadius: "12px",
                    color: "#fff"
                   }}>about</button>
                  </span>
                     </Link>
                </td>
              </tr>
           
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Userweb;

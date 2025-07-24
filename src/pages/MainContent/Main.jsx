import React, { useEffect, useState } from 'react';
import { CalendarCheck, Users, DollarSign, ChevronRight, DownloadCloud, Search, Filter, MoreVertical, Plus } from 'lucide-react';
import Shownav from '../../components/SHownav/Shownav';
import Team from '../../components/Team.jsx/Team';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';

const Main = () => {
  const [savedata, setsavedata] = useState([])
  const [loading, setloading] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setloading(true)
        const res = await axios.get("https://zozacbackend.onrender.com/api/company/project/post")
        setsavedata(res.data)
       
      } catch (error) {
        toast.error(error)
      } finally {
        setloading(false)
      }
    }
    fetchData()
  }, [])
   const totalBudget = savedata.reduce((sum, p) => sum + (p.budget || 0), 0);


 const [orders, setorders] = useState([])   
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















 const [totalViews, setTotalViews] = useState(0);

   useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await axios.get('https://zozacbackend.onrender.com/api/pageview');
        setTotalViews(res.data.totalViews);
      } catch (error) {
        console.error('Failed to fetch page views', error);
      }
    };

    fetchCount();
  }, []);



  return (
    <main>
      <Toaster position="top-center" reverseOrder={false} />
      <Shownav name="Home" />

      <ul className="box-info">
        <li><i className="icon"><CalendarCheck className='blue' style={{color: "#2d5b1a"}}/></i><span className="text"><h3>{orders.length}</h3><p>Total Orders</p></span></li>
        <li><i className="icon"><Users className='blue' style={{color: "#2d5b1a"}}/></i><span className="text"><h3>{totalViews}</h3><p>Visitors</p></span></li>
        <li><i className="icon"><DollarSign className='blue' style={{color: "#2d5b1a"}} /></i><span className="text"><h3>{totalBudget}frs</h3><p>Total Sales</p></span></li>
      </ul>

      <div className="table-data">
        <Team />


        <div className="todo">
          <div className="head">
            <h3>Projects</h3>
            <Link to={'/addproject'} style={{ cursor: "pointer" }} className="icon">
              <Plus className="icon" />
            </Link>
            <Link to={"/allprojects"}>
              <Filter />
            </Link>
          </div>
          {savedata.length === 0 && <p style={{color: "white"}}>No Projects Found</p>}
          {loading && <ClipLoader />}


          <ul className="todo-list">
            {savedata.map((task, i) => (
              <Link
                to={`/everyproject/${task._id}`}
                style={{
                  display: "block",
                  textDecoration: "none",
                  marginBottom: "16px",
                }}
              >
                <li
                  key={i}
                  className={task.isCompleted ? 'completed' : 'not-completed'}
                  style={{
                    listStyle: "none",
                    border: task.isCompleted ? "2px solid #4CAF50" : "2px solid #f44336",
                    borderRadius: "10px",
                    padding: "16px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.3s ease-in-out",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "#2d5b1a",
                    cursor: "pointer"
                  }}
                >
                  <p style={{ margin: 0, fontWeight: 500 }}>{task.title}</p>
                  <MoreVertical />
                </li>
              </Link>

            ))}
          </ul>

        </div>
      </div>
    </main>
  );
};

export default Main;

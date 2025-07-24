import React from 'react';
import {
  Smile,
  LayoutDashboard,
  ShoppingBag,
  PieChart,
  MessageCircle,
  Users,
  Settings2,
  Power,
  CardSimIcon,
  PenOffIcon,
  PresentationIcon,
  AirVentIcon,

} from 'lucide-react';
import { Link } from 'react-router-dom';
import './Sidebar.css'

const Sidebar = ({ sidebarHidden }) => {

  const Handlelogout =  ()=>{
    if(!window.confirm("Are you sure you want to logout of this page. you will be prompt to login again. this system is highly secured ☠")){
    return
  }else{
   localStorage.removeItem("auth-token")
   window.location.replace('/');
  }

  }
  return (
    <section id="sidebar" className={sidebarHidden ? 'hide' : ''}>
      <a href="#" className="brand "  id='po'>
        <CardSimIcon size={24} /> 
        <span className={sidebarHidden?"textno":"text big"}>ZOZAC DASHBOARD</span>
      </a>
      <ul className="side-menu top">
            <Link to={'/'} >
        <li title='Dashboard' className="active "><a  id='po'><LayoutDashboard /><span className={sidebarHidden?"textno":"text"}>Dashboard</span></a></li>
       </Link>
    <Link to={'/Posts'}>   
     <li title='our posts'  > <a  id='po'><ShoppingBag /><span className={sidebarHidden?"textno":"text"}>Our Posts</span></a></li>
    </Link>
  <Link to={"/analytics"} style={{cursor: "pointer"}}>
        <li title='analytics' ><a  id='po'><PieChart /><span className={sidebarHidden?"textno":"text"}>Analytics</span></a></li>
     </Link>
     <Link to={'/orders'}>
        <li title='Orders'><a  id='po'><MessageCircle /><span className={sidebarHidden?"textno":"text"}>User Request</span></a></li>
        </Link>
        <Link to={'/Team'}> 
        <li title='team'><a  id='po'><Users /><span className={sidebarHidden?"textno":"text"}>Team</span></a></li>
        </Link>
          <Link to={'/users'}> 
           <li title='Users'><a  id='po'><PresentationIcon /><span className={sidebarHidden?"textno":"text"}>USERS</span></a></li>
      </Link>

    <a href="https://afuhalfred-ai.vercel.app/" target='_blank'>
           <li title='Users'><a  id='po'><AirVentIcon /><span className={sidebarHidden?"textno":"text"}>Afuh's AI</span></a></li>
  </a>
      </ul>
      <ul className="side-menu bottom">
        {/* <li><a  id='po'><Settings2 /><span className={sidebarHidden?"textno":"text"}>Settings</span></a></li> */}
        <li onClick={Handlelogout} style={{cursor: "pointer"}}><a className={sidebarHidden?"textno":"text"}  id='po'><Power /><span className={sidebarHidden?"textno":"text"}>Logout</span></a></li>
     
      </ul>
    </section>
  );
};

export default Sidebar;

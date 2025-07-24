import { ChevronRight, DownloadCloud } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
const Shownav = (props) => {
  return (
      <div className="head-title">
            <div className="left">
              <h1>Dahsboard</h1>
              <ul className="breadcrumb">
               <Link to={'/'}><li><a href="#">Dashboard</a></li></Link> 
                <li><ChevronRight/></li>
                <li><a className="active" href="#">{props.name}</a></li>
              </ul>
            </div>
            <a href="#" className="btn-download"><DownloadCloud /><span className="text">ZOZAC CLOUD</span></a>
          </div>
  )
}

export default Shownav

import React from 'react';
import Shownav from '../../components/SHownav/Shownav';
import { Filter, Search } from 'lucide-react';

import '../../App.css'
import Team from '../../components/Team.jsx/Team';
const OurTeam = () => {
  return (
    <>

        <main>
       
      <Shownav name="Our Team" />

        
  <div className="table-data">
     <Team/>
  </div>
  </main>
    </>
  );
};

export default OurTeam;

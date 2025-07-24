import React from 'react';
import Shownav from '../../components/SHownav/Shownav';
import { Filter, Search } from 'lucide-react';
import Usersweb from '../../components/Userweb/Userweb'
import '../../App.css'
const Users = () => {
  return (
    <>

        <main>
       
      <Shownav name="Users" />

        
  <div className="table-data">
     <Usersweb/>
  </div>
  </main>
    </>
  );
};

export default Users;

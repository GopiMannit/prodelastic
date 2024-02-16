import React from 'react';
import { BrowserRouter,Routes,Route} from 'react-router-dom';
import Sidebar from './components/sidebar';
import Create from './components/create';
import Delete from './components/delete';
import Update from './components/update';
import Search from './components/search';
import Summary from './components/summary';
function App() {
  
  return (
    <BrowserRouter>
    <Routes>
          <Route path="/" element={<Sidebar/>}/>
          <Route path="/create" element={<Create/>}/>
          <Route path="/update" element={<Update/>}/>
          <Route path="/delete" element={<Delete/>}/>
          <Route path="/search" element={<Search/>}/>
          <Route path="/summary" element={<Summary/>}/>
    </Routes>
    </BrowserRouter>
  );
  }
export default App;

import { React, useEffect, useState } from 'react';
import { BiChevronDown } from 'react-icons/bi'
import { AiOutlineSearch } from 'react-icons/ai'
import Axios from 'axios';
import { SERVER_URL } from './config';
import { ToastContainer, toast } from 'react-toastify';
function Search() {
  const [options, setoptions] = useState([]);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [options1, setoptions1] = useState([]);
  const [value1, setValue1] = useState("");
  const [selected1, setSelected1] = useState("Select Id");
  const [selected, setSelected] = useState("Select Domain");
  const [open1, setOpen1] = useState(true);
  var a = "Select Domain";
  var l = "Select Domain";
  useEffect(() => {
    Axios.get(`${SERVER_URL}api/getdomain`)
      .then(
        
      
        (res) => setoptions(res.data.object),
          
      
        //navigate('/login'),
        
      )
      .catch((err) => {
        toast.error('Failed :' + err.message,{
          autoClose:1000,
        });
      });
  }, []);
  useEffect(() => {
    if (selected === "Select Domain") {
      setOpen2(false);

    }
    else {
      setOpen2(true);
    }
  }, [selected]);
  const elastic = () => {
    if (open2 && open3) {
      Axios.get(`${SERVER_URL}api/textsearch?domain=${selected}&searchstring=${value1}`)
        .then(
          (res) => {
            setoptions1(res.data.object);
            //console.log(res);
            //console.log(res);
            //console.log(options1);
            // console.log(res.data);
          }
          // console.log(lo1),
          // toast.success('Id created successfully.'),
          //navigate('/login'),
        )
        .catch((err) => {
          toast.error('Failed :' + err.message,{
            autoClose:1000,
          });
        });
    }
    else {
      if (!open2 && !open3) {
        toast.warning('Select Domain and Enter text',{
          autoClose:1000,
        });
      }
      else if (!open2 && open3) {
        toast.warning('Select Domain',{
          autoClose:1000,
        });
      }
      else {
        toast.warning('Enter Text',{
          autoClose:1000,
        });
      }
    }
    console.log(open2);
  };
  useEffect(() => {
    if (value1 === "") {
      setoptions1([]);
      setOpen3(false);
    }
    else {
      setOpen3(true);
    }
  }, [value1]);
  return (
    <div className="w-full font-medium h-screen space-y-16">
      <div className="flex flex-row space-x-24">
        <div className="mt-48 ml-10">
          <div
            onClick={() => {
              setOpen(!open);

            }}
            className="w-48 p-3 h-10 flex items-center justify-between rounded-sm bg-[#00203f] text-white "
          >
            {selected}
            <BiChevronDown size={30} className={`${open && "rotate-180"}`} />
          </div>
          <ul className={`bg-white  mt-2 overflow-y-auto w-48 ${open ? 'max-h-40' : 'max-h-0'} `}>
            <div className='flex flex-row'>
              <div className='flex items-center px-2 sticky top-0 bg-white'>
                <AiOutlineSearch size={18} className='text-gray-700' />
                <input type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter Domain name" className={`placeholder:text-gray-700 p-2 outline-none `} />
              </div>

            </div>
            {options?.map((op) => (
              <li
                key={op}
                className={`p-2 text-sm  hover:bg-sky-600 hover:text-white 
                    ${op.toLowerCase() === a.toLowerCase() && 'bg-sky-600 text-white'}
                    ${op.toLowerCase().startsWith(value) ? "block" : "hidden"} `}
                onClick={() => {
                  if (op !== a) {
                    a = op;
                    l = op;
                    setValue("");

                  }
                  if (a == op) {
                    a = "Select Index";
                    setSelected(op);
                    setOpen(false);

                  }

                }}
              >
                {op}
              </li>
            ))}


          </ul>
        </div>
          <div className="mt-[180px]">
              <div className='flex items-center px-2 sticky top-0 bg-white w-72 '>
                <AiOutlineSearch size={18} className='text-gray-700' />
                <input type="text" value={value1} onChange={(e) => setValue1(e.target.value.toLowerCase())} placeholder="Search Here" className="placeholder:text-gray-700 p-2 outline-none" />
              </div>
            <ul className={`bg-white mt-2 overflow-y-auto w-72 max-h-60 border border-black`}>
              {options1?.map((op) => (
                <li
                  key={op.id}
                  className={`p-2 text-sm  hover:bg-sky-600 hover:text-white`}
                  onClick={() => {
                    navigator.clipboard.writeText(op);
                  }}
                >
                  {op}
                </li>
              ))}
            </ul>
          </div>
        <div className="mt-48 ml-10">
            <button className="text-base text-white bg-[#00203f]  mb-10 h-10 w-36  rounded-sm sm:p-1 p-2 " onClick={elastic}>Search</button>
          </div>
      </div>
      <ToastContainer />
    </div>


  );
}

export default Search;

import { React, useEffect, useState } from 'react';
import { BiChevronDown } from 'react-icons/bi'
import { AiOutlineSearch } from 'react-icons/ai'
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { SERVER_URL } from './config';
function Summary() {
  const [options, setoptions] = useState([]);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [value1, setValue1] = useState("");
  const [selected, setSelected] = useState("Select Domain");
  const [selected1, setSelected1] = useState("");
  const [lo, setlo] = useState('');
  const [lo1, setlo1] = useState('');
  const [lo2, setlo2] = useState('');
  const [lo3, setlo3] = useState('');
  const [s_count, setScount] = useState(0);
  const [c_count, setCcount] = useState(0);
  const [d_count, setDcount] = useState(0);
  const [u_count, setUcount] = useState(0);
  const id = 'count';
  var a = "Select Domain";
  var l = "Select Domain";
  useEffect(() => {
    Axios.get(`${SERVER_URL}api/getdomain`)
      .then(
        (res) => setoptions(res.data.object),
        //navigate('/login'),

      )
      .catch((err) => {
        toast.error('Failed :' + err.message);
      });
    if (selected != "Select Domain") {
      Axios.get(`${SERVER_URL}api/operationcount?indexname=${selected}`)
        .then(
          (res) => {
            setCcount(res.data.object.c_count);
            setScount(res.data.object.s_count);
            setUcount(res.data.object.u_count);
            setDcount(res.data.object.d_count);

          }
          // console.log(lo);
          //navigate('/login'),
        )
        .catch((err) => {
          console.log(err.message);


        });

    }

  }, []);
  useEffect(() => {
    if (selected === "Select Domain") {
      setOpen2(false);
    }
    else {
      setOpen2(true);
      Axios.get(`${SERVER_URL}api/createapi?indexname=${selected}`)
        .then(
          (res) => {
            setlo(res.data.message);
            console.log(res.data.message);
          }
          // console.log(lo);
          //navigate('/login'),
        )
        .catch((err) => {
          console.log(err.message);


        });
      Axios.get(`${SERVER_URL}api/operationcount?indexname=${selected}`)
        .then(
          (res) => {
            setCcount(res.data.object.c_count);
            setScount(res.data.object.s_count);
            setUcount(res.data.object.u_count);
            setDcount(res.data.object.d_count);
          }
          // console.log(lo);
          //navigate('/login'),
        )
        .catch((err) => {
          console.log(err.message);


        });


    }
  }, [selected]);

  useEffect(() => {
    if (lo != "Select Domain") {
      console.log(lo);
      setlo1(lo + "/" + "search");
      setlo2(lo + "/" + "update");
      setlo3(lo + "/" + "delete");
    }

  }, [lo]);
  function exportToPDF() {
    const doc = new jsPDF();

    // Set up the table content
    const headers = [['API Name', 'Domain API', 'Hit Count']];
    const data = [
      ['create', lo, c_count],
      ['search', lo1, s_count],
      ['update', lo2, u_count],
      ['delete', lo3, d_count],
    ];

    // Generate the table using autotable plugin
    doc.autoTable({
      head: headers,
      body: data,
      theme: 'grid',
      styles: {
        halign: 'center',
      },
    });

    // Save the PDF
    doc.save('table.pdf');
  }

  function Table({ shouldDisplay }) {
    if (!shouldDisplay) {
      return null; // If condition is not satisfied, do not render anything
    }

    return (
      <div>
        <table className={`border border-collapse border-black`}>
          <thead >
            <tr>
              <th className="border border-black p-2">API Name</th>
              <th className="border border-black p-2 w-[350px]">Domain API</th>
              <th className="border border-black p-2">Hit Count</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black text-sm">create</td>
              <td className="border border-black text-sm">{lo}</td>
              <td className="border border-black text-sm ">{c_count}</td>
            </tr>
            <tr>
              <td className="border border-black text-sm">search</td>
              <td className="border border-black text-sm">{lo1}</td>
              <td className="border border-black  text-sm ">{s_count}</td>
            </tr>
            <tr>
              <td className="border border-black text-sm">update</td>
              <td className="border border-black  text-sm">{lo2}</td>
              <td className="border border-black text-sm">{u_count}</td>
            </tr>
            <tr>
              <td className="border border-black  text-sm">delete</td>
              <td className="border border-black text-sm">{lo3}</td>
              <td className="border  border-black text-sm">{d_count}</td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    );
  }
  return (

    <div className="w-full font-medium h-screen  space-y-16">

      <div className='flex flex-row space-x-14'>
        <div className="mt-48 ml-10">
          <div
            onClick={() => {
              setOpen(!open);
            }}
            className="w-48 p-2 h-12 flex items-center justify-between rounded-sm bg-[#00203f] text-white"
          >
            {selected}
            <BiChevronDown size={30} className={`${open && "rotate-180"}`} />
          </div>
          <ul className={`bg-white  mt-2 overflow-y-auto w-48  ${open ? 'max-h-40' : 'max-h-0'} `}>
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
                    setSelected1(op);
                    setOpen(false);
                  }
                }}
              >
                {op}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-48">
          {open2 && <Table shouldDisplay={open2} />}
        </div>
      </div>
      <ToastContainer />
    </div>






  );
}

export default Summary;

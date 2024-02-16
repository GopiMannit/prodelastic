import { React, useState, useEffect } from 'react';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { SERVER_URL } from './config';
function Create() {
  const [lo, setlo] = useState('');
  const [lo1, setlo1] = useState('');
  const [lo2, setlo2] = useState('');
  const [lo3, setlo3] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const verify = async (e) => {
    e.preventDefault()
    if (validate()) {
      Axios.post(`${SERVER_URL}api/createindex?domain=${inputValue}`)
        .then(
          (res) => {
            setlo(res.data.message);
          
            if (res.status === 200) {
              setOpen(true);
              toast.success("Domain created Successfully");
            }
          }
        )
        .catch((err) => {
          toast.error("Domain Already exists");
        });

    }
  }
  useEffect(() => {
    if (open) {
      setlo1(lo + "/" + "search");
      setlo2(lo + "/" + "update");
      setlo3(lo + "/" + "delete");
      setlo(lo + "/create");

    }
  }, [open]);
  useEffect(() => {
    if (inputValue === '') {
      setOpen(false);
      setlo1("");
      setlo2("");
      setlo3("");
      setlo("");
    }
  }, [inputValue]);
  const validate = () => {
    let result = true;
    if (inputValue === '' || inputValue === null) {
      result = false;
      toast.warning('Please Enter Domain');
    }

    return result;
  }
  const handleCopyText = () => {
    navigator.clipboard.writeText(lo);
  };
  const handleCopyText1 = () => {
    navigator.clipboard.writeText(lo1);
  };
  const handleCopyText2 = () => {
    navigator.clipboard.writeText(lo2);
  };
  const handleCopyText3 = () => {
    navigator.clipboard.writeText(lo3);
  };

  return (
    <div className="w-full font-medium  mt-10 ml-5 space-y-16">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-row space-x-24">
          <div className="flex flex-col space-y-10">
            <label className="text-[#00203f] text-2xl">Create New Domain</label>
            <input type="text" value={inputValue} onChange={handleInputChange} placeholder="Enter Domain Value"
              className="w-[250px] text-[#00203f] focus:outline-none border-b border-[#555555]"
            />
          </div>
          <div>
            <button className="text-base text-white text-center bg-[#00203f] mt-8  h-8 w-32 rounded-sm" onClick={verify}>create</button>
          </div>
        </div>
        <ul className={`overflow-y-auto ${open ? 'max-h-100' : 'max-h-0'} space-y-10`}>
          <div className="space-x-12">
            <label className="text-[#00203f] text-base font-serif">Create API</label>
            <input type="text" value={lo} className="w-[300px] text-[#00203f] text-sm focus:outline-none border-b border-[#555555]" />
          </div>
          <div className="space-x-14">
            <label className="text-[#00203f] text-base font-serif">Read   API</label>
            <input type="text" value={lo1} className="w-[300px] text-[#00203f] text-sm focus:outline-none border-b border-[#555555]" />
          </div>
          <div className="space-x-12">
            <label className="text-[#00203f] text-base font-serif"> Update API</label>
            <input type="text" value={lo2} className="w-[300px] text-[#00203f] text-sm focus:outline-none border-b border-[#555555]" />

          </div>
          <div className="space-x-14">
            <label className="text-[#00203f] text-base font-serif">Delete API</label>
            <input type="text" value={lo3} className="w-[300px] text-[#00203f] text-sm focus:outline-none border-b border-[#555555]" />

          </div>
        </ul>
      </div>
      <ToastContainer />
    </div>
  );
}
export default Create;

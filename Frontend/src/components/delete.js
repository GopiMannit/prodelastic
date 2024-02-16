import { React, useState } from 'react';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { SERVER_URL } from './config';
function Delete() {
  const [lo, setlo] = useState('');
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };


  const verify = async (e) => {
    e.preventDefault();
    if (validate()) {
      Axios.delete(`${SERVER_URL}api/deletedomain?domain=${inputValue}`)
        .then(
          (res) => {
            setlo(res.data.message);
            console.log(res.data.message);
            setInputValue("");
            if (res.status === 200) {
              toast.success('Domain deleted Successfully', {
                autoClose: 1000,
              });
            }

          }
          // console.log(lo),
          //navigate('/login'),
        )
        .catch((err) => {
          console.log(err.message);
          toast.error("Domain not exists", {
            autoClose: 1000,
          });
        });

    }
  }
  const validate = () => {
    let result = true;
    if (inputValue === '' || inputValue === null) {
      result = false;
      toast.warning('Enter Domain', {
        autoClose: 1000,
      });
    }

    return result;
  }
  const handleCopyText = () => {
    navigator.clipboard.writeText(lo);
    setlo('');
    // Optionally, you can show a success message or perform any other actions after copying the text
  };
  return (

    <div className="flex flex-row items-center ml-20">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-row space-x-24">
          <div className="flex flex-col space-y-10">
            <div className="w-72">
              <label className="text-[#00203f] h-8 text-2xl">Enter the domain to Delete</label>
            </div>
            <input type="text" value={inputValue} onChange={handleInputChange} placeholder="Enter domain name"
              className="w-64 text-[#00203f] focus:outline-none border-b border-[#555555]"
            />
          </div>
          <button className="text-base text-white text-center bg-[#00203f] mt-8  h-8 w-32 rounded-sm" onClick={verify}>delete</button>
        </div>

      </div>
      <ToastContainer />
    </div>
  );
}
export default Delete;

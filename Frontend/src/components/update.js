import { React, useState } from 'react';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { SERVER_URL } from './config';
function Delete() {
    const [lo, setlo] = useState('');
    const [oldIndex, setInputValue] = useState('');
    const [newIndex, setInputValue1] = useState('');
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };
    const handleInputChange1 = (event) => {
        setInputValue1(event.target.value);
    };


    const verify = async (e) => {
        e.preventDefault();
        if (validate()) {
            Axios.patch(`${SERVER_URL}api/updatedomain?oldindex=${oldIndex}&newindex=${newIndex}`)
                .then(
                    (res) => {
                        setlo(res.data.message);
                        setInputValue("");
                        setInputValue1("");
                        if (res.status === 200) {
                            toast.success('Domain Updated Successfully');
                        }
                    }
                )
                .catch((err) => {
                    console.log(err.message);
                    toast.error("Domain name not exists");
                });
        }
    }
    const validate = () => {
        let result = true;
        if (oldIndex === '' || oldIndex === null) {
            result=false;
            toast.warning('Please Enter Existing Domain');
        }
        if (newIndex === '' || newIndex === null) {
            result=false;
            toast.warning('Please Enter Updating Domain');
        }
        return result;
    }
    return (

        <div className="flex items-center justify-center h-screen ml-10">
            <div className="flex flex-col space-y-8">
                <div className="flex flex-col space-y-16">
                    <div className="flex flex-col space-y-1">
                        <div className="flex flex-col space-y-10">
                        <div className="flex flex-row space-x-20">
                        <label className="text-white text-sm bg-[#00203f] p-1 w-48 flex items-center justify-center h-8">Existing Domain</label>
                        <input type="text" value={oldIndex} onChange={handleInputChange} placeholder="Enter Existing Domain Name"
                            className="w-[300px] text-[#00203f] text-sm focus:outline-none border-b border-[#555555]"
                        />
                        </div>
                        <div className="flex flex-row space-x-20">
                        <label className="text-white bg-[#00203f] text-sm p-1 w-48 flex items-center justify-center h-8">Updating Domain</label>
                        <input type="text" value={newIndex} onChange={handleInputChange1} placeholder="Enter Updating Domain Name"
                            className="w-[300px] text-[#00203f] text-sm focus:outline-none border-b border-[#555555]"
                        />
                        </div>
                        </div>
                        <div className="flex justify-center">
                             <button className="text-base text-white bg-[#00203f] mt-10 bg- h-8  w-36 rounded-sm" onClick={verify}>Update</button>
                        </div>
                    </div>

                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Delete;
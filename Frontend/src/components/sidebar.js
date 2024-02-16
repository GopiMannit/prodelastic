import React, { useState } from 'react';
import { BsArrowLeftShort } from 'react-icons/bs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus, faMagnifyingGlass, faTrash, faPenToSquare, faNoteSticky } from '@fortawesome/free-solid-svg-icons';
import Create from './create';
import Delete from './delete';
import Search from './search';
import Update from './update';
import Summary from './summary';
const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState('create');

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  const renderPage = () => {
    switch (selectedMenu) {
      case 'create':
        return <Create />;
      case 'search':
        return <Search />;
      case 'delete':
        return <Delete />;
      case 'update':
        return <Update />;
      case 'summary':
        return <Summary />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-row">
      <div className={`bg-[#00203f] h-screen p-5 pt-8 duration-300 relative ${open ? 'w-72' : 'w-20'}`}>
        <BsArrowLeftShort
          className={`bg-white text-[#00203f] text-3xl rounded-full absolute -right-3 top-9 border border-[#00203f] cursor-pointer transform transition-transform ${!open ? 'rotate-180' : ''
            }`}
          onClick={() => setOpen(!open)}
        />
        <div>
          <h1 className={`text-white origin-left font-medium text-2xl duration-500 ${!open ? 'scale-0' : '0'}`}>
            Elastic Admin
          </h1>
          <h1 className={`text-white text-base duration-500 mr-5   ${!open ? '0' : 'scale-0'}`}>
            Menus
          </h1>
        </div>
        <div className="mt-28">
          <ul className="ml-10 space-y-8">
            <li
              className={`text-white cursor-pointer text-[18px] flex flex-row space-x-4 duration-300 ${selectedMenu === 'home' ? 'font-semibold' : ''} ${!open ? 'scale-0' : '0'} `}
              onClick={() => handleMenuClick('create')}
            >
              <div className={`${!open ? 'scale-0' : '0'} duration-300`}>
                <FontAwesomeIcon icon={faSquarePlus} className='bg-[#00203f] h-4 w-8' />
              </div>
              <div className={`${!open ? 'scale-0' : '0'}duration-300`}>
                Create
              </div>
            </li>
            <li
              className={`text-white cursor-pointer  text-[18px] flex flex-row space-x-4 duration-300 ${selectedMenu === 'about' ? 'font-semibold' : ''} ${!open ? 'scale-0' : '0'} mb-5`}
              onClick={() => handleMenuClick('search')}
            >
              <div className={`${!open ? 'scale-0' : '0'} duration-300`}>
                <FontAwesomeIcon icon={faMagnifyingGlass} className='bg-[#00203f] h-4 w-8' />
              </div>
              <div className={`${!open ? 'scale-0' : '0'} duration-300`}>
                Search
              </div>
            </li>
            <li
              className={`text-white cursor-pointer  text-[18px] flex flex-row space-x-4 duration-300 ${selectedMenu === 'about' ? 'font-semibold' : ''} ${!open ? 'scale-0' : '0'} mb-5`}
              onClick={() => handleMenuClick('update')}
            >
              <div className={`${!open ? 'scale-0' : '0'} duration-300`}>
                <FontAwesomeIcon icon={faPenToSquare} className='bg-[#00203f] h-4 w-8' />
              </div>
              <div className={`${!open ? 'scale-0' : '0'} duration-300`}>
                Update
              </div>
            </li>
            <li
              className={`text-white cursor-pointer  text-[18px] flex flex-row space-x-4 duration-300 ${selectedMenu === 'about' ? 'font-semibold' : ''} ${!open ? 'scale-0' : '0'} mb-5`}
              onClick={() => handleMenuClick('delete')}
            >
              <div className={`${!open ? 'scale-0' : '0'} duration-300`}>
                <FontAwesomeIcon icon={faTrash} className='bg-[#00203f] h-4 w-8' />
              </div>
              <div className={`${!open ? 'scale-0' : '0'} duration-300`}>
                Delete
              </div>
            </li>
            <li
              className={`text-white cursor-pointer  text-[18px] flex flex-row space-x-4 duration-300 ${selectedMenu === 'about' ? 'font-semibold' : ''} ${!open ? 'scale-0' : '0'} mb-5`}
              onClick={() => handleMenuClick('summary')}
            >
              <div className={`${!open ? 'scale-0' : '0'} duration-300`}>
                <FontAwesomeIcon icon={faNoteSticky} className='bg-[#00203f] h-4 w-8' />
              </div>
              <div className={`${!open ? 'scale-0' : '0'} duration-300`}>
                Summary
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="ml-12 flex items-center justify-center">{renderPage()}</div>
    </div>
  );
};

export default Sidebar;

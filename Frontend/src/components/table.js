<div className="">
        <ul className={`overflow-y-auto  ${open2?'max-h-100':'max-h-0'} space-y-10`}>
          <div className="flex flex-row space-x-20"> 
          <div className="flex flex-col space-y-10">
            <label className="p-1 bg-[#00203f] text-white text-base h-12 w-[300px] flex items-center justify-center">Domain API</label>
            <label className="w-[300px] text-[#00203f] focus:outline-none border border-[#555555] p-1">{lo}</label>
          </div>
          <div className="flex flex-col space-y-10">
              <label className="p-1 bg-[#00203f] text-white text-base h-12 w-[100px] flex items-center justify-center">Hit Count</label>   
              <h2 className="ml-8">{c_count}</h2>
          </div>
          </div>
          <div className="flex flex-row space-x-28">
          <label className="w-[300px] text-[#00203f] focus:outline-none border border-[#555555] p-1">{lo1}</label>
            <h2 >{s_count}</h2>
          </div>
          <div className="flex flex-row space-x-28">
          <label className="w-[300px] text-[#00203f] focus:outline-none border border-[#555555] p-1">{lo2}</label>
            <h2 >{u_count}</h2>
          </div>
          <div className="flex flex-row space-x-28">
          <label className="w-[300px] text-[#00203f] focus:outline-none border border-[#555555] p-1">{lo3}</label>
            <h2>{d_count}</h2>
          </div>
          </ul> 
          <div>
         {open2 && <Table shouldDisplay={open2} />}
          </div>        
        </div>
         
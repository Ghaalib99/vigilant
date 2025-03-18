"use client"
import DashBoardQuickMenu from "@/components/DashBoardQuickMenu";
import LineChart from "@/components/LineChart";
import React, { useState } from "react";

const Dashboard = () => {


  const quickMenu = [
    {
      title: "Total Users",
      description: "All users of the platform",
      link: "/dashboard",
      icon: 32,
      bg: "bg-[#46010240]"
    },
    {
      title: "Newly Joined Members",
      description: "Summary of newly joined members",
      link: "/dashboard",
      icon: 432,
      bg: "bg-[#81AB2740]"
    },
    {
      title: "Reported Issues",
      description: "Issues that have been reported",
      link: "/dashboard",
      icon: 21,
      bg: "bg-[#C1DDC340]"
    },
    {
      title: "Resolved Issues",
      description: "Issues that have not been resolved",
      link: "/dashboard",
      icon: 342,
      bg: "bg-[#F88C2940]"
    },
  ]

  const [showOption, setShowOption] = useState(false)
  const [option, setOption] = useState("Monthly")


  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
        {quickMenu.map((menu, i) => (
          <DashBoardQuickMenu key={i} data={menu} />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="pb-2 col-span-2 shadow-md rounded-lg">
          <div className="flex relative items-center px-6">
            <div className="flex-grow">Incidents Summary</div>
            <div onMouseLeave={() => setShowOption(false)} onClick={() => setShowOption(!showOption)} className="flex  relative border rounded-lg px-3 py-1 bg-white">
              <div className="pb-0 font-semibold flex items-center gap-6 cursor-pointer">{option} </div>
              <div className={`absolute left-0 top-10 shadow-md border z-40 bg-white rounded-lg p-1 ${!showOption && "hidden"}`}>
                <div onClick={() => { setOption("Monthly") }} className="pl-3 pr-6 cursor-pointer hover:bg-gray-100 rounded-md py-1">Monthly</div>
                <div onClick={() => { setOption("Weekly") }} className="pl-3 pr-6 cursor-pointer hover:bg-gray-100 rounded-md py-1">Weekly</div>
              </div>
            </div>
          </div>
          <div className="h-64 md:h-96"><LineChart x={["Jan", "Feb", "Mar", "Apirl", "May", "June", "July", "Aug", "Sep"]} y={[30, 40, 45, 50, 29, 40, 57, 31]} /></div>
        </div>
      </div>
    </div>
  )
};

export default Dashboard;

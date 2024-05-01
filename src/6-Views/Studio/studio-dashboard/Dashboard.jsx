import React, {useEffect, useRef, useState} from "react";
import Sidebar from "../../../2-Components/Navigation/Sidebar.tsx";
import CustomStack from "../../../2-Components/Stacks/CustomStack.jsx";
import { Box, Typography } from "@mui/material";
import Button from "../../../2-Components/Buttons/Button.tsx";
import VideoListTable from "../../../2-Components/Tables/VideoListTable.jsx";

const Dashboard = () => {

  const videoRef = useRef(null);
  const [statsArray, setStatsArray] = useState([
    {
      title: "Total Videos",
      stats: 200,
      icon: true,
    },
    {
      title: "Recently Uploaded",
      stats: 2,
      icon: true,
    },
    {
      title: "Total TV Series",
      stats: 14,
      icon: false,
    },
    {
      title: "Total Films(ie. Short films, Movies)",
      stats: 30,
      icon: true,
    },
  ]);


  
  
  return (
    <div className="max-h-screen h-[100vh] w-full flex flex-col bg-whites-900">
      <div className="grid grid-cols-[auto,1fr] flex-grow-1 overflow-auto">
        {/** side bar */}
        <div className="bg-primary-500 h-[100vh]">
          <Sidebar />
        </div>

        {/** content */}
        <div className="bg-[#24222a] flex-1 px-10">
          {/** head title */}
          <CustomStack className="w-full justify-between items-center py-6">
            <Typography className="font-[Inter-Medium] text-[#fafafa] text-xl">
              Video Content Repository
            </Typography>

            <div className="flex gap-5">
              <Button className="px-5 rounded-lg font-[Inter-Medium]">
                Add New Film
              </Button>
              <Button className="px-5 rounded-lg font-[Inter-Medium]">
                Add New Serie
              </Button>
            </div>
          </CustomStack>

          {/** Stats */}
          <div className="flex gap-3 divide-x divide-secondary-600 ">
            {statsArray.map((data) => {
              return (
                <Box className="px-8 py-3.5 flex flex-col justify-center">
                  <CustomStack className="gap-4 items-center">
                    <Typography className="font-[Inter-Medium] text-ellipsis text-whites-50 text-3xl">
                      {data.stats}
                    </Typography>

                    {data.icon ? (
                      <Button
                        size="icon"
                        className="bg-secondary-800 rounded-md w-10 h-8"
                      >
                        <span className="icon-[solar--arrow-up-linear] text-[#1E8B51] w-5 h-5"></span>
                      </Button>
                    ) : (
                      <span className="w-10 h-8"></span>
                    )}
                  </CustomStack>
                  <Typography className="font-[Inter-Regular] text-ellipsis text-secondary-200 text-base pt-2">
                    {data.title}
                  </Typography>
                </Box>
              );
            })}
          </div>
          {/** table */}
          <div className="pt-7">
          <VideoListTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
// {<video
//   width="400"
//   height="400"
//   controls
//   autoPlay
//   src={"http://localhost:8000/api/film/🎧Electronic Music.mp4"}
// >
//   Your browser does not support the video tag.
// </video>;}
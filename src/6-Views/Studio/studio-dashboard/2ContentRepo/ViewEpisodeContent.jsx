import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../../../2-Components/Navigation/Sidebar.tsx";
import CustomStack from "../../../../2-Components/Stacks/CustomStack.jsx";
import { Box, Typography } from "@mui/material";
import Button from "../../../../2-Components/Buttons/Button.tsx";
import VideoListTable from "../../../../2-Components/Tables/VideoListTable.jsx";
import { useNavigate } from "react-router-dom";
import StepperCustom from "../../../../2-Components/Stepper/StepperCustom.jsx";
import ContentDetails from "../../../../2-Components/Forms/ContentDetails.jsx";
import StepperControls from "../../../../2-Components/Stepper/StepperControls.jsx";
import { FilmFormContext } from "../../../../5-Store/FilmFormsContext.js";
import posterImage from "../../../../1-Assets/Posterimage.png"
import FilmDetailTab from "../../../../2-Components/Tabs/FilmDetailTab.jsx";

const ViewEpisodeContent = () => {
  return (
    <div className="max-h-screen h-[100vh] w-full flex flex-col bg-whites-900 relative">
      <div className="grid grid-cols-[auto,1fr] flex-grow-1 relative overflow-auto">
        {/** side bar */}

        <Sidebar />

        {/** content */}
        <div className="bg-[#24222a] min-h-[100vh] flex-1 px-10 overflow-auto">
          {/** title */}
          <CustomStack className="bg-[#24222a] z-50 w-full justify-between items-start py-6 sticky top-0 flex-col">
            <div className="flex flex-row items-center gap-9">
              <Typography className="font-[Inter-Medium] text-[#fafafa] text-xl">
                Fair Play
              </Typography>

              <div className=" font-[Inter-Medium] select-none  text-xs flex w-max h-max text-primary-500 px-2 py-1 border border-primary-500 rounded-lg bg-secondary-800 ">Episode</div>
            </div>

            <div className="">
              <ul className="font-[Inter-Regular] text-[#FFFAF6] flex list-disc w-full space-x-8 text-base flex-wrap gap-y-3 items-start justify-start">
                <li className="w-max list-none">Episode </li>
                <li className="w-max">2010 </li>
              </ul>
            </div>
          </CustomStack>

          {/** Movie Details & Tabs  */}
          <div className="pt-7 pb-11 ">
            {/** Movie details */}
            <div className="flex flex-row gap-4">
              {/** image */}

              <img src={posterImage} alt="" className="w-[210.15px] h-[272.5px]" />

              <div className="flex flex-col max-w-[640px] gap-6">
                <h1 className="font-[Inter-Regular] text-sm text-[#FFFAF6] text-opacity-70">A group of young men (Itwara Anthony, Kafuruka Peter, Collin Asiimwe and Godfrey K.) in rural Ugandan town decide to be more involved in the political process after their football pitch has been allocated to a private investor with the help of their local councillor. They take advantage of the upcoming by-election to find a candidate to save their football pitch. The club captain, Kato (Peter </h1>
                <div className="flex flex-wrap gap-3">
                  {[...Array(5)].map((data, index) => {
                    return (
                      <div key={index} className="flex py-1 px-5 bg-[#D9D9D9] bg-opacity-15 rounded-full ring-1 ring-[#FFFFFE] text-whites-50">movie</div>
                    )
                  })}
                </div>

              </div>
            </div>

            <div className="mt-7">
              <FilmDetailTab type="episode" />
            </div>
          </div>


        </div>
      </div>
 

    </div>
  )
}

export default ViewEpisodeContent
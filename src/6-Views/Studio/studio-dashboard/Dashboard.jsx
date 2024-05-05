import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../../2-Components/Navigation/Sidebar.tsx";
import CustomStack from "../../../2-Components/Stacks/CustomStack.jsx";
import { Box, Dialog, DialogContent, Modal, Typography } from "@mui/material";
import Button from "../../../2-Components/Buttons/Button.tsx";
import VideoListTable from "../../../2-Components/Tables/VideoListTable.jsx";
import { useNavigate } from "react-router-dom";
import UploadVideo from "../../../2-Components/Forms/UploadVideo.jsx";
import StepperCustom from "../../../2-Components/Stepper/StepperCustom.jsx";
import ContentDetails from "../../../2-Components/Forms/ContentDetails.jsx";
import StepperControls from "../../../2-Components/Stepper/StepperControls.jsx";
import CastCrew from "../../../2-Components/Forms/CastCrew.jsx";
import Audience from "../../../2-Components/Forms/Audience.jsx";

const Dashboard = () => {
  let navigate = useNavigate();

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

  const stepperArray = [
    { title: "Video" },
    { title: "Content Details" },
    { title: "Cast & Crew" },
    { title: "Audience, Visibility..." },
    { title: "Trailer & Thumbnails" },
    { title: "Preview" },
  ];
  const [currentStep, setCurrentStep] = useState(null);
  const [stepsAllComplete, setStepsAllComplete] = useState(false);

  const formRef = React.useRef();

  React.useEffect(() => {
    setCurrentStep(() => stepperArray?.[0].title);
  }, []);

  const handleFormSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  };

  /** handle next step */
  const handleStepNext = () => {
    let getCurrentIndex =
      currentStep !== null
        ? stepperArray.findIndex((data) => data?.title === currentStep)
        : null;
    if (
      getCurrentIndex !== null &&
      getCurrentIndex + 1 < stepperArray?.length
    ) {
      let nextCurrentIndex = getCurrentIndex + 1;
      if (nextCurrentIndex < stepperArray?.length) {
        setCurrentStep(() => stepperArray?.[nextCurrentIndex].title);
      }
    } else if (getCurrentIndex + 1 === stepperArray?.length) {
      setStepsAllComplete(() => true);
    }
  };

  /** handle prev step */
  const handleStepPrev = () => {
    let getCurrentIndex =
      currentStep !== null
        ? stepperArray.findIndex((data) => data?.title === currentStep)
        : null;

    if (getCurrentIndex !== null && getCurrentIndex > 0) {
      let prevCurrentIndex = getCurrentIndex - 1;

      setCurrentStep(() => stepperArray?.[prevCurrentIndex].title);
      if (stepsAllComplete) {
        setStepsAllComplete(() => true);
      }
    }
  };

  /** handle form display change */
  const FormDisplay = (step) => {
    switch (step) {
      case "Content Details":
        return (
          <UploadVideo innerref={formRef} handleStepNext={handleStepNext} />
        );
      case "Audience, Visibility...":
        return (
          <UploadVideo innerref={formRef} handleStepNext={handleStepNext} />
        );
      case "Trailer & Thumbnails":
        return (
          <UploadVideo innerref={formRef} handleStepNext={handleStepNext} />
        );
      case "Preview":
        return (
          <UploadVideo innerref={formRef} handleStepNext={handleStepNext} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-h-screen h-[100vh] w-full flex flex-col bg-whites-900 relative">
      <div className="grid grid-cols-[auto,1fr] flex-grow-1 relative overflow-auto">
        {/** side bar */}

        <Sidebar />

        {/** content */}
        <div className="bg-[#24222a] min-h-[100vh] flex-1 px-10 overflow-auto">
          {/** head title */}
          <CustomStack className="bg-[#24222a] z-40 w-full justify-between items-center py-6 sticky top-0">
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
                <Box className="px-8 py-3.5 flex flex-col justify-center ">
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
          <div className="pt-7 pb-11 ">
            <VideoListTable />
          </div>
        </div>
      </div>
      {/** popup upload Movie Modal */}
      <CustomStack
        className="relative z-50"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 border rounded-xl bg-secondary-50 bg-opacity-75 transition-opacity"></div>

        <div className="fixed inset-0 z-50 bg-primary-200 bg-opacity-10 overflow-hidden">
          <div className="relative transform overflow-hidden rounded-lg bg-secondary-400 text-left shadow-xl transition-all">
            <div className="bg-secondary-900 h-screen px-16 pt-0 overflow-y-auto">
              {/** video form */}
              {/** <UploadVideo innerref={formRef} />  */}

              {/** forms with stepper */}
              <div className="flex flex-col w-full h-full text-whites-40 gap-6 ">
                <CustomStack className="z-50 w-full justify-between items-center py-2 pt-7 sticky top-0 bg-secondary-900">
                  <Typography className="font-[Inter-Medium] text-[#fafafa] text-xl">
                    New Movie Upload
                  </Typography>

                  <div className="flex gap-5">
                    <Button className="px-5 rounded-lg font-[Inter-Medium] bg-primary-700">
                      SAVE & CLOSE
                    </Button>
                  </div>
                </CustomStack>

                {/** stepper show case */}

                <StepperCustom
                  stepperData={stepperArray}
                  currentStep={currentStep}
                  stepsAllComplete={stepsAllComplete}
                />

                {/** form */}
                <div className="mb-3">
                  {/**  <ContentDetails
                    innerref={formRef}
                    handleStepNext={handleStepNext}
                  /> */}

                  {/**
                 <CastCrew
                    innerref={formRef}
                    handleStepNext={handleStepNext}
                  />
                */}

                  <Audience
                    innerref={formRef}
                    handleStepNext={handleStepNext}
                  />
                </div>

                {/** stepper control */}
                <div className="border-t-2 border-t-secondary-500">
                  <StepperControls
                    handleStepNext={handleStepNext}
                    stepperData={stepperArray}
                    currentStep={currentStep}
                    handleStepPrev={handleStepPrev}
                    handleFormSubmit={handleFormSubmit}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CustomStack>
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

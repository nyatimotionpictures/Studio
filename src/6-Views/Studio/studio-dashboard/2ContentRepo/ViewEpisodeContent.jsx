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
  const [openFilmModal, setOpenFilmModal] = React.useState(false);
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

    { title: "Content Details" },

  ];
  const [currentStep, setCurrentStep] = useState(null);
  const [stepsAllComplete, setStepsAllComplete] = useState(false);
  const [videoData, setVideoData] = useState({
    filmVideo: null
  })

  const formRef = React.useRef();

  React.useEffect(() => {
    setCurrentStep(() => stepperArray?.[0].title);
  }, []);

  const handleFormSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  };
  /** handle Popup Modal */
  const handleModalOpen = () => {
    setOpenFilmModal(() => true);
    if (typeof window != "undefined" && window.document) {
      document.body.style.overflow = "hidden";
    }
  }
  const handleModalClose = () => {
    setOpenFilmModal(() => false);
    document.body.style.overflow = "unset";
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
          <ContentDetails innerref={formRef} handleStepNext={handleStepNext} />
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
              <FilmDetailTab />
            </div>
          </div>


        </div>
      </div>
      {/** popup upload Movie Modal */}
      {
        openFilmModal && (
          <CustomStack
            className="relative z-50"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="false"
          >
            <div className="fixed inset-0 border rounded-xl bg-secondary-50 bg-opacity-75 transition-opacity"></div>

            <div className="fixed inset-0 z-50 bg-primary-200 bg-opacity-10 overflow-hidden">
              <div className="relative transform overflow-y-auto rounded-lg bg-secondary-400 h-screen text-left shadow-xl transition-all">
                <div className="bg-secondary-900 px-16 pt-0 min-h-screen h-max">
                  {/** video form */}
                  {/** <UploadVideo innerref={formRef} />  */}

                  {/** forms with stepper */}
                  <div className="flex flex-col w-full h-full text-whites-40 gap-6 relative">
                    <CustomStack className="z-50 w-full justify-between items-center py-2 pt-7 sticky top-0 bg-secondary-900">
                      <Typography className="font-[Inter-Medium] text-[#fafafa] text-xl">
                        Add Title
                      </Typography>

                      <div className="flex gap-5">
                        <Button onClick={handleModalClose} className="px-5 rounded-lg font-[Inter-Medium] bg-primary-700">
                          CANCEL & CLOSE
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
                    <div className="block mb-3 h-full">
                      <FilmFormContext.Provider value={{ videoData, setVideoData }}>
                        {FormDisplay(stepsAllComplete ? "complete" : currentStep)}
                      </FilmFormContext.Provider>
                    </div>

                    {/** stepper control */}
                    <div className="border-t-2 border-t-secondary-500 relative">
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
        )
      }

    </div>
  )
}

export default ViewEpisodeContent
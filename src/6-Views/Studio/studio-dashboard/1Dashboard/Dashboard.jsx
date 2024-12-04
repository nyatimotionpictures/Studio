import React, { useEffect, useState } from "react";
import Sidebar from "../../../../2-Components/Navigation/Sidebar.tsx";
import CustomStack from "../../../../2-Components/Stacks/CustomStack.jsx";
import { Alert, Box, Snackbar, Typography } from "@mui/material";
import Button from "../../../../2-Components/Buttons/Button.tsx";
import { useNavigate } from "react-router-dom";
import StepperCustom from "../../../../2-Components/Stepper/StepperCustom.jsx";
import ContentDetails from "../../../../2-Components/Forms/ContentDetails.jsx";
import StepperControls from "../../../../2-Components/Stepper/StepperControls.jsx";
import { FilmFormContext } from "../../../../5-Store/FilmFormsContext.js";
import createIcon from "../../../../1-Assets/icons/createNew.png";
import subIcon from "../../../../1-Assets/icons/sub.png";
import WatchedListTable from "../../../../2-Components/Tables/WatchedListTable.jsx";
import { useMutation } from "@tanstack/react-query";
import { postFilmContent } from "../../../../5-Store/TanstackStore/services/api.ts";
import { queryClient } from "../../../../lib/tanstack.ts";
import { useGetAllFilms, useGetDonations, useGetPurchases } from "../../../../5-Store/TanstackStore/services/queries.ts";
import VideoListTable from "../../../../2-Components/Tables/VideoListTable.jsx";

const Dashboard = () => {
  const [openFilmModal, setOpenFilmModal] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState(null);
  let navigate = useNavigate();
  const filmsQuery = useGetAllFilms();
  const [statsArray, setStatsArray] = useState([
    
    {
      title: "Total Donated",
      stats: "UGX 0",
      icon: false,
    },
    {
      title: "Total Paid Subscriptions",
      stats: "UGX 0",
      icon: false,
    },
  ]);

  let getalldonations = useGetDonations();
  let getallpurchases = useGetPurchases();

  useEffect(() => {
    
      let AppDonations = [];
      let WebDonations = [];
      const filterAppDonations =   getalldonations?.data?.appDonations?.filter((data) =>{

        if (data.status.includes("success")){
          AppDonations.push(parseFloat(data.amount))
        }
      }  ) ?? [];
      const filterWebDonations = getalldonations?.data?.webDonations?.filter((data) =>{

        if (data.payment_status_description.includes("success")){
          WebDonations.push(parseFloat(data.amount))
        }
      }  ) ?? [];

      let AllDonations = [...AppDonations, ...WebDonations];
      const ReducerAllDonations = AllDonations?.length > 0 ?  AllDonations.reduce((sum, price) => sum + price, 0  ) : 0;
     
      // purchases
    
        let successPurchases = [];
       
        const filterPurchases =   getallpurchases?.data?.appDonations?.filter((data) =>{
  
          if (data.status.includes("success")){
            successPurchases.push(parseFloat(data.amount))
          }
        }  ) ?? [];
  
  
    
        const ReducerPurchases = successPurchases?.length > 0 ?  successPurchases?.reduce((sum, price) => sum + price, 0  ) : 0;
     
     
      
      
      setStatsArray(()=> [
        {
          title: "Total Donated",
          stats: `UGX ${ReducerAllDonations}`,
          icon: false,
        },
        {
          title: "Total Paid Subscriptions",
          stats: `UGX ${ReducerPurchases}`,
          
          icon: false,
        }
       
      ])
    
  }, [getalldonations.data,getallpurchases.data])



  const stepperArray = [{ title: "Content Details" }];
  const [currentStep, setCurrentStep] = useState(null);
  const [stepsAllComplete, setStepsAllComplete] = useState(false);
  const [videoData, setVideoData] = useState({
    filmVideo: null,
  });

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
  };
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

  const mutation = useMutation({
    mutationFn: postFilmContent,
    onSuccess: (data) => {
     // console.log("data", data);
      setSnackbarMessage({message: data.message, severity: "success"});
      if(data.film.type === "movie") {
       navigate(`/content/view/film/${data.film.id}`);
      } else if(data.film.type === "series") {
        navigate(`/content/view/series/${data.film.id}`);
      }
      
    },
    onError: (error) => {
      console.log("error", error);
     if (error?.message){
      setSnackbarMessage(() => ({message: error.message, severity: "error"}));
     }
      
    },
    onSettled: async (_, error) => {
      if (error) {
        console.log("error", error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ["films"] });
      }
    },
  });

  const handleFilmFormSubmit = (values) => {
   mutation.mutate(values);
  };  



  /** handle form display change */
  const FormDisplay = (step) => {
    switch (step) {
      case "Content Details":
        return (
          <ContentDetails innerref={formRef} handleStepNext={handleFilmFormSubmit} />
        );
      default:
        return null;
    }
  };

  /** Shorcut array */
  const shortCuts = [
    {
      title: "Create New Title",
      desc: "Click shortcut to add a new Movie/Series title to expand your Content Library.",
      icon: createIcon,
      func: handleModalOpen,
    },
    {
      title: "Manage Subscriptions",
      desc: `Click shortcut to update Rent - to - Stream price plans for SD,HD, FHD & UHD Subscriptions`,
      icon: subIcon,
      path: "/subscriptions",
    },
  ];

  return (
    <div className="max-h-screen h-[100vh] w-full flex flex-col bg-whites-900 relative">
      <div className="grid grid-cols-[auto,1fr] flex-grow-1 relative overflow-auto">
        {/** side bar */}

        <Sidebar />

        {/** content */}
        <div className="bg-[#24222a] min-h-[100vh] flex-1  overflow-auto">
          {/** head title */}
          <CustomStack className="bg-[#24222a] z-40 w-full px-10 justify-between items-center py-6 sticky top-0">
            <Typography className="font-[Inter-Medium] text-[#fafafa] text-xl">
              Dashboard
            </Typography>
          </CustomStack>

          <div className="px-10 flex-1 ">
            {/** Stats */}
            <div className="flex gap-3 divide-x divide-secondary-600 ">
              {statsArray.map((data, index) => {
                return (
                  <Box
                    key={index}
                    className="px-8 py-3.5 flex flex-col justify-center "
                  >
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
            {/** Shortcuts */}
            <div className="flex gap-9 mt-7">
              {shortCuts.map((data, index) => (
                <div
                  onClick={() =>
                    data.path ? navigate(data.path) : data.func()
                  }
                  key={index}
                  className="flex flex-row gap-3 h-[126px] py-[21px] px-[28px] bg-[#36323E] rounded-md ring-1 ring-[#EEF1F4] ring-opacity-30 cursor-pointer select-none hover:bg-opacity-20"
                >
                  <div className="h-[83px] w-[83px] flex justify-center items-center">
                    <img
                      src={data.icon}
                      alt=""
                      className="w-[70.73px] h-[54,53px]"
                    />
                  </div>
                  <div className="flex flex-col gap-2 max-w-[214px]">
                    <h1 className="text-whites-40 text-opacity-80 text-xl font-bold">
                      {data.title}
                    </h1>
                    <p className="text-[#9E9D9D]">{data.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            {/** table */}
            <div className="pt-7 pb-11 flex flex-col gap-4">
              <h1 className="font-[Inter-Medium] text-[#fafafa] text-xl">
                Recent Films
              </h1>
              {/* <WatchedListTable /> */}

              <VideoListTable
              films={filmsQuery.isPending ? [] : filmsQuery.data.films}
            />
            </div>
          </div>
        </div>
      </div>

      {/** snackbar */}
      <Snackbar
        open={snackbarMessage !== null}
        autoHideDuration={6000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbarMessage?.severity} variant="filled">
          {snackbarMessage?.message}
        </Alert>
      </Snackbar>
      
      {/** popup for Movie Film Title Creation */}
      {openFilmModal && (
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
                      <Button
                        onClick={handleModalClose}
                        className="px-5 rounded-lg font-[Inter-Medium] bg-primary-700"
                      >
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
                    <FilmFormContext.Provider
                      value={{ videoData, setVideoData }}
                    >
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
      )}
    </div>
  );
};

export default Dashboard;


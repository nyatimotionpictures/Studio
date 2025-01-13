import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../../../2-Components/Navigation/Sidebar.tsx";
import CustomStack from "../../../../2-Components/Stacks/CustomStack.jsx";
import { Alert, Box, Snackbar, Typography } from "@mui/material";
import Button from "../../../../2-Components/Buttons/Button.tsx";
import VideoListTable from "../../../../2-Components/Tables/VideoListTable.jsx";
import { useNavigate } from "react-router-dom";
import StepperCustom from "../../../../2-Components/Stepper/StepperCustom.jsx";
import ContentDetails from "../../../../2-Components/Forms/ContentDetails.jsx";
import StepperControls from "../../../../2-Components/Stepper/StepperControls.jsx";
import { FilmFormContext } from "../../../../5-Store/FilmFormsContext.js";
import { useGetAllFilms } from "../../../../5-Store/TanstackStore/services/queries.ts";
import { useCreateFilm } from "../../../../5-Store/TanstackStore/services/mutations.ts";
import { useMutation } from "@tanstack/react-query";
import { postFilmContent } from "../../../../5-Store/TanstackStore/services/api.ts";
import { data } from "autoprefixer";
import { queryClient } from "../../../../lib/tanstack.ts";
import SuccessErrorModal from "../../../../2-Components/Modals/SuccessErrorModal.jsx";
import CustomLoader from "../../../../2-Components/Loader/CustomLoader.jsx";

const ContentRepo = () => {
  const [openFilmModal, setOpenFilmModal] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState(null);
  const filmsQuery = useGetAllFilms();
  let navigate = useNavigate();
  //mutation for create film
  const mutation = useMutation({
    mutationFn: postFilmContent,
    onSuccess: (data) => {
     // console.log("data", data);
      setSnackbarMessage({message: data.message, severity: "success"});
      if(data.film.type === "movie" || data.film.type?.includes("film")) {
       navigate(`/content/view/film/${data.film.id}`);
      } else if(data.film.type === "series") {
        navigate(`/content/view/series/${data.film.id}`);
      }
      
    },
    onError: (error) => {
       console.log("error", error);
     if (error?.message){
      setSnackbarMessage(() => ({message: error.message, severity: "error"}));
     }else {
      setSnackbarMessage(() => ({message: error.error, severity: "error"}));
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
  //  const videoRef = useRef(null);
  const [statsArray, setStatsArray] = useState([
    {
      title: "Total Videos",
      stats: 0,
      icon: false,
    },
   

    {
      title: "Total TV Series",
      stats: 0,
      icon: false,
    },
    {
      title: "Total Films",
      stats: 0,
      icon: false,
    },
  ]);

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
  React.useEffect(() => {
    if(filmsQuery.isSuccess) {
      const filterMovies = filmsQuery.data?.films?.filter((data)=> data.type === "movie" || data?.type?.includes("film"));
      const filterSeries = filmsQuery.data?.films?.filter((data)=> data.type === "series");
      setStatsArray(()=> ([
        {
          title: "Total Videos",
          stats: filmsQuery.data?.films?.length ?? 0,
          icon: false,
        },
       
    
        {
          title: "Total TV Series",
          stats: filterSeries?.length ?? 0,
          icon: false,
        },
        {
          title: "Total Films",
          stats: filterMovies?.length ?? 0,
          icon: false,
        },
       
      ]
      
      ))
    }
  }, [filmsQuery.data]);

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

  const handleFilmFormSubmit = (values) => {
    mutation.mutate(values);
  };
  /** handle form display change */
  const FormDisplay = (step) => {
    switch (step) {
      case "Content Details":
        return (
          <ContentDetails
            innerref={formRef}
            handleStepNext={handleFilmFormSubmit}
          />
        );
      default:
        return null;
    }
  };

  //console.log(filmsQuery.data)

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
              <Button
                onClick={handleModalOpen}
                className="px-5 rounded-lg font-[Inter-Medium]"
              >
                Add New Title
              </Button>
            </div>
          </CustomStack>

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

          {/** table */}
          <div className="pt-7 pb-11 ">
            <VideoListTable
              films={filmsQuery.isPending ? [] : filmsQuery?.data?.films}
            />
          </div>
        </div>

        

      </div>

      {
        mutation?.isPending && (
          <CustomLoader text="Uploading..." />
        )
      }

      {/** snackbar */}
      {/* <Snackbar
        open={snackbarMessage !== null}
        autoHideDuration={6000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbarMessage?.severity} variant="filled">
          {snackbarMessage?.message}
        </Alert>
      </Snackbar> */}

<SuccessErrorModal open={snackbarMessage !== null} severity={snackbarMessage?.severity} modalTitle={snackbarMessage?.severity} message={snackbarMessage?.message} handleModalClose={() => setSnackbarMessage(null)} />

      {/** popup upload Movie Modal */}
      {openFilmModal && (
        <CustomStack
          className="relative z-40"
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
                      isSubmitting={mutation?.isPending}
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

export default ContentRepo;

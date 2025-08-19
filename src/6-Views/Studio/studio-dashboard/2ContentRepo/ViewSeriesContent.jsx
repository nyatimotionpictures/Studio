import React from "react";
import Sidebar from "../../../../2-Components/Navigation/Sidebar";
import CustomStack from "../../../../2-Components/Stacks/CustomStack";
import { Alert, Snackbar, Typography } from "@mui/material";

import Button from "../../../../2-Components/Buttons/Button.tsx";
import NewSeasonForm from "../../../../2-Components/Forms/NewSeasonForm.jsx";
import { useGetFilm } from "../../../../5-Store/TanstackStore/services/queries.ts";
import { useParams } from "react-router-dom";
import SeriesTabs from "../../../../2-Components/Tabs/SeriesTabs.jsx";
import { useMutation } from "@tanstack/react-query";
import { createNewSeason } from "../../../../5-Store/TanstackStore/services/api.ts";
import { queryClient } from "../../../../lib/tanstack.ts";
import NoImage from "../../../../1-Assets/no-image.svg";
import CustomLoader from "../../../../2-Components/Loader/CustomLoader.jsx";

const ViewSeriesContent = () => {
  const [newSeason, setNewSeason] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState(null);
  const [isImgBroken, setIsImgBroken] = React.useState(false);
  let params = useParams();
  const [filmId, setFilmId] = React.useState(null);
  const filmsQuery = useGetFilm(params?.id);

  React.useEffect(() => {
    //setFilmId()
    console.log("filmId", filmsQuery.data);
    setFilmId(() => params?.id);
  }, [params?.id]);

  /** use mutation: create new season */
  const createMutation = useMutation({
    mutationFn: createNewSeason,
    onSuccess: async (data) => {
      setSnackbarMessage({ message: data.message, severity: "success" });
      await queryClient.invalidateQueries({
        queryKey: ["film", filmsQuery?.data?.film?.id],
      });
      handleNewSeason();
    },
    onError: (error) => {
      setSnackbarMessage({ message: error.message, severity: "error" });
    },
  });

  const handleImgError = (e) => {
    setIsImgBroken(true);
  };

  const handleNewSeason = () => {
    setNewSeason(() => !newSeason);
  };

  const formRef = React.useRef();

  const handleNewSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    } else {
      alert("No form");
    }
  };

  const handleNewAPISubmission = (values) => {
    //  alert(`form submitted ${editInfo.title}`);
    createMutation.mutate(values);
    // handleEditing()
  };

  if (filmsQuery.isLoading) {
    return (
      <div className="max-h-screen h-[100vh] w-full flex flex-col bg-whites-900 relative">
        <div className="grid grid-cols-[auto,1fr] flex-grow-1 relative overflow-auto">
          {/** side bar */}

          <Sidebar />

          <div className="flex flex-col justify-center items-center h-screen bg-[#24222a]">
            <div className="flex flex-col relative gap-8">
              <div className="w-full h-full relative flex items-center justify-center bg-secondary-800  top-0 left-0 bg-opacity-70 text-red-500">
                <CustomLoader />
              </div>

              <p className="text-center text-xs text-primary-500 font-[Inter-Regular]">
                Loading...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (filmsQuery.isError) {
    return (
      <div className="max-h-screen h-[100vh] w-full flex flex-col bg-whites-900 relative">
        <div className="grid grid-cols-[auto,1fr] flex-grow-1 relative overflow-auto">
          {/** side bar */}

          <Sidebar />

          <div className="flex flex-col justify-center items-center h-screen bg-[#24222a]">
            <div className="flex flex-col relative gap-8">

              <p className="text-center text-xs text-primary-500 font-[Inter-Regular]">
                Error: Check your Internet Connectivity <br />
                Or: Contact Support to Check for Issue.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-screen h-[100vh] w-full flex flex-col bg-whites-900 relative">
      <div className="grid grid-cols-[auto,1fr] flex-grow-1 relative overflow-auto">
        {/** side bar */}

        <Sidebar />

        {/** content */}

        <div className="bg-[#24222a] min-h-[100vh] flex-1 px-10 overflow-auto">
          {/** title */}
          <CustomStack className="bg-[#24222a] z-50 w-full justify-between items-start py-6 sticky gap-1 top-0 flex-col ">

            <div className="flex flex-row items-center gap-9">
              {/* Back Button */}
              <Button
                className="px-4 py-2 rounded-lg font-[Inter-Medium] bg-primary-700 text-[#fafafa]"
                onClick={() => window.history.back()}
              >
                ← Back
              </Button>

              <div className="flex flex-col gap-1">

                <div className="flex flex-row items-center gap-9">
                  <Typography className="font-[Inter-Medium] text-[#fafafa] text-xl">
                    {filmsQuery.data?.film?.title}
                  </Typography>

                  <div className=" font-[Inter-Medium] select-none  text-xs flex w-max h-max text-primary-500 px-2 py-1 border border-primary-500 rounded-lg bg-secondary-800 ">
                    {filmsQuery.data?.film?.type}
                  </div>
                </div>

                <div className="">
                  <ul className="font-[Inter-Regular] text-[#FFFAF6] flex list-disc w-full space-x-8 text-base flex-wrap gap-y-3 items-start justify-start">
                    <li className="w-max list-none">
                      {filmsQuery.data?.film?.type}{" "}
                    </li>
                    <li className="w-max">
                      {filmsQuery.data?.film?.yearOfProduction}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* <div className="absolute right-0">
                          <Button
                              onClick={() => handleEditSeries()}
                              className="flex items-center gap-2 w-max bg-primary-500 bg-opacity-40 rounded-lg px-4"
                          >
                              <span className="icon-[solar--pen-new-square-linear] w-4 h-4"></span>
                              <Typography className="font-[Inter-SemiBold]">Edit Series Details</Typography>
                          </Button>
                      </div> */}
          </CustomStack>

          {/** Movie Details & Tabs  */}
          <div className="pt-7 pb-11 ">
            {/** Movie details */}
            <div className="flex flex-row gap-4">
              {/** image */}

              <img
                onError={handleImgError}
                src={
                  isImgBroken ? NoImage : filmsQuery.data?.film?.posters[0]?.url
                }
                alt=""
                className="w-[210.15px] object-cover h-[272.5px]"
              />

              <div className="flex flex-col max-w-[640px] gap-6">
                <h1 className="font-[Inter-Regular] text-sm text-[#FFFAF6] text-opacity-70">
                  {filmsQuery.data?.film?.overview}
                </h1>
                <div className="flex flex-wrap gap-3">
                  {filmsQuery.data?.film?.genre.map((data, index) => {
                    return (
                      <div
                        key={index}
                        className="flex py-1 px-5 bg-[#D9D9D9] bg-opacity-15 rounded-full ring-1 ring-[#FFFFFE] text-whites-50"
                      >
                        {data}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-7">
              <SeriesTabs
                film={filmsQuery.data?.film}
                type={"series"}
                handleNewSeason={handleNewSeason}
              />
            </div>
          </div>
        </div>
      </div>

      {/** Popup for New Season */}
      {newSeason && (
        <CustomStack
          className="relative z-50"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="false"
        >
          <div className="fixed inset-0 border rounded-xl bg-secondary-500 bg-opacity-75 transition-opacity"></div>

          <div className="fixed inset-0 z-50 bg-primary-200 bg-opacity-10 overflow-hidden">
            <div className="relative transform overflow-y-auto rounded-lg  bg-opacity-20 flex items-center justify-center h-screen text-left shadow-xl transition-all">
              <div className="bg-secondary-900 px-16 pt-0 w-full max-w-[700px] rounded-lg  h-max">
                {/** Edit forms  */}
                <div className="flex flex-col w-full h-full text-whites-40 gap-6 relative">
                  <CustomStack className="z-50 w-full justify-between items-center py-2 pt-7 sticky top-0 bg-secondary-900">
                    <Typography className="font-[Inter-Medium] text-[#fafafa] text-xl">
                      Add New Season / Segement
                    </Typography>

                    <div className="flex gap-5">
                      <Button
                        onClick={handleNewSeason}
                        className="px-5 rounded-lg font-[Inter-Medium] bg-primary-700"
                      >
                        CANCEL & CLOSE
                      </Button>
                    </div>
                  </CustomStack>

                  {/** stepper show case */}

                  {/** form */}
                  <div className="block mb-3 h-full">
                    <NewSeasonForm
                      innerref={formRef}
                      handleStepNext={handleNewAPISubmission}
                      film={filmsQuery?.data?.film}
                    />
                  </div>

                  {/** stepper control */}
                  <div className="border-t-2 border-t-secondary-500 relative">
                    <div className="container flex items-center justify-end mx-0  mt-4 mb-8 ">
                      {createMutation.isPending ? (
                        <Button
                          disabled
                          className="w-max min-w-[150px] px-5 rounded-lg"
                        >
                          Submitting...
                        </Button>
                      ) : (
                        <Button
                          onClick={handleNewSubmit}
                          className="w-max min-w-[150px] px-5 rounded-lg"
                        >
                          Save & Close form
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CustomStack>
      )}

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
    </div>
  );
};

export default ViewSeriesContent;

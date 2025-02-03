import React, { useEffect } from "react";
import Button from "../Buttons/Button";
import VideoUpload from "./VideoUpload";
import { queryClient } from "../../lib/tanstack";
import CustomStack from "../Stacks/CustomStack";
import {
  useDeleteVideo,
  useUpdateVideoPrice,
} from "../../5-Store/TanstackStore/services/mutations";
import { Alert, Snackbar, Typography } from "@mui/material";
import UpdatePriceForm from "../Forms/UpdatePriceForm";
import { useParams } from "react-router-dom";
import { Player } from "video-react";
import "video-react/dist/video-react.css";
import VideoUploadMultiple from "./VideoUploadMultiple";
import CustomLoader from "../Loader/CustomLoader";
import TrailerUploadVideo from "../UploadsVideo/TrailerUploadVideo";
import MultipleUploadVideo from "../UploadsVideo/MultipleUploadVideo";

const ViewTrailerFilm = ({ film, type, isLoading, refetch }) => {
  //console.log("films", film);
  const [updatePriceId, setUpdatePriceId] = React.useState(null);
  let params = useParams();

  const [videoType, setVideoType] = React.useState(null);
  const [videoPrice, setVideoPrice] = React.useState(null);

  const [snackbarMessage, setSnackbarMessage] = React.useState(null);

  const [videoDeleteId, setVideoDeleteId] = React.useState(null);
  const [videoTrailer, setVideoTrailer] = React.useState(null);

  const [videoSD, setVideoSD] = React.useState(null);
  const [videoHD, setVideoHD] = React.useState(null);
  const [videoFHD, setVideoFHD] = React.useState(null);
  const [videoUHD, setVideoUHD] = React.useState(null);
  const [errorUpload, setErrorUpload] = React.useState(null);
  const [sucessUpload, setSucessUpload] = React.useState(null);

  const formRef = React.useRef();

  const handleFormSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    } else {
      alert("No form");
    }
  };




  //console.log("video", film?.video)
  useEffect(() => {
    if (film?.video?.length > 0) {
      film?.video?.filter((data) => {
        console.log("data", data)
        if (data.isTrailer === true && data.resolution === "HD") {
          setVideoTrailer(data);
        }

        if (data?.resolution?.toLowerCase() === "sd") {
          setVideoSD(data);
        }
        if (data?.resolution?.toLowerCase() === "hd" && data.isTrailer === false) {
          setVideoHD(data);
        }
        if (data?.resolution?.toLowerCase() === "full_hd") {
          setVideoFHD(data);
        }
        if (data?.resolution?.toLowerCase() === "ultra_hd") {
          setVideoUHD(data);
        }
      });
    } else {
      setVideoTrailer(null);
      setVideoSD(null);
      setVideoHD(null);
      setVideoFHD(null);
      setVideoUHD(null);
    }
  }, [film?.video, isLoading]);

  let deleteFun = (id) => {
    console.log(id);
    setVideoDeleteId(() => id);
  };

  let cancelDeleteFun = () => {
    setVideoDeleteId(() => null);
  };

  let deleteVideoMutation = useDeleteVideo();

  let updateVideoPriceMutation = useUpdateVideoPrice();

  let confirmDeleteFun = (posterId) => {
    // console.log(posterId)
    deleteVideoMutation.mutate(posterId, {
      onSuccess: async (data, variables, context) => {
        // console.log("run second");
        // refetch();
        setSnackbarMessage({ message: data.message, severity: "success" });
         //await queryClient.invalidateQueries({ queryKey: ["film", params?.id] });
        //  await queryClient.prefetchQuery({ queryKey: ["film", params?.id] });
        setVideoTrailer(() => null);
        setVideoSD(() => null);
        setVideoHD(() => null);
        setVideoUHD(() => null);
        setVideoFHD(() => null);
        cancelDeleteFun();
        await queryClient.invalidateQueries({ queryKey: ["film", params?.id] });
      },
      onError: (error) => {
        if (error?.message) {
          setSnackbarMessage(() => ({
            message: error.message,
            severity: "error",
          }));
          cancelDeleteFun();
        }
      },
    });
    //cancelDeleteFun()
  };

  // const handleUpdatePrice = (id, types, currentPrice) => {
  //   setUpdatePriceId(() => ({
  //     id: id,
  //     filmTypes: types,
  //     currentPrice: currentPrice,
  //   }));
  // };

  // const handleUpdatePriceClose = () => {
  //   setUpdatePriceId(() => null);
  // };

  // const handleUpdatePriceSubmit = (data) => {
  //   //updatePrice(data)
  // };

  // const handleAPISubmission = (editInfo) => {
  //   //updateSeasonMutation.mutate(editInfo);
  //   updateVideoPriceMutation.mutate(editInfo, {
  //     onSuccess: async (data, variables, context) => {
  //       // console.log("run second");
  //       setSnackbarMessage({ message: data.message, severity: "success" });
  //       setVideoTrailer(() => null);
  //       setVideoSD(() => null);
  //       setVideoHD(() => null);
  //       setVideoUHD(() => null);
  //       setVideoFHD(() => null);
  //       // handleUpdatePriceClose();
  //       await queryClient.invalidateQueries({ queryKey: ["film", params?.id] });
  //     },
  //     onError: (error) => {
  //       //  console.log("error", error);
  //       if (error?.message) {
  //         setSnackbarMessage(() => ({
  //           message: error.message,
  //           severity: "error",
  //         }));
  //         handleUpdatePriceClose();
  //       }
  //     },
  //   });
  // };

  console.log(isLoading)

  if (isLoading) {
    return (
      <>
        <CustomLoader />
      </>
    );
  }

  return (
    <div className="flex flex-col h-full w-full gap-14 max-w-[1000px] relative">
      {/** Trailer */}
      {videoTrailer ? (
        <div className="flex flex-col  gap-6">
          <div className="flex flex-row  gap-8 items-center max-w-[80%]">
            <div className="flex flex-col gap-[7px] min-w-[150px] ">
              <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
                Trailer
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex flex-col gap-[20px]">
              <div className="bg-[#36323E] w-[470px] h-[266px]  flex ">
                <Player
                  src={videoTrailer?.url}
                  controls
                  className="w-full object-cover "
                  style={{ width: "100%", height: "100%" }}
                />
              </div>

              <div className="flex flex-row gap-10 mt-4">
                <div className="flex flex-col gap-1">
                  <h1 className="font-[Inter-Regular] text-base text-[#706E72]">
                    Duration
                  </h1>
                  <p className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
                    {videoTrailer?.duration}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <h1 className="font-[Inter-Regular] text-base text-[#706E72]">
                    Size
                  </h1>
                  <p className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
                    {videoTrailer?.size}
                  </p>
                </div>
              </div>

              {/** delete video */}
              <div className="flex flex-row gap-10">
                <Button
                  onClick={() => deleteFun(videoTrailer?.id)}
                  className="bg-transparent border border-primary-500 rounded-full px-4 text-primary-500 font-[Inter-Regular] text-opacity-50 border-opacity-50 hover:text-opacity-100 hover:border-opacity-100 hover:bg-transparent"
                >
                  Delete Video
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {type !== "episode" && (
            <TrailerUploadVideo
              videoType={"Trailer"}
           
              film={film}
              type={type}
              videoPrice={videoPrice}
              setErrorUpload={setErrorUpload}
              setSucessUpload={setSucessUpload}
              errorUpload={errorUpload}
              sucessUpload={sucessUpload}
            />
          )}
        </>
      )}

      {film?.type !== "series" && type !== "series" && (
        <>
          {!videoSD && !videoHD && !videoUHD && !videoFHD ? (
            <>
              <MultipleUploadVideo
                videoType={"all"}
                
                film={film}
                type={type}
                videoPrice={videoPrice}
                setErrorUpload={setErrorUpload}
                setSucessUpload={setSucessUpload}
                errorUpload={errorUpload}
                sucessUpload={sucessUpload}
              />
            </>
          ) : (
            <>
            <div className="w-[500px] flex flex-col items-center">
              <Button onClick={() => deleteFun(params?.id)}>Delete The Resolutions</Button>
            </div>
              {/** SD */}
              {film?.type !== "series" && type !== "series" && (
                <>
                  {videoSD && (
                    <div className="flex flex-col  gap-6">
                      <div className="flex items-center gap-8 max-w-[80%]">
                        <div className="flex flex-col gap-[7px] min-w-[150px]">
                          <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
                            SD (480P)
                          </h1>
                        </div>
                      </div>

                      <div className="flex flex-col gap-5">
                        {/** price */}
                        {/** FILM */}
                        <div className="bg-[#36323E] w-[500px] h-[266px] flex ">
                          <Player
                            src={videoSD?.url}
                            controls
                            className="w-full object-cover "
                            style={{ width: "100%", height: "100%" }}
                          />
                        </div>
                        {/** delete video */}
                        {/* <div className="flex flex-row gap-10 mt-10">
                          <Button
                            onClick={() => deleteFun(videoSD?.id)}
                            className="bg-transparent border border-primary-500 rounded-full px-4 text-primary-500 font-[Inter-Regular] text-opacity-50 border-opacity-50 hover:text-opacity-100 hover:border-opacity-100 hover:bg-transparent"
                          >
                            Delete Video
                          </Button>
                        </div> */}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/** hd */}
              {film?.type !== "series" && type !== "series" && (
                <>
                  {videoHD && (
                    <div className="flex flex-col  gap-6">
                      <div className="flex items-center gap-8 max-w-[80%]">
                        <div className="flex flex-col gap-[7px] min-w-[150px]">
                          <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
                            HD (720P)
                          </h1>
                        </div>

                       
                      </div>

                      <div className="flex flex-col gap-5">
                        {/** price */}

                        {/** FILM */}
                        <div className="bg-[#36323E] w-[500px] h-[266px] flex ">
                          <Player
                            src={videoHD?.url}
                            controls
                            className="w-full object-cover "
                            style={{ width: "100%", height: "100%" }}
                          />
                        </div>

                        {/** delete video */}
                        {/* <div className="flex flex-row gap-10 mt-10">
                          <Button
                            onClick={() => deleteFun(videoHD?.id)}
                            className="bg-transparent border border-primary-500 rounded-full px-4 text-primary-500 font-[Inter-Regular] text-opacity-50 border-opacity-50 hover:text-opacity-100 hover:border-opacity-100 hover:bg-transparent"
                          >
                            Delete Video
                          </Button>
                        </div> */}
                      </div>
                    </div>
                  ) }
                </>
              )}

              {/** fullhd */}
              {film?.type !== "series" && type !== "series" && (
                <>
                  {videoFHD && (
                    <div className="flex flex-col  gap-6">
                      <div className="flex items-center gap-8 max-w-[80%]">
                        <div className="flex flex-col gap-[7px] min-w-[150px]">
                          <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
                            Full HD (1080P)
                          </h1>
                        </div>
                      </div>

                      <div className="flex flex-col gap-5">
                  
                        {/** FILM */}
                        <div className="bg-[#36323E] w-[500px] h-[266px] flex ">
                          <Player
                            src={videoFHD?.url}
                            controls
                            className="w-full object-cover "
                            style={{ width: "100%", height: "100%" }}
                          />
                        </div>
                       
                      </div>
                    </div>
                  ) }
                </>
              )}

              {/** ultrahd */}
              {film?.type !== "series" && type !== "series" && (
                <>
                  {videoUHD && (
                    <div className="flex flex-col  gap-6">
                      <div className="flex items-center gap-8 max-w-[80%]">
                        <div className="flex flex-col gap-[7px] min-w-[150px]">
                          <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
                            Ultra HD (2160p)
                          </h1>
                        </div>
                   
                      </div>

                      <div className="flex flex-col gap-5">
                        {/** price */}

                        {/** FILM */}
                        <div className="bg-[#36323E] w-[500px] h-[266px] flex ">
                          <Player
                            src={videoUHD?.url}
                            controls
                            className="w-full object-cover "
                            style={{ width: "100%", height: "100%" }}
                          />
                        </div>

                        {/** delete video */}
                        {/* <div className="flex flex-row gap-10 mt-10">
                          <Button
                            onClick={() => deleteFun(videoUHD?.id)}
                            className="bg-transparent border border-primary-500 rounded-full px-4 text-primary-500 font-[Inter-Regular] text-opacity-50 border-opacity-50 hover:text-opacity-100 hover:border-opacity-100 hover:bg-transparent"
                          >
                            Delete Video
                          </Button>
                        </div> */}
                      </div>
                    </div>
                  ) }
                </>
              )}
            </>
          )}
        </>
      )}

      {/** video single upload modal */}
      {/* {openVideoModal && (
        <div className="flex flex-col gap-8 absolute top-0 left-0 w-full h-full  cursor-pointer">
          <VideoUpload
            videoType={videoType}
            handleModalClose={handleVideoModalClose}
            film={film}
            type={type}
            videoPrice={videoPrice}
            setErrorUpload={setErrorUpload}
            setSucessUpload={setSucessUpload}
            errorUpload={errorUpload}
            sucessUpload={sucessUpload}
          />
        </div>
      )} */}

      {/** video multiple upload modal */}
      {/* {openVideoMultipleModal && (
        <div className="flex flex-col gap-8 absolute top-0 left-0 w-full h-full  cursor-pointer">
          <VideoUploadMultiple
            videoType={videoType}
            handleModalClose={handleVideoMultipleModalClose}
            film={film}
            type={type}
            videoPrice={videoPrice}
            setErrorUpload={setErrorUpload}
            setSucessUpload={setSucessUpload}
            errorUpload={errorUpload}
            sucessUpload={sucessUpload}
          />
        </div>
      )} */}

      {/** error & sucess message */}

      {/** Modal for deleting Film */}
      {videoDeleteId && (
        <CustomStack
          className="relative z-50"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="false"
        >
          <div className="fixed inset-0 z-50 bg-primary-200 bg-opacity-10 overflow-hidden">
            <div className="flex justify-center items-center top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm z-50 cursor-pointer">
              <div className="flex flex-col items-center bg-whites-500 text-white rounded-lg p-4 shadow-lg gap-5">
                <div className="text-xl font-bold font-[Inter-Bold]">
                  Are you sure you want to delete this?
                </div>
                <div className="flex flex-col items-center bg-whites-500 text-white gap-5">
                  {deleteVideoMutation.isPending ? (
                    <Button className="bg-primary-500 hover:bg-primary-700 w-full text-whites-40 text-opacity-80 font-bold py-2 px-4 rounded min-w-[150px] font-[Inter-SemiBold]">
                      Deleting...
                    </Button>
                  ) : (
                    <>
                      {" "}
                      <Button
                        className="bg-primary-500 hover:bg-primary-700 w-full text-whites-40 text-opacity-80 font-bold py-2 px-4 rounded min-w-[150px] font-[Inter-SemiBold]"
                        onClick={() => confirmDeleteFun(videoDeleteId)}
                      >
                        Yes
                      </Button>
                      <Button
                        className="bg-secondary-500 hover:bg-secondary-700 text-whites-40 font-bold font-[Inter-SemiBold] py-2 px-4 rounded min-w-[150px]"
                        onClick={cancelDeleteFun}
                      >
                        No
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CustomStack>
      )}

      {/** Popup for Updating Price */}
      {updatePriceId && type !== "episode" && (
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
                      Update Price for{" "}
                      {updatePriceId?.filmTypes ? updatePriceId?.filmTypes : ""}
                    </Typography>

                    <div className="flex gap-5">
                      <Button
                        onClick={handleUpdatePriceClose}
                        className="px-5 rounded-lg font-[Inter-Medium] bg-primary-700"
                      >
                        CANCEL & CLOSE
                      </Button>
                    </div>
                  </CustomStack>

                  {/** stepper show case */}

                  {/** form */}
                  <div className="block mb-3 h-full">
                    <UpdatePriceForm
                      innerref={formRef}
                      handleStepNext={handleAPISubmission}
                      film={film}
                      filmTypes={updatePriceId}
                    />
                  </div>

                  {/** stepper control */}
                  <div className="border-t-2 border-t-secondary-500 relative">
                    <div className="container flex items-center justify-end mx-0  mt-4 mb-8 ">
                      {updateVideoPriceMutation.isPending ? (
                        <Button
                          disabled
                          className="w-max min-w-[150px] px-5 rounded-lg"
                        >
                          Submitting...
                        </Button>
                      ) : (
                        <Button
                          onClick={handleFormSubmit}
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

export default ViewTrailerFilm;

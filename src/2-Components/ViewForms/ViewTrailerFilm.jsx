import React, { useEffect } from "react";
import Button from "../Buttons/Button";
import VideoUpload from "./VideoUpload";
import { queryClient } from "../../lib/tanstack";
import CustomStack from "../Stacks/CustomStack";
import {
  useDeleteAllVideo,
  useDeleteVideo,
} from "../../5-Store/TanstackStore/services/mutations";
import { Alert, Snackbar, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { Player } from "video-react";
import "video-react/dist/video-react.css";
import CustomLoader from "../Loader/CustomLoader";
import TrailerUploadVideo from "../UploadsVideo/TrailerUploadVideo";
import MultipleUploadVideo from "../UploadsVideo/MultipleUploadVideo";
import VideoProcessingStatus from "../TrackProgress/VideoProcessingStatus";
import apiRequest from "../../3-Middleware/apiRequest";

const ViewTrailerFilm = ({ film, type, isLoading, refetch }) => {
  let params = useParams();
  const [snackbarMessage, setSnackbarMessage] = React.useState(null);
  const [videoDeleteId, setVideoDeleteId] = React.useState(null);
  const [videoIds, setVideoIds] = React.useState(null);
  const [existingJob, setExistingJob] = React.useState(null);
  const [checkingJob, setCheckingJob] = React.useState(false);

  const [videoTrailer, setVideoTrailer] = React.useState(null);

  const [videoSD, setVideoSD] = React.useState(null);
  const [videoHD, setVideoHD] = React.useState(null);
  const [videoFHD, setVideoFHD] = React.useState(null);
  const [videoUHD, setVideoUHD] = React.useState(null);
  const [errorUpload, setErrorUpload] = React.useState(null);
  const [sucessUpload, setSucessUpload] = React.useState(null);

  const formRef = React.useRef();

  const checkExistingJob = async () => {
    if (!film?.id) return;
    
    setCheckingJob(true);
    try {
      const response = await apiRequest.get('/v1/studio/processing-jobs/check-existing', {
        params: {
          resourceId: film.id,
          type: type === 'episode' ? 'episode' : 'film'
        }
      });
      
      if (response.data.hasExistingJob) {
        setExistingJob(response.data.existingJob);
      } else {
        setExistingJob(null);
      }
    } catch (error) {
      console.error('Error checking existing job:', error);
      setExistingJob(null);
    } finally {
      setCheckingJob(false);
    }
  };

  // Re-check for existing jobs when film data changes
  useEffect(() => {
    checkExistingJob();
  }, [film?.id, type]);

  // Re-check for existing jobs after successful uploads
  useEffect(() => {
    if (sucessUpload) {
      // Wait a bit for the job to be created, then re-check
      setTimeout(() => {
        checkExistingJob();
      }, 2000);
    }
  }, [sucessUpload]);

  const handleFormSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    } else {
      alert("No form");
    }
  };

  useEffect(() => {
    if (type !== "season"){
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
          if (data?.resolution?.toLowerCase() === "fhd") {
            setVideoFHD(data);
          }
          if (data?.resolution?.toLowerCase() === "uhd") {
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
    }else {
      if (film?.trailers?.length > 0) {
       
        setVideoTrailer(film?.trailers[0]);
      }else {
        setVideoTrailer(null);
      }
    }

  }, [film, isLoading]);

  let deleteFun = (id) => {
    console.log(id);
    setVideoDeleteId(() => id);
  };

  let cancelDeleteFun = () => {
    setVideoDeleteId(() => null);
  };

  //Delete All Videos
  let deleteAllVideosMutation = useDeleteAllVideo();

  let deleteAllVideos = (ids) => {
   
    let videostoDelete = {
      videoIds: ids,
    }
    setVideoIds(() => (videostoDelete))
  }

  let cancelAllDeleteFun = () => {
    setVideoIds(() => null);
  };

  let confirmDeleteAllFun = (ids) => {
    // console.log(posterId)
    deleteAllVideosMutation.mutate(ids, {
      onSuccess: async (data, variables, context) => {
        setSnackbarMessage({ message: data.message, severity: "success" });
         
        setVideoTrailer(() => null);
        setVideoSD(() => null);
        setVideoHD(() => null);
        setVideoUHD(() => null);
        setVideoFHD(() => null);
        cancelAllDeleteFun();
        await queryClient.invalidateQueries({ queryKey: ["film", params?.id] });
      },
      onError: (error) => {
        if (error?.message) {
          setSnackbarMessage(() => ({
            message: error.message,
            severity: "error",
          }));
          cancelAllDeleteFun();
        }
      },
    });
    //cancelDeleteFun()
  };



  let deleteVideoMutation = useDeleteVideo();

  let confirmDeleteFun = (posterId) => {
    // console.log(posterId)
    deleteVideoMutation.mutate(posterId, {
      onSuccess: async (data, variables, context) => {
        setSnackbarMessage({ message: data.message, severity: "success" });
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
              setErrorUpload={setErrorUpload}
              setSucessUpload={setSucessUpload}
              errorUpload={errorUpload}
              sucessUpload={sucessUpload}
            />
          )}
        </>
      )}

      {/** Multiple Upload Video */}

      {film?.type !== "series" && type !== "season" && (
        <>
          {/* Show processing status if there's an existing job */}
          {existingJob && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-8 max-w-[80%]">
                <div className="flex flex-col gap-[7px] min-w-[150px]">
                  <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
                    Video Processing
                  </h1>
                  <p className="font-[Inter-Regular] text-base text-[#706E72]">
                    A video is currently being processed for this resource
                  </p>
                </div>
                <Button
                  onClick={checkExistingJob}
                  disabled={checkingJob}
                  className="w-max min-w-[100px]"
                >
                  {checkingJob ? 'Checking...' : 'Refresh'}
                </Button>
              </div>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Processing Job:</strong> {existingJob.fileName}
                  <br />
                  <strong>Status:</strong> {existingJob.status} | <strong>Progress:</strong> {existingJob.progress}%
                  <br />
                  <strong>Created:</strong> {new Date(existingJob.createdAt).toLocaleString()}
                </Typography>
              </Alert>
              
              <VideoProcessingStatus clientId={film?.id} />
            </div>
          )}
          
          {/* Show upload components only if no existing job */}
          {!existingJob && (
            <>
              {!videoSD && !videoHD && !videoUHD && !videoFHD ? (
                <>
                  <MultipleUploadVideo
                    videoType={"all"}
                    film={film}
                    type={type}
                    setErrorUpload={setErrorUpload}
                    setSucessUpload={setSucessUpload}
                    errorUpload={errorUpload}
                    sucessUpload={sucessUpload}
                  />
                </>
              ) : (
                <>
                  <div className=" flex flex-col gap-10 items-start w-full">
                    <Button
                      onClick={() =>
                        deleteAllVideos([
                          videoSD?.id,
                          videoHD?.id,
                          videoUHD?.id,
                          videoFHD?.id,
                        ])
                      }
                    >
                      Delete Videos
                    </Button>

                    {!videoSD || !videoHD || !videoUHD || !videoFHD ? (
                      <>
                   
                      <div className="flex flex-col gap-4 items-start w-full">
                        <div>
                          <Typography className="text-base capitalize text-[#EF4444]  font-[Inter-SemiBold]">
                            Missing Some Versions Please re-upload Videos
                          </Typography>
                        </div>
                        
                        <MultipleUploadVideo
                          videoType={"all"}
                          film={film}
                          type={type}
                          setErrorUpload={setErrorUpload}
                          setSucessUpload={setSucessUpload}
                          errorUpload={errorUpload}
                          sucessUpload={sucessUpload}
                        />
                      </div>
                      </>
                     
                    ) : null}
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
                      )}
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
                      )}
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
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}

      {/** error & sucess message */}

      {/** Modal for deleting Trailer */}
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

      {/** Modal for deleting All Videos */}
      {videoIds?.videoIds?.length > 0 && (
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
                  Are you sure you want to delete all videos?
                </div>
                <div className="flex flex-col items-center bg-whites-500 text-white gap-5">
                  {deleteAllVideosMutation.isPending ? (
                    <Button className="bg-primary-500 hover:bg-primary-700 w-full text-whites-40 text-opacity-80 font-bold py-2 px-4 rounded min-w-[150px] font-[Inter-SemiBold]">
                      Deleting...
                    </Button>
                  ) : (
                    <>
                      {" "}
                      <Button
                        className="bg-primary-500 hover:bg-primary-700 w-full text-whites-40 text-opacity-80 font-bold py-2 px-4 rounded min-w-[150px] font-[Inter-SemiBold]"
                        onClick={() => confirmDeleteAllFun(videoIds)}
                      >
                        Yes
                      </Button>
                      <Button
                        className="bg-secondary-500 hover:bg-secondary-700 text-whites-40 font-bold font-[Inter-SemiBold] py-2 px-4 rounded min-w-[150px]"
                        onClick={cancelAllDeleteFun}
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

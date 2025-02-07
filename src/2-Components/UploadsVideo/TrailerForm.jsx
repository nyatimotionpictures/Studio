import React, { useState, useEffect } from "react";
import CustomStack from "../Stacks/CustomStack";
import { Alert, Snackbar, Typography } from "@mui/material";
import Button from "../Buttons/Button";
import * as yup from "yup";
import { Form, Formik } from "formik";
import { FormContainer } from "../Stacks/InputFormStack";
import ErrorMessage from "../Forms/ErrorMessage";
import axios from "axios";
import { BaseUrl } from "../../3-Middleware/apiRequest";
//import UploadProgress from "../TrackProgress/UploadProgress";
import { queryClient } from "../../lib/tanstack";
import { useParams } from "react-router-dom";
import socket from "../../lib/socket";

const TrailerForm = ({
  videoType,
  film,
  type,
  videoPrice,
  setErrorUpload,
  setSucessUpload,
  errorUpload,
  sucessUpload,
  handleModalClose,
}) => {
  let params = useParams();
 
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [chunkProgress, setChunkProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [transcodeProgress, setTranscodeProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [uploadedChunks, setUploadedChunks] = useState([]);
  const [totalChunks, setTotalChunks] = useState(0);
  const [chunkSize, setChunkSize] = useState(10 * 1024 * 1024); // Default to 1 MB
  //const [eventStreamMessages, setEventStreamMessages] = useState([]);


  const abortController = React.useRef(null);
  const MAX_RETRIES = 3;

  const validationSchema = yup.object().shape({
    film: yup
      .mixed()
      .required("Video is required")
      .test("fileType", "Unsupported file format", (value) => {
        if (value) {
          //console.log("value", value)
          return ["video/mp4", "video/webm", "video/ogg"].includes(value.type);
        }
        //return true;
      }),

    type: yup.string().required("type is required"),
  });

  let initialValues = {
    film: null,

    type:
      type === "episode"
        ? "episode"
        : type?.includes("film")
        ? "film"
        : type?.includes("season")
        ? "season"
        : type?.includes("series")
        ? "film"
        : "",
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("video/")) {
      setFile(selectedFile);
      setChunkProgress(0);
      setUploadProgress(0);
      setTranscodeProgress(0);
      setUploadedChunks([]);
      setTotalChunks(Math.ceil(selectedFile.size / chunkSize));
      const videoURL = URL.createObjectURL(selectedFile);
      setPreview(videoURL);
    } else {
      alert("Please select a valid video file");
    }
  };

  const checkChunkExists = async (start) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user !== null && user.token ? user.token : null;
    try {
      const response = await axios.get(
        `${BaseUrl}/v1/studio/check-upload-chunk`,
        {
          params: { fileName: file.name, start },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.exists;
    } catch (error) {
      console.error("Error checking chunk:", error);
      return false;
    }
  };

  const uploadChunk = async (chunk, start, retries = 0) => {
    const user = JSON.parse(localStorage.getItem("user"));

    const token = user !== null && user.token ? user.token : null;
    const formData = new FormData();
    formData.append("chunk", chunk);
    formData.append("start", start);
    formData.append("fileName", file.name);
    formData.append("type", type === "episode" ? "episode" : "film");

    try {
      let id = type === "episode" ? params?.episodeId : film?.id;

      let axiosurl;

      if (videoType === "Trailer") {
        axiosurl =
          type === "season"
            ? `${BaseUrl}/v1/studio/upload-chunk`
            : `${BaseUrl}/v1/studio/upload-chunk`;
      } else {
      }

      // "http://localhost:5000/api/upload-chunk",
      await axios.post(axiosurl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        signal: abortController.current.signal,
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round(
            ((start + progressEvent.loaded) / file.size) * 100
          );
          setChunkProgress(percentage);
        },
      });
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Upload paused");
      } else {
        if (retries < MAX_RETRIES) {
          console.warn(`Retrying chunk ${start}... (${retries + 1})`);
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, retries) * 1000)
          );
          return uploadChunk(chunk, start, retries + 1);
        } else {
          if (error?.response) {
            setErrorUpload(
              `Error ${error.response.status}: ${error.response.statusText}`
            );
          } else if (error.request) {
            setErrorUpload(
              "No response from server. Please check your network connection."
            );
          } else {
            setErrorUpload(`Request failed: ${error.message}`);
          }
          throw error;
        }
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setIsPaused(false);
    abortController.current = new AbortController();
    const localUploadedChunks =
      JSON.parse(localStorage.getItem(file.name)) || [];
    setUploadedChunks(localUploadedChunks);

    for (let i = localUploadedChunks.length; i < totalChunks; i++) {
      if (isPaused) break;

      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      const exists = await checkChunkExists(start);
      if (exists) {
        console.log(`Chunk ${i} already exists, skipping...`);
        continue;
      }

      try {
        await uploadChunk(chunk, start);
        localUploadedChunks.push(i);
        setUploadedChunks([...localUploadedChunks]);
        localStorage.setItem(file.name, JSON.stringify(localUploadedChunks));
      } catch (error) {
        alert("Error uploading chunk. Pausing upload.");
        handlePauseUpload();
        break;
      }
    }

    if (localUploadedChunks.length === totalChunks) {
      await completeUpload();
    }
  };

  const completeUpload = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user !== null && user.token ? user.token : null;
    let axiosurl =
      type === "season"
        ? `${BaseUrl}/v1/studio/trailer-upload`
        : `${BaseUrl}/v1/studio/trailer-upload`;
    try {
      // "http://localhost:5000/api/complete-upload",
      let ftypes = type?.includes("episode")
      ? "episode"
      : type?.includes("film")
      ? "film"
      : type?.includes("series")
      ? "film"
      : type?.includes("season")
      ? "season"
      : "";
      // console.log("flim",type,ftypes, film);
      let resourceId = film?.id;
      const response = await axios.post(axiosurl, {
        type: ftypes,
        resourceId: resourceId,
        fileName: file.name,
        clientId: socket.id,
        isTrailer: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }, 
      }
    );

      if (response.data) {
        setSucessUpload("Successfully Uploaded Trailer to DigitalOcean Spaces");
        localStorage.removeItem(file.name);
        await queryClient.invalidateQueries({
          queryKey: ["film", params?.id],
        });
        alert("Upload to DigitalOcean Spaces completed successfully!");
        //   setUploadProgress(100);
      }
    } catch (error) {
      console.error("Error completing upload:", error);
      localStorage.removeItem(file.name);
      if (error?.response) {
        setErrorUpload(
          `Error ${error.response.status}: ${error.response.statusText}`
        );
      } else if (error.request) {
        setErrorUpload(
          "No response from server. Please check your network connection."
        );
      } else {
        setErrorUpload(`Request failed: ${error.message}`);
      }
      alert("Failed to complete upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePauseUpload = () => {
    if (abortController?.current) {
      abortController.current.abort();
    }

    setIsPaused(true);
    setIsUploading(false);
  };

  const handleResumeUpload = () => {
    abortController.current = new AbortController();
    setIsPaused(false);
    setIsUploading(() => true);

    handleUpload();
  };

  const handleCancelUpload = () => {
    localStorage.removeItem(file.name);
    setIsUploading(false);
    setIsPaused(false);
    setUploadProgress({});
    setTranscodeProgress({});
    setChunkProgress(0);
    setUploadedChunks([]);
    setPreview(null);
    // handleModalClose();
  };

  const handleTryAgain = () => {
    setIsUploading(false);
    setErrorUpload(null);
    setSucessUpload(null);
  };

  useEffect(() => {
    // socketRef.current = io("ws://localhost:5000");
    socket.connect();

    socket.on("uploadProgress", ({ content, progress }) => {
      setUploadProgress((prev) => ({
        ...prev,
        [content?.type]: progress,
      }));
    });

    socket.on("TranscodeProgress", ({ label, customProgress }) => {
      setTranscodeProgress((prev) => ({
        ...prev,
        [label]: customProgress,
      }));
      
    });

    return () => {
      socket.off("uploadProgress");
      socket.off("TranscodeProgress");
      socket.disconnect();
    };
  }, []);
  return (
    <CustomStack
      className="relative z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="false"
    >
      <div className="fixed inset-0 z-50 bg-primary-200 bg-opacity-10 overflow-hidden ">
        <div className="relative transform overflow-y-auto rounded-lg bg-secondary-400 h-screen text-left shadow-xl transition-all">
          <div className="bg-secondary-900 px-16 pt-0 min-h-screen h-max">
            {/** forms with stepper */}
            <div className="flex flex-col w-full h-full text-whites-40 gap-6 relative">
              <CustomStack className="z-50 w-full justify-between items-center py-2 pt-7 sticky top-0 bg-secondary-900">
                <Typography className="font-[Inter-Medium] text-[#fafafa] text-xl">
                  Add Upload - {videoType} Video
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

              {/** form */}
              <div className="flex w-full items-center justify-center h-full ">
                {/* <PosterForm handleModalClose={handleModalClose} /> */}

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={async (values, helpers) => {}}
                >
                  {({
                    values,
                    handleChange,
                    errors,
                    touched,
                    setFieldValue,
                    handleBlur,
                    isSubmitting,
                  }) => (
                    <Form>
                      <div className="flex flex-col gap-8 h-full w-full">
                        {/** chunk progress upload */}
                        {chunkProgress > 0 && (
                          <div className="w-full max-w-md mt-0">
                            <p className="mb-2 font-semibold">
                              Processing Video Chunks:
                            </p>
                            <div className="w-full bg-[#E5E7EB] rounded-full h-4 overflow-hidden">
                              <div
                                className="bg-[#2563EB] h-4 rounded-full flex items-center justify-center "
                                style={{ width: `${chunkProgress}%` }}
                              >
                                <p className="text-xs font-[Inter-Regular] text-whites-40">
                                  {chunkProgress}%
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/** transcode upload progress */}
                        {Object.keys(transcodeProgress).length > 0 && (
                          <div className="w-full max-w-md mt-4">
                            <p className="mb-2 font-semibold">
                              Conversion Upload Progress:
                            </p>
                            {Object.entries(transcodeProgress).map(
                              ([resolution, progress]) => (
                                <div key={resolution} className="mb-2">
                                  <p className="text-sm font-medium">
                                    {resolution.toUpperCase()}
                                  </p>
                                  <div className="w-full bg-[gray] rounded-full h-4">
                                    <div
                                      className="bg-[green] h-4 rounded-full flex items-center justify-center"
                                      style={{ width: `${progress}%` }}
                                    >
                                      <p className="text-sm text-whites-40">
                                        {progress}%
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}

                        {/** resolution upload progress */}
                        {Object.keys(uploadProgress).length > 0 && (
                          <div className="w-full max-w-md mt-4">
                            <p className="mb-2 font-semibold">
                              Resolution Upload Progress:
                            </p>
                            {Object.entries(uploadProgress).map(
                              ([resolution, progress]) => (
                                <div key={resolution} className="mb-2">
                                  <p className="text-sm font-medium">
                                    {resolution.toUpperCase()}
                                  </p>
                                  <div className="w-full bg-[gray] rounded-full h-4">
                                    <div
                                      className="bg-[green] h-4 rounded-full flex items-center justify-center"
                                      style={{ width: `${progress}%` }}
                                    >
                                      <p className="text-sm text-whites-40">
                                        {progress}%
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}
                        {/** video uploader & preview */}
                        <div className="flex flex-col gap-8 h-full w-full">
                          {/** video uploader & preview */}
                          <div className="flex flex-row gap-5 flex-wrap items-center ">
                            {preview ? (
                              <div className="flex flex-col gap-2">
                                <h4>Video Preview:</h4>
                                <video
                                  src={preview}
                                  controls
                                  className="w-full object-cover h-[286.37px]"
                                  style={{ width: "400px", height: "286.37px" }}
                                />
                                <ErrorMessage
                                  errors={errors?.film ? true : false}
                                  name="film"
                                  message={errors?.film && errors.film}
                                />
                              </div>
                            ) : (
                              <FormContainer className="w-[300px]">
                                <label htmlFor="film">
                                  <CustomStack className="flex flex-col bg-[#36323e] justify-center items-center h-[286.37px] w-full border-2 rounded-xl border-dashed border-secondary-300 gap-6 text-center">
                                    <span className="icon-[solar--upload-minimalistic-linear] w-14 h-14 text-[#76757A]"></span>
                                    <CustomStack className="flex-col gap-2 items-center">
                                      <Typography className="font-[Inter-SemiBold] text-[#76757A] text-sm">
                                        <span className="text-primary-500">
                                          Select Video
                                        </span>{" "}
                                      </Typography>
                                      <Typography className="font-[Inter-Regular] text-xs text-[#76757A]">
                                        Upload your video file
                                      </Typography>
                                    </CustomStack>
                                  </CustomStack>
                                </label>

                                <input
                                  hidden
                                  id="film"
                                  type="file"
                                  accept="video/*"
                                  onChange={(event) => {
                                    if (
                                      event.target.files ||
                                      event.target.files.length > 0
                                    ) {
                                      const file = event.target.files[0];
                                      setFieldValue("film", file);
                                      handleFileChange(event);
                                    }
                                  }}
                                />

                                <ErrorMessage
                                  errors={errors?.film ? true : false}
                                  name="film"
                                  message={errors?.film && errors.film}
                                />
                              </FormContainer>
                            )}
                          </div>
                        </div>

                        {/** stepper control */}

                        <div className="relative flex flex-col  gap-5 mb-2 ">
                          {file && !isUploading && !isPaused && (
                            <Button
                              onClick={handleUpload}
                              className="px-4 py-2 bg-primary-500 font-[Inter-Medium] text-white rounded hover:bg-blue-700"
                            >
                              Start Upload
                            </Button>
                          )}

                          {!isUploading && isPaused && (
                            <Button
                              onClick={handleResumeUpload}
                              className="px-4 py-2 bg-[#43A047] text-white rounded hover:bg-green-700"
                            >
                              Resume Upload
                            </Button>
                          )}

                          {isUploading && (
                            <button
                              onClick={handlePauseUpload}
                              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                            >
                              Pause Upload
                            </button>
                          )}

                          {(isUploading || isPaused) && (
                            <Button
                              onClick={handleCancelUpload}
                              className="px-4 py-2 bg-[#DC2626] text-whites-40 rounded hover:bg-red-700"
                            >
                              Cancel Upload
                            </Button>
                          )}
                          {/* <Button
                              type="submit"
                              className="font-[Inter-Medium]  bg-primary-500 rounded-lg"
                            >
                              Submit
                            </Button> */}
                          {/* <Button
                              onClick={() => {
                                setPreview(null);
                                handleModalClose();
                              }}
                              className="font-[Inter-Medium]  bg-secondary-500 rounded-lg"
                            >
                              Cancel
                            </Button>{" "} */}
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>

        {/** error popup or sucess */}
        {errorUpload !== null || sucessUpload !== null ? (
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-secondary-900 bg-opacity-30   backdrop-blur-sm ">
            <div className="w-full h-full flex flex-col justify-center items-center ">
              <div className="fixed inset-0 border rounded-xl bg-secondary-500 bg-opacity-75 transition-opacity"></div>
              {/** error snackbar */}
              {errorUpload !== null && (
                <div className="relative transform overflow-y-auto rounded-lg z-50   flex items-center justify-center h-max  text-left shadow-xl transition-all">
                  <div className="bg-secondary-900 min-w-[290px] flex flex-col items-center justify-center gap-5 py-5 px-5 md:px-16 pt-2 w-full max-w-[700px] rounded-lg  h-max">
                    <div className="flex flex-col gap-5 items-center justify-center">
                      <Typography className="text-center text-lg font-[Inter-Medium] text-[red] text-opacity-100">
                        Video Error
                      </Typography>

                      <div className="flex flex-col gap-2 items-center justify-center">
                        <p className="mt-4 text-sm text-whites-40">
                          {errorUpload}
                        </p>
                      </div>

                      <div className="flex flex-row gap-2 items-center justify-center">
                        <Button
                          onClick={() => {
                            // setSnackbarMessage(null)
                            handleModalClose();
                          }}
                          className="w-full bg-transparent border border-primary-500 min-w-full md:min-w-[150px] px-5 rounded-lg text-sm"
                        >
                          Close{" "}
                        </Button>

                        <Button
                          onClick={() => handleTryAgain()}
                          className="w-full bg-transparent border border-primary-500 min-w-full md:min-w-[150px] px-5 rounded-lg text-sm"
                        >
                          Try Again
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/** success snackbar */}
              {sucessUpload !== null && (
                <div className="relative transform overflow-y-auto rounded-lg z-50 bg-opacity-20 flex items-center justify-center h-max  text-left shadow-xl transition-all">
                  <div className="bg-secondary-900 min-w-[290px] flex flex-col items-center justify-center gap-5 py-5 px-5 md:px-16 pt-2 w-full max-w-[700px] rounded-lg  h-max">
                    <div className="flex flex-col gap-5 items-center justify-center">
                      <Typography className="text-center text-lg font-[Inter-Medium] text-[green] text-opacity-100">
                        Video Upload Success
                      </Typography>

                      <div className="flex flex-col gap-2 items-center justify-center">
                        <p className="mt-4 text-sm text-whites-40">
                          Video has been uploaded successfully.
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 items-center justify-center">
                        <Button
                          onClick={() => {
                            // setSnackbarMessage(null)
                            handleModalClose();
                          }}
                          className="w-full bg-transparent border border-primary-500 min-w-full md:min-w-[150px] px-5 rounded-lg text-sm"
                        >
                          Close{" "}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </CustomStack>
  );
};

export default TrailerForm;

import React, { useState } from "react";
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

const VideoUpload = ({ videoType, handleModalClose, film, type, videoPrice }) => {
  //  console.log("type", type)
  // console.log("videoType", videoType)
  let params = useParams();
  const [preview, setPreview] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = React.useState(null);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [uploaddata, setUploadData] = React.useState(0);
  //const [eventStreamMessages, setEventStreamMessages] = useState([]);

  const validationSchema =
    videoType === "Trailer"
      ? yup.object().shape({
          film: yup
            .mixed()
            .required("Video is required")
            .test("fileType", "Unsupported file format", (value) => {
              if (value) {
                //console.log("value", value)
                return ["video/mp4", "video/webm", "video/ogg"].includes(
                  value.type
                );
              }
              //return true;
            }),

          type: yup.string().required("type is required"),
        })
      : yup.object().shape({
          film: yup
            .mixed()
            .required("Video is required")
            .test("fileType", "Unsupported file format", (value) => {
              if (value) {
                return ["video/mp4", "video/webm", "video/ogg"].includes(
                  value.type
                );
              }
              // return true;
            }),
          price: yup.number().required("Price is required"),
          currency: yup.string().required("Currency is required"),
        });

  let initialValues =
    videoType === "Trailer"
      ? {
          film: null,

          type: type === "episode" ? "episode" : "film",
        }
      : {
          film: null,
          price: videoPrice ? videoPrice : 0,
          currency: "UGX",

          resolution: videoType,
        };

  const handleVideoPreview = (file) => {
    const videoURL = URL.createObjectURL(file);
    setPreview(videoURL);
  };

  React.useEffect(() => {
    setUploadData(() => uploadProgress);
  }, [uploadProgress]);

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

{
   /** 
    * 
    *  <div className="flex gap-5">
                  <Button
                    onClick={handleModalClose}
                    className="px-5 rounded-lg font-[Inter-Medium] bg-primary-700"
                  >
                    CANCEL & CLOSE
                  </Button>
                </div>
    * 
    * 
    */
}
               
              </CustomStack>
              {uploaddata > 0 && (
                <div className="flex flex-col gap-2">
                  <h4>Upload Progress: {uploaddata}%</h4>
                  <div className="w-full bg-secondary-500 rounded-lg h-2 relative">
                    <div
                      className="h-2 bg-primary-500 rounded-lg absolute"
                      style={{ width: `${uploaddata}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/** form */}
              <div className="flex w-full items-center justify-center h-full ">
                {/* <PosterForm handleModalClose={handleModalClose} /> */}

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={async (values, helpers) => {
                    try {
                      // handleStepNext();
                      //console.log("vdfdfdfdfdfes", values);
                      //  '/filmupload/:filmId'

                      //  const eventSource = new EventSource(`${BaseUrl}/v1/studio/filmupload/${film?.id}`);
                      //   eventSource.onmessage = (event) => {
                      //     const data = JSON.parse(event.data);
                      //     console.log("data", data)
                      //     setEventStreamMessages((prevMessages) => [...prevMessages, data ]);
                      //     // if(data.progress === 100){
                      //     //   eventSource.close();
                      //     // }
                      //     setUploadProgress(data.progress);
                      //   };

                      const user = JSON.parse(localStorage.getItem("user"));
                      helpers.setSubmitting(true);

                      const token =
                        user !== null && user.token ? user.token : null;
                      let formData = new FormData();

                      formData.append(
                        videoType === "Trailer" ? "trailer" : "film",
                        values.film
                      );
                      //formData.append("trailer", values.film);
                      formData.append("type", values.type);
                      // formData.append("isTrailer", values.isTrailer);
                      formData.append("price", values?.price?.toString());
                      formData.append("currency", values.currency);
                      formData.append("resolution", values.resolution);

                      // let url

                      // if(type === "episode") {
                      //   url = `${BaseUrl}/v1/studio/episodeupload/${film?.id}`;
                      // } else {
                      //   url = `${BaseUrl}/v1/studio/filmupload/${film?.id}`;
                      // }

                      let id =
                        type === "episode" ? params?.episodeId : film?.id;
                      let axiosurl;
                      if (videoType === "Trailer") {
                        axiosurl = `${BaseUrl}/v1/studio/uploadtrailer/${id}`;
                      } else {
                        axiosurl =
                          type === "episode"
                            ? `${BaseUrl}/v1/studio/episodeupload/${film?.id}`
                            : `${BaseUrl}/v1/studio/filmupload/${params?.id}`;
                      }

                      //   console.log("axiosurl", axiosurl);

                      const response = await axios.post(axiosurl, formData, {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "multipart/form-data",
                        },
                        onUploadProgress: (progressEvent) => {
                          //  console.log(progressEvent.total)
                          const percentCompleted = Math.floor(
                            (progressEvent.loaded / progressEvent.total) * 100
                          );
                          setUploadProgress(percentCompleted);
                        },
                      });

                      //console.log("response", response.data);

                      if (response.data) {
                        setSnackbarMessage({
                          message: "Successfully Uploaded Video",
                          severity: "success",
                        });
                        type === "episode"
                          ? await queryClient.invalidateQueries({
                              queryKey: ["film", params?.id],
                            })
                          : await queryClient.invalidateQueries({
                              queryKey: ["film", params?.id],
                            });
                        helpers.setSubmitting(false);
                        handleModalClose();
                      }
                    } catch (error) {
                      setSnackbarMessage({
                        message: error?.message,
                        severity: "error",
                      });
                      //throw error;
                    }
                  }}
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
                        {/** video price */}
                        {videoType !== "Trailer" && (
                          <FormContainer>
                            <label
                              htmlFor="yearOfProduction"
                              className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
                            >
                              Price
                            </label>
                            <input
                              onBlur={handleBlur}
                              id="price"
                              name="price"
                              type="text"
                              placeholder="price"
                              value={values.price}
                              onChange={handleChange}
                            />

                            <ErrorMessage
                              errors={
                                touched?.price && errors?.price ? true : false
                              }
                              name="price"
                              message={errors?.price && errors.price}
                            />
                          </FormContainer>
                        )}

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
                                      handleVideoPreview(file);
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

                        {isSubmitting ? (
                          <div className="relative flex flex-col  gap-5 mb-8 ">
                            <Button className="font-[Inter-Medium]  bg-primary-500 cursor-not-allowed bg-opacity-50 rounded-lg">
                              {" "}
                              Uploading Video. Please wait....{" "}
                            </Button>
                          </div>
                        ) : (
                          <div className="relative flex flex-col  gap-5 mb-8 ">
                            <Button
                              type="submit"
                              className="font-[Inter-Medium]  bg-primary-500 rounded-lg"
                            >
                              Submit
                            </Button>
                            <Button
                              onClick={() => {
                                setPreview(null);
                                handleModalClose();
                              }}
                              className="font-[Inter-Medium]  bg-secondary-500 rounded-lg"
                            >
                              Cancel
                            </Button>{" "}
                          </div>
                        )}
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
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
    </CustomStack>
  );
};

export default VideoUpload;

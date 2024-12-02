import React, { useState } from "react";
import CustomStack from "../Stacks/CustomStack";
import { Typography } from "@mui/material";
import Button from "../Buttons/Button";
import * as yup from "yup";
import { Form, Formik } from "formik";
import { FormContainer } from "../Stacks/InputFormStack";
import ErrorMessage from "../Forms/ErrorMessage";

const VideoUpload = ({ videoType, handleModalClose }) => {
  // console.log("videoType", videoType)
  const [preview, setPreview] = useState(null);

  const validationSchema =
    videoType === "Trailer"
      ? yup.object().shape({
          film: yup
            .mixed()
            .required("Video is required")
            .test("fileType", "Unsupported file format", (value) => {
              if (value) {
                return ["video/mp4", "video/webm", "video/ogg"].includes(
                  value.type
                );
              }
              return true;
            }),
          isTrailer: yup.number().required("Price is required"),
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
              return true;
            }),
          price: yup.number().required("Price is required"),
          currency: yup.string().required("Currency is required"),
        });

  const initialValues =
    videoType === "Trailer"
      ? {
          film: null,
          isTrailer: "true",
        }
      : {
          film: null,
          price: null,
          currency: "UGX",
        };

  const handleVideoPreview = (file) => {
    const videoURL = URL.createObjectURL(file);
    setPreview(videoURL);
  };

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
                  onSubmit={(values, helpers) => {
                    // handleStepNext();
                    console.log("values", values);
                  }}
                >
                  {({
                    values,
                    handleChange,
                    errors,
                    touched,
                    setFieldValue,
                    handleBlur,
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
                            ): (
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
                          </Button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomStack>
  );
};

export default VideoUpload;

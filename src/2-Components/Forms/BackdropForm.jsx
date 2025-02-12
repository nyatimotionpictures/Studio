import { Form, Formik, useFormik } from "formik";
import React from "react";
import { useContext } from "react";
import * as yup from "yup";
import CustomStack from "../Stacks/CustomStack";
import { FormContainer } from "../Stacks/InputFormStack";
import { Alert, Snackbar, Typography } from "@mui/material";
import Button from "../Buttons/Button";
import ErrorMessage from "./ErrorMessage";

import {useDropzone} from 'react-dropzone';
import axios from "axios";
import { BaseUrl } from "../../3-Middleware/apiRequest";
import { queryClient } from "../../lib/tanstack";
import { useParams } from "react-router-dom";
import socket from "../../lib/socket";

const BackdropForm = ({ handleModalClose, film, type }) => {
  //console.log("film", film, type)
  let params = useParams();
    const [preview, setPreview] = React.useState(null);
    const [snackbarMessage, setSnackbarMessage] = React.useState(null);
    const [uploadProgress, setUploadProgress] = React.useState(0);
     const [sendProgress, setSendProgress] = React.useState(0);
  const posterValidationSchema = yup.object().shape({
    poster: yup
      .mixed()
      .required("poster is required")
      .test("fileType", "Unsupported file format", (value) => {
        if (value) {
          return ["image/jpeg", "image/png", "image/gif", "image/jpg"].includes(
            value.type
          );
        }
      }),
      isBackdrop: yup.string().required("required"),
  });

  const handleImagePreview = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const formik = useFormik({
    initialValues: {
      files: [],
      isBackdrop: "true",
      poster: null,
      filmId: film?.id,
    },
    validationSchema: posterValidationSchema,
    onSubmit: async (values, helpers) => {
      try {
        // console.log("values", values);
        const user = JSON.parse(localStorage.getItem("user"));
        helpers.setSubmitting(true);
           
            const token = user !== null && user.token ? user.token : null;
            let filmtypes = type?.includes("film") ? "film" : type?.includes("series") ? "film" : type === "episode" ? "episode" : type?.includes("season") ? "season" : "";
             let formData = new FormData();
             formData.append("files", values.files);
             //formData.append("filmId", values.filmId);
             formData.append("poster", values.files[0]);
               formData.append("isCover", values.isCover);
               formData.append("type", filmtypes);
       
           //  updateFilmMutation.mutate(formData);
           let axiosurl = type === "episode" ? `${BaseUrl}/v1/studio/uploadposter/${film?.id}` : `${BaseUrl}/v1/studio/posterupload/${film?.id}`;

            const response = await axios.post(axiosurl, formData, {  
             headers: {
               "Authorization": `Bearer ${token}`,
               "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                  setUploadProgress(
                    Math.round((progressEvent.loaded * 100) / progressEvent.total)
                  );
                },
            });
           // console.log("response", response.data);
            helpers.setSubmitting(false);
            handleModalClose();
            setSnackbarMessage({ message: response.data.message, severity: "success" });
            type === "episode" ? await queryClient.invalidateQueries({ queryKey: ["film", params?.id] }) : await queryClient.invalidateQueries({ queryKey: ["film", params?.id] })
        
            
            helpers.setSubmitting(false);
             //console.log("response", response.data);
      } catch (error) {
        setSnackbarMessage({
          message: "error uploading poster",
          severity: "error",
        });
      }
    
    },
  });

  const onDrop = (acceptedFiles) => {
    formik.setFieldValue("files", acceptedFiles);
    formik.setFieldValue("poster", acceptedFiles[0]);
    handleImagePreview(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: "image/*",
  });

  React.useEffect(() => {
    socket.connect();

    socket.on("uploadProgress", ({ content, progress }) => {
      setSendProgress((prev) => ({
        ...prev,
        [content?.type]: progress,
      }));
    });

    return () => {
      socket.off("uploadProgress");
      // socket.off("TranscodeProgress");
      // setTranscodeProgress(0)
      socket.disconnect();
    };
  }, []);
  return (
    <>
 
      <form onSubmit={formik.handleSubmit} >
        <div className="flex flex-col gap-8 h-full ">
          <div className="flex flex-col gap-5 flex-wrap items-center ">
          {uploadProgress > 0 && (
              <div className="flex flex-col gap-2">
                <h4>Sending Progress: {uploadProgress}%</h4>
                <div className="w-full bg-secondary-500 rounded-lg h-2 relative">
                  <div
                    className="h-2 bg-primary-500 rounded-lg absolute"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/** transcode upload progress */}
            {Object.keys(sendProgress).length > 0 && (
              <div className="w-full max-w-md mt-4">
                <p className="mb-2 font-semibold">Upload Progress:</p>
                {Object.entries(sendProgress).map(([resolution, progress]) => (
                  <div key={resolution} className="mb-2">
                    <p className="text-sm font-medium">
                      {resolution.toUpperCase()}
                    </p>
                    <div className="w-full bg-[gray] rounded-full h-4">
                      <div
                        className="bg-[green] h-4 rounded-full flex items-center justify-center"
                        style={{ width: `${progress}%` }}
                      >
                        <p className="text-sm text-whites-40">{progress}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {preview ? (
              <div className="flex flex-col gap-2">
                <h4>Image Preview:</h4>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-[320px] object-cover h-[286.37px]"
                />
              </div>
            ): (
              <FormContainer className="w-max">
              <div    {...getRootProps()} htmlFor="poster">
                <CustomStack className="flex flex-col bg-[#36323e] justify-center items-center h-[286.37px] w-[250.4px] border-2 rounded-xl border-dashed border-secondary-300 gap-6 text-center">
                  <span className="icon-[solar--upload-minimalistic-linear] w-14 h-14 text-[#76757A]"></span>
                  <CustomStack className="flex-col gap-2 items-center">
                    <Typography className="font-[Inter-SemiBold] text-[#76757A] text-sm">
                      <span className="text-primary-500">Select Poster</span>{" "}
                    </Typography>
                    <Typography className="font-[Inter-Regular] text-xs text-[#76757A]">
                      Your images will be private until you publish the film.
                    </Typography>
                  </CustomStack>
                </CustomStack>
              </div>

              <input
                {...getInputProps()}
              />

            <ErrorMessage
              errors={formik.errors?.poster ? true : false}
              name="directors"
              message={formik.errors?.poster && formik.errors.poster}
            />
            </FormContainer>

            )}
          </div>

          {/** stepper control */}
         
            {
              formik.isSubmitting ? (
                <div className="relative flex flex-col gap-5">
                <Button
                  disabled
                  className="font-[Inter-Medium] bg-primary-500 rounded-lg"
                >
                  Submitting...
                </Button>
                </div>
              ) : (
                <div className="relative flex flex-col gap-5">
                <Button type="submit" className="font-[Inter-Medium] bg-primary-500 rounded-lg">
              Submit
            </Button>
            <Button onClick={
              () => {
                  setPreview(null);
                  handleModalClose();
              }
            } className="font-[Inter-Medium] bg-secondary-500 rounded-lg">
              Cancel
            </Button>
            </div>
              )
            }
            
            
         
        </div>
      </form>

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
    </>
  )
}

export default BackdropForm
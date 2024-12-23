import { Form, Formik, useFormik } from "formik";
import React from "react";
import { useContext } from "react";
import * as yup from "yup";
import CustomStack from "../Stacks/CustomStack";
import { FormContainer } from "../Stacks/InputFormStack";
import { Alert, Snackbar, Typography } from "@mui/material";
import Button from "../Buttons/Button";
import ErrorMessage from "./ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { uploadPosterContent } from "../../5-Store/TanstackStore/services/api";
import { queryClient } from "../../lib/tanstack";
import CustomLoader from "../Loader/CustomLoader";
import UploadProgress from "../TrackProgress/UploadProgress";
import { useDropzone } from "react-dropzone";
import apiRequest, { BaseUrl } from "../../3-Middleware/apiRequest";
import axios from "axios";
import { useParams } from "react-router-dom";

const PosterForm = ({ handleModalClose, film, type }) => {
  let params = useParams();
  const [preview, setPreview] = React.useState(null);
  const [filmId, setFilmId] = React.useState(film?.id);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  const [snackbarMessage, setSnackbarMessage] = React.useState(null);
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
    isCover: yup.string().required("required"),
  });

  const handleImagePreview = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  //console.log(`http://localhost:4500/api/v1/studio/posterupload/${film?.id}`)

  const formik = useFormik({
    initialValues: {
      files: [],
      isCover: "true",
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
        let formData = new FormData();
        formData.append("files", values.files);
        formData.append("filmId", values.filmId);
        formData.append("poster", values.files[0]);
        formData.append("isCover", values.isCover);

        //  updateFilmMutation.mutate(formData);
        let url =
          type === "episode"
            ? `${BaseUrl}/v1/studio/uploadposter/${film?.id}`
            : `${BaseUrl}/v1/studio/posterupload/${film?.id}`;
        const response = await axios.post(url, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            setUploadProgress(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            );
          },
        });

        helpers.setSubmitting(false);
        setSnackbarMessage({
          message: "Poster uploaded successfully",
          severity: "success",
        });
        handleModalClose();
        type === "episode"
          ? await queryClient.invalidateQueries({
              queryKey: ["film", params?.id],
            })
          : await queryClient.invalidateQueries({
              queryKey: ["film", params?.id],
            });

        //  console.log("response", response.data);
      } catch (error) {
        console.log("error", error);
        handleModalClose();
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
  return (
    <>
      {/* {formik.isSubmitting && (
        <div className="h-full w-full absolute bg-seconday-500 bg-opacity-20 top-0 left-0 flex justify-center items-center">
          <UploadProgress
            url={`http://localhost:4500/api/v1/studio/posterupload/${film?.id}`}
          />
          <CustomLoader />
        </div>
      )} */}

      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col gap-8 h-full ">
          <div className="flex flex-col gap-5 flex-wrap items-center ">
            {uploadProgress > 0 && (
              <div className="flex flex-col gap-2">
                <h4>Upload Progress: {uploadProgress}%</h4>
                <div className="w-full bg-secondary-500 rounded-lg h-2 relative">
                  <div
                    className="h-2 bg-primary-500 rounded-lg absolute"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            {preview ? (
              <div className="flex flex-col gap-2">
                <h4>Image Preview:</h4>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-[250.4px] object-cover h-[286.37px]"
                />
              </div>
            ) : (
              <FormContainer className="w-max">
                <div {...getRootProps()} htmlFor="poster">
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

                <input {...getInputProps()} />

                <ErrorMessage
                  errors={formik.errors?.poster ? true : false}
                  name="directors"
                  message={formik.errors?.poster && formik.errors.poster}
                />
              </FormContainer>
            )}
          </div>

          {/** stepper control */}

          {formik.isSubmitting ? (
            <div className="relative flex flex-col gap-5">
              <Button className="font-[Inter-Medium] bg-primary-500 bg-opacity-50 rounded-lg">
                Submitting....
              </Button>
            </div>
          ) : (
            <div className="relative flex flex-col gap-5">
              <Button
                type="submit"
                className="font-[Inter-Medium] bg-primary-500 rounded-lg"
              >
                Submit
              </Button>

              <Button
                onClick={() => {
                  setPreview(null);
                  handleModalClose();
                }}
                className="font-[Inter-Medium] bg-secondary-500 rounded-lg"
              >
                Cancel
              </Button>
            </div>
          )}
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
  );
};

export default PosterForm;

import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";
import CustomStack from "../Stacks/CustomStack";
import { FormContainer } from "../Stacks/InputFormStack";
import { Alert, Snackbar, Typography } from "@mui/material";
import Button from "../Buttons/Button";
import ErrorMessage from "./ErrorMessage";
import { queryClient } from "../../lib/tanstack";
import { useDropzone } from "react-dropzone";
import { BaseUrl } from "../../3-Middleware/apiRequest";
import axios from "axios";
import { useParams } from "react-router-dom";
import socket from "../../lib/socket";
import getImageDimensions from "../../lib/getImageDimensions";

const EpisodeThumbnailForm = ({ handleModalClose, film, type }) => {
  let params = useParams();
  const [preview, setPreview] = React.useState(null);
  const [imageInfo, setImageInfo] = React.useState(null);
  const [sendProgress, setSendProgress] = React.useState(0);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  const [snackbarMessage, setSnackbarMessage] = React.useState(null);
  const episodeThumbValidationSchema = yup.object().shape({
    poster: yup
      .mixed()
      .required("thumbnail is required")
      .test("fileType", "Unsupported file format", (value) => {
        if (value) {
          return ["image/jpeg", "image/png", "image/gif", "image/jpg"].includes(
            value.type
          );
        }
      })
      .test(
        "imageDimensions",
        "Image must be 1920 × 1080 px (16:9 ratio). Max 1920 × 1080, min 960 × 540",
        async (value) => {
          if (!value) return true;
          try {
            const { width, height } = await getImageDimensions(value);
            const ratio = width / height;
            return (
              width >= 960 &&
              width <= 1920 &&
              height >= 540 &&
              height <= 1080 &&
              ratio >= 1.688 &&
              ratio <= 1.867
            );
          } catch {
            return true;
          }
        }
      ),
    isEpisodeThumbnail: yup.string().required("required"),
  });

  const handleImagePreview = async (file) => {
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
    try {
      const { width, height } = await getImageDimensions(file);
      const ratio = width / height;
      const valid =
        width >= 960 &&
        width <= 1920 &&
        height >= 540 &&
        height <= 1080 &&
        ratio >= 1.688 &&
        ratio <= 1.867;
      setImageInfo({ width, height, valid });
    } catch {
      setImageInfo(null);
    }
  };

  const formik = useFormik({
    initialValues: {
      files: [],
      isCover: "false",
      isEpisodeThumbnail: "true",
      poster: null,
      filmId: film?.id,
    },
    validationSchema: episodeThumbValidationSchema,
    onSubmit: async (values, helpers) => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        helpers.setSubmitting(true);

        const token = user !== null && user.token ? user.token : null;
        let filmtypes =
          type?.includes("film")
            ? "film"
            : type?.includes("series")
            ? "film"
            : type === "episode"
            ? "episode"
            : type?.includes("season")
            ? "season"
            : "";
        let formData = new FormData();
        formData.append("files", values.files);
        formData.append("resourceId", values.filmId);
        formData.append("poster", values.files[0]);
        formData.append("isCover", values.isCover);
        formData.append("isEpisodeThumbnail", values.isEpisodeThumbnail);
        formData.append("type", filmtypes);

        const url = `${BaseUrl}/v1/studio/posterupload/${film?.id}`;

        await axios.post(url, formData, {
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
          message: "Episode thumbnail uploaded successfully",
          severity: "success",
        });
        handleModalClose();
        await queryClient.invalidateQueries({
          queryKey: ["film", params?.id],
        });
      } catch (error) {
        console.log("error", error);
        setSnackbarMessage({
          message: "error uploading episode thumbnail",
          severity: "error",
        });
        alert("Failed to complete upload.");
      }
    },
  });

  const onDrop = (acceptedFiles) => {
    formik.setFieldValue("files", acceptedFiles);
    formik.setFieldValue("poster", acceptedFiles[0]);
    handleImagePreview(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
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
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
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
                  className="w-[400px] object-cover h-[225px]"
                />
                {imageInfo && (
                  <p
                    className={`font-[Inter-Regular] text-sm ${
                      imageInfo.valid ? "text-[#4CAF50]" : "text-[#F44336]"
                    }`}
                  >
                    Detected: {imageInfo.width} × {imageInfo.height} px
                    {imageInfo.valid
                      ? ""
                      : " — exceeds recommended 1920 × 1080 px (16:9)"}
                  </p>
                )}
              </div>
            ) : (
              <FormContainer className="w-max">
                <div {...getRootProps()} htmlFor="poster">
                  <CustomStack className="flex flex-col bg-[#36323e] justify-center items-center h-[225px] w-[400px] border-2 rounded-xl border-dashed border-secondary-300 gap-6 text-center">
                    <span className="icon-[solar--upload-minimalistic-linear] w-14 h-14 text-[#76757A]"></span>
                    <CustomStack className="flex-col gap-2 items-center">
                      <Typography className="font-[Inter-SemiBold] text-[#76757A] text-sm">
                        <span className="text-primary-500">
                          Select Thumbnail
                        </span>{" "}
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

export default EpisodeThumbnailForm;
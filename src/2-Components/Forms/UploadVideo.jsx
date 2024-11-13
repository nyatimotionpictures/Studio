import React from "react";
import CustomStack from "../Stacks/CustomStack";
import { Typography } from "@mui/material";
import Button from "../Buttons/Button";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import FilmPreview from "../Previews/FilmPreview";

const UploadVideo = ({ innerref, handleStepNext }) => {
  const [videoUrl, setVideoUrl] = React.useState("");
  let vidInputRef = React.useRef();
  const validationSchema = yup.object().shape({
    filmVideo: yup
      .mixed()
      .required("video required")
      .test(
        "is-valid-type",
        "Invalid file format selected",
        (val) => {
          console.log("valuedddd", val.type);
          return val && val.type !== "video/mp4"

        }
      ),
  });

  const initialValues = {
    filmVideo: null,
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, setFieldValue) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      console.log("e", e.dataTransfer.files);
      let dataType = e.dataTransfer.files[0].type;
      if (dataType === "video/mp4") {
        setFieldValue("filmVideo", e.dataTransfer.files[0]);
      }
    }
  };
  return (
    <Formik
      innerRef={innerref}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, helpers) => {
        handleStepNext();
        // console.log(values);
      }}
    >
      {({
        values,
        handleChange,
        errors,
        touched,
        setFieldValue,
        handleSubmit,
      }) => (
        <Form>
          <div className="flex flex-col w-full h-full text-whites-40 gap-6">
            <CustomStack className="flex flex-col gap-6">
              <Typography className="text-whites-40 font-[Inter-Regular] text-xl">
                Upload Video
              </Typography>

              <CustomStack className="flex-row w-full gap-5">
                {/** upload */}
                <CustomStack
                  onClick={() => vidInputRef.current.click()}
                  onDragOver={(e) => handleDragOver(e)}
                  onDrop={(e) => handleDrop(e, setFieldValue)}
                  className="flex flex-col justify-center items-center min-h-[45vh] w-full border-2 rounded-xl border-dashed gap-6"
                >
                  <span className="icon-[solar--upload-minimalistic-linear] w-14 h-14 text-[#76757A]"></span>
                  <CustomStack className="flex-col gap-2 items-center">
                    <Typography className="font-[Inter-SemiBold] text-[#76757A] text-lg">
                      <span className="text-primary-500">Select a file</span>{" "}
                      Drag and drop a video files to upload
                    </Typography>
                    <Typography className="font-[Inter-Regular] text-lg text-[#76757A]">
                      Your videos will be private until you publish them.
                    </Typography>
                  </CustomStack>
                  <input
                    type="file"
                    name="filmVideo"
                    hidden
                    ref={vidInputRef}
                    onChange={(event) => {
                      if (event.target.files.length > 0) {
                        let dataType = event.target.files[0].type;
                        console.log("type--data", dataType);
                        if (dataType === "video/mp4") {
                          setFieldValue("filmVideo", event.target.files[0]);
                        }
                      }

                      //handleSubmit();
                    }}
                  />
                </CustomStack>

                {/**video */}

                {values.filmVideo !== null && (
                  <div className="w-full h-full">
                    <FilmPreview filed={values.filmVideo} />
                  </div>
                )}
              </CustomStack>

              {errors && errors.filmVideo ? (
                <Typography className="text-[red]">
                  {errors.filmVideo}
                </Typography>
              ) : null}
            </CustomStack>

            {/** video  */}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UploadVideo;

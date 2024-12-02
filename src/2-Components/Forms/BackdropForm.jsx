import { Form, Formik } from "formik";
import React from "react";
import { useContext } from "react";
import * as yup from "yup";
import CustomStack from "../Stacks/CustomStack";
import { FormContainer } from "../Stacks/InputFormStack";
import { Typography } from "@mui/material";
import Button from "../Buttons/Button";
import ErrorMessage from "./ErrorMessage";

const BackdropForm = ({ handleModalClose }) => {
    const [preview, setPreview] = React.useState(null);
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
  return (
    <Formik
    initialValues={{
      poster: null,
      isBackdrop: "true",
    }}
    validationSchema={posterValidationSchema}
    onSubmit={(values, helpers) => {
      // handleStepNext();
      console.log("values", values);
    }}
  >
    {({ values, handleChange, errors, touched, setFieldValue }) => (
      <Form>
        <div className="flex flex-col gap-8 h-full ">
          <div className="flex flex-row gap-5 flex-wrap items-center ">
            {preview && (
              <div className="flex flex-col gap-2">
                <h4>Image Preview:</h4>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-[320px] object-cover h-[286.37px]"
                />
              </div>
            )}

            <FormContainer className="w-max">
              <label htmlFor="poster">
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
              </label>

              <input
                hidden
                id="poster"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  if (
                    event.target.files ||
                    event.target.files.length > 0
                  ) {
                    const file = event.target.files[0];
                    setFieldValue("poster", file);
                    handleImagePreview(file);
                  }
                }}
              />

            <ErrorMessage
              errors={errors?.poster ? true : false}
              name="directors"
              message={errors?.poster && errors.poster}
            />
            </FormContainer>


          </div>

          {/** stepper control */}
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
        </div>
      </Form>
    )}
  </Formik>
  )
}

export default BackdropForm
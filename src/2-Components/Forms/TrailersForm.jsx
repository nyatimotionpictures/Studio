import { Form, Formik } from "formik";
import React from "react";
import { useContext } from "react";
import * as yup from "yup";
import CustomStack from "../Stacks/CustomStack";
import { FormContainer } from "../Stacks/InputFormStack";
import { Typography } from "@mui/material";
import { ratingArray } from "../../1-Assets/data/Ratings";
import { visibilityData } from "../../1-Assets/data/FilmSelectData";

const TrailersForm = ({ innerref, handleStepNext }) => {
     const validationSchema = yup.object().shape({
       title: yup.string().required("required"),
     });

     const initialValues = {
       title: "",
     };
  return (
    <Formik
      innerRef={innerref}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, helpers) => {
        handleStepNext();
      }}
    >
      {({ values, handleChange, errors, touched, setFieldValue }) => (
        <Form>
          <CustomStack className="h-full w-full flex flex-col gap-5">
            
            {/** trailer */}
            <FormContainer className="border-b-2 border-t-secondary-500 pb-10">
              <CustomStack className="flex-col pb-2">
                <Typography className="text-[#F2F2F2] font-[Inter-SemiBold] text-base">
                  Trailer
                </Typography>
              </CustomStack>

              <CustomStack className="flex-row justify-between gap-6">
                {/** upload trailer */}
                <FormContainer>
                  <CustomStack className="flex flex-col bg-[#36323e] justify-center items-center min-h-[65vh] w-full border-2 rounded-xl border-dashed gap-6">
                    <span className="icon-[solar--upload-minimalistic-linear] w-14 h-14 text-[#76757A]"></span>
                    <CustomStack className="flex-col gap-2">
                      <Typography className="font-[Inter-SemiBold] text-[#76757A] text-lg">
                        <span className="text-primary-500">Select a file</span>{" "}
                        Drag and drop a video files to upload
                      </Typography>
                      <Typography className="font-[Inter-Regular] text-lg text-[#76757A]">
                        Your videos will be private until you publish them.
                      </Typography>
                    </CustomStack>
                  </CustomStack>
                </FormContainer>
                <FormContainer>
                  <label className="label font-[Inter-Regular] text-xs text-whites-100 text-opacity-75">
                    Trailer name (required)
                  </label>
                  <input />
                </FormContainer>
              </CustomStack>
            </FormContainer>

            {/** Upload poster image */}
            <FormContainer>
              <CustomStack className="flex-col pb-2">
                <Typography className="text-[#F2F2F2] font-[Inter-SemiBold] text-base">
                  Upload poster image
                </Typography>
                <Typography className="text-[#76757A] font-[Inter-Regular] text-sm">
                  Please upload 3 different posters
                </Typography>
              </CustomStack>

              <CustomStack className="w-full flex-row justify-between gap-6">
                {/** upload image */}
                {/** image 1 */}
                <FormContainer className="w-1/3">
                  <CustomStack className="flex flex-col bg-[#36323e] justify-center items-center min-h-[45vh] w-full border-2 rounded-xl border-dashed gap-6">
                    <span className="icon-[solar--upload-minimalistic-linear] w-14 h-14 text-[#76757A]"></span>
                    <CustomStack className="flex-col gap-2 items-center">
                      <Typography className="font-[Inter-SemiBold] text-[#76757A] text-sm">
                        <span className="text-primary-500">Select a file</span>{" "}
                        Drag and drop a image files to upload
                      </Typography>
                      <Typography className="font-[Inter-Regular] text-xs text-[#76757A]">
                        Your images will be private until you publish them.
                      </Typography>
                    </CustomStack>
                  </CustomStack>
                </FormContainer>
                {/** image 2 */}
                <FormContainer className="w-1/3">
                  <CustomStack className="flex flex-col bg-[#36323e] justify-center items-center min-h-[45vh] w-full border-2 rounded-xl border-dashed gap-6">
                    <span className="icon-[solar--upload-minimalistic-linear] w-14 h-14 text-[#76757A]"></span>
                    <CustomStack className="flex-col gap-2 items-center">
                      <Typography className="font-[Inter-SemiBold] text-[#76757A] text-sm">
                        <span className="text-primary-500">Select a file</span>{" "}
                        Drag and drop image files to upload
                      </Typography>
                      <Typography className="font-[Inter-Regular] text-xs text-[#76757A]">
                        Your images will be private until you publish them.
                      </Typography>
                    </CustomStack>
                  </CustomStack>
                </FormContainer>
                {/** image 3 */}
                <FormContainer className="w-1/3">
                  <CustomStack className="flex flex-col bg-[#36323e] justify-center items-center min-h-[45vh] w-full border-2 rounded-xl border-dashed gap-6">
                    <span className="icon-[solar--upload-minimalistic-linear] w-14 h-14 text-[#76757A]"></span>
                    <CustomStack className="flex-col gap-2 items-center">
                      <Typography className="font-[Inter-SemiBold] text-[#76757A] text-sm">
                        <span className="text-primary-500">Select a file</span>{" "}
                        Drag and drop image files to upload
                      </Typography>
                      <Typography className="font-[Inter-Regular] text-xs text-[#76757A]">
                        Your images will be private until you publish them.
                      </Typography>
                    </CustomStack>
                  </CustomStack>
                </FormContainer>
              </CustomStack>
            </FormContainer>
          </CustomStack>
        </Form>
      )}
    </Formik>
  );
};

export default TrailersForm;

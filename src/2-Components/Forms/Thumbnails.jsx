import { Form, Formik } from "formik";
import React from "react";
import { useContext } from "react";
import * as yup from "yup";
import CustomStack from "../Stacks/CustomStack";
import { FormContainer } from "../Stacks/InputFormStack";
import { Typography } from "@mui/material";

const Thumbnails = ({ innerref, handleStepNext }) => {
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
          {({ values, handleChange, errors, touched, setFieldValue }) => (<Form>
              <CustomStack className="h-full w-full flex flex-col gap-5">
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

                      <CustomStack className="w-full flex-row  gap-6 flex-wrap">
                          {/** upload image */}
                          {/** image 1 */}
                          <FormContainer className="w-max">
                              <CustomStack className="flex flex-col bg-[#36323e] justify-center items-center h-[286.37px] w-[350.4px] border-2 rounded-xl border-dashed border-secondary-300 gap-6">
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
                          <FormContainer className="w-max">
                              <CustomStack className="flex flex-col bg-[#36323e] justify-center items-center h-[286.37px] w-[350.4px] border-2 rounded-xl border-dashed border-secondary-300 gap-6">
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
                          <FormContainer className="w-max">
                              <CustomStack className="flex flex-col bg-[#36323e] justify-center items-center h-[286.37px] w-[350.4px] border-2 rounded-xl border-dashed border-secondary-300 gap-6">
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

                  {/** Upload Backdrop image */}
                  <FormContainer>
                      <CustomStack className="flex-col pb-2">
                          <Typography className="text-[#F2F2F2] font-[Inter-SemiBold] text-base">
                              Upload backdrop image
                          </Typography>
                          <Typography className="text-[#76757A] font-[Inter-Regular] text-sm">
                              Please upload 3 different backdrop images(screenshots from the film)
                          </Typography>
                      </CustomStack>

                      <CustomStack className="w-full flex-row  gap-6 flex-wrap">
                          {/** upload image */}
                          {/** image 1 */}
                          <FormContainer className="w-max">
                              <CustomStack className="flex flex-col bg-[#36323e] justify-center items-center h-[286.37px] w-[350.4px] border-2 rounded-xl border-dashed border-secondary-300 gap-6">
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
                          <FormContainer className="w-max">
                              <CustomStack className="flex flex-col bg-[#36323e] justify-center items-center h-[286.37px] w-[350.4px] border-2 rounded-xl border-dashed border-secondary-300 gap-6">
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
                          <FormContainer className="w-max">
                              <CustomStack className="flex flex-col bg-[#36323e] justify-center items-center h-[286.37px] w-[350.4px] border-2 rounded-xl border-dashed border-secondary-300 gap-6">
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
          </Form>)}
      </Formik>
  )
}

export default Thumbnails
import { Form, Formik } from "formik";
import React from "react";
import { useContext } from "react";
import * as yup from "yup";
import CustomStack from "../Stacks/CustomStack";
import { FormContainer } from "../Stacks/InputFormStack";

const EditSeriesForm = ({ innerref, handleStepNext }) => {
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
              handleStepNext(values);
          }}
      >
          {({ values, handleChange, errors, touched, setFieldValue }) => (
              <Form>
                  <CustomStack className="h-full w-full flex flex-col gap-5">
                      {/** title */}
                      <FormContainer>
                          <label htmlFor="title" className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                              Title name (required)
                          </label>
                          <input id="title" value={values.title} name="title" onChange={handleChange} />
                      </FormContainer>
                   
                      

                      {/** three input */}
                      <CustomStack className="flex-row justify-between gap-6">
                          <FormContainer>
                              <label className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                                  Audio Languages (required)
                              </label>
                              <input />
                          </FormContainer>
                          <FormContainer>
                              <label className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                                  Embedded Subtitles
                              </label>
                              <input />
                          </FormContainer>
                          <FormContainer>
                              <label className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                                  Subtitles Language
                              </label>
                              <input />
                          </FormContainer>
                      </CustomStack>

                      {/** runtime */}
                      <FormContainer>
                          <label className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                              Runtime in Minutes
                          </label>
                          <input />
                      </FormContainer>

                      {/** Year of Production */}
                      <FormContainer>
                          <label className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                              Runtime in Minutes
                          </label>
                          <input />
                      </FormContainer>

                      {/** Genre */}
                      <FormContainer>
                          <label className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                              Genre
                          </label>
                          <input />
                      </FormContainer>

                      {/** tagline */}
                      <FormContainer>
                          <label className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                              tagline
                          </label>
                          <input />
                      </FormContainer>

                      {/** plot summary - 80-160 words */}
                      <FormContainer>
                          <label className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                              plot summary - 80-160 words (required)
                          </label>
                          <textarea />
                      </FormContainer>

                      {/** plot synopsis */}
                      <FormContainer>
                          <label className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                              plot synopsis
                          </label>
                          <textarea className="textarealg" />
                      </FormContainer>
                  </CustomStack>
              </Form>
          )}
      </Formik>
  )
}

export default EditSeriesForm
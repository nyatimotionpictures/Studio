import { Form, Formik } from "formik";
import React from "react";
import { useContext } from "react";
import * as yup from "yup";
import CustomStack from "../Stacks/CustomStack";
import { FormContainer } from "../Stacks/InputFormStack";

const CastCrew = ({ innerref, handleStepNext }) => {
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
            {/** title */}
            <FormContainer>
              <label className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                Cast (required)
              </label>
              <input />
            </FormContainer>
            {/** type */}
            <FormContainer>
              <label className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                Directors (required)
              </label>
              <input />
            </FormContainer>

            {/** runtime */}
            <FormContainer>
              <label className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                Producers (required)
              </label>
              <input />
            </FormContainer>

            {/** Year of Production */}
            <FormContainer>
              <label className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                Writers (required)
              </label>
              <input />
            </FormContainer>

            {/** Year of Production */}
            <FormContainer>
              <label className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                Sound Core (required)
              </label>
              <input />
            </FormContainer>
          </CustomStack>
        </Form>
      )}
    </Formik>
  );
};

export default CastCrew;

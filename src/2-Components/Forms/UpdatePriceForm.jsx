import { Form, Formik } from "formik";
import React from "react";
import { useContext } from "react";
import * as yup from "yup";
import CustomStack from "../Stacks/CustomStack";
import { FormContainer } from "../Stacks/InputFormStack";
import ErrorMessage from "./ErrorMessage";
import { Typography } from "@mui/material";

const UpdatePriceForm = ({ innerref, handleStepNext, film, filmTypes }) => {
    const validationSchema = yup.object().shape({
        price: yup.number().required("required"),
        videoId: yup.string().required("required"),
      });

      console.log("filmTypes", filmTypes)

    const initialValues = {
        price: filmTypes?.currentPrice ?? 0,
        currency: "UGX",
        videoId: filmTypes?.id,
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
    {({ values, handleChange, errors,handleBlur, touched, setFieldValue }) => (
        <Form>
        <CustomStack className="h-full w-full flex flex-col gap-5 text-whites-40">
        <FormContainer>
        
            <label
            
              className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
            >
             Set Price for {filmTypes?.filmTypes ? filmTypes?.filmTypes : ""}
            </label>
          

          
          </FormContainer> 
              {/** Price */}
              <FormContainer>
            <label
              htmlFor="price"
              className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
            >
             Price (required)
            </label>
            <input
              id="price"
              type="number"
              value={values.price}
              name="price"
              onChange={handleChange}
              placeholder="Price"
              onBlur={handleBlur}
            />

            <ErrorMessage
              errors={touched?.price && errors?.price ? true : false}
              name="price"
              message={errors?.price && errors.price}
            />
          </FormContainer>

      
        
        </CustomStack>
      </Form>
    )}
</Formik>
  )
}

export default UpdatePriceForm
import React from 'react'
import * as yup from "yup";
import { Form, Formik } from "formik";
import { FormContainer } from '../Stacks/InputFormStack';
import CustomStack from '../Stacks/CustomStack';
import ErrorMessage from './ErrorMessage';

const EditPricingForm = ({ innerref, handleStepNext, editdata, film, season }) => {
     const validationSchema = yup.object().shape({
              sdPricing: yup.number().required("required"),
              hdPricing: yup.number().required("required"),
              fullHDPricing: yup.number().required("required"),
              ultraHDPricing: yup.number().required("required"),
              filmId: yup.string().required("required"),
            });

            const initialValues = editdata ? {
              id: season?.id ?? null,
              sdPricing: season?.sdPricing ?? null,
              hdPricing: season?.hdPricing ?? null,
              fullHDPricing: season?.fullHDPricing ?? null,
              ultraHDPricing: season?.ultraHDPricing ?? null,
              filmId: film?.id ?? "",
            } : {
              sdPricing: null,
              hdPricing: null,
              fullHDPricing: null,
              ultraHDPricing: null,
              filmId: ""
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

        {({ values, handleChange, handleBlur, errors, touched, setFieldValue }) => (
          <Form>
             <CustomStack className="h-full w-full flex flex-col gap-5 text-whites-40">
                {/** SD Pricing */}
                <FormContainer>
                  <label
                    htmlFor="sdPricing"
                    className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
                  >
                    SD Pricing (required)
                  </label>
                  <input
                    id="sdPricing"
                    type="number"
                    value={values.sdPricing}
                    name="sdPricing"
                    onChange={handleChange}
                    placeholder="SD Pricing"
                    onBlur={handleBlur}
                  />

                  <ErrorMessage
                    errors={touched?.sdPricing && errors?.sdPricing ? true : false}
                    name="sdPricing"
                    message={errors?.sdPricing && errors.sdPricing}
                  />
                </FormContainer>
                {/** HD Pricing */}
                <FormContainer>
                  <label
                    htmlFor="hdPricing"
                    className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
                  >
                    HD Pricing (required)
                  </label>
                  <input
                    id="hdPricing"
                    type="number"
                    value={values.hdPricing}
                    name="hdPricing"
                    onChange={handleChange}
                    placeholder="HD Pricing"
                    onBlur={handleBlur}
                  />

                  <ErrorMessage
                    errors={touched?.hdPricing && errors?.hdPricing ? true : false}
                    name="hdPricing"
                    message={errors?.hdPricing && errors.hdPricing}
                  />
                </FormContainer>
                {/** Full HD Pricing */}
                <FormContainer>
                  <label
                    htmlFor="fullHDPricing"
                    className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
                  >
                    Full HD Pricing (required)
                  </label>
                  <input
                    id="fullHDPricing"
                    type="number"
                    value={values.fullHDPricing}
                    name="fullHDPricing"
                    onChange={handleChange}
                    placeholder="Full HD Pricing"
                    onBlur={handleBlur}
                  />

                  <ErrorMessage
                    errors={touched?.fullHDPricing && errors?.fullHDPricing ? true : false}
                    name="fullHDPricing"
                    message={errors?.fullHDPricing && errors.fullHDPricing}
                  />
                </FormContainer>
                {/** Ultra HD Pricing */}
                <FormContainer>
                  <label
                    htmlFor="ultraHDPricing"
                    className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
                  >
                    Ultra HD Pricing (required)
                  </label>
                  <input
                    id="ultraHDPricing"
                    type="number"
                    value={values.ultraHDPricing}
                    name="ultraHDPricing"
                    onChange={handleChange}
                    placeholder="Ultra HD Pricing"
                    onBlur={handleBlur}
                  />

                  <ErrorMessage
                    errors={touched?.ultraHDPricing && errors?.ultraHDPricing ? true : false}
                    name="ultraHDPricing"
                    message={errors?.ultraHDPricing && errors.ultraHDPricing}
                  />
                </FormContainer>
             </CustomStack>

          </Form>
          
        )}
      </Formik>
  )
}

export default EditPricingForm
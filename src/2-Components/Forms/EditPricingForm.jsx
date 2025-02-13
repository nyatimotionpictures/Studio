import React from 'react'
import * as yup from "yup";
import { Form, Formik } from "formik";
import { FormContainer } from '../Stacks/InputFormStack';
import CustomStack from '../Stacks/CustomStack';
import ErrorMessage from './ErrorMessage';

const EditPricingForm = ({ innerref, handleStepNext, editdata, film, season, pricingData, pricingSD, pricingHD, pricingFHD, pricingUHD, type }) => {
     const validationSchema = yup.object().shape({
              SD: yup.number().required("required"),
              HD: yup.number().required("required"),
              FHD: yup.number().required("required"),
              UHD: yup.number().required("required"),
              type: yup.string().required("required"),
              resourceId: yup.string().required("required"),
            });

            const initialValues = editdata ? {
              id: pricingData?.id ?? null,
              SD:  pricingSD?.price ?? 1000,
              HD: pricingHD?.price ?? 1000,
              FHD: pricingFHD?.price ?? 1000,
              UHD: pricingUHD?.price ?? 1000,
              currency: pricingData?.currency ?? "UGX",
              type: type === "season" ? "season" : "movie",
              resourceId: type === "season" ? season?.id : film?.id ?? "",
            }
             : {
              SD: 1000,
              HD:  1000,
              FHD: 1000,
              UHD:  1000,
              currency:  "UGX",
              type: type === "season" ? "season" : "movie",
              resourceId: type === "season" ? season?.id : film?.id ?? "",
            };
  return (
      <Formik
        innerRef={innerref}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, helpers) => {
          let newValues = {
            type: values.type,
            resourceId: values.resourceId,
            id: values.id,
            priceList: [
              {
                ...pricingSD,
                price: values.SD,
                resolution: "SD",
              },
              {
                ...pricingHD,
                price: values.HD,
                resolution: "HD",
              },
              {
                ...pricingFHD,
                price: values.FHD,
                resolution: "FHD",
              },
              {
                ...pricingUHD,
                price: values.UHD,
                resolution: "UHD",  
              }
            ],
           
            currency: values.currency,
            
          }
          handleStepNext(newValues);
        }}
      >

        {({ values, handleChange, handleBlur, errors, touched, setFieldValue }) => (
          <Form>
             <CustomStack className="h-full w-full flex flex-col gap-5 text-whites-40">
                {/** SD Pricing */}
                <FormContainer>
                  <label
                    htmlFor="SD"
                    className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
                  >
                    SD Pricing (required)
                  </label>
                  <input
                    id="SD"
                    type="number"
                    value={values.SD}
                    name="SD"
                    onChange={handleChange}
                    placeholder="SD Pricing"
                    onBlur={handleBlur}
                  />

                  <ErrorMessage
                    errors={touched?.SD && errors?.SD ? true : false}
                    name="SD"
                    message={errors?.SD && errors.SD}
                  />
                </FormContainer>
                {/** HD Pricing */}
                <FormContainer>
                  <label
                    htmlFor="HD"
                    className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
                  >
                    HD Pricing (required)
                  </label>
                  <input
                    id="HD"
                    type="number"
                    value={values.HD}
                    name="HD"
                    onChange={handleChange}
                    placeholder="HD Pricing"
                    onBlur={handleBlur}
                  />

                  <ErrorMessage
                    errors={touched?.HD && errors?.HD ? true : false}
                    name="HD"
                    message={errors?.HD && errors.HD}
                  />
                </FormContainer>
                {/** Full HD Pricing */}
                <FormContainer>
                  <label
                    htmlFor="FHD"
                    className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
                  >
                    Full HD Pricing (required)
                  </label>
                  <input
                    id="FHD"
                    type="number"
                    value={values.FHD}
                    name="FHD"
                    onChange={handleChange}
                    placeholder="Full HD Pricing"
                    onBlur={handleBlur}
                  />

                  <ErrorMessage
                    errors={touched?.FHD && errors?.FHD ? true : false}
                    name="FHD"
                    message={errors?.FHD && errors.FHD}
                  />
                </FormContainer>
                {/** Ultra HD Pricing */}
                <FormContainer>
                  <label
                    htmlFor="UHD"
                    className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
                  >
                    Ultra HD Pricing (required)
                  </label>
                  <input
                    id="UHD"
                    type="number"
                    value={values.UHD}
                    name="UHD"
                    onChange={handleChange}
                    placeholder="Ultra HD Pricing"
                    onBlur={handleBlur}
                  />

                  <ErrorMessage
                    errors={touched?.UHD && errors?.UHD ? true : false}
                    name="UHD"
                    message={errors?.UHD && errors.UHD}
                  />
                </FormContainer>
             </CustomStack>

          </Form>
          
        )}
      </Formik>
  )
}

export default EditPricingForm
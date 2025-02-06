import {  Form, Formik } from 'formik';
import React from 'react'
import * as yup from "yup";
import CustomStack from '../Stacks/CustomStack';
import ErrorMessage from './ErrorMessage';
import { FormContainer } from '../Stacks/InputFormStack';

const EditCategoryNameForm = ({
    innerref,
    handleStepNext,
   editData
  }) => {
      const validationSchema = yup.object().shape({
        name: yup.string().required("required"),
        id: yup.string().required("required"),
      });
    
      const initialValues = {
        name: editData?.name ?? "",
        id: editData?.id ?? "",
      };
    
  return (
    <Formik
      innerRef={innerref}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, helpers) => {
        let { id, name } = values;    
        let editedCategory = {
        id: id,
          name: name,
        
        };
        console.log("editedCategory", editedCategory)
        handleStepNext(editedCategory);
      }}
    >
      {({
        values,
        handleChange,
        errors,
        handleBlur,
        touched,
        setFieldValue,
        resetForm,
      }) => (
        <Form>
          <CustomStack className="h-full w-full flex flex-col gap-5 text-whites-40">
            {/** CAtegory Name */}
            <FormContainer>
              <label
                htmlFor="name"
                className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
              >
                Category Name (required)
              </label>
              <input
                id="name"
                type="text"
                value={values.name}
                name="name"
                onChange={handleChange}
                placeholder="Category Title i.e Most Rated Movies"
                onBlur={handleBlur}
              />

              <ErrorMessage
                errors={touched?.name && errors?.name ? true : false}
                name="name"
                message={errors?.name && errors.name}
              />
            </FormContainer>

          </CustomStack>
        </Form>
      )}
    </Formik>
  )
}

export default EditCategoryNameForm
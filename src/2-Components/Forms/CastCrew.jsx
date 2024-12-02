import { Form, Formik } from "formik";
import React from "react";
import * as yup from "yup";
import CustomStack from "../Stacks/CustomStack";
import { FormContainer } from "../Stacks/InputFormStack";
import { Autocomplete, TextField } from "@mui/material";
import ErrorMessage from "./ErrorMessage";

const CastCrew = ({ innerref, handleStepNext, editdata, film }) => {
    const validationSchema = yup.object().shape({
      cast: yup.array().min(1, "required"),
      directors: yup.array().min(1, "required"),
      writers: yup.array().min(1, "required"),
      producers: yup.array().min(1, "required"),
      soundcore: yup.array().min(1, "required"),
    });

    const initialValues = editdata ? {
      ...film,
      id: film?.id,
      
      cast: film?.cast ,
      directors: film?.directors ?? [],
      writers: film?.writers ?? [],
      producers: film?.producers ?? [],
      soundcore: film?.soundcore ?? [],
    
    } : {
      cast: [],
      directors: [],
      writers: [],
      producers: [],
      soundcore: [],
    };

    const castOptions = [
      { label: 'Cindy Magara' },
    ]
    const producerOptions = [
      { label: 'Cindy Magara' },
    ]
    const directorOptions = [
      { label: 'Cindy Magara' },
    ]

    const writerOptions = [
      { label: 'Cindy Magara' },
    ]

    const soundcoreOptions = [
      { label: 'Cindy Magara' },
    ]

   // console.log(initialValues)
  return (
    <Formik
      innerRef={innerref}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, helpers) => {
        //console.log(values)
       handleStepNext(values);
      }}
    >
      {({ values, handleChange,handleBlur, errors, touched, setFieldValue }) => (
        <Form>
          <CustomStack className="h-full w-full flex flex-col gap-5">
            {/** title */}
            <FormContainer>
              <label htmlFor="cast" className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                Cast (required)
              </label>

              <Autocomplete onBlur={handleBlur} limitTags={4} style={{border: "none"}} className="mulipleselect" multiple id="cast" freeSolo options={castOptions.map((option)=>option.label)}   onChange={(event, newValue)=> {
                  setFieldValue("cast", newValue);
                }} value={values.cast}  renderInput={(params)=> (<TextField {...params} variant="outlined"  placeholder="Cast" label=""     sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      border: 'none', 
                    },
                    '&:hover fieldset': {
                      border: 'none', 
                    },
                    '&.Mui-focused fieldset': {
                      border: 'none', 
                    },
                  },
                }}   />)} />
                
               <ErrorMessage
                errors={touched?.cast && errors?.cast ? true : false}
                name="cast"
                message={errors?.cast && errors.cast}
              />
            </FormContainer>
            {/** type */}
            <FormContainer>
              <label htmlFor="directors" className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                Directors (required)
              </label>
            
              <Autocomplete onBlur={handleBlur} limitTags={4} style={{border: "none"}} className="mulipleselect" multiple id="directors" freeSolo options={directorOptions.map((option)=>option.label)}   onChange={(event, newValue)=> {
                  setFieldValue("directors", newValue);
                }} value={values.directors}  renderInput={(params)=> (<TextField {...params} variant="outlined"  placeholder="Directors" label=""     sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      border: 'none', 
                    },
                    '&:hover fieldset': {
                      border: 'none', 
                    },
                    '&.Mui-focused fieldset': {
                      border: 'none', 
                    },
                  },
                }}   />)} />
                
               <ErrorMessage
                errors={touched?.directors && errors?.directors ? true : false}
                name="directors"
                message={errors?.directors && errors.directors}
              />
            </FormContainer>

            {/** runtime */}
            <FormContainer>
              <label htmlFor="producers" className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                Producers (required)
              </label>
              <Autocomplete onBlur={handleBlur} limitTags={4} style={{border: "none"}} className="mulipleselect" multiple id="producers" freeSolo options={producerOptions.map((option)=>option.label)}   onChange={(event, newValue)=> {
                  setFieldValue("producers", newValue);
                }} value={values.producers}  renderInput={(params)=> (<TextField {...params} variant="outlined"  placeholder="Producers" label=""     sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      border: 'none', 
                    },
                    '&:hover fieldset': {
                      border: 'none', 
                    },
                    '&.Mui-focused fieldset': {
                      border: 'none', 
                    },
                  },
                }}   />)} />
                
               <ErrorMessage
                errors={touched?.producers && errors?.producers ? true : false}
                name="producers"
                message={errors?.producers && errors.producers}
              />
            </FormContainer>

            {/** Year of Production */}
            <FormContainer>
              <label htmlFor="writers" className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                Writers (required)
              </label>
              <Autocomplete onBlur={handleBlur} limitTags={4} style={{border: "none"}} className="mulipleselect" multiple id="writers" freeSolo options={writerOptions.map((option)=>option.label)}   onChange={(event, newValue)=> {
                  setFieldValue("writers", newValue);
                }} value={values.writers}  renderInput={(params)=> (<TextField {...params} variant="outlined"  placeholder="Writers" label=""     sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      border: 'none', 
                    },
                    '&:hover fieldset': {
                      border: 'none', 
                    },
                    '&.Mui-focused fieldset': {
                      border: 'none', 
                    },
                  },
                }}   />)} />
                
               <ErrorMessage
                errors={touched?.writers && errors?.writers ? true : false}
                name="writers"
                message={errors?.writers && errors.writers}
              />
            </FormContainer>

            {/** Year of Production */}
            <FormContainer>
              <label htmlFor="soundcore" className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                Sound Core (required)
              </label>
              <Autocomplete onBlur={handleBlur} limitTags={4} style={{border: "none"}} className="mulipleselect" multiple id="soundcore" freeSolo options={soundcoreOptions.map((option)=>option.label)}   onChange={(event, newValue)=> {
                  setFieldValue("soundcore", newValue);
                }} value={values.soundcore}  renderInput={(params)=> (<TextField {...params} variant="outlined"  placeholder="Sound Core" label=""     sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      border: 'none', 
                    },
                    '&:hover fieldset': {
                      border: 'none', 
                    },
                    '&.Mui-focused fieldset': {
                      border: 'none', 
                    },
                  },
                }}   />)} />
                
               <ErrorMessage
                errors={touched?.soundcore && errors?.soundcore ? true : false}
                name="soundCore"
                message={errors?.soundcore && errors.soundcore}
              />
            </FormContainer>
          </CustomStack>
        </Form>
      )}
    </Formik>
  );
};

export default CastCrew;

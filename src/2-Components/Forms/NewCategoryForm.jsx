import { Form, Formik } from "formik";
import React from "react";
import { useContext } from "react";
import * as yup from "yup";
import CustomStack from "../Stacks/CustomStack";
import { FormContainer } from "../Stacks/InputFormStack";
import ErrorMessage from "./ErrorMessage";
import { Autocomplete, TextField } from "@mui/material";

const categoryTypes =[
    { label: "mixed (series&films)",   },
    { label: "movies",   },
    { label: "series",   }, 
    { label: "genres",   }, 
]

const NewCategoryForm = ({ innerref, handleStepNext, genreOptions, serieOptions, moviesOptions, mixedOptions }) => {
    // const genreOptions = [
    //     { label: "Action",   },
    //     { label: "Adventure"  },
    //     { label: "Comedy" },
    //     { label: "Drama" },
    //     { label: "Family" },
    //     { label: "Fantasy" },
    //     { label: "History" },
    //     { label: "Horror" },
    //     { label: "Music" },
    //     { label: "Mystery" },
    //     { label: "Romance" },
    //     { label: "Sci-Fi" },
    //     { label: "Sport" },
    //     { label: "Thriller" },
    //     { label: "War" },
       
    //   ];
       const validationSchema = yup.object().shape({
            name: yup.string().required("required"),
           // postion: yup.number().required("required"),
            type: yup.string().required("required"),
            status: yup.string().required("required"),
          });
    
        const initialValues = {
            name: "",
            type: "",
            status: "",
            genre: [],
            series: [],
            seasons: [],
            films: [],
            mixed: []
           
            
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
      {({
        values,
        handleChange,
        errors,
        handleBlur,
        touched,
        setFieldValue,
        resetForm
      }) => (
        <Form>
          <CustomStack className="h-full w-full flex flex-col gap-5 text-whites-40">
            {/** Season Number */}
            <FormContainer>
              <label
                htmlFor="name"
                className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
              >
                Category Title (required)
              </label>
              <input
                id="name"
                type="text"
                value={values.name}
                name="name"
                onChange={handleChange}
                placeholder="Category Name"
                onBlur={handleBlur}
              />

              <ErrorMessage
                errors={touched?.name && errors?.name ? true : false}
                name="name"
                message={errors?.name && errors.name}
              />
            </FormContainer>

            {/** type */}
            <FormContainer>
              <label
                htmlFor="title"
                className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
              >
                Selection By (required)
              </label>

              <select
                id="type"
                value={values.type}
                name="type"
                onChange={(e) => {
                   
                    //resetForm({genre: [], series: [], seasons: []});
                    setFieldValue("type", e.target.value);
                    setFieldValue("genre", []);
                    setFieldValue("series", []);
                    setFieldValue("seasons", []);
                    setFieldValue("films", []);
                    setFieldValue("mixed", []);

                  
                }}
                onBlur={handleBlur}
              >
                <option value="">select option</option>
                {categoryTypes.map((option) => (
                  <option key={option.label} value={option.label}>
                    {option.label}
                  </option>
                ))}

                {/* <option value="TV Show">TV Show</option> */}
              </select>

              <ErrorMessage
                errors={touched?.type && errors?.type ? true : false}
                name="type"
                message={errors?.type && errors.type}
              />
            </FormContainer>

            {/** selection === genres */}
            {values.type === "genres" && (
              <FormContainer>
                <label
                  htmlFor="title"
                  className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
                >
                  Genres (required)
                </label>
                <Autocomplete
                  onBlur={handleBlur}
                  limitTags={4}
                  style={{ border: "none" }}
                  className="mulipleselect"
                  multiple
                  id="genre"
                  freeSolo
                  options={genreOptions.map((option) => option)}
                  onChange={(event, newValue) => {
                    setFieldValue("genre", newValue);
                  }}
                  value={values.genre}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      className="border-0 outline-none focus:border-0 !focus:outline-none"
                      label=""
                      placeholder="Genres"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            border: "none",
                          },
                          "&:hover fieldset": {
                            border: "none",
                          },
                          "&.Mui-focused fieldset": {
                            border: "none",
                          },
                        },
                      }}
                    />
                  )}
                />

                <ErrorMessage
                  errors={touched?.type && errors?.type ? true : false}
                  name="type"
                  message={errors?.type && errors.type}
                />
              </FormContainer>
            )}

              {/** selection === movies */}
              {values.type === "movies" && (
              <FormContainer>
                <label
                  htmlFor="movies"
                  className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
                >
                    Movies (required)
                </label>
                <Autocomplete
                  onBlur={handleBlur}
                  limitTags={4}
                  style={{ border: "none" }}
                  className="mulipleselect"
                  multiple
                  id="movies"
                  options={moviesOptions}
                  getOptionLabel={(option) => option.title}
                  onChange={(event, newValue) => {
                    setFieldValue("films", newValue);
                  }}
                  value={values.films}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      className="border-0 outline-none focus:border-0 !focus:outline-none"
                      label=""
                      placeholder="Choose movies from dropdown"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            border: "none",
                          },
                          "&:hover fieldset": {
                            border: "none",
                          },
                          "&.Mui-focused fieldset": {
                            border: "none",
                          },
                        },
                      }}
                    />
                  )}
                />

                <ErrorMessage
                  errors={touched?.type && errors?.type ? true : false}
                  name="type"
                  message={errors?.type && errors.type}
                />
              </FormContainer>
            )}

                     {/** selection === mixed */}
                     {values.type === "mixed (series&films)" && (
              <FormContainer>
                <label
                  htmlFor="mixed"
                  className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
                >
                    Mixed Content (required)
                </label>
                <Autocomplete
                  onBlur={handleBlur}
                  limitTags={4}
                  style={{ border: "none" }}
                  className="mulipleselect"
                  multiple
                  id="mixed"
                  options={mixedOptions}
                  getOptionLabel={(option) => option.title}
                  onChange={(event, newValue) => {
                    setFieldValue("mixed", newValue);
                  }}
                  value={values.mixed}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      className="border-0 outline-none focus:border-0 !focus:outline-none"
                      label=""
                      placeholder="Choose movies from dropdown"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            border: "none",
                          },
                          "&:hover fieldset": {
                            border: "none",
                          },
                          "&.Mui-focused fieldset": {
                            border: "none",
                          },
                        },
                      }}
                    />
                  )}
                />

                <ErrorMessage
                  errors={touched?.type && errors?.type ? true : false}
                  name="type"
                  message={errors?.type && errors.type}
                />
              </FormContainer>
            )}

            {/** selection === series */}
            {values.type === "series" && (
              <>
                <FormContainer>
                  <label
                    htmlFor="series"
                    className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
                  >
                    Series (required)
                  </label>
                  <Autocomplete
                    onBlur={handleBlur}
                    limitTags={4}
                    style={{ border: "none" }}
                    className="mulipleselect"
                    multiple
                    id="series"
                   options={serieOptions}
                    getOptionLabel={(option) => option.title}
                    onChange={(event, newValue) => {
                        console.log("newValue", event.target, newValue)
                      setFieldValue("series", newValue);
                    }}
                    value={values.series}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        className="border-0 outline-none focus:border-0 !focus:outline-none"
                        label=""
                        placeholder="Choose series from dropdown"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              border: "none",
                            },
                            "&:hover fieldset": {
                              border: "none",
                            },
                            "&.Mui-focused fieldset": {
                              border: "none",
                            },
                          },
                        }}
                      />
                    )}
                  />

                  <ErrorMessage
                    errors={touched?.type && errors?.type ? true : false}
                    name="type"
                    message={errors?.type && errors.type}
                  />
                </FormContainer>

                <FormContainer>
                  <label
                    htmlFor="seasons"
                    className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
                  >
                    Seasons (required)
                  </label>
                  <Autocomplete
                    onBlur={handleBlur}
                    limitTags={4}
                    style={{ border: "none" }}
                    className="mulipleselect"
                    multiple
                    id="seasons"
                  
                    options={serieOptions?.map((option) => option.title)}
                    onChange={(event, newValue) => {
                      setFieldValue("seasons", newValue);
                    }}
                    value={values.seasons}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        className="border-0 outline-none focus:border-0 !focus:outline-none"
                        label=""
                        placeholder="Seasons"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              border: "none",
                            },
                            "&:hover fieldset": {
                              border: "none",
                            },
                            "&.Mui-focused fieldset": {
                              border: "none",
                            },
                          },
                        }}
                      />
                    )}
                  />

                  <ErrorMessage
                    errors={touched?.type && errors?.type ? true : false}
                    name="type"
                    message={errors?.type && errors.type}
                  />
                </FormContainer>

               
              </>
            ) }

            {/** selection === films&series */}
          </CustomStack>
        </Form>
      )}
    </Formik>
  );
}

export default NewCategoryForm
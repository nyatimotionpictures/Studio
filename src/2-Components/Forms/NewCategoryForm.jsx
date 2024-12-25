import { Form, Formik } from "formik";
import React from "react";
import { useContext } from "react";
import * as yup from "yup";
import CustomStack from "../Stacks/CustomStack";
import { FormContainer } from "../Stacks/InputFormStack";
import ErrorMessage from "./ErrorMessage";
import { Autocomplete, Box, TextField } from "@mui/material";
import { useGetSingleFilms } from "../../5-Store/TanstackStore/services/queries";

const categoryTypes =[
    { label: "mixed (series&films)",   },
    { label: "movies",   },
    { label: "series",   }, 
    { label: "genres",   }, 
]

const NewCategoryForm = ({ innerref, handleStepNext, genreOptions, serieOptions, moviesOptions, mixedOptions }) => {

    const [serieArray, setSerieArray] = React.useState([]);

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

          const serieGetData = React.useMemo(() => {
            return  serieArray.map((option) => {
              return option.id
            });   
          }, [serieArray]);  

         
          let queriedData = useGetSingleFilms(serieGetData);
          

      let seasonsOptions = React.useMemo(()=>{
        if (!queriedData || queriedData?.length === 0) return [];
        return queriedData?.map((data)=>data?.data?.film?.season?.map((season)=> ({
          id: season.id,
          title: season.title,
          season: season.season,
          filmId: season.filmId,
          filmtitle: data?.data?.film?.title,

        }))).flat();
      },[queriedData])
 
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
        resetForm,
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
                placeholder="Category Title i.e Most Rated Movies"
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
                      placeholder="Select Genres from dropdown"
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
                    getOptionLabel={(option) => option?.title}
                    onChange={(event, newValue) => {
                      setFieldValue("series", newValue);
                      setSerieArray(newValue);
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
                    options={seasonsOptions}
                    getOptionLabel={(option) => option?.title}
                    renderOption={(props, option) => (
                      <Box
                        component="li"
                        {...props}
                        sx={{
                          "& > img": {
                            mr: 2,
                            flexShrink: 0,
                          },
                          "& > span": { flex: 1 },
                        }}
                      >
                        <span>
                          {option?.title} (S{option.season}) (
                          {option?.filmtitle})
                        </span>
                      </Box>
                    )}
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
                        placeholder="Choose Seasons from dropdown"
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
            )}
          </CustomStack>
        </Form>
      )}
    </Formik>
  );
}

export default NewCategoryForm
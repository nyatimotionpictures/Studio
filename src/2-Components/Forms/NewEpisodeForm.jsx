import { Form, Formik } from "formik";
import React from "react";
import { useContext } from "react";
import * as yup from "yup";
import CustomStack from "../Stacks/CustomStack";
import { FormContainer } from "../Stacks/InputFormStack";
import ErrorMessage from "./ErrorMessage";
import { Autocomplete, TextField } from "@mui/material";

const NewEpisodeForm = ({ innerref, handleStepNext, editdata, film, seasonId }) => {

    // episode {
    //     id        String    @id @default(auto()) @map("_id") @db.ObjectId
    //     title     String
    //     overview  String
    //     episode   Int       @default(1)
    //     video     video[]
    //     season    season?   @relation(fields: [seasonId], references: [id], onDelete: Cascade)
    //     seasonId  String?   @db.ObjectId
    //     createdAt DateTime  @default(now())
    //     watched   watched[]
    //   }

    const validationSchema = yup.object().shape({
        episode: yup.number().required("required"),
    title: yup.string().required("required"),
    audioLanguages: yup.array().min(1, "required"),
    tags: yup.array().min(1, "required"),
   // runtime: yup.string().required("required"),
   // embeddedSubtitles: yup.string().required("required"),
    //subtitleLanguage: yup.array(yup.string().required("required")),
   
    yearOfProduction: yup.string().required("required"),
    releaseDate: yup.string().required("required"),
    genre: yup.array().min(1, "required"),
    overview: yup.string().required("required"),
    plotSummary: yup.string().required("required"),
  });

  const initialValues = editdata ? {
    id:film?.id,
    episode: film?.episode ?? null,
    seasonId: film?.seasonId ?? null,
    title: film?.title ?? "",

    audioLanguages: film?.audioLanguages ?? [],
    embeddedSubtitles: film?.embeddedSubtitles ?? false,
    subtitleLanguage: film?.subtitleLanguage ?? [],
    yearOfProduction: film?.yearOfProduction ?? "",
    releaseDate: film?.releaseDate ?? "",
    genre: film?.genre ?? [],
    tags: film?.tags ?? [],
    overview: film?.overview ?? "",
    plotSummary: film?.plotSummary ?? "",
  } : 
    {
        episode: null,
        seasonId: seasonId ,
    title: "",
 
    audioLanguages: [],
    embeddedSubtitles: "",
    subtitleLanguage: [],
    yearOfProduction: "",
    genre: [],
    tags: [],
    releaseDate: "",
    overview: "",
    plotSummary: "",
  };

  const LanguageOptions = [
    { label: "English",   },
    { label: "Luganda"  },
    { label: "Rukiga" },
  ];

  const genreOptions = [
    { label: "Action",   },
    { label: "Adventure"  },
    { label: "Comedy" },
    { label: "Drama" },
    { label: "Family" },
    { label: "Fantasy" },
    { label: "History" },
    { label: "Horror" },
    { label: "Music" },
    { label: "Mystery" },
    { label: "Romance" },
    { label: "Sci-Fi" },
    { label: "Sport" },
    { label: "Thriller" },
    { label: "War" },
   
  ];

  const tagOptions = [
    {
      label : "western uganda",
    },  
    {
      label : "eastern uganda",
    },  
    {
      label : "northern uganda",
    },  
  ]
  return (
      <Formik
          innerRef={innerref}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, helpers) => {
          //  console.log(values)
             handleStepNext(values);
          }}
      >
          {({ values, handleChange, handleBlur, errors, touched, setFieldValue }) => (
               <Form>
               <CustomStack className="h-full w-full flex flex-col gap-5 text-whites-40">
                 {/** title */}
                 <FormContainer>
                   <label
                     htmlFor="episode"
                     className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
                   >
                     Episode Number (required)
                   </label>
                   <input
                     id="episode"
                     type="number"
                     value={values.episode}
                     name="episode"
                     onChange={handleChange}
                     placeholder="Episode Number"
                     onBlur={handleBlur}
                   />
     
                   <ErrorMessage
                     errors={touched?.episode && errors?.episode ? true : false}
                     name="episode"
                     message={errors?.episode && errors.episode}
                   />
                 </FormContainer>
                 {/** title */}
                 <FormContainer>
                   <label
                     htmlFor="title"
                     className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
                   >
                    Episode Title (required)
                   </label>
                   <input
                     id="title"
                     value={values.title}
                     name="title"
                     onChange={handleChange}
                     placeholder="Title "
                     onBlur={handleBlur}
                   />
     
                   <ErrorMessage
                     errors={touched?.title && errors?.title ? true : false}
                     name="title"
                     message={errors?.title && errors.title}
                   />
                 </FormContainer>
                 
     
                 {/** three input */}
                 <CustomStack className="flex-row justify-between gap-6">
                   {/* audioLanguagess */}
                   <FormContainer>
                     <label htmlFor="audioLanguages" className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                       Audio Languages (required)
                     </label>
                     <Autocomplete onBlur={handleBlur} limitTags={4} style={{border: "none"}} className="mulipleselect" multiple id="audioLanguages" freeSolo options={LanguageOptions.map((option)=>option.label)}  onChange={(event, newValue)=> {
                       setFieldValue("audioLanguages", newValue);
                     }} value={values.audioLanguages}  renderInput={(params)=> (<TextField {...params} variant="outlined"  placeholder="Audio Languages" label=""     sx={{
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
                     errors={touched?.audioLanguages && errors?.audioLanguages ? true : false}
                     name="audioLanguages"
                     message={errors?.audioLanguages && errors.audioLanguages}
                   />
                   </FormContainer>
                   {/* embeddedSubtitles */}
                   <FormContainer>
                     <label htmlFor="embeddedSubtitles" className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                       Embedded Subtitles
                     </label>
                     <select
                     id="embeddedSubtitles"
                     onBlur={handleBlur} 
                     value={values.embeddedSubtitles}
                     name="embeddedSubtitles"
                     onChange={handleChange}
                   >
                      <option value="">select option</option>
                     <option value={"false"}>No</option>
                     <option value={"true"}>Yes</option>
                  
                     {/* <option value="TV Show">TV Show</option> */}
                   </select>
     
                   <ErrorMessage
                     errors={ touched?.embeddedSubtitles && errors?.embeddedSubtitles ? true : false}
                     name="embeddedSubtitles"
                     message={errors?.embeddedSubtitles && errors.embeddedSubtitles}
                   />
                   </FormContainer>
                   {/* subtitleLanguage */}
                   {
                     values.embeddedSubtitles === "true" &&
                     <FormContainer>
                       <label htmlFor="subtitlesLanguage" className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                         Subtitles Language
                       </label>
                       <Autocomplete limitTags={4} style={{border: "none"}} className="mulipleselect" multiple id="subtitlesLanguage" freeSolo options={LanguageOptions.map((option)=>option.label)} onChange={(event, newValue)=> {
                       setFieldValue("subtitleLanguage", newValue);
                     }} value={values.subtitleLanguage}   renderInput={(params)=> (<TextField {...params} variant="outlined" placeholder="Subtitle Languages"  label=""     sx={{
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
                     </FormContainer>
                   }
                  
                 </CustomStack>
     
                 {/** runtime */}
                 <FormContainer>
                   <label htmlFor="runtime" className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                     Runtime in Minutes
                   </label>
                   <input name="runtime" type="text" placeholder="Runtime in Minutes" value={values.runtime} onChange={handleChange} />
                 </FormContainer>
     
                 {/** Year of Production */}
                 <FormContainer>
                   <label htmlFor="yearOfProduction" className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                     Year of Production
                   </label>
                   <input onBlur={handleBlur}  id="yearOfProduction" name="yearOfProduction" type="text" placeholder="Year of Production" value={values.yearOfProduction} onChange={handleChange} />
     
                  <ErrorMessage
                     errors={touched?.yearOfProduction && errors?.yearOfProduction ? true : false}
                     name="yearOfProduction"
                     message={errors?.yearOfProduction && errors.yearOfProduction}
                   />
                 </FormContainer>
     
                   {/** Release Date */}
                   <FormContainer>
                   <label htmlFor="releaseDate" className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                     Release Date
                   </label>
                   <input onBlur={handleBlur}  id="releaseDate" name="releaseDate" type="date" placeholder="releaseDate" value={values.releaseDate} onChange={handleChange} />
     
                  <ErrorMessage
                     errors={touched?.releaseDate && errors?.releaseDate ? true : false}
                     name="yearOfProduction"
                     message={errors?.releaseDate && errors.releaseDate}
                   />
                 </FormContainer>
     
                 {/** Genre */}
                 <FormContainer>
                   <label htmlFor="genre" className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                     Genre
                   </label>
     
                   <Autocomplete onBlur={handleBlur}  limitTags={4} style={{border: "none"}} className="mulipleselect" multiple id="genre" freeSolo options={genreOptions.map((option)=>option.label)}  onChange={(event, newValue)=> {
                       setFieldValue("genre", newValue);
                     }} value={values.genre}  renderInput={(params)=> (<TextField {...params} variant="outlined" className="border-0 outline-none focus:border-0 !focus:outline-none"  label="" placeholder="Genres"    sx={{
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
                     errors={touched?.genre && errors?.genre ? true : false}
                     name="genre"
                     message={errors?.genre && errors.genre} 
                   />
                 </FormContainer>
     
                 {/** tagline */}
                 <FormContainer>
                   <label className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                     Tagline
                   </label>
                   <Autocomplete onBlur={handleBlur} limitTags={4} style={{border: "none"}} className="mulipleselect" multiple id="tags" freeSolo options={tagOptions.map((option)=>option.label)}  onChange={(event, newValue)=> {
                       setFieldValue("tags", newValue);
                     }} value={values.tags}  renderInput={(params)=> (<TextField {...params} variant="outlined"   label=""   placeholder="Tags"  sx={{
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
                     errors={touched?.tags && errors?.tags ? true : false}
                     name="tags"
                     message={errors?.tags && errors.tags} 
                   />
                 </FormContainer>
     
                 {/** plot summary - 80-160 words */}
                 <FormContainer>
                   <label htmlFor="plotSummary" className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                     Plot Summary - 80-160 words (required)
                   </label>
                   <textarea onBlur={handleBlur}  id="plotSummary" name="plotSummary" value={values.plotSummary} onChange={handleChange} placeholder="plot summary - 80-160 words" />
     
                   <ErrorMessage
                     errors={touched?.plotSummary && errors?.plotSummary ? true : false}
                     name="plotSummary"
                     message={errors?.plotSummary && errors.plotSummary} 
                   />
                 </FormContainer>
     
                 {/** plot synopsis */}
                 <FormContainer>
                   <label htmlFor="overview" className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75" >
                     Plot Synopsis
                   </label>
                   <textarea onBlur={handleBlur} className="textarealg" name="overview" value={values.overview} onChange={handleChange} placeholder="plot synopsis" />
     
                   <ErrorMessage
                     errors={touched?.overview && errors?.overview ? true : false}
                     name="overview"
                     message={errors?.overview && errors.overview} 
                   />
                 </FormContainer>
               </CustomStack>
             </Form>
          )}
      </Formik>
  )
}

export default NewEpisodeForm
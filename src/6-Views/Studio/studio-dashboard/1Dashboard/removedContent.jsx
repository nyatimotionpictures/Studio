// {
//     openFilmModal && (
//       <CustomStack
//         className="relative z-50"
//         aria-labelledby="modal-title"
//         role="dialog"
//         aria-modal="false"
//       >
//         <div className="fixed inset-0 border rounded-xl bg-secondary-50 bg-opacity-75 transition-opacity"></div>

//         <div className="fixed inset-0 z-50 bg-primary-200 bg-opacity-10 overflow-hidden">
//           <div className="relative transform overflow-y-auto rounded-lg bg-secondary-400 h-screen text-left shadow-xl transition-all">
//             <div className="bg-secondary-900 px-16 pt-0 min-h-screen h-max">
//               {/** video form */}
//               {/** <UploadVideo innerref={formRef} />  */}

//               {/** forms with stepper */}
//               <div className="flex flex-col w-full h-full text-whites-40 gap-6 relative">
//                 <CustomStack className="z-50 w-full justify-between items-center py-2 pt-7 sticky top-0 bg-secondary-900">
//                   <Typography className="font-[Inter-Medium] text-[#fafafa] text-xl">
//                     New Movie Upload
//                   </Typography>

//                   <div className="flex gap-5">
//                     <Button onClick={handleModalClose} className="px-5 rounded-lg font-[Inter-Medium] bg-primary-700">
//                       CANCEL & CLOSE
//                     </Button>
//                   </div>
//                 </CustomStack>

//                 {/** stepper show case */}
//                 <StepperCustom
//                   stepperData={stepperArray}
//                   currentStep={currentStep}
//                   stepsAllComplete={stepsAllComplete}
//                 />
//                 {/** form */}
//                 <div className="block mb-3 h-full">
//                   {/**  <ContentDetails
//                 innerref={formRef}
//                 handleStepNext={handleStepNext}
//               /> */}

//                   {/**
//              <CastCrew
//                 innerref={formRef}
//                 handleStepNext={handleStepNext}
//               />
//             */}

//                   {/**
//               <TrailersForm
//                 innerref={formRef}
//                 handleStepNext={handleStepNext}
//               />
//                  *  
//                  *  <Audience
//                 innerref={formRef}
//                 handleStepNext={handleStepNext}
//               />
//                  */}
//                   {/**
// <TrailersForm
//                 innerref={formRef}
//                 handleStepNext={handleStepNext}
//               />

// */}

//                   {/** 
//             <ReviewForm />
//             */}
//                   <FilmFormContext.Provider value={{ videoData, setVideoData }}>
//                     {FormDisplay(stepsAllComplete ? "complete" : currentStep)}
//                   </FilmFormContext.Provider>

//                 </div>

//                 {/** stepper control */}
//                 <div className="border-t-2 border-t-secondary-500 relative">
//                   <StepperControls
//                     handleStepNext={handleStepNext}
//                     stepperData={stepperArray}
//                     currentStep={currentStep}
//                     handleStepPrev={handleStepPrev}
//                     handleFormSubmit={handleFormSubmit}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </CustomStack>
//     )
//   }


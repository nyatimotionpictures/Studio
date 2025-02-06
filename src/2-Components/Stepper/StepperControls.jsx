import React from "react";
import Button from "../Buttons/Button";

const StepperControls = ({
  handleStepNext,
  stepperData,
  currentStep,
  handleStepPrev,
  handleFormSubmit,
  isSubmitting,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(null);

  React.useEffect(() => {
    let getcurrentIndex =
      currentStep !== null
        ? stepperData.findIndex((data) => data?.title === currentStep)
        : null;
    setCurrentIndex(() => getcurrentIndex);
    // console.log('current', getcurrentIndex)
    return () => {
      //second
    };
  }, [currentStep]);
  return (
    <div className="container flex items-center justify-end mt-4 mb-8 gap-[20px]">
      {isSubmitting ? (
        <Button disabled className="w-max min-w-[150px] px-4 rounded-full">
          Submitting...
        </Button>
      ) : (
        <>
          {/** back button */}
          <Button
            disabled={
              currentIndex === null || currentIndex + 1 == 1 ? true : false
            }
            className={`bg-white text-slate-400 uppercase px-10 rounded-full cursor-pointer border-2 border-slate-300 hover:bg-slate-700 hover:text-white transition duration-200 ease-in-out ${
              currentIndex === null || currentIndex + 1 == 1
                ? "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-slate-400"
                : ""
            }`}
            onClick={handleStepPrev}
          >
            back
          </Button>
          {/** next button */}
          <Button
            className="flex items-center uppercase rounded-full cursor-pointer bg-primary-700 px-10 font-[Roboto-Medium] hover:text-white transition duration-200 ease-in-out"
            onClick={handleFormSubmit}
          >
            Submit
          </Button>
        </>
      )}
    </div>
  );
};

export default StepperControls;

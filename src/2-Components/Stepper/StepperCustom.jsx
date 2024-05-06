import { Typography } from "@mui/material";
import React from "react";
import "./Stepper.css";

const StepperCustom = ({ stepperData, currentStep, stepsAllComplete }) => {
  const [currentIndex, setCurrentIndex] = React.useState(null);

  React.useEffect(() => {
    let getCurrentIndex =
      currentStep !== null
        ? stepperData.findIndex((data) => data?.title === currentStep)
        : null;

    setCurrentIndex(() => getCurrentIndex);
  }, [currentStep]);
  return (
    <div className="flex flex-row h-20 w-full ml-0 relative justify-between">
      {stepperData?.map((step, i) => {
        return (
          <div
            key={i}
            className={`flex step-item relative items-center gap-3 w-1/7 ${
              currentStep === step?.title && "active"
            }`}
          >
            <div className="step">
              <div
                className={`stepicon lg:w-14 lg:h-14 rounded-full flex items-center justify-center border-2 md:w-10 md:h-10  ${
                  i + 1 < currentIndex + 1 ? "bg-primary-500" : "bg-transparent"
                } `}
              >
                {i + 1 < currentIndex + 1 || stepsAllComplete ? (
                  <span className="icon-[teenyicons--tick-small-solid] text-3xl text-whites-40"></span>
                ) : (
                  <span
                    className={`font-[Inter-Regular] text-base ${
                      i + 1 === currentIndex + 1 || stepsAllComplete
                        ? "text-primary-500"
                        : "text-[#76757A]"
                    }`}
                  >
                    0{i + 1}
                  </span>
                )}
              </div>
            </div>
            <Typography
              className={`title font-[Inter-Medium] text-sm text-wrap md:text-xs lg:text-sm`}
            >
              {step.title}
            </Typography>
          </div>
        );
      })}
    </div>
  );
};

export default StepperCustom;

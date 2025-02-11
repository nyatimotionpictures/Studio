import React from "react";
import MultipleVideoForm from "./MultipleVideoForm";
import Button from "../Buttons/Button";
import { queryClient } from "../../lib/tanstack";

const MultipleUploadVideo = ({
  videoType,
  film,
  type,
  setErrorUpload,
  setSucessUpload,
  errorUpload,
  sucessUpload,
}) => {
  const [openVideoModal, setOpenVideoModal] = React.useState(false);
  const handleVideoModalOpen = () => {
    setOpenVideoModal(() => true);
    if (typeof window != "undefined" && window.document) {
      document.body.style.overflow = "hidden";
    }
  };
  const handleVideoModalClose = async (type) => {
    setOpenVideoModal(() => false);
    setErrorUpload(null);
    setSucessUpload(null);
    document.body.style.overflow = "unset";
    if (type === "success") {
         await queryClient.invalidateQueries({
           queryKey: ["film", film?.id],
         });
       }
  };
  return (
    <div className="flex flex-col  gap-6">
      <div className="flex items-center gap-8 max-w-[80%]">
        <div className="flex flex-col gap-[7px] min-w-[150px]">
          <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
            Multiple Version Video Upload
          </h1>
          <p className="font-[Inter-Regular] text-base text-[#706E72]">
            Please upload a file that contains a digital video in 4 formats will
            be extracted from the video.
          </p>
        </div>

        <div className="">
          <Button
            onClick={() => {
              handleVideoModalOpen();
            }}
            className="w-max min-w-[150px]"
          >
            Upload File
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {/** FILM */}
        <div className="flex flex-col gap-[20px]">
          <div className="bg-[#36323E] w-[500px] h-[266px] flex items-center justify-center text-whites-40 font-[Inter-SemiBold] text-base sm:text-lg">
            {" "}
            No Videos Uploaded
          </div>

          
        </div>
      </div>

      {openVideoModal && (
        <MultipleVideoForm
          videoType={videoType}
          film={film}
          handleModalClose={handleVideoModalClose}
          type={type}
          setErrorUpload={setErrorUpload}
          setSucessUpload={setSucessUpload}
          errorUpload={errorUpload}
          sucessUpload={sucessUpload}
        />
      )}
    </div>
  );
};

export default MultipleUploadVideo;

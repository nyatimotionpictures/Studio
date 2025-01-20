import React from "react";
import SingleVideoForm from "./SingleVideoForm";
const resolutions = [
  {
    name: "SD (480P)",
    value: "SD",
    isSelected: true,
  },
  {
    name: "HD (720P)",
    value: "HD",
    isSelected: false,
  },
  {
    name: "FHD (1080P)",
    value: "FHD",
    isSelected: false,
  },
  {
    name: "UHD (2160P)",
    value: "UHD",
    isSelected: false,
  },
];
const SingleUploadVideo = ({
  videoType,
  film,
  type,
  videoPrice,
  setErrorUpload,
  setSucessUpload,
  errorUpload,
  sucessUpload,
}) => {
  const [resolution, setResolution] = React.useState(resolutions[0]);
  const [openVideoModal, setOpenVideoModal] = React.useState(false);
  const handleVideoModalOpen = () => {
    setOpenVideoModal(() => true);
    if (typeof window != "undefined" && window.document) {
      document.body.style.overflow = "hidden";
    }
  };
  const handleVideoModalClose = () => {
    setOpenVideoModal(() => false);
    setErrorUpload(null);
    setSucessUpload(null);
    document.body.style.overflow = "unset";
  };

  React.useEffect(() => {
    resolutions.filter((data) => {
      if (data.value === videoType) {
        setResolution(data);
      }
    });
  }, [videoType]);

  return (
    <div className="flex flex-col  gap-6">
      <div className="flex items-center gap-8 max-w-[80%]">
        <div className="flex flex-col gap-[7px] min-w-[150px]">
          <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
            {resolution.name}
          </h1>
          <p className="font-[Inter-Regular] text-base text-[#706E72]">
            Please upload a file that contains a digital video in{" "}
            {resolution.name} format for optimal playback and compatibility.
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

      <div className="flex flex-wrap gap-3">
        <div className="flex flex-col gap-[20px]">
          <div className="bg-[#36323E] w-[470px] h-[266px] flex "></div>
        </div>
      </div>

      {openVideoModal && (
        <SingleVideoForm
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

export default SingleUploadVideo;

import React from "react";
import CustomStack from "../Stacks/CustomStack";
import { Typography } from "@mui/material";
import Button from "../Buttons/Button";

const UploadVideo = () => {
  return (
    <div className="flex flex-col w-full h-full text-whites-40 gap-6">
      <CustomStack className="z-40 w-full justify-between items-center py-2 sticky top-0">
        <Typography className="font-[Inter-Medium] text-[#fafafa] text-xl">
          New Movie Upload
        </Typography>

        <div className="flex gap-5">
          <Button className="px-5 rounded-lg font-[Inter-Medium] bg-primary-700">
            CANCEL & CLOSE
          </Button>
        </div>
      </CustomStack>

      <CustomStack className="flex flex-col gap-6">
        <Typography className="text-whites-40 font-[Inter-Regular] text-xl">
          Upload Video
        </Typography>

        <CustomStack className="flex flex-col justify-center items-center min-h-[65vh] w-full border-2 rounded-xl border-dashed gap-6">
          <span className="icon-[solar--upload-minimalistic-linear] w-14 h-14 text-[#76757A]"></span>
          <CustomStack className="flex-col gap-2">
            <Typography className="font-[Inter-SemiBold] text-[#76757A] text-lg">
              <span className="text-primary-500">Select a file</span> Drag and
              drop a video files to upload
            </Typography>
            <Typography className="font-[Inter-Regular] text-lg text-[#76757A]">
              Your videos will be private until you publish them.
            </Typography>
          </CustomStack>
        </CustomStack>

        {/** next button */}

        <div className="w-full flex flex-row justify-end">
          <Button className="px-8 rounded-full font-[Inter-Medium]">Next</Button>
        </div>
      </CustomStack>
    </div>
  );
};

export default UploadVideo;

import React, { useEffect, useState } from "react";
import { queryClient } from "../../lib/tanstack";
import socket from "../../lib/socket";

const VideoProcessingStatus = ({ clientId }) => {
  const transcodeKey = `transcode-${clientId}`;
  const uploadKey = `uploading-${clientId}`;
  const [splitProgress, setSplitProgress] = useState(0);
  const [combineProgress, setCombineProgress] = useState(0);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [transcodeProgress, setTranscodeProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [segmentLengths, setSegmentLength] = useState(0);

  useEffect(() => {
    socket.connect();
    socket.emit("joinRoom", clientId);
    socket.on("uploadProgress", ({ content, progress }) => {
      //   localStorage.setItem(uploadKey, {
      //     [content?.resolution]: progress,
      //   });
      setUploadProgress((prev) => ({
        ...prev,
        [content?.resolution]: progress,
      }));
    });

    socket.on("SplittingProgress", ({ progress, stage }) => {
      setSplitProgress((prev) => ({
        ...prev,
        [stage]: progress,
      }));
    });

    socket.on("MergeProgress", ({ resolution, progress, stage }) => {
      console.log("stage", stage);
      setCombineProgress((prev) => ({
        ...prev,
        [resolution]: stage,
      }));
    });

    socket.on("transcodingProgress", ({ resolution, progress, stage, segmentLength }) => {
      // localStorage.setItem(transcodeKey, {
      // //   ...JSON.parse(localStorage.getItem(uploadKey)),
      //   [resolution]: progress,
      // });
      console.log("stage", stage);
      setTranscodeProgress((prev) => ({
        ...prev,
        [resolution]: progress,
      }));

      setSegmentLength((prev) => ({
        ...prev,
        [resolution]: segmentLength,
      }));
    });

    // socket.on("TranscodeProgress", ({ label, customProgress }) => {
    //   localStorage.setItem(transcodeKey, {
    //     ...JSON.parse(localStorage.getItem(uploadKey)),
    //     [content?.resolution]: progress,
    //   });

    //   setTranscodeProgress((prev) => ({
    //     ...prev,
    //     [label]: customProgress,
    //   }));
    // });

    socket.on("JobStarted", () => setStatus("Processing started..."));
    socket.on("JobCompleted", () => {
      setStatus("Processing completed successfully.");
      localStorage.removeItem(uploadKey);
      localStorage.removeItem(transcodeKey);
      queryClient.invalidateQueries({
        queryKey: ["film", clientId],
      });
      queryClient.invalidateQueries({
        queryKey: ["season"],
      });
    });
    socket.on("JobFailed", ({ error }) => setStatus(`Error: ${error}`));

    return () => {
      socket.off("uploadProgress");
      socket.off("TranscodeProgress");
      setTranscodeProgress(0);
      socket.disconnect();
    };
  }, [clientId]);

  return (
    <div>
      {status && (
        <p className="text-base font-[Inter-Bold]">current status: {status}</p>
      )}

      {Object.keys(splitProgress).length > 0 && (
        <div className="w-full max-w-md mt-4">
          <p className="mb-2 font-semibold">File Splitting Progress:</p>
          {Object.entries(splitProgress).map(([stage, progress]) => (
            <div key={stage} className="mb-2">
              <p className="text-sm font-medium">{stage.toUpperCase()}</p>
              <div className="w-full bg-[gray] rounded-full h-4">
                <div
                  className="bg-[green] h-4 rounded-full flex items-center justify-center"
                  style={{ width: `${progress}%` }}
                >
                  <p className="text-sm text-whites-40">{progress}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {Object.keys(transcodeProgress).length > 0 && (
        <div className="w-full max-w-md mt-4">
          <p className="mb-2 font-semibold">Conversion Progress:</p>
          {Object.entries(transcodeProgress).map(([resolution, progress]) => (
            <div key={resolution} className="mb-2">
              <p className="text-sm font-medium text-whites-40">{resolution.toUpperCase()}- {segmentLengths[resolution]}</p>
              <div className="w-full bg-[gray] rounded-full h-4">
                <div
                  className="bg-[green] h-4 rounded-full flex items-center justify-center"
                  style={{ width: `${progress}%` }}
                >
                  <p className="text-sm text-whites-40">{progress}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {Object.keys(combineProgress).length > 0 && (
        <div className="w-full max-w-md mt-4">
          <p className="mb-2 font-semibold">Combine Segment Progress:</p>
          {Object.entries(combineProgress).map(([resolution, stage]) => (
            <div key={resolution} className="mb-2">
              <p className="text-sm font-medium text-whites-40 uppercase">{resolution.toUpperCase()}- {stage}</p>
              
            </div>
          ))}
        </div>
      )}

      {/** resolution upload progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="w-full max-w-md mt-4">
          <p className="mb-2 font-semibold">Resolution Upload Progress:</p>
          {Object.entries(uploadProgress).map(([resolution, progress]) => (
            <div key={resolution} className="mb-2">
              <p className="text-sm font-medium">{resolution.toUpperCase()}</p>
              <div className="w-full bg-[gray] rounded-full h-4">
                <div
                  className="bg-[green] h-4 rounded-full flex items-center justify-center"
                  style={{ width: `${progress}%` }}
                >
                  <p className="text-sm text-whites-40">{progress}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoProcessingStatus;

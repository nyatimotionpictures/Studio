import React from 'react'

const FilmPreview = ({ filed }) => {
  const [preview, setPreview] = React.useState(null);
  const [videoLoading, setVideoLoading] = React.useState(true)
  
  let reader = new FileReader();
  console.log("type", filed)
      reader.readAsDataURL(filed);
        reader.onload = () => {
          //console.log("readerResult",filed, reader.result);
          setTimeout(()=>{setVideoLoading(()=> false)}, 5000)
        setPreview(reader.result);
      };

 
  return (
    <div className="w-full h-full relative bg-primary-50 border-2 rounded-lg">
      {preview === null && videoLoading ? (
        <div className="h-full w-full absolute top-0 rounded-lg ">
          loading video....
        </div>
      ) : null}
      {preview !== null && (
        <video
          width="100%"
          height="100%"
          controls
          src={preview !== null ? preview : ""}
        >
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default FilmPreview
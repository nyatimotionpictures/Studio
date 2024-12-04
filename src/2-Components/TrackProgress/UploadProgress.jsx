import React, { useEffect } from 'react'

const UploadProgress = ({url}) => {
    const [progress, setProgress] = React.useState(0);

    useEffect(() => {  
        const eventSource = new EventSource(url);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("data", data)
            setProgress(data.progress);
        };

        return () => {
            eventSource.close();
        };
    },   [url]);

    console.log("progress", progress)
  return (
    <div className='text-whites-40 text-lg'>UploadProgress: {progress} %</div>
  )
}

export default UploadProgress
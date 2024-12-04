import React from 'react'
import Button from '../Buttons/Button'

import Thumbnails from '../Forms/Thumbnails';
import ViewThumbnails from '../ViewForms/ViewThumbnails';

const ThumbnailTab = ({film, type}) => {
  const [editing, setEditing] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState(null);
  const formRef = React.useRef();


  //mutation for update

  const handleEditing = () => {
    setEditing(() => !editing)
  }



  const handleAPISubmission = (editInfo) => {
    //alert(`form submitted ${editInfo.title}`);
   // handleEditing()
  }
  return (
    <div className="flex relative flex-col gap-6 pt-4">
      {
        editing ? (
          <div >
            <Thumbnails innerref={formRef} handleStepNext={handleAPISubmission}   editdata={true} film={film} type={type} />  
          </div>
        ) : (<div>
          <ViewThumbnails film={film} type={type} />
        </div>)
      }
    


      {/** Buttons */}
      {
        editing ? (<div className="flex gap-4 justify-end border-t border-t-[#FFFAF6] border-opacity-40 pt-6">
          <Button onClick={handleEditing} className="w-max min-w-[150px] px-4 rounded-full bg-secondary-300 ">Back</Button>
          {/* <Button onClick={handleFormSubmit} className="w-max min-w-[150px] px-4 rounded-full">Save & Close form</Button> */}
        </div>) : (<div className="flex justify-end border-t border-t-[#FFFAF6] border-opacity-40 pt-6"><Button onClick={handleEditing} className="w-max min-w-[150px] px-4 rounded-full ">Edit Details</Button></div>)
      }
    </div>
  )
}

export default ThumbnailTab
import React from 'react'
import Button from '../Buttons/Button'
import Audience from '../Forms/Audience';
import ViewAudienceDetails from '../ViewForms/ViewAudienceDetails';

const AudienceTab = () => {
  const [editing, setEditing] = React.useState(false);
  const formRef = React.useRef();

  const handleEditing = () => {
    setEditing(() => !editing)
  }

  const handleFormSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    } else {
      alert("No form")
    }
  };

  const handleAPISubmission = (editInfo) => {
    alert(`form submitted ${editInfo.title}`);
    handleEditing()
  }
  return (
    <div className="flex relative flex-col gap-6 pt-4">
      {
        editing ? (
          <div >
            <Audience innerref={formRef} handleStepNext={handleAPISubmission} />
          </div>
        ) : (<div>
          <ViewAudienceDetails />
        </div>)
      }
      {/**FORM**/}
      {/** VIEW DETAILS */}


      {/** Buttons */}
      {
        editing ? (<div className="flex gap-4 justify-end border-t border-t-[#FFFAF6] border-opacity-40 pt-6">
          <Button onClick={handleEditing} className="w-max min-w-[150px] px-4 rounded-full bg-secondary-300 ">Back</Button>
          <Button onClick={handleFormSubmit} className="w-max min-w-[150px] px-4 rounded-full">Save & Close form</Button>
        </div>) : (<div className="flex justify-end border-t border-t-[#FFFAF6] border-opacity-40 pt-6"><Button onClick={handleEditing} className="w-max min-w-[150px] px-4 rounded-full ">Edit Details</Button></div>)
      }
    </div>
  )
}

export default AudienceTab
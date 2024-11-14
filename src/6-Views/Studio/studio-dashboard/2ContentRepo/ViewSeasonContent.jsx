import React from 'react'
import Sidebar from '../../../../2-Components/Navigation/Sidebar'
import CustomStack from '../../../../2-Components/Stacks/CustomStack'
import { Typography } from '@mui/material'
import Button from '../../../../2-Components/Buttons/Button.tsx'
import posterImage from "../../../../1-Assets/Posterimage.png"
import EpisodesListTable from '../../../../2-Components/Tables/EpisodesListTable.jsx'
import EditSeasonForm from '../../../../2-Components/Forms/EditSeasonForm.jsx'
import NewEpisodeForm from '../../../../2-Components/Forms/NewEpisodeForm.jsx'

const ViewSeasonContent = () => {
  const [editSeason, setEditSeason] = React.useState(false)
  const [newEpisode, setNewEpisode] = React.useState(false)
  const handleEditSeason = () => {
    setEditSeason(() => !editSeason)
  }

  const handleNewEpisode = () => {
    setNewEpisode(() => !newEpisode)
  }
  const formRef = React.useRef();

  const handleNewSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    } else {
      alert("No form")
    }
  };

  const handleNewAPISubmission = (editInfo) => {
    alert(`form submitted ${editInfo.title}`);
    // handleEditing()
  }

  const handleEditSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    } else {
      alert("No form")
    }
  };

  const handleEditAPISubmission = (editInfo) => {
    alert(`form submitted ${editInfo.title}`);
    // handleEditing()
  }

  return (
    <div className="max-h-screen h-[100vh] w-full flex flex-col bg-whites-900 relative">
      <div className="grid grid-cols-[auto,1fr] flex-grow-1 relative overflow-auto">
        {/** side bar */}
        <Sidebar />
        {/** content */}
        <div className="bg-[#24222a] min-h-[100vh] flex-1 px-10 overflow-auto">
          {/** title */}
          <CustomStack className="bg-[#24222a] z-50 w-full justify-between items-start py-6 sticky gap-1 top-0 flex-col ">

            <div className="flex flex-row items-center gap-9">
              <Typography className="font-[Inter-Medium] text-[#fafafa] text-xl">
                Tuko Pamoja
              </Typography>

              <div className=" font-[Inter-Medium] select-none  text-xs flex w-max h-max text-primary-500 px-2 py-1 border border-primary-500 rounded-lg bg-secondary-800 ">TV Series</div>
            </div>

            <div className="">
              <ul className="font-[Inter-Regular] text-[#FFFAF6] flex list-disc w-full space-x-8 text-base flex-wrap gap-y-3 items-start justify-start">
                <li className="w-max list-none">TV Show </li>
                <li className="w-max">2010 </li>
              </ul>
            </div>

            <div className="absolute right-0">
              <Button
                onClick={() => handleEditSeason()}
                className="flex items-center gap-2 w-max bg-primary-500 bg-opacity-40 rounded-lg px-4"
              >
                <span className="icon-[solar--pen-new-square-linear] w-4 h-4"></span>
                <Typography className="font-[Inter-SemiBold]">Edit Season Details</Typography>
              </Button>
            </div>
          </CustomStack>

          {/** Movie Details & Tabs  */}
          <div className="pt-7 pb-11 ">
            {/** Movie details */}
            <div className="flex flex-row gap-4">
              {/** image */}

              <img src={posterImage} alt="" className="w-[210.15px] h-[272.5px]" />

              <div className="flex flex-col max-w-[640px] gap-6">
                <h1 className="font-[Inter-Regular] text-sm text-[#FFFAF6] text-opacity-70">A group of young men (Itwara Anthony, Kafuruka Peter, Collin Asiimwe and Godfrey K.) in rural Ugandan town decide to be more involved in the political process after their football pitch has been allocated to a private investor with the help of their local councillor. They take advantage of the upcoming by-election to find a candidate to save their football pitch. The club captain, Kato (Peter </h1>
                <div className="flex flex-wrap gap-3">
                  {[...Array(5)].map((data, index) => {
                    return (
                      <div key={index} className="flex py-1 px-5 bg-[#D9D9D9] bg-opacity-15 rounded-full ring-1 ring-[#FFFFFE] text-whites-50">Drama</div>
                    )
                  })}
                </div>

              </div>
            </div>

            <div className="mt-7">
              <EpisodesListTable handleNewEpisode={handleNewEpisode} />
            </div>
          </div>
        </div>
      </div>

      {/** Popup for Edit Series Details */}
      {
        editSeason && (
          <CustomStack
            className="relative z-50"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="false"
          >
            <div className="fixed inset-0 border rounded-xl bg-secondary-50 bg-opacity-75 transition-opacity"></div>

            <div className="fixed inset-0 z-50 bg-primary-200 bg-opacity-10 overflow-hidden">
              <div className="relative transform overflow-y-auto rounded-lg bg-secondary-400 h-screen text-left shadow-xl transition-all">
                <div className="bg-secondary-900 px-16 pt-0 min-h-screen h-max">


                  {/** Edit forms  */}
                  <div className="flex flex-col w-full h-full text-whites-40 gap-6 relative">
                    <CustomStack className="z-50 w-full justify-between items-center py-2 pt-7 sticky top-0 bg-secondary-900">
                      <Typography className="font-[Inter-Medium] text-[#fafafa] text-xl">
                        Edit Season Details
                      </Typography>

                      <div className="flex gap-5">
                        <Button onClick={handleEditSeason} className="px-5 rounded-lg font-[Inter-Medium] bg-primary-700">
                          CANCEL & CLOSE
                        </Button>
                      </div>
                    </CustomStack>

                    {/** stepper show case */}

                    {/** form */}
                    <div className="block mb-3 h-full">
                      <EditSeasonForm innerref={formRef} handleStepNext={handleEditAPISubmission} />
                    </div>

                    {/** stepper control */}
                    <div className="border-t-2 border-t-secondary-500 relative">
                      <div className="container flex items-center justify-end mt-4 mb-8 gap-[20px]">

                        <Button onClick={handleEditSubmit} className="w-max min-w-[150px] px-5 rounded-lg ">Save & Close form</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CustomStack>
        )
      }

      {/** Popup for New Season */}
      {
        newEpisode && (
          <CustomStack
            className="relative z-50"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="false"
          >
            <div className="fixed inset-0 border rounded-xl bg-secondary-50 bg-opacity-75 transition-opacity"></div>

            <div className="fixed inset-0 z-50 bg-primary-200 bg-opacity-10 overflow-hidden">
              <div className="relative transform overflow-y-auto rounded-lg bg-secondary-400 h-screen text-left shadow-xl transition-all">
                <div className="bg-secondary-900 px-16 pt-0 min-h-screen h-max">


                  {/** Edit forms  */}
                  <div className="flex flex-col w-full h-full text-whites-40 gap-6 relative">
                    <CustomStack className="z-50 w-full justify-between items-center py-2 pt-7 sticky top-0 bg-secondary-900">
                      <Typography className="font-[Inter-Medium] text-[#fafafa] text-xl">
                        Add New Episode
                      </Typography>

                      <div className="flex gap-5">
                        <Button onClick={handleNewEpisode} className="px-5 rounded-lg font-[Inter-Medium] bg-primary-700">
                          CANCEL & CLOSE
                        </Button>
                      </div>
                    </CustomStack>

                    {/** stepper show case */}

                    {/** form */}
                    <div className="block mb-3 h-full">
                      <NewEpisodeForm innerref={formRef} handleStepNext={handleNewAPISubmission} />
                    </div>

                    {/** stepper control */}
                    <div className="border-t-2 border-t-secondary-500 relative">
                      <div className="container flex items-center justify-end mx-0  mt-4 mb-8 ">
                        <Button onClick={handleNewSubmit} className="w-max min-w-[150px] px-5 rounded-lg">Save & Close form</Button> </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CustomStack>
        )
      }
    </div>
  )
}

export default ViewSeasonContent
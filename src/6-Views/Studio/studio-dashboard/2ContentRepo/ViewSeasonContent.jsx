import React from 'react'
import Sidebar from '../../../../2-Components/Navigation/Sidebar'
import CustomStack from '../../../../2-Components/Stacks/CustomStack'
import { Alert, Snackbar, Typography } from '@mui/material'
import Button from '../../../../2-Components/Buttons/Button.tsx'
import posterImage from "../../../../1-Assets/Posterimage.png"
import EpisodesListTable from '../../../../2-Components/Tables/EpisodesListTable.jsx'
import EditSeasonForm from '../../../../2-Components/Forms/EditSeasonForm.jsx'
import NewEpisodeForm from '../../../../2-Components/Forms/NewEpisodeForm.jsx'
import SeasonTabs from '../../../../2-Components/Tabs/SeasonTabs.jsx'
import { useGetFilm } from '../../../../5-Store/TanstackStore/services/queries.ts'
import { useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { createNewEpisode } from '../../../../5-Store/TanstackStore/services/api.ts'
import { queryClient } from '../../../../lib/tanstack.ts'

const ViewSeasonContent = () => {
  const [editSeason, setEditSeason] = React.useState(false)
  const [newEpisode, setNewEpisode] = React.useState(false)
  const [seasonData, setSeasonData] = React.useState(null)
  const [snackbarMessage, setSnackbarMessage] = React.useState(null);

  let params = useParams();
  const [filmId, setFilmId] = React.useState(null);
  const filmsQuery = useGetFilm(params?.id);

  React.useEffect(() => {
    //setFilmId()
    setFilmId(()=> params?.id)
    if (params?.seasonId) {
      const filterSeason = filmsQuery.data?.film?.season?.filter((data) => data.id === params?.seasonId);
      setSeasonData(() => filterSeason?.length > 0 ? filterSeason[0] : null)
     // console.log("seasonData", seasonData)
    } else {
      setSeasonData(() => null)
    }
}, [filmsQuery.data?.film?.id,filmsQuery.data?.film?.season, params?.seasonId]);



const newEpisodeMutation = useMutation(
    {
        mutationFn: createNewEpisode,
        onSuccess: async (data)=> {
            setSnackbarMessage({message: data.message, severity: "success"});
            await queryClient.invalidateQueries({ queryKey: ["film", filmsQuery?.data?.film?.id] });
            handleNewEpisode()
        },
        onError: (error) => {
            setSnackbarMessage({message: error.message, severity: "error"});
        }
    }
)

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
   let values = {
    ...editInfo,
    seasonId: seasonData.id,
   }
    newEpisodeMutation.mutate(values)
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
               Season/Segment: {seasonData?.title}
              </Typography>

            
            </div>

            <div className="">
              <ul className="font-[Inter-Regular] text-[#FFFAF6] flex list-disc w-full space-x-8 text-base flex-wrap gap-y-3 items-start justify-start">
                <li className="w-max list-none">{filmsQuery.data?.film?.title} </li>
                <li className="w-max">{filmsQuery.data?.film?.yearOfProduction} </li>
                
              </ul>
            </div>
          </CustomStack>

          {/** Movie Details & Tabs  */}
          <div className="pt-7 pb-11 ">
          

            <div className="mt-0">
              {/* <EpisodesListTable handleNewEpisode={handleNewEpisode} /> */}
              <SeasonTabs handleNewEpisode={handleNewEpisode} film={filmsQuery.data?.film} season={seasonData}  />
            </div>
          </div>
        </div>
      </div>



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
                      <NewEpisodeForm innerref={formRef} handleStepNext={handleNewAPISubmission} seasonId={params?.seasonId} />
                    </div>

                    {/** stepper control */}
                    <div className="border-t-2 border-t-secondary-500 relative">
                      <div className="container flex items-center justify-end mx-0  mt-4 mb-8 ">
                        {
                          newEpisodeMutation.isPending ? (
                        <Button
                          disabled
                          className="w-max min-w-[150px] px-5 rounded-lg"
                        >
                          Submitting...
                        </Button>
                        ) : (
                          <Button onClick={handleNewSubmit} className="w-max min-w-[150px] px-5 rounded-lg">Save & Close form</Button>     
                        )
                    }
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CustomStack>
        )
      }

      {/** snackbar */}
      <Snackbar
        open={snackbarMessage !== null}
        autoHideDuration={6000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbarMessage?.severity} variant="filled">
          {snackbarMessage?.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default ViewSeasonContent
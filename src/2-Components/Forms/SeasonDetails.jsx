import React from 'react'
import { useParams } from 'react-router-dom';
import { useUpdateFilm } from '../../5-Store/TanstackStore/services/mutations';
import { Alert, Snackbar } from '@mui/material';
import Button from '../Buttons/Button';
import ViewSeasonDetails from '../ViewForms/ViewSeasonDetails';
import EditSeasonForm from './EditSeasonForm';
import { useMutation } from '@tanstack/react-query';
import { updateSeason } from '../../5-Store/TanstackStore/services/api';
import { queryClient } from '../../lib/tanstack';

const SeasonDetails = ({film, season}) => {
    const [editing, setEditing] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState(null);
  let params = useParams();

   //mutation for update film
   const updateSeasonMutation = useMutation(
    {
      mutationFn: updateSeason,
      onSuccess: async (data) => {
        console.log("success", data);
        setSnackbarMessage({ message: data.message, severity: "success" });
        await queryClient.invalidateQueries({ queryKey: ["film", film?.id] });
        handleEditing();
      },
      onError: (error) => {
       
        setSnackbarMessage({
          message: "error updating season",
          severity: "error",
        });
      },
    }
   );
   const formRef = React.useRef();
 
   const handleEditing = () => {
     setEditing(() => !editing);
   };
 
   const handleFormSubmit = () => {
     if (formRef.current) {
       formRef.current.handleSubmit();
     } else {
       alert("No form");
     }
   };

   const handleAPISubmission = (editInfo) => {
    updateSeasonMutation.mutate(editInfo);
  };
  return (
    <div className="flex relative flex-col gap-6 pt-4">
      {editing ? (
        <div>
          <EditSeasonForm innerref={formRef}
            handleStepNext={handleAPISubmission}
            editdata={true}
            film={film} season={season} />
            
        </div>
      ) : (
        <div>
          <ViewSeasonDetails film={film} season={season} />
         
        </div>
      )}

      {/** Buttons */}
      {editing ? (
        <div className="flex gap-4 justify-end border-t border-t-[#FFFAF6] border-opacity-40 pt-6">
          <Button
            onClick={handleEditing}
            className="w-max min-w-[150px] px-4 rounded-full bg-secondary-300 "
          >
            Back
          </Button>
          {
            updateSeasonMutation.isPending ? (
              <Button
                disabled
                className="w-max min-w-[150px] px-4 rounded-full"
              >
                Submitting...
              </Button>
            ) : (
              <Button
              onClick={handleFormSubmit}
              className="w-max min-w-[150px] px-4 rounded-full"
            >
              Save & Close form
            </Button>
            )
          }
          
        </div>
      ) : (
        <div className="flex justify-end border-t border-t-[#FFFAF6] border-opacity-40 pt-6">
          <Button
            onClick={handleEditing}
            className="w-max min-w-[150px] px-4 rounded-full "
          >
            Edit Details
          </Button>
        </div>
      )}

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
  );
}

export default SeasonDetails
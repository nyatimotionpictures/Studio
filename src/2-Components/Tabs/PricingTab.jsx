import { useMutation } from '@tanstack/react-query';
import React from 'react'
import { useParams } from 'react-router-dom';
import { updateSeason } from '../../5-Store/TanstackStore/services/api';
import EditPricingForm from '../Forms/EditPricingForm';
import ViewPricingDetails from '../ViewForms/ViewPricingDetails';
import Button from '../Buttons/Button';
import { Alert, Snackbar } from '@mui/material';

const PricingTab = ({film, season}) => {
  const [editing, setEditing] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState(null);
  let params = useParams();

  const updateSeasonMutation = useMutation(
    {
      mutationFn: updateSeason,
      onSuccess: async (data) => {
        console.log("success", data);
        setSnackbarMessage({ message: data.message, severity: "success" });
        await queryClient.invalidateQueries({ queryKey: ["film", params?.id] });
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

  return <div className='flex relative flex-col gap-6'>
    {editing ? (
      <div>
        <EditPricingForm innerref={formRef}
          handleStepNext={handleAPISubmission}
          editdata={true}
          film={film} season={season} />
          
      </div>
    ) : (
      <div>
        <ViewPricingDetails film={film} season={season} />
       
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
          Edit Pricing
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
  </div>;
}

export default PricingTab
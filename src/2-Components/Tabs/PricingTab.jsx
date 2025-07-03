import { useMutation } from '@tanstack/react-query';
import React from 'react'
import { useParams } from 'react-router-dom';
import { createPrice, updatePrice, updateSeason } from '../../5-Store/TanstackStore/services/api';
import EditPricingForm from '../Forms/EditPricingForm';
import ViewPricingDetails from '../ViewForms/ViewPricingDetails';
import Button from '../Buttons/Button';
import { Alert, Snackbar } from '@mui/material';
import { queryClient } from '../../lib/tanstack';

const PricingTab = ({film, type}) => {
  const [editing, setEditing] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState(null);
  const [pricingData, setPricingData] = React.useState(null);
  const [pricingSD, setPricingSD] = React.useState(null);
  const [pricingHD, setPricingHD] = React.useState(null);
  const [pricingFHD, setPricingFHD] = React.useState(null);
  const [pricingUHD, setPricingUHD] = React.useState(null);

  let params = useParams();

  const createPriceMutation = useMutation(
    {
      mutationFn: createPrice,
      onSuccess: async (data) => {
        console.log("success", data);
        setSnackbarMessage({ message: data.message, severity: "success" });
        await queryClient.invalidateQueries({ queryKey: ["film", params?.id] });
        handleEditing();
      },
      onError: (error) => {
       
        setSnackbarMessage({
          message: error?.message,
          severity: "error",
        });
      },
    }
   );

   const updatePriceMutation = useMutation(
    {
      mutationFn: updatePrice,
      onSuccess: async (data) => {
        console.log("success", data);
        setSnackbarMessage({ message: data.message, severity: "success" });
        await queryClient.invalidateQueries({ queryKey: ["film", params?.id] });
        handleEditing();
      },
      onError: (error) => {
       
        setSnackbarMessage({
          message: error?.message,
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
        if (editInfo?.id !== null) {
          updatePriceMutation.mutate(editInfo);
        } else {
          createPriceMutation.mutate(editInfo);
        }
      };

      React.useEffect(() => {
        
        if(type !== "season"){
            if (film?.pricing?.length > 0) {
              let data = film?.pricing[0]
              data?.priceList?.filter((data) => {
                if(data.resolution === "SD"){
                 setPricingSD(() => data)
                } else if(data.resolution === "HD"){
                  setPricingHD(() => data)
                } else if(data.resolution === "FHD"){
                  setPricingFHD(() => data)
                } else if(data.resolution === "UHD"){
                  setPricingUHD(() => data)
                }
              })
              
              setPricingData(() => data)
            } else {
              setPricingData(() => null)
            }
        }else {

      
          if (film?.pricing?.length > 0) {
            let data = film?.pricing[0]
            data?.priceList?.filter((data) => {
              if(data.resolution === "SD"){
               setPricingSD(() => data)
              } else if(data.resolution === "HD"){
                setPricingHD(() => data)
              } else if(data.resolution === "FHD"){
                setPricingFHD(() => data)
              } else if(data.resolution === "UHD"){
                setPricingUHD(() => data)
              }
            })
            setPricingData(() => data)
          } else {
            setPricingData(() => null)
          }
        }
      },[film]);

  return <div className='flex relative flex-col gap-6'>
    {editing ? (
      <div>
        <EditPricingForm innerref={formRef}
          handleStepNext={handleAPISubmission}
          editdata={true}
          film={film} season={film} type={type} pricingData={pricingData} pricingSD={pricingSD} pricingHD={pricingHD} pricingFHD={pricingFHD} pricingUHD={pricingUHD} />
          
      </div>
    ) : (
      <div>
        <ViewPricingDetails film={film} season={film} pricingData={pricingData} pricingSD={pricingSD} pricingHD={pricingHD} pricingFHD={pricingFHD} pricingUHD={pricingUHD} />
       
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
          createPriceMutation.isPending || updatePriceMutation.isPending ? (
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
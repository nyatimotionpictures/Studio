import React from "react";
import Button from "../Buttons/Button";
import ContentDetails from "../Forms/ContentDetails";
import ViewContentDetails from "../ViewForms/ViewContentDetails";
import { useParams } from "react-router-dom";
import { useGetFilm } from "../../5-Store/TanstackStore/services/queries";
import { useUpdateFilm } from "../../5-Store/TanstackStore/services/mutations";
import { Alert, Snackbar } from "@mui/material";
import NewEpisodeForm from "../Forms/NewEpisodeForm";
import ViewEpisodeData from "../ViewForms/ViewEpisodeData";
import { updateFilmContent } from "../../5-Store/TanstackStore/services/api";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../lib/tanstack";

const ContentTab = ({ film, type }) => {
  const [editing, setEditing] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState(null);
  let params = useParams();

  //mutation for update film
  //updateFilmContent
  const updateFilmMutation = useMutation(
    {
      mutationFn: updateFilmContent,
      onSuccess: async (data) => {
        console.log("success", data);
        setSnackbarMessage({ message: data.message, severity: "success" });
        await queryClient.invalidateQueries({ queryKey: ["film", data?.film?.id] });
        handleEditing();
      },
      onError: (error) => {
        console.log("error", error);
        setSnackbarMessage({
          message: "error updating film",
          severity: "error",
        });
      }
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
    updateFilmMutation.mutate(editInfo);
  };
  return (
    <div className="flex relative flex-col gap-6 pt-4">
      {editing ? (
        <div>
          {
            type === "episode" ?  <NewEpisodeForm
              innerref={formRef}
              handleStepNext={handleAPISubmission}
              editdata={true}
              film={film}
            />   : <ContentDetails
            innerref={formRef}
            handleStepNext={handleAPISubmission}
            editdata={true}
            film={film}
            type={type}
          />
          }
          
        </div>
      ) : (
        <div>
          {
            type === "episode" ? <ViewEpisodeData film={film} /> : <ViewContentDetails film={film} />
          }
        </div>
      )}
      {/**FORM**/}
      {/** VIEW DETAILS */}

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
            updateFilmMutation.isPending ? (
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
};

export default ContentTab;

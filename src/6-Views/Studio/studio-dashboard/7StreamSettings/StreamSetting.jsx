import React from 'react'
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../../../2-Components/Navigation/Sidebar";
import CustomStack from "../../../../2-Components/Stacks/CustomStack";
import { Alert, Snackbar, Typography } from "@mui/material";
import CategoryTable from '../../../../2-Components/Tables/CategoryTable';
import Button from '../../../../2-Components/Buttons/Button';
import NewCategoryForm from '../../../../2-Components/Forms/NewCategoryForm';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../../lib/tanstack';
import { useGetAllFilms } from '../../../../5-Store/TanstackStore/services/queries';

const StreamSetting = () => {
    const [openCategoryModal, setOpenCategoryModal] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState(null);

    //const [openFilmModal, setOpenFilmModal] = React.useState(false);
    const formRef = React.useRef();

    const filmsQuery =  useGetAllFilms();
    

    const genreOptions = React.useMemo(() => {
        let arrayGenres = filmsQuery.data?.films?.map((data)=>data.genre).flat();
        return [...new Set(arrayGenres)];
    }, [filmsQuery?.data]);

    const serieOptions = React.useMemo(() => {
   
        return  filmsQuery.data?.films?.filter((data)=>data.type === "series" && data ).flat();
    }, [filmsQuery?.data]);

    const moviesOptions = React.useMemo(() => {
   
        return  filmsQuery.data?.films?.filter((data)=>data.type === "movie" || data?.type?.includes("film") && data ).flat();
    }, [filmsQuery?.data]);

    const mixedOptions = React.useMemo(() => {
   
        return  filmsQuery.data?.films?.filter((data)=> data ).flat();
    }, [filmsQuery?.data]);


        /** use mutation: create new season */
        const createMutation = useMutation(
            {
               // mutationFn: createNewSeason,
                onSuccess: async (data)=> {
                    setSnackbarMessage({message: data.message, severity: "success"});
                    await queryClient.invalidateQueries({ queryKey: ["film", filmsQuery?.data?.film?.id] });
                    handleNewSeason()
                },
                onError: (error) => {
                    setSnackbarMessage({message: error.message, severity: "error"});
                }
            }
        )


    const handleCategoryModalOpen = () => {
        setOpenCategoryModal(() => true);
    if (typeof window != "undefined" && window.document) {
      document.body.style.overflow = "hidden";
    }
  };
  const handleCategoryModalClose = () => {
    setOpenCategoryModal(() => false);
    document.body.style.overflow = "unset";
  };    

  const handleNewAPISubmission = (values) => {
    //  alert(`form submitted ${editInfo.title}`);
    //createMutation.mutate(values)
     // handleEditing()
  }

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    } else {
      alert("No form")
    }
  };

  return (
    <div className="max-h-screen h-[100vh] w-full flex flex-col bg-whites-900 relative">
      <div className="grid grid-cols-[auto,1fr] flex-grow-1 relative overflow-auto">
        {/** side bar */}

        <Sidebar />
        <div className="bg-[#24222a] min-h-[100vh] flex-1 px-10 overflow-auto">
          {/** title */}
          <CustomStack className="bg-[#24222a] z-50 w-full justify-between items-start py-6 sticky top-0 flex-row">
            <div className="flex flex-row items-center gap-9">
              <Typography className="font-[Inter-Medium] text-[#fafafa] text-xl">
                Content Categories
              </Typography>
            </div>

            <div className="flex gap-5">
              <Button
                onClick={handleCategoryModalOpen}
                className="px-5 rounded-lg font-[Inter-Medium]"
              >
                Add Category
              </Button>
            </div>
          </CustomStack>

          {/** account tabs */}

          <div className="pt-7 pb-11 ">

            <CategoryTable />
          </div>
        </div>
      </div>


        {/** Popup for New Season */}
        {
              openCategoryModal && (
                  <CustomStack
                      className="relative z-50"
                      aria-labelledby="modal-title"
                      role="dialog"
                      aria-modal="false"
                  >
                      <div className="fixed inset-0 border rounded-xl bg-secondary-500 bg-opacity-75 transition-opacity"></div>

                      <div className="fixed inset-0 z-50 bg-primary-200 bg-opacity-10 overflow-hidden">
                          <div className="relative transform overflow-y-auto rounded-lg  bg-opacity-20 flex items-center justify-center h-screen text-left shadow-xl transition-all">

                              <div className="bg-secondary-900 px-16 pt-0 w-full max-w-[700px] rounded-lg  h-max">
                                  {/** Edit forms  */}
                                  <div className="flex flex-col w-full h-full text-whites-40 gap-6 relative">
                                      <CustomStack className="z-50 w-full justify-between items-center py-2 pt-7 sticky top-0 bg-secondary-900">
                                          <Typography className="font-[Inter-Medium] text-[#fafafa] text-xl">
                                              Add New Category
                                          </Typography>

                                         
                                      </CustomStack>

                                      {/** stepper show case */}

                                      {/** form */}
                                      <div className="block mb-3 h-full">
                                          <NewCategoryForm innerref={formRef} handleStepNext={handleNewAPISubmission} genreOptions={genreOptions} serieOptions={serieOptions} moviesOptions={moviesOptions} mixedOptions={mixedOptions}   />
                                      </div>

                                      {/** stepper control */}
                                      <div className="border-t-2 border-t-secondary-500 relative">
                                          <div className="container flex items-center justify-end mx-0  mt-4 mb-8 ">
                                            {
                                                createMutation.isPending ? (
                                                <Button
                                                  disabled
                                                  className="w-max min-w-[150px] px-5 rounded-lg"
                                                >
                                                  Submitting...
                                                </Button>
                                                ) : (
                                                    <div className="container flex flex-row gap-2 items-center justify-end mx-0  mt-4 mb-8 ">
                                                         <Button onClick={handleCategoryModalClose} className="w-max min-w-[150px] px-5 bg-transparent border border-primary-500 rounded-lg">Cancel</Button>  
                                                     <Button onClick={handleSubmit} className="w-max min-w-[150px] px-5 rounded-lg">Save form</Button>  
                                                    
                                                    </div>
                                                      
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
  );
}

export default StreamSetting
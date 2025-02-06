import React from "react";
import SuccessErrorModal from "../../../../2-Components/Modals/SuccessErrorModal";
import { Typography } from "@mui/material";
import CustomStack from "../../../../2-Components/Stacks/CustomStack";
import Sidebar from "../../../../2-Components/Navigation/Sidebar";
import { useParams } from "react-router-dom";
import { useGetAllFilms, useGetSingleCategory } from "../../../../5-Store/TanstackStore/services/queries";
import CustomLoader from "../../../../2-Components/Loader/CustomLoader";
import { FormContainer } from "../../../../2-Components/Stacks/InputFormStack";
import Button from "../../../../2-Components/Buttons/Button";
import { useMutation } from "@tanstack/react-query";
import EditCategoryNameForm from "../../../../2-Components/Forms/EditCategoryNameForm";
import {
    addFilmToCategory,
  removeFilmonCategory,
  updateCategory,
} from "../../../../5-Store/TanstackStore/services/api";
import { queryClient } from "../../../../lib/tanstack";
import AddFilmCategory from "../../../../2-Components/Forms/AddFilmCategory";

const ViewCategory = () => {
  const [snackbarMessage, setSnackbarMessage] = React.useState(null);
  const [openNameEditModal, setOpenNameEditModal] = React.useState(false);
  const [openFilmAddModal, setOpenFilmAddModal] = React.useState(false);

  const [filmDeleteId, setFilmDeleteId] = React.useState(null);
  let params = useParams();
  const formRef = React.useRef();

  let categoryQuery = useGetSingleCategory(params?.id);
  const filmsQuery = useGetAllFilms();

  console.log("categoryQuery", categoryQuery?.data?.category);


  const genreOptions = React.useMemo(() => {
      let arrayGenres = filmsQuery.data?.films?.map((data) => data.genre).flat();
      return [...new Set(arrayGenres)];
    }, [filmsQuery?.data]);
  
    const serieOptions = React.useMemo(() => {
      return filmsQuery.data?.films
        ?.filter((data) => data.type === "series" && data)
        .flat();
    }, [filmsQuery?.data]);
  
    const moviesOptions = React.useMemo(() => {
      return filmsQuery.data?.films
        ?.filter(
          (data) =>
            data.type === "movie" || (data?.type?.includes("film") && data)
        )
        .flat();
    }, [filmsQuery?.data]);
  
    const mixedOptions = React.useMemo(() => {
      return filmsQuery.data?.films?.filter((data) => data).flat();
    }, [filmsQuery?.data]);

  /** use mutation: add film to category */
  const addFilmMutation = useMutation({
    mutationFn: addFilmToCategory,
    onSuccess: async (data) => {
      setSnackbarMessage({ message: data.message, severity: "success" });
      await queryClient.invalidateQueries({
        queryKey: ["category", params?.id],
      });
      handleAddModalClose();
    },
    onError: (error) => {
      setSnackbarMessage({ message: error.message, severity: "error" });
    },
  });

  const handleAddModalOpen = () => {
    setOpenFilmAddModal(() => true);
    if (typeof window != "undefined" && window.document) {
      document.body.style.overflow = "hidden";
    }
  };
  const handleAddModalClose = () => {
    setOpenFilmAddModal(() => false);
    document.body.style.overflow = "unset";
  };

  const handleAddAPISubmission = (values) => {
    //  alert(`form submitted ${editInfo.title}`);
    addFilmMutation.mutate(values);
    // handleEditing()
  };

  /** use mutation: edit category name */
  const editMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: async (data) => {
      setSnackbarMessage({ message: data.message, severity: "success" });
      await queryClient.invalidateQueries({
        queryKey: ["category", params?.id],
      });
      handleEditModalClose();
    },
    onError: (error) => {
      setSnackbarMessage({ message: error.message, severity: "error" });
    },
  });

  const handleEditModalOpen = () => {
    setOpenNameEditModal(() => true);
    if (typeof window != "undefined" && window.document) {
      document.body.style.overflow = "hidden";
    }
  };
  const handleEditModalClose = () => {
    setOpenNameEditModal(() => false);
    document.body.style.overflow = "unset";
  };

  const handleNewAPISubmission = (values) => {
    //  alert(`form submitted ${editInfo.title}`);
    editMutation.mutate(values);
    // handleEditing()
  };

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    } else {
      alert("No form");
    }
  };

  //   filmDeleteId, setFilmDeleteId
  let deleteFun = (id) => {
    setFilmDeleteId(() => id);
  };

  let cancelDeleteFun = () => {
    setFilmDeleteId(null);
  };

  /** use mutation: remove film from category */
  const removeFilmMutation = useMutation({
    mutationFn: removeFilmonCategory,
    onSuccess: async (data) => {
      setSnackbarMessage({ message: data.message, severity: "success" });
      await queryClient.invalidateQueries({
        queryKey: ["category", params?.id],
      });
      handleEditModalClose();
      cancelDeleteFun();
      // handleNewSeason();
    },
    onError: (error) => {
      setSnackbarMessage({ message: error.message, severity: "error" });
    },
  });

  let confirmDeleteFun = () => {
    let values = categoryQuery?.data?.category?.type === "series" ? {
      id: categoryQuery?.data?.category?.id,
      seasons: categoryQuery?.data?.category?.seasons?.map((data) =>
        data.id === filmDeleteId ? data.id : null
      ),
      type: categoryQuery?.data?.category?.type,
    } : {
      id: categoryQuery?.data?.category?.id,
      films: categoryQuery?.data?.category?.films?.map((data) =>
        data.id === filmDeleteId ? data.id : null
      ),
      type: categoryQuery?.data?.category?.type,
    };

    // console.log("values", values)
    removeFilmMutation.mutate(values);
    // cancelDeleteFun();
  };

  React.useEffect(() => {
    if (categoryQuery?.status === "error") {
      setSnackbarMessage({
        message: categoryQuery?.error?.message,
        severity: "error",
      });
    } else {
      setSnackbarMessage(null);
    }
  }, [categoryQuery?.status]);

  if (categoryQuery?.isPending) {
    return (
      <div className="grid grid-cols-[auto,1fr] flex-grow-1 relative overflow-auto">
        <Sidebar />
        <div className="flex flex-col justify-center items-center h-screen bg-[#24222a]">
          <div className="flex flex-col relative gap-8">
            <div className="w-full h-full relative flex items-center justify-center bg-secondary-800  top-0 left-0 bg-opacity-70 text-red-500">
              <CustomLoader />
            </div>

            <p className="text-center text-xs text-primary-500 font-[Inter-Regular]">
              Loading...
            </p>
          </div>
        </div>
      </div>
    );
  }

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
                Category
              </Typography>
            </div>
          </CustomStack>

          {/** Category Content */}

          <div className="pt-7 pb-11 ">
            <div className="flex flex-col gap-4">
              {/** Category Name */}
              <div className="flex flex-row items-center gap-6">
                <h1 className="font-[Inter-Bold] text-base text-whites-50">
                  Category Name: {categoryQuery?.data?.category?.name}
                </h1>

                <Button
                  onClick={handleEditModalOpen}
                  className="bg-primary-500 hover:bg-primary-700 w-max text-whites-40 text-opacity-80 font-bold py-2 px-4 rounded min-w-[150px] font-[Inter-SemiBold]"
                >
                  Edit Name
                </Button>
              </div>

              {/** Category Type */}
              <div className="flex flex-row items-center gap-6">
                <h1 className="font-[Inter-Bold] text-base text-whites-50">
                  Category Type: {categoryQuery?.data?.category?.type}
                </h1>
              </div>

              {/** Category Films */}
              {
                categoryQuery?.data?.category?.type === "series" ? (
                  <div className="flex flex-col  gap-6">
                  <div className="flex flex-row items-center gap-6">
                    
                  <h1 className="font-[Inter-Bold] text-base text-whites-50">
                    Category Series: {categoryQuery?.data?.category?.seasons?.length}
                  </h1>
  
                  
                  <Button
                    onClick={handleAddModalOpen}
                    className="bg-primary-500 hover:bg-primary-700 w-max text-whites-40 text-opacity-80 font-bold py-2 px-4 rounded min-w-[150px] font-[Inter-SemiBold]"
                  >
                    Edit Content
                  </Button>
                  </div>
               
  
                  <div className="flex flex-wrap gap-3">
                    {categoryQuery?.data?.category?.seasons?.map((data, index) => {
                      return (
                        <div key={index} className="flex flex-col gap-4">
                          <img
                            src={data?.posters[0]?.url}
                            alt=""
                            className="w-[210.15px] object-cover h-[272.5px]"
                          />
                          <div className="flex flex-col gap-2">
                            <h1 className="font-[Inter-Regular] text-sm text-[#FFFAF6] text-opacity-70">
                              {data?.title}
                            </h1>
                            <p className="font-[Inter-Regular] text-xs text-[#FFFAF6] text-opacity-70">
                              {data?.type}
                            </p>
                          </div>
  
                          <div>
                            <Button
                              onClick={() => deleteFun(data.id)}
                              className="bg-primary-500 hover:bg-primary-700 w-max text-whites-40 text-opacity-80 font-bold py-2 px-4 rounded min-w-[150px] font-[Inter-SemiBold]"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                ) : (
                  <div className="flex flex-col  gap-6">
                  <div className="flex flex-row items-center gap-6">
                    
                  <h1 className="font-[Inter-Bold] text-base text-whites-50">
                    Category Films: {categoryQuery?.data?.category?.films?.length}
                  </h1>
  
                  
                  <Button
                    onClick={handleAddModalOpen}
                    className="bg-primary-500 hover:bg-primary-700 w-max text-whites-40 text-opacity-80 font-bold py-2 px-4 rounded min-w-[150px] font-[Inter-SemiBold]"
                  >
                    Edit Content
                  </Button>
                  </div>
               
  
                  <div className="flex flex-wrap gap-3">
                    {categoryQuery?.data?.category?.films?.map((data, index) => {
                      return (
                        <div key={index} className="flex flex-col gap-4">
                          <img
                            src={data?.posters[0]?.url}
                            alt=""
                            className="w-[210.15px] object-cover h-[272.5px]"
                          />
                          <div className="flex flex-col gap-2">
                            <h1 className="font-[Inter-Regular] text-sm text-[#FFFAF6] text-opacity-70">
                              {data?.title}
                            </h1>
                            <p className="font-[Inter-Regular] text-xs text-[#FFFAF6] text-opacity-70">
                              {data?.type}
                            </p>
                          </div>
  
                          <div>
                            <Button
                              onClick={() => deleteFun(data.id)}
                              className="bg-primary-500 hover:bg-primary-700 w-max text-whites-40 text-opacity-80 font-bold py-2 px-4 rounded min-w-[150px] font-[Inter-SemiBold]"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                )
              }
             
            </div>
          </div>
        </div>
      </div>

{/** Modal for editing category name */}
      {openNameEditModal && (
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
                      Edit Category Name
                    </Typography>
                  </CustomStack>

                  {/** stepper show case */}

                  {/** form */}
                  <div className="block mb-3 h-full">
                    <EditCategoryNameForm
                      innerref={formRef}
                      handleStepNext={handleNewAPISubmission}
                      editData={categoryQuery?.data?.category}
                    />
                  </div>

                  {/** stepper control */}
                  <div className="border-t-2 border-t-secondary-500 relative">
                    <div className="container flex items-center justify-end mx-0  mt-4 mb-8 ">
                      {editMutation.isPending ? (
                        <Button
                          disabled
                          className="w-max min-w-[150px] px-5 rounded-lg"
                        >
                          Submitting...
                        </Button>
                      ) : (
                        <div className="container flex flex-row gap-2 items-center justify-end mx-0  mt-4 mb-8 ">
                          <Button
                            onClick={handleEditModalClose}
                            className="w-max min-w-[150px] px-5 bg-transparent border border-primary-500 rounded-lg"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSubmit}
                            className="w-max min-w-[150px] px-5 rounded-lg"
                          >
                            Save form
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CustomStack>
      )}

      {/** Modal for deleting  */}
      {filmDeleteId && (
        <div className="flex justify-center items-center absolute top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm z-50 cursor-pointer">
          <div className="flex flex-col items-center bg-whites-500 text-white rounded-lg p-4 shadow-lg gap-5">
            <div className="text-xl font-bold font-[Inter-Bold]">
              Are you sure you want to delete this?
            </div>
            <div className="flex flex-col items-center bg-whites-500 text-white gap-5">
              {removeFilmMutation.isPending ? (
                <Button
                  disabled
                  className="bg-primary-500 hover:bg-primary-700 w-full text-whites-40 text-opacity-80 font-bold py-2 px-4 rounded min-w-[150px] font-[Inter-SemiBold]"
                >
                  Deleting...
                </Button>
              ) : (
                <>
                  {" "}
                  <Button
                    className="bg-primary-500 hover:bg-primary-700 w-full text-whites-40 text-opacity-80 font-bold py-2 px-4 rounded min-w-[150px] font-[Inter-SemiBold]"
                    onClick={confirmDeleteFun}
                  >
                    Yes
                  </Button>
                  <Button
                    className="bg-secondary-500 hover:bg-secondary-700 text-whites-40 font-bold font-[Inter-SemiBold] py-2 px-4 rounded min-w-[150px]"
                    onClick={cancelDeleteFun}
                  >
                    No
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/** modal for adding film to category */}
      {
        openFilmAddModal && (
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
                        Add Film to Category
                      </Typography>
                    </CustomStack>
  
                    {/** stepper show case */}
  
                    {/** form */}
                    <div className="block mb-3 h-full">
                      <AddFilmCategory
                        innerref={formRef}
                        handleStepNext={handleAddAPISubmission}
                        editData={categoryQuery?.data?.category}
                        genreOptions={genreOptions}
                        serieOptions={serieOptions}
                        moviesOptions={moviesOptions}
                        mixedOptions={mixedOptions}
                      />
                    </div>
  
                    {/** stepper control */}
                    <div className="border-t-2 border-t-secondary-500 relative">
                      <div className="container flex items-center justify-end mx-0  mt-4 mb-8 ">
                        {addFilmMutation.isPending ? (
                          <Button
                            disabled
                            className="w-max min-w-[150px] px-5 rounded-lg"
                          >
                            Submitting...
                          </Button>
                        ) : (
                          <div className="container flex flex-row gap-2 items-center justify-end mx-0  mt-4 mb-8 ">
                            <Button
                              onClick={handleAddModalClose}
                              className="w-max min-w-[150px] px-5 bg-transparent border border-primary-500 rounded-lg"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleSubmit}
                              className="w-max min-w-[150px] px-5 rounded-lg"
                            >
                              Save form
                            </Button>
                          </div>
                        )}
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
      {/* <Snackbar
      open={snackbarMessage !== null}
      autoHideDuration={6000}
      onClose={() => setSnackbarMessage(null)}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity={snackbarMessage?.severity} variant="filled">
        {snackbarMessage?.message}
      </Alert>
    </Snackbar> */}

      <SuccessErrorModal
        open={snackbarMessage !== null}
        severity={snackbarMessage?.severity}
        modalTitle={snackbarMessage?.severity}
        message={snackbarMessage?.message}
        handleModalClose={() => setSnackbarMessage(null)}
      />
    </div>
  );
};

export default ViewCategory;

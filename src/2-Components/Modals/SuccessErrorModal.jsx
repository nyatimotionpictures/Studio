import { Typography } from '@mui/material';
import React from 'react'
import Button from '../Buttons/Button';

const SuccessErrorModal = ({ open, message, severity, handleModalClose, modalTitle }) => {
  return (
  <>
  {
    open && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-secondary-900 bg-opacity-30   backdrop-blur-sm ">
        <div className="w-full h-full flex flex-col justify-center items-center ">
          <div className="fixed inset-0 border rounded-xl bg-secondary-500 bg-opacity-75 transition-opacity"></div>
  
          {/** success && error snackbar */}
          
            <div className="relative transform overflow-y-auto rounded-lg z-50 bg-opacity-20 flex items-center justify-center h-max  text-left shadow-xl transition-all">
              <div className="bg-secondary-900 min-w-[290px] flex flex-col items-center justify-center gap-5 py-5 px-5 md:px-16 pt-2 w-full max-w-[700px] rounded-lg  h-max">
                <div className="flex flex-col gap-5 items-center justify-center">
                  <Typography className={`text-center text-lg font-[Inter-Medium] uppercase ${severity === "error" ? "text-[red]" : "text-[green]"} text-opacity-100`}>
                   {
                     modalTitle
                   }
                  </Typography>
    
                  <div className="flex flex-col gap-2 items-center justify-center">
                    <p className="mt-4 text-sm text-whites-40">
                     {message}
                    </p>
                  </div>
    
                  <div className="flex flex-col gap-2 items-center justify-center">
                    <Button
                      onClick={() => {
                        // setSnackbarMessage(null)
                        handleModalClose();
                      }}
                      className="w-full bg-transparent border border-primary-500 min-w-full md:min-w-[150px] px-5 rounded-lg text-sm"
                    >
                      Close{" "}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          
        </div>
      </div>
    )
  }
  </>
  
  )
}

export default SuccessErrorModal
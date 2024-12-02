import { ErrorMessage, Form, Formik } from 'formik';
import React from 'react'
import CustomStack from '../Stacks/CustomStack';
import { FormContainer } from '../Stacks/InputFormStack';

const UserTab = () => {

  return (
   
         <CustomStack className="h-full w-full flex flex-col gap-5 text-whites-40">
            <div className='flex  items-center gap-10'>
                        {/** Account ID */}
               <FormContainer>
             <label
               htmlFor="season"
               className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
             >
              Account ID
             </label>
             <input
               id="season"
               type="number"
               
               name="season"
            
               placeholder="Season Number"
              
             />
           </FormContainer>

           {/** title */}
           <FormContainer>
             <label
               htmlFor="title"
               className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
             >
            Created
             </label>
             <input
               id="title"
             
               name="title"
             
               placeholder="Title "
              
             />

            
           </FormContainer>

            </div>
       
            <div className='flex  items-center gap-10'>
                        {/** Season Number */}
               <FormContainer>
             <label
               htmlFor="season"
               className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
             >
              E-mail address
             </label>
             <input
               id="season"
               type="number"
               
               name="season"
            
               placeholder="Season Number"
              
             />
           </FormContainer>

           {/** title */}
           <FormContainer>
             <label
               htmlFor="title"
               className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
             >
            Name
             </label>
             <input
               id="title"
             
               name="title"
             
               placeholder="Title "
              
             />

            
           </FormContainer>

            </div>
         </CustomStack>
 
  )
}

export default UserTab
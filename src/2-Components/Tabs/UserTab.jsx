import { ErrorMessage, Form, Formik } from 'formik';
import React from 'react'
import CustomStack from '../Stacks/CustomStack';
import { FormContainer } from '../Stacks/InputFormStack';
import moment from 'moment-timezone';

const UserTab = ({user}) => {

   // console.log("user", user)
  return (
   
         <CustomStack className="h-full w-full flex flex-col gap-5 text-whites-40">
            <div className='flex  items-center gap-10'>
            {/** Account ID */}
               <FormContainer>
             <label
               htmlFor="accountId"
               className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
             >
              Account ID
             </label>
             <input
               id="accoundId"
               type="text"
               readOnly
               name="accountId"
            value={user?.id}
               placeholder="Account ID"
              
             />
           </FormContainer>

           {/** Created */}
           <FormContainer>
             <label
               htmlFor="date"
               className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
             >
            Created
             </label>
             <input
               id="date"
             
               name="date"
             readOnly
             value={user?.createdAt ? moment(user?.createdAt).format("DD/MMM/YYYY - hh:mm:ss a") : ""}
               placeholder="Date"
              
             />

            
           </FormContainer>

            </div>
       
            <div className='flex  items-center gap-10'>
                        {/** Email Address */}
               <FormContainer>
             <label
               htmlFor="email"
               className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
             >
              E-mail address
             </label>
             <input
               id="email"
               
               value={user.email}
               name="email"
            readOnly
               placeholder="Email"
              
             />
           </FormContainer>

           {/** title */}
           <FormContainer>
             <label
               htmlFor="name"
               className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
             >
            Name
             </label>
             <input
               id="name"
                readOnly
               name="name"
             value={`${user.firstname} ${user.lastname}`}
               placeholder="name"
              
             />

            
           </FormContainer>

            </div>
         </CustomStack>
 
  )
}

export default UserTab
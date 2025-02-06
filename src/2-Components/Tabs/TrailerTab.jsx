import React from 'react'
import Button from '../Buttons/Button'
import ViewTrailerFilm from '../ViewForms/ViewTrailerFilm';
import TrailersForm from '../Forms/TrailersForm';

const TrailerTab = ({film, type, isLoading, refetch}) => {
 
  // console.log("film", film)
  return (
    <div className="flex relative flex-col gap-6 pt-4">
      {
        <div>
          <ViewTrailerFilm film={film} type={type} isLoading={isLoading} refetch={refetch} />
        </div>
      }
 
    
    </div>
  )
}

export default TrailerTab
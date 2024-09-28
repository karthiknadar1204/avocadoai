'use client'

import React, { useState } from 'react'
import SelectTopic from './_components/SelectTopic';
import SelectStyle from './_components/SelectStyle';
import SelectDuration from './_components/SelectDuration';
import { Button } from '@/components/ui/button';
const CreateNew = () => {

  const [formData, setFormData] = useState([]);
  const onHandleInputChange = (fieldName,fieldValue) => {
    setFormData(prev=>({...prev,[fieldName]:fieldValue}))
  }
  return (
    <div className='md:px-20'>
      <h2 className='text-2xl font-bold'>Create New Video</h2>
      <div className='mt-10 shadow-md p-10' >
        {/* select topic */}
        <SelectTopic onUserSelect={onHandleInputChange} />

        {/* select style */}
        <SelectStyle onUserSelect={onHandleInputChange} />

        {/* Duration */}
        <SelectDuration onUserSelect={onHandleInputChange} />

        {/* Create Video */}
        <Button className='mt-10'>Video Bana Behenchod</Button>


      </div>
    </div>
  )
}

export default CreateNew;

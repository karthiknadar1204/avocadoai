import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <div>
      <h1>Hello World</h1>
      <Button>Click me</Button>
      <UserButton />
    </div>
  )
}

export default page
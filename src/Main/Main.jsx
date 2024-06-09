import React from 'react'
import Header from '../components/Header/Header'
import { Box } from '@chakra-ui/react'
import Sidebar from '../components/Sidebar/Sidebar'

const Main = ({children}) => {
  return (
    <>
       <Box>
        <Header />
        <Sidebar />
        <Box mt={"10vh"} ml={{md:"12%", base:"0" }}>
          {children}
        </Box>
      </Box>
    </>
  )
}

export default Main
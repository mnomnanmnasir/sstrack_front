import React from 'react'
import NavigationBar from '../component/header'
import HeroSection from './Components/HeroSection'

function AboutUs() {
  return (
    <div 
    style={{
      minHeight:'100vh',
       minWidth:'99vw', 
       backgroundColor:'white',
       marginTop:'0px'
      }}
    >
      <NavigationBar />
      <HeroSection/>
    </div>
  )
}

export default AboutUs

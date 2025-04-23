import React, { useRef, useState } from 'react';
import NavigationBar from '../component/header'
import HeroSection from './Components/HeroSection'
import NewHeader from '../component/Header/NewHeader';
import AboutContent from './Components/AboutContent';
import StatisticsSection from './Components/StatisticsSection'
import EasyStartSections from './Components/EasyStartSections';
import EmpoweringTeamsSection from './Components/EmpoweringTeam';
import PartnerLogosSection from './Components/PartnerSection';
import ContactSection from '../LandingPage/Components/ContactSection'

function AboutUs() {

  const [language, setLanguage] = useState('en');

  const handleToggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <>
      <NewHeader language={language} handleToggleLanguage={handleToggleLanguage} />
      {/* <NavigationBar /> */}
      <HeroSection language={language}/>
      <AboutContent language={language}/>
      {/* <StatisticsSection language={language}/> */}
      <EasyStartSections language={language}/>
      <EmpoweringTeamsSection language={language}/>
      <PartnerLogosSection language={language}/>
      <ContactSection language={language} />
    </>
  )
}

export default AboutUs

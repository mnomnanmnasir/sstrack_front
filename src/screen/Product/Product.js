// import React from 'react'


// const Product = () => {
//     return (
//         <>
//             <h1>
//                 Product Page
//             </h1>
//         </>
//     )
// }


// export default Product

import React, { useRef, useState } from 'react';
import NavigationBar from '../component/header'
import HeroSection from './Components/EmployeeTimeTrackingSection'
import NewHeader from '../component/Header/NewHeader';
import ProductSmarter from './Components/ProductSmarter'
import ThreeCardsSection from './Components/CardProduct';
import HowToUseSection from './Components/HowToUseSection';
// import AboutContent from './Components/AboutContent';
import FAQ from '../LandingPage/Components/FAQ';

// import StatisticsSection from './Components/StatisticsSection'
// import EasyStartSections from './Components/EasyStartSections';
// import EmpoweringTeamsSection from './Components/EmpoweringTeam';
// import PartnerLogosSection from './Components/PartnerSection';
import ContactSection from '../LandingPage/Components/ContactSection'

function Product() {

    const contactSectionRef = useRef(null); // Create a ref for ContactSection

    const scrollToContactSection = () => {
        if (contactSectionRef.current) {
            contactSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const [language, setLanguage] = useState('en');

    const handleToggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    return (
        <>
            <NewHeader language={language} handleToggleLanguage={handleToggleLanguage} />
            {/* <NavigationBar /> */}
            {/* <HeroSection />
      <AboutContent />
      <StatisticsSection />
      <EasyStartSections />
      <EmpoweringTeamsSection />
      <PartnerLogosSection />
      <ContactSection language={language} /> */}
            <HeroSection onContactButtonClick={scrollToContactSection} language={language} />
            <ProductSmarter onContactButtonClick={scrollToContactSection} language={language} />
            <ThreeCardsSection onContactButtonClick={scrollToContactSection} language={language} />
            <HowToUseSection onContactButtonClick={scrollToContactSection} language={language} />
            {/* <div id="faq"> */}
                <FAQ onContactButtonClick={scrollToContactSection} language={language} />
            {/* </div> */}
            <div ref={contactSectionRef} id="section3">
                <ContactSection language={language} />
            </div>
        </>
    )
}

export default Product

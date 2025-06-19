import React, { useRef, useState } from 'react';
import HeroSection from './Components/EmployeeTimeTrackingSection'
import NewHeader from '../component/Header/NewHeader';
import ProductSmarter from './Components/ProductSmarter'
import ThreeCardsSection from './Components/CardProduct';
import HowToUseSection from './Components/HowToUseSection';

import FAQ from '../LandingPage/Components/FAQ';
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
            <HeroSection onContactButtonClick={scrollToContactSection} language={language} />
            <ProductSmarter onContactButtonClick={scrollToContactSection} language={language} />
            <ThreeCardsSection onContactButtonClick={scrollToContactSection} language={language} />
            <HowToUseSection onContactButtonClick={scrollToContactSection} language={language} />
            <FAQ onContactButtonClick={scrollToContactSection} language={language} />
            <div ref={contactSectionRef} id="section3">
                <ContactSection language={language} />
            </div>
        </>
    )
}

export default Product

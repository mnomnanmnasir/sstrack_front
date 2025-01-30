import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "../../../../io";
// Correct import


function NewHEaderOpions( {language, showVertical = false}) {

    // const navigate = useNavigate();
    const location = useLocation();



    const [showContent, setShowContent] = useState(false);

    const navigate = useNavigate("");
    const dispatch = useDispatch()
    const socket = useSocket()
    let token = localStorage.getItem('token');
    let headers = {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
    }
    // console.log(items);


    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            window.scrollTo({
                top: section.offsetTop,
                behavior: 'smooth',
            });
        }
    };

    return (

        <div className="cursor-pointer mt-3">
            {/* <Header /> */}
            <>
                {/* <HeaderOption /> */}
                <nav className="navbar navbar-expand-lg navbar-dark" style={{
                    backgroundColor: "transparent",

                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                    // margin: "0px 30px 0 30px",

                }}>
                    {/* <HeaderOption /> */}
                    <div className="container-fluid" style={{ position: "relative" }}>
                        {/* <div>
                        
                        </div> */}
                        <div>
                            <div className={`d-flex amButton ${showVertical ? 'flex-column align-items-start' : 'justify-content-end'}`}role="search">
                                <div className="ownerSectionUser1 text-white" onClick={() => {
                                    navigate('/')
                                }} >
                                    <p style={{ margin: 0, fontSize: '0.8rem',  }} onClick={() => {
                                        navigate('/')

                                    }}>{language === "en" ? "Home" : "الصفحة الرئيسية"}</p>
                                </div>
                                {/* <div className="ownerSectionUser1 text-white" onClick={() => {
                                    navigate('/aboutUs')
                                }} >
                                    <p style={{ margin: 0, fontSize: '0.8rem', }} 

                                    onClick={() => {
                                        navigate('/aboutUs')
                                    }}
                                    >{language === "en" ? "About Us" : "من نحن"}</p>
                                </div> */}
                                <div className="ownerSectionUser1 text-white" style={{ whiteSpace: 'nowrap' }} 
                              
                                >
                                    <p style={{ margin: 0, fontSize: '0.8rem', }} onClick={() => location.pathname === "/" ? scrollToSection('section1') : navigate("/")}>{language === "en" ? "How It Works" : "كيف يعمل"}</p>
                                </div>
                                <div className="ownerSectionUser1 text-white"
                        
                                 >
                                    <p style={{ margin: 0, fontSize: '0.8rem', }} onClick={() => location.pathname === "/" ? scrollToSection('pricing') : navigate("/")}>{language === "en" ? "Pricing" : "التسعير"}</p>
                                </div>
                                <div className="ownerSectionUser1 text-white"  >
                                    <p style={{ margin: 0, fontSize: '0.8rem', }} onClick={() => location.pathname === "/" ? scrollToSection('section3') : navigate("/")}>{language === "en" ? "Contact Us" : "اتصل بنا"}</p>
                                </div>


                            </div>

                        </div>
                    </div>


                </nav>

            </>

        </div>


    )
}

export default NewHEaderOpions;
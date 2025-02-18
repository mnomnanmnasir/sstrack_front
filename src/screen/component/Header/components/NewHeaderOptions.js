import React, { useState } from "react";
import { useDispatch } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "../../../../io";
// Correct import
import { useLocation, useNavigate, Link } from "react-router-dom";


function NewHEaderOpions({ language, showVertical = false }) {

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
                            <div className={`d-flex amButton ${showVertical ? 'flex-column align-items-start' : 'justify-content-end'}`} role="search">
                                {/* <div className="ownerSectionUser1 text-white" onClick={() => {
                                    navigate('/')
                                }} >
                                    <p onClick={() => {
                                        navigate('/')

                                    }}>{language === "en" ? "Home" : "الصفحة الرئيسية"}</p>
                                </div> */}
                                {/* <div className="ownerSectionUser1 text-white" style={{ whiteSpace: 'nowrap' }}
                                > */}
                                    <Link to="/" className="ownerSectionUser1" style={{ color: 'white', textDecoration: 'none', fontSize: '17px' }}> {language === "en" ? "Home" : "الصفحة الرئيسية"}
                                    </Link>
                                    {/* <p style={{ margin: 0, fontSize: '0.8rem', }} onClick={() => location.pathname === "/" ? scrollToSection('section1') : navigate("/aboutUs")}>{language === "en" ? "About Us" : "كيف يعمل"}</p> */}
                                {/* </div> */}
                                {/* <div className="ownerSectionUser1 text-white" onClick={() => {
                                    navigate('/aboutUs')
                                }} >
                                    <p style={{ margin: 0, fontSize: '0.8rem', }} 

                                    onClick={() => {
                                        navigate('/aboutUs')
                                    }}
                                    >{language === "en" ? "About Us" : "من نحن"}</p>
                                </div> */}
                                {/* <div className="ownerSectionUser1 text-white" style={{ whiteSpace: 'nowrap' }}
                                > */}
                                    <Link to="/aboutUs" className="ownerSectionUser1"  style={{ color: 'white', textDecoration: 'none', fontSize: '15px' }}>  {language === "en" ? "About Us" : "كيف يعمل"}
                                    </Link>
                                    {/* <p style={{ margin: 0, fontSize: '0.8rem', }} onClick={() => location.pathname === "/" ? scrollToSection('section1') : navigate("/aboutUs")}>{language === "en" ? "About Us" : "كيف يعمل"}</p> */}
                                {/* </div> */}
                                {/* <div className="ownerSectionUser1 text-white" style={{ whiteSpace: 'nowrap' }}
                                > */}
                                    <Link to="/product" className="ownerSectionUser1"  style={{ color: 'white', textDecoration: 'none', fontSize: '15px' }}>     {language === "en" ? "Product" : "منتج"}
                                    </Link>
                                    {/* <p style={{ margin: 0, fontSize: '0.8rem', }} onClick={() => location.pathname === "/" ? scrollToSection('section1') : navigate("/aboutUs")}>{language === "en" ? "About Us" : "كيف يعمل"}</p> */}
                                {/* </div> */}
                                {/* <div className="ownerSectionUser1 text-white" style={{ whiteSpace: 'nowrap' }}
                                >
                                    <p style={{fontSize: '0.8rem', }} onClick={() => location.pathname === "/" ? scrollToSection('section1') : navigate("/")}>{language === "en" ? "How It Works" : "كيف يعمل"}</p>
                                </div> */}

                                {/* <div className="ownerSectionUser1 text-white" style={{ whiteSpace: 'nowrap' }}
                                > */}
                                    {/* <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }} onClick={() => location.pathname === "/" ? scrollToSection('pricing') : navigate("/")}>{language === "en" ? "Pricing" : "التسعير"}
                                    </Link> */}
                                    <Link to="/#" className="ownerSectionUser1"  style={{ color: 'white', textDecoration: 'none', fontSize: '15px' }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (window.location.pathname !== "/") {
                                                navigate("/", { state: { scrollTo: "pricing" } });
                                            } else {
                                                scrollToSection('pricing'); // Call the scroll function if already on homepage
                                            }
                                        }}>{language === "en" ? "Pricing" : "التسعير"}</Link>
                                    {/* <p style={{ margin: 0, fontSize: '0.8rem', }} onClick={() => location.pathname === "/" ? scrollToSection('section1') : navigate("/aboutUs")}>{language === "en" ? "About Us" : "كيف يعمل"}</p> */}
                                {/* </div> */}

                                {/* <div className="ownerSectionUser1 text-white" style={{ whiteSpace: 'nowrap' }}
                                > */}
                                    {/* <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }} onClick={() => location.pathname === "/" ? scrollToSection('pricing') : navigate("/")}>{language === "en" ? "Pricing" : "التسعير"}
                                    </Link> */}
                                    <Link to="/#" className="ownerSectionUser1" style={{ color: 'white', textDecoration: 'none', fontSize: '15px' }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (window.location.pathname !== "/") {
                                                navigate("/", { state: { scrollTo: "section1" } });
                                            } else {
                                                scrollToSection('section1'); // Call the scroll function if already on homepage
                                            }
                                        }}>{language === "en" ? "How It Works" : "كيف يعمل"}</Link>
                                    {/* <p style={{ margin: 0, fontSize: '0.8rem', }} onClick={() => location.pathname === "/" ? scrollToSection('section1') : navigate("/aboutUs")}>{language === "en" ? "About Us" : "كيف يعمل"}</p> */}
                                {/* </div> */}
                                {/* <div className="ownerSectionUser1 text-white"
                                >
                                    <p onClick={() => location.pathname === "/" ? scrollToSection('pricing') : navigate("/")}>{language === "en" ? "Pricing" : "التسعير"}</p>
                                </div> */}

                                {/* <div className="ownerSectionUser1 text-white" style={{ whiteSpace: 'nowrap' }}
                                > */}
                                    <Link to="/" className="ownerSectionUser1" style={{ color: 'white', textDecoration: 'none', fontSize: '15px' }} onClick={() => location.pathname === "/" ? scrollToSection('section3') : navigate("/")}>{language === "en" ? "Contact Us" : "اتصل بنا"}
                                    </Link>
                                    {/* <p style={{ margin: 0, fontSize: '0.8rem', }} onClick={() => location.pathname === "/" ? scrollToSection('section1') : navigate("/aboutUs")}>{language === "en" ? "About Us" : "كيف يعمل"}</p> */}
                                {/* </div> */}
                                {/* <div className="ownerSectionUser1 text-white"  >
                                    <p onClick={() => location.pathname === "/" ? scrollToSection('section3') : navigate("/")}>{language === "en" ? "Contact Us" : "اتصل بنا"}</p>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </nav>
            </>

        </div>


    )
}

export default NewHEaderOpions;




// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { useLocation, useNavigate, Link } from "react-router-dom";
// import { useSocket } from "../../../../io";

// function NewHeaderOptions({ language, showVertical = false }) {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const socket = useSocket();
//     const [isNavbarOpen, setIsNavbarOpen] = useState(false);

//     let token = localStorage.getItem('token');
//     let headers = {
//         Authorization: 'Bearer ' + token,
//         'Content-Type': 'application/json'
//     };

//     function scrollToSection(sectionId) {
//         const section = document.getElementById(sectionId);
//         if (section) {
//             window.scrollTo({
//                 top: section.offsetTop,
//                 behavior: 'smooth',
//             });
//         }
//     }

//     return (
//         <div className="cursor-pointer mt-3">
//             <nav className="navbar navbar-expand-lg navbar-dark bg-transparent">
//                 <div className="container-fluid">
//                     <button className="navbar-toggler" type="button" onClick={() => setIsNavbarOpen(!isNavbarOpen)}>
//                         <span className="navbar-toggler-icon"></span>
//                     </button>
//                     <div className={`collapse navbar-collapse ${isNavbarOpen ? 'show' : ''}`}>
//                         <ul className="navbar-nav ms-auto text-center">
//                             <li className="nav-item">
//                                 <Link className="nav-link text-white" to="/">{language === "en" ? "Home" : "الصفحة الرئيسية"}</Link>
//                             </li>
//                             <li className="nav-item">
//                                 <Link className="nav-link text-white" to="/aboutUs">{language === "en" ? "About Us" : "كيف يعمل"}</Link>
//                             </li>
//                             <li className="nav-item">
//                                 <Link className="nav-link text-white" to="/product">{language === "en" ? "Product" : "منتج"}</Link>
//                             </li>
//                             <li className="nav-item">
//                                 <Link className="nav-link text-white" to="#" onClick={(e) => {
//                                     e.preventDefault();
//                                     if (location.pathname !== "/") {
//                                         navigate("/", { state: { scrollTo: "pricing" } });
//                                     } else {
//                                         scrollToSection('pricing');
//                                     }
//                                 }}>{language === "en" ? "Pricing" : "التسعير"}</Link>
//                             </li>
//                             <li className="nav-item">
//                                 <Link className="nav-link text-white" to="#" onClick={(e) => {
//                                     e.preventDefault();
//                                     if (location.pathname !== "/") {
//                                         navigate("/", { state: { scrollTo: "section1" } });
//                                     } else {
//                                         scrollToSection('section1');
//                                     }
//                                 }}>{language === "en" ? "How It Works" : "كيف يعمل"}</Link>
//                             </li>
//                             <li className="nav-item">
//                                 <Link className="nav-link text-white" to="#" onClick={() => {
//                                     location.pathname === "/" ? scrollToSection('section3') : navigate("/");
//                                 }}>{language === "en" ? "Contact Us" : "اتصل بنا"}</Link>
//                             </li>
//                         </ul>
//                     </div>
//                 </div>
//             </nav>
//         </div>
//     );
// }

// export default NewHeaderOptions;

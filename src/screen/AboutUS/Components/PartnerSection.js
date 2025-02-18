// import React from "react";
// import { Container, Row, Col } from "react-bootstrap";
// import i8isImage from '../../../images/I8IS  Logo 1.png'
// import HandrHrImage from '../../../images/Hands HR Logo 1.png'
// import GeoHrImage from '../../../images/geox-hr.png'
// import ClickHrImage from '../../../images/clickhr 2.png'
// import VerdebookImage from '../../../images/Verdebooks logo 1.png'
// import CAIIF from '../../../images/CAIIF.png'


// const PartnerLogosSection = () => {
//     return (
//         <div style={{ marginTop: '-10%', padding: "4rem 0", backgroundColor: "#FFFFFF" }}>
//             <Container>
//                 {/* Title */}
//                 <Row className="text-center mb-4">
//                     <Col>
//                         <h2 className="fs-1 fw-bold">
//                             Our <span style={{ color: "#7ACB59" }}>Partners</span>
//                         </h2>
//                     </Col>
//                 </Row>

//                 {/* Logos */}
//                 <Row className="text-center align-items-center justify-content-center">
//                     <Col xs={6} sm={4} md={2} className="mb-3">
//                         <img
//                             src={i8isImage}
//                             alt="Partner 1"
//                             style={{ maxWidth: "100%", height: "auto" }}
//                         />
//                     </Col>
//                     <Col xs={6} sm={4} md={2} className="mb-3">
//                         <img
//                             src={GeoHrImage}
//                             alt="Partner 2"
//                             style={{ maxWidth: "100%", height: "auto" }}
//                         />
//                     </Col>
//                     <Col xs={6} sm={4} md={2} className="mb-3">
//                         <img
//                             src={ClickHrImage}
//                             alt="Partner 3"
//                             style={{ maxWidth: "100%", height: "auto" }}
//                         />
//                     </Col>
//                     <Col xs={6} sm={4} md={2} className="mb-3">
//                         <img
//                             src={HandrHrImage}
//                             alt="Partner 4"
//                             style={{ maxWidth: "100%", height: "auto" }}
//                         />
//                     </Col>
//                     <Col xs={6} sm={4} md={2} className="mb-3">
//                         <img
//                             src={VerdebookImage}
//                             alt="Partner 5"
//                             style={{ maxWidth: "100%", height: "auto" }}
//                         />
//                     </Col>
//                     <Col xs={6} sm={4} md={2} className="mb-3">
//                         <img
//                             src={CAIIF}
//                             alt="Partner 6"
//                             style={{ maxWidth: "100%", height: "auto" }}
//                         />
//                     </Col>
//                 </Row>
//             </Container>
//         </div>
//     );
// };

// export default PartnerLogosSection;




import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import i8isImage from '../../../images/I8IS  Logo 1.png'
import HandrHrImage from '../../../images/Hands HR Logo 1.png'
import GeoHrImage from '../../../images/geox-hr.png'
import ClickHrImage from '../../../images/clickhr 2.png'
import VerdebookImage from '../../../images/Verdebooks logo 1.png'
import CAIIF from '../../../images/CAIIF.png'

const PartnerLogosSection = ({ language }) => {
    // Translations
    const translations = {
        en: {
            title: "Our",
            highlightedTitle: "Partners",
        },
        ar: {
            title: "شركاؤنا",
            highlightedTitle: "",
        },
    };

    const t = translations[language || "en"]; // Default to English if no language is provided

    return (
        <div style={{ marginTop: '-10%', padding: "4rem 0", backgroundColor: "#FFFFFF", direction: language === "ar" ? "rtl" : "ltr" }}>
            <Container>
                {/* Title */}
                <Row className="text-center mb-4">
                    <Col>
                        <h2 className="fs-1 fw-bold">
                            {t.title} <span style={{ color: "#7ACB59" }}>{t.highlightedTitle}</span>
                        </h2>
                    </Col>
                </Row>

                {/* Logos */}
                <Row className="text-center align-items-center justify-content-center">
                    <Col xs={6} sm={4} md={2} className="mb-3">
                        <img src={i8isImage} alt="شريك 1" style={{ maxWidth: "100%", height: "auto" }} />
                    </Col>
                    <Col xs={6} sm={4} md={2} className="mb-3">
                        <img src={GeoHrImage} alt="شريك 2" style={{ maxWidth: "100%", height: "auto" }} />
                    </Col>
                    <Col xs={6} sm={4} md={2} className="mb-3">
                        <img src={ClickHrImage} alt="شريك 3" style={{ maxWidth: "100%", height: "auto" }} />
                    </Col>
                    <Col xs={6} sm={4} md={2} className="mb-3">
                        <img src={HandrHrImage} alt="شريك 4" style={{ maxWidth: "100%", height: "auto" }} />
                    </Col>
                    <Col xs={6} sm={4} md={2} className="mb-3">
                        <img src={VerdebookImage} alt="شريك 5" style={{ maxWidth: "100%", height: "auto" }} />
                    </Col>
                    <Col xs={6} sm={4} md={2} className="mb-3">
                        <img src={CAIIF} alt="شريك 6" style={{ maxWidth: "100%", height: "auto" }} />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default PartnerLogosSection;

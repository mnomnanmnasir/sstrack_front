// import React from 'react'
// import step1 from '../../../images/step1.png'
// import step2 from '../../../images/step2.png'
// import step3 from '../../../images/step3.png'
// import step4 from '../../../images/step4.png'
// import 'bootstrap/dist/css/bootstrap.min.css';



// function NewHIW({ language }) {

//     return (
//         <div style={{
//             width: '100%',
//             // marginTop: '50px',
//             padding: '2rem 0',
//             backgroundColor: '#F9F9F9',
//             textAlign: 'center'
//         }}>
//             {/* Heading */}
//             <h2 style={{
//                 fontFamily: "'Sinkin Sans', sans-serif",
//                 fontSize: '44px',
//                 fontWeight: '700',
//                 fontFamily: "'Sinkin Sans', sans-serif",
//                 color: '#3B3C4E',
//                 marginBottom: '10px'
//             }}>
//                 {language === 'en' ? 'How It' : 'كيف'}  <span style={{
//                     fontFamily: "'Sinkin Sans', sans-serif",
//                     color: '#7ACB59',
//                     fontSize: '44px',
//                     fontWeight: '700',
//                 }}>{language === 'en' ? ' Works' : ' يعمل'}</span>
//             </h2>
//             <p style={{
//                 fontFamily: "'Sinkin Sans', sans-serif",
//                 fontSize: '16px',
//                 fontWeight: '400',
//                 color: '#212529',
//                 marginBottom: '30px'
//             }}>
//                 {language === 'en'
//                     ? 'A Smarter Way to Track and Manage.'
//                     : 'طريقة أكثر ذكاءً لتتبع وإدارة العمل.'}
//             </p>

//             {/* Steps */}
//             <div 

//             style={{
//                 display: 'flex',
//                 flexWrap: 'wrap',
//                 justifyContent: 'center',
//                 alignItems: 'flex-start',
//                 gap: '30px',
//                 width: '70%', // Adjust width as needed
//                 marginLeft: 'auto',
//                 marginRight: 'auto',
//             }}
//             >
//                 {/* Column 1 */}
//                 <div style={{
//                     flex: '1',
//                     minWidth: '300px',
//                     marginTop: '20%',
//                     // backgroundColor: 'red',
//                     display: 'flex',
//                     flexDirection: 'column',

//                     alignItems: 'flex-end',
//                 }}>
//                     {/* Step 1 */}
//                     <div style={{
//                         backgroundColor: '#FFFFFF',
//                         borderRadius: '10px',
//                         boxShadow: `
//                         0px 30px 45px -30px rgba(50, 50, 93, 0.2), /* First shadow */
//                         0px 18px 36px -18px rgba(0, 0, 0, 0.1) /* Second shadow */
//                       `,
//                         width: '500px',
//                         textAlign: language === 'ar' ? 'right' : 'left',
//                         marginBottom: '50px',
//                     }}>
//                         {/* Image Container */}
//                         <div style={{
//                             paddingLeft: '6px', // Padding specifically for the image
//                             paddingRight: '6px',
//                             paddingTop: '6px' // Padding specifically for the image
//                         }}>
//                             <img
//                                 src={step1}
//                                 alt="Step 3"
//                                 style={{
//                                     width: '100%',
//                                     borderRadius: '10px',
//                                 }}
//                             />
//                         </div>

//                         {/* Text Content Container */}
//                         <div style={{
//                             padding: '20px',
//                             paddingLeft: '30px', // Padding specifically for the image
//                             paddingRight: '30px',// Padding specifically for the image

//                         }}>
//                             <p style={{
//                                 fontSize: '44px',
//                                 fontWeight: '700',
//                                 fontFamily: "'Sinkin Sans', sans-serif",
//                                 color: '#7ACB59',

//                             }}>
//                                 01
//                             </p>
//                             <p style={{
//                                 fontSize: '23px',
//                                 fontWeight: '600',
//                                 fontFamily: "'Sinkin Sans', sans-serif",
//                                 color: '#0D4873',

//                             }}>
//                                 {language === 'en' ? 'Sign Up' : 'اشترك'}
//                             </p>
//                             <p style={{
//                                 fontSize: '16px',
//                                 fontWeight: '400',
//                                 color: '#555555',
//                                 fontFamily: "'Sinkin Sans', sans-serif",
//                             }}>
//                                 {language === 'en'
//                                     ? 'Get started in minutes—email verification is all it takes.'
//                                     : 'ابدأ في دقائق - كل ما تحتاجه هو التحقق من البريد الإلكتروني.'
//                                 }
//                             </p>
//                         </div>
//                     </div>

//                     {/* Step 3 */}
//                     <div style={{
//                         backgroundColor: '#FFFFFF',
//                         borderRadius: '10px',
//                         boxShadow: `
//                         0px 30px 45px -30px rgba(50, 50, 93, 0.2), /* First shadow */
//                         0px 18px 36px -18px rgba(0, 0, 0, 0.1) /* Second shadow */
//                       `,
//                         width: '500px',
//                         textAlign: language === 'ar' ? 'right' : 'left',
//                         marginBottom: '50px',
//                     }}>
//                         {/* Image Container */}
//                         <div style={{
//                             paddingLeft: '6px', // Padding specifically for the image
//                             paddingRight: '6px',
//                             paddingTop: '6px' // Padding specifically for the image
//                         }}>
//                             <img
//                                 src={step3}
//                                 alt="Step 3"
//                                 style={{
//                                     width: '100%',
//                                     borderRadius: '10px',
//                                 }}
//                             />
//                         </div>

//                         {/* Text Content Container */}
//                         <div style={{
//                             padding: '20px',
//                             fontFamily: "'Sinkin Sans', sans-serif",
//                             paddingLeft: '30px', // Padding specifically for the image
//                             paddingRight: '30px',// Padding specifically for the image

//                         }}>
//                             <p style={{
//                                 fontSize: '44px',
//                                 fontWeight: '700',
//                                 fontFamily: "'Sinkin Sans', sans-serif",
//                                 color: '#7ACB59',

//                             }}>
//                                 03
//                             </p>
//                             <p style={{
//                                 fontSize: '23px',
//                                 fontWeight: '600',

//                                 fontFamily: "'Sinkin Sans', sans-serif",
//                                 color: '#0D4873',

//                             }}>
//                                 {language === 'en' ? 'Analyze & Optimize' : 'التحليل والتحسين'}
//                             </p>
//                             <p style={{
//                                 fontSize: '16px',
//                                 fontWeight: '400',
//                                 fontFamily: "'Sinkin Sans', sans-serif",
//                                 color: '#555555',
//                             }}>

//                                 {language === 'en' ? 'Use advanced analytics and insights to improve productivity across remote, in-office, and on-site teams.' : 'استخدم التحليلات المتقدمة والرؤى لتحسين الإنتاجية في الفرق البعيدة، والمكتبية، والميدانية.'}
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Column 2 */}
//                 <div style={{ flex: '1', minWidth: '300px', }}>
//                     {/* Step 2 */}
//                     <div style={{
//                         backgroundColor: '#FFFFFF',
//                         borderRadius: '10px',
//                         boxShadow: `
//                         0px 30px 45px -30px rgba(50, 50, 93, 0.2), /* First shadow */
//                         0px 18px 36px -18px rgba(0, 0, 0, 0.1) /* Second shadow */
//                       `,
//                         width: '500px',
//                         textAlign: language === 'ar' ? 'right' : 'left',
//                         marginBottom: '50px',
//                     }}>
//                         {/* Image Container */}
//                         <div style={{
//                             paddingLeft: '6px', // Padding specifically for the image
//                             paddingRight: '6px',
//                             paddingTop: '6px' // Padding specifically for the image
//                         }}>
//                             <img
//                                 src={step2}
//                                 alt="Step 3"
//                                 style={{
//                                     width: '100%',
//                                     borderRadius: '10px',
//                                 }}
//                             />
//                         </div>

//                         {/* Text Content Container */}
//                         <div style={{
//                             padding: '20px',
//                             paddingLeft: '30px', // Padding specifically for the image
//                             paddingRight: '30px',// Padding specifically for the image

//                         }}>
//                             <p style={{
//                                 fontSize: '44px',
//                                 fontWeight: '700',
//                                 fontFamily: "'Sinkin Sans', sans-serif",
//                                 color: '#7ACB59',

//                             }}>
//                                 02
//                             </p>
//                             <p style={{
//                                 fontSize: '23px',
//                                 fontWeight: '600',
//                                 fontFamily: "'Sinkin Sans', sans-serif",
//                                 color: '#0D4873',

//                             }}>

//                                 {language === 'en' ? 'Precision Tools' : 'أدوات دقيقة'}
//                             </p>
//                             <p style={{
//                                 fontSize: '16px',
//                                 fontWeight: '400',
//                                 fontFamily: "'Sinkin Sans', sans-serif",
//                                 color: '#555555',
//                             }}>

//                                 {language === 'en' ? 'Real-time tracking, flawless logins, and screenshot control deliver unmatched oversight.' : 'التتبع في الوقت الفعلي، تسجيل الدخول السلس، والتحكم في لقطات الشاشة يوفر لك إشرافًا لا مثيل له'}
//                             </p>
//                         </div>
//                     </div>


//                     {/* Step 4 */}
//                     <div style={{
//                         backgroundColor: '#FFFFFF',
//                         borderRadius: '10px',
//                         boxShadow: `
//                         0px 30px 45px -30px rgba(50, 50, 93, 0.2), /* First shadow */
//                         0px 18px 36px -18px rgba(0, 0, 0, 0.1) /* Second shadow */
//                       `,
//                         width: '500px',
//                         textAlign: language === 'ar' ? 'right' : 'left',
//                         marginBottom: '50px',
//                     }}>
//                         {/* Image Container */}
//                         <div style={{
//                             paddingLeft: '6px', // Padding specifically for the image
//                             paddingRight: '6px',
//                             paddingTop: '6px' // Padding specifically for the image
//                         }}>
//                             <img
//                                 src={step4}
//                                 alt="Step 3"
//                                 style={{
//                                     width: '100%',
//                                     borderRadius: '10px',
//                                 }}
//                             />
//                         </div>

//                         {/* Text Content Container */}
//                         <div style={{
//                             padding: '20px',
//                             paddingLeft: '30px', // Padding specifically for the image
//                             paddingRight: '30px',// Padding specifically for the image

//                         }}>
//                             <p style={{
//                                 fontSize: '44px',
//                                 fontWeight: '700',
//                                 fontFamily: "'Sinkin Sans', sans-serif",
//                                 color: '#7ACB59',

//                             }}>
//                                 04
//                             </p>
//                             <p style={{
//                                 fontSize: '23px',
//                                 fontWeight: '600',
//                                 color: '#0D4873',

//                             }}>
//                                 Get the Tools
//                                 {language === 'en' ? 'Get the Tools' : 'احصل على الأدوات'}
//                             </p>
//                             <p style={{
//                                 fontSize: '16px',
//                                 fontWeight: '400',
//                                 color: '#555555',
//                             }}>

//                                 {language === 'en' ? 'Download the app or extension to track work hours and manage activities effortlessly.' : 'قم بتنزيل التطبيق أو الإضافة لتتبع ساعات العمل وإدارة الأنشطة بسهولة.'}
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//         </div>
//     )
// }

// export default NewHIW



import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import step1 from '../../../images/step1.png';
import step2 from '../../../images/step2.png';
import step3 from '../../../images/step3.png';
import step4 from '../../../images/step4.png';
import 'bootstrap/dist/css/bootstrap.min.css';

function NewHIW({ language }) {
    return (
        <Container fluid className="bg-light text-center py-5">
            {/* Heading */}
            <h2
                className="mb-3 heading-responsive"
                style={{ fontFamily: "'Sinkin Sans', sans-serif", fontWeight: '700', color: '#3B3C4E' }}
            >
                {language === 'en' ? 'How It' : 'كيف'}{' '}
                <span style={{ color: '#7ACB59' }}>{language === 'en' ? 'Works' : 'يعمل'}</span>
            </h2>

            {/* Subtext */}
            <p
                className="mb-4 text-responsive"
                style={{ fontFamily: "'Sinkin Sans', sans-serif", fontWeight: '400', color: '#212529' }}
            >
                {language === 'en' ? 'A Smarter Way to Track and Manage.' : 'طريقة أكثر ذكاءً لتتبع وإدارة العمل.'}
            </p>

            {/* Steps Section */}
            <Row className="justify-content-center gx-1">
                <Col xs={12} md={6} lg={5} className="p-1 mt-lg-5">
                    <StepCard
                        stepNumber="01"
                        image={step1}
                        title={language === 'en' ? 'Sign Up' : 'اشترك'}
                        description={language === 'en' ? 'Get started in minutes—email verification is all it takes.' : 'ابدأ في دقائق - كل ما تحتاجه هو التحقق من البريد الإلكتروني.'}
                        language={language}
                    />
                </Col>
                <Col xs={12} md={6} lg={5} className="p-1">
                    <StepCard
                        stepNumber="02"
                        image={step2}
                        title={language === 'en' ? 'Precision Tools' : 'أدوات دقيقة'}
                        description={language === 'en' ? 'Real-time tracking, flawless logins, and screenshot control deliver unmatched oversight.' : 'التتبع في الوقت الفعلي، تسجيل الدخول السلس، والتحكم في لقطات الشاشة يوفر لك إشرافًا لا مثيل له.'}
                        language={language}
                    />
                </Col>
                <Col xs={12} md={6} lg={5} className="p-1 mt-lg-5">
                    <StepCard
                        stepNumber="03"
                        image={step3}
                        title={language === 'en' ? 'Analyze & Optimize' : 'التحليل والتحسين'}
                        description={language === 'en' ? 'Use advanced analytics and insights to improve productivity across remote, in-office, and on-site teams.' : 'استخدم التحليلات المتقدمة لتحسين الإنتاجية في الفرق المختلفة.'}
                        language={language}
                    />
                </Col>
                <Col xs={12} md={6} lg={5} className="p-1">
                    <StepCard
                        stepNumber="04"
                        image={step4}
                        title={language === 'en' ? 'Get the Tools' : 'احصل على الأدوات'}
                        description={language === 'en' ? 'Download the app or extension to track work hours and manage activities effortlessly.' : 'قم بتنزيل التطبيق أو الإضافة لتتبع ساعات العمل وإدارة الأنشطة بسهولة.'}
                        language={language}
                    />
                </Col>
            </Row>
        </Container>
    );
}

function StepCard({ stepNumber, image, title, description, language }) {
    return (
        <Card className="border shadow-sm rounded p-3 text-start card-responsive"
            style={{ borderColor: '#D3D3D3', margin: 'auto', width: '75%' }}>
            {/* Image */}
            <Card.Img variant="top" src={image} className="rounded" />

            {/* Step Content */}
            <Card.Body
                className="d-flex flex-column align-items-center align-items-md-start text-center text-md-start"
                style={{ textAlign: language === 'ar' ? 'right' : 'left' }}>

                <Card.Title className="fw-bold card-title-responsive" style={{ fontSize: '44px', color: '#7ACB59' }}>{stepNumber}</Card.Title>
                <Card.Subtitle className="fw-semibold mb-2 card-subtitle-responsive" style={{ fontSize: '23px', color: '#0D4873' }}>{title}</Card.Subtitle>
                <Card.Text className="text-muted card-text-responsive" style={{ fontSize: '16px' }}>{description}</Card.Text>
            </Card.Body>
        </Card>
    );
}

export default NewHIW;

import React, { useState } from "react";


const faqsEN = [
    {
        question: "Is it possible to use SS Track.io for free?",
        answer: "Yes, SS Track.io offers a free plan with limited features. You can upgrade for additional functionality.",
    },
    {
        question: "Is SS Track.io an effective tool for tracking activity?",
        answer: "Absolutely! SS Track.io provides accurate tracking for activities, helping you manage tasks efficiently.",
    },
    {
        question: "Do I have to provide my credit card?",
        answer: "No, you can start using the free plan without providing any payment details.",
    },
    {
        question: "What happens if I exceed the Free plan's user limit?",
        answer: "You will need to upgrade to a paid plan to add more users or access premium features.",
    },
    {
        question: "How do you protect my information?",
        answer: "We use advanced security measures like encryption and role-based permissions to safeguard your data.",
    },
    {
        question: "Is it helpful in increasing the productivity of the team?",
        answer: "Yes, our tools are designed to improve productivity through better tracking and management.",
    },
];

const faqsAR = [
    {
        question: "هل من الممكن استخدام SS Track.io مجانًا؟",
        answer: "نعم، يوفر SS Track.io خطة مجانية مع ميزات محدودة. يمكنك الترقية للحصول على وظائف إضافية.",
    },
    {
        question: "هل يعد SS Track.io أداة فعالة لتتبع النشاط؟",
        answer: "بالطبع! يوفر SS Track.io تتبعًا دقيقًا للنشاطات، مما يساعدك في إدارة المهام بشكل فعال.",
    },
    {
        question: "هل يجب علي تقديم بطاقة الائتمان الخاصة بي؟",
        answer: "لا، يمكنك البدء باستخدام الخطة المجانية دون الحاجة إلى تقديم تفاصيل الدفع.",
    },
    {
        question: "ماذا يحدث إذا تجاوزت حد المستخدمين في الخطة المجانية؟",
        answer: "ستحتاج إلى الترقية إلى خطة مدفوعة لإضافة المزيد من المستخدمين أو الوصول إلى الميزات المميزة.",
    },
    {
        question: "كيف تحمي معلوماتي؟",
        answer: "نحن نستخدم تدابير أمان متقدمة مثل التشفير والأذونات المعتمدة على الدور لحماية بياناتك.",
    },
    {
        question: "هل يساعد في زيادة إنتاجية الفريق؟",
        answer: "نعم، تم تصميم أدواتنا لتحسين الإنتاجية من خلال تتبع وإدارة أفضل.",
    },
];



function FAQ({ onContactButtonClick, language }) {
    const [activeIndex, setActiveIndex] = useState(null);
    const faqs = language === "ar" ? faqsAR : faqsEN;



    const toggleAnswer = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div style={{ padding: "3rem", backgroundColor: "#FFFFFF", textAlign: "center" }}>
            {/* Header */}
            <h2 style={{ fontSize: "44px", fontWeight: "700", color: "#3B3C4E", marginBottom: "1rem" }}>
                {language === "en"
                    ? "Frequently "
                    : "الأسئلة "
                } <span style={{ fontSize: "44px", fontWeight: "700", color: "#7ACB59" }} className="card-title-responsive">{language === "en" ? "Asked Questions" : "المتكررة"}
                </span>
            </h2>
            <p style={{ fontSize: "16px", fontWeight: "400", color: "#555555", marginBottom: "2rem" }} className="card-subtitle-responsive" >
                {language === "en"
                    ? "You've finally decided to take the leap and talk to a psychic (great!)."
                    : "لقد قررت أخيرًا أن تأخذ خطوة وتحدث إلى عراف (رائع!)."}

            </p>

            {/* FAQ List */}
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        style={{
                            backgroundColor: "#FBFBFF99",
                            marginBottom: "1rem",
                            borderRadius: "10px",
                            overflow: "hidden",
                            border: "1.24px solid rgba(0, 0, 0, 0.1)",

                        }}
                    >
                        <button
                            onClick={() => toggleAnswer(index)}
                            style={{
                                width: "100%",
                                background: "none",
                                border: "none",
                                textAlign: language === "ar" ? "right" : "left", // Align text based on language
                                padding: "1rem",
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#3B3C4E",
                                cursor: "pointer",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexDirection: language === "ar" ? "row-reverse" : "row", // Reverse layout for Arabic
                            }}
                            className="card-subtitle-responsive"
                        >
                            {faq.question}
                            <span style={{ fontSize: "20px", fontWeight: "700", color: "#7ACB59" }}>
                                {activeIndex === index ? "−" : <i className="fa fa-chevron-down" style={{
                                    color: "black",
                                    fontSize: "13px",
                                    marginLeft: "5px",
                                }}></i>}
                            </span>
                        </button>
                        {activeIndex === index && (
                            <p
                                style={{
                                    padding: "1rem",
                                    fontSize: "13px",
                                    fontWeight: "500",
                                    color: "#555555",
                                    borderTop: "1px solid #E0E0E0",
                                }}
                                className="card-subtitle-responsive"
                            >
                                {faq.answer}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* More Questions Button */}
            <button
                style={{
                    marginTop: "2rem",
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#7ACB59",
                    color: "#FFFFFF",
                    fontSize: "15px",
                    fontWeight: "normal",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
                className="card-title-responsive"
                onClick={onContactButtonClick}
            >
                {language === "ar" ? "المزيد من الأسئلة →" : "More Questions →"}

            </button>
        </div >
    );
}

export default FAQ;

import React, { useState, useRef, useEffect } from "react";
import Lottie from "lottie-react";

const iconURLs = {
  briefcase: "https://lottie.host/09aa57a7-6c21-4f3b-8b3e-2100e3c28b3f/H8LVc0EPgO.json",
  clock: "https://lottie.host/9e1c6124-3d10-4b91-a12b-e7dcdbfdedc0/8ubI5HXUYO.json",
  chart: "https://lottie.host/e92cb9e5-2ae6-4708-a1b4-91120f26a76d/UOlJFaKRAv.json",
  desktop: "https://lottie.host/b6dca08a-d25d-4ed6-b151-2a5577b991c8/oXUVv9Qgmh.json",
  lock: "https://lottie.host/7cb66311-0f3d-47a7-8fa3-57ef4d6cf8eb/ZOrEkXgq1h.json",
  mobile: "https://lottie.host/00a1f55a-5edb-4682-b248-64bb2e5fdf63/xMehEKPXPr.json"
};

const translations = {
  en: {
    title: "SS Track Guide",
    expand: "Expand All",
    collapse: "Collapse All",
    steps: [
      "Employers – How to Use SS Track",
      "Mobile Punch System, Punctuality, and Break Management",
      "Reports – View Summary Reports & Productivity Insights",
      "Employees – Desktop Application Usage",
      "Addressing Misconceptions – Privacy and Tracking",
      "Mobile App Usage"
    ],
    contents: [
      [
        "Managing your workforce has never been easier. With SS Track, you can seamlessly monitor attendance, set and adjust employee schedules, manage vacations and leave requests, and oversee training sessions directly through your dashboard.",
        "Effortlessly issue pay stubs and use powerful reporting tools for clear insights. SS Track puts employee management at your fingertips—anywhere, anytime."
      ],
      [
        "SS Track's mobile punch system makes clocking in and out effortless. Monitor punctuality, manage break times, and maintain accuracy through intuitive interfaces.",
        "Our HR-focused tools ensure compliance and streamline management of breaks, schedules, training, and vacation time. SS Track—the ultimate solution to enhance your team's productivity and punctuality."
      ],
      [
        "Gain valuable insights into employee work patterns with detailed reports. Monitor active work hours, assigned projects, pay rates, and productivity levels.",
        "These insights help optimize performance and ensure efficient workforce management by aligning employee efforts with company goals."
      ],
      [
        "SS Track empowers you to manage your workday easily. Using our desktop application, simply press 'Play' to begin tracking your time.",
        "Rest assured, SS Track only tracks when active and automatically stops after 20 minutes of inactivity—unless otherwise specified by your employer.",
        "Your privacy is important to us, and transparency is key. Use SS Track to effortlessly manage your daily tasks, breaks, schedules, and training updates."
      ],
      [
        "We know privacy matters. SS Track respects your boundaries by only tracking when you actively choose to start recording your workday.",
        "Tracking automatically stops after 20 minutes of inactivity to ensure your privacy, unless specific permissions have been set by your employer.",
        "Clear, transparent, and trustworthy—that’s the SS Track promise."
      ],
      [
        "Stay connected with the SS Track mobile app. Easily start and stop your tracking while on the move, access your schedule, request vacation or leave, and view updates in real-time.",
        "Our mobile app ensures you’re always informed and organized, wherever work takes you."
      ]
    ]
  },
  ar: {
    title: "دليل SS Track",
    expand: "عرض الكل",
    collapse: "إخفاء الكل",
    steps: [
      "أصحاب العمل - كيفية استخدام SS Track",
      "نظام الحضور، إدارة الدقة والاستراحات",
      "التقارير - عرض ملخص وتقارير الإنتاجية",
      "الموظفون - استخدام تطبيق سطح المكتب",
      "تصحيح المفاهيم - الخصوصية والتتبع",
      "استخدام تطبيق الهاتف المحمول"
    ],
    contents: [
      [
        "إدارة القوى العاملة أصبحت أسهل من أي وقت مضى. يمكنك باستخدام SS Track متابعة الحضور، تعديل الجداول، إدارة الإجازات والتدريب من لوحة التحكم مباشرة.",
        "أصدر كشوف الرواتب بسهولة واستخدم أدوات التقارير للحصول على رؤى واضحة. SS Track في متناول يدك في أي وقت ومكان."
      ],
      [
        "نظام الحضور عبر الهاتف من SS Track يجعل تسجيل الدخول والخروج سهلاً. راقب الدقة، نظم الاستراحات، وحقق الدقة من خلال واجهات سهلة الاستخدام.",
        "أدواتنا تضمن الامتثال وتسهل إدارة الجداول، التدريب، والإجازات. SS Track هو الحل الأمثل لزيادة إنتاجية فريقك."
      ],
      [
        "احصل على رؤى مفصلة حول أنماط عمل الموظفين باستخدام تقارير دقيقة. راقب ساعات العمل، المشاريع، الرواتب، ومستويات الإنتاجية.",
        "تساعد هذه البيانات على تحسين الأداء وضمان إدارة فعالة للقوى العاملة."
      ],
      [
        "يمنحك SS Track القدرة على إدارة يوم عملك بسهولة. اضغط على 'تشغيل' في التطبيق لبدء تتبع وقتك.",
        "يتم التتبع فقط أثناء النشاط ويتوقف تلقائيًا بعد 20 دقيقة من عدم التفاعل، ما لم يحدد صاحب العمل خلاف ذلك.",
        "خصوصيتك مهمة لنا، والشفافية هي الأساس. استخدم SS Track لإدارة مهامك اليومية واستراحاتك وتدريباتك."
      ],
      [
        "نحن ندرك أهمية الخصوصية. لا يقوم SS Track بالتتبع إلا عندما تبدأ العمل بنفسك.",
        "يتوقف التتبع تلقائيًا بعد 20 دقيقة من الخمول، ما لم يتم تحديد إذن مختلف من قبل صاحب العمل.",
        "واضح، شفاف، وموثوق — هذا هو وعد SS Track."
      ],
      [
        "ابقَ على اتصال مع تطبيق SS Track. ابدأ التتبع وأوقفه بسهولة أثناء التنقل، واطلع على الجداول وقدم طلبات الإجازة.",
        "يضمن لك تطبيقنا البقاء على اطلاع وتنظيم أينما كنت."
      ]
    ]
  }
};

const Section = ({ title, content, iconUrl, id, index, expandAll, videoStart, language, videoData }) => {
  const [isOpen, setIsOpen] = useState(expandAll);
  const sectionRef = useRef(null);
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    setIsOpen(expandAll);
  }, [expandAll]);

  useEffect(() => {
    fetch(iconUrl).then(res => res.json()).then(setAnimationData);
  }, [iconUrl]);

  const rtl = language === "ar";

  return (
    <div style={{ maxWidth: "1000px", margin: "20px auto", border: "1px solid #e6e9ec", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", direction: rtl ? "rtl" : "ltr" }} ref={sectionRef} id={id}>
      <div onClick={() => setIsOpen(!isOpen)} style={{ padding: "20px 30px", backgroundColor: "#fff", color: "#0E4772", fontSize: "20px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e0e0e0" }}>
        <span style={{ display: "flex", alignItems: "center" }}>
          {animationData && <Lottie animationData={animationData} loop={true} style={{ height: 30, width: 30, marginInlineEnd: 10 }} />}
          Step {index + 1}: {title}
        </span>
        <span style={{ fontSize: "22px" }}>{isOpen ? "−" : "+"}</span>
      </div>
      {isOpen && (
        <div style={{ padding: "30px", backgroundColor: "#fafbfd" }}>
          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, marginBottom: 25 }}>
            <iframe
              src={`https://www.youtube.com/embed/${videoData[index].id}?start=${videoStart}`}

              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={title}
            ></iframe>
          </div>
          {content.map((p, i) => (
            <p key={i} style={{ fontSize: 17, lineHeight: 1.8, color: "#444", marginBottom: 20 }}>{p}</p>
          ))}
        </div>
      )}
    </div>
  );
};

const AllTrainingSections = () => {
  const [expandAll, setExpandAll] = useState(false);
  const [language, setLanguage] = useState("en");
  const t = translations[language];
  const videoData = [
    { id: "tqR7rCIzgxM", start: 0 },
    { id: "n_0Ckc5JXE8", start: 0 },
    { id: "6fz2IMH71UM", start: 0 },
    { id: "1fyVTr4T2sI", start: 0 },
    { id: "exbP3WgSyBE", start: 0 },
    // { id: "7_yMLGrLsoI", start: 0 },
    { id: "To_7qKsb4BE", start: 0 }  // ✅ updated for Step 6

  ];
  return (
    <div style={{ padding: "40px 20px", backgroundColor: "#f4f7f9", minHeight: "100vh", direction: language === "ar" ? "rtl" : "ltr" }}>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <h2 style={{ color: "#0E4772", marginBottom: 20 }}>{t.title}</h2>
        <button onClick={() => setExpandAll(prev => !prev)} style={{ backgroundColor: "#7ACB59", color: "white", padding: "12px 28px", fontSize: "16px", fontWeight: "bold", border: "none", borderRadius: "8px", cursor: "pointer", marginInlineEnd: 20 }}>{expandAll ? t.collapse : t.expand}</button>
        <button onClick={() => setLanguage(language === "en" ? "ar" : "en")} style={{ backgroundColor: "#0E4772", color: "white", padding: "12px 28px", fontSize: "16px", fontWeight: "bold", border: "none", borderRadius: "8px", cursor: "pointer" }}>{language === "en" ? "العربية" : "English"}</button>
      </div>

      {t.steps.map((stepTitle, index) => (
        <Section
          key={index}
          id={`section-${index}`}
          title={stepTitle}
          content={t.contents[index]}
          iconUrl={Object.values(iconURLs)[index]}
          // videoStart={`?start=${videoStartTimes[index]}`}
          videoStart={`${videoData[index].start}`}
          videoData = {videoData}
          expandAll={expandAll}
          index={index}
          language={language}
        />
      ))}
    </div>
  );
};

export default AllTrainingSections;
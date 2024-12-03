import React from "react";
import UserHeader from "../screen/component/userHeader";
// import menu from "../images/menu.webp";
// import loader from "../images/Rectangle.webp";
// import check from "../images/check.webp";
// import circle from "../images/circle.webp";
import saveReport from "../images/reportImg.webp";
import blueArrow from "../images/bluearrow.webp";
import cross from "../images/cross.webp";
import downArrow from "../images/downArrow.webp";
import save from "../images/save.webp";
import excel from "../images/excel.webp";
import share from "../images/share.webp";
import reportButton from "../images/reportButton.webp";
import adminReport from "../images/employee report.webp";
import addButton from "../images/addButton.webp";
import line from "../images/line.webp";
import Footer from "../screen/component/footer";
// import AdminHeader from "./component/adminHeader";
import AdminHead from "../screen/component/adminHeadSection";


function AdminReport2() {
    return (
        <div>
            <UserHeader />
           <AdminHead/>
            <section>
                <div className="container">
                    <div className="userHeader">
                        <div className="headerTop">
                            <img alt="" src={saveReport} />
                            <h5>Summary Report </h5>
                        </div>


                    </div>
                    <div className="mainwrapper">
                        <div className="summaryContainer">
                            <div className="calenderDiv">
                                <div className="calenderInnerDiv">
                                    <div className="dateDiv">
                                        <button>21/10/22</button>
                                        <div><img alt="" src={blueArrow} /></div>
                                        <button>23/10/22</button>

                                    </div>
                                    <div className="dayDiv">
                                        <div>
                                            <p>Today</p>
                                            <p>Yesterday</p>
                                        </div>
                                        <div>
                                            <p>This Week</p>
                                            <p>Last Week</p>
                                        </div>
                                        <div>
                                            <p>This Month</p>
                                            <p>Last Month</p>
                                        </div>
                                        <div>
                                            <p>This Year</p>
                                            <p>Last Year</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="dropdown ">
                                        <button className="btn btn-secondary dropdown-toggle utc5" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            All times are UTC + 5
                                        </button>
                                        <ul className="dropdown-menu utc5Menu">
                                            <li><a className="dropdown-item utc5MenuItem" href="#">Action</a></li>
                                            <li><a className="dropdown-item utc5MenuItem" href="#">Another action</a></li>
                                            <li><a className="dropdown-item utc5MenuItem" href="#">Something else here</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="crossButtonDiv">
                                <div>
                                    <button className="crossButton"><img alt="" src={cross} /></button>
                                    <button className="crossButton">Asad Mehmood</button>
                                </div>
                                <div className="downArrowDiv">
                                    <div><img alt="" src={cross} /></div>
                                    <div><img alt="" src={downArrow} /></div>


                                </div>
                            </div>
                            <div className="crossButtonDiv">
                                <div className="projectFont">
                                    Select Projects
                                </div>
                                <div className="downArrowDiv">
                                    <div><img alt="" src={cross} /></div>
                                    <div><img alt="" src={downArrow} /></div>


                                </div>
                            </div>
                            <div className="crossButtonDiv">
                                <div className="projectFont">
                                    Note contains text
                                </div>

                            </div>
                            <div className="summaryUrl">
                                <p>Summary by project</p>
                                <p>Summary by employee</p>
                                <p>Daily by employee</p>
                                <p>Detailed</p>
                                <p>App & URL</p>
                            </div>
                            <div className="crossButtonDiv">
                                <div className="groupDiv">
                                    <div>
                                        <button className="crossButton"><img alt="" src={cross} /></button>
                                        <button className="crossButton">Group by project</button>
                                    </div>
                                    <div>
                                        <button className="crossButton"><img alt="" src={cross} /></button>
                                        <button className="crossButton">Group by employee</button>
                                    </div>
                                </div>
                                <div className="downArrowDiv">
                                    <div><img alt="" src={cross} /></div>
                                    <div><img alt="" src={downArrow} /></div>


                                </div>
                            </div>
                            <div className="inputCheckboxDiv">
                                <div className="checkBoxDiv">
                                    <p className="inputCheckbox"><input className="checkboxLarge" type="checkbox" />
                                        <p>Only offline activities</p>
                                    </p>
                                    <p className="inputCheckbox"><input type="checkbox" />
                                        <p>Only offline activities</p>
                                    </p>

                                </div>
                                <div className="excelDiv">
                                    <div className="excelInnerDiv">
                                        <div><img alt="" src={excel} /></div>
                                        <p>Excel</p>
                                    </div>
                                    <div className="excelInnerDiv">
                                        <div><img alt="" src={excel} /></div>
                                        <p>Share PDF</p>
                                    </div>
                                    <div className="excelInnerDiv">
                                        <div><img alt="" src={share} /></div>
                                        <p>Share Report </p>
                                    </div>
                                    <div className="excelInnerDiv">
                                        <div><img alt="" src={save} /></div>
                                        <p>Save Report</p>
                                    </div>

                                </div>
                            </div>
                            <div>
                                <img alt="" className="reportButton" src={reportButton} />
                            </div>
                            <div className="summaryButton">
                                <button >Timeline</button>
                                <button className="activeButton">Employees</button>
                                <button>Projects</button>
                                <button>Notes</button>
                                <button>App & URLs</button>
                            </div>
                            <div className="adminReportHour">
                                <div>
                                    <p className="sixtyhour">61h 05m</p>
                                    <p className="dollar102">$102.75</p>
                                    <p className="percent">31 %</p>
                                </div>
                                <div>
                                    <img alt="" src={adminReport} />
                                </div>

                            </div>
                            <div className="employeeDiv">
                                <p>± Employees / ± Projects</p>
                                <div className="durationDiv">
                                    <p>Duration</p>
                                    <p>Money</p>
                                    <p>Activity</p>
                                </div>

                            </div>
                            <div className="asadMehmoodDiv">
                                <div>
                                    <p><img alt="" src={addButton} /><span>Asad Mehmood</span></p>
                                </div>
                                <div className="durationDiv">
                                    <p>36h 52m</p>
                                    <p>$27.64</p>
                                    <p>48 %</p>
                                </div>


                            </div>
                            <div className="asadMehmoodDiv">
                                <div>
                                    <p><img alt="" src={addButton} /><span>Hasaan Soomro</span></p>
                                </div>
                                <div className="durationDiv">
                                    <p>36h 52m</p>
                                    <p>$27.64</p>
                                    <p>48 %</p>
                                </div>


                            </div>
                            <div className="asadMehmoodDiv">
                                <div>
                                    <p><img alt="" src={addButton} /><span>Fatima Zohra</span></p>
                                </div>
                                <div className="durationDiv">
                                    <p>36h 52m</p>
                                    <p>$27.64</p>
                                    <p>48 %</p>
                                </div>


                            </div>
                            <div className="asadMehmoodDiv">
                                <div>
                                    <p><img alt="" src={addButton} /><span>Fatima Zohra</span></p>
                                </div>
                                <div className="durationDiv">
                                    <p>36h 52m</p>
                                    <p>$27.64</p>
                                    <p>48 %</p>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div>
                <img alt="" className="admin1Line" src={line} />
            </div>
            <Footer />
        </div>
    )
}

export default AdminReport2;
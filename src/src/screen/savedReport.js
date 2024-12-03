import React from "react";
import UserHeader from "./component/userHeader";
import menu from "../images/menu.webp";
import loader from "../images/Rectangle.webp";
import check from "../images/check.webp";
import circle from "../images/circle.webp";
import saveReport from "../images/saveReport.webp";
import copy from "../images/copy.webp";
import gallery from "../images/gallery.webp";
import dollar from "../images/dollar.webp";
import expand from "../images/expand.webp";
import edit from "../images/editpen.webp";
import line from "../images/line.webp";
import Footer from "./component/footer";
import UserDashboardSection from "./component/userDashboardsection";

function SavedReport() {
    return (
        <div>
            <UserHeader />
            <UserDashboardSection/>
            <section>
                <div className="container">
                    <div className="userHeader">
                        <div className="headerTop">
                            <img src={saveReport} />
                            <h5>Saved Report </h5>
                        </div>


                    </div>
                    <div className="mainwrapper">
                        <div className="summaryContainer">
                            <div className="reportdiv">
                                <div className="reportLinkDiv">
                                    <p>Name</p>
                                    <p>Shared report link</p>
                                </div>
                                <div>
                                    <p>Action</p>
                                </div>
                            </div>
                            <div className="weeklyReportDiv">
                                <div className="reportsDiv">
                                    <div>Weekly Report</div>
                                    <div className="reportImageDiv">
                                        <p>https://scrin.io/r/96e0b4</p>
                                        <div><img src={copy} /></div>
                                    </div>
                                </div>
                                <div className="actionDiv">
                                    <div className="reportImagesDiv">
                                        <div><img src={gallery}/></div>
                                        <div><img src={dollar}/></div>
                                        <div><img src={expand}/></div>
                                    </div>
                                    <div>
                                        <button className="editButton">
                                            Edit 
                                            <img src={edit}/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="weeklyReportDiv">
                                <div className="reportsDiv">
                                    <div>Weekly Report</div>
                                    <div className="reportImageDiv">
                                        <p>https://scrin.io/r/96e0b4</p>
                                        <div><img src={copy} /></div>
                                    </div>
                                </div>
                                <div className="actionDiv">
                                    <div className="reportImagesDiv">
                                        <div><img src={gallery}/></div>
                                        <div><img src={dollar}/></div>
                                        <div><img src={expand}/></div>
                                    </div>
                                    <div>
                                        <button className="editButton">
                                            Edit 
                                            <img src={edit}/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="weeklyReportDiv">
                                <div className="reportsDiv">
                                    <div>Weekly Report</div>
                                    <div className="reportImageDiv">
                                        <p>https://scrin.io/r/96e0b4</p>
                                        <div><img src={copy} /></div>
                                    </div>
                                </div>
                                <div className="actionDiv">
                                    <div className="reportImagesDiv">
                                        <div><img src={gallery}/></div>
                                        <div><img src={dollar}/></div>
                                        <div><img src={expand}/></div>
                                    </div>
                                    <div>
                                        <button className="editButton">
                                            Edit 
                                            <img src={edit}/>
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
            <img className="summaryLine" src={line}/>
            <Footer/>
        </div>
    )
}

export default SavedReport;
import React from "react";
import menu from "../images/menu.webp";
import loader from "../images/Rectangle.webp";
import group from "../images/Group 35259.webp";
import circle from "../images/circle.webp";
import UserHeader from "../screen/component/userHeader";
import setting from "../images/settingIcon.webp";
import line from "../images/line.webp";
import Footer from "../screen/component/footer";
import AdminHeader from "./component/adminHeader";
import AdminHead from "../screen/component/adminHeadSection";
function AdminClient() {
    return (
        <div>
            {/* <UserHeader /> */}
            <AdminHead/>
            <section>
                <div className="container">
                    <div className="userHeader">
                        <div className="headerTop">
                            <img src={setting} />
                            <h5>Clients</h5>
                        </div>


                    </div>
                    <div className="mainwrapper">
                        <div className="projectContainer">
                            <div className="MainDiv">
                                <div className="clientMaindiv">
                                    <p>No clients yet. Start by creating one. <br/>
                                        Then assign projects to clients and you'll be able to run reports to see time spent on each client.</p>
                                </div>
                                <div className="inviteForms">
                                        <input className="inviteFormInput" type="text" placeholder="Add new employee by email" />
                                        <button className="inviteButton">Add</button>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div>
                <img className="line projectline" src={line}/>
            </div>
            {/* <Footer/> */}
        </div>
    )
}

export default AdminClient;
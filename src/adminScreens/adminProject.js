import React, { useEffect, useState } from "react";
import UserHeader from "../screen/component/userHeader";
import menu from "../images/menu.webp";
import loader from "../images/Rectangle.webp";
import group from "../images/Group 35259.webp";
import circle from "../images/circle.webp";
import setting from "../images/settingIcon.webp";
import straightLine from "../images/Line 3.webp";
import line from "../images/line.webp";
import Footer from "../screen/component/footer";
import AdminHeader from "./component/adminHeader";
import AdminHead from "../screen/component/adminHeadSection";
import ProjectComponent from "./component/projectcomponent";


function AdminProject() {
    const [data, setData] = useState([]);
    const [name, setName] = useState('');
    const [projectId, setProjectId] = useState();
    const [fixId, setFixid] = useState();
    const token = localStorage.getItem("token");
    const headers = {
        Authorization: "Bearer " + token,
    };
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const getData = async () => {
        try {

            const response = await fetch(`${apiUrl}/superAdmin/`, { headers, method: "GET" });

            if (response.ok) {
                const json = await response.json();
                // console.log(json);
                setData(json)
                setFixid(json[0]._id)

            } else {
                console.log('Failed to create object:', response.status, response.statusText);
            }
        } catch (err) {
            // console.log(err);
        }

    }
    useEffect(() => {
        getData()
    }, [])
    const createProject = async () => {
        try {
            const response = await fetch(`${apiUrl}/superAdmin/addProject`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...headers
                    },
                    body: JSON.stringify({
                        name: name
                    }),
                }
            )
            if (response.ok) {
                const json = await response.json();
                // console.log(json);
            } else {
                console.log('Failed to create object:', response.status, response.statusText);
            } console.log(response);

        } catch (err) {
            console.log(err);
        }
    }
    const moveId = (projectId) => {
        setProjectId(projectId)
    }



    return (
        <div>
            {/* <UserHeader /> */}
            <section>
                <div className="container">
                    <div className="userHeader">
                        <div className="headerTop">
                            <img src={setting} />
                            <h5>Project</h5>
                        </div>


                    </div>
                    <div className="mainwrapper">
                        <div className="projectContainer">
                            <div className="settingMainDiv">
                                <div>
                                    <div className="inviteForm">
                                        <input onChange={(e) => setName(e.target.value)} className="inviteFormInput" type="text" placeholder="Add New Project" />
                                        <button onClick={createProject} className="inviteButton">Create</button>
                                    </div>
                                    {/* <div>
                                        <button className="screenshotButton activeButtonClass">
                                            <div className="projectTabishDiv">
                                                <button className="buttonOne">1</button>
                                                <p>Administration</p>

                                            </div>
                                            <div className="groupProject">
                                                <div><img src={group} /></div>
                                                <div>3</div>
                                            </div>
                                        </button>
                                    </div> */}
                                    <div>
                                        {data && data.map((element, index) => {

                                            return (
                                                <div onClick={() => moveId(element._id)}>
                                                    {/* {console.log(element)} */}
                                                    <button className="screenshotButton">
                                                        <div className="projectTabishDiv">
                                                            <button className="buttonOne">{index + 1}</button>
                                                            <p>{element.name}</p>

                                                        </div>
                                                        <div className="groupProject">
                                                            <div><img src={group} /></div>
                                                            <div>{element.userId.length}</div>
                                                        </div>
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div>
                                    <img src={straightLine} />
                                </div>
                                <div className="projectRightDiv">
                                    <ProjectComponent id={projectId ? projectId : fixId} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div>
                <img className="line" src={line} />
            </div>
            {/* <Footer /> */}
        </div>
    )
}

export default AdminProject;
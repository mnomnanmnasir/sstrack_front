import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import useLoading from '../../hooks/useLoading';
import axios from 'axios';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import archiveIcon from "../../images/archive.svg";
import inviteIcon from "../../images/invitation.svg";
import { AiOutlineUser, AiFillCrown, AiFillStar } from 'react-icons/ai';
import OwnerTeamComponent from '../../companyOwner/ownerTeamComponent';
import line from "../../images/Line 3.webp";

import { useSocket } from '../../io';
import { useQuery, useQueryClient } from 'react-query';
import Projectcomponent from '../Project/Component/projectcomponent';
import jwtDecode from 'jwt-decode';
import Joyride from 'react-joyride';



const Project = () => {
    const [run, setRun] = useState(true);
    const [stepIndex, setStepIndex] = useState(0);
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const [email, setEmail] = useState("");
    const [deleteType, setDeleteType] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();
    const { loading, setLoading, loading2, setLoading2 } = useLoading();
    const [payrate, setPayrate] = useState(null);
    const [inviteStatus, setInviteStatus] = useState("");
    const [isUserArchive, setIsUserArchive] = useState(false);
    const [isArchived, setIsArchived] = useState(true);
    const [activeId, setActiveId] = useState(null);
    const [mainId, setMainId] = useState(null);
    const [users, setUsers] = useState(null);
    const [project, setproject] = useState(null);
    const [allowemp, setAllowemp] = useState([]);
    const [projectName, setProjectName] = useState("");

    // const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";

    const token = localStorage.getItem('token');
    const headers = {
        Authorization: "Bearer " + token,
    };
    const steps = [
        {
            target: '#addUserButton',
            content: 'here you can invite and add new users to your team',
            // disableBeacon: true,
            continuous: true,
        },
        {
            target: '#lisstofallusers',
            content: 'here you can see all your team members and control their roles',
            // disableBeacon: true,
            // continuous: true,
        },

    ];
    const handleJoyrideCallback = (data) => {
        const { action, index, status } = data;

        if (action === "next") {
            setStepIndex(index + 1);
        }
        if (status === "finished" || status === "skipped") {
            setRun(false); // End the tour when finished
        }
    };
    const user = jwtDecode(token);

    // Get the query client at the top level
    const queryClient = useQueryClient();

    const fetchProject = async () => {
        // console.log("me chlaaaaaaaa");
        const response = await axios.get(`${apiUrl}/superAdmin/getProjects`, { headers });
        // const response = await axios.get(`${apiUrl}/superAdmin/getProjects`, { headers });
        return response.data;  // React Query will handle the response status internally
    };

    const getManagerTeam = async () => {
        setLoading(true);
        try {
            setLoading2(true);
            const response = await axios.get(`${apiUrl}/manager/employees`, { headers });
            if (response.status) {
                setLoading(false);
                setLoading2(false);
                setUsers(() => {
                    const filterCompanies = response?.data?.convertedEmployees?.sort((a, b) => {
                        if (a.inviteStatus !== b.inviteStatus) {
                            return a.inviteStatus ? 1 : -1;
                        }
                        if (a.isArchived !== b.isArchived) {
                            return a.isArchive ? 1 : -1;
                        }
                        return 0;
                    });
                    return filterCompanies;
                });
            }
        } catch (err) {
            console.log(err);
            setLoading(false);
            setLoading2(false);
        }
    };

    useEffect(() => {
        if (project && project.length > 0) {
            const firstProject = project[0];
            setMainId(firstProject._id);
            setActiveId(firstProject._id);
            setIsUserArchive(firstProject?.isArchived ? false : true);
            setInviteStatus(firstProject?.inviteStatus || false);
            setPayrate(firstProject);
            setSelectedUser(firstProject);
            setProjectName(firstProject?.name);
            setAllowemp(firstProject?.allowedEmployees || []);
        }
    }, [project]);

    useEffect(() => {
        fetchProject();
    }, []);

    const { data: project1, isLoading, isError, refetch } = useQuery({
        queryKey: ['projects'],
        queryFn: fetchProject,
        select: (data) => {
            console.log('projectssss=============', data);
            return data?.projects;
        },
        onError: (error) => {
            console.log(error);

            // enqueueSnackbar(error.response?.data?.message , {
            //     variant: "error",
            //     anchorOrigin: { vertical: "top", horizontal: "right" }
            // });
        }
    });
    //only for last project 
    const handleSetProjectConditionally = () => {
        if (project.length === 1) {
            setproject([]); // Clear the project array if it has exactly one project
        } else {
          console.log("Project array has more than one project, no changes made.");
        }
      };
      
          //only for last project 
    useEffect(() => {
        if (project1) {
            setproject(project1);
            console.log('====================================');
            console.log('setprooject');
            console.log('====================================');
        }
    }, [project1]);

    const handleSendInvitation = async () => {
        setEmail('')
        if (email !== "") {
            setShow3(false);
            try {
                const res = await axios.post(`${apiUrl}/superAdmin/addProject`, {
                    name: email,
                    description: "just test project",
                }, {
                    headers: headers,
                });
                if (res.status) {
                    queryClient.invalidateQueries('projects');
                    enqueueSnackbar("Added successfully", {
                        variant: "success",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    });
                }
                console.log("addproject RESPONSE =====>", res);
            } catch (error) {
                enqueueSnackbar(error?.response?.data?.message ? error?.response?.data?.message : "Network error", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                });
                console.log("catch error =====>", error);
                queryClient.invalidateQueries('projects');  // Invalidate the 'projects' query even if there's an error
            }
        } else {
            enqueueSnackbar("PLease Enter Project Name", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            });
        }
    };

    return (
        <div>
           {user?._id === "679b223b61427668c045c659" && (
                <Joyride
                    steps={steps}
                    run={run}
                    callback={handleJoyrideCallback}
                    showProgress
                    showSkipButton
                    continuous
                    scrollToFirstStep
                />
            )}
            <SnackbarProvider />
            <div className="container">
                <div className="userHeader">
                    <div>
                        <h5>Projects</h5>
                    </div>
                </div>
                <div className="mainwrapper">
                    <div className="ownerTeamContainer">
                        <div className="d-flex gap-3">
                            <div style={{ width: "350px" }}>
                                <>
                                    <div
                                    id="addUserButton"
                                    style={{
                                        marginTop: "20px",
                                        display: "flex",
                                        width: '350px',
                                        justifyContent: "space-between"
                                    }}>
                                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="New Project Name..." style={{
                                            fontSize: "18px",
                                            padding: "6px 10px",
                                            width: "100%",
                                            border: "1px solid #cacaca",
                                            outline: "none",
                                            borderTopLeftRadius: '5px',
                                            borderBottomLeftRadius: '5px',
                                        }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleSendInvitation();
                                                }
                                            }}
                                        />
                                        <button style={{
                                            backgroundColor: "#7acb59",
                                            borderTopRightRadius: "4px",
                                            borderBottomRightRadius: "4px",
                                            padding: "10px 25px",
                                            color: "white",
                                            border: "none",
                                        }} onClick={handleSendInvitation}>
                                            Create
                                        </button>
                                    </div>
                                </>

                                <div className="companyFont">
                                    <p style={{
                                        margin: 0,
                                        padding: 0,
                                        fontSize: "20px",
                                        color: "#0E4772",
                                        fontWeight: "600",
                                    }}>Total</p>
                                    <div style={{
                                        backgroundColor: "#28659C",
                                        color: "white",
                                        fontSize: "600",
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        {project?.length}
                                    </div>
                                </div>
                                <div  id="lisstofallusers" >
                                    {project?.map((e, i) => {
                                        return (
                                            <div className={`adminTeamEmployess ${activeId === e._id ? "activeEmploy" : ""} align-items-center`} onClick={() => {
                                                setMainId(e._id);
                                                setActiveId(e._id);
                                                setIsArchived(e.isArchived)
                                                setIsUserArchive(e?.isArchived ? false : true);
                                                setInviteStatus(false);
                                                setPayrate(e);
                                                setSelectedUser(e);
                                                setAllowemp(e?.allowedEmployees);
                                                setProjectName(e?.name);
                                            }}>
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: '100%' }}>
                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                        <div className="groupContentMainImg">
                                                            <p>{i + 1}</p>
                                                        </div>
                                                        <p className="groupContent" style={{ color: e?.isArchived ? 'grey' : 'inherit' }}>{e?.name}</p>
                                                    </div>
                                                    {e?.inviteStatus === true ? (
                                                        <div style={{
                                                            marginRight: "3px",
                                                            padding: "3px 10px",
                                                            borderRadius: "3px",
                                                            color: "#fff",
                                                            fontSize: "12px",
                                                            lineHeight: 1.4,
                                                        }}>
                                                            <img width={30} src={inviteIcon} />
                                                        </div>
                                                    ) : e?.isArchived === true ? (
                                                        <div style={{
                                                            marginRight: "3px",
                                                            padding: "3px 10px",
                                                            borderRadius: "3px",
                                                            color: "#fff",
                                                            fontSize: "12px",
                                                            lineHeight: 1.4,
                                                        }}>
                                                            <img width={30} src={archiveIcon}
                                                                style={{ filter: "grayscale(100%) brightness(100%) contrast(100%)" }}
                                                            />
                                                        </div>
                                                    ) : null}
                                                </div>
                                                {e?.userType === "owner" ? (
                                                    <div>
                                                        <AiFillStar color="#e7c741" size={20} />
                                                    </div>
                                                ) : e?.userType === "admin" ? (
                                                    <div>
                                                        <AiFillStar color="#28659C" size={20} />
                                                    </div>
                                                ) : e?.userType === "manager" && (
                                                    <div style={{ backgroundColor: "#5CB85C", width: 80, padding: "5px 10px", borderRadius: "3px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                        <AiOutlineUser color="white" size={20} />
                                                        <p style={{ margin: 0, fontWeight: "600", color: "white" }}>{e?.assignedUsers?.filter(f => f !== user._id)?.length}</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div>
                                <img src={line} style={{ height: '100%' }} />
                            </div>
                            <div style={{ width: "100%", display: mainId === null ? "flex" : "", justifyContent: mainId === null ? "" : "", alignItems: mainId === null ? "" : "" }}>
                                <Projectcomponent
                                    fixId={mainId}
                                    archived_unarchived_users={() => setShow2(true)}
                                    deleteUser={() => setShow(true)}
                                    isArchived={isArchived}
                                    setIsUserArchive={setIsUserArchive}
                                    isUserArchive={isUserArchive}
                                    inviteStatus={inviteStatus}
                                    handleSendInvitation={handleSendInvitation}
                                    payrate={payrate}
                                    users={users}
                                    setUsers={setUsers}
                                    selectedUser={selectedUser}
                                    allowEmp={allowemp}
                                    setAllowemp={setAllowemp}
                                    projectName={projectName}
                                    getData={refetch}
                                    handleSetProjectConditionally={handleSetProjectConditionally}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Project;

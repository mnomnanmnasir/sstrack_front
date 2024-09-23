import React, { useEffect, useState } from "react";
import useLoading from "../../hooks/useLoading";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import axios from "axios";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import '../../../node_modules/sweetalert2/src/sweetalert2.scss'
import settingIcon from '../../images/setting-icon.svg'
import Modal from 'react-bootstrap/Modal';

function SystemAdminComponent(props) {

    const { loading, setLoading } = useLoading()
    const data = props.fixComponent;
    const fixId = props.fixId;
    const show = props.show;
    const setShow = props.setShow;
    const companyId = props?.fixComponent?.owner?._id
    const companyName = props?.fixComponent?.owner?.company
    const company = data?.owner?.company;
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    let token = localStorage.getItem('adminToken');
    const companyStatus = props?.fixComponent?.owner?.isArchived;
    const [companyDetail, setCompanyDetail] = useState(null)
    console.log("asdada")
    const headers = {
        Authorization: "Bearer " + token,
    };

    const getData = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${apiUrl}/SystemAdmin/getCompany/${company}`, { headers });
            if (response.status) {
                setCompanyDetail(response.data)
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
        }
    }

    const enable_disable_company = async (isArchived) => {
        setShow(false)
        try {
            const response = await axios.patch(`${apiUrl}/SystemAdmin/archived/${companyName}`, {
                isArchived: isArchived
            }, {
                headers,
            });
            if (response.status) {
                console.log(response);
                enqueueSnackbar(response?.data?.message, {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
                props.getCompanies()
            }
        } catch (error) {
            // enqueueSnackbar(error?.response?.data?.message ? error?.response?.data?.message : "Network error", {
            //     variant: "error",
            //     anchorOrigin: {
            //         vertical: "top",
            //         horizontal: "right"
            //     }
            // })
            console.log("catch error ===>", error);
        }
    }

    useEffect(() => {
        getData()
    }, [company])

    console.log("props ===>", props);

    return (
        <>
            {show ? <Modal show={show} onHide={() => setShow(false)} animation={false} centered>
                <Modal.Body>
                    <p style={{ marginBottom: "20px", fontWeight: "700", fontSize: "16px" }}>Are you sure want to disable company ?</p>
                </Modal.Body>
                <Modal.Footer>
                    <button className="teamActionButton" onClick={enable_disable_company}>
                        {props.isUserArchive ? "ENABLE" : "DISABLE"}
                    </button>
                    <button className="teamActionButton" onClick={() => setShow(false)}>
                        CANCEL
                    </button>
                </Modal.Footer>
            </Modal> : null}
            <SnackbarProvider />
            {fixId ? (
                <>
                    <div className="d-flex justify-content-end">
                        {props.isUserArchive ? <button onClick={() => setShow(true)} className="btn btn-success d-flex justify-content-end">Enable Company</button> : <button onClick={() => setShow(true)} className="btn btn-danger d-flex justify-content-end">Disable Company</button>}
                    </div>
                    <div style={{ marginBottom: 30 }}>
                        <p className="employeeDetail">Company Details</p>
                    </div>
                    <p className="employeeDetailName1">{props?.fixComponent?.owner?.name}</p>
                    <p className="employeeDetailName2">{props?.fixComponent?.owner?.email}</p>
                    <div style={{ margin: "30px 0" }}>
                        <p className="employeeDetail">Employees</p>
                    </div>
                    {/* {loading ? (
                        <Skeleton count={1} width="100%" height="600px" style={{ margin: "0" }} />
                    ) : companyDetail && companyDetail?.totalHoursByEmployee?.map((element, index) => {
                        return (
                            <>
                                <div className={`colored-div ${index % 2 === 0 ? 'even-background mainBackground' : 'odd-background mainBackground '}`} key={index}>
                                    <p> {element?.name} <img src={element?.userType === "owner" ? owners : null} /></p>
                                    <p>Today Working Hour : {element?.totalHours?.daily?.hours} hours {element?.totalHours?.daily?.minutes} minutes</p>
                                </div>
                            </>
                        );
                    }) */}
                </>
            ) : <img width={500} src={settingIcon} alt="" style={{ display: "block", margin: "auto" }} />}
        </>
    )
}

export default SystemAdminComponent;
import React from "react";
import logo from '../../images/popHeadLogo.png'
import line from '../../images/line.webp'


function AdminHeader(){
    const items = JSON.parse(localStorage.getItem('items'));
    return(
        <section>
        <nav className="container navbar navbar-expand-lg navbar-dark">
            <div className="container-fluid">
              <div><a className="navbar-brand" href="#"><img className="logo" src={logo} /></a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button></div>
                {/* <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#">Demo</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#">Pricing</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#">Download</a>
                        </li>

                    </ul>
                   
                </div> */}
                 <div className="d-flex amButton" role="search">
                        <p>Admin</p>
                        <button className="userName">A</button>
                    </div>
            </div>
        </nav>
        <img className="line" src={line} />
    </section>
    )
}


export default AdminHeader;


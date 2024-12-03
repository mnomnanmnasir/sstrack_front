import React, { Component } from 'react';
import SaSidebar from './component/sidebar/saSidebar';

export class saMain extends Component {
  render() {
    return (
      <div className="maininputdivs" >
        <SaSidebar />
        <p className="accessFont">Login your account</p>
      </div>
    );
  }
}

export default saMain;

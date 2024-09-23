import React from 'react';
import back_to_top from '../../images/backToTop.svg'

const BackToTop = () => {
    return (
        <div onClick={() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }} style={{
            position: "fixed",
            right: 20,
            bottom: 20,
            cursor: "pointer"
        }}>
            <img width={60} src={back_to_top} alt='' style={{
                transform: "rotateZ(360deg)"
            }} />
        </div>
    );
}

export default BackToTop;
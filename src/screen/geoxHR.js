import React, { useRef, useEffect } from 'react';

const GeoxHR = () => {

    const url = 'http://15.156.80.22:8000/login';

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <iframe
                title="GeoxHR"
                style={{ width: '100%', height: '100%' }}
                src={url}
                allowFullScreen
            />
        </div>
    );
}

export default GeoxHR;

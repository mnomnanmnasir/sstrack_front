import React, { useState } from 'react';

const useLoading = () => {
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    return {
        loading, 
        setLoading,
        loading2,
        setLoading2,
    }
}

export default useLoading;
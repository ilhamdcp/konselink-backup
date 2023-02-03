import {ScaleLoader} from 'halogenium';
import React from 'react';
import '../assets/css/Loader.css'

const Loader = () => {
    return (
        <div className="Loader">
            <div className="loader-item">
                <ScaleLoader color="#6898bb" size="38px" />
            </div>
        </div>
    )
}

export default Loader;
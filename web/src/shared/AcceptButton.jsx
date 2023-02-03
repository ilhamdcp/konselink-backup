import React from 'react';
import logo from '../assets/check.png'
import '../assets/css/AcceptButton.css'

class AcceptButton extends React.Component {


    render() {
        return(
            <div className="AcceptButton" onClick={() => this.props.verify(this.props.id)}>
                <a className="button-text">
                <img src={logo} width="30px" height="30px" className="button-image"></img>
                Terima
                </a>
            </div>
        )
    }
}

export default AcceptButton
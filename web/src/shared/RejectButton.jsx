import React from 'react';
import logo from '../assets/close.png'
import '../assets/css/RejectButton.css'

class RejectButton extends React.Component {
    doAction() {
        alert('rejected')
    }

    render() {
        return(
            <div className="RejectButton" onClick={() => this.doAction()}>
                <a>
                <img src={logo} width="30px" height="30px" className="button-image"></img>
                Tolak
                </a>
            </div>
        )
    }
}

export default RejectButton
import React from 'react'
import '../assets/css/UserCard.css'
import ImageComponent from './ImageComponent'
import AcceptButton from '../shared/AcceptButton'
import RejectButton from '../shared/RejectButton'

class CounselorCard extends React.Component {
	constructor(props) {
		super(props)
	}

    render() {
        return(
			<div className="user-item-card">
					<div className="user-data">
						<p className="user-name">Nama: {this.props.name}</p>
						<p className="client-data">Spesialisasi: {this.props.specialization == null ? "-" : this.props.specialization}</p>
						<p className="client-data">Nomor SIP: {this.props.sipNumber == null ? "-" : this.props.sipNumber}</p>
                        <p className="client-data">Nomor SSP: {this.props.sspNumber == null ? "-" : this.props.sspNumber}</p>
                        <p className="client-data">Nomor STR: {this.props.strNumber == null ? "-" : this.props.strNumber}</p>
					</div>
					<div className="user-action">
						<AcceptButton id={this.props.id} verify={this.props.verifyCounselor} fetchCounselor={this.props.fetchCounselor}/>
					</div>
					
			</div>
        )
    }
}

export default CounselorCard;
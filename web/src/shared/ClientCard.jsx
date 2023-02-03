import React from 'react'
import '../assets/css/UserCard.css'
import ImageComponent from './ImageComponent'
import AcceptButton from '../shared/AcceptButton'
import { withRouter } from 'react-router'


class ClientCard extends React.Component {
	constructor(props) {
		super(props)
	}

	getClientDetail() {
		this.props.history.push(`/detail/${this.props.id}`)
	}

    render() {
        return(
			<div className="user-item-card" onClick={() => this.getClientDetail()}>
					<div className="user-data">
						<p className="user-name">Nama lengkap: {this.props.name == null ? "-" : this.props.name}</p>
						<p className="client-data">NPM: {this.props.npm == null ? "-" : this.props.npm}</p>
						<p className="client-data">Fakultas: {this.props.faculty  == null ? "-" : this.props.faculty}</p>
					</div>
					<div className="user-action">
						<AcceptButton id={this.props.id} verify={this.props.verifyClient} fetchClient={this.props.fetchClient}/>
					</div>
					
			</div>
        )
    }
}

export default withRouter(ClientCard)
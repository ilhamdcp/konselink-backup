import React from 'react'
import '../assets/css/Client.css';
import Loader from '../shared/Loader';
import ClientCard from '../shared/ClientCard';
import { withRouter } from 'react-router'

class Client extends React.Component {
    constructor() {
        super();
        this.state = {
            isLoading: false,
            pageNo: 1,
            entrySize: 15,
            clients: [],
            totalPage: 1
        };

        this.fetchClient = this.fetchClient.bind(this);
    }

    componentDidMount() {
        this.fetchClient();
    }

    async fetchClient() {
        this.setState({isLoading: true})
        const response = await fetch(`https://konselink.herokuapp.com/admin/list/klien?pageNo=${this.state.pageNo}&entrySize=${this.state.entrySize}`, {

            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("TOKEN")}`
            }
        });

        const body = await response.json();

        this.setState({clients: body.data, isLoading: false, totalPage: body.totalPage});
    }

    retrievePrev() {
        if(this.state.pageNo > 1) {
            this.setState({pageNo: this.state.pageNo - 1}, () => {
                this.fetchClient();
            });
        } else {
            alert("Halaman sudah paling awal");
        }
    }

    retrieveNext() {
        if (this.state.pageNo < this.state.totalPage) {
            this.setState({pageNo: this.state.pageNo + 1}, () => {
                this.fetchClient();
            });
        }
    }

    async verifyClient(id) {
        const response = await fetch(`https://konselink.herokuapp.com/admin/verify/klien/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("TOKEN")}`
            }
            
        });
        const body = await response.json();
        console.log(body);
        if (body.code == 200) {
            alert("Sukses verifikasi klien")
            this.fetchClient();
        }
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div className="User">
                    <Loader />
                </div>
            )
        } else if (this.state.clients.size == 0) {
            return (
                <h1>Tidak ada data</h1>
            )
        }
        
        else {
            return(
                <div className="User">
                    <div className="page-nav">
                        <div onClick={() => this.retrievePrev()} className={this.state.pageNo > 1 ? "page-nav-button" : "page-nav-button-disabled"}>Prev</div>
                        <div onClick={() => this.retrieveNext()} className={this.state.pageNo < this.state.totalPage ? "page-nav-button" : "page-nav-button-disabled"}>Next</div>
                    </div>
                    {
                        this.state.clients.map( client => {
                                return <ClientCard id={client.id} name={client.name} npm={client.npm} faculty={client.faculty} displayPictureUrl={client.displayPictureUrl} key={client.id} verifyClient={this.verifyClient} fetchClient={this.fetchClient}/>
                            }
                            
                        )
                    }
                </div>
            )
        }
    }
}

export default withRouter(Client);
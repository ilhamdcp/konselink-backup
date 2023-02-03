import React from 'react'
import '../assets/css/Client.css';
import Loader from '../shared/Loader';
import CounselorCard from '../shared/CounselorCard';

class Counselor extends React.Component {
    constructor() {
        super();
        this.state = {
            isLoading: false,
            pageNo: 1,
            entrySize: 20,
            counselors: [],
            totalPage: 1
        };

        this.fetchCounselor = this.fetchCounselor.bind(this);
        this.verifyCounselor = this.verifyCounselor.bind(this);
    }

    componentDidMount() {
        this.fetchCounselor();
    }

    async fetchCounselor() {
        this.setState({isLoading: true, counselors: []})
        const response = await fetch(`https://konselink.herokuapp.com/admin/list/psikolog?pageNo=${this.state.pageNo}&entrySize=${this.state.entrySize}`, {

            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("TOKEN")}`
            }
        });

        const body = await response.json();

        this.setState({counselors: body.data, isLoading: false, totalPage: body.totalPage})

        console.log(body);
    }

    retrievePrev() {
        if(this.state.pageNo > 1) {
            this.setState({pageNo: this.state.pageNo - 1}, () => {
                this.fetchCounselor();
            });
        } else {
            alert("Halaman sudah paling awal");
        }
    }

    retrieveNext() {
        if (this.state.pageNo < this.state.totalPage) {
            this.setState({pageNo: this.state.pageNo + 1}, () => {
                this.fetchCounselor();
            });
        }
    }

    async verifyCounselor(id) {
        const response = await fetch(`https://konselink.herokuapp.com/admin/verify/psikolog/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("TOKEN")}`
            }
            
        });
        const body = await response.json();
        console.log(body);
        if (body.code == 200) {
            alert("Sukses verifikasi psikolog")
            this.fetchCounselor();
        }
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div className="User">
                    <Loader />
                </div>
            )
        } else if (this.state.counselors.size == 0) {
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
                        this.state.counselors.map( counselor => {
                                return <CounselorCard name={counselor.name}
                                id={counselor.id} 
                                specialization={counselor.specialization} 
                                sipNumber={counselor.sipNumber}
                                sspNumber={counselor.sspNumber}
                                strNumber={counselor.strNumber}
                                displayPictureUrl={counselor.displayPictureUrl}
                                fetchCounselor={this.fetchCounselor}
                                verifyCounselor={this.verifyCounselor}
                                key={counselor.id}/>
                            }
                            
                        )
                    }
                </div>
            )
        }
    }
}

export default Counselor
import React, { Fragment } from 'react';
import Loader from '../shared/Loader';
import { withRouter } from 'react-router'
import '../assets/css/ClientDetail.css'

class ClientDetail extends React.Component {
    constructor() {
        super()
        this.state = {
            isLoading: false,
            clientDetail: {}
        }
    }

    async fetchClientDetail() {
        const response = await fetch(`https://konselink.herokuapp.com/register/get_klien_data/${this.props.match.params.id}`, {

            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("TOKEN")}`
            }
        });
        console.log(localStorage.getItem("TOKEN"))
        console.log(response.body);
        this.setState({isLoading: false});
        const body = await response.json();
        console.log(body)
        if (body.code == 200) {
            this.setState({clientDetail: body.data})
        }
    }

    componentDidMount() {
        this.setState({isLoading: true})
        this.fetchClientDetail()
    }

    render() {
        const keys = Object.keys(this.state.clientDetail)
        if (this.state.isLoading) {
            return (
                <div className="ClientDetail">
                    <Loader />
                </div>
            )
        }
        else if (keys.length > 0) {
            return(
                <div className="ClientDetail">
                    <div className="personal-data-container">
                        <h2>Data Pribadi</h2>
                        <table>
                            <tbody>
                            <tr>
                                <td className="field-label">Nama panggilan:</td>
                                <td>{this.state.clientDetail['name']}</td>
                            </tr>
                            <tr>
                                <td className="field-label">Jenis kelamin:</td>
                                <td>{this.state.clientDetail['gender']}</td>
                            </tr>
                            <tr>
                                <td className="field-label">Tempat tanggal lahir:</td>
                                <td>{this.state.clientDetail['birthPlace'] + ", " + this.state.clientDetail['birthDay'] + "-" + this.state.clientDetail['birthMonth'] + "-" + this.state.clientDetail['birthYear']}</td>
                            </tr>
                            <tr>
                                <td className="field-label">Agama:</td>
                                <td>{this.state.clientDetail['religion']}</td>
                            </tr>
                            <tr>
                                <td className="field-label">Alamat/domisili:</td>
                                <td>{this.state.clientDetail['address']}</td>
                            </tr>
                            <tr>
                                <td className="field-label">Nomor HP/telp:</td>
                                <td>{this.state.clientDetail['phoneNumber']}</td>
                            </tr>
                            <tr>
                                <td className="field-label">Pendidikan terakhir:</td>
                                <td>{this.state.clientDetail['currentEducation']}</td>
                            </tr>
                            <tr>
                                <td className="field-label">Pernah berkonsultasi:</td>
                                <td>{this.state.clientDetail['hasConsultedBefore'] ? 'Ya' : 'Tidak'}</td>
                            </tr>
                            {this.state.clientDetail['hasConsultedBefore'] ? (
                                <Fragment>
                                <tr>
                                    <td className="field-label">Tempat konsultasi:</td>
                                    <td>{this.state.clientDetail['placeConsulted']}</td>
                                </tr>
                                <tr>
                                    <td className="field-label">Tahun konsultasi:</td>
                                    <td>{this.state.clientDetail['yearConsulted']}</td>
                                </tr>
                                </Fragment>
                            ): (<Fragment/>)}
                            <tr>
                                <td className="field-label">Keluhan:</td>
                                <td>{this.state.clientDetail['complaint']}</td>
                            </tr>
                            <tr>
                                <td className="field-label">Upaya yang dilakukan:</td>
                                <td>{this.state.clientDetail['solution']}</td>
                            </tr>
                            <tr>
                                <td className="field-label">Masalah yang dihadapi:</td>
                                <td>{this.state.clientDetail['problem']}</td>
                            </tr>
                            <tr>
                                <td className="field-label">Usaha yang pernah dilakukan:</td>
                                <td>{this.state.clientDetail['effortDone']}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="personal-data-container">
                        <h2>Data Keluarga</h2>
                        <h3 className="sub-section-header">Data Ayah</h3>
                        <table>
                            <tbody>
                            <tr>
                                <td className="field-label">Nama:</td>
                                <td>{this.state.clientDetail['fatherName']}</td>
                            </tr>
                            <tr>
                                <td className="field-label">Usia:</td>
                                <td>{this.state.clientDetail['fatherAge']}</td>
                            </tr>
                            <tr>
                                <td className="field-label">Agama:</td>
                                <td>{this.state.clientDetail['fatherReligion']}</td>
                            </tr>
                            <tr>
                                <td className="field-label">Suku:</td>
                                <td>{this.state.clientDetail['fatherTribe']}</td>
                            </tr>
                            <tr>
                                <td className="field-label">Pendidikan terakhir:</td>
                                <td>{this.state.clientDetail['fatherEducation']}</td>
                            </tr>
                            <tr>
                                <td className="field-label">Pekerjaan:</td>
                                <td>{this.state.clientDetail['fatherOccupation']}</td>
                            </tr>
                            </tbody>
                        </table>
                        <h3 className="sub-section-header">Data Ibu</h3>
                        <table>
                            <tbody>
                            <tr>
                                <td className="field-label">Nama:</td>
                                <td>{this.state.clientDetail['motherName']}</td>
                            </tr>
                            <tr>
                                <td className="field-label">Usia:</td>
                                <td>{this.state.clientDetail['motherAge']}</td>
                            </tr>
                            <tr>
                                <td className="field-label">Agama:</td>
                                <td>{this.state.clientDetail['motherReligion']}</td>
                            </tr>
                            <tr>
                                <td className="field-label">Suku:</td>
                                <td>{this.state.clientDetail['motherTribe']}</td>
                            </tr>
                            <tr>
                                <td className="field-label">Pendidikan terakhir:</td>
                                <td>{this.state.clientDetail['motherEducation']}</td>
                            </tr>
                            <tr>
                                <td className="field-label">Pekerjaan:</td>
                                <td>{this.state.clientDetail['motherOccupation']}</td>
                            </tr>
                            </tbody>
                        </table>
                        <h3 className="sub-section-header">Data Saudara Sekandung</h3>
                        <div>
                        <table className="bordered-table">
                        <thead>
                            <tr>
                                <th className="field-label">Nama</th>
                                <th className="field-label">Peran</th>
                                <th className="field-label">Jenis Kelamin</th>
                                <th className="field-label">Usia</th>
                                <th className="field-label">Pendidikan</th>
                            </tr>
                        </thead>
                        <tbody>
                                {
                                    this.state.clientDetail['sibling1Name'] != undefined ? (
                                            <tr>
                                                <td>{this.state.clientDetail['sibling1Name']}</td>
                                                <td>Anak ke 1</td>
                                                <td>{this.state.clientDetail['sibling1Gender']}</td>
                                                <td>{this.state.clientDetail['sibling1Age']}</td>
                                                <td>{this.state.clientDetail['sibling1Education']}</td>
                                            </tr>
                                    ): (<Fragment></Fragment>)
                                }
                                {
                                    this.state.clientDetail['sibling2Name'] != undefined ? (
                                            <tr>
                                                <td>{this.state.clientDetail['sibling2Name']}</td>
                                                <td>Anak ke 2</td>
                                                <td>{this.state.clientDetail['sibling2Gender']}</td>
                                                <td>{this.state.clientDetail['sibling2Age']}</td>
                                                <td>{this.state.clientDetail['sibling2Education']}</td>
                                            </tr>
                                    ): (<Fragment></Fragment>)
                                }
                                {
                                    this.state.clientDetail['sibling3Name'] != undefined ? (
                                            <tr>
                                                <td>{this.state.clientDetail['sibling3Name']}</td>
                                                <td>Anak ke 3</td>
                                                <td>{this.state.clientDetail['sibling3Gender']}</td>
                                                <td>{this.state.clientDetail['sibling3Age']}</td>
                                                <td>{this.state.clientDetail['sibling3Education']}</td>
                                            </tr>
                                    ): (<Fragment></Fragment>)
                                }
                                {
                                    this.state.clientDetail['sibling4Name'] != undefined ? (
                                            <tr>
                                                <td>{this.state.clientDetail['sibling4Name']}</td>
                                                <td>Anak ke 4</td>
                                                <td>{this.state.clientDetail['sibling4Gender']}</td>
                                                <td>{this.state.clientDetail['sibling4Age']}</td>
                                                <td>{this.state.clientDetail['sibling4Education']}</td>
                                            </tr>
                                    ): (<Fragment></Fragment>)
                                }
                                {
                                    this.state.clientDetail['sibling5Name'] != undefined ? (
                                            <tr>
                                                <td>{this.state.clientDetail['sibling5Name']}</td>
                                                <td>Anak ke 5</td>
                                                <td>{this.state.clientDetail['sibling5Gender']}</td>
                                                <td>{this.state.clientDetail['sibling5Age']}</td>
                                                <td>{this.state.clientDetail['sibling5Education']}</td>
                                            </tr>
                                    ): (<Fragment></Fragment>)
                                }
                            </tbody>
                        </table>
                        </div>
                        </div>
                    </div>
            )
        } else {
            return(
                <div>
                    <h1>Data tidak ditemukan</h1>
                </div>
            )
        }
    }
}

export default withRouter(ClientDetail)
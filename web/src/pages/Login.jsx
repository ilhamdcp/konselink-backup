import React from 'react';
import '../assets/css/Login.css'

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            username: "",
            password: "",
            errorMessage: ""
        }
    }

    handleUsername(event) {
        this.setState({username: event.target.value, errorMessage: ""});
    }

    handlePassword(event) {
        this.setState({password: event.target.value, errorMessage: ""});
    }

    componentDidMount() {
        localStorage.removeItem("TOKEN");
    }

    async submit(event) {
        if (this.state.username.length > 0 && this.state.password.length > 0) {
            event.preventDefault();
            const response = await fetch('https://konselink.herokuapp.com/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: this.state.username, password: this.state.password})
            }).catch(error => {
                alert(error.message)
            });

            const body = await response.json();
            
            if(body.code == 401) {
                this.setState({errorMessage: "Username atau password salah"});
            }

            if (body.token != null) {
                localStorage.setItem("TOKEN", body.token);
                this.props.history.push("/")
            }

            
        } else {
            this.setState({errorMessage: "Username dan password tidak boleh kosong"})
        }
    }

    render() {
        return(
            <div className="Login">
                <div className="login-card">
                    <div className="login-container">
                        <div className="login-form">
                            <h2 className="login-header">Konselink Admin Login</h2>
                            <form>
                                <label htmlFor="name" className="login-label">
                                    Username
                                </label>
                                <input type="text" name="name" className="login-input" value={this.state.username} onChange={(e) => this.handleUsername(e)} />


                                <label htmlFor="password" className="login-label">
                                    Password
                                </label>

                                <input type="password" name="password" className="login-input" value={this.state.password} onChange={(e) => this.handlePassword(e)} />
                                <p className="login-error-text">{this.state.errorMessage}</p>

                                <div type="submit" value="Submit" className="login-button" onClick={(e) => this.submit(e)}>Submit</div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login
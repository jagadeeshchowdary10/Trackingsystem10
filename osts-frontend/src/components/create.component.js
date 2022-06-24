import React, { Component } from "react";

import TrackerService from "../services/tracker.service";
import AuthService from "../services/auth.service";
import { Modal, Toast } from 'react-bootstrap';
import { Redirect, useHistory  } from "react-router-dom";

export default class CreateRequest extends Component {
    constructor(props) {
        super()
        this.state = {
            showRequester: false,
            showApprover: false,
            currentUser: undefined,
            name: '',
            url: '',
            description: '',
            license: '',
            showToast: false,
            toastMessage: '',
            toatsClass: '',
            isError: {
                name: '',
                url: '',
                description: '',
                license: '',
                form: ''
            }
        }
    }

    onSubmit = e => {
        e.preventDefault();

        let isError = { ...this.state.isError };
        const formValid = ({ isError, ...rest }) => {
            let isValid = true;
            Object.values(isError).forEach(val => {
                if (val.length > 0) {
                    isValid = false
                }
            });
            if (rest.name == '' || rest.url == '' || rest.description == '' || rest.license == '') {
                isValid = false;
            }
            return isValid;
        };
        if (formValid(this.state)) {
            TrackerService.create({
                name: this.state.name,
                url: this.state.url,
                description: this.state.description,
                license: this.state.license
            }).then(response => {
                this.props.history.push("/home");
                this.setState({
                    toastClass: 'success',
                    toastMessage: 'Request Created!',
                    showToast: true
                })
                window.location.reload();
            })
        } else {
            isError.form = "Invalid Data";
            this.setState({
                isError: isError,
                toastClass: 'danger',
                toastMessage: 'Invalid Data',
                showToast: true
            })
        }
    };

    formValChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        const urlRegex = new RegExp('^(http(s)?://|www\.)');
        let isError = { ...this.state.isError };
        isError.form = '';
        switch (name) {
            case "name":
                isError.name =
                    value.length < 4 ? "Atleast 4 characaters required" : "";
                break;
            case "url":
                isError.url = urlRegex.test(value)
                    ? ""
                    : "URL is invalid";
                break;
            case "license":
                isError.license =
                    value.length == 0 ? "License required" : "";
                break;
            case "description":
                isError.description =
                    value.length == 0 ? "Description required" : "";
                break;
            default:
                break;
        }
        this.setState({
            isError,
            [name]: value
        })
    };

    componentDidMount() {
        const user = AuthService.getCurrentUser();

        if (user) {
            this.setState({
                currentUser: user,
                showRequester: user.roles.includes("ROLE_REQUESTER"),
                showApprover: user.roles.includes("ROLE_APPROVER"),
            });
        } else {
            this.setState({ redirect: "/login" });
        }

    }
    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        const { isError } = this.state;
        return (
            <div>
                <Toast className="toast-abs" position="top-end" delay={3000} autohide bg={this.state.toastClass} show={this.state.showToast} onClose={() => this.setState({ showToast: false })}>
                    <Toast.Header>

                    </Toast.Header>
                    <Toast.Body>{this.state.toastMessage}</Toast.Body>
                </Toast>
                
                <form onSubmit={this.onSubmit}>
                
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        className={isError.name.length > 0 ? "is-invalid form-control" : "form-control"}
                        name="name"
                        onChange={this.formValChange}
                    />
                    {isError.name.length > 0 && (
                        <span className="invalid-feedback">{isError.name}</span>
                    )}
                </div>
                <div className="form-group">
                    <label>URL</label>
                    <input
                        type="text"
                        className={isError.url.length > 0 ? "is-invalid form-control" : "form-control"}
                        name="url"
                        onChange={this.formValChange}
                    />
                    {isError.url.length > 0 && (
                        <span className="invalid-feedback">{isError.url}</span>
                    )}
                </div>
                <div className="form-group">
                    <label>License</label>
                    <input
                        type="text"
                        className={isError.license.length > 0 ? "is-invalid form-control" : "form-control"}
                        name="license"
                        onChange={this.formValChange}
                    />
                    {isError.license.length > 0 && (
                        <span className="invalid-feedback">{isError.license}</span>
                    )}
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        type="text"
                        className={isError.description.length > 0 ? "is-invalid form-control" : "form-control"}
                        name="description"
                        onChange={this.formValChange}
                    />
                    {isError.description.length > 0 && (
                        <span className="invalid-feedback">{isError.description}</span>
                    )}
                    {isError.form.length > 0 && (
                        <span className="invalid-feedback">{isError.form}</span>
                    )}
                </div>
                <button type="submit" className="btn btn-block btn-danger">Create Request</button>
                
            </form>
            </div>
           
        );
    }
}
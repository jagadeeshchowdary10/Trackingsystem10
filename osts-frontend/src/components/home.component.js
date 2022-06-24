import React, { Component } from "react";

import TrackerService from "../services/tracker.service";
import AuthService from "../services/auth.service";
import TrackerTable from "./Table";
import { Modal, Button } from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import { useForm } from "react-hook-form";

export default class Home extends Component {

  constructor(props) {
    super();
    this.state = {
      showRequester: false,
      showApprover: false,
      currentUser: undefined,
      data: [],
      loadingData: true,
      showModel: false,
      showCreateModel: false,
      selectedItem: undefined,
      columns: [
        {
          heading: "Id",
          value: "id",
        },
        {
          heading: "Name",
          value: "name",
        },
        {
          heading: "URL",
          value: "url",
        },
        {
          heading: "State",
          value: "state",
        }]
    };
  }

  handleShow = () => {
    this.setState({ showModel: true });
  }

  handleClose = () => {
    this.setState({ showModel: false });
  }

  handleCreateModalClose = () => {
    this.setState({ showCreateModel: false });
  }

  handleSubmit = () => {
    this.setState({ showModel: false });
  }

  handleCancel = () => {
    TrackerService.cancelRequest(this.state.selectedItem).then(
      response => {
        this.loadData();
        this.setState({ showModel: false, selectedItem: undefined });
      },
      error => {
        this.setState({
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  handleApprove = () => {
    TrackerService.approveRequest(this.state.selectedItem).then(
      response => {
        this.loadData();
        this.setState({ showModel: false, selectedItem: undefined });
      },
      error => {
        this.setState({
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  handleReject = () => {
    TrackerService.rejectRequest(this.state.selectedItem).then(
      response => {
        this.loadData();
        this.setState({ showModel: false, selectedItem: undefined });
      },
      error => {
        this.setState({
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showRequester: user.roles.includes("ROLE_REQUESTER"),
        showApprover: user.roles.includes("ROLE_APPROVER"),
      });
      this.loadData();
    } else {
      this.setState({ redirect: "/login" });
    }
    
  }

  loadData() {
    TrackerService.getAll().then(
      response => {
        this.setState({ data: response.data, loadingData: false });
      },
      error => {
        this.setState({
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  render() {
    const state = this.state;
    const data = this.state.selectedItem;
    const handleClose = this.handleClose;
    const handleShow = this.handleShow;
    const handleSubmit = this.handleSubmit;
    const modalCallbacks = {
      handleClose: this.handleClose,
      handleReject: this.handleReject,
      handleCancel: this.handleCancel,
      handleApprove: this.handleApprove
    }
    const createModalCallbacks = {
      handleClose: this.handleCreateModalClose,
      handleReject: this.handleReject,
      handleCancel: this.handleCancel,
      handleApprove: this.handleApprove
    }
    const callbacks = {
      showTrackerModel: (item) => {
        this.setState({ selectedItem: item, showModel: true });
      }
    }
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    return (
      <div className="container">
        <Modal show={state?.showModel} onHide={modalCallbacks.handleClose}>

          <Modal.Header closeButton>
            <Modal.Title>{data?.name}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div><b>Submitted By:</b> {data?.createdUser.username}</div>
            <div><b>State:</b> {data?.state}</div>
            <div><b>Submitted Date:</b> {data?.date}</div>
            <div><b>URL:</b> <a target="_blank">{data?.url}</a></div>
            <div><b>Description:</b> {data?.description}</div>
          </Modal.Body>

          <Modal.Footer>
            {(() => {
              if (state?.showApprover && state?.currentUser?.username != data?.createdUser.username && data?.state == "IN PENDING") {
                return (
                  <>
                    <Button variant="danger" onClick={modalCallbacks.handleReject}>Reject Request</Button>
                    <Button variant="primary" onClick={modalCallbacks.handleApprove}>Approve Request</Button>
                  </>
                )
              } else if (state?.currentUser?.username == data?.createdUser.username && data?.state == "IN PENDING") {
                return (
                  <>
                    <Button variant="danger" onClick={modalCallbacks.handleCancel}>Cancel Request</Button>
                  </>
                )
              } else {
                return (
                  <div></div>
                )
              }
            })()}
          </Modal.Footer>
        </Modal>

        {this.state.loadingData ? (
          <p>Loading Please wait...</p>
        ) : (
          <TrackerTable column={this.state.columns} data={this.state.data} callbacks={callbacks} />
        )}
      </div>
    );
  }
}

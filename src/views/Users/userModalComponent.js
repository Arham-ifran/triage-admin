import React, { useState, useEffect, useRef } from "react";
import validator from "validator";
import { updateUser, beforeUser } from "./Users.action";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import $ from "jquery";
import {
  Button,
  Form,
  Container,
  Row,
  Modal,
  FormGroup,
} from "react-bootstrap";
var CryptoJS = require("crypto-js");

const userModal = (props) => {
  const history = useHistory();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    status: "",
  });
  const [msg, setMsg] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setUser(props.userData);
  }, [props.user]);

  const onCloseHandler = () => {
    props.setUserModal(!props.userModal);
  };


  const submit = (e) => {
    let check = true;

    let firstName = "";
    let lastName = "";
    let email = "";
    let password = "";
    let confirmPassword = "";

        if (!user.firstName) {
			firstName = "First Name is Required"
			check = false
		}


    if (!user.lastName) {
        lastName = "Last Name is Required.";
      check = false;
    }
    if (!user.email) {
      check = false;
      email = "Email is Required";
    } else {
      if (!validator.isEmail(user.email)) {
        setEmailMsg("Please enter a valid email address");
        check = false;
      }
    }

    if (
      !user.password &&
      user.confirmPassword
    ) {
        check = false;
        password = "Password is required";
        confirmPassword=""
    }

    if (
      !user.confirmPassword && user.password
    ) {
        check = false;
        confirmPassword = "Confirm Password is required";
    }

    if ((user.password && user.confirmPassword ) && (user.password !== user.confirmPassword)) {
        check = false;
      confirmPassword = "Passwords do not match";
    }

    setMsg({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });

    if (check) {
      let payload = user
      delete payload.confirmPassword
      props.updateUser(payload);
      props.setLoader(true)

    } else {
      $("#modal-primary").scrollTop(0, 0);
    }
  };


  return (
    <Container fluid>
      {props.modalType > 0 && (
        <Modal
          className="modal-primary"
          id="admin-modal"
          onHide={() => onCloseHandler()}
          show={props.userModal}
        >
          <Modal.Header className="justify-content-center">
            <Row>
              <div className="col-12">
                <h4 className="mb-0 mb-md-3 mt-0">
                  {props.modalType === 1 ? "View" : "Edit"} User
                </h4>
              </div>
            </Row>
          </Modal.Header>
          <Modal.Body className="modal-body">
            <Form>
              <Form.Group>
                <label className="text-white">
                  First Name <span className="text-danger">*</span>
                </label>
                <Form.Control
                  placeholder="Enter first name"
                  disabled={props.modalType === 1}
                  type="text"
                  name="firstName"
                  onChange={(e) =>
                    setUser({ ...user, firstName: e.target.value })
                  }
                  value={user && user.firstName}
                  required
                />
                <span className={msg.firstName ? `` : `d-none`}>
                  <label className="pl-1 text-danger">{msg.firstName}</label>
                </span>
              </Form.Group>

              <Form.Group>
                <label className="text-white">
                  Last Name <span className="text-danger">*</span>
                </label>
                <Form.Control
                  placeholder="Enter last name"
                  disabled={props.modalType === 1}
                  type="text"
                  name="lastName"
                  onChange={(e) =>
                    setUser({ ...user, lastName: e.target.value })
                  }
                  value={user && user.lastName}
                  required
                />
                 <span className={msg.lastName ? `` : `d-none`}>
                  <label className="pl-1 text-danger">{msg.lastName}</label>
                </span>
              </Form.Group>

              <Form.Group>
                <label className="text-white">
                  Email <span className="text-danger">*</span>
                </label>
                <Form.Control
                  placeholder="xyz@example.com"
                  disabled={props.modalType === 1}
                  type="text"
                  name="email"
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  value={user && user.email}
                  required
                />
                 <span className={msg.email ? `` : `d-none`}>
                  <label className="pl-1 text-danger">{msg.email}</label>
                </span>
              </Form.Group>
              {props.modalType !== 1 ? (
                <Form.Group>
                  <Form.Group>
                    <label className="text-white">Password </label>
                    <Form.Control
                      placeholder="password"
                      disabled={props.modalType === 1}
                      type="password"
                      autoComplete="off"
                      name="password"
                      onChange={(e) =>
                        setUser({ ...user, password: e.target.value })
                      }
                      value={user && user.password}
                      required
                    />
                     <span className={msg.password ? `` : `d-none`}>
                  <label className="pl-1 text-danger">{msg.password}</label>
                </span>
                  </Form.Group>

                  <Form.Group>
                    <label className="text-white">Confirm Password </label>
                    <Form.Control
                      placeholder="confirmPassword"
                      disabled={props.modalType === 1}
                      type="password"
                      autoComplete="off"
                      name="confirmPassword"
                      onChange={(e) =>
                        setUser({ ...user, confirmPassword: e.target.value })
                      }
                      value={user && user.confirmPassword}
                      required
                    />
                     <span className={msg.confirmPassword ? `` : `d-none`}>
                  <label className="pl-1 text-danger">{msg.confirmPassword}</label>
                </span>
                  </Form.Group>
                </Form.Group>
              ) : null}

              <FormGroup>
                <label className="text-white">Status</label>
                <div className="d-flex">
                  <label className="right-label-radio mr-3 mb-2">
                    Active
                    <input
                      name="status"
                      disabled={props.modalType === 1}
                      type="radio"
                      checked={user && user.status}
                      value={user && user.status}
                      onChange={(e) => setUser({ ...user, status: true })}
                    />
                    <span className="checkmark"></span>
                  </label>
                  <label className="right-label-radio mr-3 mb-2">
                    Inactive
                    <input
                      name="status"
                      disabled={props.modalType === 1}
                      type="radio"
                      checked={user && !user.status}
                      value={user && !user.status}
                      onChange={(e) => setUser({ ...user, status: false })}
                    />
                    <span className="checkmark"></span>
                  </label>
                </div>
              </FormGroup>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button className="outline-button" onClick={() => onCloseHandler()}>
              Close
            </Button>
            {props.modalType === 1 ? (
              ""
            ) : (
              <Button
                className="btn-filled"
                onClick={() => submit()} /* disabled={isLoader} */
              >
                Save
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, { updateUser,beforeUser })(userModal);

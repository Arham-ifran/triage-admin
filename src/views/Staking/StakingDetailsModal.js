import React, { useState, useEffect, useRef } from "react";
import validator from "validator";
import { connect } from "react-redux";
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

const stakingModal = (props) => {
    const {data,receiveStakingModal } = props
  const onCloseHandler = () => {
    props.setStakingModal(!props.stakingModal);
  };


  return (
    <Container fluid>
        <Modal
          className="modal-primary"
          id="admin-modal"
          onHide={() => onCloseHandler()}
          show={props.stakingModal}
        >
          <Modal.Header className="justify-content-center">
            <Row>
              <div className="col-12">
                <h4 className="mb-0 mb-md-3 mt-0">
                 {receiveStakingModal && "Receive"} Staking Details
                </h4>
              </div>
            </Row>
          </Modal.Header>
          <Modal.Body className="modal-body">
            <Form>
              <Form.Group>
                <label className="text-white">
                  User Name 
                </label>
                <Form.Control
                  disabled
                  value={(data?.userFirstName? data?.userFirstName : 'N/A') + " " + (data?.userLastName? data?.userLastName : '')}                 
                />
              </Form.Group>
              {receiveStakingModal &&
              <>
              <Form.Group>
                <label className="text-white">
                Wallet Address 
                </label>
                <Form.Control
                  disabled
                  value=  {data?.userWalletAddress.ethereum
                    ? data?.userWalletAddress.ethereum
                    : "N/A"}                
                />
              </Form.Group>
              <Form.Group>
                <label className="text-white">
                Contract Address 
                </label>
                <Form.Control
                  disabled
                  value=  {data?.contractAddress?.ethereum
                    ? data?.contractAddress?.ethereum
                    : "N/A"}                
                />
              </Form.Group>
              </>
              }
              <Form.Group>
                <label className="text-white">
                  Deposited Amount <span className="text-danger"></span>
                </label>
                <Form.Control
                  disabled
                  value={data?.depositedAmount}                 
                />
              </Form.Group>
              {!receiveStakingModal &&
              <>
              <Form.Group>
                <label className="text-white">
                  Profit Type <span className="text-danger"></span>
                </label>
                <Form.Control
                  disabled
                  value={ data?.profitType === 1 ? "Available" : data?.profitType === 2 ? "Locked" : "N/A"}          
                />
              </Form.Group>
              <Form.Group>
                <label className="text-white">
                  Total Profit <span className="text-danger"></span>
                </label>
                <Form.Control
                  disabled
                  value={data?.totalProfit + '%'}                 
                />
              </Form.Group>
              <Form.Group>
                <label className="text-white">
                Profit Amount <span className="text-danger"></span>
                </label>
                <Form.Control
                  disabled
                  value={data?.profitAmount}                 
                />
              </Form.Group>
              {/* <Form.Group>
                <label className="text-white">
                Profit Amount Paid <span className="text-danger"></span>
                </label>
                <Form.Control
                  disabled
                  value={data?.profitAmountPaid}                 
                />
              </Form.Group> */}
              <Form.Group>
                <label className="text-white">
                Promo Code <span className="text-danger"></span>
                </label>
                <Form.Control
                  disabled
                  value={data?.promoCode ? data?.promoCode : "N/A"}                 
                />
              </Form.Group>
              <Form.Group>
                <label className="text-white">
                Level <span className="text-danger"></span>
                </label>
                <Form.Control
                  disabled
                  value={data?.level ? data?.level === 1 ? 'Bronze' : data?.level === 2 ? 'Silver' : data?.level === 3 ? 'Gold' : data?.level === 4 ? 'Platinum' : '' : 'N/A'}                 
                />
              </Form.Group>
              <Form.Group>
                <label className="text-white">
                Sub Level <span className="text-danger"></span>
                </label>
                <Form.Control
                  disabled
                  value={data?.subLevel ? data?.subLevel : "N/A"}                 
                />
              </Form.Group>
              <Form.Group>
                <label className="text-white">
                Months <span className="text-danger"></span>
                </label>
                <Form.Control
                  disabled
                  value={data?.months ? data?.months : "N/A"}                 
                />
                 </Form.Group>
                 </>}
              
              {/* <Form.Group>
                <label className="text-white">
                Currency <span className="text-danger"></span>
                </label>
                <Form.Control
                  disabled
                  value={data?.currency ? data?.currency : "N/A"}                 
                />
              </Form.Group> */}
             
              {!receiveStakingModal && 
              <>
                 {/* <Form.Group>
                <label className="text-white">
                Interest Paid <span className="text-danger"></span>
                </label>
                <Form.Control
                  disabled
                  value={data?.interestPaid ? 'Yes' : 'No'}                 
                />
              </Form.Group> */}
              <Form.Group>
                <label className="text-white">
                Stake Period Ended <span className="text-danger"></span>
                </label>
                <Form.Control
                  disabled
                  value={data?.stakeEndDate ?new Date(data?.stakeEndDate) < new Date() ?'Yes':'No': 'N/A'}             
                />
              </Form.Group>
              </>}



            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button className="outline-button" onClick={() => onCloseHandler()}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>     
    </Container>
  );
};

export default stakingModal

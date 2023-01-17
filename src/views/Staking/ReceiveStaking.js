import FullPageLoader from "components/FullPageLoader/FullPageLoader";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import localeInfo from "rc-pagination/lib/locale/en_US";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import { ENV } from "../../config/config";
import {
  beforeStaking,
  listRecStaking,
  beforeTransferAmount,
  transferAmount,
} from "./Staking.action";
import { toast } from "react-toastify";
import {
  beforeRole,
  getRole,
} from "views/AdminStaff/permissions/permissions.actions";
var CryptoJS = require("crypto-js");
import StakingDetailsModal from "./StakingDetailsModal";


const RecStaking = (props) => {
  const [data, setData] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [stakingModal, setStakingModal] = useState(false)
  const [stakingData, setStakingData] = useState()
  const [resetButton, setResetButton] = useState(false);
  const [loader, setLoader] = useState(true);
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
  });

  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    let roleEncrypted = localStorage.getItem("role");
    let role = "";
    if (roleEncrypted) {
      let roleDecrypted = CryptoJS.AES.decrypt(
        roleEncrypted,
        ENV.secretKey
      ).toString(CryptoJS.enc.Utf8);
      role = roleDecrypted;
      props.getRole(role);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(props.getRoleRes).length > 0) {
      setPermissions(props.getRoleRes.role);
      props.beforeRole();
    }
  }, [props.getRoleRes]);

  useEffect(() => {
    window.scroll(0, 0);
    props.listRecStaking();
  }, []);

  useEffect(() => {
    if (props.staking.transferAmountAuth) {
      beforeTransferAmount();
      props.listRecStaking();
      setLoader(false);
    }
  }, [props.staking.transferAmountAuth]);

  useEffect(() => {
    if (props.staking.listStakingAuth) {
      let data = props.staking.listStaking;
      setPagination(data?.pagination);
      setData(data?.stake);
      props.beforeStaking();
      setLoader(false);
    }
  }, [props.staking.listStakingAuth]);

  const onPageChange = async (page) => {
    setLoader(true);
    const qs = ENV.objectToQueryString({ page, ...filters });
    props.listRecStaking(qs);
  };

  const applyFilters = () => {
    if (filters.firstName || filters.lastName) {
      setResetButton(true);
      const qs = ENV.objectToQueryString({ page: 1, limit: 10, ...filters });
      props.listRecStaking(qs);
      setLoader(true);
    } else {
      toast.error("Add data in at least one field.", {
        toastId: "FIELD_REQUIRED",
      });
    }
  };

  const reset = () => {
    setResetButton(false);
    setFilters({
      firstName: "",
      lastName: "",
    });
    props.listRecStaking();
    setLoader(true);
  };

  // call the api which will transfer the user amount into the admin wallet
  const transferAmount = (stakeId) => {
    Swal.fire({
      title: "Are you sure you want to receive amount ?",
      html: "Transaction cant be reverted !",
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Get Amount",
    }).then(async (result) => {
      if (result.value) {
        setLoader(true);
        // calling the send profit api
        props.transferAmount({ stakeId });
      }
    });
  };

  const viewStaking = (details) => {
    setStakingModal(true)
    setStakingData(details)
}

  return (
    <>
      {loader ? (
        <FullPageLoader />
      ) : (
        <Container fluid>
          <Row className="pb-3">
            <Col sm={12}>
              <Card className="filter-card">
                <Card.Header>
                  <div className="d-flex align-items-center justify-content-between table-head">
                    <Card.Title as="h4">Filters</Card.Title>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col xl={4} sm={6}>
                      <Form.Group>
                        <label>Search with First Name...</label>
                        <Form.Control
                          type="text"
                          placeholder="First Name"
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              firstName: e.target.value.trim(),
                            })
                          }
                          value={filters.firstName}
                        />
                      </Form.Group>
                    </Col>
                    <Col xl={4} sm={6}>
                      <Form.Group>
                        <label>Search with Last Name...</label>
                        <Form.Control
                          type="text"
                          placeholder="Last Name"
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              lastName: e.target.value.trim(),
                            })
                          }
                          value={filters.lastName}
                        />
                      </Form.Group>
                    </Col>
                    <Col xl={4} sm={6}>
                      <Form.Group>
                        <Form.Label className="d-block mb-2">&nbsp;</Form.Label>
                        <div className="d-flex  filter-btns-holder">
                          <Button
                            className="btn-filled mr-3"
                            onClick={applyFilters}
                          >
                            Search
                          </Button>
                          {resetButton && (
                            <Button
                              variant="warning"
                              className="outline-button"
                              onClick={reset}
                            >
                              Reset
                            </Button>
                          )}
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <Card className="table-big-boy">
                <Card.Header>
                  <div className="d-flex align-items-center justify-content-between table-head">
                    <Card.Title as="h4">Receive Staking</Card.Title>
                  </div>
                </Card.Header>
                <Card.Body className="table-full-width">
                  <div className="table-responsive">
                    <Table className="table-bigboy table-w">
                      <thead>
                        <tr>
                          <th className="td-start serial-col">#</th>
                          <th className="td-name">
                            <div className="faqs-title td-name">Username</div>
                          </th>
                          <th className="td-name">
                            <div className="faqs-title td-name text-center">
                              Deposited Amount
                            </div>
                          </th>
                          <th className="td-name text-center">
                            <div className="faqs-title">Currency</div>
                          </th>
                          {/* <th className="td-name">
                                                            <div className='faqs-title'>Stake Period Ended</div>
                                                        </th>
                                                        <th className="td-name">
                                                            <div className='faqs-title'>Level</div>
                                                        </th>                                                      
                                                        <th className="td-name">
                                                            <div className='faqs-title td-name'>Total Profit</div>
                                                        </th>
                                                        <th className="td-name">
                                                            <div className='faqs-title td-name'>Interest Paid</div>
                                                        </th>
                                                        <th className="td-name">
                                                            <div className='faqs-title'>Stake Period Ended</div>
                                                        </th>
                                                        <th className="td-name">
                                                            <div className='faqs-title'>Level</div>
                                                        </th>
                                                        <th className="td-name">
                                                            <div className='faqs-title'>Sub-Level</div>
                                                        </th>
                                                        <th className="td-name">
                                                            <div className='faqs-title'>Currency</div>
                                                        </th>
                                                        <th className="td-name">
                                                            <div className='faqs-title'>Amount</div>
                                                        </th>
                                                        <th className="td-name">
                                                            <div className='faqs-title'>Months</div>
                                                        </th> */}
                          {permissions && permissions.editReceiveStaking ? (
                            <th className="td-name text-center">
                              <div className="faqs-title">Actions</div>
                            </th>
                          ) : (
                            ""
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {data && data.length ? (
                          data.map((item, index) => {
                            console.log("staking list  = ", item);
                            return (
                              <tr key={index}>
                                <td className="serial-col text-white">
                                  {pagination &&
                                    pagination.limit * pagination.page -
                                      pagination.limit +
                                      index +
                                      1}
                                </td>
                                <td className="text-white td-name">
                                  <div className="faq-title td-name">
                                    {item.userFirstName
                                      ? item.userFirstName + " "
                                      : "N/A"}{" "}
                                    {item.userFirstName && item.userLastName
                                      ? item.userLastName
                                      : ""}
                                  </div>
                                </td>
                                <td className="text-white text-center">
                                  <div className="td-title td-name">
                                    {item.depositedAmount
                                      ? item.depositedAmount
                                      : "N/A"}
                                  </div>
                                </td>
                                <td className="text-white text-center">
                                  <div>
                                    {item.currency ? item.currency : "TRI"}
                                  </div>
                                </td>

                                <td className="td-actions text-center ">
                                  <ul className="list-unstyled mb-0 d-flex justify-content-center align-items-center">
                                    {permissions?.editReceiveStaking && (
                                      <li className="d-inline-block align-top">
                                        {!item.transferToAdmin ? (
                                          <Button
                                            className="btn-link btn-icon d-inline-block align-top float-none"
                                            type="button"
                                            variant="info"
                                            onClick={() => {
                                              transferAmount(item._id);
                                            }}
                                          >
                                           <span> Get Amount</span>
                                          </Button>
                                        ) : (
                                          <Button
                                          className="btn-link btn-icon d-inline-block align-top float-none" disabled>
                                          <span className="text-white">  Already Taken</span>
                                          </Button>
                                        )}
                                      </li>
                                    )}
                                    <li className="d-inline-block align-top">
                                      <OverlayTrigger
                                        overlay={
                                          <Tooltip id="tooltip-436082023">
                                            {" "}
                                            View Detail{" "}
                                          </Tooltip>
                                        }
                                        placement="top"
                                      >
                                        <Button
                                          className="btn-link btn-icon"
                                          type="button"
                                          variant="info"
                                          onClick={() => viewStaking(item)}
                                        >
                                          <i className="fas fa-eye"></i>
                                        </Button>
                                      </OverlayTrigger>
                                    </li>
                                  </ul>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center">
                              <div className="alert alert-info" role="alert">
                                No Receive Staking Found
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                    {pagination && (
                      <Pagination
                        className="m-3"
                        defaultCurrent={1}
                        pageSize // items per page
                        current={pagination.page} // current active page
                        total={pagination.pages} // total pages
                        onChange={onPageChange}
                        locale={localeInfo}
                      />
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <StakingDetailsModal stakingModal={stakingModal}  setStakingModal={setStakingModal} data={stakingData} receiveStakingModal={true}/>
        </Container>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  staking: state.staking,
  error: state.error,
  getRoleRes: state.role.getRoleRes,
});

export default connect(mapStateToProps, {
  beforeStaking,
  listRecStaking,
  beforeTransferAmount,
  transferAmount,
  getRole,
  beforeRole,
})(RecStaking);

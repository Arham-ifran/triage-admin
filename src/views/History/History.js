import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FullPageLoader from "components/FullPageLoader/FullPageLoader";
import moment from "moment";
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
  Row,
  Table,
  Modal,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { connect } from "react-redux";
import { ENV } from "../../config/config";
import { beforeHistory, listHistory } from "./History.action";

const History = (props) => {
  const [data, setData] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loader, setLoader] = useState(true);
  const [historyViewModal, setHistoryViewModal] = useState(false);
  const [historyData, setHistoryData] = useState(false);
  const [resetButton, setResetButton] = useState(false)
  const [filters, setFilters] = useState({
    historyType: "1",
    senderAdd: '',
    receiverAdd: ''
  });

  useEffect(() => {
    window.scroll(0, 0);
    const qs = ENV.objectToQueryString({ ...filters });
    props.listHistory(qs);
  }, []);

  useEffect(() => {
    if (props.history.listHistoryAuth) {
      setData(props.history.listHistory.history);
      setPagination(props.history.listHistory.pagination);
      setLoader(false);
      props.beforeHistory();
    }
  }, [props.history.listHistoryAuth]);

  const onPageChange = async (page) => {
    setLoader(true);
    const qs = ENV.objectToQueryString({ page, ...filters });
    props.listHistory(qs);
  };

  const applyFilters = () => {
    if ((filters && filters.historyType) || (filters && filters.senderAdd) || (filters && filters.receiverAdd)) {
      const qs = ENV.objectToQueryString({ page: 1, limit: 10, historyType: filters.historyType, senderAdd: filters.senderAdd, receiverAdd: filters.receiverAdd });
      setResetButton(true)
      props.listHistory(qs);
      setLoader(true);
    }
  };

  const reset = () => {
    setFilters({
      historyType: "1",
      senderAdd: '',
      receiverAdd: ''
    });
    setResetButton(false)
    const qs = ENV.objectToQueryString({ historyType: 1 });
    props.listHistory(qs);
    setLoader(true);
  };

  const handleHistoryView = (data) => {
    setHistoryViewModal(true);
    setHistoryData(data);
  };

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
                      <label>Search with History Type...</label>
                      <Form.Group>
                        <select
                          value={filters.historyType}
                          onChange={(e) => {
                            setFilters({ ...filters, historyType: e.target.value });
                          }}
                        >
                          <option default value="1">
                            Deposits
                          </option>
                          <option value="2">With Drawals</option>
                          <option value="3">Exchange</option>
                          <option value="4">Referrals</option>
                          <option value="5">Bonouses</option>
                          <option value="6">Savings Operations</option>
                        </select>
                      </Form.Group>
                    </Col>
                    <Col xl={4} sm={6}>
                      <Form.Group>
                        <label >Search with Sender Address...</label>
                        <Form.Control type="text" value={filters.senderAdd} placeholder="Sender Address" onChange={(e) => setFilters({ ...filters, senderAdd: e.target.value.trim() })} />
                      </Form.Group>
                    </Col>
                    <Col xl={4} sm={6}>
                      <Form.Group>
                        <label >Search with Receiver Address...</label>
                        <Form.Control type="text" value={filters.receiverAdd} placeholder="Receiver Address" onChange={(e) => setFilters({ ...filters, receiverAdd: e.target.value.trim() })} />
                      </Form.Group>
                    </Col>
                    <Col xl={4} sm={6}>
                      <Form.Group>
                        <Form.Label className="d-block mb-2">&nbsp;</Form.Label>
                        <div className="d-flex  filter-btns-holder">
                          <Button className='btn-filled mr-3' onClick={applyFilters}>Search</Button>
                          {resetButton &&
                            <Button
                              variant="warning"
                              className="outline-button"
                              onClick={reset}
                            >
                              Reset
                            </Button>}
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
                    <Card.Title as="h4">History</Card.Title>
                  </div>
                </Card.Header>
                <Card.Body className="table-full-width">
                  <div className="table-responsive">
                    <Table className="table-bigboy table-w cms-table">
                      <thead>
                        <tr>
                          <th className="td-start serial-col">#</th>
                          <th className="td-description">
                            <div className="faqs-title">Type</div>
                          </th>
                          <th className="td-description">
                            <div className="faqs-title">Sender Address</div>
                          </th>
                          <th className="td-description">
                            <div className="faqs-title">Receiver Address</div>
                          </th>
                          {/* <th className="td-description">
                            <div className="faqs-title">Amount Sent</div>
                          </th> */}
                          {/* <th className="td-description">
                            <div className="faqs-title">Currency</div>
                          </th> */}
                          <th className="td-actions">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data && data.length ? (
                          data.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td className="serial-col text-white">
                                  {pagination &&
                                    pagination.limit * pagination.page -
                                    pagination.limit +
                                    index +
                                    1}
                                </td>
                                <td className="text-white td-description">
                                  <div>
                                    {filters.historyType === "1"
                                      ? "Deposits"
                                      : filters.historyType === "2"
                                        ? "Withdrawals"
                                        : filters.historyType === "3"
                                          ? "Exchange"
                                          : filters.historyType === "4"
                                            ? "Referrals"
                                            : filters.historyType === "5"
                                              ? "Bonuses"
                                              : filters.historyType === "6"
                                                ? "Savings Operations"
                                                : "N/A"}
                                  </div>
                                </td>
                                <td className="text-white td-description">
                                  <div>
                                    {item.senderAdd ? item.senderAdd : "N/A"}
                                  </div>
                                </td>
                                <td className="text-white td-description">
                                  <div>
                                    {item.receiverAdd
                                      ? item.receiverAdd
                                      : "N/A"}
                                  </div>
                                </td>
                                {/* <td className="text-white td-description">
                                  <div>
                                    {item.amountSent ? item.amountSent : "N/A"}
                                  </div>
                                </td> */}
                                {/* <td className="text-white td-description">
                                  <div>
                                    {item.currency ? item.currency : "N/A"}
                                  </div>
                                </td> */}
                                <td className="td-actions text-white">
                                  <ul className="list-unstyled mb-0">
                                    <li className="d-inline-block align-top">
                                      <OverlayTrigger
                                        overlay={
                                          <Tooltip id="tooltip-897993903">
                                            {" "}
                                            View{" "}
                                          </Tooltip>
                                        }
                                        placement="top"
                                      >
                                        <Button
                                          className="btn-link btn-icon"
                                          type="button"
                                          variant="info"
                                          onClick={() =>
                                            handleHistoryView(item)
                                          }
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
                            <td colSpan="5" className="text-center">
                              <div className="alert alert-info" role="alert">
                                No History Found
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

          <Modal show={historyViewModal}>
            <Modal.Header closeButton>
              <Row>
                <div className="col-12">
                  <h4 className="mb-0 mb-md-3 mt-0">History Details</h4>
                </div>
              </Row>
            </Modal.Header>
            <Modal.Body>
              <Form className="text-left">
                <Form.Group>
                  <strong className="mr-2 text-white">History Type:</strong>
                  <span className="text-white">
                    {filters.historyType === "1"
                      ? "Deposits"
                      : filters.historyType === "2"
                        ? "Withdrawals"
                        : filters.historyType === "3"
                          ? "Exchange"
                          : filters.historyType === "4"
                            ? "Referrals"
                            : filters.historyType === "5"
                              ? "Bonuses"
                              : filters.historyType === "6"
                                ? "Savings Operations"
                                : "N/A"}
                  </span>
                </Form.Group>
                <Form.Group>
                  <label className="text-white">Sender Address:</label>
                  <Form.Control
                    disabled
                    value={historyData.senderAdd ? historyData.senderAdd : ''}
                  />
                </Form.Group>
                <Form.Group>
                  <label className="text-white">Receiver Address:</label>
                  <Form.Control
                    disabled
                    value={historyData.receiverAdd ? historyData.receiverAdd : ''}
                  />
                </Form.Group>
                <Form.Group>
                  <label className="text-white">Amount Sent:</label>
                  <Form.Control
                    disabled
                    value={historyData.amountSent ? historyData.amountSent : 'N/A'}
                  />
                </Form.Group>
                <Form.Group>
                  <label className="text-white">Currency:</label>
                  <Form.Control
                    disabled
                    value={historyData.currency ? historyData.currency : 'N/A'}
                  />
                </Form.Group>
                <Form.Group>
                  <label className="text-white">Gas Fee:</label>
                  <Form.Control
                    disabled
                    value={historyData.gasFee ? historyData.gasFee : 'N/A'}
                  />
                </Form.Group>
                <Form.Group>
                  <label className="text-white">Tx Hash:</label>
                  <Form.Control
                    disabled
                    value={historyData.txHash ? historyData.txHash : 'N/A'}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="outline-button"
                onClick={() => setHistoryViewModal(!historyViewModal)}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  history: state.history,
  error: state.error,
});

export default connect(mapStateToProps, { beforeHistory, listHistory })(
  History
);

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import SubmitLoader from 'views/SubmitLoader/SubmitLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Row, Table, OverlayTrigger, Tooltip, Form, Modal } from "react-bootstrap";
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify'
import { ENV } from '../../config/config';
import { getWithdrawRequests, beforeWireRequest, uploadReceipt, deductTRI } from './wireTransfer.action';
import Upload from "../../assets/images/upload.svg"
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select'


const statusList = [
    { value: 1, label: 'Not Processed' },
    { value: 2, label: 'Receipt Uploaded' },
    { value: 3, label: 'Rejected' },
]

const userStatusList = [
    { value: 1, label: `Received` },
    { value: 2, label: `Not Received` },
]

const WithdrawRequests = (props) => {
    const [data, setData] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [requestModal, setRequestModal] = useState(false)
    const [requestData, setRequestData] = useState()
    const [resetButton, setResetButton] = useState(false)
    const [uploadModal, setUploadModal] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState()
    const [receipt, setReceipt] = useState('')
    const [submitLoader, setSubmitLoader] = useState(false)
    const [triLoader, setTriLoader] = useState(false)
    const [receiptData, setReceiptData] = useState()
    const [userAddressBook, setUserAddressBook] = useState()
    const [addressModal, setAddressModal] = useState(false)
    const [loader, setLoader] = useState(true)
    const [indexItem, setIndexItem] = useState()
    const [filters, setFilters] = useState({})

    useEffect(() => {
        window.scroll(0, 0)
        props.getWithdrawRequests()
    }, [])

    useEffect(() => {
        if (props.wireRequest.getWithdrawRequestAuth) {
            const { witdrawRequests,pagination } = props.wireRequest.getWithdrawRequestsList
            setData(witdrawRequests)
            setPagination(pagination)
            setLoader(false)
            props.beforeWireRequest()
        }
    }, [props.wireRequest.getWithdrawRequestAuth])

    const onPageChange = async (page) => {
        setLoader(true)
        let payload = {};
            if (filters.userName) {
                payload.userName = filters.userName
            }
            if (filters.userEmail) {
                payload.userEmail = filters.userEmail
            }
            if (filters.withdrawalAmount) {
                payload.withdrawalAmount = filters.withdrawalAmount
            }
            if (filters.userStatus) {
                payload.userStatus = filters.userStatus.value
            }
            if (filters.status) {
                payload.status = filters.status.value
            }
        const qs = ENV.objectToQueryString({ page, ...payload })
        props.getWithdrawRequests(qs, payload)
    }

    const applyFilters = () => {
        if (Object.keys(filters).length != 0) {
            setResetButton(true)
            let payload = {};
            if (filters.userName) {
                payload.userName = filters.userName
            }
            if (filters.userEmail) {
                payload.userEmail = filters.userEmail
            }
            if (filters.withdrawalAmount) {
                payload.withdrawalAmount = filters.withdrawalAmount
            }
            if (filters.userStatus) {
                payload.userStatus = filters.userStatus.value
            }
            if (filters.status) {
                payload.status = filters.status.value
            }
            const qs = ENV.objectToQueryString({ page: 1, limit: 10, ...payload })
            props.getWithdrawRequests(qs, payload)
            setLoader(true)
        }
        else {
            toast.error('Fill atleast one field.', {
                toastId: "FIELD_REQUIRED",
            })
        }
    }


    const upload = () => {
        let formdata = new FormData()
        formdata.append('withdrawalId', selectedRecord)
        formdata.append('image', receiptData)
        props.uploadReceipt(formdata)
        setSubmitLoader(true)
    }

    const onChange = (e) => {
        if (e.target.files[0]) {
            let newData = data
            newData[e.target.name] = URL.createObjectURL(e.target.files[0])
            setReceipt(newData.receipt)
            setReceiptData(e.target.files[0])
        }
    }

    const reset = () => {
        setResetButton(false)
        setFilters({})
        props.getWithdrawRequests()
        setLoader(true)
    }

    const uploadReset = () => {
        setReceipt('')
        setReceiptData('')
        setSelectedRecord('')
        setUploadModal(false)
        setSubmitLoader(false)
    }

    const manageRequest = (type, _id) => {
        setLoader(true)
        props.boforeManageRequest()
        let body = { action: type, _id }
        props.manageRequest(body)
    }

    const viewRequest = (detail) => {
        setRequestModal(true)
        setRequestData(detail)
    }

    useEffect(() => {
        if (props.wireRequest.receiptUploadAuth) {
            props.beforeWireRequest()
            setReceipt('')
            setReceiptData('')
            setSelectedRecord('')
            setUploadModal(false)
            setSubmitLoader(false)
            props.getWithdrawRequests()
        }
    }, [props.wireRequest.receiptUploadAuth])


    const handleTRIDeduction = (userId, amount, withdrawalId) => {
        setSelectedRecord(withdrawalId)
        setTriLoader(true)
        let payload = {
            userId, amount,withdrawalId
        }
        let qs = ENV.objectToQueryString(payload)
        props.deductTRI(qs)
    }

    useEffect(() => {
        if (props.wireRequest.triDeductionAuth) {
            let index = data.findIndex(e => e._id === selectedRecord);
            data[index].amountDeducted = true
            props.beforeWireRequest()
            setTriLoader(false)
            setSelectedRecord('')
        }
    }, [props.wireRequest.triDeductionAuth])


    return (
        <>
            {
                loader ?
                    <FullPageLoader />
                    :
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
                                                    <label>Search with Username...</label>
                                                    <Form.Control value={filters.userName} type="text" placeholder="Username" onChange={(e) => setFilters({ ...filters, userName: (e.target.value).trim() })} />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={4} sm={6}>
                                                <Form.Group>
                                                    <label>Search with Email...</label>
                                                    <Form.Control value={filters.userEmail} type="email" placeholder="Email" onChange={(e) => setFilters({ ...filters, userEmail: (e.target.value).trim() })} />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={4} sm={6}>
                                                <Form.Group>
                                                    <label>Search with Requested Withdrawal Amount...</label>
                                                    <Form.Control value={filters.withdrawalAmount} type="Number" placeholder="Deposited Amount" onKeyDown={(e) => ENV.decimalNumberValidator(e)} onChange={(e) => setFilters({ ...filters, withdrawalAmount: (e.target.value).trim() })} />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                        <Col xl={4} sm={6}>
                                                <Form.Group>
                                                    <label>Search with Received By User...</label>
                                                    <div className='select-items'><Select classNamePrefix="triage-select" className="w-100" placeholder={<span>Select Status</span>} value={filters.userStatus} options={userStatusList} onChange={(e) => { setFilters({ ...filters, userStatus: { label: e.label, value: e.value } }) }} /></div>
                                                </Form.Group>
                                            </Col>
                                            <Col xl={4} sm={6}>
                                                <Form.Group>
                                                    <label>Search with Status...</label>
                                                    <div className='select-items'><Select classNamePrefix="triage-select" className="w-100" placeholder={<span>Select Status</span>} value={filters.status} options={statusList} onChange={(e) => { setFilters({ ...filters, status: { label: e.label, value: e.value } }) }} /></div>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xl={4} sm={6}>
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">&nbsp;</Form.Label>
                                                    <div className="d-flex  filter-btns-holder">
                                                        <Button className="btn-filled mr-3" onClick={applyFilters}>Search</Button>
                                                        {resetButton && <Button variant="warning" className='outline-button' onClick={reset}>Reset</Button>}
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
                                            <Card.Title as="h4">Withdraw Requests</Card.Title>
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy table-w cms-table staff-table">
                                                <thead>
                                                    <tr>
                                                        <th className="td-start serial-col">#</th>
                                                        <th className="td-name">
                                                            <div className='faqs-title td-name'>Username</div>
                                                        </th>
                                                        <th className='td-status td-email'>Email</th>
                                                        <th className='td-status text-center'>Requested Withdrawal Amount</th>
                                                        <th className='td-status text-center'>Received By User</th>
                                                        <th className='td-status text-center'>Status</th>
                                                        <th className="td-actions text-center">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        data && data.length ?
                                                            data.map((item, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="serial-col text-white">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                        <td className="text-white">
                                                                            <div className="faq-title td-name">
                                                                                {item.userName}
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-white td-email">
                                                                            {item.userEmail || 'N/A'}
                                                                        </td>
                                                                        <td className="text-white text-center">
                                                                            {item.withdrawalAmount || 'N/A'}
                                                                        </td>
                                                                        <td className="text-white text-center">
                                                                            {/* {item.userStatus === 1 && "Received"}  */}
                                                                            {item.userStatus === 1 && <FontAwesomeIcon icon={faCheck} className="ml-2" />}
                                                                            {/* {item.userStatus === 2 && "Not Received"}  */}
                                                                            {item.userStatus === 2 && <FontAwesomeIcon icon={faTimes} className="ml-2" />}
                                                                            {!item.userStatus && "-"}
                                                                        </td>
                                                                        <td className="text-white text-center">
                                                                            {item.status === 1 ? "Not Processed" : item.status === 2 ? "Receipt Uploaded" :
                                                                                item.status === 3 ? "Rejected" : "N/A"}
                                                                        </td>
                                                                        <td className="td-actions text-center">
                                                                            <ul className="list-unstyled mb-0 d-flex justify-content-center">
                                                                                <li className="d-inline-block align-top">
                                                                                    <OverlayTrigger overlay={<Tooltip id="tooltip-436082023">User Bank Details</Tooltip>}  placement="top" >
                                                                                        <Button
                                                                                            className="btn-link btn-icon"
                                                                                            type="button"
                                                                                            variant="info"
                                                                                            onClick={() => { setUserAddressBook(item.userAddressBook); setAddressModal(true) }}
                                                                                        >
                                                                                            <i className="fas fa-book"></i>
                                                                                        </Button>
                                                                                    </OverlayTrigger>
                                                                                </li>
                                                                                <li key={index} className="d-inline-block align-top">
                                                                                    <OverlayTrigger overlay={<Tooltip id="tooltip-436082023">Deduct TRI</Tooltip>}  placement="top" >
                                                                                        <Button
                                                                                            className="btn-link btn-icon"
                                                                                            type="button"
                                                                                            disabled={item.amountDeducted}
                                                                                            variant="info"
                                                                                            onClick={() => {
                                                                                                handleTRIDeduction(item.userId, item.withdrawalAmount, item._id);
                                                                                                setIndexItem(index)
                                                                                            }}
                                                                                        >
                                                                                            {data.indexOf(item) === indexItem  && triLoader ? <div className="submit-loader ms-2"></div> :
                                                                                                <i className="fas fa-minus"></i>}
                                                                                        </Button>
                                                                                    </OverlayTrigger>
                                                                                </li>
                                                                                <li className="d-inline-block align-top">
                                                                                    <OverlayTrigger overlay={<Tooltip id="tooltip-436082023"> Upload Receipt </Tooltip>} placement="top" >
                                                                                        <Button
                                                                                            className="btn-link btn-icon"
                                                                                            type="button"
                                                                                            disabled={item.status === 2 && item.userStatus !== 2}
                                                                                            variant="info"
                                                                                            onClick={() => { setUploadModal(true); setSelectedRecord(item._id) }}
                                                                                        >
                                                                                            <i className="fas fa-upload"></i>
                                                                                        </Button>
                                                                                    </OverlayTrigger>
                                                                                </li>
                                                                            </ul>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan="7" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No Withdraw Requests Found</div>
                                                                </td>
                                                            </tr>
                                                    }
                                                </tbody>
                                            </Table>
                                            {
                                                pagination &&
                                                <Pagination
                                                    className="m-3"
                                                    defaultCurrent={1}
                                                    pageSize // items per page
                                                    current={pagination.page} // current active page
                                                    total={pagination.pages} // total pages
                                                    onChange={onPageChange}
                                                    locale={localeInfo}
                                                />
                                            }
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        {requestModal &&
                            <Modal className="modal-primary edit-cotnact-modal" onHide={() => setRequestModal(!requestModal)} show={requestModal}>
                                <Modal.Header className="justify-content-center">
                                    <Row>
                                        <div className="col-12">
                                            <h4 className="mb-0 mb-md-3 mt-0">
                                                Request Details
                                            </h4>
                                        </div>
                                    </Row>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form className="text-left">
                                        <div className=" name-email">
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2 text-white">Name:</strong>
                                                    <span className='text-white'>{data?.userName}  </span>
                                                </div>
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2 text-white">Email:</strong>
                                                    <span className='text-white'>{requestData?.email}</span>
                                                </div>
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2 text-white">Request Type:</strong>
                                                    <span className='text-white'>  {requestData?.type == 1 ? "Deletion Request" : "N/A"}</span>
                                                </div>
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex align-items-center">
                                                    <strong className="mr-2 text-white">Status:</strong>

                                                    <span className={`text-white ml-2 badge ${requestData?.status === '3' ? `badge-danger p-1` : requestData?.status === '1' ? `badge-warning p-1` : requestData?.status === '2' ? `badge-success p-1` : ``}`}>
                                                        {
                                                            requestData?.status === '1' ? 'Pending' : requestData?.status === '2 ' ? 'Accepted' : requestData?.status === '3' ? 'Rejected' : 'N/A'

                                                        } </span>




                                                </div>
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2 text-white">Message:</strong>
                                                    <span className='text-white'>{requestData?.description}</span>
                                                </div>
                                            </Form.Group>
                                        </div>
                                    </Form>
                                </Modal.Body>

                                <Modal.Footer>

                                </Modal.Footer>
                            </Modal>
                        }
                        <Modal show={uploadModal} onHide={() => setUploadModal(false)} className="deposit-request-modal" size="lg" backdrop="static">
                            <Modal.Header closeButton>
                                <Modal.Title id="contained-modal-title-vcenter">
                                    Please upload the transfer receipt
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="card d-flex justify-content-center align-items-center receipt-uploder">
                                    {receipt ?
                                        <div className=" pt-3 pb-3 card-img-uploader position-relative cursor-pointer">
                                            <img className="img-fluid" src={receipt} />
                                            <span className="icon-close" onClick={() => setReceipt()}>
                                                <FontAwesomeIcon icon={faTimes} />
                                            </span>
                                        </div>
                                        :
                                        <div className="input-file cursor-pointer">
                                            <label>  <img className="img-fluid" src={Upload} />
                                                <input type="file" size="60" accept=".png,.jpeg,.jpg" name="receipt" onChange={onChange} />
                                            </label>
                                        </div>}
                                </div>
                            </Modal.Body>
                            <Modal.Footer className='justify-content-center' >
                                <div className="d-flex justify-content-center flex-wrap">
                                    <button onClick={() => { setUploadModal(false); uploadReset() }} className="outline-button mr-4 mb-3 mb-md-0 mr-md-3 d-flex justify-content-center align-items-center"  >
                                        <span>CANCEL</span>
                                    </button>
                                    <button onClick={() => upload()} disabled={!receipt} className="btn-filled btn-triage me-4 mb-3 mb-md-0 me-3 d-flex justify-content-center align-items-center"  >
                                        <span className="mr-2">CONFIRM</span>
                                        {submitLoader && <SubmitLoader />}
                                    </button>
                                </div>
                            </Modal.Footer>
                        </Modal>

                        {/* Address Book Details */}
                        <Modal show={addressModal} onHide={() => setAddressModal(false)} className="deposit-request-modal" size="lg" backdrop="static">
                            <Modal.Header closeButton>
                                <Modal.Title id="contained-modal-title-vcenter">
                                    User Bank Details
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <ul className="list-unstyled bank-detail-list position-relative text-white">
                                    <li className="d-flex align-items-center justify-content-between flex-wrap flex-lg-nowrap position-relative">
                                        <strong className="mb-1 mb-lg-0 detail-label">Label:</strong>
                                        <span className="mb-1 mb-lg-0 detail-value">{userAddressBook?.label}</span>
                                    </li>
                                    <li className="d-flex align-items-center justify-content-between flex-wrap flex-lg-nowrap position-relative">
                                        <strong className="mb-1 mb-lg-0 detail-label">Beneficiary name:</strong>
                                        <span className="mb-1 mb-lg-0 detail-value">{userAddressBook?.beneficiaryName}</span>
                                    </li>
                                    <li className="d-flex align-items-center justify-content-between flex-wrap flex-lg-nowrap position-relative">
                                        <strong className="mb-1 mb-lg-0 detail-label">Beneficiary address
                                            :</strong>
                                        <span className="mb-1 mb-lg-0 detail-value">{userAddressBook?.beneficiaryAddress}</span>
                                    </li>
                                    <li className="d-flex align-items-center justify-content-between flex-wrap flex-lg-nowrap position-relative">
                                        <strong className="mb-1 mb-lg-0 detail-label">Country
                                            :</strong>
                                        <span className="mb-1 mb-lg-0 detail-value">{userAddressBook?.country}</span>
                                    </li>
                                    <li className="d-flex align-items-center justify-content-between flex-wrap flex-lg-nowrap position-relative">
                                        <strong className="mb-1 mb-lg-0 detail-label">Beneficiary Bank Name
                                            :</strong>
                                        <span className="mb-1 mb-lg-0 detail-value">{userAddressBook?.bankName}</span>
                                    </li>
                                    <li className="d-flex align-items-center justify-content-between flex-wrap flex-lg-nowrap position-relative">
                                        <strong className="mb-1 mb-lg-0 detail-label">Beneficiary Bank Address
                                            :</strong>
                                        <span className="mb-1 mb-lg-0 detail-value">{userAddressBook?.bankAddress}</span>
                                    </li>
                                    <li className="d-flex align-items-center justify-content-between flex-wrap flex-lg-nowrap position-relative">
                                        <strong className="mb-1 mb-lg-0 detail-label">Beneficiary Bank Account
                                            :</strong>
                                        <span className="mb-1 mb-lg-0 detail-value">{userAddressBook?.bankAccount}</span>
                                    </li>
                                    <li className="d-flex align-items-center justify-content-between flex-wrap flex-lg-nowrap position-relative">
                                        <strong className="mb-1 mb-lg-0 detail-label">BIC/SWIFT:</strong>
                                        <span className="mb-1 mb-lg-0 detail-value">{userAddressBook?.bic_swift}</span>
                                    </li>
                                    <li className="d-flex align-items-center justify-content-between flex-wrap flex-lg-nowrap position-relative">
                                        <strong className="mb-1 mb-lg-0 detail-label">Comments:</strong>
                                        <span className="mb-1 mb-lg-0 detail-value">{userAddressBook?.comment}</span>
                                    </li>
                                </ul>
                            </Modal.Body>
                            <Modal.Footer>
                         <Row>
                        <Col  md="12" >
                            <div className='d-flex justify-content-start align-items-center'>
                                <Button
                                   className="btn-filled pull-right mt-3"
                                       type="submit"
                                       variant="info"
                                         onClick={()=> props.history.goBack()}
                                          >
                                    Back
                                 </Button>
                                </div>
                         </Col>
                       
                      </Row>
                         </Modal.Footer>
                        </Modal>
                    </Container>
            }
        </>
    )
}

const mapStateToProps = state => ({
    request: state.request,
    error: state.error,
    wireRequest: state.wireRequest
});

export default connect(mapStateToProps, { getWithdrawRequests, beforeWireRequest, uploadReceipt, deductTRI })(WithdrawRequests);
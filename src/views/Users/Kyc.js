import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import { beforeUser, getUsers, deleteUser } from './Users.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import moment from 'moment';
import placeholderImg from '../../assets/images/placeholder.png';
import Swal from 'sweetalert2';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { toast } from 'react-toastify'
import { beforeRole, getRole } from 'views/AdminStaff/permissions/permissions.actions';
import { DateRangePicker } from 'react-date-range';
import {getKycs,beforeKyc} from "./kyc.action"

import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 

var CryptoJS = require("crypto-js");

const userDefaultImg = 'https://res.cloudinary.com/arhamsoft-ltd/image/upload/v1658297644/hex-nft/assets/transparent-placeholder_qetgdv.png';

const Kyc = (props) => {
    const [users, setUsers] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [userModal, setUserModal] = useState(false)
    const [modalType, setModalType] = useState(0)
    const [user, setUser] = useState(null)
    const [loader, setLoader] = useState(true)
    const [searchFirstName, setSearchFirstName] = useState('')
    const [searchLastName, setSearchLastName] = useState('')
    const [resetButton, setResetButton] = useState(false)
    const [searchEmail, setSearchEmail] = useState('')
    const [searchStatus, setSearchStatus] = useState('')
    const [searchAtFrom, setSearchCreatedAtFrom] = useState('')
    const [searchAtTo, setSearchCreatedAtTo] = useState('')
    const [permissions, setPermissions] = useState({})
    const [selectionRange, setSelectionRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    })
    const [searchDate, setSearchDate] = useState({
        startDate: '',
        endDate: ''
    })
    const [calendarCheck, setCalendarCheck] = useState(false)

    useEffect(() => {
        let roleEncrypted = localStorage.getItem('role');
        let role = ''
        if (roleEncrypted) {
            let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, ENV.secretKey).toString(CryptoJS.enc.Utf8);
            role = roleDecrypted
            props.getRole(role)
        }
    }, [])

    useEffect(() => {
        if (Object.keys(props.getRoleRes).length > 0) {
            setPermissions(props.getRoleRes.role)
            props.beforeRole()
        }
    }, [props.getRoleRes])

    useEffect(() => {
        window.scroll(0, 0)
        props.getKycs()
    }, [])


    useEffect(() => {
        if (props.kyc.kycListAuth) {
            setLoader(false)
            const { kycs, pagination } = props.kyc.kycs
            setUsers(kycs)
            setPagination(pagination)
            props.beforeKyc()
        }
    }, [props.kyc.kycListAuth])

    useEffect(() => {
        if (props.user.deleteUserAuth) {
            let filtered = users.filter((item) => {
                if (item._id !== props.user.userId)
                    return item
            })
            setUsers(filtered)
            props.beforeUser()
        }
    }, [props.user.deleteUserAuth])

    // useEffect(() => {
    //     if (users) {
    //         setLoader(false)
    //         if (window.location.search) {
    //             const urlParams = new URLSearchParams(window.location.search);
    //             setModal(3, urlParams.get('userId'))
    //         }
    //     }
    // }, [users])

    // when an error is received
    useEffect(() => {
        if (props.error.error)
            setLoader(false)
    }, [props.error.error])

    // set modal type
    const setModal = (type = 0, userId = null) => {
        setUserModal(!userModal)
        setModalType(type)
        setLoader(false)
        // add user
        if (type === 1) {
            let user = {
                name: '', image: '', description: '', status: false
            }
            setUser(user)
        }
        // edit or view user
        else if ((type === 2 || type === 3) && userId)
            getUser(userId)
    }

    const getUser = async (userId) => {
        setLoader(true)
        const userData = await users.find((elem) => String(elem._id) === String(userId))
        if (userData)
            setUser({ ...userData })
        setLoader(false)
    }

    const onPageChange = async (page) => {
        const filter = {}
        if (searchFirstName) {
            filter.firstName = searchFirstName
        }
        if (searchLastName) {
            filter.lastName = searchLastName
        }
        if (searchEmail) {
            filter.email = searchEmail
        }
        if (searchStatus) {
            filter.kyc = searchStatus
        }
        if (searchDate.startDate && searchDate.endDate) {
            filter.startDate = searchDate.startDate
            filter.endDate = searchDate.endDate
        }

        setLoader(true)
        const qs = ENV.objectToQueryString({ page, ...filter })
        props.getKycs(qs)
        //props.getUsers(qs)
    }

    const deleteUser = (userId) => {
        Swal.fire({
            title: 'Are you sure you want to delete?',
            html: 'If you delete an item, it will lost permanently.',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Delete'
        }).then(async (result) => {
            if (result.value) {
                setLoader(true)
                props.deleteUser(userId)
            }
        })
    }

    const applyFilters = () => {
        const filter = {}
        if (searchFirstName) {
            filter.firstName = searchFirstName.trim()
        }
        if (searchLastName) {
            filter.lastName = searchLastName.trim()
        }
        if (searchEmail) {
            filter.email = searchEmail.trim()
        }
        if (searchStatus) {
            filter.kyc = searchStatus
        }
        if (searchDate.startDate && searchDate.endDate) {
            filter.startDate = searchDate.startDate
            filter.endDate = searchDate.endDate
        }
        if (filter.firstName || filter.lastName || filter.email || filter.kyc || (searchDate.startDate && searchDate.endDate)) {
            setResetButton(true)
            const qs = ENV.objectToQueryString({ page: 1, limit: 10, ...filter })
            props.getKycs(qs)
            setCalendarCheck(false)
            setLoader(true)
        }
        else {
            toast.error('Add data in at least one field', {
                toastId: "FIELD_REQUIRED",
            })
        }
    }
// console.log("user",user)
// console.log("users",users)
// console.log("pagination",pagination)

    const reset = () => {
        setSearchCreatedAtFrom('')
        setResetButton(false)
        setSearchCreatedAtTo('')
        setSearchEmail('')
        setSearchFirstName('')
        setSearchLastName('')
        setSearchStatus('')
        setCalendarCheck(false)
        setSelectionRange({
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        })
        setSearchDate({
            startDate: '',
            endDate: ''
        })
        props.getKycs()
        setLoader(true)
    }

    const handleDateRange = (ranges) => {
        if (ranges) {
            setSelectionRange(ranges.selection)
            setSearchDate({
                startDate: ranges.selection.startDate.toISOString(),
                endDate: ranges.selection.endDate.toISOString()
            })
        }
    }

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
                                                    <label>Search with First Name...</label>
                                                    <Form.Control value={searchFirstName} type="text" placeholder="First Name" onChange={(e) => setSearchFirstName(e.target.value)} />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={4} sm={6}>
                                                <Form.Group>
                                                    <label>Search with Last Name...</label>
                                                    <Form.Control value={searchLastName} type="text" placeholder="Last Name" onChange={(e) => setSearchLastName(e.target.value)} />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={4} sm={6}>
                                                <Form.Group>
                                                    <label>Search with Email...</label>
                                                    <Form.Control value={searchEmail} type="text" placeholder="Email" onChange={(e) => setSearchEmail(e.target.value)} />
                                                </Form.Group>
                                            </Col>
                                            {/* <Col xl={4} sm={6} className="search-wrap">
                                                <label >Search with KYC Verified...</label>
                                                <Form.Group>
                                                    <select value={searchStatus} onChange={(e) => setSearchStatus(e.target.value)}>
                                                        <option value="">Select KYC Verified</option>
                                                        <option value='true'>Yes</option>
                                                        <option value="false">No</option>
                                                    </select>
                                                </Form.Group>
                                            </Col> */}
                                            <Col xl={4} sm={6}>
                                                <Form.Group>
                                                    <label>Search with Requested Dates...</label>
                                                    <div>
                                                        <Button className="btn-filled mr-3" onClick={() => { setCalendarCheck(calendarCheck => !calendarCheck) }}>{calendarCheck ? 'Hide Calendar' : 'Show Calendar'}</Button>
                                                    </div>
                                                    {
                                                        calendarCheck ?
                                                            <DateRangePicker
                                                                ranges={[selectionRange]}
                                                                onChange={handleDateRange}
                                                            />
                                                            : ''
                                                    }
                                                </Form.Group>
                                            </Col>
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
                                            <Card.Title as="h4">KYC</Card.Title>
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy kyc-table">
                                                <thead>
                                                    <tr>
                                                        <th className="td-start">#</th>
                                                        <th className='td-name td-name-col'>Name</th>
                                                        <th className='td-mail td-email-col'>Email</th>
                                                        <th className="td-created text-center td-kyc-col">KYC Verified</th>
                                                        <th className="text-center td-created">Requested At</th>
                                                        {permissions?.editKyc && <th className="td-actions text-center">View</th>}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        users && users.length ?
                                                            users.map((user, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="serial-col text-white">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                        <td className='text-white td-name td-name-col'>
                                                                            {user.firstName ? user.firstName + ' ' : 'N/A'} {user.firstName && user.lastName ? user.lastName : ''}
                                                                        </td>
                                                                        <td className='text-white td-mail td-email-col'>
                                                                            {user.email ? user.email : 'N/A'}
                                                                        </td>
                                                                        <td className='text-white td-name text-center td-kyc-col'>
                                                                            <span className={`${user.appliedKYC === 3 ? 'bg-success' : 'bg-danger'} text-white kyc-badge px-2 py-1 d-inline-block align-top`}>
                                                                                {user.appliedKYC === 3 ? 'YES' : 'NO'}
                                                                            </span>
                                                                        </td>
                                                                        <td className='text-white td-name text-center td-kyc-col'>
                                                                        {user.updatedAt ? moment(user.updatedAt).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}
                                                                        </td>
                                                                        {/* <td className="td-number td-created text-white text-center">{moment(user.createdAt).format('DD MMM YYYY')}</td> */}
                                                                        {
                                                                            permissions?.editKyc ?
                                                                                <td className="td-actions text-center">
                                                                                    <ul className="list-unstyled mb-0 d-flex justify-content-center">
                                                                                        <li className="d-inline-block align-top">
                                                                                            <OverlayTrigger overlay={<Tooltip id="tooltip-436082023"> Edit </Tooltip>}  placement="top" >
                                                                                                <Button
                                                                                                    className="btn-link btn-icon"
                                                                                                    type="button"
                                                                                                    variant="info"
                                                                                                    onClick={() => {
                                                                                                        setLoader(true);
                                                                                                        props.history.push(`/user/${window.btoa(user.userId)}`);
                                                                                                    }}
                                                                                                >
                                                                                                    <i className="fas fa-eye"></i>
                                                                                                </Button>
                                                                                            </OverlayTrigger>
                                                                                        </li>

                                                                                    </ul>
                                                                                </td> : ''
                                                                        }
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan={permissions?.editKyc ? "6" : "5"} className="text-center">
                                                                    <div className="alert alert-info" role="alert">No KYC Requests</div>
                                                                </td>
                                                            </tr>
                                                    }
                                                </tbody>
                                            </Table>
                                            <div className="pb-4">
                                                {pagination &&
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
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {
                            modalType > 0 && user &&
                            <Modal className="modal-primary" onHide={() => setUserModal(!userModal)} show={userModal}>
                                <Modal.Header className="justify-content-center">
                                    <Row>
                                        <div className="col-12">
                                            <h4 className="mb-0 mb-md-3 mt-0">
                                                {modalType === 1 ? 'Add' : modalType === 2 ? 'Edit' : ''} {user.username}
                                            </h4>
                                        </div>
                                    </Row>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form className="text-left">
                                        <Form.Group>
                                            <label className="label-font mr-2">Profile Image: </label>
                                            <div>
                                                <div className="user-view-image">
                                                    <img src={user.profileImage ? user.profileImage : userDefaultImg} />
                                                </div>
                                            </div>
                                        </Form.Group>
                                        <div className="d-flex name-email">
                                            <Form.Group className=' d-flex'>
                                                <label className="label-font mr-2">Description:</label><span className="field-value text-white"> {user.description ? user.description : 'N/A'}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className=' d-flex align-items-center'>
                                                <label className="label-font mr-2" l>Facebook: </label><span className="field-value text-white">{user.facebookLink ? user.facebookLink : 'N/A'}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className=' d-flex align-items-center'>
                                                <label className="label-font mr-2">Twitter: </label><span className="field-value text-white">{user.twitterLink ? user.twitterLink : 'N/A'}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className=' d-flex align-items-center'>
                                                <label className="label-font mr-2">G Plus: </label><span className="field-value text-white">{user.gPlusLink ? user.gPlusLink : 'N/A'}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className=' d-flex align-items-center'>
                                                <label className="label-font mr-2">Vine: </label><span className="field-value text-white">{user.vineLink ? user.vineLink : 'N/A'}</span>
                                            </Form.Group>
                                        </div>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button className="outline-button" onClick={() => setUserModal(!userModal)}>Close</Button>
                                </Modal.Footer>
                            </Modal>
                        }
                    </Container>
            }
        </>
    )
}

const mapStateToProps = state => ({
    user: state.user,
    kyc: state.kyc,
    error: state.error,
    getRoleRes: state.role.getRoleRes
});

export default connect(mapStateToProps, { beforeUser, getUsers, deleteUser, getRole, beforeRole,getKycs,beforeKyc })(Kyc);
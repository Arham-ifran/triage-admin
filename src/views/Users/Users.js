import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import { beforeUser, getUsers, deleteUser } from './Users.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { toast } from 'react-toastify'
import moment from 'moment';
import placeholderImg from '../../assets/images/placeholder.png';
import { beforeRole, getRole } from 'views/AdminStaff/permissions/permissions.actions';
import Swal from 'sweetalert2';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import UserModal from "./userModalComponent"
import { DateRangePicker } from 'react-date-range';

import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 

const userDefaultImg = 'https://res.cloudinary.com/arhamsoft-ltd/image/upload/v1658297644/hex-nft/assets/transparent-placeholder_qetgdv.png';

const Users = (props) => {
    const [users, setUsers] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [userModal, setUserModal] = useState(false)
    const [modalType, setModalType] = useState(0)
    const [user, setUser] = useState(null)
    const [userId, setUserId] = useState()
    const [loader, setLoader] = useState(true)
    const [searchFirstName, setSearchFirstName] = useState('')
    const [resetButton, setResetButton] = useState(false)
    const [searchLastName, setSearchLastName] = useState('')
    const [permissions, setPermissions] = useState({})
    const [searchEmail, setSearchEmail] = useState('')
    const [searchStatus, setSearchStatus] = useState('')
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
    const [searchAtFrom, setSearchCreatedAtFrom] = useState('')
    const [searchAtTo, setSearchCreatedAtTo] = useState('')




    useEffect(() => {
        window.scroll(0, 0)
        props.getUsers()
    }, [])


    useEffect(() => {
        if (props.user.getUserAuth) {
            const { users, pagination } = props.user
            setUsers(users)
            setPagination(pagination)
            props.beforeUser()
        }
    }, [props.user.getUserAuth])

    useEffect(() => {
        if (Object.keys(props.getRoleRes).length > 0) {
            setPermissions(props.getRoleRes.role)
            props.beforeRole()
        }
    }, [props.getRoleRes])

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


    useEffect(() => {
        if (users) {
            setLoader(false)
            if (window.location.search) {
                const urlParams = new URLSearchParams(window.location.search);
                setModal(3, urlParams.get('userId'))
            }
        }
    }, [users])

    useEffect(()=> {
        if(props.user.upsertUserAuth) {
            const {users} = props.user.users
            setUsers(users)
            setLoader(false)
            setUserModal(false)
          props.beforeUser();
        }
      }, [props.user.upsertUserAuth])

    // when an error is received
    useEffect(() => {
        if (props.error.error)
            setLoader(false)
    }, [props.error.error])

    // set modal type
    const setModal = (type = 0, userId = null) => {
        setModalType(type)
        setUserModal(!userModal)
        // edit or view user
        if ((type === 1 || type === 2) && userId)
            getUser(userId)
    }

    const getUser = async (userId) => {
        setLoader(true)
        const userData = await users.find((elem) => String(elem._id) === String(userId))
        if (userData)
            setUser({ ...userData })
        setUserId(userId)
        setLoader(false)
    }

    const onPageChange = async (page) => {
        const filter = {}
        const body = {}
        if (searchFirstName) {
            filter.firstName = searchFirstName.trim()
        }
        if (searchLastName) {
            filter.lastName = searchLastName.trim()
        }
        if (searchEmail) {
            filter.email = searchEmail.trim()
            body.email = searchEmail.trim()
        }
        if (searchStatus) {
            console.log(searchStatus)
            filter.kyc = searchStatus
        }
        if (searchDate.startDate && searchDate.endDate) {
            filter.startDate = searchDate.startDate
            filter.endDate = searchDate.endDate
        }
            
        setLoader(true)
        const qs = ENV.objectToQueryString({ page, ...filter })
        props.getUsers(qs, body)
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
        const body = {}
        if (searchFirstName) {
            filter.firstName = searchFirstName.trim()
        }
        if (searchLastName) {
            filter.lastName = searchLastName.trim()
        }
        if (searchEmail) {
            filter.email = searchEmail.trim()
            body.email = searchEmail.trim()
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
            props.getUsers(qs, body)
            setCalendarCheck(false)
            setLoader(true)
        }
        else {
            toast.error('Add data in at least one field.', {
                toastId: "FIELD_REQUIRED",
            })
        }
    }

    const reset = () => {
        setResetButton(false)
        setSearchCreatedAtFrom('')
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
        props.getUsers()
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
                                            <Col xl={4} sm={6} className="search-wrap">
                                                <label >Search with KYC Verified...</label>
                                                <Form.Group>
                                                    <select value={searchStatus} onChange={(e) => {setSearchStatus(e.target.value)}}>
                                                        <option value="">Select KYC Verified</option>
                                                        <option value='true'>Yes</option>
                                                        <option value="false">No</option>
                                                    </select>
                                                </Form.Group>
                                            </Col>
                                            {/* <Col xl={4} sm={6}>
                                                <Form.Group>
                                                    <label>Search with Created Dates...</label>
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
                                            </Col> */}
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
                                            <Card.Title as="h4">Users</Card.Title>
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy users-table">
                                                <thead>
                                                    <tr>
                                                        <th className="td-start">#</th>
                                                        <th className='td-name'>Name</th>
                                                        <th className='td-mail'>Email</th>
                                                        <th className="td-created text-center td-kyc-col">KYC Verified</th>
                                                        {/* <th className="text-center td-created td-created-col">Created At</th> */}
                                                        <th className="td-actions text-center">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        users && users.length ?
                                                            users.map((user, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="serial-col text-white">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                        <td className='text-white td-name'>
                                                                            {user.firstName ? user.firstName + ' ' : 'N/A'} {user.firstName && user.lastName ? user.lastName : ''}
                                                                        </td>
                                                                        <td className='text-white td-mail'>
                                                                            {user.email ? user.email : 'N/A'}
                                                                        </td>
                                                                        <td className='text-white td-name text-center td-kyc-col'>
                                                                            <span className={`${user.kycStatus === 3 ? 'bg-success' : 'bg-danger'} text-white kyc-badge px-2 py-1 d-inline-block align-top`}>
                                                                                {user.kycStatus === 3 ? 'YES' : 'NO'}
                                                                            </span>
                                                                        </td>
                                                                        {/* <td className="td-number td-created text-white text-center td-created-col">{moment(user.createdAt).format('DD MMM YYYY')}</td> */}
                                                                        <td className="td-actions">
                                                                            <ul className="list-unstyled mb-0 d-flex justify-content-center">{
                                                                                permissions?.viewUsers ?
                                                                                    <li className="d-inline-block align-top">
                                                                                        <OverlayTrigger overlay={<Tooltip id="tooltip-436082023" >View</Tooltip>}  placement="top">
                                                                                            <button type="button" className="btn-link btn-icon btn btn-info" onClick={() => setModal(1, user._id)}><i className="fas fa-eye"></i></button>
                                                                                        </OverlayTrigger>
                                                                                    </li>
                                                                                    : null
                                                                            }
                                                                                {permissions?.editUser ?
                                                                                    <li className="d-inline-block align-top">
                                                                                        <OverlayTrigger overlay={<Tooltip id="tooltip-436082023">Edit</Tooltip>}  placement="top">
                                                                                            <button type="button" className="btn-link btn-icon btn btn-success" onClick={() => setModal(2, user._id)}><i className="fas fa-edit"></i></button>
                                                                                        </OverlayTrigger>
                                                                                    </li>
                                                                                    : null
                                                                                }
                                                                                {
                                                                                    permissions?.deleteUser ?
                                                                                        <li className="d-inline-block align-top">
                                                                                            <OverlayTrigger overlay={<Tooltip id="tooltip-436082023">Delete</Tooltip>}  placement="top">
                                                                                                <button type="button" className="btn-link btn-icon btn btn-danger" onClick={() => deleteUser(user._id)}><i className="fas fa-trash"></i></button>
                                                                                            </OverlayTrigger>
                                                                                        </li>
                                                                                        : null
                                                                                }
                                                                            </ul>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan="5" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No User Found</div>
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
                        <UserModal modalType={modalType} userData={user} userModal={userModal} setUserModal={setUserModal} userId={userId} setLoader={setLoader}/>
                    </Container>
            }
        </>
    )
}

const mapStateToProps = state => ({
    user: state.user,
    error: state.error,
    getRoleRes: state.role.getRoleRes

});

export default connect(mapStateToProps, { beforeUser, getUsers, deleteUser, getRole, beforeRole })(Users);
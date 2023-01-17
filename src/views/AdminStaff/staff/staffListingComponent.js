import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { getAdmin, getStaffAdmins, deleteAdmin, beforeAdmin } from 'views/Admin/Admin.action';
import { getRoles, beforeRole } from '../permissions/permissions.actions';
import { getPermission } from '../permissions/permissions.actions';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify'
import Pagination from 'rc-pagination';
import { Link } from 'react-router-dom'
import 'rc-pagination/assets/index.css';
import StaffModal from './staffModalComponent'
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal, FormGroup } from "react-bootstrap";
var CryptoJS = require("crypto-js");
import { ENV } from 'config/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const AdminStaff = (props) => {
    const [admins, setAdmins] = useState({})
    const [admin, setAdmin] = useState({})
    const [currentUserRole, setCurrentUserRole] = useState({})
    const [isLoader, setLoader] = useState(true)
    const [roleModal, setroleModal] = useState(false)
    const [modalType, setModalType] = useState()
    const [roles, setRoles] = useState()
    const [search, setSearch] = useState('')
    const [email, setEmail] = useState('')
    const [roleSearch, setRoleSearch] = useState('')
    const [searchStatus, setSearchStatus] = useState('')
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)
    const [pages, setPages] = useState(0)
    const [resetButton, setResetButton] = useState(false)
    const [total, setTotal] = useState(0)
    const adminId = localStorage.getItem('userID')
    const [flag, setFlag] = useState(false)

    // set modal type
    const setModal = (type = 1, admin = {}) => {
        setFlag((prevVal) => !prevVal)
        setroleModal(!roleModal)
        setModalType(type)
        setLoader(false)
        // add category
        if ((type === 2 || type === 3) && admin) {
            setAdmin(admin)
        }
    }


    const deleteRoleHandler = (adminId) => {
        Swal.fire({
            title: 'Are you sure you want to delete?',
            html: 'If you delete a staff, it will lost permanently.',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Delete'
        }).then(async (result) => {
            if (result.value) {
                setLoader(true)
                props.deleteAdmin(adminId)
            }
        })
    }

    const onSearch = () => {
        if (search || email || searchStatus || roleSearch) {
            setResetButton(true)
            const qs = ENV.objectToQueryString({ title: search.trim(), email: email.trim(), status: searchStatus, roleId: roleSearch })
            props.getStaffAdmins(1, limit, qs, adminId)
            setLoader(true)
        }
        else {
            toast.error('All filters are empty.', {
                toastId: "FIELD_REQUIRED",
            })
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSearch();
        }
    }

    const reset = () => {
        setLoader(true)
        setResetButton(false)
        setSearch('')
        setEmail('')
        setRoleSearch('')
        setSearchStatus('')
        props.getStaffAdmins(1, 10, "", adminId)
    }

    const onPageChange = (page) => {
        const qs = ENV.objectToQueryString({ title: search.trim(), email: email.trim(), status: searchStatus, roleId: roleSearch })
        props.getStaffAdmins(page, limit, qs, adminId)
        // props.getStaffAdmins(page, limit, search, adminId)
        setLoader(true)
    }

    const getData = (admin) => {
        props.getStaffAdmins(page, limit, search, adminId)
        // setLoader(false)
        setAdmin(admin)
    }

    useEffect(() => {
        let roleEncrypted = localStorage.getItem('role');
        let role = '';
        if (roleEncrypted) {
            let roleDecrepted = CryptoJS.AES.decrypt(roleEncrypted, ENV.secretKey).toString(CryptoJS.enc.Utf8);
            props.getPermission(roleDecrepted)

            props.getStaffAdmins(1, 10, '', localStorage.getItem('userID'))
            props.getRoles({}, true, false)
            // setLoader(false)
        }
    }, [])

    useEffect(() => {
        if (props.currentUserPermission.authPermission) {
            setCurrentUserRole(props.currentUserPermission.permission.role)
        }

    }, [props.currentUserPermission.authPermission])

    useEffect(() => {
        if (props.getAdminAuth && Object.keys(props.getAdminsRes?.data).length > 0) {
            setLoader(false)
            let data = props.getAdminsRes.data
            // let filteredAdmins = data.admins.filter((admin) => admin._id !== adminId)
            setAdmins(data.admins)
            setPage(data.pagination.page)
            setPages(data.pagination.pages)
            setLimit(data.pagination.limit)
            setTotal(data.pagination.total)
            props.beforeAdmin()
            setLoader(false)
        }
    }, [props.getAdminAuth])

    useEffect(() => {
        if (Object.keys(props.deleteAdminRes).length > 0) {
            setModalType(1)
            setLoader(false)
            // toast.success(`Success! ${props.deleteAdminRes.message}`);
            props.beforeAdmin();
            props.getStaffAdmins(1, 10, "", adminId);
        }
    }, [props.deleteAdminRes])


    useEffect(() => {
        if (Object.keys(props.getRolesRes).length > 0) {
            setRoles(props.getRolesRes.data)
            props.beforeRole()
        }
    }, [props.getRolesRes])

    return (
        <>
            {
                isLoader ?
                    <FullPageLoader />
                    :
                    <Container fluid>
                        <Row>
                            <Col md="12">
                                <Card className="filter-card card">
                                    <Card.Header>
                                        <div className="d-flex align-items-center justify-content-between table-head">
                                            <Card.Title as="h4">Filters</Card.Title>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col xl={4} sm={6} className="search-wrap">
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">Search with name...</Form.Label>
                                                    <Form.Control onKeyPress={handleKeyPress} name="search" placeholder="Name" value={search} onChange={(e) => setSearch(e.target.value)}></Form.Control>
                                                </Form.Group>
                                            </Col>
                                            <Col xl={4} sm={6} className="search-wrap">
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">Search with email...</Form.Label>
                                                    <Form.Control onKeyPress={handleKeyPress} name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                                                </Form.Group>
                                            </Col>
                                            <Col xl={4} sm={6} className="search-wrap">
                                                <label >Search with User Role...</label>
                                                <Form.Group>
                                                    <select className="form-select pr-3 mr-3" aria-label="Default select example" name="roleSearch" value={roleSearch} onChange={(e) => { setRoleSearch(e.target.value); }} >
                                                        <option value='' className='text-dark'>Select Role</option>
                                                        {
                                                            roles ?
                                                                roles.length > 0 ?
                                                                    roles.map((role, key) => {
                                                                        return (<option className='text-dark' key={key} value={role._id}>{role.title}</option>);
                                                                    }) : <option value='' disabled>No role found</option>
                                                                : ''
                                                        }
                                                    </select>
                                                </Form.Group>
                                            </Col>
                                            <Col xl={4} sm={6} className="search-wrap">
                                                <label >Search with status...</label>
                                                <Form.Group>
                                                    <select value={searchStatus} onKeyPress={handleKeyPress} onChange={(e) => setSearchStatus(e.target.value)}>
                                                        <option value="">Select Status</option>
                                                        <option value='true'>Active</option>
                                                        <option value="false">Inactive</option>
                                                    </select>
                                                </Form.Group>
                                            </Col>
                                            <Col xl={4} sm={6}>
                                                <Form.Group>
                                                    <label className="d-none d-sm-block mb-2 form-label">&nbsp;</label>
                                                    <div className="d-flex filter-btns-holder">
                                                        <button type="button" className="btn-filled mr-3" onClick={onSearch} >
                                                            Search
                                                            {/* <i className="fa fa-search" /> */}
                                                        </button>
                                                        {resetButton && <button type="button" className="outline-button" onClick={reset}>Reset</button>}
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                                <Card className="table-big-boy">
                                    <Card.Header>
                                        <div className="d-flex align-items-center justify-content-between table-head">
                                            <Card.Title as="h4">Staff</Card.Title>
                                            {/* <p className="card-category">List of Categories</p> */}
                                            {currentUserRole && currentUserRole.addStaff ?
                                                <Button className="btn-filled d-flex align-items-center" onClick={() => setModal(1)}>
                                                    <span className='add-icon mr-2'>
                                                        <FontAwesomeIcon icon={faPlus} />
                                                    </span>
                                                    Add New Staff</Button>
                                                :
                                                ''
                                            }
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width staff-table">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy ">
                                                <thead>
                                                    <tr>
                                                        <th className="td-start">#</th>
                                                        <th className='td-name'>Name</th>
                                                        <th className='td-email'>Email</th>
                                                        <th className='td-role'>User Role</th>
                                                        <th className="text-center td-status">Status</th>
                                                        <th className="td-actions text-center">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        admins && admins.length > 0 ?
                                                            admins.map((val, key) => {
                                                                return (
                                                                    <tr key={key}>
                                                                        <td className='text-white'>{((limit * page) - limit) + key + 1}</td>
                                                                        <td className='text-white td-name'>{val.name}</td>
                                                                        <td className='text-white td-email'>{val.email}</td>
                                                                        <td className='text-white td-role'>{val.role.title}</td>
                                                                        <td className='text-white text-center'>
                                                                            {val.status?
                                                                                <span className="label kyc-badge kyc-status-badge d-inline-block align-top label-success px-2">Active</span>
                                                                                :
                                                                                <span className="label kyc-badge kyc-status-badge d-inline-block align-top label-danger px-2">Inactive</span>
                                                                            }
                                                                        </td>
                                                                        <td className="td-actions">
                                                                            <ul className="list-unstyled mb-0 d-flex justify-content-center">{
                                                                                currentUserRole?.viewStaff ?
                                                                                    <li className="d-inline-block align-top">
                                                                                        <OverlayTrigger overlay={<Tooltip id="tooltip-436082023" >View</Tooltip>}  placement="top">
                                                                                            <button type="button" className="btn-link btn-icon btn btn-info" onClick={() => setModal(2, val)}><i className="fas fa-eye"></i></button>
                                                                                        </OverlayTrigger>
                                                                                    </li>
                                                                                    : null
                                                                            }
                                                                                {currentUserRole?.editStaff ?
                                                                                    <li className="d-inline-block align-top">
                                                                                        <OverlayTrigger overlay={<Tooltip id="tooltip-436082023">Edit</Tooltip>}  placement="top">
                                                                                            <button type="button" className="btn-link btn-icon btn btn-success" onClick={() => setModal(3, val)}><i className="fas fa-edit"></i></button>
                                                                                        </OverlayTrigger>
                                                                                    </li>
                                                                                    : null
                                                                                }
                                                                                {
                                                                                    currentUserRole?.deleteStaff ?
                                                                                        <li className="d-inline-block align-top">
                                                                                            <OverlayTrigger overlay={<Tooltip id="tooltip-436082023">Delete</Tooltip>}  placement="top">
                                                                                                <button type="button" className="btn-link btn-icon btn btn-danger" onClick={() => deleteRoleHandler(val._id)}><i className="fas fa-trash"></i></button>
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
                                                                <td className="text-center px-0" colSpan="6">
                                                                    <span className="alert alert-danger d-block text-center">No Record Found</span>
                                                                </td>
                                                            </tr>
                                                    }
                                                </tbody>
                                            </Table>
                                            <Col className="pb-4">
                                                <Pagination
                                                    defaultCurrent={1}
                                                    pageSize // items per page
                                                    current={page} // current active page
                                                    total={pages} // total pages
                                                    onChange={onPageChange}
                                                    locale={localeInfo}
                                                />
                                            </Col>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <StaffModal flag={flag} getData={getData} modalType={modalType} setModalType={setModalType} roleModal={roleModal} setroleModal={setroleModal} setLoader={setLoader} admin={admin} roles={roles} />
                    </Container>
            }
        </>
    )
}

const mapStateToProps = state => ({
    getAdminsRes: state.admin.getAdminsRes,
    getAdminAuth: state.admin.getAuth,
    currentUserPermission: state.role,
    deleteAdminRes: state.admin.deleteAdminRes,
    getRolesRes: state.role.getRolesRes,
});

export default connect(mapStateToProps, { getAdmin, getStaffAdmins, deleteAdmin, beforeAdmin, getRoles, beforeRole, getPermission })(AdminStaff);
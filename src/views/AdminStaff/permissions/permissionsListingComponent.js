import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../../config/config';
import { beforeRole, updateRole, deleteRole, getRole, getPermission, getRoles } from './permissions.actions'
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify'
import validator from 'validator';
import Pagination from 'rc-pagination';
import { Link } from 'react-router-dom'
import 'rc-pagination/assets/index.css';
import PermissionsModal from './permissionsModalComponent'
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal, FormGroup } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

var CryptoJS = require("crypto-js");

const StaffPermissions = (props) => {
    const [roleModal, setroleModal] = useState(false)
    const [modalType, setModalType] = useState(0)
    const [titleMsg, setTitleMsg] = useState('')
    const [isLoader, setLoader] = useState(true)
    const [currentUserRole, setCurrentUserRole] = useState({})
    const [currentRoleId, setCurrentRoleId] = useState('')
    const [roles, setRoles] = useState()
    const [search, setSearch] = useState('')
    const [searchStatus, setSearchStatus] = useState('')
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)
    const [pages, setPages] = useState(0)
    const [total, setTotal] = useState(0)
    const [status, setStatus] = useState(false)
    const [resetButton, setResetButton] = useState(false)
    const [title, setTitle] = useState('')
    const [selectAll, setSelectAll] = useState(false)
    const [role, setRole] = useState({
        /**  system permissions **/

        /**  system permissions **/
        // props.status (i.e: true for active & false for in-active)

        viewDashboard: false,

        // staff's records
        addStaff: false,
        editStaff: false,
        deleteStaff: false,
        viewStaff: false,

        // permissions
        addRole: false,
        editRole: false,
        deleteRole: false,
        viewRole: false,

        // users records
        addUser: false,
        editUser: false,
        deleteUser: false,
        viewUsers: false,

        // kycs
        viewKyc: false,
        editKyc: false,

        // AccountTier
        viewAccountTier: false,
        addAccountTier: false,
        editAccountTier: false,
        deleteAccountTier: false,

        // Criteria
        viewCriteria: false,
        addCriteria: false,
        editCriteria: false,
        deleteCriteria: false,

        // PromoCodes
        viewPromoCodes: false,
        addPromoCodes: false,
        editPromoCodes: false,
        deletePromoCodes: false,

        // stakings
        viewStaking: false,
        editStaking: false,

        // ReceiveStaking
        viewReceiveStaking: false,
        editReceiveStaking: false,

        // EmailTemplates 
        viewEmailTemplates: false,
        addEmailTemplates: false,
        editEmailTemplates: false,
        deleteEmailTemplates: false,

        //FaqCategories 
        viewFaqCategories: false,
        addFaqCategories: false,
        editFaqCategories: false,
        deleteFaqCategories: false,

        // FAQs 
        addFaq: false,
        editFaq: false,
        deleteFaq: false,
        viewFaqs: false,

        // Wallets 
        viewWallet: false,
        addWallet: false,
        editWallet: false,
        deleteWallet: false,

        // Delete Request 
        viewRequestDeletion: false,
        editRequestDeletion: false,
        deleteRequestDeletion: false,

        // content 
        viewContent: false,
        addContent: false,
        editContent: false,
        deleteContent: false,

        // History  
        viewHistory: false,

        // contact 
        viewContact: false,
        editContact: false,
        deleteContact: false,

        // settings 
        viewSetting: false,
        editSetting: false,

        // newsletter/subscriptions
        viewNewsLetter: false,

    })


    // set modal type
    const setModal = (type = 0, role = {}) => {
        setroleModal(!roleModal)
        setModalType(type)
        setLoader(false)
        if ((type === 2 || type === 3) && role) {
            setRole(role)
        }
        if (type === 1) {
            setEmpty()
        }
    }
    const setEmpty = () => {
        setTitle('')
        setTitleMsg('')
        setStatus(false)
        setSelectAll(false)
        for (let key in role) {
            role[key] = false
        }
    }

    const getData = (role) => {
        setRole(role)
        props.getRoles()
    }

    const deleteRoleHandler = (roleId) => {
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
                props.deleteRole(roleId)
            }
        })
    }

    const onSearch = () => {
        if (search || searchStatus) {
            setResetButton(true)
            const qs = ENV.objectToQueryString({ title: search.trim(), status: searchStatus })
            props.getRoles(qs)
            setModalType(0)
            setLoader(true)
        }
        else {
            toast.error('Add title or select status to be searched.', {
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
        setResetButton(false)
        setLoader(true)
        setSearch('')
        setSearchStatus('')
        props.getRoles()
    }

    const onPageChange = (page) => {
        const qs = ENV.objectToQueryString({ page, limit, title: search.trim(), status: searchStatus })
        props.getRoles(qs)
        setLoader(true)
    }

    useEffect(() => {
        props.getRoles()
        let roleEncrypted = localStorage.getItem('role');
        let role = '';
        if (roleEncrypted) {
            let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, ENV.secretKey).toString(CryptoJS.enc.Utf8);
            props.getPermission(roleDecrypted)
            role = roleDecrypted
        }
        setCurrentRoleId(role !== '' ? role : null)
    }, [])

    useEffect(() => {
        if (Object.keys(props.getRolesRes).length > 0 && props.authenticate === true) {
            setLoader(false)
            setRoles(props.getRolesRes.data)
            setPage(props.getRolesRes.page)
            setPages(props.getRolesRes.pages)
            setTotal(props.getRolesRes.total)
            setLimit(props.getRolesRes.limit)

            props.beforeRole();
        }
    }, [props.getRolesRes])

    useEffect(() => {
        if (props.currentUserPermission.authPermission) {
            setCurrentUserRole(props.currentUserPermission.permission.role)
        }

    }, [props.currentUserPermission.authPermission])

    useEffect(() => {
        if (Object.keys(props.deleteRoleRes).length > 0 && props.authenticate === true) {
            setModalType(1)
            setLoader(false)
            toast.success(`Success! ${props.deleteRoleRes.message}`);
            props.beforeRole();
            props.getRoles();
        }
    }, [props.deleteRoleRes])


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
                                            <Card.Title className='text-white' as="h4">Filters</Card.Title>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col xl={4} sm={6} className="search-wrap">
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2 text-white">Search with title...</Form.Label>
                                                    <Form.Control type="email" onKeyPress={handleKeyPress} name="search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}></Form.Control>
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
                                                    <div className="d-flex  filter-btns-holder">
                                                        <button type="button" className="btn-filled mr-3" onClick={onSearch} >
                                                            Search
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
                                            <Card.Title as="h4">Permissions</Card.Title>
                                            {/* <p className="card-category">List of Categories</p> */}
                                            {
                                                currentUserRole?.addRole &&
                                                <Button className="float-sm-right btn-filled d-flex align-items-center" onClick={() => setModal(1)}><span className='add-icon mr-2'>
                                                    <FontAwesomeIcon icon={faPlus} />
                                                </span>  Add New Role</Button>}
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy">
                                                <thead>
                                                    <tr>
                                                        <th className="td-start">#</th>
                                                        <th className="td-name">Title</th>
                                                        <th className="text-center td-status">Status</th>
                                                        <th className="td-actions">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        roles && roles.length > 0 ?
                                                            roles.map((val, key) => {
                                                                return (
                                                                    <tr key={key} className="align-items-center">
                                                                        <td className='text-white'>{((limit * page) - limit) + key + 1}</td>
                                                                        <td className='td-name'><Link data-toggle="modal" data-target="modal-primary" className="text-capitalize" onClick={() => setModal(2, val)}>{val.title}</Link></td>
                                                                        <td className='text-center text-white'>
                                                                            {
                                                                                val.status ?
                                                                                    <span className="label kyc-badge kyc-status-badge d-inline-block align-top label-success px-2">Active</span>
                                                                                    : <span className="llabel kyc-badge kyc-status-badge d-inline-block align-top label-danger px-2">Inactive</span>
                                                                            }
                                                                        </td>
                                                                        <td className="td-actions">
                                                                            <ul className="list-unstyled mb-0 d-flex justify-content-center">{
                                                                                currentUserRole?.viewRole ?
                                                                                    <li className="d-inline-block align-top">
                                                                                        <OverlayTrigger overlay={<Tooltip id="tooltip-436082023" >View</Tooltip>}  placement="top">
                                                                                            <button type="button" className="btn-link btn-icon btn btn-info" onClick={() => setModal(2, val)}><i className="fas fa-eye"></i></button>
                                                                                        </OverlayTrigger>
                                                                                    </li>
                                                                                    : null
                                                                            }
                                                                                {currentUserRole?.editRole ?
                                                                                    currentRoleId !== val._id && !val.isSuperAdmin ?
                                                                                        <li className="d-inline-block align-top">
                                                                                            <OverlayTrigger overlay={<Tooltip id="tooltip-436082023">Edit</Tooltip>}  placement="top">
                                                                                                <button type="button" className="btn-link btn-icon btn btn-success" onClick={() => setModal(3, val)}><i className="fas fa-edit"></i></button>
                                                                                            </OverlayTrigger>
                                                                                        </li>
                                                                                        :
                                                                                        <button type="button" className="btn-link btn-icon btn btn-success disabled" disabled><i className="fas fa-edit"></i></button>
                                                                                    : null
                                                                                }
                                                                                {
                                                                                    currentUserRole?.deleteRole ?
                                                                                        currentRoleId !== val._id && !val.isSuperAdmin ?
                                                                                            <li className="d-inline-block align-top">
                                                                                                <OverlayTrigger overlay={<Tooltip id="tooltip-436082023">Delete</Tooltip>}  placement="top">
                                                                                                    <button type="button" className="btn-link btn-icon btn btn-danger" onClick={() => deleteRoleHandler(val._id)}><i className="fas fa-trash"></i></button>
                                                                                                </OverlayTrigger>
                                                                                            </li>
                                                                                            :
                                                                                            <button type="button" className="btn-link btn-icon btn btn-danger disabled" disabled><i className="fas fa-trash"></i></button>
                                                                                        : null
                                                                                }
                                                                            </ul>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td className="text-center px-0" colSpan="4">
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
                        <PermissionsModal setData={getData} modalType={modalType} setModalType={setModalType}
                            roleModal={roleModal} setroleModal={setroleModal} role={role}
                            setLoader={setLoader} title={title} status={status}
                            setTitle={setTitle} setStatus={setStatus}
                            selectAll={selectAll} setSelectAll={setSelectAll} titleMsg={titleMsg} setTitleMsg={setTitleMsg} />
                    </Container>
            }
        </>
    )
}

const mapStateToProps = state => ({
    addRoleRes: state.role.addRoleRes,
    updateRoleRes: state.role.updateRoleRes,
    deleteRoleRes: state.role.deleteRoleRes,
    getRoleRes: state.role.getRoleRes,
    getRolesRes: state.role.getRolesRes,
    authenticate: state.role.authenticate,
    errors: state.errors,
    // roles and permission
    currentUserPermission: state.role,
});

export default connect(mapStateToProps, { beforeRole, updateRole, deleteRole, getRole, getRoles, getPermission })(StaffPermissions);
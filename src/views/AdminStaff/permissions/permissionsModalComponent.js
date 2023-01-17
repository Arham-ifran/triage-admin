import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import validator from 'validator';
import { addRole, updateRole, beforeRole } from './permissions.actions';
import $ from 'jquery';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal, FormGroup } from "react-bootstrap";

const StaffPermissionModal = (props) => {
    const dispatch = useDispatch()
    const [titleMsg, setTitleMsg] = useState('')
    const [formValid, setFormValid] = useState(false)
    const [permissions, setPermissions] = useState({
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
    const addRoleRes = useSelector(state => state.role.addRoleRes)
    const updateRoleRes = useSelector(state => state.role.updateRoleRes)
    const authenticate = useSelector(state => state.role.authenticate)

    const onChangeCheckbox = (name, value) => {
        let roles = permissions
        if (name === 'selectAll') {
            Object.keys(roles).forEach((val, key) => {
                if (val !== 'title' && val !== '_id' && val !== 'status' && val !== 'isSuperAdmin')
                    roles = { ...roles, [val]: value }
            });
            props.setSelectAll(value)
        }
        else {
            roles = { ...roles, [name]: value }

            // select all state settings
            let count = 0;
            let allSelected = false
            Object.keys(roles).forEach((key, index) => {
                if (roles[key] === true && key !== 'status' && key !== '_id' && key !== 'isSuperAdmin') {
                    count++;
                }else {
                    console.log("jb kuch unselected hai")
                    allSelected = true
                }
            });

            console.log("My  count ⭐", count )
            console.log('count === 67', count === 67)
            let selectCount = allSelected ? false : true
            props.setSelectAll(selectCount)
        }
        setPermissions(roles)
    }
    const submit = (e) => {
        if (!validator.isEmpty(props.title)) {
            props.setTitleMsg('')
            setFormValid(false)
            if (props.modalType === 1) delete permissions['_id']
            const role = { ...permissions, title: props.title, status: props.status }

            if (props.modalType === 1) // add modal type
                dispatch(addRole(role));
            else if (props.modalType === 3) // update modal type
                dispatch(updateRole(role));

            setPermissions(role)
            props.setroleModal(!props.roleModal)
            props.setModalType(0)
            props.setData(role)
            props.setLoader(true)
        }
        else {
            props.setTitleMsg("Title Required.")
            $('.modal-primary').scrollTop(0, 0)
            setFormValid(true)
        }


    }


    useEffect(() => {
        if (Object.keys(props.role).length > 0) {
            updateInitialData({ ...props });
        }
    }, [props.role])

    const updateInitialData = (props) => {
        let newprops = { ...props };
        let count = 0
        let allSelected = false 
        Object.keys(newprops.role).forEach((key, index) => {
            if (newprops.role[key] === true && key !== 'status' && key !== '_id' && key !== 'isSuperAdmin') {
                count++;
            }else {
                allSelected = true
            }
        });
        let selectCount = allSelected ? false : true
        props.setSelectAll(selectCount)
        setPermissions(newprops.role)
        props.setTitle(newprops.role.title)
        props.setStatus(newprops.role.status)
    }

    useEffect(() => {
        if (props.modalType === 2) {
            $(".modal-primary input").prop("disabled", true);
        } else {
            $(".modal-primary input").prop("disabled", false);
        }
    }, [props.modalType])

    useEffect(() => {
        if (addRoleRes.success && authenticate === true) {
            props.setLoader(false)
            setEmpty()
            dispatch(beforeRole())
        }
    }, [addRoleRes])

    const onCloseHandler = () => {
        props.setroleModal(!props.roleModal)
        // setEmpty()
    }

    useEffect(() => {
        if (Object.keys(updateRoleRes).length > 0 && authenticate === true) {
            props.setLoader(false)
            dispatch(beforeRole());
        }
    }, [updateRoleRes])

    const setEmpty = () => {
        props.setStatus(false)
        props.setTitle('')
        props.setSelectAll(false)
        for (let key in permissions) {
            permissions[key] = false
        }
    }


    return (
        <Container fluid>
            {
                props.modalType > 0 &&
                <Modal className="modal-primary" onHide={() => props.setroleModal(!props.roleModal)} show={props.roleModal}>
                    <Modal.Header className="justify-content-center">
                        <Row>
                            <div className="col-12">
                                <h4 className="mb-0 mb-md-3 mt-0">
                                    {props.modalType === 1 ? 'Add New' : props.modalType === 2 ? 'View' : 'Edit'} Staff Role
                                </h4>
                            </div>
                        </Row>
                    </Modal.Header>
                    <Modal.Body className="modal-body">
                        <Form>
                            <Form.Group>
                                <Row>
                                    <Col md={12}>
                                        <label > <strong className='text-white'>Title</strong><strong className="text-danger">*</strong></label>
                                        <Form.Control
                                            className='mb-2'
                                            placeholder="Enter title"
                                            type="text"
                                            name="title"
                                            onChange={(e) => props.setTitle(e.target.value)}
                                            disabled={props.modalType === 2}
                                            value={props.title}
                                            required
                                        />
                                         <span>
                                                <label className={!props.title && props.titleMsg ? `pl-1 text-danger` : `d-none`}>{props.titleMsg}</label>
                                            </span>
                                        <div className='d-flex justify-content-between align-items-center edit-title mb-3'>
                                            <strong className='text-white'>Permissions</strong>
                                            {/* <span>
                                                <label className={!props.title && props.titleMsg ? `pl-1 text-danger` : `d-none`}>{props.titleMsg}</label>
                                            </span> */}
                                            <label className="right-label-checkbox">Select All
                                                <input type="checkbox" name="selectAll" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !props.selectAll)} checked={props.selectAll} />
                                                <span className="checkmark"></span>
                                            </label>
                                        </div>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row className="align-items-start">
                                    <Col md={4}>
                                        <label className="label-font">Dashboard</label>
                                    </Col>
                                    <Col md={8}>
                                        <label className="right-label-checkbox">View
                                            <input type="checkbox" name="viewDashboard" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewDashboard)} checked={permissions.viewDashboard} />
                                            <span className="checkmark"></span>
                                            {/* <input type="checkbox" name="viewDashboard" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewDashboard)} checked={permissions.viewDashboard}></input>  */}

                                        </label>
                                        {/* <label className="label-font">View</label>
                                            <input type="checkbox" name="viewDashboard" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewDashboard)} checked={permissions.viewDashboard}></input> */}
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Staff</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex" >
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewStaff" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewStaff)} checked={permissions.viewStaff} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addStaff" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addStaff)} checked={permissions.addStaff} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editStaff" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editStaff)} checked={permissions.editStaff} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteStaff" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteStaff)} checked={permissions.deleteStaff} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>

                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Staff Roles</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewRole" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewRole)} checked={permissions.viewRole} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addRole" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addRole)} checked={permissions.addRole} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editRole" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editRole)} checked={permissions.editRole} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteRole" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteRole)} checked={permissions.deleteRole} />
                                            <span className="checkmark"></span>
                                        </label>
                                        {/* <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="viewRole" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewRole)} checked={permissions.viewRole}></input>
                                                <span>View</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="addRole" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addRole)} checked={permissions.addRole}></input>
                                                <span>Add</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="editRole" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editRole)} checked={permissions.editRole}></input>
                                                <span>Edit</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="deleteRole" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteNft)} checked={permissions.deleteRole}></input>
                                                <span>Delete</span>
                                            </label> */}
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Users</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewUsers" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewUsers)} checked={permissions.viewUsers} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addUser" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addUser)} checked={permissions.addUser} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editUser" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editUser)} checked={permissions.editUser} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteUser" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteUser)} checked={permissions.deleteUser} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">KYC's</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewKyc" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewKyc)} checked={permissions.viewKyc} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editKyc" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editKyc)} checked={permissions.editKyc} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Account Tier</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewAccountTier" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewAccountTier)} checked={permissions.viewAccountTier} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addAccountTier" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addAccountTier)} checked={permissions.addAccountTier} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editAccountTier" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editAccountTier)} checked={permissions.editAccountTier} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteAccountTier" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteAccountTier)} checked={permissions.deleteAccountTier} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Criteria</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewCriteria" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewCriteria)} checked={permissions.viewCriteria} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addCriteria" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addCriteria)} checked={permissions.addCriteria} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editCriteria" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editCriteria)} checked={permissions.editCriteria} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteCriteria" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteCriteria)} checked={permissions.deleteCriteria} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Promo Codes</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewPromoCodes" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewPromoCodes)} checked={permissions.viewPromoCodes} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addPromoCodes" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addPromoCodes)} checked={permissions.addPromoCodes} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editPromoCodes" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editPromoCodes)} checked={permissions.editPromoCodes} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deletePromoCodes" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deletePromoCodes)} checked={permissions.deletePromoCodes} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Stakings</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewStaking" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewStaking)} checked={permissions.viewStaking} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editStaking" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editStaking)} checked={permissions.editStaking} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Receive Stakings</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewReceiveStaking" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewReceiveStaking)} checked={permissions.viewReceiveStaking} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editReceiveStaking" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editReceiveStaking)} checked={permissions.editReceiveStaking} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Faq Categories</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewFaqCategories" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewFaqCategories)} checked={permissions.viewFaqCategories} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addFaqCategories" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addFaqCategories)} checked={permissions.addFaqCategories} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editFaqCategories" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editFaqCategories)} checked={permissions.editFaqCategories} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteFaqCategories" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteFaqCategories)} checked={permissions.deleteFaqCategories} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">FAQs</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewFaqs" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewFaqs)} checked={permissions.viewFaqs} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addFaq" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addFaq)} checked={permissions.addFaq} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editFaq" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editFaq)} checked={permissions.editFaq} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteFaq" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteFaq)} checked={permissions.deleteFaq} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Wallets</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewWallet" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewWallet)} checked={permissions.viewWallet} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addWallet" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addWallet)} checked={permissions.addWallet} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editWallet" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editWallet)} checked={permissions.editWallet} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteWallet" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteWallet)} checked={permissions.deleteWallet} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Contacts</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewContact" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewContact)} checked={permissions.viewContact} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editContact" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editContact)} checked={permissions.editContact} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteContact" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteContact)} checked={permissions.deleteContact} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Request Management</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewRequestDeletion" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewRequestDeletion)} checked={permissions.viewRequestDeletion} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editRequestDeletion" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editRequestDeletion)} checked={permissions.editRequestDeletion} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteRequestDeletion" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteRequestDeletion)} checked={permissions.deleteRequestDeletion} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Emails</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewEmailTemplates" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewEmailTemplates)} checked={permissions.viewEmailTemplates} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addEmailTemplates" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addEmailTemplates)} checked={permissions.addEmailTemplates} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editEmailTemplates" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editEmailTemplates)} checked={permissions.editEmailTemplates} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteEmailTemplates" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteEmailTemplates)} checked={permissions.deleteEmailTemplates} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Settings</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewSetting" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewSetting)} checked={permissions.viewSetting} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editSetting" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editSetting)} checked={permissions.editSetting} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Content</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewContent" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewContent)} checked={permissions.viewContent} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addContent" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addContent)} checked={permissions.addContent} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editContent" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editContent)} checked={permissions.editContent} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteContent" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteContent)} checked={permissions.deleteContent} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Newsletters</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewNewsLetter" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewNewsLetter)} checked={permissions.viewNewsLetter} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">History</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewHistory" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewHistory)} checked={permissions.viewHistory} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <FormGroup>
                                <Row>
                                    <Col md={4}>
                                        <label className="label-font">Status</label>
                                    </Col>
                                    <Col md={8} className="check-inline d-flex">
                                        <label className="right-label-radio mr-3 mb-2">Active
                                            <input name="status" disabled={props.modalType === 2} type="radio" checked={props.status} value={props.status} onChange={(e) => props.setStatus(true)} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-radio mr-3 mb-2">Inactive
                                            <input name="status" disabled={props.modalType === 2} type="radio" checked={!props.status} value={!props.status} onChange={(e) => props.setStatus(false)} />
                                            <span className="checkmark"></span>
                                        </label>
                                        {/* <label className="fancy-radio custom-color-blue">
                                                <input name="props.status" disabled={props.modalType === 2} type="radio" checked={props.status} value={props.status} onChange={(e) => props.setStatus(true)} />
                                                <span disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, true)} ><i />Active</span>
                                            </label>
                                            <label className="fancy-radio custom-color-blue">
                                                <input name="props.status" disabled={props.modalType === 2} type="radio" checked={!props.status} value={!props.status} onChange={(e) => props.setStatus(false)} />
                                                <span disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, false)} ><i />Inactive</span>
                                            </label> */}
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Form>
                    </Modal.Body>

                    <Modal.Footer>
                        {/* <Button className="btn btn-warnign" onClick={(e) => onCloseHandler()}>Close</Button> */}
                        <Button className="outline-button" onClick={() => onCloseHandler()}>Close</Button>
                        {props.modalType === 2 ? '' :
                            <Button className="btn-filled" onClick={() => submit()} /* disabled={isLoader} */>Save</Button>
                        }
                    </Modal.Footer>
                </Modal>
            }
        </Container>
    )
}

export default StaffPermissionModal;
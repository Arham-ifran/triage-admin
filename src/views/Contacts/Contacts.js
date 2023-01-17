import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import { beforeContact, getContacts, updateContact } from './Contacts.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import { toast } from 'react-toastify'
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { getRole, beforeRole } from 'views/AdminStaff/permissions/permissions.actions';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal, InputGroup, DropdownButton, Dropdown, FormControl } from "react-bootstrap";
var CryptoJS = require("crypto-js");

const Contacts = (props) => {
    const [contacts, setContacts] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [contactModel, setContactModel] = useState(false)
    const [modalType, setModalType] = useState(0)
    const [contact, setContact] = useState(null)
    const [loader, setLoader] = useState(true)
    const [title, setTitle] = useState('Select Status')
    const [permissions, setPermissions] = useState({})
    const [searchName, setSearchName] = useState('')
    const [resetButton, setResetButton] = useState(false)
    const [searchEmail, setSearchEmail] = useState('')
    const [searchSubject, setSearchSubject] = useState('')
    const [searchStatus, setSearchStatus] = useState('')

    useEffect(() => {
        window.scroll(0, 0)
        props.getContacts()
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
        if (props.contacts.contactsAuth) {
            const { contact, pagination } = props.contacts.contacts
            setContacts(contact)
            setPagination(pagination)
            props.beforeContact()
        }
    }, [props.contacts.contactsAuth])

    useEffect(() => {
        if (contacts) {
            setLoader(false)
        }
    }, [contacts])

    useEffect(async () => {
        if (props.contacts.updateAuth) {
            setLoader(true)
            const contactData = await contacts.find((elem) => String(elem._id) === String(contact._id))
            contactData.status = parseInt(contact.status)
            if (contactData)
                setContact({ ...contactData })
            setLoader(false)
            props.beforeContact()
        }
    }, [props.contacts.updateAuth])

    // set modal type
    const setModal = (type = 0, contactId = null) => {
        setContactModel(!contactModel)
        setModalType(type)
        setLoader(false)
        if ((type === 2 || type === 3) && contactId)
            getContract(contactId)
    }

    const getContract = async (contactId) => {
        setLoader(true)
        const contactData = await contacts.find((elem) => String(elem._id) === String(contactId))
        if (contactData)
            setContact({ ...contactData })
        setLoader(false)
    }

    const onPageChange = async (page) => {
        const filter = {}
        if (searchName) {
            filter.name = searchName

        }
        if (searchEmail) {
            filter.email = searchEmail

        }
        if (searchSubject) {
            filter.subject = searchSubject

        }
        if (searchStatus) {
            filter.status = searchStatus
        }

        setLoader(true)
        const qs = ENV.objectToQueryString({ page })
        props.getContacts(qs, filter)
    }

    const applyFilters = () => {
        const filter = {}
        if (searchName) {
            filter.name = searchName

        }
        if (searchEmail) {
            filter.email = searchEmail
        }
        if (searchSubject) {
            filter.subject = searchSubject
        }
        if (searchStatus) {
            filter.status = searchStatus
        }

        if (filter.name || filter.email || filter.subject || filter.status !== undefined) {
            setResetButton(true)
            const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
            props.getContacts(qs, filter)
            setLoader(true)
        }
        else {
            toast.error('Add data in at least one field', {
                toastId: "FIELD_REQUIRED",
            })
        }




    }

    const reset = () => {
        setResetButton(false)
        setSearchSubject('')
        setSearchStatus('')
        setSearchEmail('')
        setSearchName('')

        props.getContacts()
        setLoader(true)
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
                                            {/* <p className="card-collection">List of Auctions</p> */}
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col xl={4} sm={6}>
                                                <Form.Group>
                                                    <label >Search with Name...</label>
                                                    <Form.Control value={searchName} type="text" placeholder="John" onChange={(e) => setSearchName(e.target.value)} /*onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={4} sm={6}>
                                                <label >Search with Email...</label>
                                                <Form.Control value={searchEmail} type="text" placeholder="john@mail.com" onChange={(e) => setSearchEmail(e.target.value)}/* onChange={} onKeyDown={} */ />
                                            </Col>
                                            <Col xl={4} sm={6}>
                                                <label >Search with Status...</label>
                                                <select value={searchStatus} onChange={(e) => setSearchStatus(e.target.value)}>
                                                    <option value="">Select Status</option>
                                                    <option value={0}>In Progress</option>
                                                    <option value={1}>Pending</option>
                                                    <option value={2}>Closed</option>
                                                </select>
                                            </Col>

                                            <Col xl={4} sm={6}>
                                                <Form.Group>
                                                    <div className="d-flex  filter-btns-holder">
                                                        <Button className="btn-filled mr-3" onClick={applyFilters}>Search</Button>
                                                        {resetButton && <Button className="outline-button" onClick={reset}>Reset</Button>}
                                                    </div>

                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        {/* <Row>
                            <Col>
                                <span >{`Total : ${pagination?.total}`}</span>
                                <label>&nbsp;</label>
                            </Col>
                        </Row> */}
                        <Row>
                            <Col md="12">
                                <Card className="table-big-boy">
                                    <Card.Header>
                                        <div className="d-flex align-items-center justify-content-between table-head">
                                            <Card.Title as="h4">Contacts</Card.Title>
                                            {/* <p className="card-user">List Of Contacts</p> */}
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy">
                                                <thead>
                                                    <tr>
                                                        <th className="td-start">#</th>
                                                        <th className='td-name'>Name</th>
                                                        <th className='td-email'>Email</th>
                                                        <th className='td-status text-center'>Status</th>
                                                        <th className="td-actions">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        contacts && contacts.length ? contacts.map((item, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td className="text-white">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                    <td className="text-white td-name">
                                                                        {item.name}
                                                                    </td>
                                                                    <td className="text-white td-email">
                                                                        {item.email}
                                                                    </td>
                                                                    <td className="text-white td-status text-center">
                                                                        <span className={`label text-white kyc-badge kyc-status-badge d-inline-block align-top px-2 py-1 ${item.status === 1 ? `label-danger` : item.status === 0 ? `label-warning` : item.status === 2 ? `label-success` : ``}`}>
                                                                            {item.status === 0 ? 'In Progress' : item.status === 1 ? 'Pending' : item.status === 2 ? 'Closed' : 'N/A'}
                                                                        </span>
                                                                    </td>
                                                                    <td className="td-actions text-white">
                                                                        <ul className="list-unstyled mb-0">

                                                                            <li className="d-inline-block align-top">
                                                                                <OverlayTrigger overlay={<Tooltip id="tooltip-897993903"> View </Tooltip>}  placement="top">
                                                                                    <Button
                                                                                        className="btn-link btn-icon"
                                                                                        type="button"
                                                                                        variant="info"
                                                                                        onClick={() => setModal(2, item._id)}
                                                                                    >
                                                                                        <i className="fas fa-eye"></i>
                                                                                    </Button>
                                                                                </OverlayTrigger>
                                                                            </li>

                                                                            {
                                                                                permissions && permissions.editContact &&
                                                                                <li className="d-inline-block align-top">
                                                                                    <OverlayTrigger overlay={<Tooltip id="tooltip-897993903"> Edit </Tooltip>}  placement="top" >
                                                                                        <Button
                                                                                            className="btn-link btn-icon"
                                                                                            type="button"
                                                                                            variant="success"
                                                                                            onClick={() => {
                                                                                                setModal(3, item._id);
                                                                                                setTitle("Select Status")
                                                                                            }
                                                                                            }
                                                                                        >
                                                                                            <i className="fas fa-edit"></i>
                                                                                        </Button>
                                                                                    </OverlayTrigger>
                                                                                </li>
                                                                            }
                                                                        </ul>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                            :
                                                            <tr>
                                                                <td colSpan="5" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No Contact Found</div>
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

                        {
                            modalType > 0 && contact &&
                            <Modal className="modal-primary edit-cotnact-modal" onHide={() => setContactModel(!contactModel)} show={contactModel}>
                                <Modal.Header className="justify-content-center">
                                    <Row>
                                        <div className="col-12">
                                            <h4 className="mb-0 mb-md-3 mt-0">
                                                {modalType === 3 ? 'Edit' : ''} Contact
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
                                                    <span className='text-white'>{contact.name}</span>
                                                </div>
                                                {/* <label className="label-font">Name: </label><span className="ml-2">{contact.name}</span> */}
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2 text-white">Email:</strong>
                                                    <span className='text-white'>{contact.email}</span>
                                                </div>
                                                {/* <label className="label-font">Email: </label><span className="ml-2">{contact.email}</span> */}
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex align-items-center">
                                                    <strong className="mr-2 text-white">Status:</strong>
                                                    <span className={`text-white ml-2 badge ${contact.status === 1 && modalType === 2 ? `badge-danger p-1` : contact.status === 0 && modalType === 2 ? `badge-warning p-1` : contact.status === 2 && modalType === 2 ? `badge-success p-1` : ``}`}>
                                                        {modalType === 2 ?
                                                            (contact.status === 0 ? 'In Progress ' : contact.status === 1 ? 'Pending' : contact.status === 2 ? 'Closed' : 'N/A')
                                                            :
                                                            <select value={contact.status} onChange={(e) => setContact({ ...contact, status: e.target.value })}>
                                                                <option value="">Select Status</option>
                                                                <option value={0}>In Progress</option>
                                                                <option value={1}>Pending</option>
                                                                <option value={2}>Closed</option>
                                                            </select>
                                                        }</span>

                                                </div>
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2 text-white">Message:</strong>
                                                    <span className='text-white'>{contact.message}</span>
                                                </div>
                                            </Form.Group>
                                        </div>
                                    </Form>
                                </Modal.Body>

                                <Modal.Footer>
                                    <Button className="outline-button" onClick={() => setContactModel(!contactModel)}>Close</Button>
                                    {modalType === 3 ?
                                        <Button className="btn-filled"
                                            onClick={() => {
                                                setContactModel(!contactModel);
                                                let formData = new FormData()
                                                for (const key in contact)
                                                    formData.append(key, contact[key])
                                                props.updateContact(formData);
                                                setTitle("Select Status");
                                            }
                                            }
                                        >
                                            Update</Button>
                                        :
                                        ''
                                    }
                                </Modal.Footer>
                            </Modal>
                        }
                    </Container>
            }
        </>
    )
}

const mapStateToProps = state => ({
    contacts: state.contacts,
    error: state.error,
    getRoleRes: state.role.getRoleRes
});

export default connect(mapStateToProps, { beforeContact, getContacts, updateContact, getRole, beforeRole })(Contacts);
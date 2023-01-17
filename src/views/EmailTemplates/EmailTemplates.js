import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import { beforeEmail, getEmails, delEmail } from './EmailTemplates.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import { getRole, beforeRole } from 'views/AdminStaff/permissions/permissions.actions';
import Pagination from 'rc-pagination';
import Swal from 'sweetalert2';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify'

var CryptoJS = require("crypto-js");



const EmailTemplates = (props) => {
    const [emails, setEmails] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [loader, setLoader] = useState(true)
    const [resetButton, setResetButton] = useState(false)
    const [permissions, setPermissions] = useState({})
    const [filters, setFilters] = useState({
        type: '',
        subject: ''
    })


    useEffect(() => {
        window.scroll(0, 0)
        props.getEmails()
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
        if (props.email.getAuth) {
            const { emails, pagination } = props.email
            setEmails(emails)
            setPagination(pagination)
            props.beforeEmail()
            setLoader(false)
        }
    }, [props.email.getAuth])

    useEffect(() => {
        if (props.email.delAuth) {
            let id = props.email.delData.emailId
            setEmails(emails.filter((item, index) => {
                if (item._id !== id) {
                    return (item)
                }
            }))
            props.beforeEmail()
            setLoader(false)
        }
    }, [props.email.delAuth])

    // when an error is received
    useEffect(() => {
        if (props.error.error)
            setLoader(false)
    }, [props.error.error])

    const onPageChange = async (page) => {
        setLoader(true)
        const qs = ENV.objectToQueryString({ page, ...filters })
        props.getEmails(qs)
    }

    const applyFilters = () => {
        if ((filters && filters.type) || (filters && filters.subject)) {
            setResetButton(true)
            const qs = ENV.objectToQueryString({ page: 1, limit: 10, ...filters })
            props.getEmails(qs)
            setLoader(true)
        }
        else {
            toast.error('Add fields are empty.', {
                toastId: "FIELD_REQUIRED",
            })
        }
    }

    const deleteEmail = (Id) => {
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
                props.delEmail(Id)
            }
        })
    }

    const reset = () => {
        setResetButton(false)
        setFilters({ type: '' })
        props.getEmails()
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
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col xl={4} sm={6}>
                                                <Form.Group>
                                                    <label>Search with Type...</label>
                                                    <Form.Control value={filters.type} type="text" placeholder="Type" onChange={(e) => setFilters({ ...filters, type: (e.target.value).trim() })} />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={4} sm={6}>
                                                <Form.Group>
                                                    <label>Search with Subject...</label>
                                                    <Form.Control value={filters.subject} type="text" placeholder="Subject" onChange={(e) => setFilters({ ...filters, subject: (e.target.value).trim() })} />
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
                                            <Card.Title as="h4">Email Templates</Card.Title>
                                            <Button
                                                className="float-sm-right btn-filled d-flex align-items-center"
                                                onClick={() => props.history.push(`/add-email-template`)}>
                                                <span className='add-icon mr-2'>
                                                    <FontAwesomeIcon icon={faPlus} />
                                                </span>
                                                Add Email Template
                                            </Button>
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center td-start">#</th>
                                                        <th className='td-type'>Type</th>
                                                        <th className='td-description'>Subject</th>
                                                        <th className="td-actions text-center">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        emails && emails.length ?
                                                            emails.map((email, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="text-center serial-col text-white">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>

                                                                        <td className='text-white td-type'>
                                                                            {email.type}
                                                                        </td>
                                                                        <td className='text-white td-description'>
                                                                            {email.subject}
                                                                        </td>


                                                                        <td className="td-actions text-center">
                                                                            <ul className="list-unstyled mb-0">
                                                                                {
                                                                                    permissions && permissions.editEmailTemplates ?
                                                                                        <li className="d-inline-block align-top">
                                                                                            <OverlayTrigger overlay={<Tooltip id="tooltip-436082023"> Edit </Tooltip>}  placement="top" >
                                                                                                <Button
                                                                                                    className="btn-link btn-icon"
                                                                                                    type="button"
                                                                                                    variant="success"
                                                                                                    onClick={() => {
                                                                                                        setLoader(true);
                                                                                                        props.history.push(`/email-template/${email._id}`);
                                                                                                    }}
                                                                                                >
                                                                                                    <i className="fas fa-edit"></i>
                                                                                                </Button>
                                                                                            </OverlayTrigger>
                                                                                        </li>
                                                                                        : ''
                                                                                }
                                                                                <li className="d-inline-block align-top">
                                                                                    <OverlayTrigger overlay={<Tooltip id="tooltip-436082023">Delete</Tooltip>}  placement="top">
                                                                                        <button type="button" className="btn-link btn-icon btn btn-danger" onClick={() => { deleteEmail(email._id) }}><i className="fas fa-trash"></i></button>
                                                                                    </OverlayTrigger>
                                                                                </li>
                                                                            </ul>
                                                                        </td>

                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan="4" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No Email Found</div>
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
                    </Container>
            }
        </>
    )
}

const mapStateToProps = state => ({
    email: state.email,
    error: state.error,
    getRoleRes: state.role.getRoleRes

});

export default connect(mapStateToProps, { beforeEmail, getEmails, getRole, beforeRole, delEmail })(EmailTemplates);
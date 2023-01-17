import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Row, Table, OverlayTrigger, Tooltip, Form } from "react-bootstrap";
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify'
import { ENV } from '../../config/config';
import { beforeContent, listContent, deleteContent } from './cms.action';
import { beforeRole, getRole } from 'views/AdminStaff/permissions/permissions.actions';
var CryptoJS = require("crypto-js");



const ContentManagementSystem = (props) => {
    const [data, setData] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [resetButton, setResetButton] = useState(false)
    const [permissions, setPermissions] = useState({})
    const [loader, setLoader] = useState(true)
    const [filters, setFilters] = useState({
        title: '',
        status: ''
    })


    useEffect(() => {
        window.scroll(0, 0)
        props.listContent()
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
        if (props.content.getContentPagesAuth) {
            setData(props.content.getContentPagesRes.contentPages)
            setPagination(props.content.getContentPagesRes.pagination)
            setLoader(false)
            props.beforeContent()
        }
    }, [props.content.getContentPagesAuth])

    useEffect(() => {
        if (props.content.deleteContentAuth) {
            setData(data.filter((item) => {
                if (props.content.deleteContentRes.contentId !== item._id) {
                    return item
                }
            }))
            setLoader(false)
            props.beforeContent()
        }
    }, [props.content.deleteContentAuth])



    const deleteCMS = (id) => {
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
                props.deleteContent(id)
            }
        })
    }

    const onPageChange = async (page) => {
        setLoader(true)
        const qs = ENV.objectToQueryString({ page, ...filters })
        props.listContent(qs)
    }

    const applyFilters = () => {
        if ((filters && filters.title) || (filters && filters.status)) {
            setResetButton(true)
            const qs = ENV.objectToQueryString({ page: 1, limit: 10, ...filters })
            props.listContent(qs)
            setLoader(true)
        }
        else {
            toast.error('All filter fields are empty.', {
                toastId: "FIELD_REQUIRED",
            })
        }
    }

    const reset = () => {
        setResetButton(false)
        setFilters({ title: '', status: '' })
        props.listContent()
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
                                                    <label>Search with Title...</label>
                                                    <Form.Control value={filters.title} type="text" placeholder="Title" onChange={(e) => setFilters({ ...filters, title: (e.target.value).trim() })} />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={4} sm={6} className="search-wrap">
                                                <label >Search with status...</label>
                                                <Form.Group>
                                                    <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: (e.target.value).trim() })}>
                                                        <option value="">Select Status</option>
                                                        <option value='true'>Active</option>
                                                        <option value="false">Inactive</option>
                                                    </select>
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
                                            <Card.Title as="h4">CMS</Card.Title>
                                            {
                                                permissions && permissions.addContent &&
                                                <Button
                                                    className="float-sm-right btn-filled d-flex align-items-center"
                                                    onClick={() => props.history.push(`/add-cms`)}>
                                                    <span className='add-icon mr-2'>
                                                        <FontAwesomeIcon icon={faPlus} />
                                                    </span>
                                                    Add CMS
                                                </Button>
                                            }
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy table-w cms-table">
                                                <thead>
                                                    <tr>
                                                        <th className="td-start serial-col">#</th>
                                                        <th className="td-name">
                                                            <div className='faqs-title td-name'>Title</div>
                                                        </th>
                                                        <th className='td-status'>Slug</th>
                                                        <th className='td-status text-center'>Status</th>
                                                        {(permissions?.editContent || permissions?.deleteContent) &&
                                                            < th className="td-actions text-center">Actions</th>}
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
                                                                                {item.title}
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-white">
                                                                            {item.slug}
                                                                        </td>
                                                                        <td className="text-white text-center">
                                                                            <span className={`label kyc-badge kyc-status-badge d-inline-block align-top px-2 py-1 ${item.status ? 'label-success' : 'label-danger'}`}>{item.status ? 'Active' : 'Inactive'}</span>
                                                                        </td>
                                                                        {(permissions?.editContent || permissions?.deleteContent) &&
                                                                            <td className="td-actions">
                                                                                <ul className="list-unstyled mb-0 d-flex justify-content-center align-items-center">
                                                                                    <li className="d-inline-block align-top">
                                                                                        <OverlayTrigger overlay={<Tooltip id="tooltip-436082023"> View </Tooltip>}  placement="top">
                                                                                            <Button
                                                                                                className="btn-link btn-icon"
                                                                                                type="button"
                                                                                                variant="info"
                                                                                                onClick={() => props.history.push(`/view-cms/${window.btoa(item._id)}`)}
                                                                                            >
                                                                                                <i className="fas fa-eye"></i>
                                                                                            </Button>
                                                                                        </OverlayTrigger>
                                                                                    </li>
                                                                                    {
                                                                                        permissions && permissions.editContent &&
                                                                                        <li className="d-inline-block align-top">
                                                                                            <OverlayTrigger overlay={<Tooltip id="tooltip-436082023"> Edit </Tooltip>}  placement="top">
                                                                                                <Button
                                                                                                    className="btn-link btn-icon"
                                                                                                    type="button"
                                                                                                    variant="success"
                                                                                                    onClick={() => props.history.push(`/edit-cms/${window.btoa(item._id)}`)}
                                                                                                >
                                                                                                    <i className="fas fa-edit"></i>
                                                                                                </Button>
                                                                                            </OverlayTrigger>
                                                                                        </li>
                                                                                    }
                                                                                    {
                                                                                        permissions && permissions.deleteContent &&
                                                                                        <li className="d-inline-block align-top">
                                                                                            <OverlayTrigger overlay={<Tooltip id="tooltip-334669391"> Delete </Tooltip>}  placement="top">
                                                                                                <Button
                                                                                                    className="btn-link btn-icon"
                                                                                                    type="button"
                                                                                                    disabled={item.slug === "terms-and-conditions" || item.slug === "privacy-policy"}
                                                                                                    variant="danger"
                                                                                                    onClick={() => deleteCMS(item._id)}
                                                                                                >
                                                                                                    <i className="fas fa-trash"></i>
                                                                                                </Button>
                                                                                            </OverlayTrigger>
                                                                                        </li>
                                                                                    }
                                                                                </ul>
                                                                            </td>
                                                                        }
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan="5" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No CMS Found</div>
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
    content: state.content,
    error: state.error,
    getRoleRes: state.role.getRoleRes
});

export default connect(mapStateToProps, { beforeContent, listContent, deleteContent, getRole, beforeRole })(ContentManagementSystem);
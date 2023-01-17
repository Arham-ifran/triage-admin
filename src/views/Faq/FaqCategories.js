import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, OverlayTrigger, Row, Table, Tooltip } from "react-bootstrap";
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { beforeRole, getRole } from 'views/AdminStaff/permissions/permissions.actions';
import { ENV } from '../../config/config';
import { beforeFaqCat, deleteFaqCat, listFaqCategories } from './Faq.action';
import { toast } from 'react-toastify'
var CryptoJS = require("crypto-js");



const FaqCategories = (props) => {
    const [data, setData] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [loader, setLoader] = useState(true)
    const [searchTitle, setSearchTitle] = useState('')
    const [searchStatus, setSearchStatus] = useState('')
    const [permissions, setPermissions] = useState({})
    const [resetButton, setResetButton] = useState(false)
    const [filters, setFilters] = useState({
        title: ''
    })


    useEffect(() => {
        window.scroll(0, 0)
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        props.listFaqCategories(qs)
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
        if (props.faqs.listFaqCatAuth) {
            let { faqCategories, pagination } = props.faqs.listFaqCat
            setData(faqCategories)
            setPagination(pagination)
            props.beforeFaqCat()
        }
    }, [props.faqs.listFaqCatAuth])

    useEffect(() => {
        if (data) {
            setLoader(false)
        }
    }, [data])

    useEffect(() => {
        if (props.faqs.delFaqCatAuth) {
            let filtered = data.filter((item) => {
                if (item._id !== props.faqs.delFaqCatId.faqId)
                    return item
            })
            setData(filtered)
            props.beforeFaqCat()
        }
    }, [props.faqs.delFaqCatAuth])

    const deleteFAQ = (faqCatId) => {
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
                props.deleteFaqCat(faqCatId)
            }
        })
    }

    const onPageChange = async (page) => {
        setLoader(true)
        const qs = ENV.objectToQueryString({ page, ...filters })
        props.listFaqCategories(qs)
    }

    const applyFilters = () => {
        if ((filters && filters.title) || (filters && filters.status)) {
            setResetButton(true)
            const qs = ENV.objectToQueryString({ page: 1, limit: 10, ...filters })
            props.listFaqCategories(qs)
            setLoader(true)
        }
        else {
            toast.error('All filter fields are empty', {
                toastId: "FIELD_REQUIRED",
            })
        }
    }

    const reset = () => {
        setResetButton(false)
        setFilters({ title: '' })
        props.listFaqCategories()
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
                                                    <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
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
                                            <Card.Title as="h4">FAQ Categories</Card.Title>
                                            {
                                                permissions && permissions.addFaqCategories &&
                                                <Button
                                                    className="float-sm-right btn-filled d-flex align-items-center"
                                                    onClick={() => props.history.push(`/add-faq-category`)}>
                                                    <span className='add-icon mr-2'>
                                                        <FontAwesomeIcon icon={faPlus} />
                                                    </span>
                                                    Add FAQ Category
                                                </Button>
                                            }
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy table-w">
                                                <thead>
                                                    <tr>
                                                        <th className="td-start serial-col">#</th>
                                                        <th className="td-name">
                                                            <div className='faqs-title td-name'>Title</div>
                                                        </th>
                                                        <th className="td-description">
                                                            <div className='faqs-title'>Description</div>
                                                        </th>
                                                        <th className='td-status text-center'>Status</th>
                                                        {(permissions?.editFaqCategories || permissions?.deleteFaqCategories) && <th className="td-actions text-center">Actions</th>}
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
                                                                            <div className='faq-title td-description'>
                                                                                {item.desc ? item.desc : 'N/A'}
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-white text-center">
                                                                            <span className={`label kyc-badge kyc-status-badge d-inline-block align-top px-2 ${item.status ? 'label-success' : 'label-danger'}`}>{item.status ? 'Active' : 'Inactive'}</span>
                                                                        </td>
                                                                        {(permissions?.editFaqCategories || permissions?.deleteFaqCategories) &&
                                                                            <td className="td-actions">
                                                                                <ul className="list-unstyled mb-0 d-flex justify-content-center align-items-center">
                                                                                    {permissions?.editFaqCategories &&
                                                                                        <li className="d-inline-block align-top">
                                                                                            <OverlayTrigger overlay={<Tooltip id="tooltip-436082023"> Edit </Tooltip>}  placement="top">
                                                                                                <Button
                                                                                                    className="btn-link btn-icon"
                                                                                                    type="button"
                                                                                                    variant="success"
                                                                                                    onClick={() => props.history.push(`/edit-faq-category/${window.btoa(item._id)}`)}
                                                                                                >
                                                                                                    <i className="fas fa-edit"></i>
                                                                                                </Button>
                                                                                            </OverlayTrigger>
                                                                                        </li>
                                                                                    }
                                                                                    {permissions?.deleteFaqCategories &&
                                                                                        <li className="d-inline-block align-top">
                                                                                            <OverlayTrigger overlay={<Tooltip id="tooltip-334669391"> Delete </Tooltip>}  placement="top">
                                                                                                <Button
                                                                                                    className="btn-link btn-icon"
                                                                                                    type="button"
                                                                                                    variant="danger"
                                                                                                    onClick={() => deleteFAQ(item._id)}
                                                                                                >
                                                                                                    <i className="fas fa-trash"></i>
                                                                                                </Button>
                                                                                            </OverlayTrigger>
                                                                                        </li>
                                                                                    }
                                                                                </ul>
                                                                            </td>}
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan="5" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No FAQ Found</div>
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
    faqs: state.faqs,
    error: state.error,
    getRoleRes: state.role.getRoleRes
});

export default connect(mapStateToProps, { beforeFaqCat, listFaqCategories, deleteFaqCat, getRole, beforeRole })(FaqCategories);
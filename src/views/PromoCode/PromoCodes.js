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
import { toast } from 'react-toastify'
import { beforePromoCode, deletePromoCode, getPromoCodes } from './PromoCode.action';
var CryptoJS = require("crypto-js");

const Faq = (props) => {
    const [data, setData] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [loader, setLoader] = useState(true)
    const [resetButton, setResetButton] = useState(false)
    const [permissions, setPermissions] = useState({})
    const [searchTitle, setSearchTitle] = useState('')
    const [searchStatus, setSearchStatus] = useState('')
    const [filters, setFilters] = useState({
        title: '',
        codeType: '',
        status: ''
    })

    useEffect(() => {
        window.scroll(0, 0)
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        props.getPromoCodes()
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
        if (props.promoCodes.getPromoCodesAuth) {
            let { promoCodes, pagination } = props.promoCodes.promocodes
            setData(promoCodes)
            setPagination(pagination)
            props.beforePromoCode()
        }
    }, [props.promoCodes.getPromoCodesAuth])

    useEffect(() => {
        if (data) {
            setLoader(false)
        }
    }, [data])

    useEffect(() => {
        if (props.promoCodes.delPromoCodeAuth) {
            let filtered = data.filter((item) => {
                if (item._id !== props.promoCodes.promoCode.promoCodeId)
                    return item
            })
            setData(filtered)
            props.beforePromoCode()
        }
    }, [props.promoCodes.delPromoCodeAuth])

    const deletePromoCode = (promoCodeId) => {
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
                props.deletePromoCode(promoCodeId)
            }
        })
    }

    const onPageChange = async (page) => {
        setLoader(true)
        const qs = ENV.objectToQueryString({ page, ...filters })
        props.getPromoCodes(qs)
    }

    const applyFilters = () => {
        if ((filters && filters.title) || (filters && filters.codeType) || (filters && filters.status)) {
            setResetButton(true)
            const qs = ENV.objectToQueryString({ page: 1, limit: 10, ...filters })
            props.getPromoCodes(qs)
            setLoader(true)
        }
        else {
            toast.error('Add title to be searched.', {
                toastId: "FIELD_REQUIRED",
            })
        }
    }

    const reset = () => {
        setResetButton(false)
        setFilters({ title: '', codeType: '', status: '' })
        props.getPromoCodes()
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
                                                <label >Search with Code Type...</label>
                                                <Form.Group>
                                                    <select value={filters.codeType} onChange={(e) => setFilters({ ...filters, codeType: e.target.value })}>
                                                        <option value="">Select Code Type</option>
                                                        <option value='1'>Tokens</option>
                                                        <option value="2">Profit</option>
                                                    </select>
                                                </Form.Group>
                                            </Col>
                                            <Col xl={4} sm={6} className="search-wrap">
                                                <label >Search with Status...</label>
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
                                            <Card.Title as="h4">Promo Codes</Card.Title>
                                            {/* <p className="card-category">List of FAQs</p> */}
                                            {
                                                permissions && permissions.addPromoCodes &&
                                                <Button
                                                    className="float-sm-right btn-filled d-flex align-items-center"
                                                    onClick={() => props.history.push(`/add-promocode`)}>
                                                    <span className='add-icon mr-2'>
                                                        <FontAwesomeIcon icon={faPlus} />
                                                    </span>
                                                    Add Promo Code
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
                                                        {/* <th className="td-name text-center">
                                                            <div className='faqs-title'>No. of Times Available</div>
                                                        </th> */}
                                                        <th className="td-name  text-center">
                                                            <div className='faqs-title'>Code Type</div>
                                                        </th>
                                                        <th className="td-name text-center">
                                                            <div className='faqs-title'>Bonus</div>
                                                        </th>
                                                        <th className='td-status text-center'>Status</th>
                                                        {(permissions?.editPromoCodes || permissions?.deletePromoCodes) &&
                                                            <th className="td-actions text-center">Actions</th>
                                                        }
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        data && data.length ?
                                                            data.map((item, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="serial-col text-white">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                        <td className="text-white ">
                                                                            <div className="faq-title td-name ">
                                                                                {item.title}
                                                                            </div>
                                                                        </td>
                                                                        {/* <td className="text-white text-center">
                                                                            <div className="faq-title td-name">
                                                                                {item.NoOfTimesCodeAvailable}
                                                                            </div>
                                                                        </td> */}
                                                                        <td className="text-white text-center">
                                                                            <div className="faq-title td-name">
                                                                                {item.codeType === 1 ? "Tokens" : "Profit"}
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-white text-center">
                                                                            <div className="faq-title td-name">
                                                                                {`${item.bonus} ${item.codeType === 2 ? "%" : ""} `}
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-white text-center">
                                                                            <span className={`label kyc-badge kyc-status-badge d-inline-block align-top px-2 py-1 ${item.status ? 'label-success' : 'label-danger'}`}>{item.status ? 'Active' : 'Inactive'}</span>
                                                                        </td>
                                                                        {(permissions?.editPromoCodes || permissions?.deletePromoCodes) &&
                                                                            <td className="td-actions">
                                                                                <ul className="list-unstyled mb-0 d-flex justify-content-center align-items-center">
                                                                                    <li className="d-inline-block align-top">
                                                                                        <OverlayTrigger overlay={<Tooltip id="tooltip-436082023"> View </Tooltip>}  placement="top">
                                                                                            <Button
                                                                                                className="btn-link btn-icon"
                                                                                                type="button"
                                                                                                variant="info"
                                                                                                onClick={() => props.history.push(`/view-promocode/${item._id}`)}
                                                                                            >
                                                                                                <i className="fas fa-eye"></i>
                                                                                            </Button>
                                                                                        </OverlayTrigger>
                                                                                    </li>
                                                                                    {
                                                                                        permissions && permissions.editPromoCodes &&
                                                                                        <li className="d-inline-block align-top">
                                                                                            <OverlayTrigger overlay={<Tooltip id="tooltip-436082023"> Edit </Tooltip>}  placement="top">
                                                                                                <Button
                                                                                                    className="btn-link btn-icon"
                                                                                                    type="button"
                                                                                                    variant="success"
                                                                                                    onClick={() => props.history.push(`/edit-promocode/${item._id}`)}
                                                                                                >
                                                                                                    <i className="fas fa-edit"></i>
                                                                                                </Button>
                                                                                            </OverlayTrigger>
                                                                                        </li>
                                                                                    }
                                                                                    {
                                                                                        permissions && permissions.deletePromoCodes &&
                                                                                        <li className="d-inline-block align-top">
                                                                                            <OverlayTrigger overlay={<Tooltip id="tooltip-334669391"> Delete </Tooltip>}  placement="top">
                                                                                                <Button
                                                                                                    className="btn-link btn-icon"
                                                                                                    type="button"
                                                                                                    variant="danger"
                                                                                                    onClick={() => deletePromoCode(item._id)}
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
                                                                <td colSpan={(permissions?.editPromoCodes || permissions?.deletePromoCodes) ? "6": "5"} className="text-center">
                                                                    <div className="alert alert-info" role="alert">No Promo Codes Found</div>
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
    promoCodes: state.promoCodes,
    error: state.error,
    getRoleRes: state.role.getRoleRes
});

export default connect(mapStateToProps, { beforePromoCode, getPromoCodes, deletePromoCode, getRole, beforeRole })(Faq);
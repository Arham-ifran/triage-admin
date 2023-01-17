import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { useEffect, useState } from 'react';
import { ENV } from '../../config/config'
import Swal from 'sweetalert2';
import { Button, Card, Col, Container, OverlayTrigger, Row, Table, Tooltip, Form } from "react-bootstrap";
import { connect } from 'react-redux';
import { listCriteria, beforeCriteria, getCriteria, delCriteria } from './Criteria.action';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select'
import { toast } from 'react-toastify'
import { beforeRole, getRole } from 'views/AdminStaff/permissions/permissions.actions';
var CryptoJS = require("crypto-js");

const Criteria = (props) => {
    const [data, setData] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [resetButton, setResetButton] = useState(false)
    const [searchSubLevel, setSearchSubLevel] = useState('')
    const [loader, setLoader] = useState(true)
    const [filters, setFilters] = useState({
        level: { value: '', label: '' }
    })
    const levels = [
        { value: 1, label: 'Bronze' },
        { value: 2, label: 'Silver' },
        { value: 3, label: 'Gold' },
        { value: 4, label: 'Platinum' },
    ]
    const [permissions, setPermissions] = useState({})

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
        props.listCriteria()
    }, [])

    useEffect(() => {
        if (data) {
            setLoader(false)
        }
    }, [data])

    useEffect(() => {
        if (props.criteria.listCriteriaAuth) {
            let localData = props.criteria.listCritera
            setData(localData.criteria)
            setPagination(localData.pagination)
            props.beforeCriteria()
        }
    }, [props.criteria.listCriteriaAuth])

    useEffect(() => {
        if (props.criteria.delAuth) {
            setData(data.filter((item) => {
                if (props.criteria.delCriteria !== item._id) {
                    return item
                }
            }))
            setLoader(false)
            props.beforeCriteria()
        }
    }, [props.criteria.delAuth])


    const delCriteria = (id) => {
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
                props.delCriteria(id)
            }
        })
    }

    const onPageChange = async (page) => {
        setLoader(true)
        if ((filters && filters.level.value) || searchSubLevel) {
            const qs = ENV.objectToQueryString({ page, level: filters.level.value, searchSubLevel: searchSubLevel.trim() })
            props.listCriteria(qs)
        }
        else {
            const qs = ENV.objectToQueryString({ page })
            props.listCriteria(qs)
        }
    }

    const applyFilters = () => {
        if ((filters && filters.level.value) || searchSubLevel) {
            setResetButton(true)
            const qs = ENV.objectToQueryString({ page: 1, limit: 10, level: filters.level.value, searchSubLevel: searchSubLevel.trim() })
            props.listCriteria(qs)
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
        setFilters({ level: { value: '', label: '' } })
        setSearchSubLevel('')
        props.listCriteria()
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
                                                    <label>Search with Level...</label>
                                                    <div className='select-items'><Select classNamePrefix="triage-select" className="w-100" placeholder={<span>Select Level</span>} value={filters.level} options={levels} onChange={(e) => { setFilters({ ...filters, level: { label: e.label, value: e.value } }) }} /></div>
                                                </Form.Group>
                                            </Col>
                                            <Col xl={4} sm={6}>
                                                <Form.Group>
                                                    <label>Search with Sub-Level...</label>
                                                    <Form.Control value={searchSubLevel} type="number" min="1" step="1" placeholder="Sub-Level" onChange={(e) => setSearchSubLevel(e.target.value)} />
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
                                            <Card.Title as="h4">Criteria</Card.Title>
                                            {
                                                permissions?.addCriteria &&
                                                <Button
                                                    className="float-sm-right btn-filled d-flex align-items-center"
                                                    onClick={() => props.history.push(`/add-criteria`)}>
                                                    <span className='add-icon mr-2'>
                                                        <FontAwesomeIcon icon={faPlus} />
                                                    </span>
                                                    Add Criteria
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
                                                        <th className="td-name">Level</th>
                                                        <th className="td-name text-center">Sub-Level</th>
                                                        <th className="td-name text-center">Min Investment</th>
                                                        <th className="td-name text-center">Max Investment</th>
                                                        {/* <th className="td-name text-center">Months</th>
                                                        <th className="td-name text-center">Available Profit in locked Currency %</th>
                                                        <th className="td-name text-center">Profit in locked Currency %</th>
                                                        <th className="td-name text-center">Locked profit in Primary Currency %</th> */}
                                                        {(permissions?.editCriteria || permissions?.deleteCriteria) &&
                                                            <th className='td-status text-center'>Action</th>}
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
                                                                                {item.level ? item.level === 1 ? 'Bronze' : item.level === 2 ? 'Silver' : item.level === 3 ? 'Gold' : item.level === 4 ? 'Platinum' : '' : 'N/A'}
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-white text-center">
                                                                            <div className="faq-title td-name">
                                                                                {item.subLevel ? item.subLevel : 'N/A'}
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-white text-center">
                                                                            <div className="faq-title td-name">
                                                                                {item.minInvestment ? item.minInvestment : 'N/A'}
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-white text-center">
                                                                            <div className="faq-title td-name">
                                                                                {item.maxInvestment ? item.maxInvestment : 'N/A'}
                                                                            </div>
                                                                        </td>
                                                                        {/* <td className="text-white text-center">
                                                                            <div className="faq-title td-name">
                                                                                {item.months ? item.months : 'N/A'}
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-white text-center">
                                                                            <div className="faq-title td-name">
                                                                                {item.availableProfit ? item.availableProfit : 'N/A'}
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-white text-center">
                                                                            <div className="faq-title td-name">
                                                                                {item.lockedProfit ? item.lockedProfit : 'N/A'}
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-white text-center">
                                                                            <div className="faq-title td-name">
                                                                                {item.lockedProfitInPrimaryCurrency ? item.lockedProfitInPrimaryCurrency : 'N/A'}
                                                                            </div>
                                                                        </td> */}
                                                                        {(permissions?.editCriteria || permissions?.deleteCriteria) &&
                                                                            <td className="td-actions">
                                                                                <ul className="list-unstyled mb-0 d-flex justify-content-center align-items-center">
                                                                                    <li className="d-inline-block align-top">
                                                                                        <OverlayTrigger overlay={<Tooltip id="tooltip-436082023" >View</Tooltip>}  placement="top">
                                                                                            <button type="button" className="btn-link btn-icon btn btn-info" onClick={() => props.history.push(`/view-criteria/${window.btoa(item._id)}`)}><i className="fas fa-eye"></i></button>
                                                                                        </OverlayTrigger>
                                                                                    </li>
                                                                                    {
                                                                                        permissions && permissions.editCriteria &&
                                                                                        <li className="d-inline-block align-top">
                                                                                            <OverlayTrigger overlay={<Tooltip id="tooltip-436082023"> Edit </Tooltip>}  placement="top">
                                                                                                <Button
                                                                                                    className="btn-link btn-icon"
                                                                                                    type="button"
                                                                                                    variant="success"
                                                                                                    onClick={() => props.history.push(`/edit-criteria/${window.btoa(item._id)}`)}
                                                                                                >
                                                                                                    <i className="fas fa-edit"></i>
                                                                                                </Button>
                                                                                            </OverlayTrigger>
                                                                                        </li>
                                                                                    }
                                                                                    {
                                                                                        permissions && permissions.deleteCriteria &&
                                                                                        <li className="d-inline-block align-top">
                                                                                            <OverlayTrigger overlay={<Tooltip id="tooltip-334669391"> Delete </Tooltip>}  placement="top">
                                                                                                <Button
                                                                                                    className="btn-link btn-icon"
                                                                                                    type="button"
                                                                                                    variant="danger"
                                                                                                    onClick={() => delCriteria(item._id)}
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
                                                                <td colSpan="10" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No Criteria Found</div>
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
    criteria: state.criteria,
    error: state.error,
    getRoleRes: state.role.getRoleRes
});

export default connect(mapStateToProps, { listCriteria, beforeCriteria, getCriteria, delCriteria, getRole, beforeRole })(Criteria);
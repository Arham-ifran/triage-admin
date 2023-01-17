import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import moment from 'moment';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, OverlayTrigger, Row, Table, Tooltip } from "react-bootstrap";
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { ENV } from '../../config/config';
import { beforeStaking, listStaking, beforeSendProfit, sendProfit } from './Staking.action';
import { toast } from 'react-toastify'
import { beforeRole, getRole } from 'views/AdminStaff/permissions/permissions.actions';
import StakingDetailsModal from "./StakingDetailsModal";
var CryptoJS = require("crypto-js");

const Staking = (props) => {
    const [data, setData] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [resetButton, setResetButton] = useState(false)
    const [loader, setLoader] = useState(true)
    const [filters, setFilters] = useState({
        firstName: '',
        lastName: '',
        codeType: '',
        status: ''
    })
    const [sendBtnLoader, setSendBtnLoader] = useState(false)
    const [stakingModal, setStakingModal] = useState(false)
    const [stakingData, setStakingData] = useState()
    const [selectedStake, setSelectedStake] = useState(null)
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
        props.listStaking()
    }, [])

    useEffect(() => {
        if (props.staking.sendProfitAuth) {
            console.log("props.staking.sendProfitAuth === ")
            setSelectedStake(null)
            props.listStaking()
            setLoader(false)
        }
    }, [props.staking.sendProfitAuth])

    useEffect(() => {
        if (props.staking.listStakingAuth) {
            let data = props.staking?.listStaking
            setPagination(data?.pagination)
            setData(data?.stake)
            props.beforeStaking()
            setLoader(false)
        }
    }, [props.staking.listStakingAuth])

    const onPageChange = async (page) => {
        setLoader(true)
        const qs = ENV.objectToQueryString({ page, ...filters })
        props.listStaking(qs)
    }

    const applyFilters = () => {
        if (filters.firstName || filters.lastName || filters.codeType || filters.status) {
            setResetButton(true)
            const qs = ENV.objectToQueryString({ page: 1, limit: 10, ...filters })
            props.listStaking(qs)
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
        setFilters({
            firstName: '',
            lastName: '',
            codeType: '',
            status: ''
        })
        props.listStaking()
        setLoader(true)
    }

    // call the api which will transfer the profit 
    const callSendProfitApi = (stakeId) => {
        props.beforeSendProfit()
        setSelectedStake(stakeId)
        Swal.fire({
            title: 'Are you sure you want to send the profit?',
            html: 'If you send the profit, transaction cant be reverted.',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Send Profit'
        }).then(async (result) => {
            if (result.value) {
                setLoader(true)
                // calling the send profit api
                props.sendProfit({ stakeId })
            }
        })
    }

    const viewStaking = (details) => {
        setStakingModal(true)
        setStakingData(details)
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
                                                    <Form.Control type="text" placeholder="First Name" onChange={(e) => setFilters({ ...filters, firstName: (e.target.value).trim() })}
                                                        value={filters.firstName}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={4} sm={6}>
                                                <Form.Group>
                                                    <label>Search with Last Name...</label>
                                                    <Form.Control type="text" placeholder="Last Name" onChange={(e) => setFilters({ ...filters, lastName: (e.target.value).trim() })}
                                                        value={filters.lastName}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={4} sm={6} className="search-wrap">
                                                <label >Search with Profit Type...</label>
                                                <Form.Group>
                                                    <select value={filters.codeType} onChange={(e) => setFilters({ ...filters, codeType: e.target.value })}>
                                                        <option value="">Select Code Type</option>
                                                        <option value='1'>Locked</option>
                                                        <option value="2">Primary</option>
                                                        <option value="3">Available</option>
                                                    </select>
                                                </Form.Group>
                                            </Col>
                                            <Col xl={4} sm={6} className="search-wrap">
                                                <label >Search with Stake Period Ended...</label>
                                                <Form.Group>
                                                    <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                                                        <option value="">Select Stake Period Ended</option>
                                                        <option value='true'>Yes</option>
                                                        <option value="false">No</option>
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
                                            <Card.Title as="h4">Staking</Card.Title>
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy table-w">
                                                <thead>
                                                    <tr>
                                                        <th className="td-start serial-col">#</th>
                                                        <th className="td-name">
                                                            <div className='faqs-title td-name'>Username</div>
                                                        </th>
                                                        {/* <th className="td-name text-center">
                                                            <div className='faqs-title'>Deposited Amount</div>
                                                        </th> */}
                                                        <th className="td-name">
                                                            <div className='faqs-title td-name'>Profit Type</div>
                                                        </th>
                                                        <th className="td-name">
                                                            <div className='faqs-title td-name text-center'>Total Profit %</div>
                                                        </th>
                                                        {/* <th className="td-name">
                                                            <div className='faqs-title td-name text-center'>Profit Amount</div>
                                                        </th> */}
                                                        <th className="td-name text-center">
                                                            <div className='faqs-title'>Stake Period Ended</div>
                                                        </th>
                                                        {
                                                            permissions?.editStaking ?
                                                                <th className="td-actions text-center">Actions</th> : ''
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
                                                                        <td className='text-white td-name'>
                                                                            <div className="faq-title td-name">
                                                                                {item.userFirstName ? item.userFirstName + ' ' : 'N/A'} {item.userFirstName && item.userLastName ? item.userLastName : ''}
                                                                            </div>
                                                                        </td>
                                                                        {/* <td className="text-white text-center">
                                                                            <div className="td-title">
                                                                                {item.depositedAmount ? item.depositedAmount : 'N/A'}
                                                                            </div>
                                                                        </td> */}
                                                                        <td className="text-white ">
                                                                            <div className="td-title td-name">
                                                                                {item.profitType === 1 ? "Available" : item.profitType === 2 ? "Locked" :  "N/A"}
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-white text-center">
                                                                            <div className="td-title td-name">
                                                                                {item.totalProfit ? `${item.totalProfit} %` : 'N/A'}
                                                                            </div>
                                                                        </td>
                                                                        {/* <td className="text-white text-center">
                                                                            <div className="td-title td-name">
                                                                                {item.profitAmount ? (item.profitAmount).toFixed(8) : 0}
                                                                            </div>
                                                                        </td> */}
                                                                        <td className="text-white text-center">
                                                                            <div className="faq-title td-name">
                                                                                {item.stakeEndDate ?
                                                                                    new Date(item.stakeEndDate) < new Date() ?
                                                                                        <span className={'bg-success text-white text-center px-2 py-1 d-inline-block align-top kyc-badge'}>
                                                                                            Yes
                                                                                        </span>
                                                                                        :
                                                                                        <span className={'bg-danger text-white text-center px-2 py-1 d-inline-block align-top kyc-badge'}>
                                                                                            No
                                                                                        </span>
                                                                                    : 'N/A'}
                                                                            </div>
                                                                        </td>
                                                                        <td className="td-actions text-center text-white">
                                                                            <ul className="list-unstyled mb-0 d-flex justify-content-center align-items-center">
                                                                                {/* {permissions?.editStaking &&
                                                                                    <li className="d-inline-block align-top">
                                                                                        {
                                                                                            item.interestPaid && item.stakeEndDate === moment() ?
                                                                                                <span>Sent</span> :
                                                                                                item.stakeEndDate === moment() || item.profitType === 3 ?
                                                                                                    <Button
                                                                                                        className="btn-link btn-icon"
                                                                                                        type="button"
                                                                                                        variant="info"
                                                                                                        onClick={() => { callSendProfitApi(item._id) }}
                                                                                                    >
                                                                                                        <span>Send Profit</span>
                                                                                                    </Button> :

                                                                                                    <Button
                                                                                                        className="btn-link btn-icon"
                                                                                                        disabled
                                                                                                        ><span className='text-white'>Wait For Profit</span></Button>

                                                                                        }
                                                                                    </li>} */}
                                                                                <li className="d-inline-block align-top">
                                                                                    <OverlayTrigger overlay={<Tooltip id="tooltip-436082023"> View Detail </Tooltip>}  placement="top">
                                                                                        <Button
                                                                                            className="btn-link btn-icon"
                                                                                            type="button"
                                                                                            variant="info"
                                                                                            onClick={() => viewStaking(item)}
                                                                                        >
                                                                                            <i className="fas fa-eye"></i>
                                                                                        </Button>
                                                                                    </OverlayTrigger>
                                                                                </li>
                                                                            </ul>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan={permissions?.editStaking ? "6" : "5"} className="text-center">
                                                                    <div className="alert alert-info" role="alert">No Staking Found</div>
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
                        <StakingDetailsModal stakingModal={stakingModal} setStakingModal={setStakingModal} data={stakingData} />
                    </Container>
            }
        </>
    )
}

const mapStateToProps = state => ({
    staking: state.staking,
    error: state.error,
    getRoleRes: state.role.getRoleRes
});

export default connect(mapStateToProps, { beforeStaking, listStaking, beforeSendProfit, sendProfit, getRole, beforeRole })(Staking);
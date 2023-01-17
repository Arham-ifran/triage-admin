import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import { beforeWallet, getWallets, deleteWallet } from './Wallet.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import Swal from 'sweetalert2';
import { getRole, beforeRole } from 'views/AdminStaff/permissions/permissions.actions';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { faPeopleArrows, faPlus } from '@fortawesome/free-solid-svg-icons';
import EditWallet from './EditWallet';
import { networks, currencyTypes } from 'config/networks';
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

var CryptoJS = require("crypto-js");
const userDefaultImg = 'https://res.cloudinary.com/arhamsoft-ltd/image/upload/v1658297644/hex-nft/assets/transparent-placeholder_qetgdv.png';

const Wallet = (props) => {
    const [data, setData] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [loader, setLoader] = useState(true)
    const [permissions, setPermissions] = useState({})
    const [resetButton, setResetButton] = useState(false)
    const [searchName, setSearchName] = useState('')
    const [searchStatus, setSearchStatus] = useState('')
    const [searchSymbol, setSearchSymbol] = useState('')
    const [searchNetwork, setSearchNetwork] = useState()
    const [searchType, setSearchType] = useState()

    useEffect(() => {
        window.scroll(0, 0)
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        props.getWallets()
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
        if (props.wallets.getWalletsAuth) {
            let { wallets, pagination } = props.wallets.wallets
            setData(wallets)
            setPagination(pagination)
            props.beforeWallet()
        }
    }, [props.wallets.getWalletsAuth])

    useEffect(() => {
        if (data) {
            setLoader(false)
        }
    }, [data])

    useEffect(() => {
        if (props.wallets.delWalletAuth) {
            let filtered = data.filter((item) => {
                if (item._id !== props.wallets.wallet.walletId)
                    return item
            })
            setData(filtered)
            props.beforeWallet()
        }
    }, [props.wallets.delWalletAuth])

    const deleteWallet = (walletId) => {
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
                props.deleteWallet(walletId)
            }
        })
    }

    const onPageChange = async (page) => {
        const filter = {}
        if (searchStatus !== '') {
            filter.status = searchStatus === 'true' ? true : false
        }
        if (searchName !== '') {
            filter.name = searchName
        }
        setLoader(true)
        const qs = ENV.objectToQueryString({ page, ...filter })
        props.getWallets(qs)
    }

    const applyFilters = () => {
        const filter = {}
        if (searchStatus !== '') {
            filter.status = searchStatus === 'true' ? true : false
        }
        if (searchName !== '') {
            filter.name = searchName.trim()
        }
        if (filter.status !== undefined || filter.name) {
            setResetButton(true)
            const qs = ENV.objectToQueryString({ page: 1, limit: 10, ...filter })
            props.getWallets(qs)
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
        setSearchName('')
        setSearchSymbol('')
        setSearchStatus('')
        setSearchNetwork(0)
        setSearchType(0)
        props.getWallets()
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
                                                    <Form.Control type="text" value={searchName} placeholder="Name" onChange={(e) => setSearchName(e.target.value)} /*onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={4} md="6" sm={12}>
                                                <label >Search with Status...</label>
                                                <Form.Group>
                                                    <select value={searchStatus} onChange={(e) => setSearchStatus(e.target.value)}>
                                                        <option value="">Select Status</option>
                                                        <option value='true'>Active</option>
                                                        <option value="false">Inactive</option>
                                                    </select>
                                                </Form.Group>
                                            </Col>
                                            <Col xl={4} md="6" sm={12}>
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">&nbsp;</Form.Label>
                                                    <div className="d-flex filter-btns-holder">
                                                        <Button className='btn-filled mr-3' onClick={applyFilters}>Search</Button>
                                                        {resetButton && <Button className="outline-button" onClick={reset}>Reset</Button>}
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
                                            <Card.Title as="h4">Wallets</Card.Title>
                                            {/* <p className="card-category">List of FAQs</p> */}
                                            {
                                                permissions && permissions.addWallet &&
                                                <Button
                                                    className="float-sm-right btn-filled d-flex align-items-center"
                                                    onClick={() => props.history.push(`/add-wallet`)}>
                                                    <span className='add-icon mr-2'>
                                                        <FontAwesomeIcon icon={faPlus} />
                                                    </span>
                                                    Add Wallet
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
                                                            <div className='faqs-title text-center'>Logo</div>
                                                        </th>
                                                        <th className="td-name">
                                                            <div className='faqs-title td-name'>Name</div>
                                                        </th>
                                                        <th className="td-name text-center">
                                                            <div className='faqs-title td-name'>Symbol</div>
                                                        </th>
                                                        {/* <th className="td-name text-center">
                                                            <div className='faqs-title td-name'>Token Type</div>
                                                        </th> */}
                                                        <th className='td-status text-center'>Status</th>
                                                        {(permissions?.editWallet || permissions?.deleteWallet) && <th className="td-actions text-center">Actions</th>}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        data && data.length ?
                                                            data.map((item, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="serial-col text-white">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                        <td>
                                                                            <div className="user-image">
                                                                                <img className="img-fluid" alt="User Image" src={item.logo ? item.logo : userDefaultImg} />
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-white">
                                                                            <div className="faq-title td-name">
                                                                                {item.name ? item.name : "N/A"}
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-white text-center">
                                                                            <div className="faq-title td-name">
                                                                                {item.symbol ? item.symbol : "N/A"}
                                                                            </div>
                                                                        </td>
                                                                      
                                                                        {/* <td className="text-white text-center">
                                                                            <div className="faq-title td-name">
                                                                                {item.type === 1 ? "Primary" : item.type === 2 ? "Native" : item.type === 3 ? "Non Native" : "N/A"}
                                                                            </div>
                                                                        </td> */}
                                                                        <td className="text-white text-center">
                                                                            <span className={`label kyc-badge kyc-status-badge d-inline-block align-top px-2 py-1 ${item.status ? 'label-success' : 'label-danger'}`}>{item.status ? 'Active' : 'Inactive'}</span>
                                                                        </td>
                                                                        {(permissions?.editWallet || permissions?.deleteWallet) &&
                                                                            <td className="td-actions">
                                                                                <ul className="list-unstyled mb-0 d-flex justify-content-center align-items-center">
                                                                                <li className="d-inline-block align-top">
                                                                                            <OverlayTrigger overlay={<Tooltip id="tooltip-436082023"> View </Tooltip>}  placement="top">
                                                                                                <Button
                                                                                                    className="btn-link btn-icon"
                                                                                                    type="button"
                                                                                                    variant="success"
                                                                                                    onClick={() => props.history.push(`/view-wallet/${item._id}`)}
                                                                                                >
                                                                                                    <i className="fas fa-eye"></i>
                                                                                                </Button>
                                                                                            </OverlayTrigger>
                                                                                        </li>
                                                                                    {
                                                                                        permissions && permissions.editWallet &&
                                                                                        <li className="d-inline-block align-top">
                                                                                            <OverlayTrigger overlay={<Tooltip id="tooltip-436082023"> Edit </Tooltip>}  placement="top">
                                                                                                <Button
                                                                                                    className="btn-link btn-icon"
                                                                                                    type="button"
                                                                                                    variant="success"
                                                                                                    onClick={() => props.history.push(`/edit-wallet/${item._id}`)}
                                                                                                >
                                                                                                    <i className="fas fa-edit"></i>
                                                                                                </Button>
                                                                                            </OverlayTrigger>
                                                                                        </li>
                                                                                    }
                                                                                    {
                                                                                        permissions && permissions.deleteWallet &&
                                                                                        <li className="d-inline-block align-top">
                                                                                            <OverlayTrigger overlay={<Tooltip id="tooltip-334669391"> Delete </Tooltip>}  placement="top">
                                                                                                <Button
                                                                                                    className="btn-link btn-icon"
                                                                                                    type="button"
                                                                                                    variant="danger"
                                                                                                    onClick={() => deleteWallet(item._id)}
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
                                                                <td colSpan={(permissions?.editWallet || permissions?.deleteWallet) ? "6" : "5"} className="text-center">
                                                                    <div className="alert alert-info" role="alert">No Wallet Found</div>
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
    wallets: state.wallets,
    error: state.error,
    getRoleRes: state.role.getRoleRes
});

export default connect(mapStateToProps, { beforeWallet, getWallets, deleteWallet, getRole, beforeRole })(Wallet);
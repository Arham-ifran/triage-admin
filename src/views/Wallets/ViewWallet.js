import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { beforeWallet, getWallet, updateWallet } from './Wallet.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import 'rc-pagination/assets/index.css';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import validator from 'validator';
import { networks, currencyTypes } from 'config/networks';
import { ENV } from "../../config/config";

const EditWallet = (props) => {

    const [data, setData] = useState({
    })

    const [msg, setMsg] = useState({
        walletAddress: '',
    })

    const [loader, setLoader] = useState(true)

    useEffect(() => {
        window.scroll(0, 0)
        props.getWallet(window.location.pathname.split('/')[3])
    }, [])

    useEffect(() => {
        if (props.wallets.getWalletAuth) {
            const { walletAddress, status, symbol, name, networkId, type, interestRate } = props.wallets.wallet
            setData({ walletAddress, status, _id: window.location.pathname.split('/')[3], symbol, name, networkId, type, interestRate })
            props.beforeWallet()
            setLoader(false)
        }
    }, [props.wallets.getWalletAuth])

    useEffect(() => {
        if (props.wallets.editWalletAuth) {
            props.beforeWallet()
            setLoader(false)
            props.history.push(`/wallet`)
        }
    }, [props.wallets.editWalletAuth])


    const onFileChange = (e) => {
        let file = e.target.files[0]
        if (file) {
            setData({ ...data, image: file})
        }
    }

    const update = () => {
        if (!validator.isEmpty(data.walletAddress) && !validator.isEmpty(data.name) && !validator.isEmpty(data.symbol) && data.networkId != 0 && data.type != 0) {
            setMsg({
                walletAddress: '', name : '', symbol: '', networkId: '', type: '', interestRate: ''
            })
            if (data.status === undefined)
                data.status = false
            let formData = new FormData()
            for (const key in data)
                formData.append(key, data[key])
            props.updateWallet(formData)
            setLoader(false)
        }
        else {
            let walletAddress = ''
            let name = ''
            let symbol = ''
            let networkId = ''
            let type = ''
            if (validator.isEmpty(data.walletAddress)) {
                walletAddress = 'Wallet Address Required.'
            }
            if (validator.isEmpty(data.name)) {
                name = 'Name is Required.'
            }
            if (validator.isEmpty(data.symbol)) {
                symbol = 'Symbol is Required.'
            }
            if (data.networkId == 0) {
                networkId = 'Please Select Network.'
            }
            if (data.type == 0) {
                type = 'Please Select Currency Type.'
            }
            setMsg({ walletAddress, name, symbol, networkId, type })
        }
    }

    return (
        <>
            {
                loader ?
                    <FullPageLoader />
                    :
                    <Container>
                        <Row>
                            <Col md="12">
                                <Card className="pb-3">
                                    <Card.Header>
                                        <Card.Title as="h4">Wallet Detail</Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>Name<span className="text-danger"> *</span></label>
                                                    <Form.Control
                                                        value={data.name ? data.name : ''}
                                                        onChange={(e) => {
                                                            setData({ ...data, name: e.target.value });
                                                        }}
                                                        placeholder="Name"
                                                        disabled
                                                        type="text"
                                                    ></Form.Control>
                                                    <span className={msg.name ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.name}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>Symbol<span className="text-danger"> *</span></label>
                                                    <Form.Control
                                                        value={data.symbol ? data.symbol : ''}
                                                        onChange={(e) => {
                                                            setData({ ...data, symbol: e.target.value });
                                                        }}
                                                        placeholder="Symbol"
                                                        disabled
                                                        type="text"
                                                    ></Form.Control>
                                                    <span className={msg.symbol ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.symbol}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>Token Type <span className="text-danger"> *</span></label>
                                                    <div>
                                                        <select disabled value={data.type} onChange={(e) => {console.log(e.target.value); setData({ ...data, type: e.target.value })}}>
                                                            <option value={0} >Select Type</option>
                                                            {
                                                                currencyTypes.map((e)=> {
                                                                    return (
                                                                        <option value={e.value}>{e.label}</option>
                                                                    )
                                                                })
                                                            }
                                                        </select>
                                                        <span className={msg.type ? `` : `d-none`}>
                                                            <label className="pl-1 text-danger">{msg.type}</label>
                                                        </span>
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                            {data.type == 2 || data.type == 0 ? 
                                            ""
                                            :
                                                <Col md="6">
                                                    <Form.Group>
                                                        <label>Wallet Address <span className="text-danger"> *</span></label>
                                                        <Form.Control
                                                            value={data.walletAddress ? data.walletAddress : ''}
                                                            disabled
                                                            onChange={(e) => {
                                                                setData({ ...data, walletAddress: e.target.value });
                                                            }}
                                                            placeholder="Wallet Address"
                                                            type="text"
                                                        ></Form.Control>
                                                        <span className={msg.walletAddress ? `` : `d-none`}>
                                                            <label className="pl-1 text-danger">{msg.walletAddress}</label>
                                                        </span>
                                                    </Form.Group>
                                                </Col>
                                            }
                                        </Row>
                                        <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>Network <span className="text-danger"> *</span></label>
                                                    <div>
                                                        <select disabled value={data.networkId} onChange={(e) => {console.log(e.target.value); setData({ ...data, networkId: e.target.value })}}>
                                                            <option value={0} >Select Network</option>
                                                            {
                                                                networks.map((e)=> {
                                                                    return (
                                                                        <option value={e.value}>{e.label}</option>
                                                                    )
                                                                })
                                                            }
                                                        </select>
                                                        <span className={msg.networkId ? `` : `d-none`}>
                                                            <label className="pl-1 text-danger">{msg.networkId}</label>
                                                        </span>
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>Interest Rate <span className="text-danger"> *</span></label>
                                                    <Form.Control
                                                        value={data.interestRate ? data.interestRate : 0}
                                                        onChange={(e) => {
                                                            setData({ ...data, interestRate: e.target.value });
                                                        }}
                                                        placeholder="Interest Rate"
                                                        disabled
                                                        type="text"
                                                        onKeyDown={(e) => ENV.decimalNumberValidator(e)}
                                                    ></Form.Control>
                                                    <span className={msg.interestRate ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.interestRate}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col> 
                                        </Row>
                                        <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <div className='d-flex pt-3'>
                                                        <label className='mr-3'>Status<span className="text-danger"> *</span></label>
                                                        <label className="right-label-radio mr-3 mb-2">Active
                                                            <input  disabled name="status" type="radio" checked={data.status} value={data.status} onChange={(e) => { setData({ ...data, status: true }) }} />
                                                            <span className="checkmark"></span>
                                                        </label>
                                                        <label className="right-label-radio mr-3 mb-2">Inactive
                                                            <input  disabled name="status" type="radio" checked={!data.status} value={!data.status} onChange={(e) => { setData({ ...data, status: false }) }} />
                                                            <span className="checkmark"></span>
                                                        </label>
                                                    </div>

                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md="12" sm="6">
                                                <div className='d-flex justify-content-end align-items-center'>
                                                    <Button
                                                        className="btn-filled pull-right mt-3"
                                                        type="submit"
                                                        variant="info"
                                                        onClick={()=> props.history.goBack()}
                                                    >
                                                        Back
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>

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
    error: state.error
});

export default connect(mapStateToProps, { beforeWallet, getWallet, updateWallet })(EditWallet);
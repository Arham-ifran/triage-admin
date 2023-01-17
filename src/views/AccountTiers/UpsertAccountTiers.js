import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import 'rc-pagination/assets/index.css';
import Select from 'react-select'
import { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { connect } from 'react-redux';
import validator from 'validator';
import { beforeAccountTiers, addAccountTier, getAccountTier, updateAccountTier } from './AccountTiers.action'
import { useHistory } from 'react-router-dom';

const UpsertAccountTiers = (props) => {

    const history = useHistory();
    const [loader, setLoader] = useState(true)
    const [_id, setId] = useState('')
    const [level, setLevel] = useState({})
    const [imageChangeCheck, setImageChangeCheck] = useState(false)
    const [data, setData] = useState({
        level: '',
        image: ''
    })
    const [saveData, setSaveData] = useState({
        level: '',
        image: ''
    })
    const [msg, setMsg] = useState({
        level: ''
    })
    const levels = [
        { value: 1, label: 'Bronze' },
        { value: 2, label: 'Silver' },
        { value: 3, label: 'Gold' },
        { value: 4, label: 'Platinum' },
    ]


    useEffect(() => {
        window.scroll(0, 0)
        const _id = window.location.href.split('/')[5]
        if (_id) {
            setId(_id)
            props.getAccountTier(window.atob(_id))
        }
        else {
            setLoader(false)
        }
    }, [])

    useEffect(() => {
        if (props.accountTiers.createAccountTierAuth) {
            props.beforeAccountTiers()
            history.push('/account-tiers')
        }
    }, [props.accountTiers.createAccountTierAuth])

    useEffect(() => {
        if (props.accountTiers.editAccountTierAuth) {
            props.beforeAccountTiers()
            history.push('/account-tiers')
        }
    }, [props.accountTiers.editAccountTierAuth])

    useEffect(() => {
        if (props.accountTiers.getAccountTierAuth) {
            let resData = props.accountTiers.getAccountTier
            setLevel(levels.filter((item) => {
                if (item.value === resData.level)
                    return (item)
            })[0])
            setData(resData)
            setSaveData({ ...saveData, _id: resData._id, level: resData.level })
            props.beforeAccountTiers()
            setLoader(false)
        }
    }, [props.accountTiers.getAccountTierAuth])

    useEffect(() => {
        if (imageChangeCheck) {
            setImageChangeCheck(false)
        }
    }, [imageChangeCheck])

    useEffect(() => {
        if (props.error) {
            setLoader(false)
        }
    }, [props.error])


    const submit = () => {
        if (!validator.isEmpty(`${saveData.level}`)) {
            if (validator.isInt(`${saveData.level}`)) {
                setMsg({
                    level: ''
                })
                let formData = new FormData()
                for (const key in saveData) {
                    if (saveData[key]) {
                        formData.append(key, saveData[key])
                    }
                }
                setLoader(true)
                if (_id) {
                    props.updateAccountTier(formData)
                }
                else {
                    props.addAccountTier(formData)
                }
            }
        }
        else {
            let level = ''
            if (validator.isEmpty(saveData.level)) {
                level = 'Level Required.'
            }
            setMsg({ level })
        }
    }

    const onChange = (e) => {
        if (e.target.files[0]) {
            let newData = data
            newData[e.target.name] = URL.createObjectURL(e.target.files[0])
            setData(newData)
            let newSaveData = saveData
            newSaveData[e.target.name] = e.target.files[0]
            setSaveData(newSaveData)
            setImageChangeCheck(true)
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
                                <Card className="pb-3 table-big-boy">
                                    <Card.Header>
                                        <Card.Title as="h4">{(_id ? 'Edit' : 'Add') + ' Account Tier'}</Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md="12 pb-3">
                                                <Form.Group className='pb-5'>
                                                    <label>Level<span className="text-danger"> *</span></label>
                                                    <div className='select-items'><Select classNamePrefix="triage-select" className="w-100" placeholder={<span>Select Level</span>} value={level} options={levels} onChange={(e) => { setSaveData({ ...saveData, level: e.value }); setLevel({ label: e.label, value: e.value }); }} /></div>
                                                    <span className={msg.level ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.level}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12 pb-3">
                                                <div>
                                                    <span className="ps-2 mb-2 text-white">Image</span>
                                                    {
                                                        data && data.image ?
                                                            <div className="card-img-uploader pt-3 pb-3">
                                                                <img className="img-fluid" src={data.image} />
                                                            </div>
                                                            : ''
                                                    }
                                                </div>
                                                <div className='text-white pt-3'>
                                                    <div>
                                                        <label>Please Upload Image</label>
                                                    </div>
                                                    <div>
                                                        <input type="file" size="60" accept=".png,.jpeg,.jpg" onChange={onChange} name='image' />
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                        <Col  md="6" sm="6">
                                                <div className='d-flex justify-content-start align-items-center'>
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

                                            <Col md="6" sm="6">
                                                <div className='d-flex justify-content-end align-items-center'>
                                                    <Button
                                                        className="btn-filled pull-right mt-3"
                                                        type="submit"
                                                        variant="info"
                                                        onClick={submit}
                                                    >
                                                        {_id ? 'Edit' : 'Add'}
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
    accountTiers: state.accountTiers,
    error: state.error
});

export default connect(mapStateToProps, { beforeAccountTiers, addAccountTier, getAccountTier, updateAccountTier })(UpsertAccountTiers);
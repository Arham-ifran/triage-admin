import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { useEffect, useState } from 'react';
import { Card, Col, Container, Row, Table, Form, Button } from "react-bootstrap";
import { toast } from 'react-toastify'
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import moment from 'moment';
import { ENV } from '../../config/config';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { beforeNewsletter, listNewsletter,sendEmail } from './newsletter.actions';
import { updateUser } from 'views/Users/Users.action';


const NewsLetter = (props) => {
    const [data, setData] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [resetButton, setResetButton] = useState(false)
    const [loader, setLoader] = useState(true)
    const [selectionRange, setSelectionRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    })
    const [searchDate, setSearchDate] = useState({
        startDate: '',
        endDate: ''
    })
    const [calendarCheck, setCalendarCheck] = useState(false)
    const [filters, setFilters] = useState({
        email: '',
        ip: ''
    })


    useEffect(() => {
        window.scroll(0, 0)
        props.listNewsletter()
    }, [])

    useEffect(() => {
        if (props.newsletter.newslettersAuth) {
            let newsletters = props.newsletter.newsletters
            setData(newsletters.newsletter)
            setPagination(newsletters.pagination)
            setLoader(false)
            props.beforeNewsletter()
        }
    }, [props.newsletter.newslettersAuth])


    const onPageChange = async (page) => {
        setLoader(true)
        const qs = ENV.objectToQueryString({ page, ...filters, startDate: searchDate.startDate, endDate: searchDate.endDate })
        props.listNewsletter(qs)
    }

    const applyFilters = () => {
        if ((filters && filters.email) || (filters && filters.ip) || (searchDate.startDate && searchDate.endDate)) {
            setResetButton(true)
            const qs = ENV.objectToQueryString({ page: 1, limit: 10, ...filters, startDate: searchDate.startDate, endDate: searchDate.endDate })
            props.listNewsletter(qs)
            setCalendarCheck(false)
            setLoader(true)
        }
        else {
            toast.error('All filter fields are empty.', {
                toastId: "FIELD_REQUIRED",
            })
        }

    }

    const handleDateRange = (ranges) => {
        if (ranges) {
            setSelectionRange(ranges.selection)
            setSearchDate({
                startDate: ranges.selection.startDate.toISOString(),
                endDate: ranges.selection.endDate.toISOString()
            })
        }
    }

    const reset = () => {
        setResetButton(false)
        setFilters({ email: '', ip: '' })
        setSelectionRange({
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        })
        setSearchDate({
            startDate: '',
            endDate: ''
        })
        props.listNewsletter()
        setLoader(true)
    }

    const toggleSelectionAll = (toggle) => {
        let selectedEmails = []
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            element.isSelected = toggle
            selectedEmails.push(element);
        }
        setData(selectedEmails)
    }

    const toggleSelection = (e, id) => {
        let selection = e.target.checked;
        let index = data.findIndex(email => email._id.toString() === id.toString())
        data[index].isSelected = selection;
        let newData = data
        setData(newData)
	}

    const emailToSelectedUsers = () => {
        let selectedEmails = data.filter(item => item.isSelected === true)
        if(selectedEmails.length ===0) {
            toast.error('Select At least one email Address.', {
                toastId: "FIELD_REQUIRED",
            })
            return;
        }

        let emails = []
        for (let index = 0; index < selectedEmails.length; index++) {
            const element = selectedEmails[index];
            emails.push(element.email)
        }
        let payload = {
            emails
        }
        Swal.fire({
            title: 'Confirm to send email',
            html: 'Are you sure you want to send Email to selected Email Addresses ? ',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm'
        }).then(async (result) => {
            if (result.value) {
                setLoader(true)
                props.sendEmail(payload)
            }
        })
        
    }

    const emailToAll = () => {
        let payload = {
			allSubscribers: true
		};

        Swal.fire({
            title: 'Confirm to send email',
            html: 'Are you sure you want to send Email to all? ',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm'
        }).then(async (result) => {
            if (result.value) {
                setLoader(true)
                props.sendEmail(payload)
            }
        })
    }

    useEffect(()=> {
        if(props.newsletter.sendNewsLetterEmailsAuth) {
            setLoader(false)
        }
    }, [props.newsletter.sendNewsLetterEmailsAuth])


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
                                                    <label>Search with Email...</label>
                                                    <Form.Control value={filters.email} type="text" placeholder="Email" onChange={(e) => setFilters({ ...filters, email: (e.target.value).trim() })} />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={4} sm={6}>
                                                <Form.Group>
                                                    <label>Search with IP...</label>
                                                    <Form.Control value={filters.ip} type="text" placeholder="IP" onChange={(e) => setFilters({ ...filters, ip: (e.target.value).trim() })} />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={4} sm={6}>
                                                <Form.Group>
                                                    <label>Search with Created Dates...</label>
                                                    <div>
                                                        <Button className="btn-filled mr-3" onClick={() => { setCalendarCheck(calendarCheck => !calendarCheck) }}>{calendarCheck ? 'Hide Calendar' : 'Show Calendar'}</Button>
                                                    </div>
                                                    {
                                                        calendarCheck ?
                                                            <DateRangePicker
                                                                ranges={[selectionRange]}
                                                                onChange={handleDateRange}
                                                            />
                                                            : ''
                                                    }
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
                                        <div className="d-flex align-items-center justify-content-between flex-column flex-md-row table-head">
                                            <Card.Title as="h4">NewsLetter</Card.Title>
                                            <div className="card-header-btn newsLetter-card-header-btn d-flex justify-content-center">
												{/* <button className="btn btn-primary btn-filled ml-2 mb-2" onClick={() => toggleSelectionAll(true)} fill >
													Select All
												</button>
												<button className="btn btn-warning ml-2 mb-2" onClick={() => toggleSelectionAll(false)}  fill >
													UnSelect All
												</button> */}
												{/* <button className="btn btn-primary btn-filled ml-2 mb-2" onClick={() => emailToSelectedUsers()}  fill >
													Send Email to Selected Subscribers
												</button> */}
												<button className="outline-button btn btn-warning ml-2 mb-2 dark" onClick={() => emailToAll()} fill >
													Send Email to All Subscribers
												</button>
											</div>
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy table-w newsletter-table">
                                                <thead>
                                                    <tr>
                                                        {/* <th className="td-start serial-col">
                                                            <label className="right-label-checkbox mb-0">&nbsp;
                                                                <input type="checkbox" />
                                                                <span className="checkmark"></span>
                                                            </label>
                                                        </th> */}
                                                        <th className="td-start serial-col">#</th>
                                                        <th className="td-name">
                                                            <div className='faqs-title td-email-col'>Email</div>
                                                        </th>
                                                        <th className='td-status'>IP</th>
                                                        <th className='td-status td-created-col'>Created At</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        data && data.length ?
                                                            data.map((item, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        {/* <td>
                                                                        <label className="right-label-checkbox">&nbsp;
                                                                        <input type="checkbox" 
                                                                        checked={item.isSelected ? item.isSelected : false}
                                                                        onChange={(e)=> toggleSelection(e, item._id)}
                                                                        />
                                                                        <span className="checkmark"></span>
                                                                        </label>
																	</td> */}
                                                                        <td className="serial-col text-white">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                        <td className="text-white">
                                                                            <div className="faq-title td-email-col">
                                                                                {item.email}
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-white">
                                                                            {item.ip}
                                                                        </td>
                                                                        <td className="text-white td-created-col">
                                                                            {item.createdAt ? moment(item.createdAt).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan="4" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No Newsletter Found</div>
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
    newsletter: state.newsletter
});

export default connect(mapStateToProps, { beforeNewsletter, listNewsletter,sendEmail })(NewsLetter);
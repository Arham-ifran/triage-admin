import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import moment from 'moment';
import Swal from 'sweetalert2';
import { beforeDashboard, getDashboard } from './Dashboard.action';
import { beforeUser, getUsers, deleteUser } from '../views/Users/Users.action'
import FullPageLoader from 'components/FullPageLoader/FullPageLoader'
import { connect } from 'react-redux';

const userDefaultImg = 'https://res.cloudinary.com/arhamsoft-ltd/image/upload/v1658297644/hex-nft/assets/transparent-placeholder_qetgdv.png';

function Dashboard(props) {

	const [data, setData] = useState({
		users: 0,
		wallets: 0,
		faqs: 0,
		promos: 0
	})
	const [users, setUsers] = useState(null)
	const [modalType, setModalType] = useState(0)
	const [userModal, setUserModal] = useState(false)
	const [loader, setLoader] = useState(true)
	const [user, setUser] = useState(null)

	useEffect(() => {
		props.getDashboard()
		props.getUsers('', {}, false)
	}, [])

	useEffect(() => {
		if (props.dashboard.dataAuth) {
			const { users, wallets, faqs, promos } = props.dashboard.data
			setData({ users, wallets, faqs, promos })
			props.beforeDashboard()
		}
	}, [props.dashboard.dataAuth])

	useEffect(() => {
		if (props.user.getUserAuth) {
			setUsers(props.user.users)
			props.beforeUser()
		}
	}, [props.user.getUserAuth])

	useEffect(() => {
		if (props.user.deleteUserAuth) {
			let filtered = users.filter((item) => {
				if (item._id !== props.user.userId)
					return item
			})
			setUsers(filtered)
			props.beforeUser()
		}
	}, [props.user.deleteUserAuth])

	useEffect(() => {
		if (users) {
			setLoader(false)
			if (window.location.search) {
				const urlParams = new URLSearchParams(window.location.search);
				setModal(3, urlParams.get('userId'))
			}
		}
	}, [users])

	// when an error is received
	useEffect(() => {
		if (props.error.error)
			setLoader(false)
	}, [props.error.error])


	// set modal type
	const setModal = (type = 0, userId = null) => {
		setUserModal(!userModal)
		setModalType(type)
		setLoader(false)
		// add user
		if (type === 1) {
			let user = {
				name: '', image: '', description: '', status: false
			}
			setUser(user)
		}
		// edit or view user
		else if ((type === 2 || type === 3) && userId)
			getUser(userId)
	}

	const getUser = async (userId) => {
		setLoader(true)
		const userData = await users.find((elem) => String(elem._id) === String(userId))
		if (userData)
			setUser({ ...userData })
		setLoader(false)
	}

	const deleteUser = (userId) => {
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
				props.deleteUser(userId)
			}
		})
	}

	console.log(data, "data ⭐")

	return (
		<div className="pt-3 pt-md-5">
			{
				loader ?
					<FullPageLoader />
					:
					<Container fluid>
						<Row>
							<Col xl={3} lg={4} sm={6}>
								<Link to="/users">
									<Card className="card-stats">
										<Card.Body>
											<div className="d-flex">
												<div className="numbers">
													<p className="card-category">Users</p>
													<Card.Title as="h4">{data.users}</Card.Title>
												</div>
												<div className="icon-big text-center icon-warning">
													<i className="nc-icon nc-single-02"></i>
												</div>
											</div>
										</Card.Body>
									</Card>
								</Link>
							</Col>
							<Col xl={3} lg={4} sm={6}>
								<Link to="/wallet">
									<Card className="card-stats">
										<Card.Body>
											<div className="d-flex">
												<div className="numbers">
													<p className="card-category">Wallets</p>
													<Card.Title as="h4">{data.wallets}</Card.Title>
												</div>
												<div className="icon-big text-center icon-warning">
													<i className="nc-icon nc-grid-45"></i>
												</div>
											</div>
										</Card.Body>
									</Card>
								</Link>
							</Col>
							<Col xl={3} lg={4} sm={6}>
								<Link to="/faqs">
									<Card className="card-stats">
										<Card.Body>
											<div className="d-flex">
												<div className="numbers">
													<p className="card-category">FAQs</p>
													<Card.Title as="h4">{data.faqs}</Card.Title>
												</div>
												<div className="icon-big text-center icon-warning">
													<i className="nc-icon nc-money-coins"></i>
												</div>
											</div>
										</Card.Body>
									</Card>
								</Link>
							</Col>
							<Col xl={3} lg={4} sm={6}>
								<Link to="/promo-codes">
									<Card className="card-stats">
										<Card.Body>
											<div className="d-flex">
												<div className="numbers">
													<p className="card-category">Promo Codes</p>
													<Card.Title as="h4">{data.promos}</Card.Title>
												</div>
												<div className="icon-big text-center icon-warning">
													<i className="nc-icon nc-money-coins"></i>
												</div>
											</div>
										</Card.Body>
									</Card>
								</Link>
							</Col>
						</Row>
						<Row>
							<Col sm={12}>
								<Card className="table-big-boy">
									<Card.Header>
										<div className="d-block d-md-flex align-items-center justify-content-between">
											<h4 className="card-title">Users</h4>
										</div>
									</Card.Header>
									<Card.Body className="table-full-width">
										<div className="table-responsive">
											<Table className="table-bigboy dshbrd-user-table">
												<thead>
													<tr>
														<th className="td-start">#</th>
														<th className="td-name td-name-col">Name</th>
														<th className="td-email-col">Email</th>
														<th className="text-center td-kyc-col">KYC Verified</th>
														<th className="text-center td-created-col">Created At</th>
														{/* <th className="td-actions text-center">Actions</th> */}
													</tr>
												</thead>
												<tbody>
													{
														users && users.length ?
															users.map((user, index) => {
																return (
																	<tr key={index}>
																		<td className="serial-col text-white">{index + 1}</td>
																		<td className="text-white td-name td-name-col">
																			{user.firstName ? user.firstName + ' ' : 'N/A'} {user.firstName && user.lastName ? user.lastName : ''}
																		</td>
																		<td className="td-email-col text-white">
																			{user.email}
																		</td>
																		<td className='text-center td-kyc-col'>
																			<span className={`${user.kycStatus === 3 ? 'bg-success' : 'bg-danger'} text-white px-2 py-1 kyc-badge d-inline-block align-top`}>
																				{user.kycStatus === 3 ? 'YES' : 'NO'}
																			</span>
																		</td>
																		<td className="text-center td-created-col text-white">{moment(user.createdAt).format('DD MMM YYYY')}</td>
																		{/* <td className="td-actions text-center">
																			<ul className="list-unstyled mb-0">
																				<li className="d-inline-block align-top">
																					<OverlayTrigger overlay={<Tooltip id="tooltip-897993903">View</Tooltip>} placement="left" >
																						<Button
																							className="btn-link btn-icon"
																							type="button"
																							variant="info"
																							onClick={() => setModal(3, user._id)}
																						>
																							<i className="fas fa-eye"></i>
																						</Button>
																					</OverlayTrigger>
																				</li>
																			</ul>
																		</td> */}
																	</tr>
																)
															})
															:
															<tr>
																<td colSpan="5" className="text-center">
																	<div className="alert alert-info" role="alert">No User Found</div>
																</td>
															</tr>
													}
												</tbody>
											</Table>
										</div>
										{
											<div className="text-right px-3 py-4">
												<Link to="/users" className="btn-filled">View All Users</Link>
											</div>
										}
									</Card.Body>
								</Card>
							</Col>
						</Row>
						{
							modalType > 0 && user &&
							<Modal className="modal-primary" onHide={() => setUserModal(!userModal)} show={userModal}>
								<Modal.Header className="justify-content-center">
									<Row>
										<div className="col-12">
											<h4 className="mb-0 mb-md-3 mt-0">
												{modalType === 1 ? 'Add' : modalType === 2 ? 'Edit' : ''} User
											</h4>
										</div>
									</Row>
								</Modal.Header>
								<Modal.Body>
									<Form className="text-left">
										<Form.Group>
											<label className="label-font mr-2">Profile Image: </label>
											<div>
												<div className="user-view-image">
													<img src={user.profileImage ? user.profileImage : userDefaultImg} />
												</div>
											</div>
										</Form.Group>
										<div className="d-flex name-email">
											<Form.Group className="flex-fill d-flex align-items-center">
												<label className="label-font mr-2">Username: </label><span className="field-value text-white">{user.username}</span>
											</Form.Group>
										</div>
										{/* <div className="d-flex name-email">
											<Form.Group className="flex-fill">
												<label className="label-font mr-2">Email: </label><span className="field-value">{user.email}</span>
											</Form.Group>
										</div> */}
										{/* <div className="d-flex name-email">
											<Form.Group>
												<label className="label-font mr-2">Status: </label><span className="field-value">{user.emailVerified ? 'Verified' : 'Unverified'}</span>
											</Form.Group>
										</div> */}
										<div className="d-flex name-email">
											<Form.Group className="d-flex">
												<label className="label-font mr-2">Description:</label><span className="field-value text-white"> {user.description ? user.description : 'N/A'}</span>
											</Form.Group>
										</div>
										<div className="d-flex name-email align-items-center">
											<Form.Group className="d-flex align-items-center">
												<label className="label-font mr-2">Facebook: </label><span className="field-value text-white">{user.facebookLink ? user.facebookLink : 'N/A'}</span>
											</Form.Group>
										</div>
										<div className="d-flex name-email align-items-center">
											<Form.Group className="d-flex align-items-center">
												<label className="label-font mr-2">Twitter: </label><span className="field-value text-white">{user.twitterLink ? user.twitterLink : 'N/A'}</span>
											</Form.Group>
										</div>
										<div className="d-flex name-email align-items-center">
											<Form.Group className="d-flex align-items-center">
												<label className="label-font mr-2">G Plus: </label><span className="field-value text-white">{user.gPlusLink ? user.gPlusLink : 'N/A'}</span>
											</Form.Group>
										</div>
										<div className="d-flex name-email align-items-center">
											<Form.Group className="d-flex align-items-center">
												<label className="label-font mr-2">Vine: </label><span className="field-value text-white">{user.vineLink ? user.vineLink : 'N/A'}</span>
											</Form.Group>
										</div>
									</Form>
								</Modal.Body>

								<Modal.Footer>
									<Button className="outline-button" onClick={() => setUserModal(!userModal)}>Close</Button>
								</Modal.Footer>
							</Modal>
						}
					</Container>
			}
		</div>
	);
}

const mapStateToProps = state => ({
	dashboard: state.dashboard,
	user: state.user,
	error: state.error,
});

export default connect(mapStateToProps, { beforeDashboard, getDashboard, beforeUser, getUsers, deleteUser })(Dashboard);

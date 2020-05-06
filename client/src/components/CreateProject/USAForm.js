import React, { useState, useEffect } from "react"
import { Mutation } from "react-apollo"
import { Typography, MenuItem, InputLabel } from "@material-ui/core"
import withStyles from "@material-ui/core/styles/withStyles"
import FormControl from "@material-ui/core/FormControl"
import TextField from "@material-ui/core/TextField"
import Select from "@material-ui/core/Select"
import Button from "@material-ui/core/Button"
import CircularProgress from "@material-ui/core/CircularProgress"
import Error from "../Shared/Error"
import Loading from "../Shared/Loading"
import { GET_PROJECTS_QUERY } from "../../queries"
import { CREATE_PROJECT_MUTATION } from "../../mutations"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import Slide from "@material-ui/core/Slide"
import { stateCodes, streetCodes } from "../../utils/locationCodes"
import { projectTypes } from "../../utils/projectTypes"

function Transition(props) {
	return <Slide direction="up" {...props} />
}

const USAForm = ({ classes, country }) => {
	const [title, setTitle] = useState(
		"We'll generate this once you provide a project type and location.",
	)
	const [projectType, setProjectType] = useState("")
	const [address1Text, setAddress1Text] = useState("")
	const [address1Suffix, setAddress1Suffix] = useState("St")
	const [address1, setAddress1] = useState(address1Text + address1Suffix)
	const [address2, setAddress2] = useState("")
	const [city, setCity] = useState("")
	const [state, setStateRegion] = useState("CT")
	const [zipcode, setZipcode] = useState("")
	const [fundingGoal, setFundingGoal] = useState(100000)
	//const [borrowRate, setBorrowRate] = useState(15)
	const [borrowRate] = useState(15)
	//const [borrowTerm, setBorrowTerm] = useState(12)
	const [borrowTerm] = useState(12)
	const [borrowFee, setBorrowFee] = useState(0)
	const [originationFee, setOriginationFee] = useState(0)
	//const [applicationFee, setApplicationFee] = useState(500)
	const [applicationFee] = useState(500)
	const [loanTotal, setLoanTotal] = useState(fundingGoal + applicationFee + originationFee)
	const [description, setDescription] = useState("")
	const [submitting, setSubmitting] = useState(false)
	const [open, setOpen] = useState(false)

	const handleSubmit = (event, createProject) => {
		event.preventDefault()
		setSubmitting(true)
		createProject({
			variables: {
				title,
				projectType,
				address1,
				address2,
				city,
				state,
				country,
				zipcode,
				fundingGoal,
				borrowRate,
				borrowTerm,
				originationFee,
				applicationFee,
				loanTotal,
				description,
			},
		})
	}

	const handleUpdateCache = (cache, { data: { createProject } }) => {
		const data = cache.readQuery({ query: GET_PROJECTS_QUERY })
		const projects = data.projects.concat(createProject.project)
		cache.writeQuery({ query: GET_PROJECTS_QUERY, data: { projects } })
	}

	const calculateFunding = event => {
		event.preventDefault()
		setFundingGoal(parseInt(event.target.value))
	}

	useEffect(() => {
		setAddress1(`${address1Text} ${address1Suffix}`)
		setOriginationFee((fundingGoal * 3) / 100)
		setBorrowFee((fundingGoal * borrowRate) / 100)
		setLoanTotal(fundingGoal + applicationFee + originationFee + borrowFee)
		if (projectType && city) {
			setTitle(`${projectType} in ${city}, ${state}`)
		}
	}, [fundingGoal, applicationFee, originationFee, borrowFee, borrowRate, projectType, city, state])

	return (
		<>
			<Typography variant="h2" gutterBottom>
				Project in the United States
			</Typography>
			<Mutation
				mutation={CREATE_PROJECT_MUTATION}
				onCompleted={data => {
					console.log({ data })
					setSubmitting(false)
					setTitle("We'll generate this once you provide more a project type and location.")
					setProjectType("")
					setAddress1("")
					setAddress2("")
					setCity("")
					setStateRegion("")
					setZipcode("")
					setFundingGoal(100000)
					setOriginationFee(0)
					setBorrowFee(0)
					setLoanTotal(fundingGoal + applicationFee + originationFee)
					setDescription("")
					setOpen(true)
				}}
				update={handleUpdateCache}
				// refetchQueries={() => [{ query: GET_PROJECTS_QUERY }]}
			>
				{(createProject, { loading, error }) => {
					if (loading) return <Loading />
					if (error) return <Error error={error} />

					return (
						<form onSubmit={event => handleSubmit(event, createProject)}>
							<FormControl fullWidth>
								<TextField
									disabled
									label="Title"
									placeholder="We'll generate this once you provide more info."
									className={classes.textField}
									//onChange={event => setTitle(event.target.value)}
									value={title}
								/>
							</FormControl>
							<FormControl fullWidth>
								<InputLabel htmlFor="projectType">Project Type</InputLabel>
								<Select
									required
									label="Project Type"
									placeholder="Project Type"
									className={classes.textField}
									onChange={event => setProjectType(event.target.value)}
									inputProps={{ id: "projectType" }}
									value={projectType}
								>
									{projectTypes.map(projectType => {
										return (
											<MenuItem key={projectType} value={projectType}>
												{projectType}
											</MenuItem>
										)
									})}
								</Select>
							</FormControl>
							<FormControl>
								<TextField
									required
									label="Street Name"
									placeholder="Street Name"
									className={classes.textField}
									onChange={event => setAddress1Text(event.target.value)}
									value={address1Text}
								/>
							</FormControl>
							<FormControl>
								<InputLabel htmlFor="suffix">Suffix</InputLabel>
								<Select
									required
									label="Suffix"
									placeholder="Suffix"
									className={classes.textField}
									onChange={event => setAddress1Suffix(event.target.value)}
									inputProps={{ id: "suffix" }}
									value={address1Suffix}
								>
									{streetCodes.map(streetCode => {
										return (
											<MenuItem key={streetCode} value={streetCode}>
												{streetCode}
											</MenuItem>
										)
									})}
								</Select>
							</FormControl>
							<FormControl>
								<TextField
									label="Address 2"
									placeholder="Address 2"
									className={classes.textField}
									onChange={event => setAddress2(event.target.value)}
									value={address2}
								/>
							</FormControl>
							<FormControl>
								<TextField
									required
									label="City"
									placeholder="City"
									className={classes.textField}
									onChange={event => setCity(event.target.value)}
									value={city}
								/>
							</FormControl>
							<FormControl>
								<InputLabel htmlFor="state">State</InputLabel>
								<Select
									required
									label="State"
									placeholder="State"
									className={classes.textField}
									onChange={event => setStateRegion(event.target.value)}
									inputProps={{ id: "state" }}
									value={state}
								>
									{stateCodes.map(stateCode => {
										return (
											<MenuItem key={stateCode} value={stateCode}>
												{stateCode}
											</MenuItem>
										)
									})}
								</Select>
							</FormControl>
							<FormControl>
								<TextField
									label="Zipcode"
									placeholder="Zipcode"
									className={classes.textField}
									onChange={event => setZipcode(event.target.value)}
									value={zipcode}
								/>
							</FormControl>
							<FormControl fullWidth>
								<TextField
									required
									type="number"
									label="Funding Goal"
									placeholder="Funding Goal"
									className={classes.textField}
									onChange={calculateFunding}
									value={fundingGoal}
								/>
							</FormControl>
							<FormControl>
								<TextField
									disabled
									type="number"
									label="Loan Term (Months)"
									placeholder="Loan Term"
									className={classes.textField}
									value={borrowTerm}
								/>
							</FormControl>
							<FormControl>
								<TextField
									disabled
									type="number"
									label="Interest Rate"
									placeholder="Interest Rate"
									className={classes.textField}
									value={borrowRate}
								/>
							</FormControl>
							<FormControl>
								<TextField
									disabled
									type="number"
									label="Interest Rate Total"
									placeholder="Interest Rate Total"
									className={classes.textField}
									value={borrowFee}
								/>
							</FormControl>
							<FormControl>
								<TextField
									disabled
									type="number"
									label="Origination Fee"
									placeholder="Origination Fee"
									className={classes.textField}
									value={originationFee}
								/>
							</FormControl>
							<FormControl>
								<TextField
									disabled
									type="number"
									label="Application Fee"
									placeholder="Application Fee"
									className={classes.textField}
									value={applicationFee}
								/>
							</FormControl>
							<FormControl>
								<TextField
									disabled
									type="number"
									label="Loan Total"
									placeholder="Loan Total"
									className={classes.loanTotal}
									value={loanTotal}
								/>
							</FormControl>
							<FormControl fullWidth>
								<TextField
									multiline
									rows="2"
									label="Description"
									placeholder="Description"
									className={classes.textField}
									onChange={event => setDescription(event.target.value)}
									value={description}
								/>
							</FormControl>
							{/* <Button disabled={submitting} className={classes.cancel} onClick={() => setOpen(false)}>Cancel</Button> */}
							<Button
								variant="contained"
								color="secondary"
								type="submit"
								onClick={() => {}}
								className={classes.save}
								disabled={submitting}
							>
								{submitting ? (
									<CircularProgress className={classes.save} size={24} />
								) : (
									"Add Project"
								)}
							</Button>
						</form>
					)
				}}
			</Mutation>

			{/* Success Dialog */}
			<Dialog open={open} disableBackdropClick={true} TransitionComponent={Transition}>
				<DialogTitle>New Project</DialogTitle>
				<DialogContent>
					<DialogContentText>Project successfully created.</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button color="primary" variant="contained" onClick={() => setOpen(false)}>
						Great!
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

const styles = theme => ({
	container: {
		display: "flex",
		flexWrap: "wrap",
	},
	dialog: {
		margin: "0 auto",
		maxWidth: 550,
	},
	textField: {
		margin: theme.spacing(1),
	},
	loanTotal: {
		margin: theme.spacing(1),
		fontSize: "2rem",
	},
	cancel: {
		color: "red",
	},
	save: {
		display: "block",
		margin: "0 auto",
		color: "white",
		fontSize: "1.3rem",
		marginTop: theme.spacing(3),
	},
	button: {
		margin: theme.spacing(2),
	},
	icon: {
		marginLeft: theme.spacing(1),
	},
	input: {
		display: "none",
	},
	fab: {
		position: "fixed",
		bottom: theme.spacing(2),
		right: theme.spacing(2),
		zIndex: "200",
	},
})

export default withStyles(styles)(USAForm)

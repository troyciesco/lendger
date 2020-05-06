import React, { useContext } from "react"
import { Link } from "react-router-dom"
import withStyles from "@material-ui/core/styles/withStyles"
import Typography from "@material-ui/core/Typography"
import formatMoney from "../utils/formatMoney"
import {
	Grid,
	ExpansionPanel,
	ExpansionPanelSummary,
	ExpansionPanelDetails,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	CardMedia,
	Card,
} from "@material-ui/core"
import { UserContext } from "../App"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import { getRandomInt } from "../utils/getRandomInt"

const MyLoansList = ({ classes }) => {
	const currentUser = useContext(UserContext)
	let userLoanedProjects = currentUser.loanSet.map(loan => loan.project)
	let uniqueLoanedProjects = userLoanedProjects.filter((id, index, array) =>
		array.indexOf(id) === index ? id : "",
	)
	let loanids = currentUser.loanSet.map(loan => loan.id)
	return (
		<div className={classes.root}>
			{userLoanedProjects.length === 0 && (
				<Typography>You haven't submitted a loan to any projects yet.</Typography>
			)}

			{uniqueLoanedProjects.map(project => {
				let myLoans = project.loans.filter(loan => loanids.includes(loan.id))
				const loanTotal = myLoans.reduce((acc, loan) => acc + loan.loanAmt, 0)
				return (
					<ExpansionPanel key={project.id}>
						<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
							<div style={{ display: "flex", flexDirection: "column" }}>
								<Typography variant="h5" color="primary">
									{project.city}, {project.state} {project.country}
								</Typography>
								<Typography variant="body1">{project.address1}</Typography>
							</div>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							<Grid style={{ width: "100%" }}>
								<Card className={classes.card} elevation={4}>
									<CardMedia
										className={classes.media}
										image={`https://lendger-homes.s3.amazonaws.com/${getRandomInt()}.jpg`}
									/>
								</Card>
								<Link to={`projects/${project.id}`}>
									<Typography align="center" paragraph>
										Go to project page.
									</Typography>
								</Link>
								<Typography align="center" paragraph>
									{project.description}
								</Typography>
								<Typography variant="h6" align="center">
									Loans by {currentUser.username}:
								</Typography>
								<Typography variant="body1" color="secondary" align="center">
									{formatMoney(loanTotal)}
								</Typography>
							</Grid>
							<Grid container>
								<div style={{ width: "100%" }}>
									<Typography variant="h6" align="center">
										My Loan History
									</Typography>
								</div>
								<Table>
									<TableHead>
										<TableRow>
											<TableCell>Loan ID</TableCell>
											<TableCell>Loan Amount</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{myLoans.map(loan => {
											return (
												<TableRow key={loan.id}>
													<TableCell>{loan.id}</TableCell>
													<TableCell>{formatMoney(loan.loanAmt)}</TableCell>
												</TableRow>
											)
										})}
									</TableBody>
								</Table>
							</Grid>
						</ExpansionPanelDetails>
					</ExpansionPanel>
				)
			})}
		</div>
	)
}

const styles = {
	root: {
		width: "100%",
	},
	details: {
		alignItems: "center",
	},
	link: {
		color: "#424242",
		textDecoration: "none",
		"&:hover": {
			color: "black",
		},
	},
	card: {
		width: "75%",
		margin: "0 auto",
		marginBottom: "2rem",
	},
	media: {
		height: 0,
		paddingTop: "56.25%",
	},
}

export default withStyles(styles)(MyLoansList)

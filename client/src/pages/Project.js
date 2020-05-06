import React, { useEffect } from "react"
import withStyles from "@material-ui/core/styles/withStyles"
import { Typography, Card, CardMedia, Grid } from "@material-ui/core"
import { Counter } from "../utils/Counter"
import formatMoney from "../utils/formatMoney"
import CreateLoan from "../components/CreateLoan"
import CreateQuestion from "../components/CreateQuestion"
import { getRandomInt } from "../utils/getRandomInt"
import gmap from "../img/gmaps.png"

const styles = theme => ({
	pageTitle: {
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
	},
	media: {
		height: 0,
		paddingTop: "56.25%",
	},
})

const Project = ({ classes, match, projects }) => {
	let myProjects = projects.filter(project => project.id === match.params.projectId)
	let project = myProjects[0]
	let rating = "B"
	let createdDate = new Date(project.createdAt)
	let projectCreation = `${createdDate.getMonth()}/${createdDate.getDate()}/${createdDate.getFullYear()}`
	let ARV = project.loanTotal / 0.65
	let loanToARV = (project.loanTotal / ARV) * 100
	let borrowerContribution = project.loanTotal * 0.12
	let totalProjectCost = project.loanTotal + borrowerContribution
	let loanToTotalProjectCost = (project.loanTotal / totalProjectCost) * 100

	const loanedTotal = project.loans.reduce((acc, loan) => acc + loan.loanAmt, 0)

	let numberOfLoans = project.loans.map(loan => loan.user.id)
	let uniqueLenders = numberOfLoans.filter((id, index, array) =>
		array.indexOf(id) === index ? id : "",
	)

	const numberOfLenders = new Counter()
	numberOfLenders.add(uniqueLenders)
	console.log(numberOfLenders.count)

	let num = numberOfLenders.count

	const inquiries = project.inquirySet

	useEffect(() => {
		window.scrollTo(0, 0)
	})
	return (
		<div>
			<img
				src={`https://lendger-homes.s3.amazonaws.com/flags/${project.country}.png`}
				alt={project.country}
				style={{ width: "50px", height: "auto" }}
			/>
			<Typography className={classes.pageTitle} variant="h3">
				{project.title}
			</Typography>
			<Typography variant="h5" gutterBottom>
				Created by {project.createdBy.username} on {projectCreation}
			</Typography>
			<Card>
				<CardMedia
					className={classes.media}
					image={`https://lendger-homes.s3.amazonaws.com/${getRandomInt()}.jpg`}
				/>
			</Card>
			<Grid container spacing={4} style={{ marginTop: "15px", marginBottom: "15px" }}>
				<Grid item xs={3}>
					<Typography variant="h6" align="center" gutterBottom>
						Project Rating
					</Typography>
					<Typography align="center">{rating}</Typography>
				</Grid>
				<Grid item xs={3}>
					<Typography variant="h6" align="center" gutterBottom>
						Interest Rate
					</Typography>
					<Typography align="center">{project.borrowRate - 3}%</Typography>
				</Grid>
				<Grid item xs={3}>
					<Typography variant="h6" align="center" gutterBottom>
						Term
					</Typography>
					<Typography align="center">{project.borrowTerm} Months</Typography>
				</Grid>
				<Grid item xs={3}>
					<Typography variant="h6" align="center" gutterBottom>
						Loan to ARV
					</Typography>
					<Typography align="center">{loanToARV}%</Typography>
				</Grid>
			</Grid>
			<CreateLoan project={project} />
			<Grid container spacing={4} style={{ marginTop: "15px" }}>
				<Grid item xs={8}>
					<Typography paragraph>
						Borrower contribution is {formatMoney(borrowerContribution)}
					</Typography>
					<Typography paragraph>Total project cost is {formatMoney(totalProjectCost)}</Typography>
					<Typography paragraph>ARV is {formatMoney(ARV)}</Typography>
					<Typography paragraph>
						Loan to total project cost is {loanToTotalProjectCost.toFixed(2)}%
					</Typography>
					<Typography style={{ marginTop: "30px" }} gutterBottom>
						The loan requested is {formatMoney(project.loanTotal)}. The borrower has received{" "}
						{formatMoney(loanedTotal)} so far from {num} total lender(s).
					</Typography>
					<Typography variant="h5">Description</Typography>
					<Typography style={{ marginTop: "30px" }} paragraph>
						{project.description}
					</Typography>
					<Typography variant="h5">Strategy &amp; Vision</Typography>
					<Typography style={{ marginTop: "30px" }} paragraph>
						{project.description}
					</Typography>
					<Typography variant="h5">Exit Strategy</Typography>
					<Typography style={{ marginTop: "30px" }} paragraph>
						{project.description}
					</Typography>
					<Typography variant="h5">Additional Information</Typography>
					<Typography style={{ marginTop: "30px" }} paragraph>
						{project.description}
					</Typography>
					<Typography variant="h5">Map</Typography>
					<img src={gmap} alt="map" style={{ width: "100%", height: "auto" }} />
				</Grid>
				<Grid item xs={4} style={{ background: "#dadbdb" }}>
					<div>
						<Typography variant="h4" align="center" gutterBottom>
							Tiers for This Project
						</Typography>
						<div>
							<Typography variant="h6">0 - 1,000 LNAT</Typography>
							<Typography variant="body1">0% Bonus</Typography>
						</div>
						<div>
							<Typography variant="h6">1,000+ - 2,000 LNAT</Typography>
							<Typography variant="body1">1% Bonus</Typography>
						</div>
						<div>
							<Typography variant="h6">2,000+ - 3,000 LNAT</Typography>
							<Typography variant="body1">2% Bonus</Typography>
						</div>
						<div>
							<Typography variant="h6">3,000+ - 4,000 LNAT</Typography>
							<Typography variant="body1">3% Bonus</Typography>
						</div>
					</div>
					<Typography variant="h4" align="center" gutterBottom>
						Q and As
					</Typography>
					{inquiries.map(inquiry => {
						return (
							inquiry.isAnswered && (
								<div key={inquiry.id}>
									<Typography variant="h6">{inquiry.question}</Typography>
									<Typography variant="body1">{inquiry.answer}</Typography>
								</div>
							)
						)
					})}
					<CreateQuestion project={project} />
					<div>
						<Typography variant="h4" align="center" gutterBottom>
							Borrower Profile
						</Typography>
						<div>
							<Typography variant="h6">Name</Typography>
							<Typography variant="body1">John Doe</Typography>
						</div>
						<div>
							<Typography variant="h6">Experience</Typography>
							<Typography variant="body1">5 Years</Typography>
						</div>
						<div>
							<Typography variant="h6">Projects Completed</Typography>
							<Typography variant="body1">4</Typography>
						</div>
						<div>
							<Typography variant="h6">Projects Active</Typography>
							<Typography variant="body1">2</Typography>
						</div>
					</div>
					<div>
						<Typography variant="h4" align="center" gutterBottom>
							Important Docs
						</Typography>
						<Typography variant="body1" color="primary">
							Agreement
						</Typography>
						<Typography variant="body1" color="primary">
							Deed
						</Typography>
						<Typography variant="body1" color="primary">
							Terms &amp; Conditions
						</Typography>
					</div>
				</Grid>
			</Grid>
		</div>
	)
}

export default withStyles(styles)(Project)

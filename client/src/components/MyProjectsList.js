import React, { useContext } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import withStyles from "@material-ui/core/styles/withStyles"
import Typography from "@material-ui/core/Typography"
import formatMoney from "../utils/formatMoney"
import { Grid, CardMedia, Card, CardContent, Divider } from "@material-ui/core"
import { UserContext } from "../App"
import { getRandomInt } from "../utils/getRandomInt"

const MyProjectsList = ({ classes }) => {
	const currentUser = useContext(UserContext)
	const myProjects = currentUser.projectSet
	return (
		<Grid container spacing={4}>
			{myProjects.length === 0 && <Typography>You don't have any projects yet.</Typography>}

			{myProjects.map(project => {
				const loanTotal = project.loans.reduce((acc, loan) => acc + loan.loanAmt, 0)
				const fundingProgress = (loanTotal / project.fundingGoal) * 100
				const StyledFunding = styled.div`
					background: linear-gradient(
						to right,
						#4caf50 ${props => props.fundingProgress}%,
						white ${props => props.fundingProgress}%
					);
				`
				let createdDate = new Date(project.createdAt)
				let deadlineDate = new Date("2019/06/01")
				let timeLeftMilli = Math.abs(deadlineDate - createdDate)
				let timeLeftDays = (timeLeftMilli / 86400000).toFixed()
				return (
					<Grid item xs={4} key={project.id}>
						<Card elevation={4}>
							<CardContent>
								<Link to={`projects/${project.id}`}>
									<Typography variant="h5" color="primary">
										{project.city}, {project.state} {project.country}
									</Typography>
								</Link>
							</CardContent>
							<Divider />
							<CardMedia
								className={classes.media}
								image={`https://lendger-homes.s3.amazonaws.com/${getRandomInt()}.jpg`}
							/>
							<CardContent
								style={{
									height: "135px",
									overflow: "hidden",
									textOverflow: "ellipsis",
									maxHeight: "120px",
								}}
							>
								<Typography variant="body1" gutterBottom>
									{project.address1}
								</Typography>
								<Typography paragraph>{project.description}</Typography>
							</CardContent>
							{loanTotal >= project.fundingGoal ? (
								<>
									<CardContent>
										<Typography paragraph color="textPrimary" align="center">
											Fully Funded!
										</Typography>
									</CardContent>
									<Divider />
									<StyledFunding fundingProgress={fundingProgress}>
										<Typography variant="h6" color="textPrimary" align="center">
											{formatMoney(project.fundingGoal)}
										</Typography>
									</StyledFunding>
								</>
							) : (
								<>
									<CardContent>
										<Typography paragraph align="center">
											Funding Closes in {timeLeftDays} Days
										</Typography>
									</CardContent>
									<Divider />
									<StyledFunding fundingProgress={fundingProgress}>
										<Typography variant="h6" color="textPrimary" align="center">
											{formatMoney(loanTotal)} of {formatMoney(project.fundingGoal)}
										</Typography>
									</StyledFunding>
								</>
							)}
						</Card>
					</Grid>
				)
			})}
		</Grid>
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

export default withStyles(styles)(MyProjectsList)

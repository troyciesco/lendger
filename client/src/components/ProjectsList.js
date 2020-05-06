import React from "react"
import { Link } from "react-router-dom"
import withStyles from "@material-ui/core/styles/withStyles"
import styled from "styled-components"
import Typography from "@material-ui/core/Typography"
import formatMoney from "../utils/formatMoney"
import { Grid, Card, CardContent, Divider, CardMedia } from "@material-ui/core"
import { getRandomInt } from "../utils/getRandomInt"
//import { UserContext } from '../App'

const ProjectsList = ({ classes, projects, match }) => {
	//const currentUser = useContext(UserContext)
	return (
		<Grid container spacing={4}>
			{projects.length === 0 && (
				<Typography>There aren't any projects available right now.</Typography>
			)}
			{projects.map(project => {
				const loanedTotal = project.loans.reduce((acc, loan) => acc + loan.loanAmt, 0)
				const fundingProgress = (loanedTotal / project.loanTotal) * 100
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
								<Link to={`${match.url}/${project.id}`}>
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
							{loanedTotal >= project.loanTotal ? (
								<>
									<CardContent>
										<Typography paragraph color="textPrimary" align="center">
											Fully Funded!
										</Typography>
									</CardContent>
									<Divider />
									<StyledFunding fundingProgress={fundingProgress}>
										<Typography variant="h6" color="textPrimary" align="center">
											{formatMoney(project.loanTotal)}
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
											{formatMoney(loanedTotal)} of {formatMoney(project.loanTotal)}
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
		display: "flex",
		flexWrap: "wrap",
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
	media: {
		height: 0,
		paddingTop: "56.25%",
	},
}

export default withStyles(styles)(ProjectsList)

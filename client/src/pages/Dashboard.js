import React, { useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import { Query } from "react-apollo"
import { Typography } from "@material-ui/core"
import { UserContext } from "../App"
import Loading from "../components/Shared/Loading"
import Error from "../components/Shared/Error"
import withStyles from "@material-ui/core/styles/withStyles"
import { IS_LOGGED_IN_QUERY } from "../queries"
import { GET_ALL_PROJECTS_QUERY } from "../queries"
import Auth from "../components/Auth"
import {
	Grid,
	ExpansionPanel,
	ExpansionPanelSummary,
	ExpansionPanelDetails,
	CardMedia,
	Card,
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import house from "../img/house.jpg"
import UpdateProjectStatus from "../components/UpdateProjectStatus"

const styles = theme => ({
	container: {
		margin: "0 auto",
		maxWidth: 960,
		padding: theme.spacing(2),
	},
	pageTitle: {
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
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
	textField: {
		margin: theme.spacing(1),
	},
	save: {
		display: "block",
		margin: "0 auto",
		color: "white",
		fontSize: "1.3rem",
		marginTop: theme.spacing(3),
	},
})

const Dashboard = ({ classes }) => {
	useEffect(() => {
		window.scrollTo(0, 0)
	})
	const currentUser = useContext(UserContext)
	return (
		<Query query={IS_LOGGED_IN_QUERY} currentUser={currentUser}>
			{({ data }) =>
				data.isLoggedIn ? (
					currentUser.isUnderwriter ? (
						<div className={classes.container}>
							<div
								style={{
									margin: "0 auto",
									width: "100%",
									paddingTop: "2rem",
									paddingBottom: "2rem",
								}}
							>
								<Typography align="center" variant="h2">
									Hello, {currentUser.username}.
								</Typography>
								<Query query={GET_ALL_PROJECTS_QUERY}>
									{({ data, loading, error }) => {
										if (loading) return <Loading />
										if (error) return <Error error={error} />
										console.log(data)
										const projects = data.projects
										return projects.map(project => {
											return (
												<ExpansionPanel key={project.id}>
													<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
														<div style={{ display: "flex", flexDirection: "column" }}>
															<Typography variant="h5" color="primary">
																{project.title}
															</Typography>
															<Typography variant="h6" color="textPrimary">
																Status: {project.status}
															</Typography>
														</div>
													</ExpansionPanelSummary>
													<ExpansionPanelDetails>
														<Grid style={{ width: "100%" }}>
															<Card className={classes.card} elevation={4}>
																<CardMedia className={classes.media} image={house} />
															</Card>
															<Typography align="center" paragraph>
																{project.address1}, {project.city}, {project.state}{" "}
																{project.country}
															</Typography>
															<Link to={`projects/${project.id}`}>
																<Typography align="center" paragraph>
																	Go to project page.
																</Typography>
															</Link>
														</Grid>
														<Grid container>
															<div style={{ width: "100%" }}>
																<Typography variant="h6" align="center">
																	Change Project Status To:
																</Typography>
																<UpdateProjectStatus project={project} />
															</div>
														</Grid>
													</ExpansionPanelDetails>
												</ExpansionPanel>
											)
										})
									}}
								</Query>
							</div>
						</div>
					) : (
						<div style={{ marginTop: "2rem" }}>
							<Typography>You don't have permission to access this page.</Typography>
						</div>
					)
				) : (
					<Auth />
				)
			}
		</Query>
	)
}

export default withStyles(styles)(Dashboard)

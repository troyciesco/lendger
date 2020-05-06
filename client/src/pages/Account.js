import React, { useContext, useEffect } from "react"
import { Redirect } from "react-router-dom"
import { Query } from "react-apollo"
import { Typography } from "@material-ui/core"
import { UserContext } from "../App"
import MyLoansList from "../components/MyLoansList"
import MyProjectsList from "../components/MyProjectsList"
import withStyles from "@material-ui/core/styles/withStyles"
import { IS_LOGGED_IN_QUERY } from "../queries"
import Auth from "../components/Auth"

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
})

const Account = ({ classes }) => {
	useEffect(() => {
		window.scrollTo(0, 0)
	})
	const currentUser = useContext(UserContext)
	return (
		<Query query={IS_LOGGED_IN_QUERY} currentUser={currentUser}>
			{({ data }) =>
				data.isLoggedIn ? (
					currentUser.isUnderwriter ? (
						<Redirect to="/dashboard" />
					) : (
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
							</div>
							<Typography className={classes.pageTitle} variant="h3" gutterBottom>
								My Loans
							</Typography>
							<MyLoansList />
							<div style={{ marginTop: "2rem" }}>
								<Typography className={classes.pageTitle} variant="h3" gutterBottom>
									My Projects
								</Typography>
								<MyProjectsList />
							</div>
						</div>
					)
				) : (
					<Auth />
				)
			}
		</Query>
	)
}

export default withStyles(styles)(Account)

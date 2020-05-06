import React, { useContext, useEffect } from "react"
import { Query } from "react-apollo"
import { UserContext } from "../App"
import { IS_LOGGED_IN_QUERY } from "../queries"
import { Typography } from "@material-ui/core"
import Auth from "../components/Auth"
import withStyles from "@material-ui/core/styles/withStyles"
import CreateProject from "../components/CreateProject/CreateProject"

const Borrow = ({ classes }) => {
	useEffect(() => {
		window.scrollTo(0, 0)
	})
	const currentUser = useContext(UserContext)
	return (
		<div className={classes.container}>
			<Query query={IS_LOGGED_IN_QUERY}>
				{({ data }) =>
					data.isLoggedIn ? (
						currentUser.isUnderwriter ? (
							<Typography>You can't be a borrower as an underwriter.</Typography>
						) : (
							<CreateProject />
						)
					) : (
						<>
							<Typography>You need to be signed in to create a project.</Typography>
							<Auth />
						</>
					)
				}
			</Query>
		</div>
	)
}

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

export default withStyles(styles)(Borrow)

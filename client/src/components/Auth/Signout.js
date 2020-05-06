import React from "react"
import { ApolloConsumer } from "react-apollo"
import withStyles from "@material-ui/core/styles/withStyles"
import ExitToApp from "@material-ui/icons/ExitToApp"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import { colorDarkGreen } from "../Shared/Styles"

const Signout = ({ classes }) => {
	const handleSignout = client => {
		localStorage.removeItem("authToken")
		client.writeData({ data: { isLoggedIn: false } })
		console.log("signed out user", client)
		client.resetStore()
		window.location.reload()
	}
	return (
		<ApolloConsumer>
			{client => (
				<Button onClick={() => handleSignout(client)}>
					<Typography variant="body1" className={classes.buttonText} style={{ color: "#fafafa" }}>
						Signout
					</Typography>
					<ExitToApp className={classes.buttonIcon} />
				</Button>
			)}
		</ApolloConsumer>
	)
}

const styles = {
	root: {
		cursor: "pointer",
		display: "flex",
	},
	buttonText: {
		fontFamily: "Montserrat",
		fontWeight: 700,
		fontSize: "16px",
	},
	buttonIcon: {
		marginLeft: "5px",
		color: colorDarkGreen,
	},
}

export default withStyles(styles)(Signout)

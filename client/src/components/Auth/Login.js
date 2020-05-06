import React, { useState } from "react"
import { Mutation } from "react-apollo"
import withStyles from "@material-ui/core/styles/withStyles"
import FormControl from "@material-ui/core/FormControl"
import Paper from "@material-ui/core/Paper"
import Input from "@material-ui/core/Input"
import InputLabel from "@material-ui/core/InputLabel"
import Button from "@material-ui/core/Button"
import Error from "../Shared/Error"
import { LOGIN_MUTATION } from "../../mutations"
import { ME_QUERY } from "../../queries"

import * as myStyles from "../Shared/Styles"

const Login = ({ classes, setNewUser }) => {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")

	const handleSubmit = async (event, tokenAuth, client) => {
		event.preventDefault()
		const res = await tokenAuth()
		localStorage.setItem("authToken", res.data.tokenAuth.token)
		client.writeData({ data: { isLoggedIn: true } })
		client.resetStore()
		window.location.reload()
	}

	return (
		<div className={classes.root}>
			<Paper className={classes.paper}>
				<div className={classes.header}>Login</div>

				<div className={classes.info}>
					<Mutation
						mutation={LOGIN_MUTATION}
						variables={{
							username,
							password,
						}}
						onCompleted={data => {
							console.log(data)
						}}
						refetchQueries={() => [{ query: ME_QUERY }]}
					>
						{(tokenAuth, { loading, error, called, client }) => {
							return (
								<form
									onSubmit={event => handleSubmit(event, tokenAuth, client)}
									className={classes.form}
								>
									<FormControl margin="normal" required fullWidth>
										<InputLabel className={classes.reFont} htmlFor="username">
											USERNAME
										</InputLabel>
										<Input
											id="username"
											type="text"
											onChange={event => setUsername(event.target.value)}
										/>
									</FormControl>

									<FormControl margin="normal" required fullWidth>
										<InputLabel className={classes.reFont} htmlFor="password">
											PASSWORD
										</InputLabel>
										<Input
											id="password"
											type="password"
											onChange={event => setPassword(event.target.value)}
										/>
									</FormControl>

									<Button
										type="submit"
										fullWidth
										variant="contained"
										color="primary"
										className={classes.submit}
										disabled={loading || !username.trim() || !password.trim()}
									>
										{loading ? "Logging In..." : "Login"}
									</Button>

									<Button
										fullWidth
										variant="outlined"
										color="secondary"
										onClick={() => setNewUser(true)}
									>
										New User? Register here.
									</Button>

									{/* Error Handling */}
									{error && <Error error={error} />}
								</form>
							)
						}}
					</Mutation>
				</div>
			</Paper>
		</div>
	)
}

const styles = theme => ({
	root: {
		fontFamily: "montserrat",
		width: "auto",
		display: "block",
		marginLeft: theme.spacing(3),
		marginRight: theme.spacing(3),
		[theme.breakpoints.up("md")]: {
			width: 400,
			marginLeft: "auto",
			marginRight: "auto",
		},
	},
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	title: {
		marginTop: theme.spacing(2),
		color: theme.palette.secondary.main,
	},
	header: {
		fontSize: "60px",
		fontVariantCaps: "all-small-caps",
		width: 400,
		height: 100,
		borderRadius: "5px 5px 0 0",
		textAlign: "center",
		backgroundColor: myStyles.colorDarkBG,
		color: "#FAFAFA",
		borderBottom: "10px solid #5298bf",
	},
	info: {
		padding: theme.spacing(3),
	},
	form: {
		width: "100%",
		marginTop: theme.spacing(1),
	},
	reFont: {
		fontFamily: "montserrat",
	},
	submit: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
	},
})

export default withStyles(styles)(Login)

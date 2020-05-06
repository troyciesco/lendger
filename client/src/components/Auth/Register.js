import React, { useState } from "react"
import { Mutation } from "react-apollo"
import withStyles from "@material-ui/core/styles/withStyles"
import FormControl from "@material-ui/core/FormControl"
import Paper from "@material-ui/core/Paper"
import Input from "@material-ui/core/Input"
import InputLabel from "@material-ui/core/InputLabel"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import Slide from "@material-ui/core/Slide"
import VerifiedUserTwoTone from "@material-ui/icons/VerifiedUserTwoTone"
import Error from "../Shared/Error"
import { REGISTER_MUTATION } from "../../mutations"

import * as myStyles from "../Shared/Styles.js"

function Transition(props) {
	return <Slide direction="up" {...props} />
}

const Register = ({ classes, setNewUser }) => {
	const [username, setUsername] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [open, setOpen] = useState(false)

	// const handleSubmit = async (event, createUser) => {
	//   event.preventDefault()
	//   // createUser({ variables: {
	//   //   username: username,
	//   //   email: email,
	//   //   password: password
	//   // }})
	//   const res = await createUser()
	//   console.log({ res })
	//   // setOpen(true)
	// }

	const handleSubmit = (event, createUser) => {
		event.preventDefault()
		createUser()
	}

	return (
		<div className={classes.root}>
			<Paper className={classes.paper}>
				<div className={classes.header}>Register</div>

				<div className={classes.info}>
					<Mutation
						mutation={REGISTER_MUTATION}
						variables={{
							username,
							email,
							password,
						}}
						onCompleted={data => {
							console.log({ data })
							setOpen(true)
						}}
					>
						{(createUser, { loading, error }) => {
							return (
								<form onSubmit={event => handleSubmit(event, createUser)} className={classes.form}>
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
										<InputLabel className={classes.reFont} htmlFor="email">
											EMAIL
										</InputLabel>
										<Input
											id="email"
											type="email"
											onChange={event => setEmail(event.target.value)}
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
										color="secondary"
										className={classes.submit}
										disabled={loading || !username.trim() || !email.trim() || !password.trim()}
									>
										{loading ? "Registering..." : "Register"}
									</Button>

									<Button
										fullWidth
										variant="outlined"
										color="primary"
										onClick={() => setNewUser(false)}
									>
										Previous User? Log in here.
									</Button>

									{/* Error Handling */}
									{error && <Error error={error} />}
								</form>
							)
						}}
					</Mutation>
				</div>
			</Paper>

			{/* Success Dialog */}
			<Dialog open={open} disableBackdropClick={true} TransitionComponent={Transition}>
				<DialogTitle>
					<VerifiedUserTwoTone className={classes.icon} />
					New Account
				</DialogTitle>
				<DialogContent>
					<DialogContentText>User {username} successfully created.</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button color="primary" variant="contained" onClick={() => setNewUser(false)}>
						Login
					</Button>
				</DialogActions>
			</Dialog>
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
	header: {
		fontSize: "60px",
		fontVariantCaps: "all-small-caps",
		width: 400,
		height: 100,
		borderRadius: "5px 5px 0 0",
		textAlign: "center",
		backgroundColor: myStyles.colorDarkBG,
		color: myStyles.colorLight,
		borderBottom: "10px solid #5298bf",
	},
	info: {
		padding: theme.spacing(3),
	},
	title: {
		marginTop: theme.spacing(2),
		color: theme.palette.openTitle,
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
	icon: {
		padding: "0px 2px 2px 0px",
		verticalAlign: "middle",
		color: "green",
	},
})

export default withStyles(styles)(Register)

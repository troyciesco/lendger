import React, { useState } from "react"
import { Typography, MenuItem, InputLabel } from "@material-ui/core"
import withStyles from "@material-ui/core/styles/withStyles"
import FormControl from "@material-ui/core/FormControl"
import Select from "@material-ui/core/Select"
import { countryCodes } from "../../utils/locationCodes"
import USAForm from "./USAForm"
import IREForm from "./IREForm"
import CANForm from "./CANForm"
import ENGForm from "./ENGForm"

const CreateProject = ({ classes }) => {
	const [app, setApp] = useState("")

	return (
		<>
			<Typography variant="h2" gutterBottom>
				Create a Project
			</Typography>
			<FormControl fullWidth>
				<InputLabel htmlFor="country">Please select your country.</InputLabel>
				<Select
					required
					label="Country"
					placeholder="Please select your country."
					className={classes.textField}
					onChange={event => setApp(event.target.value)}
					inputProps={{ id: "country" }}
					value={app}
				>
					{countryCodes.map(countryCode => {
						return (
							<MenuItem key={countryCode} value={countryCode}>
								{countryCode}
							</MenuItem>
						)
					})}
				</Select>
			</FormControl>
			{app === "USA" && <USAForm country={app} />}
			{app === "IRE" && <IREForm country={app} />}
			{app === "CAN" && <CANForm country={app} />}
			{app === "ENG" && <ENGForm country={app} />}
		</>
	)
}

const styles = theme => ({
	container: {
		display: "flex",
		flexWrap: "wrap",
	},
	dialog: {
		margin: "0 auto",
		maxWidth: 550,
	},
	textField: {
		margin: theme.spacing(1),
	},
	loanTotal: {
		margin: theme.spacing(1),
		fontSize: "2rem",
	},
	cancel: {
		color: "red",
	},
	save: {
		display: "block",
		margin: "0 auto",
		color: "white",
		fontSize: "1.3rem",
		marginTop: theme.spacing(3),
	},
	button: {
		margin: theme.spacing(2),
	},
	icon: {
		marginLeft: theme.spacing(1),
	},
	input: {
		display: "none",
	},
	fab: {
		position: "fixed",
		bottom: theme.spacing(2),
		right: theme.spacing(2),
		zIndex: "200",
	},
})

export default withStyles(styles)(CreateProject)

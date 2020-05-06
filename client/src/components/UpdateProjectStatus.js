import React, { useState } from "react"
import { Mutation } from "react-apollo"
import withStyles from "@material-ui/core/styles/withStyles"
import FormControl from "@material-ui/core/FormControl"
import Button from "@material-ui/core/Button"
import CircularProgress from "@material-ui/core/CircularProgress"
import Error from "../components/Shared/Error"
import { ME_QUERY } from "../queries"
import { UPDATE_PROJECT_STATUS_MUTATION } from "../mutations"
import { GET_ALL_PROJECTS_QUERY } from "../queries"
import Loading from "./Shared/Loading"
import { Select, MenuItem } from "@material-ui/core"
//import { FormHelperText } from "@material-ui/core";
// import formatMoney from '../utils/formatMoney'

const styles = theme => ({
	root: {
		color: "red",
	},
	fab: {
		position: "fixed",
		bottom: theme.spacing(2),
		right: theme.spacing(2),
		zIndex: "200",
	},
	saveButton: {
		display: "block",
		margin: "0 auto",
		color: "white",
		fontSize: "1.3rem",
		marginTop: theme.spacing(3),
	},
	cancel: {
		color: "red",
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

const UpdateProjectStatus = ({ classes, project }) => {
	const [projectId, setProjectId] = useState(project.id)
	const [status, setStatus] = useState(project.status)
	const [submitting, setSubmitting] = useState(false)
	const statusCodes = ["Approved", "Pending", "Denied"]

	const handleSubmit = (event, updateProject) => {
		event.preventDefault()
		setSubmitting(true)
		updateProject({ variables: { projectId, status } })
	}

	return (
		<Mutation
			mutation={UPDATE_PROJECT_STATUS_MUTATION}
			onCompleted={data => {
				console.log({ data })
				setSubmitting(false)
				setProjectId(project.id)
				setStatus(project.status)
			}}
			// update={handleUpdateCache}
			refetchQueries={() => [{ query: GET_ALL_PROJECTS_QUERY }]}
		>
			{(updateProject, { loading, error }) => {
				if (loading) return <Loading />
				if (error) return <Error error={error} />

				return (
					<form onSubmit={event => handleSubmit(event, updateProject)}>
						<FormControl fullWidth>
							<Select
								required
								label="Status"
								placeholder="Status"
								className={classes.textField}
								onChange={event => setStatus(event.target.value)}
								value={status}
							>
								{statusCodes.map(statusCode => {
									return (
										<MenuItem key={statusCode} value={statusCode}>
											{statusCode}
										</MenuItem>
									)
								})}
							</Select>
						</FormControl>
						<Button
							variant="contained"
							color="secondary"
							type="submit"
							onClick={() => {}}
							className={classes.save}
							disabled={submitting}
						>
							{submitting ? (
								<CircularProgress className={classes.save} size={24} />
							) : (
								"Update Status"
							)}
						</Button>
					</form>
				)
			}}
		</Mutation>
	)
}

export default withStyles(styles)(UpdateProjectStatus)

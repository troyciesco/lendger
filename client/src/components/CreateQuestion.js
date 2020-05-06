import React, { useState, useContext, useEffect } from "react"
import { Query, Mutation } from "react-apollo"
import withStyles from "@material-ui/core/styles/withStyles"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import FormControl from "@material-ui/core/FormControl"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import CircularProgress from "@material-ui/core/CircularProgress"
import { UserContext } from "../App"
import Error from "../components/Shared/Error"
import { ME_QUERY } from "../queries"
import { CREATE_QUESTION_MUTATION } from "../mutations"
import { GET_PROJECTS_QUERY, IS_LOGGED_IN_QUERY } from "../queries"
import Auth from "../components/Auth"
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
	save: {
		color: "green",
	},
})

const CreateQuestion = ({ classes, project }) => {
	const [open, setOpen] = useState(false)
	const [projectId, setProjectId] = useState(project.id)
	const [question, setQuestion] = useState("")
	const [submitting, setSubmitting] = useState(false)
	const [isMyProject, setIsMyProject] = useState(false)

	const currentUser = useContext(UserContext)

	useEffect(() => {
		let myProjects
		if (currentUser) {
			myProjects = currentUser.projectSet.map(project => project.id)
			let isMyProject = myProjects.includes(projectId)
			setIsMyProject(isMyProject)
		}
	}, [projectId, currentUser])

	const handleSubmit = (event, createQandA) => {
		event.preventDefault()
		setSubmitting(true)
		createQandA({ variables: { projectId, question } })
	}

	// const handleUpdateCache = (cache, {data: { createProject }}) => {
	//   const data = cache.readQuery({ query: GET_PROJECTS_QUERY })
	//   const projects = data.projects.concat(createProject.project)
	//   cache.writeQuery({ query: GET_PROJECTS_QUERY, data: { projects } })
	// }

	return (
		<>
			<Button
				onClick={() => setOpen(true)}
				className={classes.saveButton}
				variant="contained"
				color="primary"
			>
				{open ? "Inquiring..." : "Ask a Question"}
			</Button>
			<Mutation
				mutation={CREATE_QUESTION_MUTATION}
				onCompleted={data => {
					console.log({ data })
					setSubmitting(false)
					setOpen(false)
					setProjectId("")
					setQuestion("")
				}}
				// update={handleUpdateCache}
				refetchQueries={() => [{ query: ME_QUERY }, { query: GET_PROJECTS_QUERY }]}
			>
				{(createLoan, { loading, error }) => {
					if (error) return <Error error={error} />

					return (
						<Dialog open={open} className={classes.dialog}>
							<Query query={IS_LOGGED_IN_QUERY} currentUser={currentUser}>
								{({ data }) =>
									data.isLoggedIn ? (
										<>
											{isMyProject || currentUser.isUnderwriter ? (
												<>
													<DialogTitle>Action not allowed!</DialogTitle>
													<DialogActions>
														<Button
															disabled={submitting}
															className={classes.cancel}
															onClick={() => setOpen(false)}
														>
															Cancel
														</Button>
													</DialogActions>
												</>
											) : (
												<form onSubmit={event => handleSubmit(event, createLoan)}>
													<DialogTitle>Ask a Question</DialogTitle>
													<DialogContent>
														<FormControl required fullWidth>
															<TextField
																label="Project"
																placeholder="Project"
																className={classes.textField}
																value={project.title}
															/>
														</FormControl>
														<FormControl fullWidth>
															<TextField
																label="Question"
																placeholder="Ask a question..."
																multiline
																rows="4"
																margin="normal"
																variant="filled"
																className={classes.textField}
																onChange={event => setQuestion(event.target.value)}
																value={question}
															/>
														</FormControl>
													</DialogContent>
													<DialogActions>
														<Button
															disabled={submitting}
															className={classes.cancel}
															onClick={() => setOpen(false)}
														>
															Cancel
														</Button>
														<Button type="submit" className={classes.save} disabled={submitting}>
															{submitting ? (
																<CircularProgress className={classes.save} size={24} />
															) : (
																"Ask Question"
															)}
														</Button>
													</DialogActions>
												</form>
											)}
										</>
									) : (
										<>
											<DialogTitle>You need to be logged in to lend.</DialogTitle>
											<Auth />
											<DialogActions>
												<Button
													disabled={submitting}
													className={classes.cancel}
													onClick={() => setOpen(false)}
												>
													Cancel
												</Button>
											</DialogActions>
										</>
									)
								}
							</Query>
						</Dialog>
					)
				}}
			</Mutation>
		</>
	)
}

export default withStyles(styles)(CreateQuestion)

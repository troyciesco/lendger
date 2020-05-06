import React, { useEffect, useState } from "react"
import { Route } from "react-router-dom"
import { Query } from "react-apollo"
import { Typography, Button, FormControl, TextField } from "@material-ui/core"
import ProjectsList from "../components/ProjectsList"
import withStyles from "@material-ui/core/styles/withStyles"
import Project from "./Project"
import Loading from "../components/Shared/Loading"
import Error from "../components/Shared/Error"
import { GET_PROJECTS_QUERY } from "../queries"

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

const Projects = ({ classes, match }) => {
	const [order, setOrder] = useState("?")
	const [loanTotalLow, setLoanTotalLow] = useState(undefined)
	const [loanMin, setLoanMin] = useState(loanTotalLow)
	const [loanTotalHigh, setLoanTotalHigh] = useState(undefined)
	const [loanMax, setLoanMax] = useState(loanTotalHigh)
	const [cityText, setCityText] = useState("")
	const [city, setCity] = useState(cityText)
	const [sorting, setSorting] = useState(false)
	const [submitting, setSubmitting] = useState(false)

	useEffect(() => {
		//window.scrollTo(0, 0)
		if (sorting) {
			if (order === "-loan_total") {
				setOrder("loan_total")
			} else {
				setOrder("-loan_total")
			}
			setSorting(false)
		}
		if (submitting) {
			setLoanTotalLow(loanMin)
			setLoanTotalHigh(loanMax)
			if (cityText.length > 0) {
				setCity(cityText)
			}
			setSubmitting(false)
		}
	}, [order, sorting, submitting, loanMin, loanMax, cityText])

	return (
		<div className={classes.container}>
			{/* <MyLoansList /> */}
			<Query query={GET_PROJECTS_QUERY} variables={{ order, loanTotalLow, loanTotalHigh, city }}>
				{({ data, loading, error }) => {
					if (loading) return <Loading />
					if (error) return <Error error={error} />
					const projects = data.projects
					return (
						<>
							<Route
								exact
								path={match.path}
								render={() => (
									<>
										<Typography className={classes.pageTitle} variant="h2" gutterBottom>
											Open Projects
										</Typography>
										<Button onClick={() => setSorting(true)}>
											Sort Projects {order === "-loan_total" ? "Low to High" : "High to Low"}
										</Button>
										<form
											onSubmit={event => {
												event.preventDefault()
												setSubmitting(true)
											}}
										>
											<FormControl>
												<TextField
													label="Loan Total Min"
													placeholder="Loan Total Min"
													className={classes.textField}
													onChange={event => setLoanMin(event.target.value)}
													type="number"
													value={loanMin}
												/>
											</FormControl>
											<FormControl>
												<TextField
													label="Loan Total Max"
													placeholder="Loan Total Max"
													className={classes.textField}
													onChange={event => setLoanMax(event.target.value)}
													type="number"
													value={loanMax}
												/>
											</FormControl>
											<FormControl>
												<TextField
													label="Search City"
													placeholder="Search City"
													className={classes.textField}
													onChange={event => setCityText(event.target.value)}
													value={cityText}
												/>
											</FormControl>
											<Button type="submit">Filter</Button>
										</form>
										<ProjectsList projects={projects} match={match} />
									</>
								)}
							/>
							<Route
								path={`${match.path}/:projectId`}
								render={({ match }) => <Project projects={projects} match={match} />}
							/>
						</>
					)
				}}
			</Query>
		</div>
	)
}

export default withStyles(styles)(Projects)

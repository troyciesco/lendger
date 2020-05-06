import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { Query } from "react-apollo"
import withRoot from "./withRoot"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Borrow from "./pages/Borrow"
import Projects from "./pages/Projects"
import About from "./pages/About"
import Account from "./pages/Account"
import Terms from "./pages/Terms"
import Privacy from "./pages/Privacy"
import Faq from "./pages/Faq"
import Careers from "./pages/Careers"
import Loading from "./components/Shared/Loading"
//import Error from './components/Shared/Error'
import { ME_QUERY } from "./queries"
import Dashboard from "./pages/Dashboard"
import { Borrow2 } from "./pages/Borrow2"
import { Projects2 } from "./pages/Projects2"

export const UserContext = React.createContext()

const App = () => (
	<Query query={ME_QUERY} fetchPolicy="cache-and-network">
		{({ data, loading, error }) => {
			if (loading) return <Loading />
			//if (error) return <Error error={error} />
			let currentUser
			if (data) {
				currentUser = data.me
			}

			return (
				<Router>
					<UserContext.Provider value={currentUser}>
						<Header />
						<div style={{ minHeight: "100vh" }}>
							<Switch>
								<Route path="/" exact component={Home} />
								<Route path="/borrow" component={Borrow} />
								<Route path="/borrow2" component={Borrow2} />
								<Route path="/projects" component={Projects} />
								<Route path="/projects2" component={Projects2} />
								<Route path="/about" component={About} />
								<Route path="/terms" component={Terms} />
								<Route path="/privacy" component={Privacy} />
								<Route path="/faq" component={Faq} />
								<Route path="/careers" component={Careers} />
								<Route path="/account" component={Account} />
								<Route path="/dashboard" component={Dashboard} />
							</Switch>
						</div>
						<Footer />
					</UserContext.Provider>
				</Router>
			)
		}}
	</Query>
)

export default withRoot(App)

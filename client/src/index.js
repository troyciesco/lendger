import React from "react"
import ReactDOM from "react-dom"
import * as serviceWorker from "./serviceWorker"
//import { ApolloProvider, Query } from 'react-apollo'
import { ApolloProvider } from "react-apollo"
import ApolloClient from "apollo-boost"
import App from "./App"
//import Auth from './components/Auth'
//import { IS_LOGGED_IN_QUERY } from './queries'

const client = new ApolloClient({
	uri: "http://localhost:8080/graphql/",
	fetchOptions: {
		credentials: "include",
	},
	request: operation => {
		const token = localStorage.getItem("authToken") || ""
		operation.setContext({
			headers: {
				Authorization: `JWT ${token}`,
			},
		})
	},
	clientState: {
		defaults: {
			// the !! converts any value to a boolean
			isLoggedIn: !!localStorage.getItem("authToken"),
		},
	},
})

ReactDOM.render(
	<ApolloProvider client={client}>
		{/* <Query query={IS_LOGGED_IN_QUERY}>
            {({ data }) => data.isLoggedIn? <App /> : <Auth />}
        </Query> */}
		<App />
	</ApolloProvider>,
	document.getElementById("root"),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

import React from "react"
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import CssBaseline from "@material-ui/core/CssBaseline"
import blue from "@material-ui/core/colors/blue"
import green from "@material-ui/core/colors/green"

const theme = createMuiTheme({
	palette: {
		primary: {
			light: blue[300],
			main: blue[500],
			dark: blue[700],
		},
		secondary: {
			light: green[300],
			main: green[500],
			dark: green[700],
		},
		textPrimary: "#ffffff",
	},
	typography: {
		useNextVariants: true,
		fontFamily: ['"Poppins"'].join(","),
	},
})

function withRoot(Component) {
	function withRoot(props) {
		return (
			<MuiThemeProvider theme={theme}>
				<CssBaseline />
				<Component {...props} />
			</MuiThemeProvider>
		)
	}

	return withRoot
}

export default withRoot

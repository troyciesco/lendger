import React, { useContext } from "react"
import { Query } from "react-apollo"
import { Link } from "react-router-dom"
import withStyles from "@material-ui/core/styles/withStyles"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Signout from "./Auth/Signout"
import { UserContext } from "../App"
import { IS_LOGGED_IN_QUERY } from "../queries"
import styled from "styled-components"
import logo from "../img/Lendger.png"

import ClickAwayListener from "@material-ui/core/ClickAwayListener"
import Slide from "@material-ui/core/Slide"
import Paper from "@material-ui/core/Paper"
import Popper from "@material-ui/core/Popper"
import MenuItem from "@material-ui/core/MenuItem"
import MenuList from "@material-ui/core/MenuList"

import * as myStyles from "./Shared/Styles"

const styles = theme => ({
	root: {
		flexGrow: 1,
		margin: 0,
		paddingRight: 120,
		paddingLeft: 120,
		backgroundColor: myStyles.colorDarkBG,
		boxShadow: "0px 10px 30px -5px rgba(0, 0, 0, 0.3)",
		position: "relative",
	},
	grow: {
		flexGrow: 1,
		display: "flex",
		alignItems: "center",
		textDecoration: "none",
	},
	light: {
		flexGrow: 1,
		margin: "inherit",
		color: myStyles.colorLight,
		fontWeight: 700,
		textDecoration: "none",
	},
	menu: {
		position: "relative",
		zIndex: 2,
		fontFamily: "montserrat,sans-serif",
		marginTop: "15px",
		backgroundColor: myStyles.colorLightBG,
		color: myStyles.colorLight,
		padding: 0,
	},
	menuItem: {
		fontSize: ".8rem",
		fontWeight: 700,
		fontStyle: "normal",
		color: myStyles.colorLight,
		textDecoration: "none",
	},
})

const HeaderLink = styled.h1`
	${myStyles.baseFont};
	font-size: 13px;
	padding: 10px 25px 10px 25px;

	&.cursor:hover {
		cursor: pointer;
	}
`
const HeaderButton = styled.button`
	border: 1px solid ${myStyles.colorLight};
	border-radius: 5px;
	background-color: transparent;
	padding: 2px 18px 2px 18px;

	${myStyles.baseFont}
	font-size: 12px;

	&:hover {
		cursor: pointer;
	}
`
const HeaderLogo = styled.img`
	width: 250px;
`

const Header = ({ classes, props }) => {
	const [open, setOpen] = React.useState(false)
	const anchorRef = React.useRef(null)
	const currentUser = useContext(UserContext)

	function handleToggle() {
		setOpen(prevOpen => !prevOpen)
	}

	function handleClose(event) {
		if (anchorRef.current && anchorRef.current.contains(event.target)) return
		setOpen(false)
	}

	return (
		<div>
			<AppBar className={classes.root}>
				<Toolbar>
					<Link to="/" className={classes.light}>
						<HeaderLogo src={logo} />
					</Link>
					<HeaderLink>
						<Link to="/borrow" className={classes.light}>
							BORROW
						</Link>
					</HeaderLink>
					<HeaderLink>
						<Link to="/projects" className={classes.light}>
							LEND
						</Link>
					</HeaderLink>
					<HeaderLink
						className="cursor"
						ref={anchorRef}
						onClick={handleToggle}
						aria-owns={open ? "menu-list-grow" : undefined}
						aria-haspopup="true"
					>
						LEARN
					</HeaderLink>
					<HeaderLink>
						<Link to="/about" className={classes.light}>
							ABOUT
						</Link>
					</HeaderLink>

					<Query query={IS_LOGGED_IN_QUERY}>
						{({ data }) =>
							data.isLoggedIn ? (
								<>
									<HeaderLink>
										{currentUser.isUnderwriter ? (
											<Link to="/dashboard" className={classes.light}>
												<HeaderButton>DASHBOARD</HeaderButton>
											</Link>
										) : (
											<Link to="/account" className={classes.light}>
												<HeaderButton>ACCOUNT</HeaderButton>
											</Link>
										)}
									</HeaderLink>
									<Signout />
								</>
							) : (
								<HeaderLink>
									<Link to="/account" className={classes.light}>
										<HeaderButton>ACCOUNT</HeaderButton>
									</Link>
								</HeaderLink>
							)
						}
					</Query>
				</Toolbar>
			</AppBar>

			<Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
				{({ TransitionProps }) => (
					<Slide className={classes.slide} {...TransitionProps}>
						<Paper id="menu-list-grow">
							<ClickAwayListener onClickAway={handleClose}>
								<MenuList className={classes.menu}>
									<Link style={{ textDecoration: "none" }} to="/blog">
										<MenuItem className={classes.menuItem} onClick={handleClose}>
											BLOG
										</MenuItem>
									</Link>
									<Link style={{ textDecoration: "none" }} to="/faq">
										<MenuItem className={classes.menuItem} onClick={handleClose}>
											FAQ
										</MenuItem>
									</Link>
									<Link style={{ textDecoration: "none" }} to="/work">
										<MenuItem className={classes.menuItem} onClick={handleClose}>
											HOW IT WORKS
										</MenuItem>
									</Link>
								</MenuList>
							</ClickAwayListener>
						</Paper>
					</Slide>
				)}
			</Popper>
		</div>
	)
}

export default withStyles(styles)(Header)

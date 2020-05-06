import React, { useEffect } from "react"
import { Typography } from "@material-ui/core"
//import { UserContext } from '../App'

const Faq = () => {
	useEffect(() => {
		window.scrollTo(0, 0)
	})
	//const currentUser = useContext(UserContext)
	return (
		<div style={{ margin: "0 auto", maxWidth: "960px", paddingTop: "2rem" }}>
			<Typography align="center" variant="h3" gutterBottom>
				This is the Faq page.
			</Typography>
			<Typography variant="h4" gutterBottom>
				Lorem
			</Typography>
			<Typography paragraph gutterBottom>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus fuga expedita dolore
				sunt inventore possimus. Aperiam quas libero ad consectetur dicta voluptatibus ducimus rerum
				eum sapiente provident nobis incidunt beatae repellat ea, esse facilis, animi voluptate
				fugit quibusdam et! Corporis consectetur iste doloremque asperiores, repellendus dolor.
				Laboriosam ab quos labore?
			</Typography>
			<Typography variant="h4" gutterBottom>
				Lorem
			</Typography>
			<Typography paragraph gutterBottom>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus fuga expedita dolore
				sunt inventore possimus. Aperiam quas libero ad consectetur dicta voluptatibus ducimus rerum
				eum sapiente provident nobis incidunt beatae repellat ea, esse facilis, animi voluptate
				fugit quibusdam et! Corporis consectetur iste doloremque asperiores, repellendus dolor.
				Laboriosam ab quos labore?
			</Typography>
			<Typography variant="h4" gutterBottom>
				Lorem
			</Typography>
			<Typography paragraph gutterBottom>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus fuga expedita dolore
				sunt inventore possimus. Aperiam quas libero ad consectetur dicta voluptatibus ducimus rerum
				eum sapiente provident nobis incidunt beatae repellat ea, esse facilis, animi voluptate
				fugit quibusdam et! Corporis consectetur iste doloremque asperiores, repellendus dolor.
				Laboriosam ab quos labore?
			</Typography>
			<Typography variant="h4" gutterBottom>
				Lorem
			</Typography>
			<Typography paragraph gutterBottom>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus fuga expedita dolore
				sunt inventore possimus. Aperiam quas libero ad consectetur dicta voluptatibus ducimus rerum
				eum sapiente provident nobis incidunt beatae repellat ea, esse facilis, animi voluptate
				fugit quibusdam et! Corporis consectetur iste doloremque asperiores, repellendus dolor.
				Laboriosam ab quos labore?
			</Typography>
		</div>
	)
}

export default Faq

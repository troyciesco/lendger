describe("account login", () => {
	it("can log in a user", () => {
		cy.visit("http://localhost:3000/account")
			.get(".MuiButton-outlined-154 > .MuiButton-label-150")
			.click()
			.get("#username")
			.click()
			.type("heron")
			.get("#password")
			.type("heron{enter}")
	})
})

// For now this doesn't support change

export default function(amount) {
	const options = {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
	}
	//if (amount % 100 === 0) options.minimumFractionDigits = 0
	const formatter = new Intl.NumberFormat("en-US", options)
	return formatter.format(amount / 1)
}

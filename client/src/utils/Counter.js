export function Counter() {
	this.count = 0
}
Counter.prototype.add = function(array) {
	array.forEach(function(entry) {
		++this.count
	}, this)
}

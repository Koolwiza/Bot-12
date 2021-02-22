Array.prototype.random = function () {
	return this[Math.floor(Math.random() * this.length)];
};

String.prototype.toProperCase = function () {
	return this.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

Array.prototype.remove = function (a) {
	const index = this.indexOf(a);
	if (index > -1) {
		this.splice(index, 1);
	}
	return this
}

Array.prototype.shuffle = function () {
	const array = [];
	this.forEach(element => array.push(element));
	let currentIndex = array.length,
		temporaryValue, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}
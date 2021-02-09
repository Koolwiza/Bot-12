Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

String.prototype.toProperCase = function () {
  return this.replace(/([^\W_]+[^\s-]*) */g, function (txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

Array.prototype.remove = function(a) {
	const index = this.indexOf(a);
 	if (index > -1) {
  	this.splice(index, 1);
	}
	return this
}
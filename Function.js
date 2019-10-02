var time = "2019-09-18T16:09:19.424382";
var HumanTime = "";

function readingHuman(variable) {
	var HumanDate = variable.split(".", 1).toString();
  var HumanTime = HumanDate.split("T", 2).join(" ");
  console.log(HumanTime)
	return HumanTime;
}

readingHuman(time);

// console.log('HumanTime', HumanTime)

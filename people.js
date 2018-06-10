var peoplePosition = [
	["thanh", "hmin"],
	["ly", "te", "hoai"],
	["ly", "te", "hoai"]
];
var data = getAllData();
var currentPickedPerson = null;
makeGrid(document.getElementById("gridHere"));

function makeGrid(div)
{
	for (var i = 0; i < peoplePosition.length; i++)
	{
		var peopleRow = peoplePosition[i];
		var rowDiv = document.createElement("div");
		rowDiv.classList.add("ppl-group-row");
		for (var j = 0; j < peopleRow.length; j++)
		{
			rowDiv.appendChild(makePerson(peopleRow[j]));
		}
		div.appendChild(rowDiv);
	}
}

function makePerson(id)
{
	var person = document.createElement("div");
	person.classList.add("person");
	person.id = "person-" + (id == null ? "#" : id);

	if (id != null)
	{
		var image = document.createElement("img");
		image.classList.add("person-avatar");
		image.setAttribute("src", "https://scontent.fhan3-2.fna.fbcdn.net/v/t1.0-9/22050173_1563229980409582_5308385319638260138_n.jpg?_nc_cat=0&oh=f954de981ed4410d393cb32bd2c079ff&oe=5B76A2EE");
		image.onclick = function ()
		{
			pressOnPersonAvatar(image);
		};
		person.appendChild(image);
	}

	return person;
}

function pressOnPersonAvatar(imgDiv)
{
	imgDiv.classList.toggle("picked");

	var blackScreenClasses = document.getElementById("black-screen").classList;
	var gridClasses = document.getElementById("gridHere").classList;
	var picked = imgDiv.classList.contains("picked");

	if (picked)
	{
		document.getElementById("pop-up-avatar").setAttribute("src", imgDiv.src);
		currentPickedPerson = imgDiv;
		blackScreenClasses.remove("none");
		if (!gridClasses.contains("blurred")) gridClasses.add("blurred");
		populateDesc(imgDiv.id.substr(7));
	}
	else
	{
		currentPickedPerson = null;
		if (!blackScreenClasses.contains("none")) blackScreenClasses.add("none");
		gridClasses.remove("blurred");
	}
}

function blackScreenClicked()
{
	if (currentPickedPerson != null) pressOnPersonAvatar(currentPickedPerson);
}

function populateDesc(id)
{

}

function getAllData()
{
	var dict = {};

	var http = new XMLHttpRequest();
	http.open("GET", "dbconnect.php", true);
	http.onreadystatechange = function ()
	{
		dict['data'] = http.responseText;
	}
	var query = "select * from people";
	http.send("query=" + encodeURI(query));

	return dict;
}

function dupeString(str, times)
{
	var ret = "";
	for (var i = 0; i < times; i++)
	{
		ret += str;
	}
	return ret.trim();
}
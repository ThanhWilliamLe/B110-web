var dbColumns = ['id', 'fullname', 'firstname', 'lastname', 'nickname', 'dob', 'male', 'gen', 'phone', 'email', 'facebook', 'address',
	'country', 'city', 'dancer', 'choreographer', 'portrait', 'identifier', 'idfile', 'bio'];

var peoplePosition = [
	['thanhle', 'huongmin'],
	['phuongly', 'linhte', 'hoaiham'],
	['quynhmyt', 'hoangseu', 'yencho', 'vutruong'],
	['haiyen', 'hoaithu', 'camtu', 'thanhduong']
];
peoplePosition = [
	['thanhle', 'hoaiham', 'thanhle', 'hoaiham'],
	['hoangseu', 'yencho', 'vutruong', 'vutruong'],
	['haiyen', 'hoaithu', 'haiyen', 'yencho'],
	['haiyen', 'hoaithu', 'haiyen', 'yencho'],
	['haiyen', 'hoaithu', 'haiyen', 'yencho'],
	['hoangseu', 'yencho', 'vutruong', 'vutruong']
];
var gridDOM = document.getElementById("gridHere");
var data = {};
var currentPickedPerson = null;

$(window).resize(gridResized);
populateFromCache();
getAllData();

function populateFromCache()
{
	var cached = localStorage['b110people'];
	if (!!cached) dataAcquired(JSON.parse(cached), false);
}

function dataAcquired(dict, doCache)
{
	data = dict;
	if (doCache) localStorage['b110people'] = JSON.stringify(dict);

	makeGrid(gridDOM);
	resizeGridChildren();
}

function gridResized()
{
	resizeGridChildren();
}

function resizeGridChildren()
{
	var rowHeight = gridDOM.clientHeight / peoplePosition.length;
	var cellWidth = -1;
	for (var i in peoplePosition)
	{
		var peopleRow = peoplePosition[i];
		var singleWidth = gridDOM.clientWidth / peopleRow.length;
		if (cellWidth === -1 || singleWidth < cellWidth) cellWidth = singleWidth;
	}
	var ratio = 0.8;
	var cellSize = Math.min(rowHeight, cellWidth) * ratio;

	console.log($('.header').height() + "  " + rowHeight + "  " + cellWidth);

	$(gridDOM).find(".ppl-group-row").height(rowHeight * ratio);
	$(gridDOM).find(".person").height(cellSize);
	$(gridDOM).find(".person").width(cellSize);
	$(gridDOM).find(".person-avatar").height(cellSize);
	$(gridDOM).find(".person-avatar").width(cellSize);
}

function makeGrid(div)
{
	while (div.firstChild)
	{
		div.removeChild(div.firstChild);
	}
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
		var personData = data[id];

		var image = document.createElement("img");
		image.classList.add("person-avatar");
		if (personData != null) image.setAttribute("src", personData['portrait']);
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

function populateDesc(id)
{

}

function blackScreenClicked()
{
	if (currentPickedPerson != null) pressOnPersonAvatar(currentPickedPerson);
}

function getAllData()
{
	var query = "select * from people";

	var http = new XMLHttpRequest();
	http.open("GET", "dbconnect.php?query=" + encodeURI(query), true);
	http.onreadystatechange = function ()
	{
		if (http.readyState === 4 && http.status === 200)
		{
			var dict = {};

			var response = http.responseText;
			var rows = response.split("#&#");
			for (var i in rows)
			{
				var personDict = {};
				var row = rows[i];
				var rowSplit = row.split("|");
				for (var i1 in rowSplit)
				{
					var value = rowSplit[i1];
					var key = dbColumns[i1];
					personDict[key] = value;
				}
				dict[personDict['identifier']] = personDict;
			}

			dataAcquired(dict, true);
		}
	}
	http.send();
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
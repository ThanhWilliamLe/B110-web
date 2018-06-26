var staticWeb = window.location.hostname.includes('github');

var gridDOM = document.getElementById("gridHere");
var dbColumns = ["id", "fullname", "firstname", "lastname", "nickname", "dob", "male", "gen", "phone", "email", "facebook",
	"address", "country", "city", "dancer", "choreographer", "portrait", "identifier", "idfile", "bio", "position",
	"pos-en", "pos-vn"];
var peopleLines = ['The Elders', 'The Leaders', 'The Grown-ups', 'The ???', 'The Freshers'];
var peoplePosition = [
	["bobia"],
	["thanhle", "huongmin", "maitrang", "trangnu", "phuongly", "linhte", "hoaiham"],
	["thanhduong", "khanhan", "quynhmyt", "camtu", "yencho", "hoaithu", "thanhhieu"],
	["hachip", "hoangseu"],
	["bangngan", "haiyen", "vutruong", "duyquang", "vananh", "nghiennhi"]
];
var langStrings =
	{
		"Dancer": {"vn": "Vũ công", "en": "Dancer"},
		"Choreographer": {"vn": "Biên đạo", "en": "Choreographer"},
	};
var langVN = false;
var data = {};
var currentPickedPerson = null;

$(window).resize(gridResized);
populateFromCache();
getAllData();

function populateFromCache()
{
	var cached = localStorage['b110people'];
	if (cached) dataAcquired(JSON.parse(cached), false);
}

function dataAcquired(dict, doCache)
{
	data = dict;
	if (doCache)
	{
		localStorage['b110people'] = JSON.stringify(dict);
	}

	generateGridList();
	makeGrid(gridDOM);
	resizeGridChildren();
}

function generateGridList()
{
	var result = [];
	var gens = {};
	for (var p in data)
	{
		gens[data[p].gen] = true;
	}
	for(var gen in gens)
	{
		var a=[];
		for (var person in data)
		{
			if(data[person].gen===gen) a.push(person);
		}
		result.push(a);
	}
	peoplePosition = result;
}

function gridResized()
{
	resizeGridChildren();
}

function resizeGridChildren()
{
	var rowHeight = gridDOM.clientHeight / peoplePosition.length;
	var cellWidth = -1;
	peoplePosition.forEach(function (peopleRow)
	{
		var singleWidth = gridDOM.clientWidth / peopleRow.length;
		if (cellWidth === -1 || singleWidth < cellWidth) cellWidth = singleWidth;
	});
	var ratio = 0.8;
	var cellSize = Math.min(rowHeight, cellWidth) * ratio;

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

	if (id != null)
	{
		var personData = data[id];

		var image = document.createElement("img");
		image.classList.add("person-avatar");
		image.id = "person-" + (id == null ? "#" : id);
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
	var personData = data[id];
	if (!personData) return;

	personData = JSON.parse(JSON.stringify(personData));
	personData['position'] = langVN ? personData['pos-vn'] : personData['pos-en'];
	personData['position'] = personData['position'].toUpperCase();
	var dob = new Date(personData['dob']);
	personData['dob'] = dob.getDate() + "-" + (dob.getMonth() + 1) + "-" + dob.getFullYear();
	personData['name-all'] = personData['fullname'] + (!personData['nickname'] ? '' : (' - ' + personData['nickname']));
	personData['name-all'] = personData['name-all'].toUpperCase();
	personData['dance'] = getLocalString('Dancer') + (personData['choreographer'] === "1" ? " & " + getLocalString('Choreographer') : "");

	$('.person-info .pi-data').each(function ()
	{
		var theContent = this.dataset.content == null ? (langVN ? this.dataset.contentvn : this.dataset.contenten) : this.dataset.content;
		this.innerHTML = theContent.replace('{' + this.dataset.identifier + '}', personData[this.dataset.datatag]);
	});
}

function getLocalString(id, vn)
{
	if (vn == null) vn = langVN;
	return langStrings[id][vn ? 'vn' : 'en'];
}

function blackScreenClicked()
{
	if (currentPickedPerson != null) pressOnPersonAvatar(currentPickedPerson);
}

function getAllData()
{
	var localDataFile = "./data/people_all.txt";
	if (staticWeb)
	{
		var http = new XMLHttpRequest();
		http.open("GET", localDataFile, true);
		http.onreadystatechange = function ()
		{
			allDataQueried(http);
		};
		http.send();
	}
	else query("select people.*, positions.en, positions.vn from people inner join positions on people.position = positions.id",
		localDataFile,
		true,
		allDataQueried);
}

function allDataQueried(http)
{
	if (http.readyState === 4 && http.status === 200)
	{
		console.log(http.responseType);
		var dict = queryStringToArray('identifier', dbColumns, http.responseText);
		dataAcquired(dict, true);
	}
}

function query(queryStr, saveName, async, callback)
{
	var http = new XMLHttpRequest();
	http.open("GET", "dbconnect_mysql.php?query=" + encodeURI(queryStr) + "&savename=" + saveName, async);
	http.onreadystatechange = function ()
	{
		callback(http);
	};
	http.send();
}

function queryStringToArray(identifier, headers, queryResult)
{
	var dict = {};

	var rows = queryResult.split("#&#");
	for (var i in rows)
	{
		var row = rows[i];
		var rowSplit = row.split("|");
		var innerDict = {};
		for (var i1 in rowSplit)
		{
			var value = rowSplit[i1];
			value = value.replace(new RegExp("#nl#", 'g'), "</br>").replace(new RegExp("#rl#", 'g'), "</br>");
			var key = headers[i1];
			innerDict[key] = value;
		}
		dict[innerDict[identifier]] = innerDict;
	}

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
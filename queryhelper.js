function query(queryStr, saveName, async, callback)
{
	if(saveName==null) saveName="DONTSAVE";
	var http = new XMLHttpRequest();
	http.open("GET", "dbconnect_mysql.php?query=" + encodeURI(queryStr) + "&savename=" + saveName, async);
	http.onreadystatechange = function ()
	{
		callback(http);
	};
	http.send();
}

function queryStringToDict(identifier, headers, queryResult)
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

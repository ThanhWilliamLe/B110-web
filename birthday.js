var notifiedBirthday = false;
var bdNotiStrings = {
	'coming-vn': "Sắp đến sinh nhật của <v>#people#</v> trong <v>#days# ngày</v> tới.</br><v1>LÀM CHO #address# NGẠC NHIÊN ĐÊ!</v1>",
	'coming-en': "<v>#people#</v>'s #bdareis# coming up within <v>#days#</v>.</br><v1>SUPRISE #address#!</v1>",
	'today-vn': "<v2>Chúc mừng sinh nhật! #people#.</v2>",
	'today-en': "<v2>Happy birthday! #people#.</v2>"
}

function checkBirthdays()
{
	var cached = localStorage['b110birthdays'];
	if (cached) cached = JSON.parse(cached);
	if (cached && !notifiedBirthday) calculateAndNotifyBirthdays(cached);
	else if (shouldGetBirthdays(cached))
	{
		getBirthdays(function (result)
		{
			if (!notifiedBirthday) calculateAndNotifyBirthdays(result);
		});
	}
}

function shouldGetBirthdays(cached)
{
	return !cached || Date.now() - cached['_cachedAt'] >= 24 * 60 * 60 * 1000;
}

function getBirthdays(callback)
{
	query("select identifier, fullname, nickname, dob, male from people", null, true,
		function (http)
		{
			birthdaysGot(http, callback);
		});
}

function birthdaysGot(http, callback)
{
	if (http.readyState === 4 && http.status === 200)
	{
		var results = queryStringToDict('identifier', ['identifier', 'fullname', 'nickname', 'dob', 'male'], http.responseText);
		results['_cachedAt'] = Date.now();
		localStorage['b110birthdays'] = JSON.stringify(results);
		callback(results);
	}
}

function calculateAndNotifyBirthdays(result)
{
	var maxComingUpDays = 40;
	var birthdaysComingUp = [];
	var birthdaysToday = [];
	Object.keys(result).forEach(function (identifier)
	{
		var bd = result[identifier]['dob'];
		if (bd)
		{
			var bdDate = new Date(bd);
			bdDate.setFullYear(new Date().getFullYear());

			var daysToBD = bdDate.getTime() - new Date().getTime();
			daysToBD = Math.ceil(daysToBD / (1000 * 3600 * 24));

			if (daysToBD === 0) birthdaysToday.push(identifier);
			else if (daysToBD > 0 && daysToBD <= maxComingUpDays) birthdaysComingUp.push(identifier);
		}
	});
	if (birthdaysComingUp.length + birthdaysToday.length > 0)
	{
		notifyBirthdays(result, birthdaysToday, birthdaysComingUp, maxComingUpDays);
		notifiedBirthday = true;
	}
}

function notifyBirthdays(data, todays, comingups, maxComingUpDays)
{
	var div0 = document.createElement("div");
	div0.className = "birthday-noti";

	var people = "";
	var address = "";

	if (comingups.length > 0)
	{
		var days = "" + maxComingUpDays + (langVN ? "" : " day" + (maxComingUpDays > 1 ? "s" : ""));

		if (langVN) address = comingups.length > 1 ? "họ" : (data[comingups[0]]['male'] == '1' ? "anh ấy" : "cô ấy");
		else address = comingups.length > 1 ? "them" : (data[comingups[0]]['male'] == '1' ? "him" : "her");
		for (var i in comingups)
		{
			var person = data[comingups[i]];
			if (i > 0 && i == comingups.length - 1) people += langVN ? " và " : " and ";
			people += displayName(person);
			if (i < comingups.length - 2) people += ", ";
		}
		var finalStr = bdNotiStrings[langVN ? 'coming-vn' : 'coming-en'];
		finalStr = finalStr.replace("#people#", people).replace("#days#", days).replace("#address#", address.toUpperCase());
		if (!langVN)
		{
			finalStr = finalStr.replace("#bdareis#", comingups.length > 1 ? "birthdays are" : "birthday is");
		}

		var div1 = document.createElement("div");
		div1.className = "the-noti";
		div1.innerHTML = "<p>" + finalStr + "</p>";
		div0.appendChild(div1);
	}
	if (todays.length > 0)
	{
		people = "";
		for (var i0 in todays)
		{
			var person0 = data[todays[i0]];
			if (i0 > 0 && i0 == todays.length - 1) people += langVN ? " và " : " and ";
			people += displayName(person0);
			if (i0 < comingups.length - 2) people += ", ";
		}
		var finalStr0 = bdNotiStrings[langVN ? 'today-vn' : 'today-en'];
		finalStr0 = finalStr0.replace("#people#", people);

		var div2 = document.createElement("div");
		div2.className = "the-noti";
		div2.innerHTML = "<p>" + finalStr0 + "</p>";
		if (comingups.length > 0) div2.style.animationDelay = "0.5s";
		div0.appendChild(div2);
	}

	document.body.appendChild(div0);
}

function displayName(person)
{
	var nickname = person['nickname'];
	if (nickname != null) return nickname;

	var fullname = person['fullname'];
	fullname = fullname.split(" ").splice(-2).join(" ");
	return fullname;
}
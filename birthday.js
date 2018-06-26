var notifiedBirthday = false;
var bdNotiStrings = {
	'coming-vn': "Sắp đến sinh nhật của #people# trong #days# ngày tới! LÀM CHO #address# NGẠC NHIÊN ĐÊ!",
	'coming-en': "#people# coming up within #days#! SUPRISE #address#!",
	'today-vn': "CHÚC MỪNG SINH NHẬT #people#!",
	'today-en': "HAPPY BIRTHDAY #people#!"
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
	var maxComingUpDays = 50;
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
	var people = "";
	var address = "";

	if (comingups.length > 0)
	{
		var days = "" + maxComingUpDays + (langVN ? "" : " day" + (maxComingUpDays > 1 ? "s" : ""));

		if (langVN) address = comingups.length > 1 ? "họ" : (data[comingups[0]]['male'] ? "anh ấy" : "cô ấy");
		else address = comingups.length > 1 ? "them" : (data[comingups[0]]['male'] ? "him" : "her");
		for (var i in comingups)
		{
			var person = data[comingups[i]];
			if (i > 0 && i == comingups.length - 1) people += langVN ? "và " : "and ";
			people += person['fullname'];
			if (i < comingups.length - 1) people += ", ";
		}
		if (!langVN)
		{
			people += "'s birthday" + (comingups.length > 1 ? "s are" : " is");
		}
		var finalStr = bdNotiStrings[langVN ? 'coming-vn' : 'coming-en'];
		finalStr = finalStr.replace("#people#", people).replace("#days#", days).replace("#address#", address.toUpperCase());
		console.log(finalStr);
	}
}
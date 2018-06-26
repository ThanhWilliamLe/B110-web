var videoGroup = document.getElementById("videosHere");

var ytTemplate = '<iframe src="#replace-src#" frameborder="0" allow="autoplay;" allowfullscreen></iframe>';
var fbTemplate = '<iframe src="#replace-src#" scrolling="no" frameborder="0" allowTransparency="true" allowFullScreen="true"></iframe>';
var fbSrcConvert = function (src)
{
	return 'https://www.facebook.com/plugins/video.php?href=' + encodeURI(src);
};

var types = {
	'yt': {template: ytTemplate, converter: null, classname: 'yt'},
	'fb': {template: fbTemplate, converter: fbSrcConvert, classname: 'fb'},
}

var videos = [
	{type: 'yt', src: 'https://www.youtube.com/embed/I4b87dCrV9c'},
	{type: 'yt', src: 'https://www.youtube.com/embed/-zplckwXQnY'},
	{type: 'yt', src: 'https://www.youtube.com/embed/DWacwybr2ks'},
	{type: 'fb', src: 'https://www.facebook.com/b110.ftudc/videos/395010237670114/'},
	{type: 'fb', src: 'https://www.facebook.com/b110.ftudc/videos/367736050397533/'},
	{type: 'fb', src: 'https://www.facebook.com/b110.ftudc/videos/363374480833690/'},
	{type: 'fb', src: 'https://www.facebook.com/b110.ftudc/videos/363376717500133/'},
	{type: 'fb', src: 'https://www.facebook.com/b110.ftudc/videos/363411764163295/'},
	{type: 'fb', src: 'https://www.facebook.com/b110.ftudc/videos/363411300830008/'},
	{type: 'fb', src: 'https://www.facebook.com/b110.ftudc/videos/335369916967480/'},
	{type: 'fb', src: 'https://www.facebook.com/b110.ftudc/videos/303644556806683/'},
	{type: 'fb', src: 'https://www.facebook.com/b110.ftudc/videos/208002123037594/'},
	{type: 'fb', src: 'https://www.facebook.com/b110.ftudc/videos/199927210511752/'},
	{type: 'fb', src: 'https://www.facebook.com/b110.ftudc/videos/221794824991657/'},
	{type: 'fb', src: 'https://www.facebook.com/b110.ftudc/videos/313562862481519/'},
	{type: 'fb', src: 'https://www.facebook.com/b110.ftudc/videos/197310047440135/'},
	{type: 'fb', src: 'https://www.facebook.com/b110.ftudc/videos/197940460710427/'}
];

function generateVideoEmbeds()
{
	var i = 0;
	videos.forEach(function (video)
	{
		var type = types[video.type];

		var div = document.createElement("div");
		div.className = "avideo";
		if (type.classname) div.className += " " + type.classname;

		var iHtml = type.template;
		var vidSrc = video.src;
		if (type.converter) vidSrc = type.converter(vidSrc);
		iHtml = iHtml.replace("#replace-src#", vidSrc);

		div.innerHTML = iHtml;
		videoGroup.appendChild(div);
		i++;
	});
}

generateVideoEmbeds();
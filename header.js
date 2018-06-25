function generateHeader(page)
{
	var parent = $(document.body);

	var header = document.createElement("div");
	var navBar = document.createElement("div");
	header.className = "header";
	navBar.className = "nav-bar";

	var navIndex = document.createElement("a");
	var navPeople = document.createElement("a");
	var navVideos = document.createElement("a");

	navIndex.innerHTML = '<img src="b110-logo-med.png">';
	navPeople.innerHTML = 'PEOPLE';
	navVideos.innerHTML = 'VIDEOS';

	navIndex.href = page !== 'index' ? "index.html" : "#";
	navPeople.href = page !== 'people' ? "people.html" : "#";
	navVideos.href = page !== 'videos' ? "videos.html" : "#";

	navIndex.className = page !== 'index' ? "brand" : "brand active";
	navPeople.className = page !== 'people' ? "" : "active";
	navVideos.className = page !== 'videos' ? "" : "active";

	navBar.appendChild(navIndex);
	navBar.appendChild(navPeople);
	navBar.appendChild(navVideos);
	header.appendChild(navBar);

	parent.prepend(header);
}
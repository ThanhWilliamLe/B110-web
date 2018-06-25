var theImageHolder = document.getElementsByClassName("image-holder")[0];
var images = [
	"https://scontent.fhan6-1.fna.fbcdn.net/v/t1.0-9/22519206_1579228468809733_9143594181294346173_n.jpg?_nc_cat=0&oh=e72d874429ea3c1d730a03e52b990602&oe=5B7BB307",
	"https://scontent.fhan3-2.fna.fbcdn.net/v/t1.0-9/34266572_390162808154857_868481596007645184_n.jpg?_nc_cat=0&_nc_eui2=AeGFbenoR4xCQBPHiMCbyuGNsiVLYi--kn0MulL3Xu8kaOt5F8xcm7I5hCLfxFZb5uIUjlbXuRbD5iQXs33IAO4gbqO9rc71_EEM7_88KGvSRw&oh=8f6486832cee336bbe2b7b05c98e6c12&oe=5BABC33C",
	"https://scontent.fhan3-2.fna.fbcdn.net/v/t31.0-8/23415509_1604569702942276_1236367271457409479_o.jpg?_nc_cat=0&_nc_eui2=AeHS2J88KmD7mYxgTn21lIm03mtlL1E6Z9aDAYncMzQBr2vLq5TpmqZpJLvlLNAn_8Xxd-oNK0qUrLpolrlmUZD0SQdCJmkdUN8L6ZbxeVKhFA&oh=d157ad7600dd633cbde0bbfd9184df0b&oe=5BACC554",
	"https://scontent.fhan3-2.fna.fbcdn.net/v/t31.0-8/15675906_1298111510254765_5453084737218896082_o.jpg?_nc_cat=0&_nc_eui2=AeHY23X_i6NgW3X7tlww69vfspCBH210j_eB49j_Rz5DqbZC_CdAobVSNLYA0Uzta3NPNso75FLMUUS56kSPMs6KnWAhulNqoD-2_Dd-f7QDVA&oh=2e4b03931f616e9975b95a231e4750e5&oe=5BB97A76",
	"https://scontent.fhan3-2.fna.fbcdn.net/v/t31.0-8/12891611_1073648819367703_2335780974090548181_o.jpg?_nc_cat=0&_nc_eui2=AeHLKmPwDD8iMMTVZaN7Yfim8EC-Shaa2mouxR9MToEG9B7wBKDftXx7HAdcrY49BJgRyFtu3oKHVQ-Efy_-MQkRc_mp8wjBEN9oQvrf7BLjJg&oh=f0ae83caadf4f8eb4d6fd183f5c78267&oe=5BE8B36A",
	"https://scontent.fhan3-2.fna.fbcdn.net/v/t31.0-8/11080289_880529742012946_5183959321851919684_o.jpg?_nc_cat=0&_nc_eui2=AeEX_DM6YpQtrDGeoC6PFQiYtUdz89qSs8KwzALFwCL-jU7Qt5mW-ahz3Pe08SPY-7gsHSeLa8tj-DFHwXlaQSgXL5qnqeBStam38CC5VXz_Dg&oh=f9fd6750d76ac39e1974667678c90724&oe=5BA88279",
	"https://scontent.fhan3-2.fna.fbcdn.net/v/t31.0-8/12031466_966170920115494_2439108556337991552_o.jpg?_nc_cat=0&_nc_eui2=AeHe8NqrbzHtBWgekWjqs1yE175MyllkIkC1ExoL54jsV5chM1-JgI-X7M7X2U_Winu-lvNYj2jWoZpDbdJFalTRFqRAsyym54xBsSKpjcoFcw&oh=826517ee7d8f7024dc512faaa8ad382f&oe=5BAE1597",
	"https://scontent.fhan3-2.fna.fbcdn.net/v/t1.0-9/32231241_381055772398894_7478315636100169728_n.jpg?_nc_cat=0&_nc_eui2=AeF5s_qbocMy9z2S3_li8cAua-VoqCE6IB8aIc156pDVo5QY1bcNEJcTUe98WOrypQ32eMs62wlGh8mrK8vVdzplp4sLu0LmrbatCZbg-n5dZA&oh=386f71139a4a75848ff1651f12a507aa&oe=5B9FC352"
];
var imageDivs = [];
var rotatedImgDivs = [];

setupImages();
changeImg();
var currentImgInterval = setInterval(changeImg, 5000);

function setupImages()
{
	images.forEach(function (imgurl)
	{
		var imgDiv = document.createElement("div");
		imgDiv.classList.add("the-image");
		imgDiv.classList.add("hide");
		imgDiv.style.backgroundImage = "url('" + imgurl + "')";
		imgDiv.onclick = imgClicked;
		theImageHolder.appendChild(imgDiv);
		imageDivs.push(imgDiv);
	});
	resetRotated();
}

function resetRotated()
{
	rotatedImgDivs = [imageDivs.length];
	for (var i in imageDivs)
	{
		rotatedImgDivs[i] = false;
	}
}

function checkAllRotated()
{
	var allRotated = true;
	rotatedImgDivs.forEach(function(rotated)
	{
		if(!rotated)
		{
			allRotated = false;
		}
	});
	if(allRotated) resetRotated();
}

function imgClicked()
{
	changeImg();
	clearInterval(currentImgInterval);
	currentImgInterval = setInterval(changeImg, 5000);
}

function changeImg()
{
	checkAllRotated();
	var i = 0;
	while(rotatedImgDivs[i])
	{
		i = Math.floor(Math.random() * rotatedImgDivs.length);
	}
	rotatedImgDivs[i] = true;
	for (var j in imageDivs)
	{
		imageDivs[j].classList.add('hide');
		if (j == i) imageDivs[j].classList.toggle('hide');
	}
}
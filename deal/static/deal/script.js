function NewContentObjects(dishes, anima) {
	var content = document.getElementById("content");
	content.innerHTML = "";
	var row;
	for (var i in dishes) {
		if (i % 3 == 0) {
			row = document.createElement("div");
			row.className = "w3-row-padding w3-margin-top";
			content.appendChild(row);
		}
		var col = document.createElement("div");
		col.className = "w3-third " + anima;
		row.appendChild(col);
		var card = document.createElement("div");
		card.className = "w3-card-8";
		var img = document.createElement("img");
		img.src = dishes[i].photoid;
		img.alt = dishes[i].zhtitle;
		img.style = "width:100%";
		img.className = "w3-hover-opacity";
		var text = document.createElement("div");
		text.className = "w3-container";
		var zt = document.createElement("h4");
		var ztt = document.createTextNode(dishes[i].zhtitle + '\n' + dishes[i].entitle);
		zt.appendChild(ztt);
		var itemid = document.createElement("p");
		var itemidt = document.createTextNode("餐品編號: " + dishes[i].itemid);
		itemid.appendChild(itemidt);
		text.appendChild(zt);
		text.appendChild(itemid);
		if (dishes[i].price) {
			var priceinfo = document.createElement("p");
			var priceinfot = document.createTextNode("CDN$ " + dishes[i].price + dishes[i].punit);
			priceinfo.appendChild(priceinfot);
			text.appendChild(priceinfo);
		}
		if (dishes[i].calorie) {
			var calorieinfo = document.createElement("p");
			var calorieinfot = document.createTextNode("Calorie " + dishes[i].calorie + dishes[i].punit);
			calorieinfo.appendChild(calorieinfot);
			text.appendChild(calorieinfo);
		}
		col.appendChild(card);
		card.appendChild(img);
		card.appendChild(text);
	}
}

function ShowIndexContent(recommend, anima) {
	var win = document.getElementById("window");
	win.innerHTML = "";
	for (var i in recommend) {
		var sec = document.createElement("div");
		sec.className = "w3-section w3-container " + anima;
		var card = document.createElement("div");
		card.className = "w3-card-4";
		sec.appendChild(card);
		var img = document.createElement("img");
		img.src = recommend[i].photoid;
		img.alt = recommend[i].zhtitle;
		img.style = "width:100%";

		var text = document.createElement("div");
		text.className = "w3-container w3-white";

		var title = document.createElement("h4");
		title.innerHTML = recommend[i].zhtitle + ' ' + recommend[i].entitle;
		var priceinfo = document.createElement("h4");
		priceinfo.innerHTML = 'CDN$ ' + recommend[i].price + recommend[i].punit;
		var itemid = document.createElement("p");
		itemid.innerHTML = "<strong>餐品編號:</strong> " + recommend[i].itemid;
		var desp = document.createElement("p");
		desp.innerHTML = recommend[i].desp;

		text.appendChild(title);
		text.appendChild(priceinfo);
		text.appendChild(itemid);
		text.appendChild(desp);
		card.appendChild(img);
		card.appendChild(text);

		win.appendChild(sec);
	}
}

function LoadIndexContent(server, anima) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
			var recommend = JSON.parse(xhttp.responseText).recommend;
			ShowIndexContent(recommend, anima);
    }
  };
	xhttp.open("GET", server, true);
  xhttp.send();
}

function ShowSortOptions(server, anima) {
	sort = document.getElementById("sort").value;
	cat = document.getElementById("catalog").value;
  var xhttp;
  if (sort == "") {
    return;
  }
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
			var dishes = JSON.parse(xhttp.responseText).dishlist;
			NewContentObjects(dishes, anima);
    }
  };
	xhttp.open("GET", server+'?sort='+sort+'&cat='+cat, true);
  xhttp.send();
}

function LoadGalleryContent(photos) {
	var win = document.getElementById("window");
	var sec = document.createElement("div");
	sec.className = "w3-section w3-container";
	win.appendChild(sec);
	var row;
	for (var i in photos) {
		
		if (i % 4 == 0) {
			row = document.createElement("div");
			row.className = "w3-row-padding w3-margin-top";
			sec.appendChild(row);
		}
		var col = document.createElement("div");
		col.className = "w3-quarter";
		var card = document.createElement("div");
		card.className = "w3-card-2";
		row.appendChild(col);
		col.appendChild(card);
		var img = document.createElement("img");
		img.src = photos[i].image;
		img.alt = photos[i].name;
		img.style = "width:100%;cursor:zoom-in";
		img.onclick = ShowImageModel;
		img.className="w3-hover-opacity";
		card.appendChild(img);
	}
}

function ShowImageModel() {
	document.getElementById("immc").src = this.src;
	document.getElementById("imm").style.display = "block";
}

function LoadGallery(server, dishid) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
			var photos = JSON.parse(xhttp.responseText).photos;
			LoadGalleryContent(photos)
    }
  };
	xhttp.open("GET", server+'?mealid='+dishid, true);
  xhttp.send();
}

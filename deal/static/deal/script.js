function NewContentObjects(dishes, anima, catn, catd, reloadcat) {
	var content = document.getElementById("content");
	var catb = document.getElementById("cat");
	var keep = 1;
	if (catb) {
		if (catb.style.display == 'none') {
			keep = 0;
		}
	}
	content.innerHTML = "";
	if (catn) {
		var catm = document.createElement("div");
		if (keep == 1 || reloadcat) {
			catm.style.display = 'block';
		} else {
			catm.style.display = 'none';
		}
		if (reloadcat) {
			catm.className = "w3-section w3-container w3-center w3-card-12 " + anima;
		} else {
			catm.className = "w3-section w3-container w3-center w3-card-12";
		}
		catm.id = "cat";
		var cls = document.createElement("span");
		cls.onclick=function(){this.parentElement.style.display='none';}
		cls.className= "w3-closebtn w3-padding-large w3-xxlarge w3-text-cyan w3-hover-text-dark-grey";
		cls.innerHTML = "x";

		var catname = document.createElement("h1");
		catname.innerHTML = catn;
		catm.appendChild(cls);
		catm.appendChild(catname);
		if (catd) {
			var catdesc = document.createElement("p");
			catdesc.innerHTML = catd;
			catm.appendChild(catdesc);
		}
		content.appendChild(catm);
	}
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
		card.style.paddingBottom = "10px";
		var img = document.createElement("img");
		img.src = dishes[i].photoid;
		img.alt = dishes[i].zhtitle;
		img.className = "w3-hover-opacity";
		img.style = "width:100%;cursor:pointer";
		img.onclick = (function(link){return function(){window.open(link);}})(dishes[i].detail);
		var text = document.createElement("div");
		text.className = "w3-container";
		var zt = document.createElement("h4");
		zt.innerHTML = "<span class='mname'>"+dishes[i].zhtitle+"</span>" + ' ' + dishes[i].entitle;
		var itemid = document.createElement("p");
		itemid.innerHTML = "餐品編號: " + "<span class='itemid'>"+dishes[i].itemid+"</span>";
		text.appendChild(zt);
		text.appendChild(itemid);
		if (dishes[i].price) {
			var priceinfo = document.createElement("p");
			priceinfo.innerHTML = "CDN$ " + "<span class='price'>"+dishes[i].price+"</span>"+dishes[i].punit;
			text.appendChild(priceinfo);
		}
		if (dishes[i].calorie) {
			var calorieinfo = document.createElement("p");
			var calorieinfot = document.createTextNode("Calorie " + dishes[i].calorie + dishes[i].punit);
			calorieinfo.appendChild(calorieinfot);
			text.appendChild(calorieinfo);
		}
		var orderit;
		if (dishes[i].price) {
			orderit = document.createElement("button");
			orderit.type = "button";
			orderit.className = "btn btn-default";
			orderit.style = "width:100%";
			orderit.innerHTML = "加入購物車";
			text.appendChild(orderit);
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
		card.className = "w3-card-8";
		card.style.paddingBottom = "15px";
		sec.appendChild(card);
		var img = document.createElement("img");

		img.src = recommend[i].photoid;
		img.alt = recommend[i].zhtitle;
		img.className = "w3-hover-opacity";
		img.style = "width:100%;cursor:pointer";
		img.onclick = (function(link){return function(){window.open(link);}})(recommend[i].detail);

		var text = document.createElement("div");
		text.className = "w3-container";

		var title = document.createElement("h4");
		title.innerHTML = "<span class='mname'>"+recommend[i].zhtitle +"</span> "+ recommend[i].entitle;
		var itemidtext = document.createElement("p");
		itemidtext.innerHTML = "<strong>餐品編號:</strong> ";
		var itemid = document.createElement("span");
		itemid.innerHTML = recommend[i].itemid;
		itemid.className = "itemid";
		itemidtext.appendChild(itemid);
		text.appendChild(title);
		text.appendChild(itemidtext);
		if (recommend[i].price) {
			var priceinfo = document.createElement("h4");
			priceinfo.innerHTML = 'CDN$ ';
			price = document.createElement("span");
			price.className = "price";
			price.innerHTML = recommend[i].price;
			priceinfo.appendChild(price);
			priceinfo.innerHTML += recommend[i].punit;
			text.appendChild(priceinfo);
		}

		var itemid = document.createElement("p");
		itemid.innerHTML = "<strong>餐品編號:</strong> " + recommend[i].itemid;
		var desp = document.createElement("p");
		desp.innerHTML = recommend[i].desp;

		text.appendChild(desp);
		var orderit;
		if (recommend[i].price) {
			orderit = document.createElement("button");
			orderit.type = "button";
			orderit.className = "btn btn-default";
			orderit.style = "width:100%";
			orderit.innerHTML = "加入購物車";
			text.appendChild(orderit);
		}
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

function ShowSortOptions(server, anima, reloadcat) {
	sort = document.getElementById("sort").value;
	cat = document.getElementById("catalog").value;
  var xhttp;
  if (sort == "") {
    return;
  }
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
			var res = JSON.parse(xhttp.responseText);
			var dishes = res.dishlist;
			var catn = res.catn;
			var catd = res.catd;
			NewContentObjects(dishes, anima, catn, catd, reloadcat);
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

	if (photos.length != 0) {
		title = document.createElement("h4");
		title.innerHTML = "餐品寫真:";
		sec.appendChild(title);
	}
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

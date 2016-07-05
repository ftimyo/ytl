function NewContentObjects(dishes) {
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
		col.className = "w3-third";
		row.appendChild(col);
		var card = document.createElement("div");
		card.className = "w3-card-4";
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

function ShowSortOptions(server) {
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
			NewContentObjects(dishes);
    }
  };
	xhttp.open("GET", server+'?sort='+sort+'&cat='+cat, true);
  xhttp.send();
}

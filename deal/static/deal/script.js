/*Cookie Helpers BEGIN*/
function GetCookie(key) {
  var data = document.cookie.split(";");
  for (var i = 0; i < data.length; ++i) {
    entry = data[i].split("=");
    var k = entry[0].replace(/^\s+|\s+$/g,'')
    if (k == key) {
      return entry[1];
    }
  }
  return "";
}

function SetCookie(key,val,h) {
	var t = new Date();
	t.setTime(t.getTime() + (h*60*60*1000));
	var expires = "expires=" + t.toGMTString();
	document.cookie = key+"="+val+";"+expires+";path=/";
}
/*Cookie Helpers END*/
function PageSetup() {
	UpdateCartCount();
	document.getElementById("showcart").addEventListener("click", ShowCartContent);
}
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
			orderit.innerHTML = "加入訂餐車";
			orderit.onclick = AddItemFromMenu;
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
			orderit.innerHTML = "加入訂餐車";
			orderit.onclick = AddItemFromMenu;
			text.appendChild(orderit);
		}
		card.appendChild(img);
		card.appendChild(text);

		win.appendChild(sec);
	}
}

function LoadIndexContent(server, anima) {
	PageSetup();
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
	PageSetup();
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
	PageSetup();
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
/*{key:[name,price,cnt],}*/
function UpdateCartCount() {
	var cart = GetCookie("cart");
	var ncart = document.getElementById("ncart");
  if (cart == "") {
		SetCookie("cart","",24);	
		ncart.innerHTML = 0;
	} else {
		cart = JSON.parse(cart);
		var cnt = 0;
		for (var v in cart) {
			cnt+=cart[v][2];
		}
		ncart.innerHTML = cnt;
	}
}
function TotalPayment(cart) {
	var total = 0.00;
	for (var k in cart) {
		total += cart[k][2] * cart[k][1];
	}
	document.getElementById("total").innerHTML = "CDN$ " + total.toFixed(2);
}
function AddItemFromMenu() {
	var price = parseFloat(this.parentNode.getElementsByClassName("price")[0].innerHTML);
	var itemid = this.parentNode.getElementsByClassName("itemid")[0].innerHTML;
	var mname = this.parentNode.getElementsByClassName("mname")[0].innerHTML;
	var cart = GetCookie("cart");
	if (cart == "") {
		cart = {};
		cart[itemid] = [mname,price,1];
	} else {
		cart = JSON.parse(cart);
		if (cart[itemid]) {
			cart[itemid][2] += 1;
		} else {
			cart[itemid] = [mname,price,1];
		}
	}
	SetCookie("cart", JSON.stringify(cart),24);
	UpdateCartCount();
	$("#cartview").modal();
	ShowCartContent();
}
function AddItemFromDetail() {
	var price = parseFloat(document.getElementById("price").innerHTML);
	var itemid = document.getElementById("itemid").innerHTML;
	var mname = document.getElementById("mname").innerHTML;
	var cart = GetCookie("cart");
	if (cart == "") {
		cart = {};
		cart[itemid] = [mname,price,1];
	} else {
		cart = JSON.parse(cart);
		if (cart[itemid]) {
			cart[itemid][2] += 1;
		} else {
			cart[itemid] = [mname,price,1];
		}
	}
	SetCookie("cart", JSON.stringify(cart),24);
	UpdateCartCount();
	$("#cartview").modal();
	ShowCartContent();
}

function EmptyCart() {
	SetCookie("cart","",24);
	document.getElementById("cartt").innerHTML = '<p style="font-size:20px;" class="w3-center">訂餐車已清空</p>';
	TotalPayment({});
	UpdateCartCount();
}

function RemoveItem(obj) {
	var key = obj.name;
	var items = JSON.parse(GetCookie("cart"));
	delete items[key];
	var cnt = 0; for (var v in items){++cnt;}
	if (cnt != 0) {
		SetCookie("cart",JSON.stringify(items),24);
	} else {
		SetCookie("cart","",24);
	}
	ShowCartContent();
}

function PlusItem(obj) {
	var cntf = obj.getElementsByClassName('cnt')[0];
	var cnt = parseInt(cntf.innerHTML);
	++cnt;
	console.log(cnt);
	cntf.innerHTML = cnt;
	var items = JSON.parse(GetCookie('cart'));
	items[obj.name][2] = cnt;
	SetCookie('cart',JSON.stringify(items),24);
	ShowCartContent();
}
function MinusItem(obj) {
	var cntf = obj.getElementsByClassName('cnt')[0];
	var cnt = parseInt(cntf.innerHTML);
	if (cnt <= 1) {ShowCartContent();return;}
	--cnt;
	console.log(cnt);
	cntf.innerHTML = cnt;
	var items = JSON.parse(GetCookie('cart'));
	items[obj.name][2] = cnt;
	SetCookie('cart',JSON.stringify(items),24);
	ShowCartContent();
}

function ShowCartContent() {
	var cartt = document.getElementById("cartt");
	var items = GetCookie("cart");
	if (items == "") {
		cartt.innerHTML = '<p style="font-size:20px;" class="w3-center">您的訂餐車沒有餐品</p>';
		UpdateCartCount();
		TotalPayment({});
		return;
	}
	items = JSON.parse(items);
	cartt.innerHTML = "";
	var tbl = document.createElement("table");
	tbl.className = "w3-table";
	var tbh = document.createElement("thead");
	tbh.innerHTML = "<tr><th>餐品名稱</th><th class='w3-padding'>數量</th><th>價格</th><th class='w3-right'>移除</th></tr>";
	tbl.appendChild(tbh);
	var tblb = document.createElement("tbody");
	tblb.style = "font-size:20px;"
	tbl.appendChild(tblb);
	cartt.appendChild(tbl);
	for (var k in items) {
		var row = document.createElement("tr");
		row.name = k;
		row.innerHTML = "<td>"+items[k][0]+
			"</td><td><a class='mc'><span class='fa fa-minus-circle'/></a><span class='w3-padding cnt'>"+
			items[k][2]+"</span><a class='pc'><span class='fa fa-plus-circle'/></a></td><td>CDN$ "+
			(items[k][1]*items[k][2]).toFixed(2)+"</td>";
		row.getElementsByClassName("pc")[0].addEventListener('click',(function(td){return function(){PlusItem(td);}})(row),false);
		row.getElementsByClassName("mc")[0].addEventListener('click',(function(td){return function(){MinusItem(td);}})(row),false);
		var rmbtn = document.createElement("td");
		rmbtn.innerHTML = '<span style="cursor:pointer;" class="fa fa-times w3-closebtn"></span>';
		rmbtn.onclick = (function(td){return function(){RemoveItem(td);}})(row);
		row.appendChild(rmbtn);
		tblb.appendChild(row);
	}
	UpdateCartCount();
	TotalPayment(items);
}

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
		img.className = "w3-hover-opacity w3-center";
		img.style.width = "100%";
		img.style.cursor = "pointer";
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
			orderit.style.width='100%';
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
		img.className = "w3-hover-opacity w3-center";
		img.style.cursor="pointer";
		img.style.width = "100%";
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
			orderit.style.width='100%';
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
		img.style.width = "100%";
		img.style.cursor = "zoom-in";
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
/*{key:[name,price,cnt,itemid],}*/
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
		cart[itemid] = [mname,price,1,parseInt(itemid)];
	} else {
		cart = JSON.parse(cart);
		if (cart[itemid]) {
			cart[itemid][2] += 1;
		} else {
			cart[itemid] = [mname,price,1,parseInt(itemid)];
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
		cart[itemid] = [mname,price,1,parseInt(itemid)];
	} else {
		cart = JSON.parse(cart);
		if (cart[itemid]) {
			cart[itemid][2] += 1;
		} else {
			cart[itemid] = [mname,price,1,parseInt(itemid)];
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
	tbh.innerHTML = "<tr><th>餐品名稱</th><th>數量</th><th style='text-align:right;'>價格(CDN$)</th><th class='w3-right'>移除</th></tr>";
	tbl.appendChild(tbh);
	var tblb = document.createElement("tbody");
	tblb.style = "font-size:20px;"
	tbl.appendChild(tblb);
	cartt.appendChild(tbl);
	for (var k in items) {
		var row = document.createElement("tr");
		row.name = k;
		row.innerHTML = "<td>"+items[k][0]+
			"</td><td><a class='mc'><span class='fa fa-minus-circle'/></a><span style='padding-left:5px;padding-right:5px;' class='cnt'>"+
			items[k][2]+"</span><a class='pc'><span class='fa fa-plus-circle'/></a></td><td style='text-align:right;'>"+
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

function OrderConfirmation(data) {
	var pane = document.getElementById('window');
	pane.innerHTML = "";
	if (data['attack']) {
		pane.innerHTML = "<h1 class='w3-display-middle w3-center'>"+data['attack']+"</h1>";
		return;
	}
	EmptyCart();
	var sheet = document.createElement('div');sheet.className='w3-container w3-card-4 w3-padding w3-center';sheet.style.width="100%";
	sheet.innerHTML += '<h2 class="w3-center">訂單號<br/>'+data['orderid']+'</h1>';
	var oldtitle = $(document).prop('title');
	$(document).prop('title', oldtitle+data['orderid']);
	var tbl = document.createElement('table');tbl.className ='w3-table w3-large';
	pane.appendChild(sheet);sheet.appendChild(tbl);var items = data['items'];
	tbl.innerHTML += '<tr><th>餐品</th><th style="text-align:right;">單價(CDN$)</th><th class="w3-right">數量</th></tr>'
	for (var i in items) {
		var tr = document.createElement('tr');item = items[i];
		tr.innerHTML = '<td>'+item[0]+'</td><td style="text-align:right;">'+parseFloat(item[1]).toFixed(2)+'</td><td class="w3-right">&times;'+item[2]+'</td>';
		tbl.appendChild(tr);
	}
	sheet.innerHTML += '<hr/>';var tbl2 = document.createElement('table');tbl2.className = 'w3-table w3-large';
	sheet.appendChild(tbl2);
	if (parseInt(data['otype'])==1){
		tbl2.innerHTML = '<tr><td><strong>送餐費</strong></td><td class="w3-right"><strong>CDN$'+parseFloat(data['deliveryfee']).toFixed(2)+'</strong></td></tr>';
	}
	if (data['tax']) {
		tbl2.innerHTML += '<tr><td><strong>稅金</strong></td><td class="w3-right"><strong>'+data['tax']+'</strong></td></tr>';
	}
	tbl2.innerHTML += '<tr><td><strong>總計</strong></td><td class="w3-right"><strong>CDN$'+data['total']+'</strong></td></tr>';
	sheet.innerHTML += '<hr/>';tbl3 = document.createElement('table');tbl3.className = 'w3-table w3-large';
	sheet.appendChild(tbl3);
	tbl3.innerHTML+='<tr><td><strong>訂餐人姓名</strong></td><td class="w3-right"><strong>'+data['name']+'</strong></td></tr>';
	tbl3.innerHTML+='<tr><td><strong>訂餐人聯繫方式</strong></td><td class="w3-right"><strong>'+data['contact']+'</strong></td></tr>';
	if (data['desc']) {
		tbl3.innerHTML+='<tr><td><strong>備註</strong></td><td class="w3-right"><strong>'+data['desc']+'</strong></td></tr>';
	}
	if (parseInt(data['otype'])==1){
		sheet.innerHTML += '<hr/>'; var tbl4 = document.createElement('table');tbl4.className = 'w3-table w3-small';
		sheet.appendChild(tbl4);
		tbl4.innerHTML = '<tr><td class="w3-left"><strong>送餐地址</strong></td></tr><tr><td class="w3-left"><strong>'+data['addr']+'</strong></td></tr>';
	} else {
		if (data['pickup'] != "" && data['pickuplink'] != "") {
			sheet.innerHTML += '<hr/>'; var tbl4 = document.createElement('table');tbl4.className = 'w3-table w3-small';
			sheet.appendChild(tbl4);
			tbl4.innerHTML = '<tr><td class="w3-left"><strong>取餐地址</strong></td></tr><tr><td class="w3-left"><a href="'+data['pickuplink']+'" target="_blank"><strong>'+data['pickup']+'</strong></a></td></tr>';
		}
	}
	var btn = document.createElement('input');btn.className = "btn btn-default";btn.value = "打印訂單";
	sheet.innerHTML += '<hr/>'; sheet.appendChild(btn);
	btn.onclick = (function(x){return function(){
		var old = x.style.display;
		x.style.display='none';
		window.print();
		x.style.display=old}})(btn);
}

function PlaceOrder(ioid,iot,iname,iaddr,icontact,idesc) {
	//check validity of the input
	var again = false;
	if (iname.value == ""){again = true;iname.parentNode.className='w3-border w3-border-red';}
	if (icontact.value == ""){again = true;icontact.parentNode.className="w3-border w3-border-red";}
	if (iot.value == 1 && iaddr.value == ""){again=true;iaddr.parentNode.className="w3-border w3-border-red";}
	if (again) {window.alert('需要填寫紅色標註的信息!');return;}
	var url = window.purlsafe;
	if (url == "") {window.alert("網頁未能正常載入!");}
	var data = {};
	data['otype'] = iot.value;data['name'] = iname.value;data['addr']=iaddr.value;
	data['contact']=icontact.value;data['desc']=idesc.value;data['orderid']=ioid;
	ajaxPost(url,data,function(content){OrderConfirmation(content);});
}
function PostSubmitOrder(items, url) {
	var taxrate = 0;
	if (items['taxrate']) {
		taxrate = parseFloat(items['taxrate']);
	}
	var orderid = items['orderid'];
	var sopt = items['sopt']; var topt = items['topt'];var total = parseFloat(items['total']);
	var deliveryfee = parseFloat(items['deliveryfee']);var deliverydesc = items['deliverydesc'];
	var pickup = items['pickup']; var pickuplink = items['pickuplink'];
	if (!deliveryfee) {deliveryfee = 0.0;deliverydesc="";}
	items = items['items'];
	if (!(orderid && items)) {
		return;
	} 
	pane = document.getElementById('window');
	pane.innerHTML = "";
	var title = document.createElement('h1');
	title.className = 'w3-padding w3-center';title.innerHTML = '訂單信息確認';
	var fd1 = document.createElement('h2');fd1.className = 'w3-padding';fd1.innerHTML = '訂單明細';
	pane.appendChild(title);pane.appendChild(fd1);
	var tbl = document.createElement('table');tbl.className = 'w3-table w3-animate-zoom w3-card-4 w3-bordered w3-hoverable w3-large';
	pane.appendChild(tbl);
	tbl.id="orderdetailt";
	for (var v in items) {
		v = items[v];
		var tr = document.createElement('tr');tr.className = 'w3-animate-zoom';
		tr.innerHTML = '<td>'+v[0] + '&times;' + v[2] +'</td>';
		tr.innerHTML += '<td class="w3-right">CDN$' +(parseFloat(v[2])*parseFloat(v[1])).toFixed(2) + '</td>';
		tbl.appendChild(tr);
	}
	var trx = document.createElement('tr');var trt = document.createElement('tr');var trd = document.createElement('tr');
	trx.className='w3-animate-zoom';trt.className = 'w3-animate-zoom'; trd.className = 'w3-animate-zoom';
	trx.innerHTML = '<td><strong>稅金</strong></td><td class="w3-right"><strong>CDN$<span id="taxf">'+(total*taxrate).toFixed(2)+'</span></strong></td>';
	trt.innerHTML = '<td><strong>總計</strong></td><td class="w3-right"><strong>CDN$<span id="totalf">'+(total*(1+taxrate)).toFixed(2)+'</span></strong></td>';
	trd.innerHTML = '<td><strong>送餐費</strong></td><td class="w3-right"><strong>CDN$'+deliveryfee.toFixed(2)+'</strong></td>';
	trd.style.display = 'none';tbl.appendChild(trd);if (taxrate !=0) { tbl.appendChild(trx); } tbl.appendChild(trt);
	var fd2 = document.createElement('h2');fd2.className = 'w3-padding';fd2.innerHTML = '訂餐人信息';
	pane.appendChild(fd2);
	var form = document.createElement('form');
	form.className = 'w3-container w3-padding w3-card-4 w3-animate-zoom';form.id='orderform';
	pane.appendChild(form);
	var iotp = document.createElement('p');iotp.className = "w3-animate-zoom";
	var iot = document.createElement('select');
	iot.id = "topt"; iot.name = 'topt';iot.className = 'form-control';
	var iotl = document.createElement('label');iotl.htmlFor = iot.id;
	var iotl2 = document.createElement('label');iotl2.htmlFor = iot.id;
	iotl.innerHTML = deliverydesc;iotl.className="w3-animate-zoom";iotl.style.display='none';
	iotl2.innerHTML = '<h5>取餐地址</h5><p><a class="w3-padding w3-center" target="_blank" href="'+pickuplink+'">'+pickup+'</a></p>';
	iotl2.className="w3-animate-zoom";iotl2.style.display='block';
	for (var i = 0; i < topt.length; ++i){
		var iopt = document.createElement('option');
		iopt.value = parseInt(topt[i][0]);
		iopt.innerHTML = topt[i][1];
		iot.appendChild(iopt);
	}
	iotp.appendChild(iotl);iotp.appendChild(iotl2);iotp.appendChild(iot); form.appendChild(iotp);
	var inamep = document.createElement('p'); inamep.className = "w3-animate-zoom";
	var iname = document.createElement('input');iname.required = true;
	iname.id = 'iname';iname.placeholder = '訂餐人姓名';iname.type = 'text';iname.style.width = '100%';
	iname.className = "w3-input w3-padding";iname.maxlength="100";
	iname.onchange = (function(obj){return function(){
		if (obj.value != "") {
		obj.parentNode.className = "w3-animate-zoom";}};})(iname);
	inamep.appendChild(iname); form.appendChild(inamep);
	var iaddrp = document.createElement('p');iaddrp.style.display = 'none';iaddrp.className = "w3-animate-zoom";
	var iaddr = document.createElement('input');
	iaddr.id = 'iaddr';iaddr.placeholder = '送餐地址';iaddr.type = 'text';iaddr.style.width = '100%';
	iaddr.className = "w3-input w3-padding";iaddr.maxlength="128";
	iaddr.onchange = (function(obj){return function(){
		if (obj.value != "") {
		obj.parentNode.className = "w3-animate-zoom";}};})(iaddr);
	iaddrp.appendChild(iaddr); form.appendChild(iaddrp);
	var icontactp = document.createElement('p');icontactp.className = "w3-animate-zoom";
	var icontact = document.createElement('input');
	icontact.id = 'icontact';icontact.placeholder = '訂餐人聯繫方式';icontact.required=true;
	icontact.type = 'text';icontact.style.width = '100%';
	icontact.className = "w3-input w3-padding"; 
	icontact.onchange = (function(obj){return function(){
		if (obj.value != "") {
		obj.parentNode.className = "w3-animate-zoom";}};})(icontact);
	icontactp.appendChild(icontact); form.appendChild(icontactp);
	iot.onchange = (function(obj1,obj2,obj3,obj4,obj5){return function(){
		if(obj1.value == topt[0][0]){obj2.style.display='none';obj5.style.display='none';obj3.style.display='block';
			obj4.style.display='none';document.getElementById('totalf').innerHTML=(total*(1+taxrate)).toFixed(2);
			document.getElementById('taxf').innerHTML=(total*taxrate).toFixed(2);
		}else{obj2.style.display='block';obj5.style.display='block';obj3.style.display='none';
			obj4.style.display='table-row';document.getElementById('totalf').innerHTML=((total+deliveryfee)*(1+taxrate)).toFixed(2);
			document.getElementById('taxf').innerHTML=((total+deliveryfee)*taxrate).toFixed(2);
		}
	};})(iot,iaddrp,iotl2,trd,iotl);
	var idescp = document.createElement('p');idescp.className = "w3-animate-zoom";
	var idesc = document.createElement('input');
	idesc.id = 'idesc';idesc.placeholder = '備註';
	idesc.type = 'text';idesc.style.width = '100%';
	idesc.className = "w3-input w3-padding";idesc.maxlength="128";
	idescp.appendChild(idesc); form.appendChild(idescp);
	var containb = document.createElement('div');containb.className = "w3-center w3-padding";
	containb.innerHTML = "<br/>"; pane.appendChild(containb);
	var submitb = document.createElement('button');submitb.type='submit';submitb.form = 'orderform';
	submitb.className = "btn btn-default";submitb.innerHTML = "確認訂單";
	containb.appendChild(submitb);
	submitb.onclick = (function(obj0,obj1,obj2,obj3,obj4,obj5){return function(){
		PlaceOrder(obj0,obj1,obj2,obj3,obj4,obj5);};})(orderid,iot,iname,iaddr,icontact,idesc);
}
function SubmitOrder(url) {
	var cart = GetCookie('cart');
	if (cart == "") {
		window.alert("您的訂餐車內沒有餐品!");
		return;
	}
	cart = JSON.parse(cart);
	$("#cartview").modal('toggle');
	ajaxPost(url,cart,PostSubmitOrder);
}

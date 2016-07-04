function ShowSortOptions(server) {
	str = document.getElementById("sort").value;
  var xhttp;
  if (str == "") {
    document.getElementById("txtHint").innerHTML = "";
    return;
  }
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
			var dishes = JSON.parse(xhttp.responseText).dishlist;
			for (var i in dishes) {
				document.getElementById("txtHint").innerHTML += dishes[i].zhtitle;
			}
    }
  };
	xhttp.open("GET", server+'?sort='+str, true);
  xhttp.send();
}

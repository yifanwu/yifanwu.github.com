var index = [];
index.push("#thinking");
index.push("#doing");
index.push("#being");
index.push("#resume");

var doings = [];
doings.push("#traveling");
doings.push("#photo_taking");
doings.push("#activities");	    
doings.push("#sports");

var countries =[];
countries.push("#america");
countries.push("#china");
countries.push("#india");
countries.push("#mexico");
countries.push("#uk");

var thinkings = [];
thinkings.push("#books");
thinkings.push("#movies");
thinkings.push("#music");
thinkings.push("#school");

var books = [];
books.push("#intothewild");
books.push("#1984")
books.push("#blink")
books.push("#thecatcher")

$(document).ready(function(){

	$("#thinking").click(function() {
		reveal("#thinking", index);
	})
	$("#doing").click(function() {
		reveal("#doing", index);
	})

	$("#being").click(function() {
		reveal("#being", index);
	})

	$("#resume").click(function() {
		reveal("#resume", index);
		$("#yui-main").hide();
		$("#header_text").hide();
	})

	$("#traveling").click(function() {
		reveal("#traveling", doings);
	})
	
	$("#india").click(function(){	
		reveal("#india", countries);

	})
	
	$("#mexico").click(function(){
		reveal("#mexico", countries);
	})

	$("#china").click(function(){
		reveal("#china", countries);
	})
	
	$("#books").click(function(){
		reveal("#books", thinkings);
	})

	$("#intothewild").click(function(){
		reveal("#intothewild", books);
	})


});

function ungray(id) {
	$(id).animate({
		    opacity: 1.0
	    },500);
}

function gray(id) {
	$(id).animate({
		    opacity: 0.5
	    },500);
}

function reveal(id, array) {
	for(var i=0;i<array.length;i++) {
		if(id != array[i]) {
			gray(array[i]);
			$(array[i]+"_details").hide();
		} else {
			ungray(array[i]);		
			$(array[i]+"_details").show();
		}
	}
}
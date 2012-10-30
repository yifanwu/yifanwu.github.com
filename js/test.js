$(document).ready(function() {

  
  $(document).keypress(function(e) {
    if(e.which == 13) {
      //$("#colorin").validate
      var value = $("#colorin").val(); 
      if (value.match(/^[0-9]{6}$/)) {
        //alert("got it");
        value="#"+value;
        $('body').css("background-color", value);      
      } else {
        alert("Please enter a six digit hex number");
      }
    }
  });
});

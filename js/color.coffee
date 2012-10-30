fade =(id)->
  $(id).delay(5000).fadeOut "slow"

$(document).ready ->
  $(document).keypress (e) ->
    value = undefined
    if e.which is 13
      value = $("#colorin").val()
      if value.match(/^[0-9]{6}$/)
        value = "#" + value
        $("body").css "background-color", value
        return $("#warning").hide()
      else
        $("#warning").show()
        return fade("#warning")
        
      
fade =(id)->
  $(id).delay(5000).fadeOut "slow"

$(document).ready ->
  $(document).keypress (e) ->
    value = undefined
    if e.which is 13
      regexIn = $("#regexin").val()
      regexIn = "/"+regexIn+"/"
      strIn = $("#strin").val()      
      if strIn.match(regexIn)
        $("#cong").show()
        $("#warning").hide()
        alert regexIn
      else
        alert regexIn
        $("#warning").show()
        fade "#warning"

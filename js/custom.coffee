# google analytics!
_gaq = _gaq or []
_gaq.push ["_setAccount", "UA-26483099-2"]
_gaq.push ["_setDomainName", "yifanwu.net"]
_gaq.push ["_trackPageview"]
(->
  ga = document.createElement("script")
  ga.type = "text/javascript"
  ga.async = true
  ga.src = ((if "https:" is document.location.protocol then "https://ssl" else "http://www")) + ".google-analytics.com/ga.js"
  s = document.getElementsByTagName("script")[0]
  s.parentNode.insertBefore ga, s
)()

#dynamically explaining
$(document).ready ->
  $(".nav-text").hide()
  $(".nav-headline").hover (->
    text = $($(this).siblings()[0]).html()
    $("#nav-current-text").hide().html(text).fadeIn "medium"
    window.scrollTo 0, 9999
  ), ->

  $("#title").mouseover ->
    $("#nav-current-text").html ""


#graying
ungray = (id) ->
  $(id).animate
    opacity: 1.0, 500
  #$(id).show()

gray = (id) ->
  $(id).animate
    opacity: 0.5, 500
  #$(id+"_details").hide()

reveal = (id,array) ->
    i = 0
    while i < array.length
      unless id is array[i]
        gray array[i]
        $(array[i]+"_details").hide() # + "_details"
      else
        ungray array[i]
        $(array[i]+"_details").show() #+ "_details"
      i++

countries = ["#america", "#china", "#india", "#mexico", "#uk","#taiwan"]

books = ["#intothewild", "#1984", "#blink", "#thecatcher"]   

photos = ["#charles","#harvard","#seattle","#india","#mexico","#newbedford","#parks","#uk"]

#allEle = countries.concat books
#allEle = allEle.merge countries books photos


$(document).ready ->

  ### traveling ###
  $("#india").click ->
    reveal "#india", countries
  $("#mexico").click ->
    reveal "#mexico", countries
  $("#china").click ->
    reveal "#china", countries
  $("#taiwan").click ->
    reveal "#taiwan", countries
  
  # photos
  $("#charles").click ->
    reveal "#charles", photos
  $("#harvard").click ->
    reveal "#harvard", photos
  $("#newbedford").click ->
    reveal "#newbedford", photos
  $("#seattle").click ->
    reveal "#seattle", photos
  $("#india").click ->
    reveal "#india", photos
  $("#mexico").click ->
    reveal "#mexico", photos
  $("#parks").click ->
    reveal "#parks", photos
  $("#uk").click ->
    reveal "#uk", photos
  
  ### books ###
  
  $("#intothewild").click ->
    reveal "#intothewild", books

  
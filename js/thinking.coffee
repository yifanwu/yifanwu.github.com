thinkings = []
thinkings.push "#books"
thinkings.push "#movies"
thinkings.push "#music"
thinkings.push "#school"
books = []
books.push "#intothewild"
books.push "#1984"
books.push "#blink"
books.push "#thecatcher"

$(document).ready ->
   
  $("#books").click ->
    reveal "#books", thinkings

  $("#intothewild").click ->
    reveal "#intothewild", books


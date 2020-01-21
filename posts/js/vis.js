var visLookup = (function () {
  function fallacies() {
    var spec = {
      "width": 800,
      "height": 800,
      "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
      "data": {
        "values": []
      },
      "mark": {
        "type": "circle",
        "size": 50,
        "opacity": 0.8
      },
      "encoding": {
        "y": {
          "field": "x",
          "type": "quantitative",
          "axis": {
            "labels": false,
            "ticks": false,
            "title": null
          }
        },
        "x": {
          "field": "y",
          "type": "quantitative",
          "axis": {
            "labels": false,
            "ticks": false,
            "title": null
          }
        },
        "color": {
          "field": "shoe_match",
          "type": "nominal"
        }
      }
    }

    function getShowInfo(step) {
      var values = [];
      for (let i = 0; i < 100; i++) {
        for (let j = 0; j < 100; j++) {
          let shoe = "false";
          if ((step == 1) && (i < 10) && (j == 0)) {
            shoe = "true";
          }
          values.push({"x": i, "y": j, "shoe_match": shoe})
        }
      }
      return values;
    }
  
    function draw(step) {
      spec["data"]["values"] = getShowInfo(step)
      console.log("script ran", spec);
      vegaEmbed('#chart', spec);
    }
    // starting with no info
    draw(0);
    $("#noInfoBtn").prop('disabled', true);

    $("#noInfoBtn").click($.proxy(() => {
      console.log("no info buttn");
      draw(0);
      $("#crimeCircle").css({fill: "rgb(76, 120, 168)"});
      $("#noInfoBtn").prop('disabled', true);
      $("#infoBtn").prop('disabled', false);
    }, this));
    $("#infoBtn").click($.proxy(() => {
      draw(1);
      console.log("info buttn");
      $("#crimeCircle").css({fill: "orange"});
      $("#infoBtn").prop('disabled', true);
      $("#noInfoBtn").prop('disabled', false);
    }, this));
  }
  var lookup = {
    "fallacies": fallacies
  };
  return lookup;
})();

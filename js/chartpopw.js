am5.ready(function() {
        var root = am5.Root.new("chartpopw");
        root.setThemes([am5themes_Animated.new(root)]);
        var chart = root.container.children.push(am5map.MapChart.new(root, {}));
        var polygonSeries = chart.series.push(
          am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow,
            exclude: ["AQ"]
          })
        );
        chart.children.unshift(am5.Label.new(root, {
          text: "",
          fontSize: 25,
          fontWeight: "500",
          textAlign: "center",
          x: am5.percent(70),
          centerX: am5.percent(50),
          paddingTop: 0,
          paddingBottom: 0
        }));
        var bubbleSeries = chart.series.push(
          am5map.MapPointSeries.new(root, {
            valueField: "value",
            calculateAggregates: true,
            polygonIdField: "id"
          })
        );
        var circleTemplate = am5.Template.new({});
        bubbleSeries.bullets.push(function(root, series, dataItem) {
          var container = am5.Container.new(root, {});
          var circle = container.children.push(
            am5.Circle.new(root, {
              radius: 20,
              fillOpacity: 0.7,
              fill: am5.color(0xbb9f06), //
              cursorOverStyle: "pointer",
              tooltipText: `{name}: [bold]{value}[/]`
            }, circleTemplate)
          );
          var countryLabel = container.children.push(
            am5.Label.new(root, {
              text: "{''}",
              paddingLeft: 5,
              populateText: true,
              fontWeight: "bold",
              fontSize: 13,
              centerY: am5.p50
            })
          );
          circle.on("radius", function(radius) {
            countryLabel.set("x", radius);
          })
          return am5.Bullet.new(root, {
            sprite: container,
            dynamic: true
          });
        });
        bubbleSeries.bullets.push(function(root, series, dataItem) {
          return am5.Bullet.new(root, {
            sprite: am5.Label.new(root, {
              text: "{value.formatNumber('#.')}",
              fill: am5.color(0x000000),
              populateText: true,
              centerX: am5.p50,
              centerY: am5.p50,
              textAlign: "center"
            }),
            dynamic: true
          });
        });
        bubbleSeries.set("heatRules", [
          {
            target: circleTemplate,
            dataField: "value",
            min: 10,
            max: 50,
            minValue: 0,
            maxValue: 100,
            key: "radius"
          }
        ]);
        
        //++++++++++++++++++++++++++++++++++
        updateData();
        setInterval(function() {
          updateData();
        }, 100000)

        function zeroData() {
          for (var i = 0; i < bubbleSeries.dataItems.length; i++) {
              bubbleSeries.data.setIndex(i, { value: 0 , id: nodes[i].id, name: nodes[i].id })
            }
        }
        async function updateData() {
          let response = await fetch('https://nosostats.com:49443/api/popwGlobe');
          let data = await response.json();
          bubbleSeries.data.setAll(data);
    	}
}); 
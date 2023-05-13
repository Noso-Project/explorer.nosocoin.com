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
              fill: am5.color(0xffffff), //
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


       <script>
            console.log('state :' , sessionStorage.state)
            if (window.menuState === 'nodes'){
            } else {
              document.getElementById("nodes").style.backgroundColor = "RGBA(96, 125, 139)";
              sessionStorage.setItem("state", 'nodes');nodes
              //pendingOrders()
              refreshNodes()
            }
            async function refreshNodes(){
              console.log('state inside refresh :' , sessionStorage.state)
              let response = await fetch(sessionStorage.apiServer + 'nodeList');
              let ourData = await response.json();
              document.getElementById("nodes").style.backgroundColor = "RGBA(96, 125, 139)";
              renderHTML(ourData);
              };
              function renderHTML(data) {
                    var rowCount = table1.rows.length; 
                    while(--rowCount) table1.deleteRow(rowCount);
                    // Add new
                    table1 = document.getElementById("table1");
                    for(let i = 0; i < data.length; i++){
                               // create a new row
                               var newRow = table1.insertRow(table1.length);
                               for(let j = 0; j < data[i].length; j++){
                                   // create a new cell
                                   var cell = newRow.insertCell(j);
                                   // add value to the cell
                                   cell.innerHTML = data[i][j];
                                   cell.addEventListener("click",function(e){ 
                                      e = this.textContent
                                      console.log(e)
                                      })
                               }
                           }
                  function getNumber(val) {
                     console.log(val)
                    }
                }
          </script>
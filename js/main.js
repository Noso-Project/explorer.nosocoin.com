            //--------------------------------------------------------------------------------
            //------------------------- Define the Active API Server -------------------------
            //--------------------------------------------------------------------------------
            let apiServer = 'https://nosostats.com:49443/api/' 
            sessionStorage.setItem("apiServer", apiServer);  
            //--------------------------------------------------------------------------------
            //------------------------------xxxxxxxxxxxxxx------------------------------------
            //--------------------------------------------------------------------------------

            if (sessionStorage.getItem('lastTimeInHistory') === null) {
              console.log('load history on startup')
              onLoad ()
            }
            async function onLoad (){
              sessionStorage.setItem("state", 'start');

              getPendingOrders ()

              //let response = await fetch(sessionStorage.apiServer +'poolsHistory/1');
              //let history = await response.json();
              //let nameArray = history [0]
              //let hashArray = history [1]
              //let minersArray = history [2]
              //let lastTimeInHistory = history [3]
              //startN = hashArray.length
              //sessionStorage.setItem('historyNameArray', JSON.stringify(nameArray));
              //sessionStorage.setItem('historyHashArray', JSON.stringify(hashArray));
              //sessionStorage.setItem('historyMinersArray', JSON.stringify(minersArray));
              //sessionStorage.setItem('lastTimeInHistory', JSON.stringify(lastTimeInHistory));
              //console.log(nameArray , hashArray , minersArray , lastTimeInHistory)
            }

            coldLoading()
            async function coldLoading (){
              let response = await fetch(sessionStorage.apiServer +'dBheight');
              let returnedBlock = await response.json();
              bestBlock = returnedBlock
              sessionStorage.setItem("bestBlock", bestBlock)
              start = sessionStorage.bestBlock -50
              end = start + 110
              sessionStorage.setItem("startBlockNumber", start);
              sessionStorage.setItem("endBlockNumber", end);
              //console.log(sessionStorage.bestBlock , sessionStorage.startBlockNumber , sessionStorage.endBlockNumber)
              ClockAndHeight ()
              refreshHeader()
            }

            async function getPendingOrders () {
              let response1 = await fetch(sessionStorage.apiServer + 'pendingOrders');
              let pendingOrders = await response1.json();
              sessionStorage.setItem('pendingOrders', JSON.stringify(pendingOrders));
            }

            var menuState  ;
            var timer  ;
            let blockArray = [];
            let difArray = [];
            let miniArray = [];
            window.timer = takeLastBlockTimestamp ()
            clients()
            mainLoop ()
            sols()
            //--------------------------------------------------------------------------------
            //------------------------------xxxxxxxxxxxxxx------------------------------------
            //--------------------------------------------------------------------------------
            setInterval(mainLoop, 5000);
            setInterval(postTime, 1000);
            setInterval(clients, 5000);
            setInterval(sols, 9000);
            //setInterval( refreshHistoryInSession, 10000);
            setInterval( getPendingOrders, 20000);

            async function refreshHistoryInSession (){
              if (sessionStorage.getItem('lastTimeInHistory') != null) {
                  lastInlocalHistory = JSON.parse(sessionStorage.getItem('lastTimeInHistory'))
                  console.log ('try to update')
                  let response = await fetch(sessionStorage.apiServer +'poolsHistory/' + lastInlocalHistory);
                  let dataToUpdate = await response.json();
                  console.log('Send request with : ' , lastInlocalHistory)
                  console.log('Api response : ' , dataToUpdate)
                  ask = JSON.parse(sessionStorage.getItem('historyHashArray'))
                  ask1 = ask[0]
                  Q = ask1.length
                  console.log('records in history : ' , Q)
                  
                  if (dataToUpdate != 'false') {
                    console.log('analyzed : ' , ask)
                    startN = JSON.parse(sessionStorage.getItem('startN'))
                    curentNameArray = JSON.parse(sessionStorage.getItem('historyNameArray'))
                    curentHashArray = JSON.parse(sessionStorage.getItem('historyHashArray'))
                    curentMinersArray = JSON.parse(sessionStorage.getItem('historyMinersArray'))
                    console.log('existedCurentNameArray : ' , curentNameArray)
                    console.log('existedCurentHashArray : ' , curentHashArray)
                    console.log('existedCurentMinersArray : ' , curentMinersArray)

                    arrivedNameArray = dataToUpdate [0]
                    arrivedHashArray = dataToUpdate [1]
                    arrivedMinersArray = dataToUpdate [2]
                    arrivedLast = dataToUpdate [3]

                    if (curentNameArray.length == arrivedNameArray.length){
                      for (i = 0; i < arrivedHashArray.length; i++ ){
                        curentHashArray[i].push(arrivedHashArray[i][0])
                        curentMinersArray[i].push(arrivedMinersArray[i][0])
                      } 

                      sessionStorage.removeItem('historyHashArray')
                      sessionStorage.removeItem('historyMinersArray')
                      sessionStorage.removeItem('lastInlocalHistory')
                    
                      sessionStorage.setItem('historyHashArray', JSON.stringify(curentHashArray));
                      sessionStorage.setItem('historyMinersArray', JSON.stringify(curentMinersArray));
                      sessionStorage.setItem('lastTimeInHistory', arrivedLast);
                      newEllements = arrivedHashArray.length
                      
                      console.log('UpdtedCurentNameArray : ' , curentNameArray)
                      console.log('UpdtedCurentHashArray : ' , curentHashArray)
                      console.log('UpdtedCurentMinersArray : ' , curentMinersArray)

                      }else{
                        sessionStorage.removeItem('historyNameArray')
                        sessionStorage.removeItem('historyHashArray')
                        sessionStorage.removeItem('historyMinersArray')
                        sessionStorage.removeItem('lastInlocalHistory')
                        onLoad ()
                        console.log('ask for all history ... new pool added????')
                      }
                    }
                }
            }
            //--------------------------------------------------------------------------------
            //------------------------------xxxxxxxxxxxxxx------------------------------------
            //--------------------------------------------------------------------------------
            function explorer(){
              document.getElementById("explorer").style.backgroundColor = "RGBA(207,207,0,0.56)";
              if (sessionStorage.state != 'explorer') {
                window.location = "explorer.html";
              }else{
                console.log ('Cant send to explorer ...you are already ')
                document.getElementById("explorer").style.backgroundColor = "RGBA(0,207,0,0.56)";;
              }
              };
            //--------------------------------------------------------------------------------
            function explorer1(){
              document.getElementById("explorer1").style.backgroundColor = "RGBA(207,207,0,0.56)";
              if (sessionStorage.state != 'explorer1') {
                window.location = "explorer1.html";
              }else{
                console.log ('Cant send to explorer1 ...you are already ')
                document.getElementById("explorer1").style.backgroundColor = "RGBA(0,207,0,0.56)";;
              }
              };
            //--------------------------------------------------------------------------------
            function nodes(){
              document.getElementById("nodes").style.backgroundColor = "RGBA(207,207,0,0.56)";
              if (sessionStorage.state != 'nodes') {
                window.location = "nodes.html";
              }else{
                console.log ('Cant send to nodes ...you are already ')
                document.getElementById("nodes").style.backgroundColor = "RGBA(0,207,0,0.56)";;
              }
              };
            //--------------------------------------------------------------------------------
            function map(){
              document.getElementById("map").style.backgroundColor = "RGBA(207,207,0,0.56)";
              if (sessionStorage.state != 'map') {
                window.location = "map.html";
              }else{
                console.log ('Cant send to map ...you are already ')
                document.getElementById("map").style.backgroundColor = "RGBA(0,207,0,0.56)";;
              }
              };
            //--------------------------------------------------------------------------------
            function pools(){
              document.getElementById("pools").style.backgroundColor = "RGBA(207,207,0,0.56)";
              if (sessionStorage.state != 'pools') {
                window.location = "pools.html";
              }else{
                console.log ('Cant send to pools ...you are already ')
                document.getElementById("pools").style.backgroundColor = "RGBA(0,207,0,0.56)";;
              }
              };
            //--------------------------------------------------------------------------------
            function CandA(){
              document.getElementById("CandA").style.backgroundColor = "RGBA(207,207,0,0.56)";
              if (sessionStorage.state != 'CandA') {
                window.location = "CandA.html";
              }else{
                console.log ('Cant send to CandA ...you are already ')
                document.getElementById("CandA").style.backgroundColor = "RGBA(0,207,0,0.56)";;
              }
              };
            //--------------------------------------------------------------------------------
            //------------------------------xxxxxxxxxxxxxx------------------------------------
            //--------------------------------------------------------------------------------
            function restartTime (){
              let timer = Date.now()/1000;
              return timer
            }
            //--------------------------------------------------------------------------------
            //------------------------------xxxxxxxxxxxxxx------------------------------------
            //--------------------------------------------------------------------------------
            function myFunction(){
              console.log('click!!!')
              return
            }
            //--------------------------------------------------------------------------------
            //------------------------------xxxxxxxxxxxxxx------------------------------------
            //--------------------------------------------------------------------------------
            function postTime (){
              value = window.timer - Math.round((Date.now()/1000));
              timeValue = 600 - value
              sessionStorage.setItem("timeValue", timeValue);
              if(value < 0) {
                value = 'update chain'
              }
            }
            //--------------------------------------------------------------------------------
            //-----------------------xxxxxxxxxxxxxxxxxxxxxxxxxxx------------------------------
            //--------------------------------------------------------------------------------
            async function takeLastBlockTimestamp () {
              let response = await fetch(sessionStorage.apiServer + 'endOfBlockInUnix');
              let resault = await response.json();
              bestTimeStamp = resault ;
              timer = bestTimeStamp
              return timer
              }
            //--------------------------------------------------------------------------------
            //------------------------------ Main Loop ---------------------------------------
            //--------------------------------------------------------------------------------
            async function mainLoop(){
              if (sessionStorage.bestBlock == 0 ){
                refreshHeader()
                let response = await fetch(sessionStorage.apiServer +'dBheight');
                let returnedBlock = await response.json();
                walletHeight = returnedBlock
                sessionStorage.setItem("bestBlock", walletHeight)
              }
              else {
                let response = await fetch(sessionStorage.apiServer +'dBheight');
                let returnedBlock = await response.json();
                walletHeight = returnedBlock
                scanForNewBlock(walletHeight)
                sessionStorage.setItem("bestBlock", walletHeight)
              }
              console.log( 'Reported height from  API Server :' , walletHeight)
              console.log( 'Reported height from  LocalHost  :' , sessionStorage.bestBlock)
            }
            //--------------------------------------------------------------------------------
            //--------------- Chech if New block comes ... -----------------------------------
            //--------------------------------------------------------------------------------
            async function scanForNewBlock(walletHeight) {
              console.log('active state : ' , sessionStorage.state)
              if (sessionStorage.bestBlock != walletHeight) {
                console.log ('New Block...fireUp!!!')
                sols()
                window.timer = takeLastBlockTimestamp ()
                sessionStorage.setItem("bestBlock", walletHeight)
                //x = bestBlockHere;
                window.timer = restartTime ()
                //document.getElementById("heightBody").innerHTML = 'New Block';
                //document.getElementById("heightBody").innerHTML = x;
                newBlockRefreshPage()
              }else{
               
              }
            }
            //--------------------------------------------------------------------------------
            //-------------------- Refresh active page on new block --------------------------
            //--------------------------------------------------------------------------------
            async function newBlockRefreshPage() {
              //if (window.location === sessionStorage.state)
                refreshHeader()
                if (sessionStorage.state === 'explorer')  {
                  refreshExplorer()
                }
                if (sessionStorage.state === 'explorer1'){
                  refreshExplorer1()
                }
                if (sessionStorage.state === 'nodes'){
                    refreshNodes()
                }
                //if (sessionStorage.state === 'map'){
                //  refreshMap()
                //}
                if (sessionStorage.state === 'pools'){
                  refreshPools()
                }
                if (sessionStorage.state === 'CandA'){
                  refreshCandA()
                }
            }
            //--------------------------------------------------------------------------------
            //------------------- Refresh everything needed in header ------------------------
            //--------------------------------------------------------------------------------              
            async function refreshHeader(){
              let blockArray = []
              let mnArray = []
              let tArray = []
              let totalPosArray = []
              posAndMns()
              // +++++++++++++++++++++++++++++++++
              //let server = sessionStorage.apiServer
              //let response = await fetch(sessionStorage.apiServer + 'qMnOverLast144');
              //let data = await response.json();
              //data.forEach(row => {
              //  let block = row[0];
              //  blockArray.push(block);
              //  let Qmn = row[1];
              //  mnArray.push(Qmn);
              //})
              //nodesOverTime(blockArray , mnArray)
              // +++++++++++++++++++++++++++++++++
              let response1 = await fetch(sessionStorage.apiServer + 'posLast30');
              let data1 = await response1.json();
              data1.forEach(row => {
                let date = row[0];
                tArray.push(date);
                let pos = row[1];
                totalPosArray.push(pos);
              })
              //pos30T(tArray , totalPosArray )
              // +++++++++++++++++++++++++++++++++
              Array1Blocks= []
              NofOrdersArray = []
              NofAmount1Array = []
              let response2 = await fetch(sessionStorage.apiServer + '24hOrdersAmounts');
              let data2 = await response2.json();
              data2.forEach(row => {
                let block1 = row[0];
                Array1Blocks.push(block1);
                let NofOrders = row[1];
                NofOrdersArray.push(NofOrders);
                let amount1 = row[2];
                NofAmount1Array.push(amount1);
              }) 
              // +++++++++++++++++++++++++++++++++
              let distributionValues = []
              let response3 = await fetch(sessionStorage.apiServer + 'newCoinsDistribution');
              let data3 = await response3.json();
              let blockReward = data3['blockReward'];
              let mnsInNoso = data3['mnsInNoso'];
              distributionValues.push(mnsInNoso);
              let posInNoso = data3['posInNoso'];
              distributionValues.push(posInNoso);
              let powInNoso = data3['powInNoso'];
              distributionValues.push(powInNoso);
              // +++++++++++++++++++++++++++++++++
              //start = sessionStorage.bestBlockNumber -50
              //end = start + 110
              //sessionStorage.setItem("startBlockNumber", start);
              //sessionStorage.setItem("endBlockNumber", end);
              
              newCoins (distributionValues)
              amountsPerBlock (Array1Blocks , NofAmount1Array )
              ordersPerBlock (Array1Blocks , NofOrdersArray)
              
            }
            //--------------------------------------------------------------------------------
            //------------------------ Online Nodes (last 100? Blocks) -----------------------
            //--------------------------------------------------------------------------------
            function nodesOverTime (blockArray , mnArray) {
                var ctx = document.getElementById('blockTime').getContext("2d");
                if (window.myblockTime != undefined)
                  window.myblockTime.destroy();
                    window.myblockTime = new Chart(ctx, {
                          type: 'line',
                          data: {
                            labels: blockArray,
                            datasets: [
                              {
                              fill: true,
                              data: mnArray ,
                              backgroundColor: 'RGBA(198,87,53,.2)',
                              borderColor: 'RGBA(198,87,53,1)',
                              borderWidth: 1
                              },
                            ]
                          },
                          options: {
                            tooltips: {
                              mode: 'index',
                              intersect: false
                              },
                            hover: {
                               mode: 'index',
                               intersect: false
                              },
                            plugins: {
                              tooltip: {
                                yAlign: 'center'
                              },
                              title: {
                                display: true,
                                //text: ''
                              }
                            },
                            layout: {
                              padding: {
                                top: 5 ,
                                right: 10
                              }
                            },
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                  xAxes: [{
                                      display : false,
                                      ticks: {
                                          fontSize: 5
                                        }
                                    }],
                                  yAxes: [{
                                    display :true,
                                      ticks: {
                                        type: 'linear',
                                          display : true,
                                          fontSize: 5,
                                          stepSize : 1,
                                        }
                                    }],
                              },
                              legend: {
                                  display: false
                                },
                              elements: {
                                point:{
                                  radius: 0
                                }
                              },
                                animation: {
                                  duration: 000,
                              },
                            }
                      });
              }
              //--------------------------------------------------------------------------------
              //----------------------- No Of Orders/Block (last 144 blocks) -------------------
              //--------------------------------------------------------------------------------
              function ordersPerBlock (blockArray , NofOrdersArray) {
                  console.log( NofOrdersArray)
                  var ctx = document.getElementById('mini').getContext("2d");
                  if (window.mymini != undefined)
                    window.mymini.destroy();
                      window.mymini = new Chart(ctx, {
                            type: 'bar',
                            data: {
                              labels: blockArray,
                              datasets: [{
                                fill: true,
                                //label: 'UTXO in chain',
                                data: NofOrdersArray ,
                                backgroundColor: 'RGBA(198,87,53,.2)',
                                borderColor: 'RGBA(198,87,53,1)',
                                borderWidth: 1
                              }]
                            },
                            options: {
                              hover: {
                                yAlign: 'top',
                                  mode: 'index',
                                  intersect: false
                               },
                              plugins: {
                                tooltip: {
                                  yAlign: 'center'
                                },
                                title: {
                                  display: true,
                                  //text: ''
                                }
                              },
                              layout: {
                                padding: {
                                  top: 5 ,
                                  right: 10
                                }
                              },
                              responsive: true,
                              maintainAspectRatio: false,
                              scales: {
                                    xAxes: [{
                                      display : false,
                                        ticks: {

                                            fontSize: 5
                                          }
                                      }],
                                    yAxes: [{
                                      type: 'logarithmic',
                                        display : true,
                                        ticks: {
                                          display : false,
                                            fontSize: 5,
                                            stepSize : 1,
                                          }
                                      }],
                                },
                                legend: {
                                    display: false
                                  },
                                elements: {
                                  point:{
                                    radius: 0
                                  }
                                },
                                  animation: {
                                    duration: 000,
                                },
                                //label: 'unspent transactions(s) output',
                                //maintainAspectRatio: false,

                              }
                        });
                }
              //--------------------------------------------------------------------------------
              //--------------------- Amounts/Block  (last 144 blocks) -------------------------
              //--------------------------------------------------------------------------------
              function amountsPerBlock (blockArray , NofAmount1Array) {
                var ctx = document.getElementById('mid').getContext("2d");
                if (window.mymid != undefined)
                  window.mymid.destroy();
                    window.mymid = new Chart(ctx, {
                          type: 'bar',
                          data: {
                            labels: blockArray,
                            datasets: [
                              {
                              fill: true,
                              data: NofAmount1Array ,
                              backgroundColor: 'RGBA(198,87,53,.2)',
                              borderColor: 'RGBA(198,87,53,1)',
                              borderWidth: 1
                              },
                            ]
                          },
                          options: {
                            tooltips: {
                              mode: 'index',
                              intersect: false
                              },
                            hover: {
                               mode: 'index',
                               intersect: false
                              },
                            plugins: {
                              tooltip: {
                                yAlign: 'center'
                              },
                              title: {
                                display: true,
                                //text: ''
                              }
                            },
                            layout: {
                              padding: {
                                top: 5 ,
                                right: 10
                              }
                            },
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                  xAxes: [{
                                    display : false,
                                      ticks: {

                                          fontSize: 5
                                        }
                                    }],
                                  yAxes: [{
                                    type: 'logarithmic',
                                      display : true,
                                      ticks: {
                                        display : false,
                                          ontSize: 5,
                                          stepSize : 1,
                                        }
                                    }],
                              },
                            legend: {
                                display: false
                              },
                            elements: {
                              point:{
                                radius: 0
                              }
                            },
                            animation: {
                              duration: 000,
                            },
                          }
                      });
              }
              //--------------------------------------------------------------------------------
              //--------------------------- Pos address history (30 days) ----------------------
              //--------------------------------------------------------------------------------
              function pos30T (tArray , totalPosArray) {
                  //console.log(blockArray , miniArray)
                  var ctx = document.getElementById('networkStats').getContext("2d");
                  if (window.mynetworkStats != undefined)
                    window.mynetworkStats.destroy();
                      window.mynetworkStats = new Chart(ctx, {
                            type: 'line',
                            data: {
                              labels: tArray,
                              datasets: [
                                {fill: false,
                                  data: totalPosArray ,
                                  pointRadius: 0,
                                  label: 'PoS Addresses',
                                  //backgroundColor: 'RGBA(198,87,53,1)',
                                  borderColor: 'RGBA(0,0,200,1)',
                                  borderWidth: 1
                                  },
                              ]
                            },
                            options: {
                              title: {
                                display: false,
                                text: 'PoS Addresses'
                                },
                             hover: {
                              yAlign: 'top',
                                mode: 'index',
                                intersect: false
                             },
                              responsive: true,
                              interaction: {
                                mode: 'index',
                                intersect: true,
                              },
                              stacked: true,
                              responsive: true,
                                interaction: {
                                  mode: 'index',
                                  intersect: true,
                                },
                                plugins: {
                                  tooltip: {
                                    yAlign: 'center'
                                  },
                                  callbacks: {
                                  
                                  }
                                },
                              layout: {
                                padding: {
                                  top: 5 ,
                                  right: 10
                                }
                              },
                              responsive: true,
                              maintainAspectRatio: false,
                              scales: {
                                        xAxes: [{
                                          display : true,
                                            ticks: {
                                            display : true,
                                              fontSize: 5
                                              }
                                          }],
                                        yAxes: [{
                                                display : true,
                                                type: 'linear',
                                                position: 'left',
                                                ticks: {
                                                  display : true,
                                                  fontSize: 5,
                                                  stepSize : 5,
                                              }
                                          }],
                                },
                                legend: {
                                    display: false
                                  },
                                elements: {
                                  point:{
                                    radius: 0
                                  }
                                },
                                  animation: {
                                    duration:000,
                                },
                              }
                        });
                  }
              //--------------------------------------------------------------------------------
              //------------------------------ Pending Orders ----------------------------------
              //--------------------------------------------------------------------------------
              async function pendingOrders () {
                ClockAndHeight ()
                //console.log(start,end)
                am5.ready(function() {
                  var root = am5.Root.new("big");
                  root.setThemes([
                    am5themes_Animated.new(root)
                  ]);
                  function generateChartData() {
                    var chartData = [];
                    var firstDate = new Date();
                    firstDate.setDate(firstDate.getDate() );
                    firstDate.setHours(0, 0, 0, 0);
                    apiData =0;
                    for (var i = 0; i < 20; i++) {
                      var newDate = new Date(firstDate);
                      newDate.setSeconds(newDate.getSeconds() );
                      if (i == 0) {
                        value = 0 ;
                      }
                      else {
                        value = 0;
                      }
                      chartData.push({
                        date: newDate.getTime(),
                        value: value
                      });
                    }
                    return chartData;
                  }
                  var data = generateChartData();
                  var chart = root.container.children.push(am5xy.XYChart.new(root, {
                    focusable: true,
                    panX: true,
                    panY: true,
                    wheelX: "panX",
                    wheelY: "zoomX",
                    pinchZoomX:true
                  }));
                  var easing = am5.ease.linear;
                  var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
                    maxDeviation: 0.5,
                    groupData: false,
                    extraMax:0.1, 
                    extraMin:-0.1,
                    baseInterval: {
                      timeUnit: "second",
                      count: 1
                    },
                    renderer: am5xy.AxisRendererX.new(root, {
                      minGridDistance: 60
                    }),
                    tooltip: am5.Tooltip.new(root, {})
                  }));
                  var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
                    min: 0,
                    renderer: am5xy.AxisRendererY.new(root, {})
                  }));
                  var series = chart.series.push(am5xy.LineSeries.new(root, {
                    name: "Series 1",
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueYField: "value",
                    valueXField: "date",
                    tooltip: am5.Tooltip.new(root, {
                      pointerOrientation: "horizontal",
                      labelText: "{valueY}"
                    })
                  }));
                  data[data.length - 1].bullet = true;
                  series.data.setAll(data);
                  series.bullets.push(function(root, series, dataItem) {  
                    if (dataItem.dataContext.bullet) {    
                      var container = am5.Container.new(root, {});
                      var circle0 = container.children.push(am5.Circle.new(root, {
                        radius: 2,
                        fill: am5.color(0xff0000)
                      }));
                      var circle1 = container.children.push(am5.Circle.new(root, {
                        radius: 5,
                        fill: am5.color(0xff0000)
                      }));
                      circle1.animate({
                        key: "radius",
                        to: 10,
                        duration: 2000,
                        easing: am5.ease.out(am5.ease.cubic),
                        loops: Infinity
                      });
                      circle1.animate({
                        key: "opacity",
                        to: 0,
                        from: 1,
                        duration: 2000,
                        easing: am5.ease.out(am5.ease.cubic),
                        loops: Infinity
                      });
                      return am5.Bullet.new(root, {
                        locationX:undefined,
                        sprite: container
                      })
                    }
                  })
                  var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
                    xAxis: xAxis
                  }));
                  cursor.lineY.set("visible", false);
                  lastValue = 0
                  addData()
                  setInterval(function () {
                    addData();
                  }, 20000)

                  async function addData() {
                    var lastDataItem = series.dataItems[series.dataItems.length - 1];
                    var lastValue = lastDataItem.get("valueY");
                    newValue  = JSON.parse(sessionStorage.getItem('pendingOrders'))
                    let timeStamp = newValue['timeStamp'];
                    let orders = newValue['pendingOrders'];
                    console.log(timeStamp , orders)

                    var newValue = orders
                    var lastDate = new Date(lastDataItem.get("valueX"));
                    var time = am5.time.add(new Date(lastDate), "second", 20).getTime();
                    series.data.removeIndex(0);
                    series.data.push({
                      date: time,
                      value: newValue
                    })
                    var newDataItem = series.dataItems[series.dataItems.length - 1];
                    newDataItem.animate({
                      key: "valueYWorking",
                      to: newValue,
                      from: 0,
                      duration: 600,
                      easing: easing
                    });
                    newDataItem.bullets = [];
                    newDataItem.bullets[0] = lastDataItem.bullets[0];
                    newDataItem.bullets[0].get("sprite").dataItem = newDataItem;
                    lastDataItem.dataContext.bullet = false;
                    lastDataItem.bullets = [];
                    var animation = newDataItem.animate({
                      key: "locationX",
                      to: 0.5,
                      from: -0.5,
                      duration: 000
                    });
                    if (animation) {
                      var tooltip = xAxis.get("tooltip");
                      if (tooltip && !tooltip.isHidden()) {
                        animation.events.on("stopped", function () {
                          xAxis.updateTooltip();
                        })
                      }
                    }
                  }
                  chart.appear(1000, 100);
                  }); 
                }
              //--------------------------------------------------------------------------------
              //------------------------------Clock & Height -----------------------------------
              //--------------------------------------------------------------------------------
              async function ClockAndHeight () {
                am5.ready(function() {
                  var root = am5.Root.new("newCounter");
                  root.setThemes([
                    am5themes_Animated.new(root)
                  ]);
                  var chart = root.container.children.push(am5radar.RadarChart.new(root, {
                    panX: false,
                    panY: false,
                    startAngle: 180,
                    endAngle: 360,
                    radius: am5.percent(85),
                    layout: root.verticalLayout
                  }));
                  var colors = am5.ColorSet.new(root, {
                    step: 2
                  });
                  //----------------------------------------------------------------------
                  // ------------------- Measurement #1 (clock) --------------------------
                  //----------------------------------------------------------------------
                  // Axis
                  var color1 = colors.next();
                  var axisRenderer1 = am5radar.AxisRendererCircular.new(root, {
                    radius: -10,
                    stroke: color1,
                    strokeOpacity: 1,
                    strokeWidth: 6,
                    inside: true
                  });
                  axisRenderer1.grid.template.setAll({
                    forceHidden: false
                  });
                  axisRenderer1.ticks.template.setAll({
                    stroke: color1,
                    visible: true,
                    length: 10,
                    strokeOpacity: 1,
                    inside: true
                  });
                  axisRenderer1.labels.template.setAll({
                    radius: 15,
                    inside: true
                  });
                  var xAxis1 = chart.xAxes.push(am5xy.ValueAxis.new(root, {
                    maxDeviation: 0,
                    min: 0,
                    max: 640,
                    strictMinMax: true,
                    renderer: axisRenderer1
                  }));
                  // Label
                  var label1 = chart.seriesContainer.children.push(am5.Label.new(root, {
                    fill: am5.color(0xffffff),
                    x: -50,
                    y: -12,
                    width: 50,
                    centerX: am5.percent(50),
                    textAlign: "center",
                    centerY: am5.percent(50),
                    fontSize: "14px",
                    text: sessionStorage.timeValue,
                    background: am5.RoundedRectangle.new(root, {
                      fill: color1
                    })
                  }));
                  // Add clock hand
                  var axisDataItem1 = xAxis1.makeDataItem({
                    value: sessionStorage.timeValue,
                    fill: color1,
                    name: "Countdown"
                  });
                  var clockHand1 = am5radar.ClockHand.new(root, {
                    pinRadius: 14,
                    radius: am5.percent(98),
                    bottomWidth: 10
                  });
                  clockHand1.pin.setAll({
                    fill: color1
                  });
                  clockHand1.hand.setAll({
                    fill: color1
                  });
                  var bullet1 = axisDataItem1.set("bullet", am5xy.AxisBullet.new(root, {
                    sprite: clockHand1
                  }));
                  xAxis1.createAxisRange(axisDataItem1);
                  axisDataItem1.get("grid").set("forceHidden", true);
                  axisDataItem1.get("tick").set("forceHidden", true);
                  //----------------------------------------------------------------------
                  // ------------------- Measurement #2 (block) --------------------------
                  //----------------------------------------------------------------------
                  // Axis
                  var color2 = colors.next();
                  var axisRenderer2 = am5radar.AxisRendererCircular.new(root, {
                    innerRadius: -40,
                    stroke: color2,
                    strokeOpacity: 1,
                    strokeWidth: 6
                  });
                  axisRenderer2.grid.template.setAll({
                    forceHidden: true
                  });
                  axisRenderer2.ticks.template.setAll({
                    stroke: color2,
                    visible: true,
                    length: 10,
                    strokeOpacity: 1
                  });
                  axisRenderer2.labels.template.setAll({
                    radius: 15
                  });
                  var xAxis2 = chart.xAxes.push(am5xy.ValueAxis.new(root, {
                    maxDeviation: 0,
                    min: start,
                    max: end,
                    strictMinMax: true,
                    renderer: axisRenderer2
                  }));
                  // Label
                  var label2 = chart.seriesContainer.children.push(am5.Label.new(root, {
                    fill: am5.color(0xffffff),
                    x: 50,
                    y: -12,
                    width: 70,
                    centerX: am5.percent(50),
                    textAlign: "center",
                    centerY: am5.percent(50),
                    fontSize: "14px",
                    text: sessionStorage.bestBlock,
                    background: am5.RoundedRectangle.new(root, {
                      fill: color2
                    })
                  }));
                  // Add clock hand
                  var axisDataItem2 = xAxis2.makeDataItem({
                    value: sessionStorage.bestBlock,
                    fill: color2,
                    name: "Height"
                  });
                  var clockHand2 = am5radar.ClockHand.new(root, {
                    pinRadius: 10,
                    radius: am5.percent(98),
                    bottomWidth: 10
                  });
                  clockHand2.pin.setAll({
                    fill: color2
                  });
                  clockHand2.hand.setAll({
                    fill: color2
                  });
                  var bullet2 = axisDataItem2.set("bullet", am5xy.AxisBullet.new(root, {
                    sprite: clockHand2
                  }));
                  xAxis2.createAxisRange(axisDataItem2);
                  axisDataItem2.get("grid").set("forceHidden", true);
                  axisDataItem2.get("tick").set("forceHidden", true)
                  // Animate values
                  //addData()
                  setInterval(function () {
                    addData();
                  }, 500)
                //++++++++++++++++++++++++++++++++++++++++++
                 function addData () {
                    var value1 = sessionStorage.timeValue;
                    axisDataItem1.animate({
                      key: "value",
                      to: value1,
                      duration: 500,
                      easing: am5.ease.out(am5.ease.cubic)
                    });
                    label1.set("text", value1);
                    start = sessionStorage.startBlockNumber;
                    end = sessionStorage.endBlockNumber;
                    var value2 =sessionStorage.bestBlock;
                    axisDataItem2.animate({
                      key: "value",
                      to: value2,
                      duration: 500,
                      easing: am5.ease.out(am5.ease.cubic)
                    });
                    label2.set("text", value2);
                  }
                  chart.appear(3000, 100);
                  }); 
                }
              //---------------------------------------------------------------------------
              //------------------------------New coins------------------------------------
              //---------------------------------------------------------------------------
              function newCoins(distributionValues ) {
                console.log('distribution' , distributionValues)
                var ctx = document.getElementById('distributionCanvas').getContext("2d");
                if (window.mydistributionCanvas != undefined)
                  window.mydistributionCanvas.destroy();
                    window.mydistributionCanvas = new Chart(ctx, {
                          type: 'doughnut',
                          data: {
                            labels:["MN's", 'ProjectFunds' , 'PoPW'],
                            datasets: [
                              {fill: true,
                                data: distributionValues ,
                                pointRadius: 2,
                                //labels: monthMinerArray,
                                backgroundColor: [
                                'rgb(21, 67, 96)',
                                  'rgb(23, 165, 137)',
                                  'rgb(120, 66, 18)',
                                  'rgb(218, 247, 166)',
                                 
                                  ],
                                borderColor: 'RGBA(255,255,255,.5)',
                                borderWidth: 3
                                },
                            ]
                          },
                          options: {
                            title: {
                                display: true,
                                text: 'New coins distribution (NOSO)'
                                },
                            animations: {
                              tension: {
                                duration: 1000,
                                easing: 'linear',
                                from: 1,
                                to: 0,
                                loop: true
                              }
                            },
                            label: "My Chart",
                           hover: {
                            yAlign: 'top',
                              mode: 'index',
                              callback: value => value + ' NOSO',
                              intersect: false
                           },
                            responsive: true,
                            interaction: {
                              mode: 'index',
                              intersect: false,
                            },
                            stacked: true,
                              interaction: {
                                mode: 'index',
                                intersect: false,
                              },
                            layout: {
                              padding: {
                                top: 5 ,
                                right: 10
                              }
                            },
                            maintainAspectRatio: false,
                            scales: {
                                      xAxes: [{
                                        display :false,
                                          ticks: {
                                          display :false,
                                            fontSize: 12
                                            }
                                        }],
                                      yAxes: [{
                                              display :false,
                                              type: 'linear',
                                              position: 'left',
                                              ticks: {
                                                display :false,
                                                fontSize: 12,
                                                //stepSize : 1,
                                            }
                                        }],
                              },
                              legend: {
                                position: 'left',
                                  display: true,
                                },
                              elements: {
                                point:{
                                  radius: 0
                                }
                              },
                                animation: {
                                  duration:000,
                              },
                            }
                      });
              }
              //--------------------------------------------------------------------------------
              //----------------------------- Clients on Menu ----------------------------------
              //--------------------------------------------------------------------------------                  
              async function clients (){
                abreviasionArray = []
                numberArray = []
                let response = await fetch(sessionStorage.apiServer + 'reportClients');
                let data = await response.json();
                data.forEach(row => {
                  let abreviasion = row[0];
                  abreviasionArray.push(abreviasion);
                  let number = row[1];
                  numberArray.push(number);
                  })
                var ctx = document.getElementById('clientCanvas').getContext("2d");
                if (window.mybclientCanvas != undefined)
                  window.mybclientCanvas.destroy();
                    window.mybclientCanvas = new Chart(ctx, {
                          type: 'bar',
                          data: {
                            labels: abreviasionArray,
                            datasets: [{
                              fill: true,
                              data: numberArray ,
                              backgroundColor: [
                                'RGBA(198,87,53,.4)','RGBA(21, 67, 96,.4)','RGBA(23, 165, 137,.4)',
                                'RGBA(120, 66, 18,.4)','RGBA(218, 127, 166,.4)','RGBA(255, 195, 110.4,.4)',
                                'RGBA(255, 87, 51,.4)','RGBA(100, 30, 22,.4)','RGBA(220, 166, 18,.4)',
                                'RGBA(125, 102, 8,.4)',
                              ],
                              borderColor: [
                                'RGBA(198,87,53,.7)','RGBA(21, 67, 96,.7)','RGBA(23, 165, 137,.7)',
                                'RGBA(120, 66, 18,.7)','RGBA(218, 127, 166,.7)','RGBA(255, 195, 110,.7,.7)',
                                'RGBA(255, 87, 51,.7)','RGBA(100, 30, 22,.7)','RGBA(220, 166, 18,.7)',
                                'RGBA(125, 102, 8,.7)',
                              ],
                              borderWidth: 2
                            }]
                          },
                          options: {
                            title: {
                              display: true,
                              text: ['Conected Clients ','Main server']
                              },
                            hover: {
                              yAlign: 'top',
                                mode: 'index',
                                intersect: false
                             },
                            plugins: {
                              tooltip: {
                                yAlign: 'center'
                              },
                            },
                            layout: {
                              padding: {
                                top: 5 ,
                                right: 10
                              }
                            },
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                  xAxes: [{
                                      gridLines: {
                                        display:false
                                        },
                                      display : true,
                                      ticks: {
                                        fontSize: 8
                                        }
                                    }],
                                  yAxes: [{
                                    gridLines: {
                                      display:false
                                      },
                                    display :true,
                                    ticks: {
                                        type: 'linear',
                                        display : true,
                                        fontSize: 5,
                                        stepSize : 8,
                                      }
                                  }],
                              },
                              legend: {
                                  display: false
                                },
                              elements: {
                                point:{
                                  radius: 0
                                }
                              },
                                animation: {
                                  duration:000,
                              },
                            }
                      });
                    
              }
              //--------------------------------------------------------------------------------
              //----------------------------- Sols on Menu ----------------------------------
              //--------------------------------------------------------------------------------                  
              async function sols (){
                abreviasionArray = []
                numberArray = []
                let response = await fetch(sessionStorage.apiServer + 'blockSols');
                let data = await response.json();
                miners = data['miners']
                solutions = data['solution']
                var ctx = document.getElementById('solCanvas').getContext("2d");
                if (window.mysolCanvas != undefined)
                  window.mysolCanvas.destroy();
                    window.mysolCanvas = new Chart(ctx, {
                          type: 'bar',
                          data: {
                            labels: miners,
                            datasets: [{
                              fill: true,
                              data: solutions ,
                              backgroundColor: [
                                'RGBA(198,87,53,.4)','RGBA(21, 67, 96,.4)','RGBA(23, 165, 137,.4)',
                                'RGBA(120, 66, 18,.4)','RGBA(218, 127, 166,.4)','RGBA(255, 195, 110.4,.4)',
                                'RGBA(255, 87, 51,.4)','RGBA(100, 30, 22,.4)','RGBA(220, 166, 18,.4)',
                                'RGBA(125, 102, 8,.4)',
                              ],
                              borderColor: [
                                'RGBA(198,87,53,.7)','RGBA(21, 67, 96,.7)','RGBA(23, 165, 137,.7)',
                                'RGBA(120, 66, 18,.7)','RGBA(218, 127, 166,.7)','RGBA(255, 195, 110,.7,.7)',
                                'RGBA(255, 87, 51,.7)','RGBA(100, 30, 22,.7)','RGBA(220, 166, 18,.7)',
                                'RGBA(125, 102, 8,.7)',
                              ],
                              borderWidth: 2
                            }]
                          },
                          options: {
                            title: {
                              display: true,
                              text: ['Curent Block ','Known Sols']
                              },
                            hover: {
                              yAlign: 'top',
                                mode: 'index',
                                intersect: false
                             },
                            plugins: {
                              tooltip: {
                                yAlign: 'center'
                              },
                            },
                            layout: {
                              padding: {
                                top: 5 ,
                                right: 10
                              }
                            },
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                  xAxes: [{
                                      gridLines: {
                                        display:false,
                                        },
                                      display : false,
                                      ticks: {
                                        fontSize: 10,
                                        }
                                    }],
                                  yAxes: [{
                                    gridLines: {
                                      display:true,
                                      },
                                    display :true,
                                    ticks: {
                                        type: 'linear',
                                        display : true,
                                        fontSize: 10,
                                        stepSize : 1000,
                                      }
                                  }],
                              },
                              legend: {
                                  display: false
                                },
                              elements: {
                                point:{
                                  radius: 0
                                }
                              },
                                animation: {
                                  duration:000,
                              },
                            }
                      });
                    
              }
              //--------------------------------------------------------------------------------
              //----------------------------- Pos & Mns in Header ------------------------------
              //--------------------------------------------------------------------------------                  
              async function posAndMns (){

                let response = await fetch(sessionStorage.apiServer + 'mns&pos');
                let data = await response.json();
                blocks = data['blocksList']
                pos = data['posList']
                mns = data['mnList']
                var ctx = document.getElementById('blockTime').getContext("2d");
                if (window.myblockTime != undefined)
                  window.myblockTime.destroy();
                    window.myblockTime = new Chart(ctx, {
                          type: 'line',
                          data: {
                            labels: blocks,
                            //datasets: [{
                            datasets: [
                              { 
                                label : 'Mns on block  ' ,
                                fill: false,
                                data: mns ,
                                borderWidth: 2,
                                pointHoverRadius: 7,
                                borderColor: 'green',
                                hoverBorderColor: 'green',
                                hoverBackgroundColor: 'green',
                                borderStyle: 'solid',
                                borderWidth: 1,
                                hoverBorderWidth: 2,
                              }
                            ]
                          },
                          options: {
                            title: {
                              display: false,
                              text: ['Curent Block ','Known Sols']
                              },
                            hover: {
                              yAlign: 'top',
                                mode: 'index',
                                intersect: false
                             },
                            plugins: {
                              tooltip: {
                                yAlign: 'center'
                              },
                            },
                            layout: {
                              padding: {
                                top: 5 ,
                                right: 10
                              }
                            },
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                  xAxes: [{
                                      gridLines: {
                                        display:false,
                                        },
                                      display : false,
                                      ticks: {
                                        fontSize: 10,
                                        }
                                    }],
                                  yAxes: [{
                                    gridLines: {
                                      display:true,
                                      },
                                    display :true,
                                    ticks: {
                                        type: 'linear',
                                        display : true,
                                        fontSize: 10,
                                        stepSize : 20,
                                      }
                                  }],
                              },
                              legend: {
                                  display: false
                                },
                              elements: {
                                point:{
                                  radius: 0
                                }
                              },
                                animation: {
                                  duration:2000,
                              },
                            }
                      });
                    
              }

          
        

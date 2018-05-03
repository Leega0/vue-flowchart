<template>
  <div class="main">
    <el-container>
      <el-header>
        <div class="subheader editor-toolbar">
          <el-row>
            <el-tooltip class="item" effect="dark" content="保存" placement="bottom">
              <el-button icon="el-icon-baocun" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="剪切" placement="bottom">
              <el-button icon="el-icon-jiantie" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="复制" placement="bottom">
              <el-button icon="el-icon-fuzhi" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="粘贴" placement="bottom">
              <el-button icon="el-icon-zhantie" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="清空" placement="bottom">
              <el-button icon="el-icon-shanchu" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
              <el-button icon="el-icon-qingkong" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="撤销" placement="bottom">
              <el-button icon="el-icon-chexiao" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="放大" placement="bottom">
              <el-button icon="el-icon-fangda" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="缩小" placement="bottom">
              <el-button icon="el-icon-suoxiao" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="归位" placement="bottom">
              <el-button icon="el-icon-huanyuan" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="导入" placement="bottom">
              <el-button icon="el-icon-daoru" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="导出" placement="bottom">
              <el-button icon="el-icon-daochu" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="将左侧服务拖至编辑区" placement="bottom">
              <el-button icon="el-icon-bangzhu" size="mini"></el-button>
            </el-tooltip>
          </el-row>
        </div>
      </el-header>
      <el-container>
      <el-aside>
      <div id="flowComponents" class="full-left">
          <div class="components-btn noComponent" name="selectBtn">
            <div><span>选择</span></div>
          </div>
          <div class="components-btn" name="startComponent" type="start" draggable="true" data-show="S">
            <div><span>开始</span></div>
          </div>
          <div class="components-btn" name="endComponent" type="end" draggable="true" data-show="E">
            <div><span>结束</span></div>
          </div>
          <div class="components-btn" name="ordinaryActivity" type="activity" draggable="true" data-show="新闻抓取">
            <div><span>新闻抓取</span></div>
          </div>
         <div class="components-btn" name="blockActivity" type="activity" draggable="true" data-show="翻译服务">
            <div><span>翻译服务</span></div>
          </div>
          <div class="components-btn noComponent" name="NOROUTING">
            <div><span>转移</span></div>
          </div>
      </div>
      </el-aside>
      <el-main>
      <div class="full-right tab">
        <el-tabs type="card" tab-position="bottom" class="svgcontain">
          <el-tab-pane label="图标视图" class="svgbg">
              <div id="points" class="points">
              </div>
          </el-tab-pane>
          <el-tab-pane label="xml视图">
              <div id="xmlContainer">
                321
					    </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      </el-main>
      </el-container>
    </el-container>
    <context-menu class="right-menu" 
      :target="contextMenuTarget" 
      :show="contextMenuVisible" 
      @update:show="(show) => contextMenuVisible = show">
      <a href="javascript:;">配置</a>
      <a href="javascript:;">删除</a>
    </context-menu>
  </div>
</template>

<script>
import $ from 'jquery';

import * as d3 from 'd3';
import { component as VueContextMenu } from '@xunlei/vue-context-menu'


export default {
  name: 'flowchart',
  data () {
    return {
      contextMenuTarget: document.body,
      contextMenuVisible: false,
      data:{
    },      
    }
  },
  components:{
    'context-menu': VueContextMenu
  },
  methods:{
    IniterCanvas(){
      /**
       * 存放所有 GraphCreator 对象及方法 
       */
      var graphPool = {
        pools: [],
        updateGraphActiveById: function(containerId) {
          this.pools.forEach(function(graph) {
            if (graph.containerId === containerId) {
                graph.state.activeEdit = true;
            } else {
                graph.state.activeEdit = false;
            }
          });
        },
        getGraphByActiveEdit: function() {
            var graph_active = this.pools.find(function(graph) {
              return graph.state.activeEdit;
            });
            return graph_active;
        },
        removeGraphFromPools: function(containerId) {
          var pools = this.pools;
          for (var i = 0; i < pools.length; i++) {
            if (pools[i].containerId === containerId) {
              pools.splice(i, 1);
            }
          }

        }
      };
      function refresh(link){
      if (/(MSIE 10)|(Trident)/.test(navigator.appVersion)) {
        if (link[0] instanceof Array) {
          link[0].forEach( function(item) {
            item.parentNode.insertBefore(item, item);
          });
        } else if (link[0]) {
          var svgNode = link.node();
          svgNode.parentNode.insertBefore(svgNode, svgNode);
        }
      }
    }
         var GraphCreator = function(containerId, svg, nodes, edges, participants) {
         var thisGraph =  this;
         console.log("thisGraph");
         console.log(thisGraph);
         thisGraph.nodes = nodes || [];
          thisGraph.edges = edges || [];
          thisGraph.participants = participants || [];
          thisGraph.containerId = containerId;

          thisGraph.state = {
            activeEdit: true,
            selectedNode: null,
            selectedEdge: null,
            mouseDownNode: null,
            mouseDownLink: null,
            justDragged: false,
            justScaleTransGraph: false,
            lastKeyDown: -1,
            shiftNodeDrag: false,
            selectedText: null,
            drawLine: ''
          };
          // define arrow markers for graph links
          var defs = svg.append('defs');
          defs.append('svg:marker')
            .attr('id', thisGraph.containerId + '-end-arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 42)
            .attr('markerWidth', 5)
            .attr('markerHeight', 5)
            .attr('orient', 'auto')
            .append('svg:path')
            .attr('d', 'M0,-5L10,0L0,5');

          //define arrow markers for leading arrow
          defs.append('marker')
            .attr('id', thisGraph.containerId + '-mark-end-arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 7)
            .attr('markerWidth', 5)
            .attr('markerHeight', 5)
            .attr('orient', 'auto')
            .append('svg:path')
            .attr('d', 'M0,-5L10,0L0,5');

           //定义选中样式的箭头
          defs.append('marker')
            .attr('id', thisGraph.containerId + '-selected-end-arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 30)
            .attr('markerWidth', 5)
            .attr('markerHeight', 5)
            .attr('orient', 'auto')
            .append('svg:path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', 'rgb(229, 172, 247)');

           thisGraph.svg = svg;
           thisGraph.show_position = svg.append("text")
              .attr({
                'x': 1107,
                'y': 15,
                'fill': '#E1784B'
              });
          thisGraph.svgG = svg.append("g")
            .classed(thisGraph.consts.graphClass, true);
          var svgG = thisGraph.svgG;

         // displayed when dragging between nodes
          thisGraph.dragLine = svgG.append('path')
            .attr('class', 'link dragline hidden')
            .attr('d', 'M0,0L0,0')
            .style('marker-end', 'url(#'+thisGraph.containerId+'-mark-end-arrow)');

          // svg nodes and edges
          thisGraph.paths = svgG.append("g").selectAll("g");
          thisGraph.circles = svgG.append("g").selectAll("g");

          thisGraph.drag = d3.behavior.drag()
              .origin(function(d) {
                // d = selected circle. The drag origin is the origin of the circle
                return {
                  x: d.x,
                  y: d.y
                };
              })
              .on("dragstart", function() {d3.select(this).select("circle").attr("r", thisGraph.consts.nodeRadius + thisGraph.consts.nodeRadiusVary);})
              .on("drag", function(args) {
                thisGraph.state.justDragged = true;
                thisGraph.dragmove.call(thisGraph, args);
              })
              .on("dragend", function(args) {
                // args = circle that was dragged
                d3.select(this).select("circle").attr("r", thisGraph.consts.nodeRadius - thisGraph.consts.nodeRadiusVary);
              });
        
              // listen for key events
              d3.select(window).on("keydown", function() {
                  thisGraph.svgKeyDown.call(thisGraph);
                })
                .on("keyup", function() {
                  thisGraph.svgKeyUp.call(thisGraph);
                });
              svg.on("mousedown", function(d) {
                thisGraph.svgMouseDown.call(thisGraph, d);
              });
              svg.on("mouseup", function(d) {
                thisGraph.svgMouseUp.call(thisGraph, d);
              });
              svg.on("mousemove", function(d) {
                thisGraph.show_position.text('pos: '+d3.mouse(svgG.node())[0].toFixed(0)+', '+d3.mouse(svgG.node())[1].toFixed(0));
              });

               // listen for dragging
              var dragSvg = d3.behavior.zoom()
                .scaleExtent([0.3, 2])
                .on("zoom", function() {
                  // console.log('zoom triggered');
                  if (d3.event.sourceEvent.shiftKey) {
                    // the internal d3 state is still changing
                    return false;
                  } else {
                    thisGraph.zoomed.call(thisGraph);
                  }
                  return true;
                })
                .on("zoomstart", function() {
                  // console.log('zoomstart triggered');
                  var ael = d3.select("#" + thisGraph.consts.activeEditId).node();
                  if (ael) {
                    ael.blur();
                  }
                  if (!d3.event.sourceEvent.shiftKey) d3.select('body').style("cursor", "move");
                })
                .on("zoomend", function() {
                  // console.log('zoomend triggered');
                  d3.select('body').style("cursor", "auto");
                });
              thisGraph.dragSvg = dragSvg;
              svg.call(dragSvg).on("dblclick.zoom", null);

               // listen for resize
              window.onresize = function() {
                thisGraph.updateWindow(svg);
              };
               $('#flowComponents .components-btn[type]').not('.noComponent').attr('draggable', 'true')
                .on('dragstart', function(ev) {
                  // $('.full-left').css({cursor: 'no-drop'});
                  $(this).siblings().removeClass('active').end().addClass('active');
                  $('.full-right>.tab.active .full-right-top').addClass('activate');
                  /* 设置拖动过程显示图片
                  var icon = document.createElement('img');
                  icon.src = $(this).find('img').attr('src');
                  ev.originalEvent.dataTransfer.setDragImage(icon,10,10);*/
                  var json_obj = {
                    text: $(this).attr('data-show'),
                    component: $(this).attr('name'),
                    type: $(this).attr('type')
                  };
                  ev.originalEvent.dataTransfer.setData('tr_data', JSON.stringify(json_obj));
                })
                .on('dragend', function(ev) {
                  $('.full-right>.tab.active .full-right-top').removeClass('activate');
                }); 

              $('.full-right .tab.active').on('drop', '.svg-container', function(ev) {
                  ev.stopPropagation(); 
                  ev.preventDefault(); 
                  var position = {
                    x: parseFloat(ev.originalEvent.offsetX),
                    y: parseFloat(ev.originalEvent.offsetY)
                  };

                  position = thisGraph.parsePosition(this, position);

                  var data = JSON.parse(ev.originalEvent.dataTransfer.getData('tr_data'));
                  data = $.extend(data, position);
                  var node = thisGraph.createNode(data);

                  thisGraph.nodes.push(node);
                  thisGraph.updateGraph();

                })
                .on('dragover', function(ev) { 
                  ev.preventDefault();
                });
              };
             GraphCreator.prototype.consts = {
              selectedClass: "selected",
              connectClass: "connect-node",
              circleGClass: "conceptG",
              graphClass: "graph",
              activeEditId: "active-editing",
              BACKSPACE_KEY: 8,
              DELETE_KEY: 46,
              ENTER_KEY: 13,
              nodeRadius: 34,
              nodeRadiusVary: 1
            };
              /**
              * 获取link样式 [添加线样式 start:连线起点 des:连线终点]
              * 如果 |dif.x| > |dif.y| 左右连线，反之，上下连线
              * 如果 dif.x > 0 && dif.y < 0 第四象限
              * 如果 dif.x > 0 && dif.y > 0 第一象限
              * 如果 dif.x < 0 && dif.y > 0 第二象限
              * 如果 dif.x < 0 && dif.y < 0 第三象限
              */
              GraphCreator.prototype.getLink_d = function(start, des) {
                var d = start;
                var mid_x = (d.x + des.x)/2,
                  mid_y = (d.y + des.y)/2;
                var dif_x = des.x - d.x,
                  dif_y = des.y - d.y;
                var link;
                if (Math.abs(dif_x) > Math.abs(dif_y)) { // 左右连线
                  if (dif_x > 0 && dif_y > 0) { //第一象限（200,200-300,300）
                    // <path d="M 200,200 L 245,200 M 245,200 A 5,5,0,0,1 250,205 M 250,205 L 250,295 M 250,295 A 5,5,0,0,0 255,300 M 255,300 L 300,300" fill="none" stroke="#F18C16" stroke-width="1"></path>
                    link = 'M' + d.x + ',' + d.y + 'L' + (mid_x-5) + ',' + d.y + 'M' + (mid_x-5) + ',' + d.y + 'A 5,5,0,0,1 ' + mid_x + ',' + (d.y+5) + 
                      'M' + mid_x + ',' + (d.y+5) + 'L' + mid_x + ',' + (des.y-5) +'M' + mid_x + ',' + (des.y-5) + 'A 5,5,0,0,0' + (mid_x+5) + ',' + des.y + 
                      'M' + (mid_x+5) + ',' + des.y + 'L' + des.x + ',' + des.y;
                  }
                  if (dif_x < 0 && dif_y > 0) { //第二象限（200,200-100,300）
                    // <path d="M 200,200 L 155,200 M 155,200 A 5,5,0,0,0 150,205 M 150,205 L 150,295 M 150,295 A 5,5,0,0,1 145,300 M 145,300 L 100,300" fill="none" stroke="#F18C16" stroke-width="1"></path> 
                    link = 'M' + d.x + ',' + d.y + 'L' + (mid_x+5) + ',' + d.y + 'M' + (mid_x+5) + ',' + d.y + 'A 5,5,0,0,0 ' + mid_x + ',' + (d.y+5) + 
                      'M' + mid_x + ',' + (d.y+5) + 'L' + mid_x + ',' + (des.y-5) +'M' + mid_x + ',' + (des.y-5) + 'A 5,5,0,0,1' + (mid_x-5) + ',' + des.y + 
                      'M' + (mid_x-5) + ',' + des.y + 'L' + des.x + ',' + des.y;
                  }
                  if (dif_x < 0 && dif_y < 0) { //第三象限（200,200-100,100）
                    // <path d="M 200,200 L 155,200 M 155,200 A 5,5,0,0,1 150,195 M 150,195 L 150,105 M 150,105 A 5,5,0,0,0 145,100 M 145,100 L 100,100" fill="none" stroke="#F18C16" stroke-width="1"></path>
                    link = 'M' + d.x + ',' + d.y + 'L' + (mid_x+5) + ',' + d.y + 'M' + (mid_x+5) + ',' + d.y + 'A 5,5,0,0,1 ' + mid_x + ',' + (d.y-5) + 
                      'M' + mid_x + ',' + (d.y-5) + 'L' + mid_x + ',' + (des.y+5) +'M' + mid_x + ',' + (des.y+5) + 'A 5,5,0,0,0' + (mid_x-5) + ',' + des.y + 
                      'M' + (mid_x-5) + ',' + des.y + 'L' + des.x + ',' + des.y;
                  }
                  if (dif_x > 0 && dif_y < 0) { //第四象限（200,200-300,100）
                    // <path d="M 200,200 L 245,200 M 245,200 A 5,5,0,0,0 250,195 M 250,195 L 250,105 M 250,105 A 5,5,0,0,1 255,100 M 255,100 L 300,100" fill="none" stroke="#F18C16" stroke-width="1"></path>
                    link = 'M' + d.x + ',' + d.y + 'L' + (mid_x-5) + ',' + d.y + 'M' + (mid_x-5) + ',' + d.y + 'A 5,5,0,0,0 ' + mid_x + ',' + (d.y-5) + 
                      'M' + mid_x + ',' + (d.y-5) + 'L' + mid_x + ',' + (des.y+5) +'M' + mid_x + ',' + (des.y+5) + 'A 5,5,0,0,1' + (mid_x+5) + ',' + des.y + 
                      'M' + (mid_x+5) + ',' + des.y + 'L' + des.x + ',' + des.y;
                  }
                } else { // 上下连线
                  if (dif_x > 0 && dif_y > 0) { //第一象限（200,200-300,300）
                    // <path d="M 100,100 L 100,145 M 100,145 A 5,5,0,0,0 105,150 M 105,150 L 195,150 M 195,150 A 5,5,0,0,1 200,155 M 200,155 L 200,200" fill="none" stroke="#0096f2" stroke-width="1"></path>
                    link = 'M' + d.x + ',' + d.y + 'L' + d.x + ',' + (mid_y-5) + 'M' + d.x + ',' + (mid_y-5) + 'A 5,5,0,0,0 ' + (d.x+5) + ',' + mid_y + 
                      'M' + (d.x+5) + ',' + mid_y + 'L' + (des.x-5) + ',' + mid_y +'M' + (des.x-5) + ',' + mid_y + 'A 5,5,0,0,1' + des.x + ',' + (mid_y+5) + 
                      'M' + des.x + ',' + (mid_y+5) + 'L' + des.x + ',' + des.y;
                  }
                  if (dif_x < 0 && dif_y > 0) { //第二象限（200,200-100,300）
                    // <path d="M 200,200 L 200,245 M 200,245 A 5,5,0,0,1 195,250 M 195,250 L 105,250 M 105,250 A 5,5,0,0,0 100,255 M 100,255 L 100,300" fill="none" stroke="#0096f2" stroke-width="1"></path>
                    link = 'M' + d.x + ',' + d.y + 'L' + d.x + ',' + (mid_y-5) + 'M' + d.x + ',' + (mid_y-5) + 'A 5,5,0,0,1 ' + (d.x-5) + ',' + mid_y + 
                      'M' + (d.x-5) + ',' + mid_y + 'L' + (des.x+5) + ',' + mid_y +'M' + (des.x+5) + ',' + mid_y + 'A 5,5,0,0,0' + des.x + ',' + (mid_y+5) + 
                      'M' + des.x + ',' + (mid_y+5) + 'L' + des.x + ',' + des.y;
                  }
                  if (dif_x < 0 && dif_y < 0) { //第三象限（200,200-100,100）
                    // <path d="M 200,200 L 200,155 M 200,155 A 5,5,0,0,0 195,150 M 195,150 L 105,150 M 105,150 A 5,5,0,0,1 100,145 M 100,145 L 100,100" fill="none" stroke="#0096f2" stroke-width="1"></path>
                    link = 'M' + d.x + ',' + d.y + 'L' + d.x + ',' + (mid_y+5) + 'M' + d.x + ',' + (mid_y+5) + 'A 5,5,0,0,0 ' + (d.x-5) + ',' + mid_y + 
                      'M' + (d.x-5) + ',' + mid_y + 'L' + (des.x+5) + ',' + mid_y +'M' + (des.x+5) + ',' + mid_y + 'A 5,5,0,0,1' + des.x + ',' + (mid_y-5) + 
                      'M' + des.x + ',' + (mid_y-5) + 'L' + des.x + ',' + des.y;
                  }
                  if (dif_x > 0 && dif_y < 0) { //第四象限（200,200-300,100）
                    // <path d="M 200,200 L 200,155 M 200,155 A 5,5,0,0,1 205,150 M 205,150 L 295,150 M 295,150 A 5,5,0,0,0 300,145 M 300,145 L 300,100" fill="none" stroke="#0096f2" stroke-width="1"></path>
                    link = 'M' + d.x + ',' + d.y + 'L' + d.x + ',' + (mid_y+5) + 'M' + d.x + ',' + (mid_y+5) + 'A 5,5,0,0,1 ' + (d.x+5) + ',' + mid_y + 
                      'M' + (d.x+5) + ',' + mid_y + 'L' + (des.x-5) + ',' + mid_y +'M' + (des.x-5) + ',' + mid_y + 'A 5,5,0,0,0' + des.x + ',' + (mid_y-5) + 
                      'M' + des.x + ',' + (mid_y-5) + 'L' + des.x + ',' + des.y;
                  }
                }
                return link;
              };
             // call to propagate changes to graph
            GraphCreator.prototype.updateGraph = function() {
              var thisGraph = this,
                consts = thisGraph.consts,
                state = thisGraph.state,
                nodes = thisGraph.nodes, 
                edges = thisGraph.edges;
              
              thisGraph.paths = thisGraph.paths.data(edges, function(d) {
                return String(d.source.id) + "+" + String(d.target.id);
              });
              var paths = thisGraph.paths;
              // update existing paths
              var link = paths.style('marker-end', 'url(#'+thisGraph.containerId+'-end-arrow)')
                .classed(consts.selectedClass, function(d) {
                  return d === state.selectedEdge;
                })
                .attr("conditype", function(d) {
                  if (d.postCondition) {
                    return changeCase(d.postCondition.conditype, 5);
                  } else {
                    return '';
                  }
                })
                .attr("d", function(d) {
                  if (d.drawLine == 'NOROUTING') {
                    return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y;
                  }
                  if (d.drawLine == 'SIMPLEROUTING') {
                    var start = {
                      x: d.source.x,
                      y: d.source.y
                    };
                    var des = {
                      x: d.target.x,
                      y: d.target.y
                    };
                    return thisGraph.getLink_d(start, des);
                  }
                });
              refresh(link); // 兼容IE11

              // add new paths
              paths.enter()
                .append("path")
                .style('marker-end', 'url(#'+thisGraph.containerId+'-end-arrow)')
                .classed("link", true)
                .attr("conditype", function(d) {
                  if (d.postCondition) {
                    return changeCase(d.postCondition.conditype, 5);
                  } else {
                    return '';
                  }
                })
                .attr("d", function(d) {
                  if (d.drawLine == 'NOROUTING') {
                    return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y;
                  }
                  if (d.drawLine == 'SIMPLEROUTING') {
                    var start = {
                      x: d.source.x,
                      y: d.source.y
                    };
                    var des = {
                      x: d.target.x,
                      y: d.target.y
                    };
                    return thisGraph.getLink_d(start, des);
                  }
                })
                .on("mousedown", function(d) {
                  thisGraph.pathMouseDown.call(thisGraph, d3.select(this), d);
                })
                .on("mouseup", function(d) {
                  state.mouseDownLink = null;
                });

              // remove old links
              paths.exit().remove();

              // update existing nodes
              thisGraph.circles = thisGraph.circles.data(nodes, function(d) {
                return d.id;
              });
              thisGraph.circles.attr("transform", function(d) {
                if (d == state.selectedNode) { // 更新节点名称
                  var tspan = d3.select(this).select('tspan');
                  if (tspan.text() !== d.title) {
                    tspan.text(d.title);
                  }
                }
                return "translate(" + d.x + "," + d.y + ")";
              });

              // add new nodes
              var newGs = thisGraph.circles.enter()
                .append("g")
                  .attr({"id": function(d) { return generateUUID(); }});

              newGs.classed(consts.circleGClass, true)
                .attr("transform", function(d) {
                  return "translate(" + d.x + "," + d.y + ")";
                })
                .on("mouseover", function(d) {
                  if (state.shiftNodeDrag) {
                    d3.select(this).classed(consts.connectClass, true);
                  }
                })
                .on("mouseout", function(d) {
                  d3.select(this).classed(consts.connectClass, false);
                })
                .on("mousedown", function(d) {
                  thisGraph.circleMouseDown.call(thisGraph, d3.select(this), d);
                })
                .on("mouseup", function(d) {
                  thisGraph.circleMouseUp.call(thisGraph, d3.select(this), d);
                })
                .call(thisGraph.drag);

              newGs.append("circle")
                .attr("r", String(consts.nodeRadius));

              newGs.each(function(d) {
                switch (d.type) {
                  case 'start':
                    d3.select(this).classed('start', true);
                    break;
                  case 'end':
                    d3.select(this).classed('end', true);
                    break;
                }
                thisGraph.insertTitleLinebreaks(d3.select(this), d);
              });

              // remove old nodes
              thisGraph.circles.exit().remove();
            };
            // /**
            //   * 获取此节点的连线
            //   * @param  {Object} node        此节点
            //   * @param  {Number} type        -1 连线指向此节点 1 此节点连出 undefined 所有连线
            //   * @return {Array}  linkedEdges 连线集合
            //   */
            GraphCreator.prototype.getLinkedEdges = function(node, type) {
              var thisGraph = this;
              var edges = thisGraph.edges;
              var linkedEdges;
              if (type == -1) {
                linkedEdges = edges.filter(function(edge) {
                  return edge.target == node;
                });
              }
              if (type == 1) {
                linkedEdges = edges.filter(function(edge) {
                  return edge.source == node;
                });
              }
              linkedEdges = edges.filter(function(edge) {
                return edge.target == node || edge.source == node;
              });
              return linkedEdges;
            };
        /**** MAIN ****/
          var container = d3.select('.svgbg').node(),
            containerId = 'tab_main';

          var svg = d3.select('.svgbg').append("svg")
            .attr("width", "100%")
            .attr("height", container.clientHeight);

          var initialDate = this.initFlowChart();
          window.graph_main = new GraphCreator(containerId, svg, initialDate.nodes, initialDate.edges, initialDate.participants);
          graphPool.pools.push(graph_main);
          graph_main.updateGraph();
    },
    initFlowChart(){
      var initialDate = {
        nodes: [],
        edges: [],
        participants: []
      };
      return initialDate;
    }
  },
  mounted(){
     this.IniterCanvas()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .right-menu {
      position: fixed;
      background: #fff;
      border: solid 1px rgba(0, 0, 0, .2);
      border-radius: 3px;
      z-index: 999;
      display: none;
      border: 1px solid #eee;
      box-shadow: 0 0.5em 1em 0 rgba(0,0,0,.1);
      border-radius: 1px;
    }
    .right-menu a {
      width: 75px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      display: block;
      color: #1a1a1a;
      text-decoration: none;
       padding: 2px;
    }
    .right-menu a:hover{
      color:#fff;
      background: #409EFF;
     }
    .subheader {
        height: 5vh;
        min-height: 50px;
        box-sizing: border-box;
        border-bottom: 1px solid #58a5f3;
        padding:5px 0 5px 20px;
    }
    .svgbg {
        background-image: url(data:image/gif;base64,R0lGODlhCgAKAIAAAPPz89/f3ywAAAAACgAKAAACEQyOaJnL515ksz11YQah+18AADs=)!important;
        box-sizing: border-box;
        border: 1px dashed #FFF;
    }

    .full-left {
        height:93vh ;
        padding: 5px;
        box-sizing: border-box;
        border-right: 1px solid #58a5f3;
    }
    .components-btn{
      height: 30px;
    }
    .full-right{
      height: 88vh;
    }
    .svgcontain .el-tab-pane{
      height: 50vh;
    }
</style>

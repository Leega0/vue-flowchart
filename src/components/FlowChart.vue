<template>
  <div class="app-container calendar-list-container">
    <el-container>
      <el-aside>
        <div id="flowComponents" class="full-left">
          <div class="components-btn noComponent" name="selectBtn">
            <div>
              <span>选择</span>
            </div>
          </div>
          <div class="components-btn" name="startComponent" type="start" draggable="true" data-show="S">
            <div>
              <span>开始</span>
            </div>
          </div>
          <div class="components-btn" name="endComponent" type="end" draggable="true" data-show="E">
            <div>
              <span>结束</span>
            </div>
          </div>
          <div class="components-btn" name="ordinaryActivity" type="activity" draggable="true" data-show="MQ服务流">
            <div>
              <span>MQ服务流</span>
            </div>
          </div>
          <div class="components-btn" name="blockActivity" type="activity" draggable="true" data-show="组服务流">
            <div>
              <span>组服务流</span>
            </div>
          </div>
          <div class="components-btn" name="subFlowActivity" type="activity" draggable="true" data-show="API服务流">
            <div>
              <span>API服务流</span>
            </div>
          </div>
          <div class="components-btn noComponent" name="NOROUTING">
            <div>
              <span>转移</span>
            </div>
          </div>
        </div>
      </el-aside>
      <el-main>
        <el-row>
          <el-col :span="4"><el-input v-model="liuname" placeholder="请输入服务流名称"></el-input></el-col>
          <el-col :span="8" class="slidermargin">
            <span class="demstration">定时执行任务</span>
            <el-slider v-model="looptime" :step="10" class="timesliderbar"></el-slider>
          </el-col>
        <el-col :span="2"><el-button type="primary" id="exportjson">保存到xml编辑器</el-button></el-col>
        </el-row>
        <el-tabs type="card" tab-position="bottom" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="拖拽视图" name="svgtab">
            <div class="full-right tab clearfix">
              <div class="ui top attached tabular mini menu closemenu">
                <a class="item active" data-tab="tab_main">
                  <i class="el-icon-close"></i>流程
                </a>
              </div>
              <div class="ui bottom attached tab active svgheight" data-tab="tab_main">
                <div id="container" class="ui top attached tab active full-right-top view svg-container" data-tab="first">
                  <!-- svg -->
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="xml编辑视图" name="xmltab">
            <div id="xmlContainer">
              <el-button type="primary" @click="saverule">保存到服务器</el-button>
             <editor :value="code" :style="styleConfig" :config="editConfig"></editor>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
    <!-- 右键菜单 -->
    <div id="rMenu" class="rmenu">
      <a class="item" name="removeMenu">删除</a>
      <a class="item" name="propMenu">属性</a>
      <a class="item" name="editMenu">编辑</a>
    </div>
    <el-dialog title="服务流属性" :visible.sync="attrdialog">
      <el-form :model="form">
        <!-- 普通服务流 -->
        <template v-if="form.component=='ordinaryActivity'">
              <el-form-item label="属性名" :label-width="formLabelWidth">
                <el-input v-model="form.name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="id" :label-width="formLabelWidth">
                <el-input v-model="form.code" auto-complete="off"></el-input>
              </el-form-item>
               <el-form-item label="模式" :label-width="formLabelWidth">
                <el-input v-model="form.mode" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="完成时停止" :label-width="formLabelWidth">
                <el-input v-model="form.stopWhenFinish" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="错误时停止" :label-width="formLabelWidth">
                <el-input v-model="form.stopWhenError" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="中心名" :label-width="formLabelWidth">
                <el-input v-model="form.attr.center_name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="应用名" :label-width="formLabelWidth">
                  <el-input v-model="form.attr.application_name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="MQ路由" :label-width="formLabelWidth">
                  <el-input v-model="form.attr.routing_key" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="唯一id" :label-width="formLabelWidth">
                  <el-input v-model="form.attr.instance_id" auto-complete="off"></el-input>
              </el-form-item>
        </template>
        <!-- 组服务流 -->
         <template v-if="form.component=='blockActivity'">
              <el-form-item label="属性名" :label-width="formLabelWidth">
                <el-input v-model="form.name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="id" :label-width="formLabelWidth">
                <el-input v-model="form.code" auto-complete="off"></el-input>
              </el-form-item>
               <el-form-item label="模式" :label-width="formLabelWidth">
                <el-input v-model="form.mode" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="完成时停止" :label-width="formLabelWidth">
                <el-input v-model="form.stopWhenFinish" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="错误时停止" :label-width="formLabelWidth">
                <el-input v-model="form.stopWhenError" auto-complete="off"></el-input>
              </el-form-item>
        </template>
        <!-- api服务流 -->
         <template v-if="form.component=='subFlowActivity'">
            <el-form-item label="属性名" :label-width="formLabelWidth">
                <el-input v-model="form.name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="id" :label-width="formLabelWidth">
                <el-input v-model="form.code" auto-complete="off"></el-input>
              </el-form-item>
               <el-form-item label="模式" :label-width="formLabelWidth">
                <el-input v-model="form.mode" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="完成时停止" :label-width="formLabelWidth">
                <el-input v-model="form.stopWhenFinish" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="错误时停止" :label-width="formLabelWidth">
                <el-input v-model="form.stopWhenError" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="apiUrl" :label-width="formLabelWidth" >
                <el-input v-model="form.attr.url" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="中心名" :label-width="formLabelWidth" >
                <el-input v-model="form.attr.center_name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="应用名" :label-width="formLabelWidth">
                  <el-input v-model="form.attr.application_name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="MQ路由" :label-width="formLabelWidth">
                  <el-input v-model="form.attr.routing_key" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="唯一id" :label-width="formLabelWidth">
                  <el-input v-model="form.attr.instance_id" auto-complete="off"></el-input>
              </el-form-item>
        </template>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="attrdialog = false">取 消</el-button>
        <el-button type="primary"  @click="editeform()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  page,
  addObj,
  getObj,
  delObj,
  putObj
} from "@/api/turing-tasker/taskerRule/index";
import $eventBus from '@/store/bus.js';
import editor from '@/components/Brace/editor';

import $ from "jquery";

import "@/assets/flowchart/flowchart.css";

import * as d3 from "d3";

import { mapGetters } from "vuex";
export default {
  name: "taskerRule",
  components:{
    editor
  },
  data() {
    return {
      attrdialog: false,
      looptime:10,
      formLabelWidth: '120px',
      liuname:"",
      xmlcode:"",
      activeName:'svgtab',
      form:{
        component:undefined,
        name:undefined,
        code:undefined,
        mode:undefined,
        stopWhenFinish:undefined,
        stopWhenError:undefined,
        attr:{
          url:undefined,
          center_name:undefined,
          application_name:undefined,
          routing_key:undefined,
          instance_id:undefined
        }
      },
      code: '',
      editConfig: {
        language: 'xml',//编辑器语言
        theme: 'monokai',//编辑器主题
        fontsize: '16',//编辑器字体大小
        enableBasicAutocompletion: true,//以下三项:编辑器是否自动补全（包括本行）
        enableSnippets: true,
        enableLiveAutocompletion: true,
        wrapLimitRange1: null,
        wrapLimitRange2: null,
        isWrap: true,//是否换行
        isShowPrintMargin: false,//是否显示格式垂线
        isReadonly: false,//是否只读
        placeholder: '请输入代码！'//为空时的提示
      },
      styleConfig: {
        width: '100%',
        minHeight: '100%',
        border: '1px solid #ddd'
      },
      editorConfigData: {
        themeList: [
                    {
                        value: 'chrome',
                        label: 'chrome'
                    },
                    {
                        value: 'monokai',
                        label: 'monokai'
                    },
                    {
                        value: 'clouds',
                        label: 'clouds'
                    },
                    {
                        value: 'dawn',
                        label: 'dawn'
                    },
                    {
                        value: 'eclipse',
                        label: 'eclipse'
                    },
                    {
                        value: 'github',
                        label: 'github'
                    },
                    {
                        value: 'terminal',
                        label: 'terminal'
                    },
                    {
                        value: 'sqlserver',
                        label: 'sqlserver'
                    },
                    {
                        value: 'tomorrow',
                        label: 'tomorrow'
                    }
                ],
        langList: [
                    {
                        value: 'sql',
                        label: 'sql'
                    },
                    {
                        value: 'javascript',
                        label: 'javascript'
                    },
                    
                    {
                        value: 'java',
                        label: 'java'
                    },
          {
            value: 'xml',
            label: 'xml'
          }
        ],
        fontList: [
          {
                        value: '10',
                        label: '10'
                    },
                    {
            value: '12',
                        label: '12'
          },
          {
            value: '14',
                        label: '14'
          },
          {
            value: '16',
                        label: '16'
          },
          {
            value: '18',
                        label: '18'
          },
          {
            value: '20',
                        label: '20'
          },
          {
            value: '24',
                        label: '24'
          }
        ],
        isReadonly: '否'
      }
    };
  },
  methods: {
    saverule(){
         var saveobj = {};
         saveobj.mqQueue = String(this.looptime);
         saveobj.apiMethod = this.code;
         addObj(saveobj).then(response => {
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          });
        },
    showMessage(msg) {
      this.$message({
        message: msg,
        type: "warning"
      });
    },
    handleClick() {
      if(this.activeName=="xmltab"){
          $eventBus.$emit('updatecode',this.xmlcode)
        // $('#exportjson').trigger("click");

      }
    },
    editeform(){
        this.attrdialog = false;
        this.$emit('formsubmit');
    },
    IniterCanvas() {
      var elem = this;
      /**
       * 左侧组件
       */
      function handleComponentsBtn() {
        $(this)
          .siblings()
          .removeClass("active")
          .end()
          .addClass("active");
        var graph_active = graphPool.getGraphByActiveEdit(),
          state = graph_active.state,
          nodeName = $(this).attr("name"),
          container = $(".svg-container");
        if (nodeName === "NOROUTING" || nodeName === "SIMPLEROUTING") {
          state.drawLine = nodeName;
          container.on("mouseover mouseout", ".conceptG", function(e) {
            if (e.type === "mouseover") {
              this.style.cursor = "crosshair";
            } else if (e.type == "mouseout") {
              this.style.cursor = "default";
            }
          });
        } else {
          container.off("mouseover mouseout", ".conceptG");
          state.drawLine = null;
        }
      }
      /**
       * 右击菜单编辑
       */
      function handleMenuEdit() {
        var graph_active = graphPool.getGraphByActiveEdit();
        var selectedNode = graph_active.state.selectedNode;
        var data = {
          id: selectedNode.id,
          activitySetId: selectedNode.activitySet.activitySetId
        };
        var full_right = $(".full-right"),
          menu = full_right.children(".menu"),
          tab = full_right.find(".tab.active"),
          curr_tab = menu.find('[data-tab="tab_' + data.id + '"]');
        if (curr_tab.length) {
          full_right.find("[data-tab=tab_" + data.id + "]").show();
          curr_tab.trigger("click");
        } else {
          // 创建标签页及graph对象
          menu.append(`<a class="item" data-tab="tab_${
            data.id
          }" activitysetid="${data.activitySetId}">
              <i class="el-icon-close"></i>组服务流
              </a>`);
          full_right.append(`<div class="ui bottom attached tab segment blockDiv svgheight" data-tab="tab_${
            data.id
          }">
                            <div class="ui top attached tab active full-right-top view svg-container" data-tab="${
                              data.id
                            }_first">
                            <!-- svg -->
                          </div>
                        </div>`);
          menu
            .find('[data-tab="tab_' + data.id + '"]')
            .siblings()
            .removeClass("active");
          menu.find('[data-tab="tab_' + data.id + '"]').addClass("active");
          $(".full-right")
            .find('[data-tab="tab_' + data.id + '"]')
            .addClass("active");
          $(".full-right")
            .find('[data-tab="tab_' + data.id + '"]')
            .siblings(".tab")
            .hide()
            .removeClass("active");
          graph_active.createSubGraph();
        }
      }
      // 右键属性弹窗编辑
      function handleNodeMenuProp() {
        var graph_active = graphPool.getGraphByActiveEdit();
        var selectedNode = graph_active.state.selectedNode;
        // 弹出赋值
        if (selectedNode.attr) {
          
        }else{
          selectedNode.attr={}
        }
        // 开始赋值
        elem.form.component = selectedNode.component;
        elem.form.name = selectedNode.name;
        elem.form.code = selectedNode.code;
        elem.form.mode = selectedNode.mode||"O2M";
        elem.form.stopWhenFinish = selectedNode.stopWhenFinish||"false";
        elem.form.stopWhenError = selectedNode.stopWhenError||"true";
        //console.log(selectedNode.attr);
        elem.form.attr.url = selectedNode.attr.url||"";
        elem.form.attr.center_name = selectedNode.attr.center_name||"";
        elem.form.attr.application_name = selectedNode.attr.application_name||"";
        elem.form.attr.routing_key = selectedNode.attr.routing_key||"";
        elem.form.attr.instance_id = generateUUID();

        //console.log(elem.form);
    
        elem.attrdialog = true;
        // 原始选择对象
        //console.log(selectedNode);
        // 接收监听和赋值对象
        graph_active.updateGraph();
      }
       elem.$on('formsubmit',function(){
          var graph_active = graphPool.getGraphByActiveEdit();
          var selectedNode = graph_active.state.selectedNode;
          selectedNode.attr = {};

          selectedNode.name = elem.form.name;
          selectedNode.mode = elem.form.mode;
          selectedNode.code = elem.form.code;
          selectedNode.stopWhenFinish = elem.form.stopWhenFinish;
          selectedNode.stopWhenError = elem.form.stopWhenError;

         // console.log(elem.form);
          if(elem.form.attr.url){
            selectedNode.attr["url"] = elem.form.attr.url;
          }
          if(elem.form.attr.center_name){
              selectedNode.attr["center_name"] = elem.form.attr.center_name;
          }
          if (elem.form.attr.application_name) {
            selectedNode.attr["application_name"] = elem.form.attr.application_name;
          }
          if (elem.form.attr.routing_key) {
            selectedNode.attr["routing_key"] = elem.form.attr.routing_key;
          }
          selectedNode.attr["instance_id"] = elem.form.attr.instance_id;
          graph_active.updateGraph();
        })
     
      // 右键连线弹窗
      function handleEdgeMenuProp() {
        var graph_active = graphPool.getGraphByActiveEdit();
        var selectedEdge = graph_active.state.selectedEdge;
      }
      /**
       * 工具栏-删除节点
       */
      function handleDeleteNode() {
        var graph_active = graphPool.getGraphByActiveEdit();
        var selectedNode = graph_active.state.selectedNode,
          selectedEdge = graph_active.state.selectedEdge;
        if (!selectedNode && !selectedEdge) {
          elem.showMessage("请选中元素！");
          return;
        } else {
          elem
            .$confirm("确定要删除选择元素吗？", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
            .then(() => {
              if (selectedNode) {
                var nodes = graph_active.nodes;
                nodes.splice(nodes.indexOf(selectedNode), 1);
                graph_active.spliceLinksForNode(selectedNode);
                if (selectedNode.component === "blockActivity") {
                  var containerId = "tab_" + selectedNode.id;
                  $(".full-right [data-tab=" + containerId + "]").remove();
                  graphPool.removeGraphFromPools(containerId);
                }
                selectedNode = null;
                graph_active.updateGraph();
              } else if (selectedEdge) {
                var edges = graph_active.edges;
                edges.splice(edges.indexOf(selectedEdge), 1);
                selectedEdge = null;
                graph_active.updateGraph();
              }
              elem.$message({
                type: "info",
                message: "删除成功"
              });
            })
            .catch(() => {});
        }
      }
      function handleRightMenu() {
        var graph_active = graphPool.getGraphByActiveEdit();
        var item = $(this).attr("name");
        var selectedNode = graph_active.state.selectedNode,
          selectedEdge = graph_active.state.selectedEdge;
        switch (item) {
          case "removeMenu":
            handleDeleteNode();
            break;
          case "editMenu":
            handleMenuEdit();
            break;
          case "propMenu":
            if (selectedNode) {
              handleNodeMenuProp();
            } else if (selectedEdge) {
              // 暂时屏蔽连线的属性操作
              // handleEdgeMenuProp();
            }
            break;
        }
        $("#rMenu").hide();
      }
      $("#rMenu .item").on("click", handleRightMenu);
      $("#rMenu").on("mouseleave", function() {
        $("#rMenu").hide();
      });
      // /**
      //   * [generateUUID 返回一串序列码]
      //   * @return {String} [uuid]
      //   */
      function generateUUID() {
        var d = new Date().getTime();
        var uuid = "xxxxxxxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function(c) {
          var r = ((d + Math.random() * 16) % 16) | 0;
          d = Math.floor(d / 16);
          return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        });
        return uuid;
      }
      // /**
      //  * 大小写字母转化
      //  * @param  {[type]} str  需要转化的字符串
      //  * @param  {[type]} type 1: 首字母大写 2：首页母小写 3：大小写转换 4：全部大写 5：全部小写
      //  * @return {[type]}      转化后的字符串
      //  * changeCase('asdasd', 1) --> Asdasd
      //  */
      function changeCase(str, type) {
        if (!str) return "";
        function ToggleCase(str) {
          var itemText = "";
          str.split("").forEach(function(item) {
            if (/^([a-z]+)/.test(item)) {
              itemText += item.toUpperCase();
            } else if (/^([A-Z]+)/.test(item)) {
              itemText += item.toLowerCase();
            } else {
              itemText += item;
            }
          });
          return itemText;
        }
        switch (type) {
          case 1:
            return str.replace(/^(\w)(\w+)/, function(v, v1, v2) {
              return v1.toUpperCase() + v2;
            });
          case 2:
            return str.replace(/^(\w)(\w+)/, function(v, v1, v2) {
              return v1.toLowerCase() + v2;
            });
          case 3:
            return ToggleCase(str);
          case 4:
            return str.toUpperCase();
          case 5:
            return str.toLowerCase();
          default:
            return str;
        }
      }
      //获取n以内的随机数
      function getRandom(n) {
        return Math.floor(Math.random() * n + 1);
      }

      /**
       * randomWord 产生任意长度随机字母数字组合
       * randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
       * xuanfeng 2014-08-28
       */
      function randomWord(randomFlag, min, max) {
        var str = "",
          range = min,
          arr = [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "a",
            "b",
            "c",
            "d",
            "e",
            "f",
            "g",
            "h",
            "i",
            "j",
            "k",
            "l",
            "m",
            "n",
            "o",
            "p",
            "q",
            "r",
            "s",
            "t",
            "u",
            "v",
            "w",
            "x",
            "y",
            "z" /*
                      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 
                      'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
                      'U', 'V', 'W', 'X', 'Y', 'Z'*/
          ];
        if (randomFlag) {
          range = Math.round(Math.random() * (max - min)) + min;
        }
        for (var i = 0; i < range; i++) {
          let pos = Math.round(Math.random() * (arr.length - 1));
          str += arr[pos];
        }
        return str;
      }
      // 导出json测试
      $("#exportjson").on("click", function() {
        var data = {
          nodes: graph_main.nodes
        };
        var liuname = elem.liuname;
        var ordinaryxml = "",blockxml="",apixml="",currtext="",start="",last="",group="",end="",cgroup="";
        var jsonToxml = function(nodes){
            nodes.forEach(function(node) {
              // mq流
                if(node.component=="ordinaryActivity"){
                  ordinaryxml=`\n<MQServiceLiu code="${node.code}" name="${node.name}" mode="${node.mode}" stopWhenFinish="${node.stopWhenFinish}" stopWhenError="${node.stopWhenError}">
                  <routing_key>${node.attr.routing_key}</routing_key>
                  <instance_id>${node.attr.instance_id}</instance_id>
                  <center_name>${node.attr.center_name}</center_name>
                  <application_name>${node.attr.application_name}</application_name>
                </MQServiceLiu>`;
                currtext += ordinaryxml; 
              }
              // 组服务流
              if(node.component=="blockActivity"){
                  var s = `\n<GroupServiceLiu code="${node.code}" name="${node.name}" mode="${node.mode}" stopWhenFinish="${node.stopWhenFinish}" stopWhenError="${node.stopWhenError}">`
                  var cojb = node.activitySet.graphCreator.nodes;
                  var e = '\n</GroupServiceLiu>';
                  var cnodes = "",currtexts="",cordinaryxml="";
                  cojb.forEach(function(cnode){
                    // 组服务流嵌套
                    // api服务流
                    if(cnode.component=="subFlowActivity"){
                        cnodes=`\n<APIServiceLiu code="${cnode.code}" name="${cnode.name}" mode="${cnode.mode}" stopWhenFinish="${cnode.stopWhenFinish}" stopWhenError="${cnode.stopWhenError}">
                                    <url>${cnode.attr.url}</url>
                                    <application_name>${cnode.attr.application_name}</application_name>
                                    <instance_id>${cnode.attr.instance_id}</instance_id>
                                    <center_name>${cnode.attr.center_name}</center_name>
                                </APIServiceLiu>`
                          currtexts += cnodes;
                      }
                      // mq流
                      if(cnode.component=="ordinaryActivity"){
                          cordinaryxml=`\n<MQServiceLiu code="${cnode.code}" name="${cnode.name}" mode="${cnode.mode}" stopWhenFinish="${cnode.stopWhenFinish}" stopWhenError="${cnode.stopWhenError}">
                                          <routing_key>${cnode.attr.routing_key}</routing_key>
                                          <instance_id>${cnode.attr.instance_id}</instance_id>
                                          <center_name>${cnode.attr.center_name}</center_name>
                                          <application_name>${cnode.attr.application_name}</application_name>
                                        </MQServiceLiu>`;
                        currtexts += cordinaryxml; 
                      }
                      // 二层组服务流
                      if(cnode.component=="blockActivity"){
                        var cs = `\n<GroupServiceLiu code="${cnode.code}" name="${cnode.name}" mode="${cnode.mode}" stopWhenFinish="${cnode.stopWhenFinish}" stopWhenError="${cnode.stopWhenError}">`
                        var ccojb = cnode.activitySet.graphCreator.nodes;
                        var ce = '\n</GroupServiceLiu>';
                        var ccnodes = "",ccurrtexts="",ccordinaryxml="";
                           ccojb.forEach(function(ccnode){
                                if(ccnode.component=="subFlowActivity"){
                                  ccnodes=`\n<APIServiceLiu code="${ccnode.code}" name="${ccnode.name}" mode="${ccnode.mode}" stopWhenFinish="${ccnode.stopWhenFinish}" stopWhenError="${ccnode.stopWhenError}">
                                              <url>${ccnode.attr.url}</url>
                                              <application_name>${ccnode.attr.application_name}</application_name>
                                              <instance_id>${ccnode.attr.instance_id}</instance_id>
                                              <center_name>${ccnode.attr.center_name}</center_name>
                                          </APIServiceLiu>`
                                    ccurrtexts += ccnodes;
                                }
                                // mq流
                                if(ccnode.component=="ordinaryActivity"){
                                    cordinaryxml=`\n<MQServiceLiu code="${ccnode.code}" name="${ccnode.name}" mode="${ccnode.mode}" stopWhenFinish="${ccnode.stopWhenFinish}" stopWhenError="${ccnode.stopWhenError}">
                                                      <routing_key>${ccnode.attr.routing_key}</routing_key>
                                                      <instance_id>${ccnode.attr.instance_id}</instance_id>
                                                      <center_name>${ccnode.attr.center_name}</center_name>
                                                      <application_name>${ccnode.attr.application_name}</application_name>
                                                  </MQServiceLiu>`;
                                  ccurrtexts += ccordinaryxml; 
                                }
                                if(ccnode.component=="blockActivity"){
                                  return
                                }
                           });
                        cgroup = cs+ccurrtexts+ce;
                        currtexts+=cgroup;
                      }
                  });
                  group=s+currtexts+e;
                  currtext += group; 
              }
              // api服务流
              if(node.component=="subFlowActivity"){
                        apixml=`\n<APIServiceLiu code="${node.code}" name="${node.name}" mode="${node.mode}" stopWhenFinish="${node.stopWhenFinish}" stopWhenError="${node.stopWhenError}">
                              <url>${node.attr.url}</url>
                              <application_name>${node.attr.application_name}</application_name>
                              <instance_id>${node.attr.instance_id}</instance_id>
                              <center_name>${node.attr.center_name}</center_name>
                          </APIServiceLiu>`
                          currtext += apixml;
              }
          });
          start = `<?xml version="1.0" encoding="utf-8"?>\n<StartServiceLiu name="${liuname}">`;
          end = "\n</StartServiceLiu>"
          // 生成xml文件
          if(elem.liuname==""){
            elem.$message("请填写流名称！")
          }
          if(elem.looptime<10){
            elem.$message("循环时间过小！")
          }
          elem.xmlcode = String(start+currtext+end);
        }
        jsonToxml(data.nodes);
        
        //console.log(JSON.stringify(data));
      });
      /**
       * 生成不重复的序列号
       */
      var serial_marker = function() {
        var prefix = "";
        var seq = 1;
        return {
          set_prefix: function(p) {
            prefix = String(p);
          },
          set_seq: function(s) {
            seq = s;
          },
          gensym: function() {
            var result = prefix + seq;
            seq += 1;
            return result;
          }
        };
      };
      /* 与 node edge 无关的js */
      var package_id = "${param.processid}";
      package_id =
        package_id.indexOf("Package_") !== -1
          ? package_id
          : "Package_" + randomWord(false, 24);
      var workflow_name = "流程";
      var workflow_id = package_id + "_Wor1";
      var create_time = new Date(); // 需要从xpdl读取
      var create_type = "${param.kind}";
      create_type =
        create_type.indexOf("param.kind") !== -1 ? create_type : "create"; // html防止报错
      // 定义生成 node id 序列
      var seqer_nodeID = serial_marker();
      seqer_nodeID.set_prefix(workflow_id + "_Act");

      // 定义生成 edge id 序列
      var seqer_edgeID = serial_marker();
      seqer_edgeID.set_prefix(workflow_id + "_Tra");

      // 定义生成 块活动blockId 序列
      var seqer_blockId = serial_marker();
      seqer_blockId.set_prefix(workflow_id + "_Ase");

      $(".full-right>.menu").on("click", ".item", function() {
        var activitysetid = $(this).attr("activitysetid"); // 编辑快活动id
        if (activitysetid) {
          seqer_nodeID.set_prefix(activitysetid + "_Act");
        } else {
          seqer_nodeID.set_prefix(workflow_id + "_Act");
        }

        var containerId = $(this).attr("data-tab"); // graph.containerId
        graphPool.updateGraphActiveById(containerId);

        // tab栏
        var full_right = $(".full-right");
        $(this)
          .addClass("active")
          .siblings()
          .removeClass("active");
        if ($(this).attr("data-tab") == "tab_main") {
          full_right
            .children('a[data-tab="tab_main"]')
            .addClass("actvie")
            .siblings()
            .removeClass("active");
          full_right
            .children('div[data-tab="tab_main"]')
            .show()
            .addClass("actvie");
          full_right
            .children('div[data-tab="tab_main"]')
            .siblings()
            .not(".menu")
            .hide()
            .removeClass("active");
        } else {
          var curr_tab = $(this).attr("data-tab");
          full_right
            .children('div[data-tab="tab_main"]')
            .hide()
            .removeClass("actvie");

          full_right
            .children("div[data-tab=" + curr_tab + "]")
            .show()
            .addClass("actvie");
          full_right
            .children("div[data-tab=" + curr_tab + "]")
            .siblings()
            .not(".menu")
            .removeClass("active")
            .hide();
        }
      });

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
      function refresh(link) {
        if (/(MSIE 10)|(Trident)/.test(navigator.appVersion)) {
          if (link[0] instanceof Array) {
            link[0].forEach(function(item) {
              item.parentNode.insertBefore(item, item);
            });
          } else if (link[0]) {
            var svgNode = link.node();
            svgNode.parentNode.insertBefore(svgNode, svgNode);
          }
        }
      }
      var GraphCreator = function(
        containerId,
        svg,
        nodes,
        edges,
        participants
      ) {
        var thisGraph = this;
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
          drawLine: ""
        };
        // define arrow markers for graph links
        var defs = svg.append("defs");
        defs
          .append("svg:marker")
          .attr("id", thisGraph.containerId + "-end-arrow")
          .attr("viewBox", "0 -5 10 10")
          .attr("refX", 42)
          .attr("markerWidth", 5)
          .attr("markerHeight", 5)
          .attr("orient", "auto")
          .append("svg:path")
          .attr("d", "M0,-5L10,0L0,5");

        //define arrow markers for leading arrow
        defs
          .append("marker")
          .attr("id", thisGraph.containerId + "-mark-end-arrow")
          .attr("viewBox", "0 -5 10 10")
          .attr("refX", 7)
          .attr("markerWidth", 5)
          .attr("markerHeight", 5)
          .attr("orient", "auto")
          .append("svg:path")
          .attr("d", "M0,-5L10,0L0,5");

        //定义选中样式的箭头
        defs
          .append("marker")
          .attr("id", thisGraph.containerId + "-selected-end-arrow")
          .attr("viewBox", "0 -5 10 10")
          .attr("refX", 30)
          .attr("markerWidth", 5)
          .attr("markerHeight", 5)
          .attr("orient", "auto")
          .append("svg:path")
          .attr("d", "M0,-5L10,0L0,5")
          .attr("fill", "rgb(229, 172, 247)");

        thisGraph.svg = svg;
        thisGraph.show_position = svg.append("text").attr({
          x: 800,
          y: 15,
          fill: "#E1784B"
        });
        thisGraph.svgG = svg
          .append("g")
          .classed(thisGraph.consts.graphClass, true);
        var svgG = thisGraph.svgG;

        // displayed when dragging between nodes
        thisGraph.dragLine = svgG
          .append("path")
          .attr("class", "link dragline hidden")
          .attr("d", "M0,0L0,0")
          .style(
            "marker-end",
            "url(#" + thisGraph.containerId + "-mark-end-arrow)"
          );

        // svg nodes and edges
        thisGraph.paths = svgG.append("g").selectAll("g");
        thisGraph.circles = svgG.append("g").selectAll("g");

        thisGraph.drag = d3.behavior
          .drag()
          .origin(function(d) {
            // d = selected circle. The drag origin is the origin of the circle
            return {
              x: d.x,
              y: d.y
            };
          })
          .on("dragstart", function() {
            d3
              .select(this)
              .select("circle")
              .attr(
                "r",
                thisGraph.consts.nodeRadius + thisGraph.consts.nodeRadiusVary
              );
          })
          .on("drag", function(args) {
            thisGraph.state.justDragged = true;
            thisGraph.dragmove.call(thisGraph, args);
          })
          .on("dragend", function(args) {
            // args = circle that was dragged
            d3
              .select(this)
              .select("circle")
              .attr(
                "r",
                thisGraph.consts.nodeRadius - thisGraph.consts.nodeRadiusVary
              );
          });

        // listen for key events
        d3
          .select(window)
          .on("keydown", function() {
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
          thisGraph.show_position.text(
            "pos: " +
              d3.mouse(svgG.node())[0].toFixed(0) +
              ", " +
              d3.mouse(svgG.node())[1].toFixed(0)
          );
        });

        // listen for dragging
        var dragSvg = d3.behavior
          .zoom()
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
            if (!d3.event.sourceEvent.shiftKey)
              d3.select("body").style("cursor", "move");
          })
          .on("zoomend", function() {
            // console.log('zoomend triggered');
            d3.select("body").style("cursor", "auto");
          });
        thisGraph.dragSvg = dragSvg;
        svg.call(dragSvg).on("dblclick.zoom", null);

        // listen for resize
        window.onresize = function() {
          thisGraph.updateWindow(svg);
        };
        $("#flowComponents .components-btn[type]")
          .not(".noComponent")
          .attr("draggable", "true")
          .on("dragstart", function(ev) {
            // $('.full-left').css({cursor: 'no-drop'});
            $(this)
              .siblings()
              .removeClass("active")
              .end()
              .addClass("active");
            $(".full-right>.tab.active .full-right-top").addClass("activate");
            /* 设置拖动过程显示图片
                  var icon = document.createElement('img');
                  icon.src = $(this).find('img').attr('src');
                  ev.originalEvent.dataTransfer.setDragImage(icon,10,10);*/
            var json_obj = {
              text: $(this).attr("data-show"),
              component: $(this).attr("name"),
              type: $(this).attr("type")
            };
            ev.originalEvent.dataTransfer.setData(
              "tr_data",
              JSON.stringify(json_obj)
            );
          })
          .on("dragend", function(ev) {
            $(".full-right>.tab.active .full-right-top").removeClass(
              "activate"
            );
          });

        $(".full-right .tab.active")
          .on("drop", ".svg-container", function(ev) {
            ev.stopPropagation();
            ev.preventDefault();
            var position = {
              x: parseFloat(ev.originalEvent.offsetX),
              y: parseFloat(ev.originalEvent.offsetY)
            };

            position = thisGraph.parsePosition(this, position);
            var data = JSON.parse(
              ev.originalEvent.dataTransfer.getData("tr_data")
            );
            data = $.extend(data, position);
            var node = thisGraph.createNode(data);

            thisGraph.nodes.push(node);
            thisGraph.updateGraph();
          })
          .on("dragover", function(ev) {
            ev.preventDefault();
          });
      };
      // 右击显示菜单
      GraphCreator.prototype.showMenu = function() {
        var thisGraph = this;
        $("#flowComponents div[name=selectBtn]").trigger("click");
        thisGraph.circles.style({ cursor: "default" }); // 防止在活动块上右击存在问题
        var selectedNode = thisGraph.state.selectedNode,
          selectedEdge = thisGraph.state.selectedEdge;
        if (selectedNode) {
          if (selectedNode.type == "activity") {
            $("#rMenu a[name=propMenu]").show();
            if (selectedNode.component == "blockActivity") {
              $("#rMenu a[name=editMenu]").show();
            } else {
              $("#rMenu a[name=editMenu]").hide();
            }
          } else {
            $("#rMenu a[name=propMenu]").hide();
            $("#rMenu a[name=editMenu]").hide();
          }
        } else if (selectedEdge) {
          var sourceType = selectedEdge.source.type,
            targetType = selectedEdge.target.type;
          $("#rMenu a[name=editMenu]").hide();
          if (sourceType == "start" || targetType == "end") {
            $("#rMenu a[name=propMenu]").hide();
          } else {
            $("#rMenu a[name=propMenu]").show();
          }
        }
        d3.select("#rMenu").style({
          top: d3.event.clientY - 2 + "px",
          left: d3.event.clientX - 2 + "px",
          display: "block"
        });
        d3.select("#rMenu").on("contextmenu", function() {
          d3.event.preventDefault();
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
        var mid_x = (d.x + des.x) / 2,
          mid_y = (d.y + des.y) / 2;
        var dif_x = des.x - d.x,
          dif_y = des.y - d.y;
        var link;
        if (Math.abs(dif_x) > Math.abs(dif_y)) {
          // 左右连线
          if (dif_x > 0 && dif_y > 0) {
            //第一象限（200,200-300,300）
            // <path d="M 200,200 L 245,200 M 245,200 A 5,5,0,0,1 250,205 M 250,205 L 250,295 M 250,295 A 5,5,0,0,0 255,300 M 255,300 L 300,300" fill="none" stroke="#F18C16" stroke-width="1"></path>
            link =
              "M" +
              d.x +
              "," +
              d.y +
              "L" +
              (mid_x - 5) +
              "," +
              d.y +
              "M" +
              (mid_x - 5) +
              "," +
              d.y +
              "A 5,5,0,0,1 " +
              mid_x +
              "," +
              (d.y + 5) +
              "M" +
              mid_x +
              "," +
              (d.y + 5) +
              "L" +
              mid_x +
              "," +
              (des.y - 5) +
              "M" +
              mid_x +
              "," +
              (des.y - 5) +
              "A 5,5,0,0,0" +
              (mid_x + 5) +
              "," +
              des.y +
              "M" +
              (mid_x + 5) +
              "," +
              des.y +
              "L" +
              des.x +
              "," +
              des.y;
          }
          if (dif_x < 0 && dif_y > 0) {
            //第二象限（200,200-100,300）
            // <path d="M 200,200 L 155,200 M 155,200 A 5,5,0,0,0 150,205 M 150,205 L 150,295 M 150,295 A 5,5,0,0,1 145,300 M 145,300 L 100,300" fill="none" stroke="#F18C16" stroke-width="1"></path>
            link =
              "M" +
              d.x +
              "," +
              d.y +
              "L" +
              (mid_x + 5) +
              "," +
              d.y +
              "M" +
              (mid_x + 5) +
              "," +
              d.y +
              "A 5,5,0,0,0 " +
              mid_x +
              "," +
              (d.y + 5) +
              "M" +
              mid_x +
              "," +
              (d.y + 5) +
              "L" +
              mid_x +
              "," +
              (des.y - 5) +
              "M" +
              mid_x +
              "," +
              (des.y - 5) +
              "A 5,5,0,0,1" +
              (mid_x - 5) +
              "," +
              des.y +
              "M" +
              (mid_x - 5) +
              "," +
              des.y +
              "L" +
              des.x +
              "," +
              des.y;
          }
          if (dif_x < 0 && dif_y < 0) {
            //第三象限（200,200-100,100）
            // <path d="M 200,200 L 155,200 M 155,200 A 5,5,0,0,1 150,195 M 150,195 L 150,105 M 150,105 A 5,5,0,0,0 145,100 M 145,100 L 100,100" fill="none" stroke="#F18C16" stroke-width="1"></path>
            link =
              "M" +
              d.x +
              "," +
              d.y +
              "L" +
              (mid_x + 5) +
              "," +
              d.y +
              "M" +
              (mid_x + 5) +
              "," +
              d.y +
              "A 5,5,0,0,1 " +
              mid_x +
              "," +
              (d.y - 5) +
              "M" +
              mid_x +
              "," +
              (d.y - 5) +
              "L" +
              mid_x +
              "," +
              (des.y + 5) +
              "M" +
              mid_x +
              "," +
              (des.y + 5) +
              "A 5,5,0,0,0" +
              (mid_x - 5) +
              "," +
              des.y +
              "M" +
              (mid_x - 5) +
              "," +
              des.y +
              "L" +
              des.x +
              "," +
              des.y;
          }
          if (dif_x > 0 && dif_y < 0) {
            //第四象限（200,200-300,100）
            // <path d="M 200,200 L 245,200 M 245,200 A 5,5,0,0,0 250,195 M 250,195 L 250,105 M 250,105 A 5,5,0,0,1 255,100 M 255,100 L 300,100" fill="none" stroke="#F18C16" stroke-width="1"></path>
            link =
              "M" +
              d.x +
              "," +
              d.y +
              "L" +
              (mid_x - 5) +
              "," +
              d.y +
              "M" +
              (mid_x - 5) +
              "," +
              d.y +
              "A 5,5,0,0,0 " +
              mid_x +
              "," +
              (d.y - 5) +
              "M" +
              mid_x +
              "," +
              (d.y - 5) +
              "L" +
              mid_x +
              "," +
              (des.y + 5) +
              "M" +
              mid_x +
              "," +
              (des.y + 5) +
              "A 5,5,0,0,1" +
              (mid_x + 5) +
              "," +
              des.y +
              "M" +
              (mid_x + 5) +
              "," +
              des.y +
              "L" +
              des.x +
              "," +
              des.y;
          }
        } else {
          // 上下连线
          if (dif_x > 0 && dif_y > 0) {
            //第一象限（200,200-300,300）
            // <path d="M 100,100 L 100,145 M 100,145 A 5,5,0,0,0 105,150 M 105,150 L 195,150 M 195,150 A 5,5,0,0,1 200,155 M 200,155 L 200,200" fill="none" stroke="#0096f2" stroke-width="1"></path>
            link =
              "M" +
              d.x +
              "," +
              d.y +
              "L" +
              d.x +
              "," +
              (mid_y - 5) +
              "M" +
              d.x +
              "," +
              (mid_y - 5) +
              "A 5,5,0,0,0 " +
              (d.x + 5) +
              "," +
              mid_y +
              "M" +
              (d.x + 5) +
              "," +
              mid_y +
              "L" +
              (des.x - 5) +
              "," +
              mid_y +
              "M" +
              (des.x - 5) +
              "," +
              mid_y +
              "A 5,5,0,0,1" +
              des.x +
              "," +
              (mid_y + 5) +
              "M" +
              des.x +
              "," +
              (mid_y + 5) +
              "L" +
              des.x +
              "," +
              des.y;
          }
          if (dif_x < 0 && dif_y > 0) {
            //第二象限（200,200-100,300）
            // <path d="M 200,200 L 200,245 M 200,245 A 5,5,0,0,1 195,250 M 195,250 L 105,250 M 105,250 A 5,5,0,0,0 100,255 M 100,255 L 100,300" fill="none" stroke="#0096f2" stroke-width="1"></path>
            link =
              "M" +
              d.x +
              "," +
              d.y +
              "L" +
              d.x +
              "," +
              (mid_y - 5) +
              "M" +
              d.x +
              "," +
              (mid_y - 5) +
              "A 5,5,0,0,1 " +
              (d.x - 5) +
              "," +
              mid_y +
              "M" +
              (d.x - 5) +
              "," +
              mid_y +
              "L" +
              (des.x + 5) +
              "," +
              mid_y +
              "M" +
              (des.x + 5) +
              "," +
              mid_y +
              "A 5,5,0,0,0" +
              des.x +
              "," +
              (mid_y + 5) +
              "M" +
              des.x +
              "," +
              (mid_y + 5) +
              "L" +
              des.x +
              "," +
              des.y;
          }
          if (dif_x < 0 && dif_y < 0) {
            //第三象限（200,200-100,100）
            // <path d="M 200,200 L 200,155 M 200,155 A 5,5,0,0,0 195,150 M 195,150 L 105,150 M 105,150 A 5,5,0,0,1 100,145 M 100,145 L 100,100" fill="none" stroke="#0096f2" stroke-width="1"></path>
            link =
              "M" +
              d.x +
              "," +
              d.y +
              "L" +
              d.x +
              "," +
              (mid_y + 5) +
              "M" +
              d.x +
              "," +
              (mid_y + 5) +
              "A 5,5,0,0,0 " +
              (d.x - 5) +
              "," +
              mid_y +
              "M" +
              (d.x - 5) +
              "," +
              mid_y +
              "L" +
              (des.x + 5) +
              "," +
              mid_y +
              "M" +
              (des.x + 5) +
              "," +
              mid_y +
              "A 5,5,0,0,1" +
              des.x +
              "," +
              (mid_y - 5) +
              "M" +
              des.x +
              "," +
              (mid_y - 5) +
              "L" +
              des.x +
              "," +
              des.y;
          }
          if (dif_x > 0 && dif_y < 0) {
            //第四象限（200,200-300,100）
            // <path d="M 200,200 L 200,155 M 200,155 A 5,5,0,0,1 205,150 M 205,150 L 295,150 M 295,150 A 5,5,0,0,0 300,145 M 300,145 L 300,100" fill="none" stroke="#0096f2" stroke-width="1"></path>
            link =
              "M" +
              d.x +
              "," +
              d.y +
              "L" +
              d.x +
              "," +
              (mid_y + 5) +
              "M" +
              d.x +
              "," +
              (mid_y + 5) +
              "A 5,5,0,0,1 " +
              (d.x + 5) +
              "," +
              mid_y +
              "M" +
              (d.x + 5) +
              "," +
              mid_y +
              "L" +
              (des.x - 5) +
              "," +
              mid_y +
              "M" +
              (des.x - 5) +
              "," +
              mid_y +
              "A 5,5,0,0,0" +
              des.x +
              "," +
              (mid_y - 5) +
              "M" +
              des.x +
              "," +
              (mid_y - 5) +
              "L" +
              des.x +
              "," +
              des.y;
          }
        }
        return link;
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

      // /**
      //   * 判断node有无连线
      //   * @param  {object}  node       节点
      //   * @param  {Boolean} isActivity 是否是与activity的连线，true 不包括开始和结束节点
      //   * @param  {Boolean} type       连线类型：-1 指向node 0 所有连线 1 从node连出
      //   * @return {Boolean}            hasLinked
      //   */
      GraphCreator.prototype.hasLinked = function(node, isActivity, type) {
        var thisGraph = this;
        isActivity = isActivity || false;
        type = type || 0;
        var edges = [];
        if (isActivity) {
          edges = thisGraph.edges.filter(function(edge, index) {
            return (
              edge.source.type == "activity" && edge.target.type == "activity"
            );
          });
        } else {
          edges = thisGraph.edges;
        }
        var hasLinked = edges.some(function(edge, index) {
          if (type == 0) {
            return edge.source.id == node.id || edge.target.id == node.id;
          } else if (type == -1) {
            return edge.target.id == node.id;
          } else if (type == 1) {
            return edge.source.id == node.id;
          }
        });
        return hasLinked;
      };
      /* PROTOTYPE FUNCTIONS */
      GraphCreator.prototype.dragmove = function(d) {
        var thisGraph = this;
        var drawLine = thisGraph.state.drawLine;
        var link;
        if (thisGraph.state.shiftNodeDrag || drawLine) {
          var svgG = thisGraph.svgG,
            dragLine = thisGraph.dragLine;
          switch (drawLine) {
            case "NOROUTING": // 直线
              link = dragLine.attr(
                "d",
                "M" +
                  d.x +
                  "," +
                  d.y +
                  "L" +
                  d3.mouse(svgG.node())[0] +
                  "," +
                  d3.mouse(svgG.node())[1]
              );
              break;
            case "SIMPLEROUTING": // 折线
              var des = {
                x: d3.mouse(svgG.node())[0],
                y: d3.mouse(svgG.node())[1]
              };
              var link_d = thisGraph.getLink_d(d, des);
              link = dragLine.attr("d", link_d);
              break;
          }
          refresh(link); // 兼容IE11
        } else {
          d.x += d3.event.dx;
          d.y += d3.event.dy;
          thisGraph.updateGraph();
          /*
                        // 防止circle脱出svg范围(放大缩小后还存在问题，待修改...)
                        var radius = thisGraph.consts.nodeRadius + thisGraph.consts.nodeRadiusVary,
                          svg_width = $('svg').width(),
                          svg_heigh = $('svg').height();
                        d.x = Math.max(Math.min(d3.event.x, svg_width-radius), radius);
                        d.y = Math.max(Math.min(d3.event.y, svg_heigh-radius), radius);
                        thisGraph.updateGraph();*/
        }
      };

      GraphCreator.prototype.deleteGraph = function() {
        var thisGraph = this;
        thisGraph.nodes = [];
        thisGraph.edges = [];
        thisGraph.updateGraph();
      };

      /* select all text in element: taken from http://stackoverflow.com/questions/6139107/programatically-select-text-in-a-contenteditable-html-element */
      GraphCreator.prototype.selectElementContents = function(el) {
        var range = document.createRange();
        range.selectNodeContents(el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      };

      /* insert svg line breaks: taken from http://stackoverflow.com/questions/13241475/how-do-i-include-newlines-in-labels-in-d3-charts */
      GraphCreator.prototype.insertTitleLinebreaks = function(gEl, d) {
        
        var words = d.name.split(/\s+/g),
          nwords = words.length;
        var el = gEl
          .append("text")
          .attr("text-anchor", "middle")
          .attr("letter-spacing", "1");
        switch (d.type) {
          case "start":
          case "end":
            el.attr("dy", "13");
            break;
          default:
            el.attr("dy", "-" + (nwords - 1) * 7.5);
            break;
        }
        for (var i = 0; i < words.length; i++) {
          var tspan = el.append("tspan").text(words[i]);
          if (i > 0) tspan.attr("x", 0).attr("dy", "15");
        }
      };
      // remove edges associated with a node
      GraphCreator.prototype.spliceLinksForNode = function(node) {
        var thisGraph = this,
          toSplice = thisGraph.edges.filter(function(l) {
            return l.source === node || l.target === node;
          });
        toSplice.map(function(l) {
          thisGraph.edges.splice(thisGraph.edges.indexOf(l), 1);
        });
      };

      GraphCreator.prototype.replaceSelectEdge = function(d3Path, edgeData) {
        var thisGraph = this;
        d3Path.classed(thisGraph.consts.selectedClass, true);
        //修改箭头样式
        // d3Path.style('marker-end', 'url(#selected-end-arrow)');
        if (thisGraph.state.selectedEdge) {
          thisGraph.removeSelectFromEdge();
        }
        thisGraph.state.selectedEdge = edgeData;
      };

      GraphCreator.prototype.replaceSelectNode = function(d3Node, nodeData) {
        // A circle node has been selected.
        var thisGraph = this;
        d3Node.classed(this.consts.selectedClass, true);
        if (thisGraph.state.selectedNode) {
          thisGraph.removeSelectFromNode();
        }
        thisGraph.state.selectedNode = nodeData;
      };

      GraphCreator.prototype.removeSelectFromNode = function() {
        // A circle node has been deselected.

        var thisGraph = this;
        thisGraph.circles
          .filter(function(cd) {
            return cd.id === thisGraph.state.selectedNode.id;
          })
          .classed(thisGraph.consts.selectedClass, false);
        thisGraph.state.selectedNode = null;

        d3.selectAll("#inspector").remove();
      };

      GraphCreator.prototype.removeSelectFromEdge = function() {
        var thisGraph = this;
        thisGraph.paths
          .filter(function(cd) {
            return cd === thisGraph.state.selectedEdge;
          })
          .classed(thisGraph.consts.selectedClass, false);
        thisGraph.state.selectedEdge = null;
      };

      GraphCreator.prototype.pathMouseDown = function(d3path, d) {
        var thisGraph = this,
          state = thisGraph.state;
        d3.event.stopPropagation();
        state.mouseDownLink = d;

        if (state.selectedNode) {
          thisGraph.removeSelectFromNode();
        }

        var prevEdge = state.selectedEdge;
        if (!prevEdge || prevEdge !== d) {
          thisGraph.replaceSelectEdge(d3path, d);
        } else {
          if (d3.event.button != 2) {
            thisGraph.removeSelectFromEdge();
            // d.style('marker-end', 'url(#end-arrow)');
          }
        }
        if (d3.event.button == 2) {
          thisGraph.showMenu();
          // thisGraph.menuEvent();
        }
      };

      // mousedown on node
      GraphCreator.prototype.circleMouseDown = function(d3node, d) {
        var thisGraph = this,
          state = thisGraph.state;
        d3.event.stopPropagation();
        state.mouseDownNode = d;

        if (d3.event.shiftKey || thisGraph.state.drawLine) {
          var result = thisGraph.isAllowLinking(d);
          if (!result.success) {
            elem.$message({
              type: "info",
              message: result.msg
            });
            return;
          }
          // Automatically create node when they shift + drag?
          state.shiftNodeDrag = d3.event.shiftKey;
          // reposition dragged directed edge
          var link = thisGraph.dragLine
            .classed("hidden", false)
            .attr("d", "M" + d.x + "," + d.y + "L" + d.x + "," + d.y);
          refresh(link); // 兼容IE11
          return;
        }
      };
      // mouseup on nodes
      GraphCreator.prototype.circleMouseUp = function(d3node, d) {
        var thisGraph = this,
          state = thisGraph.state,
          consts = thisGraph.consts;
        // reset the states
        state.shiftNodeDrag = false;
        d3node.classed(consts.connectClass, false);

        var mouseDownNode = state.mouseDownNode;
        if (!mouseDownNode) return;

        thisGraph.dragLine.classed("hidden", true);

        if (mouseDownNode !== d) {
          var result = thisGraph.isAllowLinked(d, mouseDownNode);
          if (!result.success) {
            elem.$message({
              type: "info",
              message: result.msg
            });
            return;
          }
          // we're in a different node: create new edge for mousedown edge and add to graph
          var newEdge = {
            edgeId: seqer_edgeID.gensym(),
            source: mouseDownNode,
            target: d,
            drawLine: thisGraph.state.drawLine
          };
          var filtRes = thisGraph.paths.filter(function(d) {
            if (d.source === newEdge.target && d.target === newEdge.source) {
              thisGraph.edges.splice(thisGraph.edges.indexOf(d), 1);
            }
            return d.source === newEdge.source && d.target === newEdge.target;
          });
          if (!filtRes[0].length) {
            thisGraph.edges.push(newEdge);
            thisGraph.updateGraph();
          }
        } else {
          // we're in the same node
          var prevNode = state.selectedNode;
          if (state.justDragged) {
            // dragged, not clicked
            if (state.selectedEdge) {
              thisGraph.removeSelectFromEdge();
            }
            if (!prevNode || prevNode !== d) {
              thisGraph.replaceSelectNode(d3node, d);
              thisGraph.changePropDiv(d); // 添加更改属性div
            } else {
              // thisGraph.removeSelectFromNode();
            }
          } else {
            // clicked, not dragged
            if (d3.event.shiftKey) {
            } else {
              if (state.selectedEdge) {
                thisGraph.removeSelectFromEdge();
              }
              if (!prevNode || prevNode !== d) {
                thisGraph.replaceSelectNode(d3node, d);
                thisGraph.changePropDiv(d); // 添加更改属性div
                // 防止双击左键误触
                if (d3.event.button !== 0) {
                  thisGraph.showMenu();
                }
                thisGraph.showMenu();
                // thisGraph.menuEvent();
              } else {
                if (d3.event.button == "2") {
                  thisGraph.showMenu();
                  // thisGraph.menuEvent();
                } else {
                  thisGraph.removeSelectFromNode();
                }
              }
            }
          }
        }
        state.mouseDownNode = null;
        state.justDragged = false;
        return;
      }; // end of circles mouseup

      // /**
      //   * 判断节点是否允许被连线
      //   * @param  {Object}  mouseDownNode 连线开始节点
      //   * @param  {Object}  eventNode     连线结束节点
      //   * @return {Object}                连线是否成功信息
      //   */
      GraphCreator.prototype.isAllowLinked = function(
        eventNode,
        mouseDownNode
      ) {
        var thisGraph = this;
        var result = {
          success: true,
          msg: ""
        };
        switch (eventNode.type) {
          case "start":
            result.success = false;
            result.msg = "不允许";
            break;
          case "end":
            if (thisGraph.hasLinked(eventNode)) {
              result.success = false;
              result.msg = "已有连线！";
            }
            break;
        }
        switch (mouseDownNode.type) {
          case "start":
            if (thisGraph.hasLinked(mouseDownNode)) {
              result.success = false;
              result.msg = "已有连线！";
            }
            break;
          case "end":
            result.success = false;
            result.msg = "不允许";
            break;
          case "activity":
            var edges = thisGraph.getLinkedEdges(mouseDownNode, 1);
            var edgeLinkEnd = edges.filter(function(edge) {
              return edge.target.type == "end";
            });
            if (edgeLinkEnd.length) {
              result.success = false;
              result.msg = "活动不能有转出转移！";
            }
            break;
        }
        return result;
      };

      // /**
      // * 判断节点是否允许连线
      // * @param  {Object}  eventNode 出发实践节点对象
      // * @return {Object}            连线是否成功信息
      // */
      GraphCreator.prototype.isAllowLinking = function(eventNode) {
        var thisGraph = this;
        var result = {
          success: true,
          msg: ""
        };
        switch (eventNode.type) {
          case "start":
            if (thisGraph.hasLinked(eventNode)) {
              result.success = false;
              result.msg = "已有连线！";
            }
            break;
          case "end":
            result.success = false;
            result.msg = "不允许！";
            break;
          case "activity":
            var edges = thisGraph.getLinkedEdges(eventNode, 1);
            var edgeLinkEnd = edges.filter(function(edge) {
              return edge.target.type === "end";
            });
            if (edgeLinkEnd.length) {
              result.success = false;
              result.msg = "活动不能有转出转移！";
            }
            break;
        }
        return result;
      };

      GraphCreator.prototype.updateWindow = function(svg) {
        var docEl = document.documentElement,
          bodyEl = document.getElementsByTagName("body")[0];
        var x = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth;
        var y = window.innerHeight || docEl.clientHeight || bodyEl.clientHeight;
        svg.attr("width", x).attr("height", y);
      };
      /**
       * 创建子流程graph对象
       */
      GraphCreator.prototype.createSubGraph = function() {
        var thisGraph = this;
        var containerId = d3.select(".full-right>.tab.active").attr("data-tab"),
          activitySetId = d3
            .select(".full-right>.menu>.item.active")
            .attr("activitysetid");

        var svg = d3
          .select(".full-right>.tab.active .svg-container")
          .append("svg")
          .attr("width", "100%")
          .attr("height", "100%");
        /*
                  var editedBlockNode = graph_main.nodes.find(function(node) {
                    return (node.component == 'blockActivity' && node.activitySet.activitySetId == activitySetId);
                  });*/
        var editedBlockNode = thisGraph.state.selectedNode;

        var subGraph = editedBlockNode.activitySet.graphCreator;
        var pools = graphPool.pools;
        var isExist = pools.indexOf(subGraph);
        if (isExist === -1) {
          var graph_active;
          if (subGraph) {
            graph_active = new GraphCreator(
              containerId,
              svg,
              subGraph.nodes,
              subGraph.edges,
              subGraph.participants
            );
          } else {
            graph_active = new GraphCreator(containerId, svg, [], [], []);
            editedBlockNode.activitySet.graphCreator = graph_active;
          }
          pools.push(graph_active);
          graphPool.updateGraphActiveById(containerId);
          graph_active.updateGraph();
        }
      };
      GraphCreator.prototype.createNode = function(data) {
        var node;
        switch (data.type) {
          case "activity":
            node = {
              id: seqer_nodeID.gensym(),
              name: data.text,
              component: data.component,
              code:generateUUID(),
              type: data.type,
              x: data.x,
              y: data.y
              // monitorinf: {isResponsibleTem: true},
              // eventTypeId: null
            };
            if (data.component == "blockActivity") {
              node.activitySet = {
                activitySetId: seqer_blockId.gensym(),
                graphCreator: null
              };
            }
            break;
          default:
            // 开始、结束节点
            node = {
              id: generateUUID(),
              name: data.text,
              component: data.component,
              type: data.type,
              x: data.x,
              y: data.y
            };
            break;
        }
        return node;
      };
      // mouseup on main svg
      GraphCreator.prototype.svgMouseUp = function() {
        var thisGraph = this,
          state = thisGraph.state;
        if (state.justScaleTransGraph) {
          // dragged not clicked
          state.justScaleTransGraph = false;
        } else if (state.graphMouseDown && d3.event.shiftKey) {
          // clicked not dragged from svg
          var xycoords = d3.mouse(thisGraph.svgG.node()),
            d = {
              id: seqer_nodeID.gensym(),
              name: "普通活动",
              component: "ordinaryActivity",
              type: "activity",
              x: xycoords[0],
              y: xycoords[1]
              // monitorinf: {isResponsibleTem: true},
              // eventTypeId: null
            };
          thisGraph.nodes.push(d);
          thisGraph.updateGraph();
        } else if (state.shiftNodeDrag || state.drawLine) {
          // dragged from node
          state.shiftNodeDrag = false;
          thisGraph.dragLine.classed("hidden", true); //win7 IE11下存在bug
        }
        state.graphMouseDown = false;
      };

      // keydown on main svg
      GraphCreator.prototype.svgKeyDown = function() {
        var thisGraph = this,
          state = thisGraph.state,
          consts = thisGraph.consts;
        // make sure repeated key presses don't register for each keydown
        if (state.lastKeyDown !== -1) return;

        state.lastKeyDown = d3.event.keyCode;
        var selectedNode = state.selectedNode,
          selectedEdge = state.selectedEdge;
        /*
                switch (d3.event.keyCode) {
                  //case consts.BACKSPACE_KEY:
                  case consts.DELETE_KEY:
                    d3.event.preventDefault();
                    if (selectedNode) {
                      thisGraph.nodes.splice(thisGraph.nodes.indexOf(selectedNode), 1);
                      thisGraph.spliceLinksForNode(selectedNode);
                      state.selectedNode = null;
                      thisGraph.updateGraph();
                      // thisGraph.
                    } else if (selectedEdge) {
                      thisGraph.edges.splice(thisGraph.edges.indexOf(selectedEdge), 1);
                      state.selectedEdge = null;
                      thisGraph.updateGraph();
                    }
                    break;
                }*/
      };
      GraphCreator.prototype.svgKeyUp = function() {
        this.state.lastKeyDown = -1;
      };
      // mousedown on main svg
      GraphCreator.prototype.svgMouseDown = function() {
        this.state.graphMouseDown = true;
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
        var link = paths
          .style("marker-end", "url(#" + thisGraph.containerId + "-end-arrow)")
          .classed(consts.selectedClass, function(d) {
            return d === state.selectedEdge;
          })
          .attr("d", function(d) {
            if (d.drawLine == "NOROUTING") {
              return (
                "M" +
                d.source.x +
                "," +
                d.source.y +
                "L" +
                d.target.x +
                "," +
                d.target.y
              );
            }
            if (d.drawLine == "SIMPLEROUTING") {
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
        paths
          .enter()
          .append("path")
          .style("marker-end", "url(#" + thisGraph.containerId + "-end-arrow)")
          .classed("link", true)
          .attr("d", function(d) {
            if (d.drawLine == "NOROUTING") {
              return (
                "M" +
                d.source.x +
                "," +
                d.source.y +
                "L" +
                d.target.x +
                "," +
                d.target.y
              );
            }
            if (d.drawLine == "SIMPLEROUTING") {
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
          if (d == state.selectedNode) {
            // 更新节点名称
            var tspan = d3.select(this).select("tspan");
            if (tspan.text() !== d.name) {
              tspan.text(d.name);
            }
          }
          return "translate(" + d.x + "," + d.y + ")";
        });

        // add new nodes
        var newGs = thisGraph.circles
          .enter()
          .append("g")
          .attr({
            id: function(d) {
              return generateUUID();
            }
          });

        newGs
          .classed(consts.circleGClass, true)
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

        newGs.append("circle").attr("r", String(consts.nodeRadius));

        newGs.each(function(d) {
          switch (d.type) {
            case "start":
              d3.select(this).classed("start", true);
              break;
            case "end":
              d3.select(this).classed("end", true);
              break;
          }
          thisGraph.insertTitleLinebreaks(d3.select(this), d);
        });

        // remove old nodes
        thisGraph.circles.exit().remove();
      };

      //生成所有activity xml添加至xmlContainer
      GraphCreator.prototype.emergeAllXmlContent = function() {
        var thisGraph = this;
        var start =
            '<StartServiceLiu  Id="' +
            workflow_id +
            '" Name="' +
            workflow_name +
            '" endform-id="" endformschema="">',
          end = "</StartServiceLiu>";

        var curText = start,
          activity = "";
        thisGraph.nodes.forEach(function(node) {
          if (node.type == "activity") {
            activity =
              '<activity Id="' +
              node.id +
              '" Name="' +
              node.name +
              '" form-id="" formdisplayschema="" hisformdisplayschema="">' +
              "  <operations/>" +
              "  <text-limit/>" +
              "</activity>";
            curText += activity;
          }
        });
        curText += end;
        curText = vkbeautify.xml(curText);
        return curText;
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
      // /**
      //   * 根据缩放比例和偏移量转换坐标
      //   * @param  {DOM}    svgContainer .svgContainer元素
      //   * @param  {Object} position     位置坐标
      //   * @return {Object} position     转换后的坐标
      //   */
      GraphCreator.prototype.parsePosition = function(svgContainer, position) {
        var transform = $(svgContainer)
          .find(".graph")
          .attr("transform"); // transform="translate(20,11) scale(1)"
        if (transform) {
          var result = []; // ['20,11', '1']
          var regExp_ = /\(([^)]*)\)/g;
          var ele;
          while ((ele = regExp_.exec(transform)) != null) {
            result.push(ele[1]);
          }
          var translate = (result[0] && result[0].split(/,|\s/)) || [0, 0]; // IE11 result[0] 为 '23.45 22.87'
          var scale = (result[1] && result[1].split(",")[0]) || 1;
          if (translate.length == 1 && translate[0] == 0) {
            // 兼容IE11
            translate.push(0);
          }
          position.x = (position.x - translate[0]) / scale;
          position.y = (position.y - translate[1]) / scale;
        }
        return position;
      };
      //更改属性div
      GraphCreator.prototype.changePropDiv = function(d) {
        var thisGraph = this;
        $(".component-prop")
          .empty()
          .append(
            "<div>" +
              '  <div name="id" class="prop-value"><span>id:</span><span>' +
              d.id +
              "</span></div>" +
              '  <div name="name" class="prop-value"><span>名称:</span><span>' +
              d.name +
              "</span></div>" +
              "</div>" +
              '<div class="clearfix"></div>' +
              "<div> " +
              '  <div name="type" class="prop-value"><span>类型:</span><span>' +
              d.component +
              "</span></div>" +
              '  <div name="" class="prop-value"><span>执行者:</span><span>无</span></div>' +
              "</div>" +
              '<div class="clearfix"></div>'
          );
      };
      GraphCreator.prototype.zoomed = function() {
        this.state.justScaleTransGraph = true;
        var translate = this.dragSvg.translate();
        var scale = this.dragSvg.scale();
        if (!translate[0]) translate = [0, 0];
        if (!scale) scale = 1;
        d3
          .select(".full-right>.tab.active ." + this.consts.graphClass)
          .attr(
            "transform",
            "translate(" + translate + ") scale(" + scale + ")"
          );
      };
      /**** MAIN ****/
      var container = d3.select('[data-tab="tab_main"] .svg-container').node(),
        containerId = "tab_main";

      var svg = d3
        .select('[data-tab="tab_main"] .svg-container')
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

      var initialDate = this.initFlowChart();
      window.graph_main = new GraphCreator(
        containerId,
        svg,
        initialDate.nodes,
        initialDate.edges,
        initialDate.participants
      );
      graphPool.pools.push(graph_main);
      graph_main.updateGraph();
      $("#flowComponents .components-btn").on("click", handleComponentsBtn);
      //  事件集合
      $(".full-right").on("click", ".el-icon-close", function() {
        var tab_id = $(this)
          .parent("a")
          .attr("data-tab");
        if (tab_id == "tab_main") {
          alert("主界面不能关闭！");
        } else {
          $(".full-right")
            .find('[data-tab="' + tab_id + '"]')
            .removeClass("active")
            .hide();
          $('.full-right>.menu [data-tab="tab_main"]').trigger("click");
        }
      });
    },
    initFlowChart() {
      var initialDate = {
        nodes: [],
        edges: [],
        participants: []
      };
      return initialDate;
    }
  },
  beforeMount () {
    $eventBus.$on('init', () => {
      require('brace/mode/sql');
      require('brace/mode/javascript');
      require('brace/mode/java');
      require('brace/mode/xml');
      require('brace/snippets/sql');
      require('brace/snippets/javascript');
      require('brace/snippets/java');
      require('brace/snippets/xml');
      require('brace/theme/chrome');
      require('brace/theme/monokai');
      require('brace/theme/clouds');
      require('brace/theme/dawn');
      require('brace/theme/eclipse');
      require('brace/theme/github');
      require('brace/theme/terminal');
      require('brace/theme/sqlserver');
      require('brace/theme/tomorrow');
      require('brace/ext/language_tools');
    });
  },
  mounted() {
    this.IniterCanvas();
    $eventBus.$on('updatecode', (val) => {
      this.code = val;
    });
  },
  watch: {
    'editorConfigData.isReadonly': {
      handler: function(val){
        if(val === '否'){
          this.editConfig.isReadonly = false
        }else{
          this.editConfig.isReadonly = true
        }
      }
    }
  }
};
</script>
<style scoped>
  .slidermargin{
    padding: 0 20px;
  }
  .demstration{
    font-size: 14px;
    line-height: 38px;
  }
  .timesliderbar{
    float:right;
    width: 70%;
  }
</style>
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
          <div class="components-btn" id="flowstart">
            <div><span>开始</span></div>
          </div>
          <div class="components-btn" id="flowend">
            <div><span>结束</span></div>
          </div>
          <div class="components-btn" id="newspiter">
            <div><span>新闻抓取</span></div>
          </div>
          <div class="components-btn" id="newselt">
            <div><span>翻译解析</span></div>
          </div>
      </div>
      </el-aside>
      <el-main>
      <div class="full-right tab">
        <el-tabs type="card" tab-position="bottom" class="svgcontain">
          <el-tab-pane label="图标视图">
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
  </div>
</template>

<script>
import $ from 'jquery';
import { jsPlumb } from 'jsplumb';

export default {
  name: 'flowchart',
  data () {
    return {
      data:{
    },      
    }
  },
  methods:{

  },
  mounted(){

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .subheader {
        height: 5vh;
        min-height: 50px;
        box-sizing: border-box;
        border-bottom: 1px solid #58a5f3;
        padding:5px 0 5px 20px;
    }
    .full-right-top {
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

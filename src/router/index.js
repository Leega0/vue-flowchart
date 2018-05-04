import Vue from 'vue'
import Router from 'vue-router'
import flowchart from '@/components/FlowChart'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'flowchart',
      component: flowchart
    }
  ]
})

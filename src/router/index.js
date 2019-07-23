import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import home from '@/components/home'
import zuan from '@/components/zuan'
import my from '@/components/my'
import edit from '@/components/pages/editTouPiao'
import detail from '@/components/pages/detail'
import myrecord from '@/components/pages/myrecord'
import myrecord2 from '@/components/pages/myrecord2'
import testimg from '@/components/imagetest/testimg'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/home',
      component: index,
      children: [
        {
          path: '/home',
          name: 'home',
          component: home
        },
        {
          path: '/zuan',
          name: 'zuan',
          component: zuan
        },
        {
          path: '/my',
          name: 'my',
          component: my
        }
      ]
    },
    {
      path: '/edit',
      name: 'edit',
      component: edit
    },
    {
      path: '/detail',
      name: 'detail',
      component: detail
    },
    {
      path: '/myrecord',
      name: 'myrecord',
      component: myrecord
    },
    {
      path: '/myrecord2',
      name: 'myrecord2',
      component: myrecord2
    },
    {
      path: '/testimg',
      name: 'testimg',
      component: testimg
    }
  ]
})

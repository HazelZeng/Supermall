<template>
    <div id="home">
      <nav-bar class="home-nav"><div slot="center">首页</div></nav-bar>

      <scroll class="content"
              ref="scroll"
              :probe-type="3"
              @scroll="contentScroll"
              :pull-up-load="true"
              @pullingUp="loadMore">
        <home-swiper :banner="banner"/>
        <recommend-view :recommend="recommend"></recommend-view>
        <feature-view></feature-view>
        <tab-control
          :titles="['流行','新款','精选']"
          @tabClick="tabClick" />
        <goods-list :goods="showGoods"/>
      </scroll>

      <back-top @click.native="backClick" v-show="isShowBackTop" />
    </div>
</template>

<script>
  import NavBar from '../../components/common/navbar/NavBar'
  import TabControl from '../../components/content/tabControl/TabControl'
  import GoodsList from '../../components/content/goods/GoodsList'
  import GoodsListItem from '../../components/content/goods/GoodsListItem'
  import Scroll from '../../components/common/scroll/Scroll'
  import BackTop from '../../components/content/backTop/BackTop'

  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'



  import {getHomeMultidata,getHomeGoods} from "../../network/home"
  import {debounce} from '../../common/utils'

  export default {
      name: "Home",
      components:{
        NavBar,
        HomeSwiper,
        RecommendView,
        FeatureView,
        TabControl,
        GoodsList,
        GoodsListItem,
        Scroll,
        BackTop
      },
    computed:{
        showGoods(){
          return this.goods[this.currentType].list
        }
    },
    data(){
        return {
          //result:null
          banner:[],
          recommend:[],
          goods:{
            'pop':{page:0,list:[]},
            'new':{page:0,list:[]},
            'sell':{page:0,list:[]},
          },
          currentType:'pop',
          isShowBackTop:false,
          saveY:0
        }

    },
    activated(){
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()
    },
    deactivated(){
        this.saveY = this.$refs.scroll.scroll.y
    },
    created() {
        //1.请求多个数据
      this.getHomeMultidata();
        //2.请求商品数据
      this.getHomeGoods('pop');
      this.getHomeGoods('new');
      this.getHomeGoods('sell');


    },
    mounted(){
      const refresh = debounce(this.$refs.scroll.refresh,50)


      //3.监听item中图片加载完成
      this.$bus.$on('imageLoad',()=>{
        refresh()
      })
    },
    methods:{
      //事件监听相关


      tabClick(index){
        switch(index){
          case 0:
            this.currentType = 'pop';
            break
          case 1:
            this.currentType = 'new';
            break
          case 2:
            this.currentType = 'sell';
            break
        }
      },

      backClick(){
        //this.$refs.scroll.scrollTo(0,0)
        this.$refs.scroll.scrollTo(0,0);
      },
      contentScroll(position){
        this.isShowBackTop = -position.y>1000
      },
      loadMore(){
        this.getHomeGoods(this.currentType);

      },

      //网络请求相关
      getHomeMultidata(){
        getHomeMultidata().then(res =>{
          //this.result = res;
          this.banner = res.data.banner.list;
          this.recommend = res.data.recommend.list;
        })
      },
      getHomeGoods(type){
        const page = this.goods[type].page + 1
        getHomeGoods(type,page).then(res =>{
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page += 1

          this.$refs.scroll.finishPullUp()
        })
      }
    }
  }
</script>

<style scoped>
  #home{
    padding-top: 44px;
    height:100vh;
    position: relative;
  }
  .home-nav{
    background-color: var(--color-tint);
    color:#fff;

    position:fixed;
    left:0;
    right:0;
    top:0;
    z-index: 9;
  }

  .content{
    //overflow:hidden;
    position: absolute;
    top:44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

</style>

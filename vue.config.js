module.exports = {
    configureWebpack:{

        resolve:{//解决路径相关问题
            //extensions:[],
            alias:{//别名
                '@':'src',//默认配置
                'assets':'@/assets',
                "common":'@/common',
                'components':'@/components',
                'network':'@/network',
                'views':'@/views',

            }
        }
    }
}

// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var proxyTarget = 'http://127.0.0.1:9001'
module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/AIHomeMP/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8082,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/AIHomeMP/carousel': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/carousel': '/AIHomeMP/carousel'
        }
      },
      '/AIHomeMP/welcome': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/welcome': '/AIHomeMP/welcome'
        }
      },
      '/AIHomeMP/collection/list': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/collection/list': '/AIHomeMP/collection/list'
        }
      },
      '/AIHomeMP/net/config': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/net/config': '/AIHomeMP/net/config'
        }
      },
      '/AIHomeMP/playlist/create': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/playlist/create': '/AIHomeMP/playlist/create'
        }
      },
      '/AIHomeMP/playlist/del': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/playlist/del': '/AIHomeMP/playlist/del'
        }
      },
      '/AIHomeMP/playlist/list': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/playlist/list': '/AIHomeMP/playlist/list'
        }
      },
      '/AIHomeMP/collection/clean': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/collection/clean': '/AIHomeMP/collection/clean'
        }
      },
      '/AIHomeMP/playlist/clean': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/playlist/clean': '/AIHomeMP/playlist/clean'
        }
      },
      '/AIHomeMP/collection/del': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/collection/del': '/AIHomeMP/collection/del'
        }
      },
      '/AIHomeMP/collection/create': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/collection/create': '/AIHomeMP/collection/create'
        }
      },
      '/AIHomeMP/xmly/tracks/hot': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/xmly/tracks/hot': '/AIHomeMP/xmly/tracks/hot'
        }
      },
      '/AIHomeMP/xmly/albums/list': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/xmly/albums/list': '/AIHomeMP/xmly/albums/list'
        }
      },
      '/AIHomeMP/xmly/albums/get_batch': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/xmly/albums/get_batch': '/AIHomeMP/xmly/albums/get_batch'
        }
      },
      '/AIHomeMP/xmly/albums/browse': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/xmly/albums/browse': '/AIHomeMP/xmly/albums/browse'
        }
      },
      // 单曲搜索
      '/AIHomeMP/xmly/search/tracks': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/xmly/search/tracks': '/AIHomeMP/xmly/search/tracks'
        }
      },
      // 专辑搜索
      '/AIHomeMP/xmly/search/albums': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/xmly/search/albums': '/AIHomeMP/xmly/search/albums'
        }
      },
      // 专辑搜索
      '/AIHomeMP/playlist/curindex': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/playlist/curindex': '/AIHomeMP/playlist/curindex'
        }
      },
      // 专辑搜索
      '/AIHomeMP/playlist/curmodel': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/playlist/curmodel': '/AIHomeMP/playlist/curmodel'
        }
      },
      // 专辑搜索
      '/AIHomeMP/musicPlayer/play': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/musicPlayer/play': '/AIHomeMP/musicPlayer/play'
        }
      },
      // 专辑搜索
      '/AIHomeMP/musicPlayer/model': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/musicPlayer/model': '/AIHomeMP/musicPlayer/model'
        }
      },
      // 获取微信配置
      '/AIHomeMP/wechat/get': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/wechat/get': '/AIHomeMP/wechat/get'
        }
      },
      // 添加全部歌曲到播放列表
      '/AIHomeMP/playlist/create_album': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/playlist/create_album': '/AIHomeMP/playlist/create_album'
        }
      },
      // 从播放列表删除全部歌曲
      '/AIHomeMP/playlist/del_album': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/playlist/del_album': '/AIHomeMP/playlist/del_album'
        }
      },
      // 收藏专辑
      '/AIHomeMP/collection/create_album': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/collection/create_album': '/AIHomeMP/collection/create_album'
        }
      },
      // 取消收藏专辑
      '/AIHomeMP/collection/del_album': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/collection/del_album': '/AIHomeMP/collection/del_album'
        }
      },
      // 获取专辑收藏列表
      '/AIHomeMP/collection/list_album': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/collection/list_album': '/AIHomeMP/collection/list_album'
        }
      },
      // 置顶单曲收藏
      '/AIHomeMP/collection/top': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/collection/top': '/AIHomeMP/collection/top'
        }
      },
      // 置顶专辑收藏
      '/AIHomeMP/collection/top_album': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/collection/top_album': '/AIHomeMP/collection/top_album'
        }
      },
      // 添加到播放历史
      '/AIHomeMP/history/create': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/history/create': '/AIHomeMP/history/create'
        }
      },
      // 删除播放历史
      '/AIHomeMP/history/del': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/history/del': '/AIHomeMP/history/del'
        }
      },
      // 获取播放历史列表
      '/AIHomeMP/history/list': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/history/list': '/AIHomeMP/history/list'
        }
      },
      // 清空播放列表
      '/AIHomeMP/history/clean': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/history/clean': '/AIHomeMP/history/clean'
        }
      },
      // 获取个人设置
      '/AIHomeMP/userSetting/get': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/userSetting/get': '/AIHomeMP/userSetting/get'
        }
      },
      // 更新个人设置
      '/AIHomeMP/userSetting/update': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/userSetting/update': '/AIHomeMP/userSetting/update'
        }
      },
      // 清空播放列表
      '/AIHomeMP/userSetting/uploadPic': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/userSetting/uploadPic': '/AIHomeMP/userSetting/uploadPic'
        },
      },
      // 清空个人设置
      '/AIHomeMP/userSetting/clean': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/userSetting/clean': '/AIHomeMP/userSetting/clean'
        }
      },
      // 置顶播放列表记录
      '/AIHomeMP/playlist/top': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/playlist/top': '/AIHomeMP/playlist/top'
        }
      },
      // （通过公众号前台）下一首
      '/AIHomeMP/musicPlayer/next': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/musicPlayer/next': '/AIHomeMP/musicPlayer/next'
        }
      },
      // （通过公众号前台）上一首
      '/AIHomeMP/musicPlayer/prev': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/musicPlayer/prev': '/AIHomeMP/musicPlayer/prev'
        }
      },
      // （通过公众号前台）调整音量
      '/AIHomeMP/musicPlayer/setVolume': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/musicPlayer/setVolume': '/AIHomeMP/musicPlayer/setVolume'
        }
      },
      // （通过公众号前台）获取音量
      '/AIHomeMP/musicPlayer/getVolume': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/musicPlayer/getVolume': '/AIHomeMP/musicPlayer/getVolume'
        }
      },
      // 公众号前台请求童锁状态
      '/AIHomeMP/userSetting/getLock': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/userSetting/getLock': '/AIHomeMP/userSetting/getLock'
        }
      },
      // 公众号前台修改童锁
      '/AIHomeMP/userSetting/updateLock': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/userSetting/updateLock': '/AIHomeMP/userSetting/updateLock'
        }
      },
      // 公众号前台获取闹钟
      '/AIHomeMP/alarm/list': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/alarm/list': '/AIHomeMP/alarm/list'
        }
      },
      // 公众号前台获取闹钟
      '/AIHomeMP/alarm/save': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/alarm/save': '/AIHomeMP/alarm/save'
        }
      },
      // 公众号前台删除闹钟
      '/AIHomeMP/alarm/del': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/alarm/del': '/AIHomeMP/alarm/del'
        }
      },
      // 公众号前台删除闹钟
      '/AIHomeMP/userSetting/about': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/userSetting/about': '/AIHomeMP/userSetting/about'
        }
      },
      // 公众号前台删除闹钟
      '/AIHomeMP/playlist/collectAll': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/playlist/collectAll': '/AIHomeMP/playlist/collectAll'
        }
      },
      // 公众号前台删除闹钟
      '/AIHomeMP/collection/clean_album': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/collection/clean_album': '/AIHomeMP/collection/clean_album'
        }
      },
      // 获取低电量提示音
      '/AIHomeMP/userSetting/getLowBatteryPrompt': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/userSetting/getLowBatteryPrompt': '/AIHomeMP/userSetting/getLowBatteryPrompt'
        }
      },
      // 修改低电量提示音
      '/AIHomeMP/userSetting/updateLowBatteryPrompt': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/userSetting/updateLowBatteryPrompt': '/AIHomeMP/userSetting/updateLowBatteryPrompt'
        }
      },
      // 检查设备是否在升级中
      '/AIHomeMP/deviceStatus/get': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/deviceStatus/get': '/AIHomeMP/deviceStatus/get'
        }
      },
      // 获取config
      '/AIHomeMP/wechat/getConfig': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/wechat/getConfig': '/AIHomeMP/wechat/getConfig'
        }
      },
      // 获取耳灯亮度
      '/AIHomeMP/userSetting/getEarLampBrightness': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/userSetting/getEarLampBrightness': '/AIHomeMP/userSetting/getEarLampBrightness'
        }
      },
      // 修改耳灯亮度
      '/AIHomeMP/userSetting/updateEarLampBrightness': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/userSetting/updateEarLampBrightness': '/AIHomeMP/userSetting/updateEarLampBrightness'
        }
      },
      // 获取家庭成员
      '/AIHomeMP/familyGroup/getFamilyGroup': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/familyGroup/getFamilyGroup': '/AIHomeMP/familyGroup/getFamilyGroup'
        }
      },
      // 修改群昵称
      '/AIHomeMP/familyGroup/updateNickname': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/familyGroup/updateNickname': '/AIHomeMP/familyGroup/updateNickname'
        }
      },
      // 获取分享页面
      '/AIHomeMP/familyGroup/share': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/familyGroup/share': '/AIHomeMP/familyGroup/share'
        }
      },
      // 获取宝宝语录
      '/AIHomeMP/voiceRecord/list': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/voiceRecord/list': '/AIHomeMP/voiceRecord/list'
        }
      },
      // 获取微信语聊提示
      '/AIHomeMP/userSetting/getChatPrompt': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/userSetting/getChatPrompt': '/AIHomeMP/userSetting/getChatPrompt'
        }
      },
      // 修改微信语聊提示
      '/AIHomeMP/userSetting/updateChatPrompt': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/userSetting/updateChatPrompt': '/AIHomeMP/userSetting/updateChatPrompt'
        }
      },
      // 获取配网二维码
      '/AIHomeMP/config/qrcode': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/config/qrcode': '/AIHomeMP/config/qrcode'
        }
      }
      ,
      // 升级
      '/AIHomeMP/userSetting/about/upgradeVersion': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/userSetting/about/upgradeVersion': '/AIHomeMP/userSetting/about/upgradeVersion'
        }
      }
      ,
      // 搜索历史记录
      '/AIHomeMP/search/history/list': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/search/history/list': '/AIHomeMP/search/history/list'
        }
      },
      // 清空搜索历史记录
      '/AIHomeMP/search/history/clean': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/search/history/clean': '/AIHomeMP/search/history/clean'
        }
      },
      // 热门搜索记录
      '/AIHomeMP/search/hot/list': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/search/hot/list': '/AIHomeMP/search/hot/list'
        }
      },
      // 获取设备列表
      '/AIHomeMP/deviceBind/list': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/deviceBind/list': '/AIHomeMP/deviceBind/list'
        }
      },
      // 切换设备
      '/AIHomeMP/deviceBind/setDefault': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/deviceBind/setDefault': '/AIHomeMP/deviceBind/setDefault'
        }
      },
      // 删除设备
      '/AIHomeMP/deviceBind/delete': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/deviceBind/delete': '/AIHomeMP/deviceBind/delete'
        }
      },
      // 获取点阵屏开关
      '/AIHomeMP/userSetting/getScreenSetting': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/userSetting/getScreenSetting': '/AIHomeMP/userSetting/getScreenSetting'
        }
      },
      // 修改点阵屏开关
      '/AIHomeMP/userSetting/updateScreenSetting': {
        target: proxyTarget,
        pathRewrite: {
          '^/AIHomeMP/userSetting/updateScreenSetting': '/AIHomeMP/userSetting/updateScreenSetting'
        }
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}

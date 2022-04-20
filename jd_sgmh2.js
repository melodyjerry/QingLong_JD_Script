/*
   闪购盲盒 - 只做助力任务
 */
const $ = new Env('闪购盲盒');
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let appId = '1EFRXxg' , homeDataFunPrefix = 'interact_template', collectScoreFunPrefix = 'harmony', message = '',resMsg
let cookiesArr = [], cookie = '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
const JD_API_HOST = `https://api.m.jd.com/client.action`;
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
    return;
  }
  await requireConfig();
  await shareCodesFormat();
  await $.wait(5000);
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    //前3账号跳过操作
    if (cookie && i > 2) {
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      $.beans = 0
      message = ''
      console.log(`\n【京东账号${$.index}】${$.UserName}\n`);
      await TotalBean();
      if (!$.isLogin) {
        console.log(`cookie失效\n`);
        continue
      }
      await interact_template_getHomeData();
      await $.wait(500);
      if ($.newShareCodes.length == 0) {
        console.log(`\n\n>>>>>>>>>>>>>>>>>>>>>>>>>> 全部账号已满助力 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<`);
        break;
      }
    }
  }
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())
//获取活动信息
function interact_template_getHomeData(timeout = 0) {
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}`,
        headers : {
          'Origin' : `https://h5.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Referer' : `https://h5.m.jd.com/babelDiy/Zeus/2WBcKYkn8viyxv7MoKKgfzmu7Dss/index.html`,
          'Host' : `api.m.jd.com`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : `functionId=${homeDataFunPrefix}_getHomeData&body={"appId":"${appId}","taskToken":""}&client=wh5&clientVersion=1.0.0`
      }
      $.post(url, async (err, resp, data) => {
        try {
          data = JSON.parse(data);
          if (!data.data || data.data.bizCode !== 0) {
            return
          }
          scorePerLottery = data.data.result.userInfo.scorePerLottery||data.data.result.userInfo.lotteryMinusScore
          if (data.data.result.raiseInfo&&data.data.result.raiseInfo.levelList) scorePerLottery = data.data.result.raiseInfo.levelList[data.data.result.raiseInfo.scoreLevel];
          for (let i = 0; i < data.data.result.taskVos.length; i ++) {
            //签到
            if (data.data.result.taskVos[i].taskName === '邀请好友助力') {
              // 已满助力码数组下标集
              let fullHelpIndexArr = [];
              for (let x = 0; x < $.newShareCodes.length; x++) {
                let code = $.newShareCodes[x];
                if (!code) continue
                resMsg = '';
                console.log('助力：' + code);
                await harmony_collectScore(code, data.data.result.taskVos[i].taskId);
                if (resMsg.indexOf('助力已满员') != -1) {
                  //插入头部
                  fullHelpIndexArr.unshift(x);
                } else if (resMsg.indexOf('活动太火爆啦') != -1) {
                  break;
                } else if (resMsg.indexOf('已达到助力上限') != -1) {
                  break;
                }
              }
              if (fullHelpIndexArr.length > 0) {
                //移除满助力码
                for (let fullHelpIndex of fullHelpIndexArr) {
                  $.newShareCodes.splice(fullHelpIndex, 1);
                }
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}
//做任务
function harmony_collectScore(taskToken,taskId,itemId = "",actionType = 0,timeout = 0) {
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}`,
        headers : {
          'Origin' : `https://h5.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Referer' : `https://h5.m.jd.com/babelDiy/Zeus/2WBcKYkn8viyxv7MoKKgfzmu7Dss/index.html`,//?inviteId=P225KkcRx4b8lbWJU72wvZZcwCjVXmYaS5jQ P225KkcRx4b8lbWJU72wvZZcwCjVXmYaS5jQ?inviteId=${shareCode}
          'Host' : `api.m.jd.com`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : `functionId=${collectScoreFunPrefix}_collectScore&body={"appId":"${appId}","taskToken":"${taskToken}","taskId":${taskId}${itemId ? ',"itemId":"'+itemId+'"' : ''},"actionType":${actionType}&client=wh5&clientVersion=1.0.0`
      }
      $.post(url, async (err, resp, data) => {
        try {
          data = JSON.parse(data);
          if (data.data.bizMsg === "任务领取成功") {
            await harmony_collectScore(taskToken,taskId,itemId,0,parseInt(browseTime) * 200);
          } else{
            resMsg = data.data.bizMsg;
            console.log(resMsg);
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}
function requireConfig() {
  return new Promise(async resolve => {
    console.log(`开始获取${$.name}配置文件\n`);
    let shareCodes = []
    console.log(`共${cookiesArr.length}个京东账号\n`);
    $.shareCodesArr = [];
    if ($.isNode()) {
      Object.keys(shareCodes).forEach((item) => {
        if (shareCodes[item]) {
          $.shareCodesArr.push(shareCodes[item])
        }
      })
    }
    console.log(`您提供了${$.shareCodesArr.length}个账号的${$.name}助力码\n`);
    resolve()
  })
}
//格式化助力码
function shareCodesFormat() {
  return new Promise(async resolve => {
    $.newShareCodes = ['T018v_V1RR4d_V3QJhib1ACjVQmoaT5kRrbA','T0205KkcO2FbtjWIRWaUyJ9xCjVQmoaT5kRrbA','T0225KkcRxlN91SEJB_xnKFYIQCjVQmoaT5kRrbA','T0205KkcBldMiSeNR1qx7K1eCjVQmoaT5kRrbA','T0205KkcH2djkRadSmC95qt8CjVQmoaT5kRrbA','T0205KkcB1hDjgCgcmOAyK95CjVQmoaT5kRrbA','T0205KkcMVhbvACTREmeyp1QCjVQmoaT5kRrbA','T0205KkcF19FkTWkUkWtyYpPCjVQmoaT5kRrbA','T0205KkcBVpnkDGQdk6wx4JACjVQmoaT5kRrbA','T0205KkcBn1mqBSCdGCd9JVDCjVQmoaT5kRrbA','T0205KkcOVdsqDyzemmV4o9qCjVQmoaT5kRrbA','T0205KkcKWxmrx2WVE2ty6h5CjVQmoaT5kRrbA','T0205KkcJX9OlCOCZU6n84pyCjVQmoaT5kRrbA','T0205KkcBUJehz2sX0Om655zCjVQmoaT5kRrbA','T0205KkcG3tMiwuvYF-s4KR-CjVQmoaT5kRrbA','T0205KkcG3pNoDyEQmmBzYJACjVQmoaT5kRrbA','T018aWjelZWTI_xpIBn0kgCjVQmoaT5kRrbA','T0225KkcRxccplfQKUn2kaULcQCjVQmoaT5kRrbA','T0225KkcR09IplzfJEzxkfEMfQCjVQmoaT5kRrbA','T010yqQgGx8a_ACjVQmoaT5kRrbA','T0205KkcBVRoqS-FWF22xYR9CjVQmoaT5kRrbA','T018v_56QB8Q8lPRJhub1ACjVQmoaT5kRrbA','T0109r85GE9HogCjVQmoaT5kRrbA','T0225KkcRktLoVLRKBj8lf4CJQCjVQmoaT5kRrbA','T0205KkcBW97vCO0ZWKK67ZACjVQmoaT5kRrbA','T0205KkcOURHtR6OaF6N1otJCjVQmoaT5kRrbA','T0245KkcAmZG_TKWYRuXlZd9CPSGCjVQmoaT5kRrbA','T0205KkcI09ikRSrR2mR0I53CjVQmoaT5kRrbA','T0205KkcKWJQjxCyUWeVwJF5CjVQmoaT5kRrbA','T0245KkcJmphgzOiVnip8qNrELiCCjVQmoaT5kRrbA'
      ,'T018aXLClre6IvRUIhz2kgCjVQmoaT5kRrbA','T0205KkcPGRNoCq1fF2MwJ1JCjVQmoaT5kRrbA','T01096QtF3FRvQCjVQmoaT5kRrbA','T015_KwsCEdIqhCOfk0CjVQmoaT5kRrbA','T0116bh0RRYR_F0CjVQmoaT5kRrbA','T0225KkcRkhKo1yCdkz2kf4OdgCjVQmoaT5kRrbA','T016ZkXdlJadIdpH9ZpVCjVQmoaT5kRrbA','T010-KwtFUJBvACjVQmoaT5kRrbA','T018v_h2QhkR_VTVIhKb1ACjVQmoaT5kRrbA','T0205KkcFmJrhAm_XmmQ6YhLCjVQmoaT5kRrbA','T028aEzIlJajIdlH97BAQWOdoVaM0-oKCjVQmoaT5kRrbA','T0205KkcA1xGqyuuSUem7K9jCjVQmoaT5kRrbA','T0225KkcRB0fp1yFcx31nfEDdQCjVQmoaT5kRrbA','T0225KkcRRZM9VffcxL2nKEKcwCjVQmoaT5kRrbA','T0149rovCExIqgaGfwCjVQmoaT5kRrbA','T0225KkcREwe913RIBmlnfEOJgCjVQmoaT5kRrbA','T0225KkcRhhIoFaCJBP1laRbcACjVQmoaT5kRrbA','T0225KkcRkxI_V3RIE_9x6ZecACjVQmoaT5kRrbA','T0225KkcRkhL_FPQJhv0l6VccwCjVQmoaT5kRrbA','T018v_53SBcQ_FXfKR-b1ACjVQmoaT5kRrbA','T024v_lzSRgY_F3XPRLwk_EOcjxwCjVQmoaT5kRrbA','T0225KkcRhkQ8VbXIR7wkKYPcgCjVQmoaT5kRrbA','T0225KkcR0xL81fedkj1nKMLfACjVQmoaT5kRrbA','T0225KkcRhse_QDQIR2ikvEPcwCjVQmoaT5kRrbA','T0225KkcRRhI8lHUckv2naJbJwCjVQmoaT5kRrbA','T012a33MlJe_IOtwCjVQmoaT5kRrbA','T016ZkfymY2xIdhb-bFuCjVQmoaT5kRrbA','T0205KkcOF5ZggaEf0CA6oJpCjVQmoaT5kRrbA','T0205KkcMl9QtQKMaHiT_p9CCjVQmoaT5kRrbA','T0225KkcRRhI8lHUckv2naJbJwCjVQmoaT5kRrbA','T0205KkcNHZZvSa2Y3uA54FrCjVQmoaT5kRrbA','T0225KkcR0oR_VDRdBmml_QLIACjVQmoaT5kRrbA','T0225KkcRk0e913VJkn0lf9cfACjVQmoaT5kRrbA','T0225KkcRRdM8wfWJxn3nKQIdQCjVQmoaT5kRrbA','T016ZkDklq24IdxR9JJyCjVQmoaT5kRrbA'];
    if ($.shareCodesArr[$.index - 1]) {
      $.newShareCodes = $.newShareCodes.concat($.shareCodesArr[$.index - 1].split('@'));
    } /*else {
      console.log(`由于您第${$.index}个京东账号未提供shareCode,将采纳本脚本自带的助力码\n`)
      const tempIndex = $.index > inviteCodes.length ? (inviteCodes.length - 1) : ($.index - 1);
      $.newShareCodes = inviteCodes[tempIndex].split('@');
    }*/
    console.log(`将要助力的好友${JSON.stringify($.newShareCodes)}`)
    resolve();
  })
}
function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1") : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie过期
              return
            }
            if (data['retcode'] === 0) {
              $.nickName = (data['base'] && data['base'].nickname) || $.UserName;
            } else {
              $.nickName = $.UserName
            }
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}

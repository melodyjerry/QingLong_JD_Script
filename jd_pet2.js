/*
东东萌宠 - 只做助力任务
*/
const $ = new Env('东东萌宠');
let cookiesArr = [], cookie = '', isBox = false, newShareCodes;
let shareCodes = []
let option = {};
const JD_API_HOST = 'https://api.m.jd.com/client.action';
!(async () => {
  await requireConfig();
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  await shareCodesFormat();
  await $.wait(5000);
  for (let i = 0; i < cookiesArr.length; i++) {
    //前3账号跳过操作
    if (cookiesArr[i] && i > 2) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      console.log(`\n【京东账号${$.index}】${$.UserName}\n`);
      /*await TotalBean();
      if (!$.isLogin) {
        console.log(`cookie失效\n`);
        continue
      }*/
      option = {};
      await jdPet();
      await $.wait(1000);
      if (newShareCodes.length == 0) {
        console.log(`\n\n>>>>>>>>>>>>>>>>>>>>>>>>>> 全部账号已满助力 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<`);
        break;
      }
    }
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })
async function jdPet() {
  try {
    await slaveHelp();//助力好友
  } catch (e) {
    console.log(`任务执行异常: ${e}`);
  }
}
/**
 * 助力好友
 */
async function slaveHelp() {
  // 已满助力码数组下标集
  let fullHelpIndexArr = [];
  for (let i = 0; i < newShareCodes.length; i++) {
    let code = newShareCodes[i];
    console.log(`开始助力 : ${code}`);
    if (!code) continue;
    let response = await request(arguments.callee.name.toString(), {'shareCode': code});
    if (response.code === '0' && response.resultCode === '0') {
      if (response.result.helpStatus === 0) {
        console.log('助力【' + response.result.masterNickName + '】助力成功');
      } else if (response.result.helpStatus === 1) {
        // 您今日已无助力机会
        console.log(`助力 ${response.result.masterNickName} 失败，助力次数耗尽`);
        break;
      } else if (response.result.helpStatus === 2) {
        //该好友已满5人助力，无需您再次助力
        console.log(`${response.result.masterNickName} 已满助力`);
        //插入头部
        fullHelpIndexArr.unshift(i);
      } else {
        console.log(`助力其他情况：${JSON.stringify(response)}`);
      }
    } else {
      let resMsg = response.message;
      console.log(`助力失败: ${resMsg}`);
      if (!response) {
        break;
      } else if (response === 403) {
        console.log(`助力失败: 账号异常，请求403`);
        break;
      } else if (!resMsg) {
        break;
      } else if (resMsg.indexOf('错误助力码') != -1) {
        //插入头部
        fullHelpIndexArr.unshift(i);
      } else if (resMsg.indexOf('风控') != -1) {
        break;
      } else if (resMsg.indexOf('not login') != -1) {
        break;
      }
    }
  }
  if (fullHelpIndexArr.length > 0) {
    //移除满助力码
    for (let fullHelpIndex of fullHelpIndexArr) {
      newShareCodes.splice(fullHelpIndex, 1);
    }
  }
}
function shareCodesFormat() {
  return new Promise(async resolve => {
    newShareCodes = ['MTE1NDAxNzgwMDAwMDAwMzg3ODcyMzk=','MTE1NDUyMjEwMDAwMDAwMzg4MzI2NTk=','MTE1NDAxNzYwMDAwMDAwMzg4MDk5OTM=','MTEzMzI0OTE0NTAwMDAwMDA0MjE0MTI2OQ==','MTE5MzEwNTEzODAwMDAwMDA2NzU1MzMyMQ==','MTAxNzIxMDc1MTAwMDAwMDA2NzY4MTY3MQ==','MTEzMzI1MTE4NTAwMDAwMDA2NzcwNDM3Nw==','MTEyNjE4NjQ2MDAwMDAwMDUzMDE0MzY1','MTEzMzI0OTE0NTAwMDAwMDA0Mzg2ODMwMQ==','MTE1NDUyMjEwMDAwMDAwNDM4Njg1Njc=','MTE1NDAxNzcwMDAwMDAwMzkwNDUzNDk=','MTEzMzI0OTE0NTAwMDAwMDAzOTA2MDI3Nw==','MTAxODEyMjkyMDAwMDAwMDQwNjk2OTk5','MTEzMzI0OTE0NTAwMDAwMDAzOTA3NzgwNQ==','MTE1NDUyMjEwMDAwMDAwMzkwNzg4MjE=','MTE1NDUyMjEwMDAwMDAwNDA2OTc0Nzk=','MTE1NDUwMTI0MDAwMDAwMDQ0OTE2Mjgz','MTE1NDUyMjEwMDAwMDAwMzkwMDg4MDU=','MTAxODEyMjkyMDAwMDAwMDM5NzQyMDgx','MTE1NDQ5OTUwMDAwMDAwNDIxNjQ3MjU=','MTE1NDQ5OTUwMDAwMDAwNDI2NzUyNDM=','MTEzMzI1MTE4NDAwMDAwMDA2NDIxODU3NQ==','MTEyNjkzMjAwMDAwMDAwMDY0MjI0MTY3','MTEyNzEzMjc0MDAwMDAwMDY0MzUzMjMx','MTEzMzI0OTE0NTAwMDAwMDA0MzQ3Nzk5MQ==','MTEyNTEyNTE1MDAwMDAwMDA0NzI1MDg2NQ==','MTE1NDUyMjEwMDAwMDAwMzkwNTI5NDk=','MTE1NDAxNzgwMDAwMDAwNDM0NjQzNTk=','MTAxNzIyNTU1NDAwMDAwMDA1MzAwMjA1OQ==','MTEzMzI1MTE4NTAwMDAwMDA1Mzc5NDY4NQ==','MTEyOTEzNzMzMDAwMDAwMDczODk1MzYx','MTEyNzEzMjc0MDAwMDAwMDc0OTM4MTUx','MTEzMzI1MTE4NDAwMDAwMDA3NTk5MzM0Nw=='
      ,'MTE1NDUwMTI0MDAwMDAwMDM5ODAxNTM3','MTE1NDQ5OTUwMDAwMDAwNDQ5MTYyMzk=','MTAxODc2NTEzMjAwMDAwMDAyNjgzNDg5OQ==','MTE0MDkyMjEwMDAwMDAwNDczMjYxMTM=','MTAxNzIyNTU1NDAwMDAwMDA0ODc3ODA3NQ==','MTAxNzIyNTU1NDAwMDAwMDA0ODg5NDQxNQ==','MTEzMzI1MTE4NTAwMDAwMDA2MjU3MjU5Mw==','MTAxODc2NTEzOTAwMDAwMDAxNjA1ODM1Nw==','MTEzMzI1MTE4NDAwMDAwMDA1MDA5NDE1NQ==','MTAxODc2NTEzNDAwMDAwMDAxODY5NDIzNw==','MTE1NDQ5MzYwMDAwMDAwNDQyNDMyNTk=','MTE1MzEzNjI2MDAwMDAwMDUyMTQyMDc5','MTEyNzEzMjc0MDAwMDAwMDY0MzUzMjMx','MTEzMzI1MTE4NDAwMDAwMDA1MDMwMzI3NQ==','MTAxNzIxMDc1MTAwMDAwMDA1MjUxOTU3NQ==','MTE1NDQ5MzYwMDAwMDAwNDI5MTIwODE=','MTEzMzI1MTE4NDAwMDAwMDA2NDYwMjcyOQ==','MTE1NDQ5OTUwMDAwMDAwNDMwMDcxNjM=','MTAxODc2NTEzMjAwMDAwMDAwMDQwMTMwMQ==','MTE1NDY3NTIwMDAwMDAwNTI3MzYwNDE=','MTAxNzIxMDc1MTAwMDAwMDA1MjU3ODQwMQ==','MTE5MzEwNTEzODAwMDAwMDA1OTUxNzU3MQ==','MTEyNjE4NjQ2MDAwMDAwMDY0NTk2NDY3','MTEzMzI1MTE4NDAwMDAwMDA1MTU0NTQyNw==','MTE1NDQ5OTUwMDAwMDAwNDMwMzM5MzM=','MTE1NDUyMjEwMDAwMDAwNDI5MTIwOTU=','MTEyNzEzMjc0MDAwMDAwMDc1NTA4NjM3','MTEyOTEzNzMzMDAwMDAwMDc1NTA4NDc3','MTExMjUyNTgxMDAwMDAwMDY4NTc3OTQx'];
    if ($.shareCodesArr[$.index - 1]) {
      newShareCodes = newShareCodes.concat($.shareCodesArr[$.index - 1].split('@'));
    }/* else {
      console.log(`由于您第${$.index}个京东账号未提供shareCode,将采纳本脚本自带的助力码\n`)
      const tempIndex = $.index > shareCodes.length ? (shareCodes.length - 1) : ($.index - 1);
      newShareCodes = shareCodes[tempIndex].split('@');
    }*/
    console.log(`将要助力的好友${JSON.stringify(newShareCodes)}`)
    resolve();
  })
}
function requireConfig() {
  return new Promise(resolve => {
    console.log('开始获取东东萌宠配置文件\n')
    const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
    const jdPetShareCodes = $.isNode() ? require('./jdPetShareCodes.js') : '';
    if ($.isNode()) {
      Object.keys(jdCookieNode).forEach((item) => {
        if (jdCookieNode[item]) {
          cookiesArr.push(jdCookieNode[item])
        }
      })
      if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
    } else {
      cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
    }
    console.log(`共${cookiesArr.length}个京东账号\n`)
    $.shareCodesArr = [];
    if ($.isNode()) {
      Object.keys(jdPetShareCodes).forEach((item) => {
        if (jdPetShareCodes[item]) {
          $.shareCodesArr.push(jdPetShareCodes[item])
        }
      })
    } else {
      if ($.getdata('jd_pet_inviter')) $.shareCodesArr = $.getdata('jd_pet_inviter').split('\n').filter(item => !!item);
      console.log(`\nBoxJs设置的${$.name}好友邀请码:${$.getdata('jd_pet_inviter') ? $.getdata('jd_pet_inviter') : '暂无'}\n`);
    }
    //console.log(`您提供了${$.shareCodesArr.length}个账号的东东萌宠助力码\n`);
    resolve()
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
        "User-Agent": require('./USER_AGENTS').USER_AGENT
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
            if (data['retcode'] === 0 && data.base && data.base.nickname) {
              $.nickName = data.base.nickname;
            }
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e)
      } finally {
        resolve();
      }
    })
  })
}
// 请求
async function request(function_id, body = {}) {
  //await $.wait(1000); //歇口气儿, 不然会报操作频繁
  return new Promise((resolve, reject) => {
    $.post(taskUrl(function_id, body), (err, resp, data) => {
      try {
        if (err) {
          if (err.indexOf('403 (Forbidden)') != -1) {
            console.log('\nAPI请求失败: 返回403');
            data = 403;
          }
        } else {
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e);
      } finally {
        resolve(data)
      }
    })
  })
}
function taskUrl(function_id, body = {}) {
  body["version"] = 2;
  body["channel"] = 'app';
  return {
    url: `${JD_API_HOST}?functionId=${function_id}`,
    body: `body=${encodeURIComponent(JSON.stringify(body))}&appid=wh5&loginWQBiz=pet-town&clientVersion=9.0.4`,
    headers: {
      'Cookie': cookie,
      'User-Agent': require('./USER_AGENTS').USER_AGENT,
      'Host': 'api.m.jd.com',
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  };
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
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}

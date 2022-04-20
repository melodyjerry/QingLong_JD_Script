# 每3天的23:50分清理一次日志
50 23 */3 * * rm -rf /scripts/logs/*.log

##############短期活动##############
#极速版红包
40 0,8 * * * node /scripts/jd_speed_redpocke.js >> /scripts/logs/jd_speed_redpocke.log 2>&1
#jd_health
13 1,7,22 * * * node /scripts/jd_health.js >> /scripts/logs/jd_health.log 2>&1
#jd_health_collect
5-45/20 * * * * node /scripts/jd_health_collect.js >> /scripts/logs/jd_health_collect.log 2>&1
#jd_jintie
10 0 * * * node /scripts/jd_jintie.js >> /scripts/logs/jd_jintie.log 2>&1
#jd_jintie
30 1,12 * * * node /scripts/jd_jintie_wx.js >> /scripts/logs/jd_jintie_wx.log 2>&1
#jd_daily_lottery
# 13 1,22,23 * * * node /scripts/jd_daily_lottery.js >> /scripts/logs/jd_daily_lottery.log 2>&1
#金榜创造营
40 9,21 * * * node /scripts/jd_gold_creator.js >> /scripts/logs/jd_gold_creator.log 2>&1
#5g超级盲盒
0 */4 * * * node /scripts/jd_mohe.js >> /scripts/logs/jd_mohe.log 2>&1
#京喜牧场
20 0-23/3 * * * node /scripts/jd_jxmc.js >> /scripts/logs/jd_jxmc.log 2>&1
#新签到
10 0,18 * * * node /scripts/jd_sign_graphics.js >> /scripts/logs/jd_sign_graphics.log 2>&1
#早起福利
30 6 * * * node /scripts/jd_goodMorning.js >> /scripts/logs/jd_goodMorning.log 2>&1
# 摇钱树助力
0 */3 * * * node /scripts/jd_moneyTree_help.js >> /scripts/logs/jd_moneyTree_help.log 2>&1
# 首页领京豆
21 9 * * * node /scripts/jd_MMdou.js >> /scripts/logs/jd_MMdou.log 2>&1
#京喜首页签到
20 1,8,14 * * * node /scripts/jx_sign.js >> /scripts/logs/jx_sign.log 2>&1
#女装盲盒
54 9,14 * * * node /scripts/jd_nzmh.js >> /scripts/logs/jd_nzmh.log 2>&1
#众筹许愿池
40 0,2 * * * node /scripts/jd_wish.js >> /scripts/logs/jd_wish.log 2>&1
# 京喜财富岛合成月饼
5 * * * * node /scripts/jd_cfd_mooncake.js >> /scripts/logs/jd_cfd_mooncake.log 2>&1
#财富岛热气球接待
30 * * * * node /scripts/jd_cfd_loop.js >> /scripts/logs/jd_cfd_loop.log 2>&1
# 送豆得豆
24 0,12 * * * node /scripts/jd_sendBeans.js >> /scripts/logs/jd_sendBeans.log 2>&1
# 省钱大赢家翻翻乐
20 * * * * node /scripts/jd_jdtj_winner.js >> /scripts/logs/jd_jdtj_winner.log 2>&1
# 发财挖宝
1 6-22/3 * * * node /scripts/jd_fcwb.js >> /scripts/logs/jd_fcwb.log 2>&1
#兑换7天过期喜豆
30 20 * * * node /scripts/jd_exchangejxbeans.js >> /scripts/logs/jd_exchangejxbeans.log 2>&1
# 财富岛珍珠兑换
#59 0-23/1 * * * node /scripts/jd_cfd_pearl_ex.js >> /scripts/logs/jd_cfd_pearl_ex.log 2>&1
# 省钱大赢家翻翻乐2
20 0,6-23 * * * node /scripts/jd_big_winner.js >> /scripts/logs/jd_big_winner.log 2>&1
# 牛牛福利
1 2,9,19,23 * * * node /scripts/jd_nnfls.js >> /scripts/logs/jd_nnfls.log 2>&1
# 京东通天塔--签到
3 1 * * * node /scripts/jd_m_sign.js >> /scripts/logs/jd_m_sign.log 2>&1
# 店铺签到
11 12 * * * node /scripts/jd_dpqd.js >> /scripts/logs/jd_dpqd.log 2>&1

# 极速版-见缝插针
15 10 * * * node /scripts/jd_jfcz.js >> /scripts/logs/jd_jfcz.log 2>&1
# 京东生鲜每日抽奖
10 7 * * * node /scripts/jd_sxLottery.js >> /scripts/logs/jd_sxLottery.log 2>&1
# 京东汽车
10 8 * * * node /scripts/jd_mpdzcar.js >> /scripts/logs/jd_mpdzcar.log 2>&1
# 京东汽车-游戏
10 6,10,12 * * * node /scripts/jd_mpdzcar_game.js >> /scripts/logs/jd_mpdzcar_game.log 2>&1
# 特务Z
23 11,20 * * * node /scripts/jd_productZ4Brand.js >> /scripts/logs/jd_productZ4Brand.log 2>&1
# 京享红包
0 20,21 * * * node /scripts/jd_redEnvelope_new.js >> /scripts/logs/jd_redEnvelope_new.js.log 2>&1
# 整点京豆雨
0 * * * * node /scripts/jd_redrain.js >> /scripts/logs/jd_redrain.js.log 2>&1
# 半点京豆雨
31 18-23/1 * * * node /scripts/jd_redrain_half.js >> /scripts/logs/jd_redrain_half.js.log 2>&1
# 通天塔签到共建
0 0,3 * * * node /scripts/jd_babel_sign.js >> /scripts/logs/jd_babel_sign.js.log 2>&1
# 白条抽奖
10 8,20 13-31,1-7 1,2 * node /scripts/jd_bt_sign.js >> /scripts/logs/jd_bt_sign.js.log 2>&1
# 京东饭粒
23 */4 * * * node /scripts/jd_fanli.js >> /scripts/logs/jd_fanli.js.log 2>&1
# 天天压岁钱
39 0,6,14,20 * * * node /scripts/jd_ttysq.js >> /scripts/logs/jd_ttysq.js.log 2>&1
# 推推赚大钱
16 1,9,17 * * * node /scripts/jd_tuitui.js >> /scripts/logs/jd_tuitui.log 2>&1

##############长期活动##############
# 签到
5 0,18 * * * cd /scripts && node jd_bean_sign.js >> /scripts/logs/jd_bean_sign.log 2>&1
# 领券中心签到
5 1,13 * * * node /scripts/jd_ccSign.js >> /scripts/logs/jd_ccSign.log 2>&1
# 美丽研究院
1 7,12,19 * * * node /scripts/jd_beauty.js >> /scripts/logs/jd_beauty.log 2>&1
# 东东超市兑换奖品
#0 0 * * * node /scripts/jd_blueCoin.js >> /scripts/logs/jd_blueCoin.log 2>&1
# 摇京豆
0 0 * * * node /scripts/jd_club_lottery.js >> /scripts/logs/jd_club_lottery.log 2>&1
# 东东农场
7 6,11,15,17,22 * * * node /scripts/jd_fruit.js >> /scripts/logs/jd_fruit.log 2>&1
# 东东萌宠
38 6,9,11,17,21 * * * node /scripts/jd_pet.js >> /scripts/logs/jd_pet.log 2>&1
# 摇钱树
0 */4 * * * node /scripts/jd_moneyTree.js >> /scripts/logs/jd_moneyTree.log 2>&1
# 京东种豆得豆
0 8,12,16,19,23 * * * node /scripts/jd_plantBean.js >> /scripts/logs/jd_plantBean.log 2>&1
# 京东全民开红包
14 0,5,10 * * * node /scripts/jd_redPacket.js >> /scripts/logs/jd_redPacket.log 2>&1
# 进店领豆
5 0 * * * node /scripts/jd_shop.js >> /scripts/logs/jd_shop.log 2>&1
# 东东超市
11 */3 * * * node /scripts/jd_superMarket.js >> /scripts/logs/jd_superMarket.log 2>&1
# 取关京东店铺商品
45 23 * * * node /scripts/jd_unsubscribe.js >> /scripts/logs/jd_unsubscribe.log 2>&1
# 京豆变动通知
0 12 * * * node /scripts/jd_bean_change.js >> /scripts/logs/jd_bean_change.log 2>&1
# 京豆变动通知all
12 18 * * * node /scripts/jd_bean_change_all.js >> /scripts/logs/jd_bean_change_all.log 2>&1
# 京东排行榜
11 9 * * * node /scripts/jd_rankingList.js >> /scripts/logs/jd_rankingList.log 2>&1
# 天天提鹅
18 * * * * node /scripts/jd_daily_egg.js >> /scripts/logs/jd_daily_egg.log 2>&1
# 金融养猪
3 2-23/2 * * * node /scripts/jd_pigPet.js >> /scripts/logs/jd_pigPet.log 2>&1
# 京喜工厂
22 3-23/2 * * * node /scripts/jd_dreamFactory.js >> /scripts/logs/jd_dreamFactory.log 2>&1
# 京喜工厂开团
20 9,13,16 * * * node /scripts/jd_dreamFactory_tuan.js >> /scripts/logs/jd_dreamFactory_tuan.log 2>&1
# 东东小窝
#16 6,23 * * * node /scripts/jd_small_home.js >> /scripts/logs/jd_small_home.log 2>&1
# 京东快递签到
23 1 * * * node /scripts/jd_kd.js >> /scripts/logs/jd_kd.log 2>&1
# 领京豆额外奖励(每日可获得3京豆)
33 0-23/4 * * * node /scripts/jd_bean_home.js >> /scripts/logs/jd_bean_home.log 2>&1
# 京东直播(每日18豆)
10-20/5 12 * * * node /scripts/jd_live.js >> /scripts/logs/jd_live.log 2>&1
# 微信小程序京东赚赚
30 0,1 * * * node /scripts/jd_jdzz.js >> /scripts/logs/jd_jdzz.log 2>&1
# 导到所有互助码
47 7 * * * node /scripts/jd_get_share_code.js >> /scripts/logs/jd_get_share_code.log 2>&1
# 签到领现金
27 5,18,23 * * * node /scripts/jd_cash.js >> /scripts/logs/jd_cash.log 2>&1
# jd_cash_exchange
#0,2 0 * * * node /scripts/jd_cash_exchange.js >> /scripts/logs/jd_cash_exchange.log 2>&1
# 闪购盲盒
27 9,12,15 * * * node /scripts/jd_sgmh.js >> /scripts/logs/jd_sgmh.log 2>&1
# 京东秒秒币
10 7,12 * * * node /scripts/jd_ms.js >> /scripts/logs/jd_ms.log 2>&1
# 京喜财富岛
10 * * * *  node /scripts/jd_cfd.js >> /scripts/logs/jd_cfd.log 2>&1
# 京东极速版
48 0,8,18 * * *  node /scripts/jd_speed_sign.js >> /scripts/logs/jd_speed_sign.log 2>&1
# 京东摇一摇
0 1,17 * * * node /scripts/jd_shake.js >> /scripts/logs/jd_shake.log 2>&1

##############默认注释活动##############
# 价格保护
# 48 */8 * * * node /scripts/jd_work_price.js >> /scripts/logs/jd_work_price.log 2>&1
# 惊喜红包返现助力
# 48 20 * * * node /scripts/jx_aid_cashback.js >> /scripts/logs/jx_aid_cashback.log 2>&1
# 京东试用（默认注释，请配合取关脚本使用）
#10 0 * * *  node /scripts/jd_try.js >> /scripts/logs/jd_try.log 2>&1
# 删除优惠券(默认注释，如需要自己开启，如有误删，已删除的券可以在回收站中还原，慎用)
#20 9 * * 6 node /scripts/jd_delCoupon.js >> /scripts/logs/jd_delCoupon.log 2>&1
# 京东家庭号(暂不知最佳cron)
# */20 * * * * node /scripts/jd_family.js >> /scripts/logs/jd_family.log 2>&1

# 每3天的23:50分清理一次日志
50 23 */1 * * rm -rf /scripts/logs/*.log

# 京东全民开红包
#0 0 * * * node /scripts/jd_redPacket2.js >> /scripts/logs/jd_redPacket2.log 2>&1
# 东东农场-天天抽奖助力
0 0 * * * node /scripts/jd_fruit2_2.js >> /scripts/logs/jd_fruit2_2.log 2>&1
# 东东农场
0 0 * * * node /scripts/jd_fruit2.js >> /scripts/logs/jd_fruit2.log 2>&1
# 京东种豆得豆
0 0 * * * node /scripts/jd_plantBean2.js >> /scripts/logs/jd_plantBean2.log 2>&1
# 东东萌宠
0 0 * * * node /scripts/jd_pet2.js >> /scripts/logs/jd_pet2.log 2>&1
# 闪购盲盒
0 0 * * * node /scripts/jd_sgmh2.js >> /scripts/logs/jd_sgmh2.log 2>&1

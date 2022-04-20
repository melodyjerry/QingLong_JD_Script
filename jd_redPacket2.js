/*
京东全民开红包 - 只做助力
*/
const $ = new Env('京东全民开红包');
const jdCookieNode = require('./jdCookie.js');
let cookiesArr = [], cookie = '';
$.redPacketId = [];
//火爆账号
let huobaoArr = new Map([['jd_udrTvuuGlaCt',1],['jd_hqErRQpTHOnu',1],['jd_DpvQXuRTLveZ',1],['jd_gOnFHOiUdiLc',1],['jd_LmLhcEuncxVv',1],['jd_WmGYuWzbGsIQ',1],['jd_jWK98RG1irLs',1],['jd_jdDCvqrRmQaJ',1],['jd_6b91xdyR83DO',1],['jd_nYcRmZacIloH',1],['jd_frqAFITpEbGv',1],['jd_NvWUqZYzCIfC',1],['jd_NdMNDoPdAITE',1],['jd_IiXWDNTWsqHy',1],['jd_soZKtXYPahdA',1],['jd_oxzyHGOtHGYz',1],['jd_WMwHJbXyzUHg',1],['jd_jjolTemBIOZU',1],['jd_cBkNXctCllcc',1],['jd_UqotExbpeiHu',1],['jd_gsLylxlEpVTN',1],['jd_twvtUWVTMhFA',1],['jd_xNGolQqJUPFo',1],['jd_YNWsoJfbVccf',1],['jd_713fe336b73b1',1],['jd_PZuJobJLlwtq',1],['jd_SXLMKKTSRmIk',1],['jd_KBJqBtGqKavA',1],['jd_xzfhFUUVcIiR',1],['jd_JUDJSCMuDyIB',1],['jd_VxVlBtFQHLIa',1],['jd_JSpvJpgyadhS',1],['jd_iJtXgUCoxIyz',1],['jd_pzQTVklQTLkf',1],['jd_TqmuyuxNaoRk',1],['jd_UBYkUMxYHRZK',1],['jd_MAvxrmQkZogc',1],['jd_QbnOGuXaXtoH',1],['jd_YwHXlNFBkvsy',1],['jd_fnpXhXlaHIAp',1],['jd_znbVHdJRYgNf',1],['jd_RwnattpElRdj',1],['jd_ECgleviKNTvK',1],['jd_YhCGXyvvqLbN',1],['jd_ehjwjPBgfhhR',1],['jd_lYWhaRxVkBDz',1],['jd_bCieRrAulAOZ',1],['jd_xezeXVUjunjB',1],['jd_BJLPmaQOtxHw',1],['jd_nJtKfNOgpFZg',1],['jd_RagGkFKeaEtI',1],['jd_QqcNTqSXiqMy',1],['jd_YMomkJXumqAT',1],['jd_ySxWtTQoMxDF',1],['jd_TMthcimIQSEI',1],['jd_qpGEgLDMyiVH',1],['jd_UTFKBohGCklk',1],['jd_kopirBUVhBzS',1],['jd_vNEWjFrtaDGv',1],['jd_WIQWPyUmDpcV',1],['jd_UjyXnSSjoaOw',1],['jd_WDyquhceGldp',1],['jd_UxjtcOPxXpzz',1],['jd_vKqXorMoZtJh',1],['jd_PZxDQitKICMx',1],['jd_NXkwZQLYgExK',1],['jd_HaVWxoMptFps',1],['jd_MSMpEHAGiOXB',1],['jd_bIhfvxkWeilM',1],['jd_EgmJDoCxNARD',1],['jd_qJoEObEQAoXC',1],['jd_bZppNOKrBJrI',1],['jd_nsiVNKqwDWLu',1],['jd_SARImJwtUjwD',1],['jd_lFHXVqkVkaJU',1],['jd_FPrfLIZLQLTW',1],['jd_BPyCcyvxUoNb',1],['jd_ibKXXsVPPLzk',1],['jd_ECLhHafbYJIF',1],['jd_UHSRTJAwqzEp',1],['jd_euOnctphFUZl',1],['jd_AEsiAjWKDHgR',1],['jd_ICPmJDUazxYy',1],['jd_MLkOwNtwWPBV',1],['jd_XihazarQwYkN',1],['jd_AuAMbcTVgPAc',1],['jd_fxqvktlMmdkR',1],['jd_DRyIFQeZefOh',1],['jd_PAeUeExokzLf',1],['jd_NMhMsRmKiUtC',1],['jd_kxgLOFEWdWNn',1],['jd_PxmeTmgGYMwm',1],['jd_rytvrCguroFP',1],['jd_aEAEwxILuXjs',1],['jd_RNZzGiNvjkhO',1],['jd_KlxSibAZpySY',1],['jd_zKxnVmmcAkzh',1],['jd_wMSKKvXAudfG',1],['jd_ubRRveJBABNd',1],['jd_pnEQRMhOLYtI',1],['jd_cskxazBvmATV',1],['jd_iRpIhhTwMHXG',1],['jd_BbhMSgRxgWHL',1],['jd_eCBXobKczdEm',1],['jd_hjNVoCIBjLNC',1],['jd_abAebHrlWwiG',1],['jd_XqcRyDPeMwKz',1],['jd_OpeGLCZqCjSr',1],['jd_EMfQDoqAzsSC',1],['jd_qjsgtiPMigIj',1],['jd_ulITLLJMAWbm',1],['jd_hFTsPehwhoGz',1],['jd_jbnQBxNvPkIV',1],['jd_TWFkJnLIiZww',1],['jd_hYPBKKneSGou',1],['jd_ZkmNJUHIMfZS',1],['jd_tPrdcPHjclel',1],['jd_vMLEphfBOgsn',1],['jd_hlaZQyQRsOem',1],['jd_OCdwuhGNEBDL',1],['jd_bBAanvaqdBmy',1],['jd_BplIFAxcYEse',1],['jd_AxWeOlIKIlaZ',1],['jd_oeIvAZPdgLVH',1],['jd_HxotLaGrUMxc',1],['jd_ianTgZEoPCPa',1],['jd_XmzVegIJdxHU',1],['jd_ogxyBkLEDbTb',1],['jd_vMYWNMafLHhl',1],['jd_oAAYtdvOVIBE',1],['jd_vQPtxtdkaXha',1],['jd_KDLVjX8oyxVM',1],['jd_KULnfMVGLxht',1],['jd_NdbcbAAxgalm',1],['jd_cJvmiWZpsuOM',1],['jd_XWywCfFxsdHy',1],['jd_AREbnwfYmybj',1],['jd_LMnqWOvfCpcd',1],['jd_kpGSdxWgKmxQ',1],['jd_WOtgPDwpXGSf',1],['jd_gkAsKtusqQfJ',1],['jd_YumiJopJIJcW',1],['jd_rWlSRwTAkuIR',1],['jd_ABHOasyZBaAr',1],['jd_EAaambGpITUd',1],['jd_fEGvBFWcNqdr',1],['jd_OJZvtwPiummT',1],['jd_EDvWXbPgeGkG',1],['jd_UXDIoJLqfhXc',1],['jd_qmxrRCiVZilO',1],['jd_vvMZpdyOLfxi',1],['jd_SLOYCHgDsgtU',1],['jd_LNxAEwpJXAtH',1],['jd_qoMTrJzZYySE',1],['jd_LJlebDKviWhH',1],['jd_uGaAcEzzDnqZ',1],['jd_EiwFrxTBoVBw',1],['jd_upPQrimsrubS',1],['jd_AbqvmWTUoruG',1],['jd_BakWwKQqxyLp',1],['jd_xqemjTrrwmkz',1],['jd_kehgFGhIYAYt',1],['jd_FmjEpKDOECDm',1],['jd_uuslfWpnmyyP',1],['jd_NbZKTLMCnCAS',1],['jd_fVmztZuMxZTL',1],['jd_VrE70u6Xbl6g',1],['jd_AgFztWKVRIBd',1],['jd_jOUOEFpYJzPc',1],['jd_LyhRgcooqsLv',1],['jd_WdJrQlsTFsmS',1],['jd_yIjCiUfOUEfN',1],['jd_VPLdOAAFoOsq',1],['jd_gNQMiRMrjMTh',1],['jd_goiFJoZNLETr',1],['jd_LXFZfNLmIENB',1],['jd_pLJmPPQyOaSg',1],['jd_GlBYPuCIUQSC',1],['jd_sznoeknNZBLV',1],['jd_XzKWLhnaAdMQ',1],['jd_gvpqDDGaXUcL',1],['jd_XYyocJJrjUTQ',1],['jd_xoMCjXtarBJh',1],['jd_WGTbjXfOVXfo',1],['jd_mozIGaawYpBY',1],['jd_LoFUwNXNYuJE',1],['jd_JlepQlnbdCCZ',1],['jd_QdUuejpAnEYt',1],['jd_jXNOZcEnplCE',1],['jd_BIGViuHurANQ',1],['jd_lXrFdmEfRPNf',1],['jd_FbnWdoCOvPoK',1],['jd_AyugFXdjmAuB',1],['jd_dnQqxrHyfoza',1],['jd_HaeqBnYJmJRw',1],['jd_KdYCRtVkOJxb',1],['jd_UmcsirHBpAWu',1],['jd_vazfjsyAbTDC',1],['jd_IlGKpfpumAnv',1],['jd_MLuOCRljAePK',1],['jd_zhNiEBsArFOc',1],['jd_OlmXARRLcYQi',1],['jd_uVKHqimAWwSJ',1],['jd_nVPMGAMckDXH',1],['jd_OdKbAuulBunk',1],['jd_mCSDCJSsjsjn',1],['jd_FbbPiLVrQkSn',1],['jd_UtUGggBgUxqL',1],['jd_NaqhJeUeEbkr',1],['jd_OtYEMZNZMete',1],['jd_JWpjyFxEUMQK',1],['jd_jkyMdenopqNz',1],['jd_nNxcsmGYYEWz',1],['jd_ImrODlGeBgKa',1],['jd_XoOfDnjxcIfw',1],['jd_teyTNnXIfjvO',1],['jd_kRgdlNDquurw',1],['jd_LzrtWhjNtNKY',1],['jd_TYSSizLTCKwp',1],['jd_XNOObRGwHCJE',1],['jd_gExLlpSWGKsH',1],['jd_lpWkDxVKBxqb',1],['jd_BDVwkuFaDqJn',1],['jd_hkLMOBnoRxpW',1],['jd_WeicBKIxRIej',1],['jd_DadybHBrBAPF',1],['jd_HuxtlZPCTkrP',1],['jd_fZVEDIrimvxL',1],['jd_jhxcooziSWXN',1],['jd_PgDGYNXsUtSp',1],['jd_bIChvxHkdXwR',1],['jd_IbhOPFoNAobc',1],['jd_rVdXWfaTNCHQ',1],['jd_PcleUILRiYuN',1],['jd_IMVjezIzdyhp',1],['jd_TbOQbQGrqJBS',1],['jd_igUkaWprFsbr',1],['jd_qUMfOQPkSHub',1],['jd_NDUHfQWshdxI',1],['jd_KAcLGSkSgsDW',1],['jd_pkfAzptXicKp',1],['jd_hzvNZyRbvHTD',1],['jd_fHtYDhZMzDEO',1],['jd_INdMnZZjCTdW',1],['jd_GhsJULBkSnms',1],['jd_YSghlodePRcP',1],['jd_rNfqWuqKeLtG',1],['jd_qUEXSGiopucb',1],['jd_GPmqgCAunzAK',1],['jd_CWqBnPPuNmXI',1],['jd_qSORmeEKvspw',1],['jd_mUELEpZQSZpH',1],['jd_TeqHUlCpburo',1],['jd_MbwDnlyGuDnU',1],['jd_YtxLBrQjnEQg',1],['jd_QVQgwpORsQyM',1],['jd_KjpOJionKxqJ',1],['jd_MgVWTswjhOXN',1],['jd_lIfcScxsAnfj',1],['jd_RZPdHADaosKj',1],['jd_XSZwcmqpMfJN',1],['jd_BbhReqgFvTwL',1],['jd_jAtIUzpTLBnA',1],['jd_AwCqzkVsXrfe',1],['jd_ygLAKVUyHqJZ',1],['jd_NaYepmLDOimf',1],['jd_xpJrgnAydLMm',1],['jd_feoWKberZijd',1],['jd_UCdRzOGyPlaq',1],['jd_OlhanJKKxwxh',1],['jd_pjnLUp3o7Lr3',1],['jd_YQVHtUJxikyG',1],['jd_bqsHHAfDEhkH',1],['jd_yGVgevRDHUnQ',1],['jd_QTiNFYcRlJfW',1],['jd_SPBLtRhqiorw',1],['jd_NRrtsBPqxfXY',1],['jd_RHVDPzIFdsoE',1],['jd_dmdCARllJkXL',1],['jd_yGXACFShyaKI',1],['jd_hPXtXOgoyxYL',1],['jd_nIRNzowzBiBW',1],['jd_HjVPMTWeehbD',1],['jd_tZahneNWWjqo',1],['jd_vEyfVYopDGNG',1],['jd_rAIiJJFopnhg',1],['jd_cKKTJZnBlmGv',1],['jd_yCZWgxrsJjCK',1],['jd_uVmCGcvukckr',1],['jd_NFPpKtvLfOHF',1],['jd_AncSnKSvgoLk',1],['jd_WdwKcrwgbyaK',1],['jd_sYWHPsqxwJnZ',1],['jd_eiQopJojGsAa',1],['jd_mEKcOweNFTBy',1],['jd_eQXkGJFGdDds',1],['jd_wCxoZqpPbUjE',1],['jd_qwvNvKEmKGTq',1],['jd_phkFQHklonTh',1],['jd_kosqyEFgRPOz',1],['jd_FFVtTOKJWmVa',1],['jd_sqrDPKeqwNuL',1],['jd_tNgaMwyojIgF',1],['jd_puOGssbXpSkt',1],['jd_MGZZvWPcMWZE',1],['jd_YvROWklbHuxL',1],['jd_QAAAMWjkUzfn',1],['jd_RwKStXQLcRkm',1],['jd_rjgKadcRRnwx',1],['jd_weVcgdHRKtuk',1],['jd_cuTdQwxlaEtZ',1],['jd_czvERUNnkPAY',1],['jd_yFcFkgZgisiv',1],['jd_AXUvxuoKTymM',1],['jd_EUJvDrlIyleH',1],['jd_PUZzyiuBDXkd',1],['jd_dsgNtMWwxBDq',1],['jd_diPvHQMaJdmh',1],['jd_eMCrBrAtmvJr',1],['jd_fTzHuTphDhMu',1],['jd_IdfqLuXKVNcD',1],['jd_FFTOzSRcVWZE',1],['jd_WNepGFLmRctF',1],['jd_BxAyWPWuwJdN',1],['jd_UoKZGnUQUwaO',1],['jd_OHqeYuBEAjLw',1],['jd_SlSwtPaTooIw',1],['jd_CxWAryzOTisa',1],['jd_UHHMnsoeRxxH',1],['jd_cJJprexnCptb',1],['jd_gjmRcCEnmlbQ',1],['jd_picphiAgEvbP',1],['jd_wSGpIpmiKEDG',1],['jd_WXnJGAUGBpOr',1],['jd_ygDllCMiGLnn',1],['jd_BoVEHdbNkrlG',1],['jd_rtLLaVOBSbib',1],['jd_EFBPImcICGCK',1],['jd_DzqiCEQCbOIk',1],['jd_CsoaPbwSdYxq',1],['jd_JhIaSOIlBEJM',1],['jd_VnOvoQVrFafe',1],['jd_RwOTxekANLUw',1],['jd_DjVMYTqSxycx',1],['jd_pOuaOHdJHhOt',1],['jd_kJvaBazrTLyq',1],['jd_YCCEMkFndPqA',1],['jd_fCJVAAghlFjY',1],['jd_RrzJTdWEYUcf',1],['jd_cdqpLtdUYYqL',1],['jd_MSgQNVJPoLiC',1],['jd_KepboUykREjn',1],['jd_LNXHIuabuTqM',1],['jd_5eb77f89a3413',1],['jd_OBJrDtBIEzGu',1],['jd_dSDtsnRRBIRg',1],['jd_hBQtbAhKOhhm',1],['jd_SDIvfGxpHyQO',1],['jd_ZTFYCgpcGcRg',1],['jd_QxgQFEDBMqle',1],['jd_sewYmxMKRfWN',1],['jd_ECrCWrtPP7R3',1],['jd_gakgQaLiHhrm',1],['jd_xCzusGbODeeK',1],['jd_JunqiVoqOytN',1],['jd_VMJdljLWmQXy',1],['jd_rxswWnUNUYFN',1],['jd_GTpHsQejPDAv',1],['jd_yAwSPFwwaYKo',1],['jd_PLkKDYXRxgso',1],['jd_TQAzRGozGvNp',1],['jd_HKTzQtsQchrw',1],['jd_tuHOWsYNsntV',1],['jd_jickHqCZnrqy',1],['jd_iJYmFbXzWjwh',1],['jd_eIUFJytxhYyt',1],['jd_EpzBqyMEjxRR',1],['jd_FBEpzMfeiWhb',1],['jd_YUyHuxOXawkr',1],['jd_pnAaNVUQnbdl',1],['jd_ZWkMxBYCPoiR',1],['jd_dNokGRULlwOJ',1],['jd_bTnYMfWoqvxf',1],['jd_OTPZxsjyZvIG',1],['jd_NgeorCwWUUlP',1],['jd_oDCyPXJTiwnV',1],['jd_jcBAUVaEmVWE',1],['jd_bbBgPlQUgKhe',1],['jd_bTOkzQpcXPvc',1],['jd_EDvqFkHqhYSn',1],['jd_LFzwlTlnIwTP',1],['jd_VnzGHFHIuJTd',1],['jd_tgHDibEFAXcq',1],['jd_tomjAGDdmOdf',1],['jd_xYAhNxKFQoVP',1],['jd_jQJpntSqaGBk',1],['jd_BeaEgaWeJwgP',1],['jd_kmPwnDcfaxBd',1],['jd_pioNGwtgWFOs',1],['jd_UmnRPSdKTBgL',1],['jd_eRczPlmWADej',1],['jd_MUHNXFlDBjtU',1],['jd_ogJFrZGzDiZf',1],['jd_cbyGVoqHsIbi',1],['jd_rlEjGyxcKyfP',1],['jd_FlJcxKnMsxMm',1],['jd_WoPQhawzcFIb',1],['jd_audWPLMhzfHZ',1],['jd_hRWpeHtdxmOo',1],['jd_fHgZMZeZduof',1],['jd_YRvlWGlnUoIM',1],['jd_obQpBMbhQZCe',1],['jd_BTFXUnIHXSot',1],['jd_mIOJMauwSdjU',1],['jd_LxRnoeOXbyeX',1],['jd_MfALLByRWCqI',1],['jd_DLlmhPAjRebX',1],['jd_qcHBahFgHbbE',1],['jd_FxdrvtowsYYf',1],['jd_mfoVOqBiwxBW',1],['jd_erKGUIZWcKit',1],['jd_aPipgGihtzVu',1],['jd_nVBZJDrtERNj',1],['jd_pLwImHceaDNE',1],['jd_SHZnntsutVpz',1],['jd_qtZzBxmMbDlx',1],['jd_zpnqINCuccAx',1],['jd_KvWmvnrxvUxE',1],['jd_qyNTuscWsRXG',1],['jd_CZnYteEBFLri',1],['jd_LkNrYSZSTQfs',1],['jd_OhiVOmBWVYvp',1],['jd_lkMRpQKoPlfW',1],['jd_WNXIBVYIzrcj',1],['jd_hwbDiNBEfQIP',1],['jd_XHBjjuyfACJm',1],['jd_LVsvFJVTzaRG',1],['jd_NGSSTrlbjlKU']]);
Object.keys(jdCookieNode).forEach((item) => {
  cookiesArr.push(jdCookieNode[item])
})
const JD_API_HOST = 'https://api.m.jd.com/api';
!(async () => {
  if (!cookiesArr[0]) {
    //$.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i] && i < 3) {
      cookie = cookiesArr[i];
      //$.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      //await TotalBean();
      //console.log(`\n****开始【京东账号${$.index}】****\n`);
      /*if (!$.isLogin) {
        //console.log(`cookie失效\n`);
        continue
      }*/
      $.discount = 0;
      await redPacket();
      if ($.redPacketId.length > 0) {
        break;
      }
    }
  }
  //console.log(`\n开始账号内部互助`);
  for (let i = 0; i < cookiesArr.length; i++) {
    if (i < 3) {
      continue;
    }
    cookie = cookiesArr[i];
    $.index = i + 1;
    $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
    if (huobaoArr.has($.UserName)) {
      //huobaoArr.delete($.UserName);
      continue;
    }
    $.canHelp = true;
    //$.redPacketId = [...new Set($.redPacketId)];
    if (cookiesArr && cookiesArr.length >= 2) {
      for (let j = 0; j < $.redPacketId.length && $.canHelp; j++) {
        //console.log(`账号 ${$.index} ${$.UserName} 开始给 ${$.redPacketId[j]} 助力`)
        $.max = false;
        //await jinli_h5assist($.redPacketId[j]);
        jinli_h5assist($.redPacketId[j]);
        //await $.wait(2000)
        /*if ($.max) {
          $.redPacketId.splice(j, 1)
          j--
          continue
        }*/
      }
    }
  }
  /*let str = '';
  for (let i = 0; i < huobaoArr.length; i++) {
    str = str + "','" + huobaoArr[i];
  }
  console.log(str);
  */
})()
    .catch((e) => {
      //$.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })

async function redPacket() {
  try {
    //await h5activityIndex();//查询红包基础信息
    await red();//红包任务(发起助力红包,领取助力红包等)
    if ($.redPacketId.length <= 0) {
      await h5activityIndex();
      if ($.h5activityIndex && $.h5activityIndex.data && ($.h5activityIndex.data.biz_code === 20001)) {
        //20001:红包活动正在进行，可拆
        const redPacketId = $.h5activityIndex.data.result.redpacketInfo.id;
        if (redPacketId) $.redPacketId.push(redPacketId);
        //console.log(`红包ID: ` + redPacketId);
      }
    }
  } catch (e) {
    //$.logErr(e);
  }
}
async function red() {
  /*if ($.h5activityIndex && $.h5activityIndex.data && $.h5activityIndex.data.biz_code === 10002) {
    //可发起拆红包活动
    await h5launch();
  } else if ($.h5activityIndex && $.h5activityIndex.data && ($.h5activityIndex.data.biz_code === 20001)) {
    //20001:红包活动正在进行，可拆
    const redPacketId = $.h5activityIndex.data.result.redpacketInfo.id;
    if (redPacketId) $.redPacketId.push(redPacketId);
    console.log(`\n\n当前待拆红包ID:${redPacketId}\n\n`)
    //console.log(`当前可拆红包个数：${$.waitOpenTimes}`)
    /!*if ($.waitOpenTimes > 0) {
      for (let i = 0; i < $.waitOpenTimes; i++) {
        await h5receiveRedpacketAll();
        //await $.wait(500);
      }
    }*!/
  } else if ($.h5activityIndex && $.h5activityIndex.data && $.h5activityIndex.data.biz_code === 20002) {
    console.log(`\n${$.h5activityIndex.data.biz_msg}\n`);
  }*/
  //可发起拆红包活动
  await h5launch();
}
//助力API
function jinli_h5assist(redPacketId) {
  const body = {"redPacketId":redPacketId,"followShop":0,"random":"56589911","log":`${Date.now()}~4817e3a2~8,~1wsv3ig`,"sceneid":"JLHBhPageh5"};
  const options = taskUrl(arguments.callee.name.toString(), body)
  return new Promise((resolve) => {
    $.post(options, (err, resp, data) => {
      try {
        /*if (err) {
          console.log(`\n${$.name}: API查询请求失败 ‼️‼️`);
          //console.log(JSON.stringify(err));
        } else {
          data = JSON.parse(data);
          if (data && data.data && data.data.biz_code === 0) {
            // status ,0:助力成功，1:不能重复助力，3:助力次数耗尽，8:不能为自己助力
            console.log(`助力结果：${data.data.result.statusDesc}`)
            /!*if (data.data.result.statusDesc.indexOf('活动太火爆啦') != -1) {
              huobaoArr.push($.UserName)
            }*!/
            if (data.data.result.status === 2) $.max = true;
            if (data.data.result.status === 3) $.canHelp = false;
            if (data.data.result.status === 9) $.canHelp = false;
          } else {
            console.log(`助力异常：${JSON.stringify(data)}`);
          }
        }*/
      } catch (e) {
        //$.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
//发起助力红包API
function h5launch() {
  const body = {"isjdapp":1,"random":"33235811","log":"4817e3a2~8,~1wsv3ig","sceneid":"JLHBhPageh5"};
  const options = taskUrl(arguments.callee.name.toString(), body)
  return new Promise((resolve) => {
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          //console.log(`\n${$.name}: API查询请求失败 ‼️‼️`);
          //console.log(JSON.stringify(err));
        } else {
          data = JSON.parse(data);
          if (data && data.data && data.data.biz_code === 0) {
            if (data.data.result.redPacketId) {
              //console.log(`\n\n发起助力红包 成功：红包ID ${data.data.result.redPacketId}`)
              $.redPacketId.push(data.data.result.redPacketId);
            } else {
              //console.log(`\n\n发起助力红包 失败：${data.data.result.statusDesc}`)
            }
          } else {
            //console.log(`发起助力红包 失败：${JSON.stringify(data)}`)
          }
        }
      } catch (e) {
        //$.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
function h5activityIndex() {
  const body = {"isjdapp":1,"random":"33235811","log":"4817e3a2~8,~1wsv3ig","sceneid":"JLHBhPageh5"};
  const options = taskUrl(arguments.callee.name.toString(), body);
  return new Promise((resolve) => {
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          //console.log(`\n${$.name}: API查询请求失败 ‼️‼️`);
          //console.log(JSON.stringify(err));
        } else {
          data = JSON.parse(data);
          $.h5activityIndex = data;
          $.discount = 0;
          if ($.h5activityIndex && $.h5activityIndex.data && $.h5activityIndex.data.result) {
            const rewards = $.h5activityIndex.data.result.rewards || [];
            for (let item of rewards) {
              $.discount += item.packetSum;
            }
            if ($.discount) $.discount = $.discount.toFixed(2);
          }
        }
      } catch (e) {
        //$.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
function taskUrl(functionId, body = {}) {
  return {
    url: `${JD_API_HOST}?appid=jinlihongbao&functionId=${functionId}&loginType=2&client=jinlihongbao&clientVersion=10.2.6&osVersion=iOS&d_brand=iPhone&d_model=iPhone&t=${new Date().getTime() * 1000}`,
    body: `body=${escape(JSON.stringify(body))}`,
    headers: {
      "Host": "api.m.jd.com",
      "Content-Type": "application/x-www-form-urlencoded",
      "Origin": "https://happy.m.jd.com",
      "Accept-Encoding": "gzip, deflate, br",
      "Cookie": cookie,
      "Connection": "keep-alive",
      "Accept": "*/*",
      "User-Agent": require('./USER_AGENTS').USER_AGENT,
      "Referer": "https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html",
      "Content-Length": "56",
      "Accept-Language": "zh-cn"
    }
  }
}
function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      url: "https://wq.jd.com/user_new/info/GetJDUserInfoUnion?sceneval=2",
      headers: {
        Host: "wq.jd.com",
        Accept: "*/*",
        Connection: "keep-alive",
        Cookie: cookie,
        "User-Agent": require('./USER_AGENTS').USER_AGENT,
        "Accept-Language": "zh-cn",
        "Referer": "https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&",
        "Accept-Encoding": "gzip, deflate, br"
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          $.logErr(err)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 1001) {
              $.isLogin = false; //cookie过期
              return;
            }
            if (data['retcode'] === 0 && data.data && data.data.hasOwnProperty("userInfo")) {
              $.nickName = data.data.userInfo.baseInfo.nickname;
            }
          } else {
            console.log('京东服务器返回空数据');
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
!function(n){function t(n,t){var r=(65535&n)+(65535&t);return(n>>16)+(t>>16)+(r>>16)<<16|65535&r}function r(n,t){return n<<t|n>>>32-t}function e(n,e,o,u,c,f){return t(r(t(t(e,n),t(u,f)),c),o)}function o(n,t,r,o,u,c,f){return e(t&r|~t&o,n,t,u,c,f)}function u(n,t,r,o,u,c,f){return e(t&o|r&~o,n,t,u,c,f)}function c(n,t,r,o,u,c,f){return e(t^r^o,n,t,u,c,f)}function f(n,t,r,o,u,c,f){return e(r^(t|~o),n,t,u,c,f)}function i(n,r){n[r>>5]|=128<<r%32,n[14+(r+64>>>9<<4)]=r;var e,i,a,d,h,l=1732584193,g=-271733879,v=-1732584194,m=271733878;for(e=0;e<n.length;e+=16){i=l,a=g,d=v,h=m,g=f(g=f(g=f(g=f(g=c(g=c(g=c(g=c(g=u(g=u(g=u(g=u(g=o(g=o(g=o(g=o(g,v=o(v,m=o(m,l=o(l,g,v,m,n[e],7,-680876936),g,v,n[e+1],12,-389564586),l,g,n[e+2],17,606105819),m,l,n[e+3],22,-1044525330),v=o(v,m=o(m,l=o(l,g,v,m,n[e+4],7,-176418897),g,v,n[e+5],12,1200080426),l,g,n[e+6],17,-1473231341),m,l,n[e+7],22,-45705983),v=o(v,m=o(m,l=o(l,g,v,m,n[e+8],7,1770035416),g,v,n[e+9],12,-1958414417),l,g,n[e+10],17,-42063),m,l,n[e+11],22,-1990404162),v=o(v,m=o(m,l=o(l,g,v,m,n[e+12],7,1804603682),g,v,n[e+13],12,-40341101),l,g,n[e+14],17,-1502002290),m,l,n[e+15],22,1236535329),v=u(v,m=u(m,l=u(l,g,v,m,n[e+1],5,-165796510),g,v,n[e+6],9,-1069501632),l,g,n[e+11],14,643717713),m,l,n[e],20,-373897302),v=u(v,m=u(m,l=u(l,g,v,m,n[e+5],5,-701558691),g,v,n[e+10],9,38016083),l,g,n[e+15],14,-660478335),m,l,n[e+4],20,-405537848),v=u(v,m=u(m,l=u(l,g,v,m,n[e+9],5,568446438),g,v,n[e+14],9,-1019803690),l,g,n[e+3],14,-187363961),m,l,n[e+8],20,1163531501),v=u(v,m=u(m,l=u(l,g,v,m,n[e+13],5,-1444681467),g,v,n[e+2],9,-51403784),l,g,n[e+7],14,1735328473),m,l,n[e+12],20,-1926607734),v=c(v,m=c(m,l=c(l,g,v,m,n[e+5],4,-378558),g,v,n[e+8],11,-2022574463),l,g,n[e+11],16,1839030562),m,l,n[e+14],23,-35309556),v=c(v,m=c(m,l=c(l,g,v,m,n[e+1],4,-1530992060),g,v,n[e+4],11,1272893353),l,g,n[e+7],16,-155497632),m,l,n[e+10],23,-1094730640),v=c(v,m=c(m,l=c(l,g,v,m,n[e+13],4,681279174),g,v,n[e],11,-358537222),l,g,n[e+3],16,-722521979),m,l,n[e+6],23,76029189),v=c(v,m=c(m,l=c(l,g,v,m,n[e+9],4,-640364487),g,v,n[e+12],11,-421815835),l,g,n[e+15],16,530742520),m,l,n[e+2],23,-995338651),v=f(v,m=f(m,l=f(l,g,v,m,n[e],6,-198630844),g,v,n[e+7],10,1126891415),l,g,n[e+14],15,-1416354905),m,l,n[e+5],21,-57434055),v=f(v,m=f(m,l=f(l,g,v,m,n[e+12],6,1700485571),g,v,n[e+3],10,-1894986606),l,g,n[e+10],15,-1051523),m,l,n[e+1],21,-2054922799),v=f(v,m=f(m,l=f(l,g,v,m,n[e+8],6,1873313359),g,v,n[e+15],10,-30611744),l,g,n[e+6],15,-1560198380),m,l,n[e+13],21,1309151649),v=f(v,m=f(m,l=f(l,g,v,m,n[e+4],6,-145523070),g,v,n[e+11],10,-1120210379),l,g,n[e+2],15,718787259),m,l,n[e+9],21,-343485551),l=t(l,i),g=t(g,a),v=t(v,d),m=t(m,h)}return[l,g,v,m]}function a(n){var t,r="",e=32*n.length;for(t=0;t<e;t+=8){r+=String.fromCharCode(n[t>>5]>>>t%32&255)}return r}function d(n){var t,r=[];for(r[(n.length>>2)-1]=void 0,t=0;t<r.length;t+=1){r[t]=0}var e=8*n.length;for(t=0;t<e;t+=8){r[t>>5]|=(255&n.charCodeAt(t/8))<<t%32}return r}function h(n){return a(i(d(n),8*n.length))}function l(n,t){var r,e,o=d(n),u=[],c=[];for(u[15]=c[15]=void 0,o.length>16&&(o=i(o,8*n.length)),r=0;r<16;r+=1){u[r]=909522486^o[r],c[r]=1549556828^o[r]}return e=i(u.concat(d(t)),512+8*t.length),a(i(c.concat(e),640))}function g(n){var t,r,e="";for(r=0;r<n.length;r+=1){t=n.charCodeAt(r),e+="0123456789abcdef".charAt(t>>>4&15)+"0123456789abcdef".charAt(15&t)}return e}function v(n){return unescape(encodeURIComponent(n))}function m(n){return h(v(n))}function p(n){return g(m(n))}function s(n,t){return l(v(n),v(t))}function C(n,t){return g(s(n,t))}function A(n,t,r){return t?r?s(t,n):C(t,n):r?m(n):p(n)}$.md5=A}(this);
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}

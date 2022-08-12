import i18next from "i18next";
import { initReactI18next } from "react-i18next";

const i18nResources = {
  "zh-CN": {
    translation: {
      "biddingNotepad": "桥牌叫牌体系记录簿",
      "createTable": "创建表格",
      "create": "创建",
      "cancel": "取消",
      "search": "搜索",
      "title": "标题",
      "minTricks": "最低叫牌墩数",
      "minSuit": "最低叫牌花色",
      "modifyTableInfo": "修改表格信息",
      "OK": "确认",
      "removeTable": "删除表格",
      "certainToRemoveTable": "确定要删除表格\"{{title}}\"吗？",
      "remove": "删除",
      "tableDescription": "表格描述",
      "noSelectedTable": "未选择表格",
      "download...": "下载…",
      "upload...": "上传…",
    },
  },
};

export function initI18n() {
  i18next
    .use(initReactI18next)
    .init({
      resources: i18nResources,
      lng: "zh-CN",
      fallbackLng: "zh-CN",
      interpolation: {
        escapeValue: false,
      },
    });
}
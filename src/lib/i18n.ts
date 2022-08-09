import i18next from "i18next";
import { initReactI18next } from "react-i18next";

const i18nResources = {
  "zh-CN": {
    translation: {
      "createTable": "创建表格",
      "create": "创建",
      "cancel": "取消",
      "search": "搜索",
      "title": "标题",
      "minTricks": "最低叫牌墩数",
      "minSuit": "最低叫牌花色",
      "removeTable": "删除表格",
      "certainToRemoveTable": "确定要删除表格\"{{title}}\"吗？",
      "remove": "删除",
      "save...": "保存...",
      "load...": "读取...",
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
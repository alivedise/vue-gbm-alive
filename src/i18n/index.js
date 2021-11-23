import Vue from 'vue';
import vuexI18n from 'vuex-i18n/dist/vuex-i18n.umd'; // es version will break jest tests.
import store from '@/store';
import DEFAULT_LANG_LIST_MAP from '@/i18n/defaultLanguage';
import NavigatorLanguageHelper from '@/i18n/navigatorLanguageHelper';

Vue.use(vuexI18n.plugin, store, {
  identifiers: ['%', '%'],
});

const languages = {};

function load() {
  let defaultLanguage = localStorage.getItem('language');
  if (!defaultLanguage) {
    defaultLanguage = NavigatorLanguageHelper.getNavigatorLanguage();
    localStorage.setItem('language', defaultLanguage);
  }

  Object.keys(DEFAULT_LANG_LIST_MAP).forEach((language) => {
    Vue.i18n.add([`${language}`], DEFAULT_LANG_LIST_MAP[language].file);
    languages[`${language}`] = DEFAULT_LANG_LIST_MAP[language].name;
  });

  Vue.i18n.set(defaultLanguage);
}

// XXX: We need this to access store outside vue component.
window.$_store = store;

load();

export default {
  load, // For testing purpose.
  languages,
  switchLanguage: (lang) => {
    Vue.i18n.set(lang);
    localStorage.setItem('language', lang);
    // for Banshee, Tryon
    const languageIndex = Object.keys(DEFAULT_LANG_LIST_MAP).indexOf(lang);
    document.cookie = `language=${languageIndex}; max-age=${60 * 60 * 24 * 2}; path=/;`;
  },
};

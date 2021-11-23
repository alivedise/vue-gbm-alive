export default {
  getNavigatorLanguage() {
    const lang = window.navigator.userLanguage || window.navigator.language;
    let relang = '';
    if (typeof (lang) !== 'undefined') {
      relang = lang.toLowerCase();
    }

    let current = 'English';
    switch (relang) {
      case 'en-us':
        current = 'English';
        break;
      case 'ja':
      case 'ja-jp':
        current = 'Japanese';
        break;
      case 'zh-cn':
      case 'zh-hans':
      case 'zh-sg':
      case 'zh-tw':
      case 'zh-hanf':
      case 'zh-hk':
      case 'zh-mo':
        current = 'TradChinese';
        break;
      default:
        break;
    }
    return current;
  }
};

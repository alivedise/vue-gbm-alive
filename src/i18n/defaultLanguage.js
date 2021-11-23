import English from '@/i18n/languages/English.json';
import Japanese from '@/i18n/languages/Japanese.json';
import TradChinese from '@/i18n/languages/TradChinese.json';

const DEFAULT_LANG_LIST_MAP = {
  English: {
    name: 'English',
    file: English,
  },
  Japanese: {
    name: '日本語',
    file: Japanese,
  },
  TradChinese: {
    name: '繁體中文',
    file: TradChinese,
  },
};
export default DEFAULT_LANG_LIST_MAP;

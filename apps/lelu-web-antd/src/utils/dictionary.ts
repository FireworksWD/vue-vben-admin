import {toRaw} from 'vue';
import {DictionaryStore} from '#/store/dictionary';
import {$t} from '#/locales'

/**
 * @method 获取指定name字典
 */
export const dictionary = (name: string, key?: string | number | undefined) => {
  const dict = DictionaryStore()
  const dictionary = toRaw(dict.data)
  if (key != undefined) {
    const obj = dictionary[name].find((item: any) => item.value === key)
    return obj ? $t(obj.label) : ''
  } else {
    //国际化
    return dictionary[name].map((item: any) => ({
      ...item,
      label: $t(item.label),  // 给每个label字段加上$t处理
    }));
  }
}

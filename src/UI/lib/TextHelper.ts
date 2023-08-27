import { camelCase } from 'lodash';

class TextHelper {
  private font: string;
  private context: CanvasRenderingContext2D | null;

  constructor(font: string) {
    this.font = font;
    this.context = document.createElement('canvas').getContext('2d');
  }

  public getTextWidth(text: string): number {
    let width = 0;

    if (this.context) {
      this.context.font = this.font;
      width = this.context.measureText(text).width;
    }

    return width;
  }

  public static capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  public static translit(str: string, toPascalCase?: boolean) {
    str = str.toLowerCase().replace(/<.+>/, ' ').replace(/\s+/, ' ');
    const c: any = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'jo', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'ju', 'я': 'ja', ' ': '-', ';': '', ':': '', ',': '', '—': '-', '–': '-', '.': '', '«': '', '»': '', '"': '', "'": '', '@': '',
    }
    let newStr = '';
    for (let i = 0; i < str.length; i++) {
      const ch = str.charAt(i);
      newStr += ch in c ? c[ch] : ch;
    }
    if (toPascalCase) {
      const transformed = camelCase(newStr);
      return this.capitalizeFirstLetter(transformed);

    }
    return newStr;
  }

  public static declOfNum(n: number, titles: Array<string>) {
    /* eslint-disable-next-line */
    return titles[(n % 10 === 1 && n % 100 !== 11) ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
  }

}

export default TextHelper;

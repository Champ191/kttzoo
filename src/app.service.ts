import { Injectable, Logger } from '@nestjs/common';
import { TranslateDto } from './translate.dto';
import { GeminiClientService } from './infra/gemini-client/services/gemini-client.service';

@Injectable()
export class AppService {
  constructor(private readonly geminiClient: GeminiClientService) {}
  private readonly LOGGER = new Logger(AppService.name);

  async translateWithAi(inputText: TranslateDto) {
    const result = await this.geminiClient.generateContent(inputText.inputText);

    this.LOGGER.log(
      `Traduzindo com IA: "${inputText.inputText}" -> Resultado: "${result}"`,
    );

    return result;
  }

  async translateWithCode(inputText: TranslateDto) {
    const acento = '[áéíóúâêôãõüöäëï]';
    const vogal = '[áéíóúâêôãõàèaeiouüöäëï]';
    const consoante = '[bcçdfghjklmñnpqrstvwyxz]';

    const syl = {
      20: ' -.!?:;',
      10: 'bçdfgjkpqtv',
      8: 'sc',
      7: 'm',
      6: 'lzx',
      5: 'nr',
      4: 'h',
      3: 'wy',
      2: 'eaoáéíóúôâêûàãõäëïöü',
      1: 'iu',
      breakpair:
        'sl|sm|sn|sc|sr|rn|bc|lr|lz|bd|bj|bg|bq|bt|bv|pt|pc|dj|pç|ln|nr|mn|tp|bf|bp|xc|sç|ss|rr',
    };

    const spri = {};

    Object.keys(syl)
      .filter((pri) => RegExp(/\d/).exec(pri))
      .forEach((pri) => {
        for (const x of syl[pri].split('')) {
          spri[x] = Number(pri);
        }
      });

    const sylseppair = syl.breakpair.replace(
      /(\p{L})(\p{L})/gu,
      '(?<=($1))(?=($2))',
    );

    const sylSep = '|';
    const punctuation = {};
    let word = inputText.inputText;
    word = word.replace(/(\p{P})/gu, (match, p1, offset) => {
      punctuation[offset] = p1;
      return '';
    });
    word = word
      .replace(new RegExp(sylseppair, 'g'), '|')
      .replace(/(\p{L})(?=(\p{L})(\p{L}))/gu, (m, m1, m2, m3) =>
        spri[m1.toLowerCase()] < spri[m2.toLowerCase()] &&
        spri[m2.toLowerCase()] >= spri[m3.toLowerCase()]
          ? m1 + '|'
          : m1,
      )
      .replace(
        new RegExp('(' + vogal + ')(' + consoante + ')(' + vogal + ')', 'ig'),
        '$1|$2$3',
      )
      .replace(/(de)(us)/gi, '$1|$2')
      .replace(/([a])(i[ru])$/i, '$1|$2')
      .replace(/(?<!^h)([ioeê])([e])/gi, '$1|$2')
      .replace(/([ioeêé])([ao])/gi, '$1|$2')
      .replace(/([^qg]u)(ai|ou|a)/i, '$1|$2')
      .replace(
        new RegExp('([^qgc]u)(i|ei|iu|ir|' + acento + '|e)', 'i'),
        '$1|$2',
      )
      .replace(/([lpt]u)\|(i)(?=\|[ao])/gi, '$1$2')
      .replace(/([^q]u)(o)/i, '$1|$2')
      .replace(new RegExp('([aeio])(' + acento + ')', 'i'), '$1|$2')
      .replace(new RegExp('([íúô])(' + vogal + ')', 'i'), '$1|$2')
      .replace(/^a(o|e)/i, 'a|$1')
      .replace(/rein/gi, 're|in')
      .replace(/ae/gi, 'a|e')
      .replace(/ain/gi, 'a|in')
      .replace(/ao(?!s)/gi, 'a|o')
      .replace(/cue/gi, 'cu|e')
      .replace(/cui(?=\|[mnr])/gi, 'cu|i')
      .replace(/cui(?=\|da\|de$)/gi, 'cu|i')
      .replace(/coi(?=[mn])/gi, 'co|i')
      .replace(/cai(?=\|?[mnd])/gi, 'ca|i')
      .replace(new RegExp('ca\\|i(?=\\|?[m]' + acento + ')', 'ig'), 'cai')
      .replace(/cu([áó])/gi, 'cu|$1')
      .replace(/ai(?=\|?[z])/gi, 'a|i')
      .replace(/i(u\|?)n/gi, 'i|$1n')
      .replace(/i(u\|?)r/gi, 'i|$1r')
      .replace(/i(u\|?)v/gi, 'i|$1v')
      .replace(/i(u\|?)l/gi, 'i|$1l')
      .replace(/ium/gi, 'i|um')
      .replace(/([ta])iu/gi, '$1i|u')
      .replace(/miu\|d/gi, 'mi|u|d')
      .replace(/au\|to(?=i)/gi, 'au|to|')
      .replace(new RegExp('(?<=' + vogal + ')i\\|nh(?=[ao])', 'ig'), '|i|nh')
      .replace(/oi([mn])/gi, 'o|i$1')
      .replace(/oi\|b/gi, 'o|i|b')
      .replace(/ois(?!$)/gi, 'o|is')
      .replace(new RegExp('o(i\\|?)s(?=' + acento + ')', 'ig'), 'o|$1s')
      .replace(/([dtm])aoi/gi, '$1a|o|i')
      .replace(/(?<=[trm])u\|i(?=\|?[tvb][oa])/gi, 'ui')
      .replace(/^gas\|tro(?!-)/gi, 'gas|tro|')
      .replace(/^fais/gi, 'fa|is')
      .replace(/^hie/gi, 'hi|e')
      .replace(/^ciu/gi, 'ci|u')
      .replace(/(?<=^al\|ca)\|i/gi, 'i')
      .replace(/(?<=^an\|ti)(p)\|?/gi, '|$1')
      .replace(/(?<=^an\|ti)(\-p)\|?/gi, '$1')
      .replace(/(?<=^neu\|ro)p\|/gi, '|p')
      .replace(/(?<=^pa\|ra)p\|/gi, '|p')
      .replace(/(?<=^ne\|)op\|/gi, 'o|p')
      .replace(/^re(?=[i]\|?[md])/gi, 're|')
      .replace(/^re(?=i\|n[ií]\|c)/gi, 're|')
      .replace(/^re(?=i\|nau\|g)/gi, 're|')
      .replace(/^re(?=[u]\|?[ntsr])/gi, 're|')
      .replace(new RegExp('^vi\\|de\\|o(' + vogal + ')', 'ig'), 'o|$1')
      .replace(/s\|s$/i, 'ss')
      .replace(/\|\|/g, '\|');

    const words = word.split(' ');
    const processedWords = words.map((w) => {
      const syllables = sylSep === '|' ? w.split('|') : w.split(/\|/g);
      return syllables.toReversed().join('');
    });

    let result = processedWords.join(' ');
    for (const [index, value] of Object.entries(punctuation)) {
      result =
        result.slice(0, Number(index)) + value + result.slice(Number(index));
    }

    this.LOGGER.log(
      `Traduzindo com código: "${inputText.inputText}" -> Resultado: "${result}"`,
    );

    return result;
  }
}

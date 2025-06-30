import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { environment } from 'src/configs/environment';
import { GEMINI_CLIENT_OPTIONS } from 'src/configs/gemini-client.config';

@Injectable()
export class GeminiClientService {
  private readonly LOGGER = new Logger(GeminiClientService.name);
  private readonly ai = new GoogleGenAI({
    apiKey: environment.GEMINI.API_KEY,
  });

  private async fetchResponse(
    model: string,
    config: any,
    contents: any[],
  ): Promise<string> {
    const response = await this.ai.models.generateContent({
      model,
      config,
      contents,
    });

    return String(response.candidates?.[0]?.content?.parts?.[0]?.text);
  }

  public async generateContent(inputText: string): Promise<string> {
    const config = {
      ...GEMINI_CLIENT_OPTIONS,
    };

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: 'O bolo é gostoso',
          },
        ],
      },
      {
        role: 'model',
        parts: [
          {
            text: 'O lobo é sotogos',
          },
        ],
      },
      {
        role: 'user',
        parts: [
          {
            text: 'Testando a habilidade do gemini de falar a língua do TTK',
          },
        ],
      },
      {
        role: 'model',
        parts: [
          {
            text: 'dotanTes a dedalibiha do nimige de larfa a gualín do TTK',
          },
        ],
      },
      {
        role: 'user',
        parts: [
          {
            text: 'A polícia chegou rápido nas pessoas',
          },
        ],
      },
      {
        role: 'model',
        parts: [
          {
            text: 'A acilípo gouche dopirá nas assopes',
          },
        ],
      },
      {
        role: 'user',
        parts: [
          {
            text: 'Eu sou um tradutor quase perfeito da língua do TTK e as vezes cometo erros',
          },
        ],
      },
      {
        role: 'model',
        parts: [
          {
            text: 'Eu sou um tordutra sequa tofeiper da gualín do TTK e as zesve tomeco roser',
          },
        ],
      },
      {
        role: 'user',
        parts: [
          {
            text: inputText,
          },
        ],
      },
    ];

    try {
      const response = await this.fetchResponse(
        environment.GEMINI.MODEL_NAME,
        config,
        contents,
      );

      return response;
    } catch (error) {
      this.LOGGER.error(
        'Erro gerando conteúdo, tentando com outro modelo...',
        error,
      );

      try {
        const response = await this.fetchResponse(
          environment.GEMINI.MODEL_NAME2,
          config,
          contents,
        );

        return response;
      } catch (error) {
        this.LOGGER.error(
          'Erro gerando conteúdo, tentando com outro modelo...',
          error,
        );
        throw new Error(
          'Erro ao gerar conteúdo com todos os modelos disponíveis.',
        );
      }
    }
  }
}

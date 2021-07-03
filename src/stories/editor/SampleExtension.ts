import {
  PlainExtension,
  InputRule,
  plainInputRule,
  ExtensionCommandReturn,
  CommandFunction,
} from 'remirror/core';

export class SampleExtension extends PlainExtension {
  get name(): string {
    return 'sample';
  }

  createInputRules(): InputRule[] {
    return [
      plainInputRule({
        regexp: /:([\w-]+):$/,
        transformMatch: ([full, partial]) => {
          const emoji = getEmojiFromEmoticon(partial);
          return emoji ? full.replace(partial, emoji) : null;
        }
      })
    ];
  }

  createCommands(): ExtensionCommandReturn {
    const commands = {
      insertEmojiByName: (name: string): CommandFunction => (paramegter) => {
        const emoji = getEmojiFromEmoticon()
      }
    }
  }

}

function getEmojiFromEmoticon(str: string): string | null {
  return 'EMOJI';
}

import React, {FC, useCallback, useMemo, useState,} from "react";
import {RemirrorProvider, useRemirror} from 'remirror/react';
import {SocialPreset} from 'remirror/preset/social';
import {I18nProvider, ThemeProvider} from '@remirror/react';
import type {MentionChangeParameter, SocialProviderProps} from 'remirror/react/social';
import {SocialEditor, SocialEmojiComponent, SocialMentionComponent, useSocialManager} from 'remirror/react/social';
import './Editor.scss'
import 'remirror/styles/all.css';
import {styled} from 'linaria/react';
import {UseMentionProps} from '@remirror/react-hooks/use-mention';

export const Editor: React.FC<EditorProps> = (prop) => {
  const [mention, setMention] = useState({query: '', name: ''});
  const onMentionChange = useCallback((parameter) => {
    setMention(parameter);
  }, []);
  const onExit = useCallback(({query}, command) => {
    command({href: `${query.full}`});
  }, []);
  const items = useMemo(() => {
    if (mention && mention.name === 'at' && mention.query) {
      return prop.users
        .filter((user) => user.username.toLowerCase().includes(mention.query.toLowerCase()))
        .map((user) => ({...user, label: user.displayName}));
    }

    if (mention && mention.name === 'tag' && mention.query) {
      return prop.tags
        .filter((tag) => tag.tag.toLowerCase().includes(mention.query.toLowerCase()))
        .map((tag) => ({...tag, label: tag.tag}))
    }
    return [];
  }, [mention]);

  return (
    <SocialEditor
      placeholder='Start typing here'
      autoFocus={false}
      items={items}
      onMentionChange={onMentionChange}
      onExit={onExit}
    />
  )
}

export interface EditorProps {
  users: User[];
  tags: TagData[];
}

export interface User {
  avatarUrl: string;
  displayName: string;
  username: string;
  href: string;
  id: string;
}

export interface TagData {
  tag: string;
  href: string;
  id: string;
}

export const EditorProvider: FC<SocialProviderProps> = (props) => {
  const {
    theme,
    ThemeComponent,
    children,
    i18n,
    locale,
    characterLimit,
    combined,
    manager,
    settings,
    ...rest
  } = props;
  const socialManager = useSocialManager(manager ?? combined ?? [], settings);

  // Check that the social manager includes the required SocialPreset
  socialManager.getPreset(SocialPreset);

  return (
    <I18nProvider i18n={i18n} locale={locale}>
      <RemirrorProvider {...rest} manager={socialManager}>
        <ThemeProvider theme={theme ?? {}} as={ThemeComponent}>
          {children}
        </ThemeProvider>
      </RemirrorProvider>
    </I18nProvider>
  );
};

interface SocialMentionComponentProps extends UseMentionProps {
  onMentionChange?: (parameter: MentionChangeParameter | null) => void;
}

export interface SocialEditorProps
  extends Partial<SocialProviderProps>,
    SocialMentionComponentProps {}

/**
 * A prebuilt `SocialEditor` which combines the building blocks for you to
 * create an editor with minimal lines of code.
 */
export const MyEditor: FC<SocialEditorProps> = (props: SocialEditorProps) => {
  const {
    children,
    items,
    onExit,
    ignoreMatchesOnEscape,
    onMentionChange,
    ...providerProps
  } = props;

  console.log(items);

  return (
    <EditorProvider {...providerProps}>
      <SocialEditorContainerComponent data-testid='my-editor'>
        <TxtEditor />
        <SocialEmojiComponent />
        {children}
      </SocialEditorContainerComponent>
      <SocialMentionComponent
        items={items}
        onExit={onExit}
        ignoreMatchesOnEscape={ignoreMatchesOnEscape}
        onMentionChange={onMentionChange}
      />
    </EditorProvider>
  );
};

/**
 * The editing functionality within the Social Editor context.
 */
const TxtEditor = () => {
  const { getRootProps } = useRemirror();

  return <SocialEditorComponent className={'shadow-center-2'} {...getRootProps()} />;
};

/**
 * The component into which the prosemirror editor will be injected into.
 */
export const SocialEditorComponent = styled.div`
  .ProseMirror {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    box-sizing: border-box;
    position: relative;
    border-width: 1px;
    border-style: solid;
    border-color: #99cfeb;
    box-shadow: 0 0 0 1px #99cfeb;
    line-height: 1.625rem;
    border-radius: 8px;
    width: 100%;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 16px;
    max-height: calc(90vh - 124px);
    min-height: 142px;
    padding: 8px;
    padding-right: 40px;
    p {
      margin: 0px;
      letter-spacing: 0.6px;
      color: text;
    }
    a.mention {
      pointer-events: none;
      cursor: default;
    }
    a {
      text-decoration: none !important;
      color: #1da1f2;
    }
    &:focus {
      outline: none;
      box-shadow: focus;
    }
    .Prosemirror-selectednode {
      background-color: grey;
    }
  }
`;

const SocialEditorContainerComponent = styled.div`
  position: relative;
  height: 100%;
`;

import { TemplateRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import type {
  Attachment,
  Channel,
  ChannelMemberResponse,
  CommandResponse,
  Event,
  ExtendableGenerics,
  FormatMessageResponse,
  LiteralStringForUnion,
  MessageResponseBase,
  Mute,
  ReactionResponse,
  User,
  UserResponse,
} from 'stream-chat';
import { Icon } from './icon/icon.component';

export type UnknownType = Record<string, unknown>;

export type CustomTrigger = {
  [key: string]: {
    componentProps: UnknownType;
    data: UnknownType;
  };
};

export type DefaultStreamChatGenerics = ExtendableGenerics & {
  attachmentType: DefaultAttachmentType;
  channelType: DefaultChannelType;
  commandType: LiteralStringForUnion;
  eventType: UnknownType;
  messageType: DefaultMessageType;
  reactionType: UnknownType;
  userType: DefaultUserType;
};

export type DefaultAttachmentType = UnknownType & {
  asset_url?: string;
  id?: string;
  images?: Array<Attachment<DefaultStreamChatGenerics>>;
  mime_type?: string;
};

export type DefaultChannelType = UnknownType & {
  image?: string;
  member_count?: number;
  subtitle?: string;
};

export type DefaultCommandType = LiteralStringForUnion;

export type DefaultMessageType = UnknownType & {
  customType?: 'channel.intro' | 'message.date';
  date?: string | Date;
  errorStatusCode?: number;
  event?: Event<DefaultStreamChatGenerics>;
  unread?: boolean;
  readBy: UserResponse<DefaultStreamChatGenerics>[];
  translation?: string;
  quoted_message?: MessageResponseBase<DefaultStreamChatGenerics>;
};

export type DefaultUserTypeInternal = {
  image?: string;
  status?: string;
};

export type DefaultUserType = UnknownType &
  DefaultUserTypeInternal & {
    mutes?: Array<Mute<DefaultStreamChatGenerics>>;
  };

export type StreamMessage<
  T extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
> = FormatMessageResponse<T>;

export type AttachmentUpload = {
  file: File;
  state: 'error' | 'success' | 'uploading';
  url?: string;
  type: 'image' | 'file' | 'video';
  previewUri?: string | ArrayBuffer;
  thumb_url?: string;
};

export type MentionAutcompleteListItemContext = {
  item: MentionAutcompleteListItem;
};

export type CommandAutocompleteListItemContext = {
  item: ComandAutocompleteListItem;
};

export type MentionAutcompleteListItem = (
  | ChannelMemberResponse
  | UserResponse
) & {
  autocompleteLabel: string;
};

export type ComandAutocompleteListItem = CommandResponse & {
  autocompleteLabel: string;
};

export type NotificationType = 'success' | 'error' | 'info';

export type NotificationPayload<T = {}> = {
  id: string;
  type: NotificationType;
  text?: string;
  translateParams?: Object;
  template?: TemplateRef<T>;
  templateContext?: T;
  dismissFn: Function;
};

export type ChannelPreviewContext<
  T extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
> = {
  channel: Channel<T>;
};

export type MessageInputContext = {
  isFileUploadEnabled: boolean | undefined;
  areMentionsEnabled: boolean | undefined;
  mentionScope: 'channel' | 'application' | undefined;
  mode: 'thread' | 'main' | undefined;
  isMultipleFileUploadEnabled: boolean | undefined;
  message: StreamMessage | undefined;
  messageUpdateHandler: Function | undefined;
  sendMessage$: Observable<void>;
};

export type MentionTemplateContext = {
  content: string;
  user: UserResponse;
};

export type EmojiPickerContext = {
  emojiInput$: Subject<string>;
};

export type TypingIndicatorContext = {
  usersTyping$: Observable<UserResponse<DefaultStreamChatGenerics>[]>;
};

export type MessageContext = {
  message: StreamMessage | undefined;
  enabledMessageActions: string[];
  isLastSentMessage: boolean | undefined;
  mode: 'thread' | 'main';
  isHighlighted: boolean;
};

export type ChannelActionsContext<
  T extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
> = { channel: Channel<T> };

export type AttachmentListContext = {
  messageId: string;
  attachments: Attachment<DefaultStreamChatGenerics>[];
  parentMessageId?: string;
  imageModalStateChangeHandler?: (state: 'opened' | 'closed') => {};
};

export type AvatarType = 'channel' | 'user';

export type AvatarLocation =
  | 'channel-preview'
  | 'channel-header'
  | 'message-sender'
  | 'message-reader'
  | 'quoted-message-sender'
  | 'autocomplete-item'
  | 'typing-indicator'
  | 'reaction';

export type AvatarContext = {
  name: string | undefined;
  imageUrl: string | undefined;
  size: number | undefined;
  type: AvatarType | undefined;
  location: AvatarLocation | undefined;
  channel?: Channel<DefaultStreamChatGenerics>;
  user?: User<DefaultStreamChatGenerics>;
};

export type AttachmentPreviewListContext = {
  attachmentUploads$: Observable<AttachmentUpload[]> | undefined;
  retryUploadHandler: (f: File) => any;
  deleteUploadHandler: (u: AttachmentUpload) => any;
};

export type IconContext = {
  icon: Icon | undefined;
  size: number | undefined;
};

export type LoadingIndicatorContext = {
  size: number | undefined;
  color: string | undefined;
};

export type MessageActionsBoxContext = {
  isOpen: boolean;
  isMine: boolean;
  message: StreamMessage | undefined;
  enabledActions: string[];
  displayedActionsCountChaneHanler: (count: number) => any;
  isEditingChangeHandler: (isEditing: boolean) => any;
};

export type MessageActionBoxItemContext = {
  actionName: 'quote' | 'pin' | 'flag' | 'edit' | 'delete';
  actionLabelOrTranslationKey: (() => string) | string;
  actionHandler: () => any;
};

export type MessageActionItem = {
  actionName: 'quote' | 'pin' | 'flag' | 'edit' | 'delete';
  actionLabelOrTranslationKey: (() => string) | string;
  isVisible: (
    enabledActions: string[],
    isMine: boolean,
    message: StreamMessage
  ) => boolean;
  actionHandler: (message: StreamMessage, isMine: boolean) => any;
};

export type MessageReactionsContext = {
  messageId: string | undefined;
  messageReactionCounts: { [key in MessageReactionType]?: number };
  isSelectorOpen: boolean;
  latestReactions: ReactionResponse<DefaultStreamChatGenerics>[];
  ownReactions: ReactionResponse<DefaultStreamChatGenerics>[];
  isSelectorOpenChangeHandler: (isOpen: boolean) => any;
};

export type ModalContext = {
  isOpen: boolean;
  isOpenChangeHandler: (isOpen: boolean) => any;
  content: TemplateRef<void>;
};

export type NotificationContext = {
  type: NotificationType | undefined;
  content: TemplateRef<void> | undefined;
};

export type ThreadHeaderContext = {
  parentMessage: StreamMessage | undefined;
  closeThreadHandler: Function;
};

export type MessageReactionType =
  | 'angry'
  | 'haha'
  | 'like'
  | 'love'
  | 'sad'
  | 'wow';

export type AttachmentConfigration = {
  url: string;
  height: string;
  width: string;
};

export type ImageAttachmentConfiguration = AttachmentConfigration & {
  originalHeight: number;
  originalWidth: number;
};

export type VideoAttachmentConfiguration = ImageAttachmentConfiguration & {
  thumbUrl?: string;
};

export type DeliveredStatusContext = {
  message: StreamMessage;
};

export type SendingStatusContext = {
  message: StreamMessage;
};

export type ReadStatusContext = {
  message: StreamMessage;
  readByText: string;
};

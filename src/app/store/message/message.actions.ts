import {createAction, props} from '@ngrx/store';
import {PlayerMessage} from '../../shared/player-message';
import {SystemMessage} from '../../shared/system-message';
import {Message} from '../../shared/message';
// import {socketMessageEvents} from '../../shared/constants';

export const listPreviousMessages = createAction(
  '[Message] List Previous Messages',
  props<{messages: Message[]}>())

export const playerMessageCommand = createAction('[Message] Player Message Command', props<{
  payload: PlayerMessage,
}>());

export const playerMessageEvent = createAction('[Message] Player Message Event', props<{
  payload: PlayerMessage,
}>());

export const playerMessageApprovedByHostCommand = createAction('[Message] playerMessageApprovedByHostCommand', props<{
  payload: PlayerMessage,
}>());

export const playerMessageApprovedByHostEvent = createAction('[Message] playerMessageApprovedByHostEvent', props<{
  payload: PlayerMessage,
}>());

export const playerMessageDisapprovedByHostCommand = createAction('[Message] playerMessageDisapprovedByHostCommand', props<{
  payload: PlayerMessage,
}>());

export const playerMessageDisapprovedByHostEvent = createAction('[Message] playerMessageDisapprovedByHostEvent', props<{
  payload: PlayerMessage,
}>());

export const publishPendingMessagesCommand = createAction('[Message] publishPendingMessagesCommand', props<{
  payload: PlayerMessage,
}>());

export const publishPendingMessagesEvent = createAction('[Message] publishPendingMessagesEvent', props<{
  payload: PlayerMessage[],
}>());

export const systemMessagedEvent = createAction('[Message] System Message Event', props<{ payload: SystemMessage }>());

export const systemMessageApprovedByHostCommand = createAction('[Message] systemMessageApprovedByHostCommand', props<{
  payload: SystemMessage,
}>());

export const systemMessageApprovedByHostEvent = createAction('[Message] systemMessageApprovedByHostEvent', props<{
  payload: SystemMessage,
}>());

export const systemMessageDisapprovedByHostCommand = createAction('[Message] systemMessageDisapprovedByHostCommand', props<{
  payload: SystemMessage,
}>());

export const systemMessageDisapprovedByHostEvent = createAction('[Message] systemMessageDisapprovedByHostEvent', props<{
  payload: SystemMessage,
}>());

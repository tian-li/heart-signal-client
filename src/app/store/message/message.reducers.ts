import {createEntityAdapter, EntityAdapter, EntityState, Update} from '@ngrx/entity';
import {Action, createReducer, on} from '@ngrx/store';
import {
  listPreviousMessages,
  playerMessageApprovedByHostCommand,
  playerMessageApprovedByHostEvent,
  playerMessageCommand,
  playerMessageDisapprovedByHostCommand,
  playerMessageDisapprovedByHostEvent,
  playerMessageEvent,
  publishPendingMessagesEvent,
  systemMessageApprovedByHostCommand,
  systemMessagedEvent,
} from './message.actions';
import {Message} from '../../shared/message';

export const messageFeatureKey = 'message';

export interface State extends EntityState<Message> {
  selectedMessageId: number;
}

export const adapter: EntityAdapter<Message> = createEntityAdapter<Message>({
  selectId: (message: Message) => message.id,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  selectedMessageId: null,
});

const reducer = createReducer(
  initialState,
  on(listPreviousMessages, (state, {messages}) => {
    return adapter.setAll(messages, state);
  }),
  on(playerMessageCommand, playerMessageEvent, (state, {payload}) => {
    return adapter.upsertOne(payload, state);
  }),
  on(
    playerMessageApprovedByHostCommand,
    playerMessageApprovedByHostEvent,
    (state, {payload}) => {
      const updates: Update<Message> = {
        id: payload.id,
        changes: {...payload, approvalStatus: 'approved', published: false}
      };

      return adapter.updateOne(updates, state);
    }),

  on(playerMessageDisapprovedByHostCommand, playerMessageDisapprovedByHostEvent, (state, {payload}) => {
    const updates: Update<Message> = {
      id: payload.id,
      changes: {...payload, approvalStatus: 'disapproved', published: false}
    };

    return adapter.updateOne(updates, state);
  }),

  on(publishPendingMessagesEvent, (state, {payload}) => {
    return adapter.upsertMany(payload, state);
  }),

  on(systemMessagedEvent, (state, {payload}) => {
    return adapter.upsertOne(payload, state);
  }),

  on(systemMessageApprovedByHostCommand,
    (state, {payload}) => {
      const updates: Update<Message> = {
        id: payload.id,
        changes: {...payload, approvalStatus: 'approved'}
      };

      return adapter.updateOne(updates, state);
    }),
);

export function messageReducer(
  state: State | undefined,
  action: Action
): State {
  return reducer(state, action);
}

export const getSelectedMessageId = (state: State) => state.selectedMessageId;


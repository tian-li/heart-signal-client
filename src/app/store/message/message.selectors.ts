import {createFeatureSelector, createSelector} from '@ngrx/store';
import {RootState} from '../index';
import * as fromMessage from './message.reducers';
import {Message} from '../../shared/message';

const selectMessageState = createFeatureSelector<RootState, fromMessage.State>(
  fromMessage.messageFeatureKey
);

export const selectSelectedMessageId = createSelector(
  selectMessageState,
  fromMessage.getSelectedMessageId
);

export const {
  selectIds: selectMessageIds,
  selectEntities: selectMessageEntities,
  selectAll: selectAllMessages,
  selectTotal: selectMessageTotal,
} = fromMessage.adapter.getSelectors(selectMessageState);

export const selectAllMessagesByTime = createSelector(
  selectAllMessages,
  (messages: Message[]) => {
    return messages.sort((a, b) => a.timestamp - b.timestamp);
  }
);

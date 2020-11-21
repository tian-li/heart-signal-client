import {InjectionToken} from '@angular/core';
import * as fromMessage from './message';
import {Action, ActionReducer, ActionReducerMap, MetaReducer,} from '@ngrx/store';
import {environment} from '../../environments/environment';

export {
  fromMessage,
};

export interface RootState {
  [fromMessage.messageFeatureKey]: fromMessage.State;
}

export const ROOT_REDUCERS = new InjectionToken<ActionReducerMap<RootState, Action>>('Root reducers token', {
  factory: () => ({
    [fromMessage.messageFeatureKey]: fromMessage.messageReducer,
  }),
});

export function logger(reducer: ActionReducer<RootState>): ActionReducer<RootState> {
  return (state, action) => {
    const result = reducer(state, action);
    console.groupCollapsed(action.type);
    // console.log('prev state', state);
    // console.log('action', action);
    // console.log('next state', result);
    console.groupEnd();

    return result;
  };
}

export const metaReducers: MetaReducer<RootState>[] = !environment.production
  ? [logger]
  : [];

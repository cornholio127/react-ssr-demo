import React, { useEffect, useContext, useState, useRef } from 'react';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';

const isSsr: () => boolean = () => !(typeof window !== 'undefined' && window.document != undefined && window.document.createElement != undefined);

export const useEffectSsr: (effect: React.EffectCallback, deps?: any[]) => void = (effect, deps) => {
  if (isSsr()) {
    effect();
  } else {
    useEffect(effect, deps);
  }
};

export interface SsrContextValue {
  dataFetched: boolean;
  promises: Promise<any>[];
  state: any[];
}

export const SsrContext = React.createContext({} as SsrContextValue);

export const useDispatchSsr: () => Dispatch = () => {
  const dispatch = useDispatch();
  if (isSsr()) {
    const ssrContext = useContext(SsrContext);
    if (ssrContext.dataFetched === false) {
      return <T>(action: T) => {
        const result: any = dispatch(action);
        if (typeof result.then === 'function') {
          ssrContext.promises.push(result);
        }
        return result;
      };
    } 
  }
  return dispatch;
};

const preloadedComponentState = () => (window as any).__PRELOADED_COMPONENT_STATE__ as any[];

export const useFetchedStateSsr: <T> (initialState: T, asyncFetch: (params: any) => Promise<T>, params: any[]) => [T, (newState: T) => void] = (initialState, asyncFetch, params) => {
  const [state, setState] = useState(initialState);
  if (isSsr()) {
    const ssrContext = useContext(SsrContext);
    if (ssrContext.dataFetched === false) {
      // 1st pass
      const promise = asyncFetch.apply(undefined, params) as Promise<any>;
      const index = ssrContext.promises.length;
      ssrContext.promises.push(promise);
      promise.then(dto => ssrContext.state[index] = dto);
      return [state, setState];
    } else {
      // 2nd pass
      const s = ssrContext.state[0];
      ssrContext.state = ssrContext.state.slice(1);
      return [s, setState];
    }
  } else {
    const didMountRef = useRef(false);
    const didHavePreloadedState = useRef(false);
    useEffect(
      () => {
        if (!didHavePreloadedState.current || didMountRef.current) {
          (asyncFetch.apply(undefined, params) as Promise<any>).then(setState);
        } else {
          didMountRef.current = true;
        }
      }, 
      params,
    );
    if (preloadedComponentState().length > 0) {
      didHavePreloadedState.current = true;
      const s = preloadedComponentState()[0];
      (window as any).__PRELOADED_COMPONENT_STATE__ = preloadedComponentState().slice(1);
      return [s, setState];
    } else {
      return [state, setState];
    }
  }
};

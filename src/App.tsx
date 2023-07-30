import React from 'react';
import { VIEW_MODEL_CONTEXT, ViewModel } from './View/ViewModel';
import { BaseView } from './View/View';

export function App() {
  const vm = ViewModel.Instance;
  return (
    <VIEW_MODEL_CONTEXT.Provider value={vm}>
      <BaseView />
    </VIEW_MODEL_CONTEXT.Provider>
  );
}

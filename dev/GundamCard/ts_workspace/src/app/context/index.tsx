import React, { useCallback, useEffect } from "react";
import Resct, { useState, createContext, PropsWithChildren } from "react";
import * as firebase from "../../tool/firebase";
import { DEFAULT_VIEW_MODEL, OnViewModel, ViewModel } from "./OnViewModel";
import { OnEvent } from "../../tool/eventCenter";

export type AppContext = {
  viewModel: ViewModel;
};

export const AppContext = createContext<AppContext | null>(null);

export const AppContextProvider = (props: PropsWithChildren<any>) => {
  const [viewModel, setViewModel] = useState<ViewModel>(DEFAULT_VIEW_MODEL);
  useEffect(() => {
    const subscriber = OnViewModel.subscribe(setViewModel);
    return () => {
      subscriber.unsubscribe();
    };
  }, []);

  useEffect(() => {
    firebase.sync(viewModel.model);
  }, [viewModel.model]);

  useEffect(() => {
    return firebase.addListener((err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      if (data == null) {
        return;
      }
      OnEvent.next({ id: "OnModelFromFirebase", model: data });
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        viewModel,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

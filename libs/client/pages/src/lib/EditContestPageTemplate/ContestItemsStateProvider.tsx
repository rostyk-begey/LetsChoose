import React, { createContext, Reducer, useCallback, useReducer } from 'react';

export interface BaseItem {
  title: string;
  image: File;
}

export type ItemId = number;

export interface Item extends BaseItem {
  id: ItemId;
}

export interface UseItemsUploadValue {
  items: Item[];
  editedItem: ItemId;
  selectedItems: ItemId[];
  addFiles: (files: File[]) => void;
  deleteItem: (index: number) => void;
  deleteSelectedItems: () => void;
  toggleSelectItem: (index: number) => void;
  toggleEditItem: (i: number) => void;
  updateItem: (i: number, title: string) => void;
  toggleSelectAll: () => void;
}

export interface UseItemsStateValue {
  items: Item[];
  editedItem: null | ItemId;
  selectedItems: ItemId[];
  addFiles: (files: File[]) => void;
  deleteItem: (id: ItemId) => void;
  deleteSelectedItems: () => void;
  toggleSelectItem: (id: ItemId) => void;
  toggleEditedItem: (id: ItemId) => void;
  updateItem: (id: ItemId, title: string) => void;
  toggleSelectAll: () => void;
  swapIds: (id1: ItemId, id2: ItemId) => void;
}

interface ItemsState {
  ids: ItemId[];
  selected: ItemId[];
  edited: null | ItemId;
  entities: Record<ItemId, Item>;
}

enum ActionTypes {
  AddItems,
  RemoveItem,
  UpdateItem,
  DeleteSelectedItems,
  ToggleSelectAll,
  ToggleSelectedItem,
  ToggleEditedItem,
  SwapIds,
}

interface Action<T = any> {
  type: ActionTypes;
  payload: T;
}

const initialItemsState: ItemsState = {
  ids: [],
  edited: null,
  selected: [],
  entities: {},
};

const addItemsReducer: Reducer<ItemsState, Action<Item[]>> = (
  state,
  action,
) => {
  const { payload: items } = action as Action<Item[]>;
  const ids = items.map(({ id }) => id);
  const entities = items.reduce(
    (acc, item) => ({
      ...acc,
      [item.id]: item,
    }),
    state.entities,
  );

  return { ...state, ids: [...state.ids, ...ids], entities } as ItemsState;
};

const updateItemReducer: Reducer<
  ItemsState,
  Action<{ id: ItemId; title: string }>
> = (state, action) => {
  const {
    payload: { id, title },
  } = action;

  return {
    ...state,
    entities: {
      ...state.entities,
      [id]: {
        ...state.entities[id],
        title,
      },
    },
  } as ItemsState;
};

const swapIdsReducer: Reducer<
  ItemsState,
  Action<{ id1: ItemId; id2: ItemId }>
> = (state, action) => {
  const { ids } = state;
  const {
    payload: { id1, id2 },
  } = action;

  if (id1 === id2 || !ids.includes(id1) || !ids.includes(id2)) return state;

  const newIds = [...ids];
  const id1Idx = newIds.indexOf(id1);
  const id2Idx = newIds.indexOf(id2);
  [newIds[id1Idx], newIds[id2Idx]] = [newIds[id2Idx], newIds[id1Idx]];

  return {
    ...state,
    ids: newIds,
  };
};

const removeItemReducer: Reducer<ItemsState, Action<{ id: ItemId }>> = (
  state,
  action,
) => {
  const { entities, edited } = state;
  const {
    payload: { id },
  } = action;

  if (!(id in entities)) return state;

  const ids = state.ids.filter((_id) => _id !== id);
  const selected = state.selected.filter((_id) => _id !== id);
  delete entities[id];

  return {
    ...state,
    ids,
    selected,
    entities,
    edited: edited === id ? null : edited,
  };
};

const deleteSelectedItems: Reducer<ItemsState, Action<unknown>> = (state) => {
  const { selected, entities } = state;

  const ids = state.ids.filter((_id) => {
    if (selected.includes(_id)) {
      delete entities[_id];
      return false;
    }
    return true;
  });

  return { ...state, ids, entities, selected: [] };
};

const toggleSelectAllReducer: Reducer<ItemsState, Action<unknown>> = (
  state,
) => {
  const { selected } = state;

  return {
    ...state,
    selected: selected.length < state.ids.length ? state.ids : [],
  };
};

const toggleSelectedItemReducer: Reducer<ItemsState, Action<{ id: ItemId }>> = (
  state,
  { payload: { id } },
) => {
  const { ids, selected } = state;
  const selectedSet = new Set(selected);
  if (selectedSet.has(id)) {
    selectedSet.delete(id);
  } else {
    selectedSet.add(id);
  }
  return { ...state, ids, selected: [...selectedSet] };
};

const toggleEditedItemReducer: Reducer<ItemsState, Action<{ id: ItemId }>> = (
  state,
  { payload: { id } },
) => {
  const { edited } = state;
  return { ...state, edited: id === edited ? null : id };
};

const itemsRootReducer: Reducer<ItemsState, Action> = (
  state = initialItemsState,
  action,
) => {
  const { [action.type]: handler } = {
    [ActionTypes.AddItems]: addItemsReducer,
    [ActionTypes.RemoveItem]: removeItemReducer,
    [ActionTypes.UpdateItem]: updateItemReducer,
    [ActionTypes.DeleteSelectedItems]: deleteSelectedItems,
    [ActionTypes.ToggleSelectAll]: toggleSelectAllReducer,
    [ActionTypes.ToggleSelectedItem]: toggleSelectedItemReducer,
    [ActionTypes.ToggleEditedItem]: toggleEditedItemReducer,
    [ActionTypes.SwapIds]: swapIdsReducer,
  } as Record<ActionTypes, Reducer<ItemsState, Action>>;

  return handler ? handler(state, action) : state;
};

export const useItemsState = (): UseItemsStateValue => {
  const [state, dispatch] = useReducer(itemsRootReducer, initialItemsState);

  console.log(state);
  const { ids, selected, entities, edited } = state;

  const addFiles = useCallback(
    (files: File[]) => {
      console.log('@addFiles');
      const items = files.map((file, i) => ({
        title: file.name,
        image: file,
        id: new Date().getTime() + i,
      }));
      dispatch({ type: ActionTypes.AddItems, payload: items });
    },
    [dispatch],
  );

  const deleteItem = useCallback(
    (id: ItemId) => {
      console.log('@deleteItem');
      dispatch({ type: ActionTypes.RemoveItem, payload: { id } });
    },
    [dispatch],
  );

  const swapIds = useCallback(
    (id1: ItemId, id2: ItemId) => {
      console.log('@swapIds');
      dispatch({ type: ActionTypes.SwapIds, payload: { id1, id2 } });
    },
    [dispatch],
  );

  const updateItem = useCallback(
    (id: ItemId, title: string) => {
      console.log('@updateItem');
      dispatch({ type: ActionTypes.UpdateItem, payload: { id, title } });
    },
    [dispatch],
  );

  const toggleSelectAll = useCallback(() => {
    console.log('@toggleSelectAll');
    dispatch({ type: ActionTypes.ToggleSelectAll, payload: null });
  }, [dispatch]);

  const toggleSelectItem = useCallback(
    (id: ItemId) => {
      console.log('@toggleSelectItem');
      dispatch({ type: ActionTypes.ToggleSelectedItem, payload: { id } });
    },
    [dispatch],
  );

  const toggleEditedItem = useCallback(
    (id: ItemId) => {
      console.log('@toggleEditedItem');
      dispatch({ type: ActionTypes.ToggleEditedItem, payload: { id } });
    },
    [dispatch],
  );

  const deleteSelectedItems = useCallback(() => {
    console.log('@deleteSelectedItems');
    dispatch({ type: ActionTypes.DeleteSelectedItems, payload: null });
  }, [dispatch]);

  return {
    items: ids.map((id) => entities[id]),
    selectedItems: selected,
    editedItem: edited,
    addFiles,
    deleteItem,
    deleteSelectedItems,
    toggleSelectAll,
    toggleSelectItem,
    toggleEditedItem,
    updateItem,
    swapIds,
  };
};

export const ItemsStateContext = createContext<UseItemsStateValue>(
  {} as UseItemsStateValue,
);

export const ItemsStateProvider: React.FC = ({ children }) => {
  return (
    <ItemsStateContext.Provider value={useItemsState()}>
      {children}
    </ItemsStateContext.Provider>
  );
};

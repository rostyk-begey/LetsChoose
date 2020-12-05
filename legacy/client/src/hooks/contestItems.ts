import { useState, useCallback } from 'react';

interface IContestItem {
  title: string;
  image: File;
}

const useContestItems = () => {
  const [items, setItems] = useState<IContestItem[]>([]);
  const addItem = useCallback(
    (item: IContestItem) => setItems([...items, item]),
    [items],
  );
  const updateItem = useCallback(
    (index: number, updatedItem: Partial<IContestItem>) =>
      setItems(
        items.map((item, i) =>
          i === index ? { ...item, ...updatedItem } : item,
        ),
      ),
    [items],
  );
  const deleteItem = useCallback(
    (index: number) => setItems(items.filter((_, i) => index !== i)),
    [items],
  );
  return { items, setItems, addItem, deleteItem, updateItem };
};

export default useContestItems;

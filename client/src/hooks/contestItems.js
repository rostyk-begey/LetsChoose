import { useState, useCallback } from 'react';

const useContestItems = () => {
  const [items, setItems] = useState([]);
  const addItem = useCallback((item) => setItems([...items, item]), [items]);
  const updateItem = useCallback(
    (index, updatedItem) =>
      setItems(
        items.map((item, i) =>
          i === index ? { ...item, ...updatedItem } : item,
        ),
      ),
    [items],
  );
  const deleteItem = useCallback(
    (index) => setItems(items.filter((_, i) => index !== i)),
    [items],
  );
  return { items, setItems, addItem, deleteItem, updateItem };
};

export default useContestItems;

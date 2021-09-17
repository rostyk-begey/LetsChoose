import { useCallback, useState } from 'react';

export interface Item {
  title: string;
  image: File;
  id: string;
}

const useItemsUpload = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [editedItem, setEditedItem] = useState<number>(-1);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const addFiles = (files: File[]) => {
    setItems((prevFiles) => [
      ...prevFiles,
      ...files.map((file, i) => ({
        title: file.name,
        image: file,
        id: `${new Date().getTime() + i}`,
      })),
    ]);
  };
  const deleteItem = (index: number) => {
    setItems((files) => {
      files.splice(index, 1);
      return [...files];
    });
  };
  const deleteSelectedItems = useCallback(() => {
    setItems(items.filter((_, i) => !selectedItems.includes(i)));
    setSelectedItems([]);
  }, [items, selectedItems]);
  const toggleSelectItem = (index: number) => {
    setSelectedItems((items) => {
      const set = new Set(items);
      if (set.has(index)) {
        set.delete(index);
      } else {
        set.add(index);
      }
      return [...set];
    });
  };
  const toggleEditItem = (i: number) => {
    setEditedItem((active) => (active === i ? -1 : i));
  };
  const updateItem = (i: number, title: string) => {
    setItems((prevFiles) => {
      prevFiles[i].title = title;
      return [...prevFiles];
    });
  };
  const toggleSelectAll = useCallback(() => {
    if (selectedItems.length === 0) {
      setSelectedItems(items.map((_, i) => i));
    } else {
      setSelectedItems([]);
    }
  }, [items, selectedItems]);

  return {
    items,
    editedItem,
    selectedItems,
    addFiles,
    deleteItem,
    deleteSelectedItems,
    toggleSelectItem,
    toggleEditItem,
    updateItem,
    toggleSelectAll,
  };
};

export default useItemsUpload;

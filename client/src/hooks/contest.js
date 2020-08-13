import { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';

const useContest = (items, onFinish) => {
  if (!items) return [];

  const [currentPair, setCurrentPair] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentRoundItems, setCurrentRoundItems] = useState([]);
  const [nextRoundItems, setNextRoundItems] = useState([]);
  const [scores, setScores] = useState([]);
  const [compares, setCompares] = useState([]);
  const onItemSelect = useCallback(
    (id) => () => {
      setScores([...scores, id]);
      setCompares([...compares, ..._.take(currentRoundItems, 2)]);
      if (currentRoundItems.length > 2) {
        setCurrentRoundItems(_.drop(currentRoundItems, 2));
        setNextRoundItems([...nextRoundItems, id]);
      } else {
        setCurrentRound(currentRound + 1);
        setCurrentRoundItems(nextRoundItems);
        setNextRoundItems([]);
      }
    },
    [scores, currentRound, currentRoundItems, nextRoundItems],
  );
  useEffect(() => {
    if (currentRoundItems.length >= 2) {
      const [left, right] = currentRoundItems; //_.shuffle(currentRoundItems);
      setCurrentPair(
        [left, right].map((id) => ({
          ...items.find((item) => item.id === id),
          onSelect: onItemSelect(id),
        })),
      );
    } else if (scores.length) {
      onFinish({ scores, compares });
    }
  }, [currentRoundItems, scores]);
  useEffect(() => {
    const itemsIds = items.map((item) => item.id);
    setCurrentRoundItems(itemsIds);
    setCurrentRound(1);
  }, [items]);

  return { currentPair, currentRound };
};

export default useContest;

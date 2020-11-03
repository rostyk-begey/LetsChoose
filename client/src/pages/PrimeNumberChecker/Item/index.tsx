import React, { useState, useEffect } from 'react';
// @ts-ignore
import { Button, Badge } from 'tabler-react';
import cn from 'classnames';

import './index.scss';
import api from '../../../providers/apiProvider';
import routes from '../../../utils/routes';

interface Props {
  title: number;
  onDelete: any;
}

interface State {
  isPrime: boolean;
  isCalculating: boolean;
}

const usePrimeCheck = (number: number): State => {
  const [isCalculating, setIsCalculating] = useState(true);
  const [state, setState] = useState({ isPrime: false });
  useEffect(() => {
    api
      .get(routes.API.PRIME_NUMBER_CHECK, { params: { number } })
      .then(({ data }) => {
        console.log(data);
        setState(data as any);
      })
      .finally(() => {
        setIsCalculating(false);
      });
  }, []);
  return {
    isPrime: state.isPrime,
    isCalculating,
  };
};

const Item: React.FC<Props> = ({ title, onDelete }) => {
  const baseClassName = 'created-contest-item';
  const { isPrime, isCalculating } = usePrimeCheck(title);
  const getOption = (
    onCalculating: string,
    onPrime: string,
    onNotPrime: string,
  ) => {
    return isCalculating ? onCalculating : isPrime ? onPrime : onNotPrime;
  };

  return (
    <div className={cn(baseClassName, 'p-3')}>
      <div className="d-flex align-items-center justify-content-between">
        <h5 className="h5 mb-0">{title}</h5>
        <Badge
          className="ml-3 mr-auto"
          color={getOption('warning', 'success', 'danger')}
        >
          {getOption('loading', 'prime', 'not prime')}
        </Badge>
        <Button.List className="d-flex ml-3">
          <Button color="danger" icon="trash" onClick={onDelete} />
        </Button.List>
      </div>
    </div>
  );
};

export default Item;

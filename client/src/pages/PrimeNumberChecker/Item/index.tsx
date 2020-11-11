import React, { useState, useEffect } from 'react';
// @ts-ignore
import { Button, Badge, Table } from 'tabler-react';
import cn from 'classnames';

import './index.scss';
import api from '../../../providers/apiProvider';
import routes from '../../../utils/routes';
import { useTaskRemove } from '../../../hooks/api/task';

type Status = 'CREATED' | 'IS_CALCULATING' | 'FINISHED';

interface Props {
  id: string;
  title: string;
  hardness: number;
  status: Status;
  solution?: string;
  onDelete?: (id?: string) => void;
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

const Item: React.FC<Props> = ({
  id,
  title,
  hardness,
  solution,
  status,
  onDelete = () => null,
}) => {
  const baseClassName = 'created-contest-item';
  const getStatusColor = (status: Status) => {
    if (status === 'CREATED') return 'warning';
    if (status === 'IS_CALCULATING') return 'warning';
    if (status === 'FINISHED') return 'success';
  };
  const [removeTask] = useTaskRemove();
  // const { isPrime, isCalculating } = usePrimeCheck(title);

  /*return (
    <div className={cn(baseClassName, 'p-3')}>
      <div className="d-flex align-items-center justify-content-between">
        <h5 className="h5 mb-0">{title}</h5>
        <p className="ml-3">Hardness: {hardness}</p>
        <Badge className="ml-3 mr-auto" color="warning">
          {status}
        </Badge>
        <Button.List className="d-flex ml-3">
          <Button color="danger" icon="trash" onClick={onDelete} />
        </Button.List>
      </div>
    </div>
  );*/
  return (
    <Table.Row>
      <Table.Col className="w-1">{title}</Table.Col>
      <Table.Col>{hardness}</Table.Col>
      <Table.Col>
        <Badge className="ml-0" color={getStatusColor(status)}>
          {status}
        </Badge>
      </Table.Col>
      <Table.Col>
        <Button
          color="danger"
          icon="trash"
          onClick={async () => {
            await removeTask(id);
            onDelete(id);
          }}
        />
      </Table.Col>
    </Table.Row>
  );
};

export default Item;

import React, { useCallback } from 'react';
// @ts-ignore
import { isEmpty } from 'lodash';
// @ts-ignore
import { Button, Card, Nav } from 'tabler-react';
import { Link, useHistory } from 'react-router-dom';

import ROUTES from '../../../utils/routes';
import { useContestApi } from '../../../hooks/api/contest';
import ContestPageInfoCardTabGeneral from '../../../pages/Contest/ContestPageInfoCard/ContestPageInfoCardTabGeneral';
import ContestPageInfoCardTabStatistics from '../../../pages/Contest/ContestPageInfoCard/ContestPageInfoCardTabStatistics';

const TABS = {
  GENERAL: 'GENERAL',
  RANKING: 'RANKING',
};

const ContestPageInfoCard: React.FC<any> = ({
  isCurrentUserAuthor,
  tabs,
  onStart,
  contest,
  activeTab,
  setActiveTab,
}) => {
  const { remove } = useContestApi();
  const history = useHistory();
  const { _id: contestId } = contest;
  const deleteContest = useCallback(() => {
    if (
      // eslint-disable-next-line no-alert
      window.confirm('Are you sure you want to delete?')
    ) {
      remove(contestId)
        .then(() => history.push(ROUTES.HOME))
        .catch();
    }
  }, [contestId]);

  return (
    <Card>
      <Card.Header className="d-flex align-items-center justify-content-between">
        <div>
          <Nav
            tabbed
            items={tabs.map(({ label, tab }: any) => (
              <Nav.Item
                key={tab}
                value={label}
                active={tab === activeTab}
                onClick={() => setActiveTab(tab)}
              />
            ))}
          />
        </div>
        <Button.List>
          {isCurrentUserAuthor && (
            <>
              <Link
                className="btn btn-outline-warning"
                to={`${ROUTES.CONTESTS.INDEX}/${contestId}/update`}
              >
                Update
              </Link>
              <Button color="danger" outline onClick={deleteContest}>
                Delete
              </Button>
            </>
          )}
          <Button color="primary" onClick={onStart}>
            Start
          </Button>
        </Button.List>
      </Card.Header>
      {!isEmpty(contest) && (
        <Card.Body>
          {activeTab === TABS.GENERAL && (
            <ContestPageInfoCardTabGeneral contest={contest} />
          )}
          {activeTab === TABS.RANKING && (
            <ContestPageInfoCardTabStatistics contest={contest} />
          )}
        </Card.Body>
      )}
    </Card>
  );
};

export default ContestPageInfoCard;

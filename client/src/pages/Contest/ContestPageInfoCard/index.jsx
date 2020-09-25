import React, { useCallback } from 'react';
import _ from 'lodash';
import { Button, Card, Nav } from 'tabler-react';
import { Link, useHistory } from 'react-router-dom';

import ROUTES from 'app/utils/routes';
import { useContestApi } from 'app/hooks/api/contest';
import ContestPageInfoCardTabGeneral from 'app/pages/Contest/ContestPageInfoCard/ContestPageInfoCardTabGeneral';
import ContestPageInfoCardTabStatistics from 'app/pages/Contest/ContestPageInfoCard/ContestPageInfoCardTabStatistics';

const TABS = {
  GENERAL: 'GENERAL',
  STATISTIC: 'STATISTIC',
};

const ContestPageInfoCard = ({
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
        .catch(() => {});
    }
  }, [contestId]);

  return (
    <Card>
      <Card.Header className="d-flex align-items-center justify-content-between">
        <div>
          <Nav
            tabbed
            items={tabs.map(({ label, tab }) => (
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
      {!_.isEmpty(contest) && (
        <Card.Body>
          {activeTab === TABS.GENERAL && (
            <ContestPageInfoCardTabGeneral contest={contest} />
          )}
          {activeTab === TABS.STATISTIC && (
            <ContestPageInfoCardTabStatistics contest={contest} />
          )}
        </Card.Body>
      )}
    </Card>
  );
};

export default ContestPageInfoCard;

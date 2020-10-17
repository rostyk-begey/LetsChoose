import React from 'react';
import { Link } from 'react-router-dom';
// @ts-ignore
import humanTime from 'human-time';
// @ts-ignore
import { Grid, Header, Icon, Media, Tag } from 'tabler-react';

import ROUTES from '../../../../utils/routes';
import { ContestItem } from '../../../../../../server/models/Contest';

interface Props {
  contest: ContestItem & {
    tags: string[];
  };
}

const ContestPageInfoCardTabGeneral: React.FC<Props> = ({
  contest: { title, thumbnail, excerpt, tags = [], games, createdAt },
}) => {
  const counters = [
    {
      icon: 'play',
      data: games,
    },
  ];

  return (
    <>
      <Media className="mb-3">
        <img className="d-flex rounded w-100" src={thumbnail} alt={title} />
      </Media>
      <Grid.Row>
        <Grid.Col className="col-6">
          <div className="text-muted">
            {humanTime(new Date(createdAt as Date))}
          </div>
        </Grid.Col>
        <Grid.Col className="col-6">
          {counters.map(({ icon, data }) => (
            <span className="icon d-none d-md-inline-block ml-3" key={icon}>
              <Icon name={icon} className="mr-1" />
              {data}
            </span>
          ))}
        </Grid.Col>
      </Grid.Row>
      <Tag.List className="mt-2">
        {tags.map((tag: string) => (
          <Link key={tag} to={ROUTES.HOME} className="tag expanded tag-rounded">
            #{tag}
          </Link>
        ))}
      </Tag.List>
      <Header.H2 className="mt-4">{title}</Header.H2>
      <p>{excerpt}</p>
    </>
  );
};

export default ContestPageInfoCardTabGeneral;

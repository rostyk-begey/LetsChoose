// eslint-disable-next-line no-use-before-define
import React from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Card, Avatar, Icon, Tag } from 'tabler-react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import humanTime from 'human-time';
import clip from 'text-clipper';

import ROUTES from '../../utils/routes';
import { UserDto, Contest } from '@lets-choose/common';

import './index.scss';

interface Props {
  data: Contest & {
    author: UserDto;
    tags?: string[] | undefined;
  };
}

const ContestCard: React.FC<Props> = ({
  data: {
    id,
    games,
    author: { username, avatar },
    thumbnail,
    title,
    excerpt,
    createdAt,
    tags = [],
  },
}) => {
  const baseClassName = 'contest-card';
  const counters = [
    {
      icon: 'play',
      data: games,
    },
  ];

  return (
    <Card className={baseClassName}>
      <Link
        to={`${ROUTES.CONTESTS.INDEX}/${id}`}
        className={`${baseClassName}__image-holder`}
      >
        <img
          width="500"
          height="500"
          src={thumbnail}
          alt=""
          className={`card-img-top ${baseClassName}__image`}
        />
      </Link>
      <Card.Body className="p-4">
        <h4>
          <Link to={`${ROUTES.CONTESTS.INDEX}/${id}`}>{title}</Link>
        </h4>
        <p className={`card-text ${baseClassName}__excerpt`}>
          {clip(excerpt, 150)}
        </p>
        <div className="d-flex align-items-center">
          <Link to={`${ROUTES.USERS}/${username}`}>
            <Avatar imageURL={avatar} size="md" className="mr-3" />
          </Link>
          <div>
            <Link to={`${ROUTES.USERS}/${username}`}>@{username}</Link>
            <small className="d-block text-muted">
              {humanTime(new Date(createdAt))}
            </small>
          </div>
          <div className="ml-auto text-muted">
            {counters.map(({ icon, data }) => (
              <span className="icon d-none d-md-inline-block ml-3" key={icon}>
                <Icon name={icon} className="mr-1" />
                {data}
              </span>
            ))}
          </div>
        </div>
        <Tag.List className="pt-4">
          {tags.map((tag: string) => (
            <Link
              key={tag}
              to={ROUTES.HOME}
              className="tag expanded tag-rounded"
            >
              #{tag}
            </Link>
          ))}
        </Tag.List>
      </Card.Body>
    </Card>
  );
};

export default ContestCard;

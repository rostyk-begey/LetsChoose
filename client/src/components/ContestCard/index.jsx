import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Avatar, Icon, Tag } from 'tabler-react';
import humanTime from 'human-time';

import ROUTES from 'app/utils/routes';

import './index.scss';

const ContestCard = ({
  data: {
    _id: id,
    views,
    likes,
    dislikes,
    author: { _id: authorId, username },
    thumbnail,
    isBookmarked = false,
    title,
    excerpt,
    createdAt,
    tags = [],
  },
}) => {
  const baseClassName = 'contest-card';
  const COUNTERS = [
    {
      icon: 'eye',
      data: views,
    },
    {
      icon: 'thumbs-up',
      data: likes,
    },
    {
      icon: 'thumbs-down',
      data: dislikes,
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
        <div className="d-flex align-items-center">
          <Link to={`${ROUTES.USERS}/${authorId}`}>
            <Avatar icon="users" size="md" className="mr-3" />
          </Link>
          <div>
            <Link to={`${ROUTES.USERS}/${authorId}`}>@{username}</Link>
            <small className="d-block text-muted">
              {humanTime(new Date(createdAt))}
            </small>
          </div>
          <div className="ml-auto text-muted">
            {COUNTERS.map(({ icon, data }) => (
              <span className="icon d-none d-md-inline-block ml-3" key={icon}>
                <Icon name={icon} className="mr-1" />
                {data}
              </span>
            ))}
          </div>
        </div>
        <Tag.List className="pt-4">
          {tags.map((tag) => (
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

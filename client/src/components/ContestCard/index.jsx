import React from 'react';
import { Link } from 'react-router-dom';
import { GalleryCard, Avatar, Icon, Tag } from 'tabler-react';

import ROUTES from 'app/utils/routes';

const ContestCard = ({
  id,
  views,
  likes,
  dislikes,
  thumbnail,
  isBookmarked = false,
  title,
  excerpt,
  tags = [],
}) => {
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
    <GalleryCard className="p-3">
      <GalleryCard.Image
        src={thumbnail}
        RootComponent={Link}
        alt={title}
        to={`${ROUTES.CONTEST}/${id}`}
      />
      <div className="px-2">
        <h4>
          <Link to={ROUTES.HOME}>{title}</Link>
        </h4>
      </div>
      <div className="d-flex align-items-center px-2">
        <Link to={`${ROUTES.USERS}/10`}>
          <Avatar icon="users" size="md" className="mr-3" />
        </Link>
        <div>
          <Link to={`${ROUTES.USERS}/10`}>@author</Link>
          <small className="d-block text-muted">12 days ago</small>
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
      <Tag.List className="px-2 pt-4">
        {tags.map((tag) => (
          <Link key={tag} to={ROUTES.HOME} className="tag expanded tag-rounded">
            #{tag}
          </Link>
        ))}
      </Tag.List>
    </GalleryCard>
  );
};

export default ContestCard;

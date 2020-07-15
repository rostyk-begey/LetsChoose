import React from 'react';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { Icon, Button } from 'react-materialize';

import ROUTES from 'app/utils/routes';

import './index.scss';

const QuizCard = ({
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
  const baseClassName = 'quiz-card';
  const COUNTERS = [
    {
      icon: 'remove_red_eye',
      data: views,
    },
    {
      icon: 'thumb_up',
      data: likes,
    },
    {
      icon: 'thumb_down',
      data: dislikes,
    },
  ];

  return (
    <div className={baseClassName}>
      <div className="card-image">
        <img src={thumbnail} />
        <span className="card-title">{title}</span>
        <div className={`${baseClassName}__actions`}>
          <Button
            className={`${baseClassName}__share-btn cyan hoverable`}
            floating
            icon={<Icon>share</Icon>}
            small
            node="button"
            waves="light"
          />
          <Button
            className={`${baseClassName}__bookmark-btn cyan hoverable`}
            floating
            icon={
              <Icon
                className={cn(`${baseClassName}__bookmark-icon`, {
                  [`${baseClassName}__bookmark-icon--active`]: isBookmarked,
                })}
              />
            }
            small
            node="button"
            waves="light"
          />
        </div>
        <Link
          to={`${ROUTES.QUIZ}/${id}`}
          className={`${baseClassName}__start-btn`}
        >
          start
        </Link>
      </div>
      <div className="card-content">
        <div className={`${baseClassName}__info`}>
          <Link to={ROUTES.HOME} className={`${baseClassName}__author`}>
            @author1
          </Link>
          {COUNTERS.map(({ icon, data }) => (
            <span className={`${baseClassName}__counter`}>
              <Icon className={`${baseClassName}__counter-icon`}>{icon}</Icon>
              {data}
            </span>
          ))}
        </div>
        <p className={`${baseClassName}__excerpt`}>{excerpt}</p>
        <div className={`${baseClassName}__tags-container`}>
          {tags.map((tag) => (
            <a key={tag} href="#" className="tag">
              #{tag}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizCard;

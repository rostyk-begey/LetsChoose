import React from 'react';
// @ts-ignore
import { Card } from 'tabler-react';

import { User } from '../../../../server/models/User';

interface Props {
  user: Pick<User, 'avatar' | 'username' | 'bio'>;
}

const ProfileCard: React.FC<Props> = ({ user: { avatar, username, bio } }) => (
  <Card className="card-profile">
    <Card.Header backgroundURL="https://preview.tabler.io/demo/photos/eberhard-grossgasteiger-311213-500.jpg" />
    <Card.Body className="text-center">
      <img alt="" className="card-profile-img" src={avatar} />
      <h3 className="mb-3">@{username}</h3>
      {bio && <p className="mb-4">{bio}</p>}
      <button type="button" className="btn btn-outline-primary btn-sm">
        <span className="fa fa-twitter" /> Follow
      </button>
    </Card.Body>
  </Card>
);

export default ProfileCard;

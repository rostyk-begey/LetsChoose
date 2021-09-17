import React from 'react';
import { oneTapContainerId } from '@lets-choose/client/utils';
import { HEADER_HEIGHT } from './Layout/constants';

export const OneTapContainer: React.FC = () => (
  <div
    id={oneTapContainerId}
    data-prompt_parent_id={oneTapContainerId}
    data-cancel_on_tap_outside="false"
    style={{
      position: 'fixed',
      top: HEADER_HEIGHT + 10,
      right: 8,
      width: 391,
      height: 0,
      zIndex: 1001,
    }}
  />
);

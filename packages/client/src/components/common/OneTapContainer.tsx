import React from 'react';
import { HEADER_HEIGHT } from './Layout/constants';

export const oneTapContainerId = 'g_id_onload';

const OneTapContainer: React.FC = () => (
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

export default OneTapContainer;

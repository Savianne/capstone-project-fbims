import React, { useState } from 'react';
import { createPopper } from '@popperjs/core';

const PopperExample: React.FC = () => {
  const referenceElement = React.useRef<null | HTMLButtonElement>(null);
  const eElement = React.useRef<null | HTMLDivElement>(null);

  React.useEffect(() => {
    if(referenceElement.current && eElement.current) {
        createPopper(referenceElement.current, eElement.current, {
            placement: 'right',
        });
    }
  }, [referenceElement.current, eElement.current])
  return (
    <>
      <button type="button" ref={referenceElement}>
        Reference element
      </button>

      <div ref={eElement}>
        Popper element
      </div>
    </>
  );
};

export default PopperExample;
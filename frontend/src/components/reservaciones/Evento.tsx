import React from 'react';
import { EventProps } from 'react-big-calendar';

const CustomEvent: React.FC<EventProps> = ({ event}) => {
  return (
    <div style={{ backgroundColor: event.style.backgroundColor, color: 'white', padding: '2px 4px', margin: '2px 0' }}>
      <strong>{event.title}</strong>
    </div>
  );
};

export default CustomEvent;

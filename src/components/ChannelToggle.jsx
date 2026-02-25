import React from 'react';

export default function ChannelToggle({ channels, onChange }) {
  const toggleChannel = (channel) => {
    onChange({
      ...channels,
      [channel]: !channels[channel],
    });
  };

  return (
    <div className="channel-toggle">
      <label className="channel-toggle__label">Notification Channels</label>
      <div className="channel-toggle__options">
        <button
          type="button"
          className={`channel-btn ${channels.push ? 'active' : ''}`}
          onClick={() => toggleChannel('push')}
          title="Browser push notifications"
        >
          Push
        </button>
        <button
          type="button"
          className={`channel-btn ${channels.email ? 'active' : ''}`}
          onClick={() => toggleChannel('email')}
          title="Email notifications"
        >
          Email
        </button>
        <button
          type="button"
          className={`channel-btn ${channels.slack ? 'active' : ''}`}
          onClick={() => toggleChannel('slack')}
          title="Slack notifications"
        >
          Slack
        </button>
      </div>
    </div>
  );
}

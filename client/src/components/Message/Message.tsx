import * as React from 'react';

import * as styles from './Message.css';

interface IMessage {
  id: number;
  body: string;
  image: string;
  video: string;
}

interface MessageProps {
  message: IMessage;
}

const Message: React.SFC<MessageProps> = ({ message }) => (
  <div className={styles.message}>
    <div className={styles.body}>
      {message.body}
      {message.image !== '' ? (
        <img className={styles.image} src={'/storage/' + message.image} />
      ) : null}
      {message.video !== '' ? (
        <video
          className={styles.video}
          controls={true}
          muted={true}
          src={'/storage/' + message.video}
        >
          Sorry, your browser doesn't support embedded videos
        </video>
      ) : null}
    </div>
  </div>
);

export { Message, IMessage, MessageProps };

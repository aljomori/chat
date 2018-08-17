import * as React from 'react';

import * as styles from './MessageList.css';
import { Message, IMessage } from '../Message';

interface MessageListState {
  current: number | null;
}

interface MessageListProps {
  messages: IMessage[];
}

class MessageList extends React.Component<MessageListProps, MessageListState> {
  public state = {
    current: null
  };
  private messageListRef: React.RefObject<HTMLDivElement> = React.createRef();

  public componentDidUpdate() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    const container = this.messageListRef.current;
    if (container !== null) {
      container.scrollTop = container.scrollHeight;
    }
  }

  public render() {
    return (
      <div className={styles.messageList} ref={this.messageListRef}>
        {this.props.messages.map(message => <Message key={message.id} message={message} />)}
      </div>
    );
  }
}

export { MessageList, MessageListProps };

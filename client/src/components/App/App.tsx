import * as React from 'react';
import axios from 'axios';

import { MessageList } from '../MessageList';
import { MessageInput } from '../MessageInput';
import { IMessage } from '../Message';
import * as styles from './App.css';

interface AppState {
  messages: IMessage[];
  lastMessageId: number;
}

interface ApiMessage {
  id: number;
  body: string;
  image: string;
  video: string;
  created_at: string;
  updated_at: string;
}

class App extends React.Component<{}, AppState> {
  public state: AppState = {
    messages: [],
    lastMessageId: 0
  };
  private fetchIntervalId: number | undefined = undefined;

  public async componentDidMount() {
    this.joinChat();
    this.fetchIntervalId = window.setInterval(this.fetchMessages, 2000);
  }

  public componentWillUnmount() {
    window.clearInterval(this.fetchIntervalId);
  }

  private joinChat = async () => {
    try {
      const response = await axios.get('/api/join');
      this.setState({ lastMessageId: response.data.lastMessageId });
    } catch (error) {
      console.log('error', error);
    }
  };

  private mergeMessages = (msgs1: IMessage[], msgs2: IMessage[]): IMessage[] => {
    const baseMsgs = msgs1.slice(-30);
    const newMsgs = msgs2.filter(msg => baseMsgs.findIndex(m => msg.id === m.id) === -1);
    return baseMsgs.concat(newMsgs);
  };

  private fetchMessages = async () => {
    try {
      const response = await axios.get('/api/messages', {
        params: { id: this.state.lastMessageId }
      });
      const apiToState = (message: ApiMessage): IMessage => ({
        id: message.id,
        body: message.body,
        image: message.image,
        video: message.video
      });
      if (response.data.change) {
        this.setState(prevState => {
          return {
            messages: this.mergeMessages(
              prevState.messages,
              response.data.messages.map(apiToState)
            ),
            lastMessageId: response.data.lastId
          };
        });
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  private postMessage = async (message: string) => {
    try {
      const response = await axios.post('/api/messages', { message });
      return response.data;
    } catch (error) {
      console.log('error', error);
    }
  };

  private handleInput = async (message: string) => {
    const msg = await this.postMessage(message).catch(_ => {
      // console.log(error)
    });
    this.setState(prevState => {
      const { id, body, image, video } = msg;
      return {
        messages: prevState.messages.concat({ id, body, image, video })
      };
    });
  };

  private handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null) {
      const file = event.target.files[0];
      // 3MB max file size
      if (file.size <= 3145728) {
        const data = new FormData();
        data.append('file', event.target.files[0]);
        const response = await axios.post('/api/images', data).catch(error => console.log(error));
        if (response !== undefined) {
          this.setState(prevState => {
            const { id, body, image, video } = response.data;
            return {
              messages: prevState.messages.concat({ id, body, image, video })
            };
          });
        }
      } else {
        console.log('File size too big!');
      }
    }
  };

  private handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null) {
      const file = event.target.files[0];
      // 30MB max file size
      if (file.size <= 31457280) {
        const data = new FormData();
        data.append('file', file);
        const response = await axios.post('/api/videos', data).catch(error => console.log(error));
        if (response !== undefined) {
          this.setState(prevState => {
            const { id, body, image, video } = response.data;
            return {
              messages: prevState.messages.concat({ id, body, image, video })
            };
          });
        }
      } else {
        // TODO: handle max size error
        console.log('File size too big!');
      }
    }
  };

  public render() {
    return (
      <div className={styles.app}>
        <div className={styles.header}>
          <div className={styles.appBar}>Chat</div>
        </div>
        <div className={styles.main}>
          <MessageList messages={this.state.messages} />
        </div>
        <div className={styles.footer}>
          <MessageInput
            onSubmit={this.handleInput}
            onImageUpload={this.handleImageUpload}
            onVideoUpload={this.handleVideoUpload}
          />
        </div>
      </div>
    );
  }
}

export default App;

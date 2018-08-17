import * as React from 'react';

import * as styles from './MessageInput.css';

import { FileInput } from '../FileInput';

const photoIcon: string = require('./insert_photo-24px.svg');
const movieIcon: string = require('./local_movies-24px.svg');

interface MessageInputProps {
  onSubmit(message: string): void;
  onImageUpload(event: React.ChangeEvent<HTMLInputElement>): void;
  onVideoUpload(event: React.ChangeEvent<HTMLInputElement>): void;
}

class MessageInput extends React.Component<MessageInputProps> {
  public state = {
    messageBody: ''
  };

  private handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      const target = event.target as HTMLTextAreaElement;
      if (target.value !== '') {
        this.props.onSubmit(target.value);
        this.setState({ messageBody: '' });
      }
    }
  };

  private handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = event.target as HTMLTextAreaElement;
    this.setState({ messageBody: target.value });
  };

  private handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onImageUpload(event);
  };

  private handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onVideoUpload(event);
  };

  public render() {
    return (
      <div className={styles.input}>
        <FileInput
          fileIcon={photoIcon}
          onFileUpload={this.handleImageUpload}
          mimes="image/png, image/jpeg, image/gif"
        />
        <FileInput
          fileIcon={movieIcon}
          onFileUpload={this.handleVideoUpload}
          mimes="video/ogg, video/webm, video/mp4"
        />
        <textarea
          name="messageBody"
          placeholder="Envía un mensaje..."
          onKeyDown={this.handleKeyDown}
          onChange={this.handleOnChange}
          value={this.state.messageBody}
        />
      </div>
    );
  }
}

export { MessageInput, MessageInputProps };

import * as React from 'react';

import * as styles from './FileInput.css';

interface FileInputProps {
  onFileUpload(event: React.ChangeEvent<HTMLInputElement>): void;
  fileIcon: string;
  mimes: string;
}

const FileInput: React.SFC<FileInputProps> = props => (
  <label>
    <img className={styles.icon} src={props.fileIcon} />
    <input
      className={styles.file}
      type="file"
      name="image"
      onChange={props.onFileUpload}
      accept={props.mimes}
    />
  </label>
);

export { FileInput, FileInputProps };

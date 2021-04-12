import * as React from 'react'
import { Stack } from 'office-ui-fabric-react/lib/components/Stack';
import { DefaultButton, IButtonStyles } from 'office-ui-fabric-react';
import { IconButton } from 'office-ui-fabric-react/lib/Button';

export interface IButtonProps {
  text: string,
  icon: string,
  primary: boolean,
  onClick: () => void
  disabled: boolean,
}

export interface IButtonState {
  text: string,
  onClick: () => void
  disabled: boolean,
}

export default class ButtonControl extends React.Component<IButtonProps, IButtonState>{
  constructor(props: IButtonProps) {
    super(props);
    this.state = {
      text: props.text,
      onClick: props.onClick,
      disabled: props.disabled,
    }

  }
  render() {
    return (
      <Stack horizontal>
        <DefaultButton
          text={this.state.text}
          primary={this.props.primary}
          disabled={this.state.disabled}
          onClick={this.state.onClick}
          iconProps={{ iconName: this.props.icon }}
        />
      </Stack>
    );
  }
}
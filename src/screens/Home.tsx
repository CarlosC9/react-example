import React, { Component } from 'react';
import {
    makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles( (theme) => ({

}));

interface Props {
    classes: any;
}

interface State {

}

class HomeComponent extends Component<Props, State> {
    
    constructor(props: Props) {
        super(props);
    }

}


export default function HomeScreen(props: {}) {
    const classes = useStyles();
    return (
      <HomeComponent classes={classes}/>
    );
  }
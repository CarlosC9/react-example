import React, { Component } from 'react';
import './App.css';
import {
  AppBar,
  Typography,
  makeStyles,
  ThemeProvider,
  createMuiTheme,
  IconButton,
  Toolbar,
  Container,
} from '@material-ui/core';
import {
  Switch,
  Route,
  useHistory,
  Redirect,
} from 'react-router-dom';
import LoginScreen from './screens/Login';
import SignUpScreen from './screens/SignUp';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#c62828",
      light: "#ff5f52",
      dark: "#8e0000",
      contrastText: "#fff",
    },
    secondary: {
      main: "#f50057",
      light: "#ff5983",
      dark: "#bb002f",
      contrastText: "#000"
    },
  }
});

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1,
  },
}));

interface Props {
  classes: any,
  history: any,
}

interface State {

}

class AppComponent extends Component<Props, State> {

  constructor(public props: Props) {
    super(props);
  }

  componentDidMount() {
    const path = this.props.history.location.pathname;
    const token = localStorage.getItem("token");
    if (!token && path === '/home') {
      this.props.history.push("/login");
    } else if (token && path === '/login') {
      this.props.history.push("/home");
    } else if (token && path === '/signup') {
      this.props.history.push("/home");
    }
  }

  render() {
    return (
      <div className="App">
        <ThemeProvider theme={theme}>
          <AppBar position="static" color="primary">
            <Container maxWidth="lg">
              <Toolbar>
                <Typography variant="h5" className={this.props.classes.title}>
                  Video
              </Typography>
                <IconButton edge="end" className={this.props.classes.profileButton} color="inherit" aria-label="profle">
                  <AccountCircleIcon />
                </IconButton>
              </Toolbar>
            </Container>
          </AppBar>
          <Switch>
            <Route path="/" exact>
              <Redirect to="/home" />
            </Route>
            <Route path="/home" exact>

            </Route>
            <Route path="/login" exact>
              <LoginScreen />
            </Route>
            <Route path="/signup" exact>
              <SignUpScreen />
            </Route>
            <Route>
              404
              </Route>
          </Switch>
        </ThemeProvider>
      </div>
    );
  }
}

export default function App(props: {}) {
  const classes = useStyles();
  const history = useHistory();
  return (
    <AppComponent classes={classes} history={history} />
  );
}


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
import HomeScreen from './screens/Home';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

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
  auth: boolean,
  menuAuth: HTMLElement | null,
}

class AppComponent extends Component<Props, State> {

  constructor(public props: Props) {
    super(props);
    this.state = {
      auth: true,
      menuAuth: null,
    }
  }

  componentDidMount() {
    const path = this.props.history.location.pathname;
    const token = localStorage.getItem("token");
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        this.setState({
          auth: true,
        })
      } else {
        this.setState({
          auth: false,
        })
      }
    }
    this.props.history.listen(checkAuth.bind(this));
    if (!token) {
      this.setState({
        auth: false,
      })
      if (path === '/home') {
        this.props.history.push("/login");
      }
    } else {
      this.setState({
        auth: true,
      })
      if (path === '/login') {
        this.props.history.push("/home");
      }
      if (path === '/signup') {
        this.props.history.push("/home");
      }
    }
  }

  renderAuth() {
    if (this.state.auth) {
      return <IconButton edge="end" className={this.props.classes.profileButton} color="inherit" aria-label="profle" onClick={this.onOpenMenuAuth.bind(this)}>
        <AccountCircleIcon />
      </IconButton>;
    }
  }

  onOpenMenuAuth(event: React.MouseEvent<HTMLButtonElement>) {
    this.setState({
      menuAuth: event.currentTarget
    })
  }

  onCloseMenuAuth() {
    this.setState({
      menuAuth: null
    })
  }

  onLogout() {
    localStorage.removeItem("token");
    this.setState({
      menuAuth: null,
    });
    this.props.history.push("/login");
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
              {this.renderAuth()}
                {/* <IconButton edge="end" className={this.props.classes.profileButton} color="inherit" aria-label="profle">
                  <AccountCircleIcon />
                </IconButton> */}
              </Toolbar>
            </Container>
          </AppBar>
          <Switch>
            <Route path="/" exact>
              <Redirect to="/home" />
            </Route>
            <Route path="/home" exact>
                <HomeScreen />
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
        <Menu
          keepMounted
          anchorEl={this.state.menuAuth}
          open={Boolean(this.state.menuAuth)}
          onClose={this.onCloseMenuAuth.bind(this)}
        >
          <MenuItem onClick={this.onLogout.bind(this)}>Cerrar sesión</MenuItem>
        </Menu>
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


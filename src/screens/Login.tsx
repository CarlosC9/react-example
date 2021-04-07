import React, { Component } from 'react';
import {
    makeStyles,
    Container,
    Typography,
    TextField,
    Avatar,
    Paper,
    Button,
    Snackbar,
} from '@material-ui/core';
import {
    Link,
    useHistory,
} from 'react-router-dom';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import UserService, { UserServiceError, UserServiceErrorTypes } from '../services/user.service';
import Alert from '../components/Alert';

const useStyles = makeStyles(theme => ({
    paper: {
        textAlign: "center",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: theme.spacing(8),
    },
    avatar: {
        backgroundColor: theme.palette.secondary.main,
        marginBottom: theme.spacing(2),
    },
    form: {
        width: "100%",
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

interface Props {
    classes: any,
    history: any,
}

interface State {
    openSnackBar: boolean,
    messageSnackBar: string,
}

class LoginComponent extends Component<Props, State> {

    constructor(public props: Props) {
        super(props);
        this.state = {
            openSnackBar: false,
            messageSnackBar: "",
        }
    }

    async onCloseSnackBarError(event?: React.SyntheticEvent, reason?: string) {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            openSnackBar: false,
        });
    }

    async loginSubmit(event: React.FormEvent) {
        event.preventDefault();
        const password = (event.target as any).password.value;
        const username = (event.target as any).username.value;
        try {
            const token = await UserService.login(username, password);
            if (token) {
                await localStorage.setItem("token", token);
                this.props.history.push("/home");
            }
        } catch (e) {
            if (e instanceof UserServiceError) {
                switch (e.type) {
                    case UserServiceErrorTypes.NOT_SEND_ALL_FIELDS:
                        this.setState({
                            openSnackBar: true,
                            messageSnackBar: "No enviastes todos los datos necesarios para iniciar sesión"
                        });
                        break;
                    case UserServiceErrorTypes.USERNAME_NOT_EXISTS:
                        this.setState({
                            openSnackBar: true,
                            messageSnackBar: "El usuario no existe.",
                        });
                        break;
                    case UserServiceErrorTypes.PASSWORD_NOT_CORRECT:
                        this.setState({
                            openSnackBar: true,
                            messageSnackBar: "La contraseña no es correcta.",
                        });
                        break;
                }
            }
        }
    }

    render() {
        return (
            <Container maxWidth="xs">
                <Paper elevation={0} className={this.props.classes.paper}>
                    <Avatar className={this.props.classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography variant="h5">
                        Iniciar Sesión
                    </Typography>
                    <form className={this.props.classes.form} onSubmit={this.loginSubmit.bind(this)}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Nombre de usuario"
                            name="username"
                            autoFocus
                            autoComplete="off"
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Contraseña"
                            type="password"
                            id="password"
                            autoComplete="off"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={this.props.classes.submit}
                            disabled={false}
                        >
                            Iniciar sesión
                        </Button>
                        <Link to="/signup">
                            {"¿Aún no tienes cuenta? Regístrate"}
                        </Link>
                    </form>
                </Paper>
                <Snackbar open={this.state.openSnackBar} autoHideDuration={6000} onClose={this.onCloseSnackBarError.bind(this)}>
                    <Alert severity="error" onClose={this.onCloseSnackBarError.bind(this)}>
                        {this.state.messageSnackBar}
                    </Alert>
                </Snackbar>
            </Container>
        )
    }

}

export default function LoginScreen(props: {}) {
    const classes = useStyles();
    const history = useHistory();
    return (
        <LoginComponent classes={classes} history={history}/>
    );
}
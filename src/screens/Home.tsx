import React, { Component } from 'react';
import {
    makeStyles,
    Container,
    Snackbar,
} from '@material-ui/core';
import MoviesService, { MoviesServiceError, MoviesServiceErrorTypes } from '../services/movies.services';
import Alert from '../components/Alert';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({

}));

interface Props {
    classes: any;
    history: any;
}

interface State {
    page: number,
    films: null | any[],
    openSnackBar: boolean,
    messageSnackBar: string,
}

class HomeComponent extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            page: 1,
            films: null,
            openSnackBar: false,
            messageSnackBar: "",
        }
    }

    async componentDidMount() {
        const token = await localStorage.getItem('token');
        try {
            this.setState({
                films: await MoviesService.getMovies(this.state.page, token),
            });
        } catch (e) {
            if (e instanceof MoviesServiceError) {
                switch (e.type) {
                    case MoviesServiceErrorTypes.NOT_SEND_ALL_FIELDS:
                        this.setState({
                            openSnackBar: true,
                            messageSnackBar: "No enviastes todos los datos necesarios para mostrar las películas."
                        });
                        break;
                    case MoviesServiceErrorTypes.UNAUTHORIZED:
                        await localStorage.removeItem("token");
                        this.props.history.push("/login");
                }
            }
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

    render() {
        return (
            <Container maxWidth="lg" style={{ marginTop: '10px' }}>
                <div>Hola</div>
                <Snackbar open={this.state.openSnackBar} autoHideDuration={6000} onClose={this.onCloseSnackBarError.bind(this)}>
                    <Alert severity="error" onClose={this.onCloseSnackBarError.bind(this)}>
                        {this.state.messageSnackBar}
                    </Alert>
                </Snackbar>
            </Container>
        )
    }
}


export default function HomeScreen(props: {}) {
    const classes = useStyles();
    const history = useHistory();
    return (
        <HomeComponent classes={classes} history={history}/>
    );
}
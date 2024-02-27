import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Box from "@material-ui/core/Box";
import Home from "./Components/Home";
import Callback from "./Components/Callback";
import Form from "./Components/Form";
import { Redirect } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Success from "./Components/Success";
import Error from "./Components/Error";
import PageNotFoundError from "./Components/404";
import Helmet from "react-helmet";
import { createBrowserHistory } from "history";
import * as ReactGA from "react-ga";
import ErrorPath from "./Components/errorPath";
import SuccessPath from "./Components/successPath";


const DiscordOauth2 = require("discord-oauth2");

const history = createBrowserHistory();
history.listen(location => {
    ReactGA.set({ page: location.pathname }); // Update the user's current page
    ReactGA.pageview(location.pathname); // Record a pageview for the given page
});

function App() {
    return (
        <Router className="App" history={history}>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{process.env.REACT_APP_SITE_TITLE ? process.env.REACT_APP_SITE_TITLE : `zkSync Discord Ban Appeal Application`}</title>
                <meta name="description"
                    content={process.env.REACT_APP_SITE_DESCRIPTION ? process.env.REACT_APP_SITE_DESCRIPTION : `Discord Ban Appeal Application`} />
                <link rel="icon" href="./discord.png" type="image/x-icon" />
            </Helmet>
            <Grid container
                spacing={4}
                direction="column"
                justifyContent="center"
                alignItems="center"
            >
                <Grid item xs={12}>
                    <Box style={{ backgroundImage: `url(${process.env.REACT_APP_BANNER_URL})` }} className={"banner"}>
                        <img alt="Discord icon" src="./discord.png" className={"icon"} height={150} />
                        <h1>zkSync Discord Ban Appeal System</h1>
                    </Box>
                </Grid>
                <Switch>
                    <Route path="/" exact>
                        <Home />
                    </Route>
                    <Route path="/callback" exact>
                        <Callback />
                    </Route>
                    <Route path="/404" render={(props) => <Error {...props} />} />
                    <Route path="/error" exact component={ErrorPath} />
                    <Route path="/success" exact component={SuccessPath} />
                    <PrivateRoute path="/form" exact>
                        <Form />
                    </PrivateRoute>
                    <PrivateRoute path="/success" exact>
                        <Success />
                    </PrivateRoute>
                    <Route path="*" component={PageNotFoundError} />

                </Switch>
            </Grid>

        </Router>
    );
}

function PrivateRoute({ children, ...rest }) {
    return (
        <Route
            {...rest}
            render={({ location }) =>
                localStorage.getItem("access_token") ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}

export default App;

export const oauth = new DiscordOauth2({
    clientId: process.env.REACT_APP_CLIENT_ID,
    clientSecret: process.env.REACT_APP_CLIENT_SECRET,
    redirectUri: window.location.origin + "/callback",
});

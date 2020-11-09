import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./Components/Home";
import GuessWhereBar from "./Components/GuessWhereBar";
import BrowseChallenges from "./Components/BrowseChallenges";
import { AuthProvider } from "./AuthProvider";
import PlayChallenge from "./Components/PlayChallenge";
import CreateChallenge from "./Components/CreateChallenge";

require("dotenv").config();

function App() {
  return (
    <AuthProvider>
      <Router>
        <GuessWhereBar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/Browse" exact component={BrowseChallenges} />
          <Route path="/Create" exact component={CreateChallenge} />
          <Route
            path="/Challenge/:challengeId"
            render={(props) => <PlayChallenge {...props} />}
          />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;

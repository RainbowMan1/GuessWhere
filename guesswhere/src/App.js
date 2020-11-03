import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./Components/Home";
import GuessWhereBar from "./Components/GuessWhereBar";
import BrowseChallenges from "./Components/BrowseChallenges";
import { AuthProvider } from "./AuthProvider";

function App() {
  return (
    <AuthProvider>
      <Router>
        <GuessWhereBar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/Browse" component={BrowseChallenges} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;

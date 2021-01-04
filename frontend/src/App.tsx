import { Box, Grommet, Main } from "grommet";
import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Navigation } from './components/ui/Navigation';
import { Symfoni } from "./hardhat/SymfoniContext";
import { Home } from "./pages/Home";
import { Footer } from "./components/ui/Footer";



function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Grommet full={true}>
        <Symfoni autoInit={true} showLoading={true}>
          <Box height={{ min: "100vh" }}>
            {/* Navigation */}
            <Navigation></Navigation>
            {/* Content swtich */}
            <Main pad="xlarge" height={{ min: "75vh" }} >
              <Switch>
                <Route exact path="/" component={Home} />
              </Switch>
            </Main>
            {/* footer */}
            <Footer></Footer>
          </Box>
        </Symfoni>
      </Grommet>
    </BrowserRouter >
  );
}

export default App;

import './App.css';
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import { Switch, Route } from 'react-router';
import { main } from './pages/main/main';
import { profile } from './pages/profile/profile';
import { dashboard } from './pages/dashboard/dashboard';
import { testing } from './pages/testing/testing';
import { play } from './pages/play/play';
import { header as Header} from './shared/header/header'

function App() {
  return (
    <div className="App">
      <Theme preset={presetGpnDefault}>
        <Header/>
        <Switch>
          <Route path="/" exact component={main}/>
          <Route path="/profile" exact component={profile}/>
          <Route path="/dashboard" exact component={dashboard}/>
          <Route path="/testing" exact component={testing}/>
          <Route path="/play" exact component={play}/>
        </Switch>
    </Theme>
    </div>
  );
}

export default App;

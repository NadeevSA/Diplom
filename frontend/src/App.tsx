import './App.css';
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import { Switch, Route } from 'react-router';
import { Profile } from './pages/profile/profile';
import { dashboard } from './pages/dashboard/dashboard';
import { run } from './pages/run/run';
import { CustomHeader as CustomHeader} from './shared/header/header'
import { main } from './pages/main/main';
import { projects } from './pages/projects/projects';

function App() {
  return (
    <div className="App">
      <Theme preset={presetGpnDefault}>
        <CustomHeader/>
        <Switch>
          <Route path="/" exact component={main}/>
          <Route path="/projects" exact component={projects}/>
          <Route path="/profile" exact component={Profile}/>
          <Route path="/dashboard" exact component={dashboard}/>
          <Route path="/run" exact component={run}/>
        </Switch>
      </Theme>
    </div>
  );
}

export default App;

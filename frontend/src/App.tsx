import './App.css';
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import { Switch, Route } from 'react-router';
import { Profile } from './pages/profile/profile';
import { dashboard } from './pages/dashboard/dashboard';
import { run } from './pages/run/run';
import { CustomHeader as CustomHeader} from './shared/header/header'
import { main } from './pages/main/main';
import { projects } from './pages/projects/projects';
import { datas } from './pages/datas/datas';
import authServer from './serviceAuth/authServer';
import { Redirect } from 'react-router-dom';
import { projectConfigs } from './pages/projectConfigs/projectConfigs';

export function IsMobile(){
    return window.screen.width <= 400;
}

function App() {
  return (
    <div className="App">
      <Theme preset={presetGpnDefault}>
        <CustomHeader/>
        <Switch>
          <Route path="/" exact component={main}/>
          <Route path="/projects" exact component={projects}/>
          <Route path="/datas" exact component={datas}/>
          <Route path="/projectConfigs" exact component={projectConfigs}/>
          <Route path="/dashboard" exact component={dashboard}/>
          <Route path="/run" exact component={run}/>
          {authServer.getToken() != "" ? <Route path="/profile" exact component={Profile}/> :
          <Redirect from="/profile" to="/" />}
        </Switch>
      </Theme>
    </div>
  );
}

export default App;

import './App.css';
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import { Switch, Route } from 'react-router';
import { main } from './pages/main/main';
import { profile } from './pages/profile/profile';
import { dashboard } from './pages/dashboard/dashboard';
import { testing } from './pages/testing/testing';
import { play } from './pages/play/play';
import { exp } from './pages/exampleRudexAxios/exp';
import { header as Header} from './shared/header/header'
import { store } from './store'
import { Provider } from 'react-redux'

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Theme preset={presetGpnDefault}>
          <Header/>
          <Switch>
            <Route path="/" exact component={main}/>
            <Route path="/profile" exact component={profile}/>
            <Route path="/dashboard" exact component={dashboard}/>
            <Route path="/testing" exact component={testing}/>
            <Route path="/play" exact component={play}/>
            <Route path="/example" exact component={exp}/>
          </Switch>
        </Theme>
      </div>
    </Provider>
  );
}

export default App;
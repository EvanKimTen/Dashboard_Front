import './App.css';
import Interactions from './components/Interactions';
import Sessions from './components/Sessions';
import TopIntents from './components/TopIntents';
import Understood from './components/Understood';
import Users from './components/Users';

const App = () => {

  return (
    <div id='container'>
      <Interactions/>
      <Understood/>
      <Users/>
      <Sessions/>
      <TopIntents/>
    </div>
  )
}

export default App
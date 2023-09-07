import './App.css';
import Interactions from './components/Interactions';
import Sessions from './components/Sessions';
import TopIntents from './components/TopIntents';
import Understood from './components/Understood';
import Users from './components/Users';

const App = () => {

  return (
    <div>
      <TopIntents/>
      <Understood/>
      <Interactions/>
      <Users/>
      <Sessions/>
    </div>
  )
}

export default App
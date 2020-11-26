import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Main from './components/Main';

//css
import './App.css';
import 'semantic-ui-css/semantic.min.css';

const App = ()=>{
	
	return(
		<Provider store={store}>
			<Router>
      			<Route path = "/" component = {Main}></Route>
   			</Router>
		</Provider>
	)
}

export default App;

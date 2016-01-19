import React from 'react';
const { render } = require('react-dom');
//import MobileTearSheet from '../../../MobileTearSheet';
// material-ui
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
//import ActionGrade from 'material-ui/lib/svg-icons/action/grade';
import Divider from 'material-ui/lib/divider';
//import Avatar from 'material-ui/lib/avatar';
//import Colors from 'material-ui/lib/styles/colors';
const RaisedButton = require('material-ui/lib/raised-button');
const Dialog = require('material-ui/lib/dialog');
const ThemeManager = require('material-ui/lib/styles/theme-manager');
const LightRawTheme = require('material-ui/lib/styles/raw-themes/light-raw-theme');
const Colors = require('material-ui/lib/styles/colors');
const AppBar = require('material-ui/lib/app-bar');
const LeftNav = require('material-ui/lib/left-nav');
//import IconButton from 'material-ui/lib/icon-button';
const injectTapEventPlugin = require('react-tap-event-plugin');

require('./main.scss');

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

const io = require('socket.io-client');
const socket = io.connect();



const initialState = {
    muiTheme: ThemeManager.getMuiTheme(LightRawTheme),
    currentIndex : 0,
    data: []

}

class MainBody extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = initialState;
    }
    
    getChildContext() {
        return {
          muiTheme: this.state.muiTheme,
        };
    }

    componentDidMount(){
    	socket.on('items', function (data) {
    		console.log(data);
    		this.setState({data: data});
    	}.bind(this));
    }

    componentWillMount() {
        let newMuiTheme = ThemeManager.modifyRawThemePalette(this.state.muiTheme, {
            accent1Color: Colors.deepOrange500,
        });
        this.setState({muiTheme: newMuiTheme});
    }

    renderAppBar(){
        let { isLeftNavOpen } = this.state;
        return (
            <AppBar title="PTT Crawler" 
                    iconClassNameRight="fa fa-facebook fa-2x" 
                    onLeftIconButtonTouchTap={() => this.setState({isLeftNavOpen: !isLeftNavOpen })} 
                    onRightIconButtonTouchTap={() => {console.log("click!");}} />
        );
    }	

    renderList(){
    	  var listItems = this.state.data.map((item) => {
	      return (
	        <ListItem key = {item.id}
	        	primaryText={item.title}
		        insetChildren={true}
		        onTouchTap={ () => {
		        	var win = window.open(item.url, '_blank');
					win.focus();
		        }} />
	      );
	    });

    	return(
    		<List>
		      <ListItem
		        primaryText="IPHONE" />
		       {listItems}
		    </List>
    	);
    }

    renderLeftNav(){
        return(
            <LeftNav docked={false}
                    width={200} 
                    open={this.state.isLeftNavOpen} 
                    onRequestChange={open => this.setState({isLeftNavOpen: open}) } >
            </LeftNav>
        );
    }

    updateIndex(indexUpdate){
        let index = this.state.currentIndex + indexUpdate;
        this.setState({currentIndex: index});
    }

    render() {
        const fullHeight = {height: "100%" };
        const displayNone = {display: 'none'};
        var appBarStyle = {};
        return (
            <div style={fullHeight}>
                { this.renderAppBar() }
                { this.renderLeftNav() }
                { this.renderList()}
            </div>
        );
    }
}

MainBody.childContextTypes = {
    muiTheme: React.PropTypes.object,
}

render(<MainBody />, document.getElementById('root'));
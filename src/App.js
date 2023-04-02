import './App.css';
import * as d3 from 'd3'
import React, { Component } from 'react'
import Graph from "./Graph.js"
import KMeans from "./d3-vis/kmeans";
import AboutModal from "./about-modal/about-modal";
import CreditsModal from "./credits-modal/credits-modal";
import buzz from './about-modal/assets/buzz.png'
import cma from './about-modal/assets/cma.png'
import Legend from "./legend/legend";


class App extends React.Component {
  constructor(props) {
    super(props);
	this.state = {
		aboutOpened: true,
		creditsOpened: false,
		currentJson: {},
		numClusters: 5
	}
  }

  componentDidMount() {
	  fetch('/time', {
		  method: 'POST',
		  headers: {
			  'Content-Type': 'application/json'
		  },
		  body: JSON.stringify([100, 5,
			  ["Title", "Creation Date", "Culture", "Collection", "Type", "Technique"]])
	  })
		  .then(res => res.json())
		  .then(data => this.setState({currentJson: data}))
  }

	handleJson = (newJson) => {
	  this.setState({currentJson: newJson})
  	}

  	handleClusters = (newK) => {
	  this.setState({numClusters: newK})
	}

	render() {
    return (
    	<div
    	 style={{
	        // backgroundColor: '#ebdfbc',
			 overflow: "hidden"
	      }}
	    >

			<div className={"corner-menu"}>
				<div className={"logo-flex"}>
					<img src={buzz} width={100} height={100} alt={"GT"}/>
					<img src={cma} width={100} height={85} alt={"CMA"}/>
				</div>

				<div className={"links"}>
					<a className={"link"} onClick={() => this.setState({aboutOpened: true})}>
						About
					</a>

					<a className={"link"} onClick={() => this.setState({creditsOpened: true})}>
						Credits
					</a>
				</div>


			</div>

			<CreditsModal show={this.state.creditsOpened} onHide={() => this.setState({creditsOpened: false})} />
			<AboutModal show={this.state.aboutOpened} onHide={() => this.setState({aboutOpened: false})} />
	    	<KMeans jsonHandler={this.handleJson} clusterHandler={this.handleClusters}/>
	    	<Graph style={{overflow: "hidden"}} jsonData={this.state.currentJson}/>
			<Legend clusters={this.state.numClusters}/>
    	</div>
    );
  }
};

export default App;
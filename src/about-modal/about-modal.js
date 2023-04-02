import React, {useState} from "react";
import {Button, Modal} from "react-bootstrap";
import './about-modal.css'
import buzz from './assets/buzz.png';
import cma from './assets/cma.png';

export default function AboutModal(props) {


    return (
        <Modal id={"about-modal-container"} show={props.show} onHide={props.onHide} size={"lg"}
		centered={true} aria-labelledby={"contained-modal-title-vcenter"}>

			<div id={"about-modal-contents"}>

				<div id={"logo-flex"}>
					<img src={buzz} alt={"Georgia Tech"} width={100} height={100}/>
					<img src={cma} alt={"Cleveland Museum of Art"} width={100} height={85} />
				</div>

				<h1 id={"about-header"}>
					K-Means Clustering of Artworks from the Cleveland Museum of Art
				</h1>

				{/*<br />*/}

				<hr />

				<body >
					<p>
						The Cleveland Museum of Art (CMA) is a Creative Commons Open Access institute,
						providing online and free access to its collection sporting more than 30,000 works of
						public-domain art. With this artwork data, CMA has implemented a public API with configurable
						endpoints and queries for performing network requests to get artworks, artists, or CMA exhibits
						by customizable parameters.
					</p>

					<p>
						For our Fall 2021 Data Visualization and Analytics course project, our team has implemented a
						customizable and interactive K-Means visualization of the artworks in the CMA API, to
						illustrate the extent of interconnectedness of presented artworks.
					</p>
					<h4> How to use </h4>
					 <ul>
					  <li>Select number of wanted artworks (2-10000) (Note that if you select large values,
					  	individual nodes might be hard to view)</li>
					  <li>Select max number of wanted clusters (2-25) (Choose a cluster that makes sense for your
					  number of artworks!)</li>
					  <li>Select at least 2 clustering features</li>
					  <li>Hover over a node to view the art piece's name</li>
					  <li>Click a node to view more information about the art piece (click the x to close it)</li>
					</ul> 
				</body>
				<div style={{"text-align": "center"}}>
					<Button className={"modal-okay-button"} type={"button"} onClick={props.onHide}>
						Okay!
					</Button>
				</div>

			</div>
        </Modal>
    )
}
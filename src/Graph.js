import * as d3 from 'd3'
import React, { Component } from 'react'

import data from './data.csv';
import {symbol, symbolCross} from "d3-shape";
import './Graph.css'
import KMeans from "./d3-vis/kmeans";

class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      window_width: window.innerWidth,
      window_height: window.innerHeight,
      jsonData: this.props.jsonData
    }

    // console.log(this.state.window_width)
    // console.log(this.state.window_height)

    this.drawNodes = this.drawNodes.bind(this);
  }

  handleResize = () => {
    //console.log(this.state.window_width)
    //console.log(this.state.window_height)
    this.setState({
      window_width: window.innerWidth,
      window_height: window.innerHeight
    })
    // this.drawChart();
    // let curr_svg = document.getElementById("svg-component")
    // curr_svg.height = this.state.window_height
    // curr_svg.width = this.state.window_width
        // .viewBox(`0 0 ${this.state.window_width} ${this.state.window_height}`)
        // .attr("viewBox", `0 0 ${this.state.window_width} ${this.state.window_height}`)
  }

  isEmpty = (json) => {
    return Object.keys(json).length === 0;
  }

  componentDidMount() {
    // this.drawChart();
    if (!this.isEmpty(this.state.jsonData)) {
      this.drawNodes(this.state.jsonData);
    }
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  drawNodes(jsonData) {
    var self = this;
    var yScale = d3.scaleLinear().range([self.state.window_height - 10, 10])

    var xScale = d3.scaleLinear().range([10, self.state.window_width - 10])

    console.log(jsonData)
    d3.csv(data, function(d) {
      return {
        x: +d.x,
        y: +d.y,
        text: d.text.toString(),
        cluster_id: +d.clusterid,
        //creation_date_beg: d.creation_date_beg.toString(),
        //creation_date_end: d.creation_date_end.toString(),
        //image_url: d.image_url.toString(),
        //artist_name: d.artist_name.toString(),
        //culture: d.culture.toString(),
        //type: d.type.toString(),
        //technique: d.technique.toString(),
      }
    }).then(dt => {
      var xmax = d3.max(dt, function(d) {return d.x});
      var xmin = d3.min(dt, function(d) {return d.x});

      var ymax = d3.max(dt, function(d) {return d.y});
      var ymin = d3.min(dt, function(d) {return d.y});

      yScale.domain([ymin, ymax]);
      xScale.domain([xmin, xmax]);

      console.log(xmin);
      console.log(xmax);

      //drawing int svg
      const svg = d3.select(this.refs.space)
          .attr("id", "svg-component")
          .style('cursor', 'pointer')
          .style('-webkit-user-select', 'none')
          .style('-khtml-user-select', 'none')
          .style('-moz-user-select', 'none')
          .style('-ms-user-select', 'none')
          .attr("preserveAspectRatio", "xMinYMin meet")
          .attr("viewBox", `0 0 ${this.state.window_width} ${this.state.window_height}`)

          .classed("svg-content-responsive", true);

      svg.call(d3.zoom()
          .extent([[0,0], [this.state.window_width, this.state.window_height]])
          .scaleExtent([1,8])
          .on("zoom", zoomed))


      ////////////////////////////////////////

      var maxcluster = d3.max(dt, function(d) {return d.cluster_id})

      var myColor = d3.scaleSequential().domain([0, maxcluster]).interpolator(d3.interpolateTurbo);

      //For circles
      var div = d3.select(this.refs.space).append('g')

      function zoomed({transform}) {
        div.attr("transform", transform)
        divHover.attr("transform", transform)
      }

      //Hover textbox. Append to here to add something into textbox
      var divHover = d3.select(this.refs.space).append('g');

      var textbox = divHover.append('rect')
        .attr('x', '0')
        .attr('y', '0')
        .attr('width', 50)
        .attr('height', 20)
        .attr('fill', 'white')
        .attr('stroke', 'white')
        .attr("rx", 6)
        .attr("ry", 6)
        .style("opacity", 0);

      var text = divHover.append('text')
        .attr('dy', 15)
        .attr('dx', 10)
        .attr("text-anchor", "start")
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .style("opacity", 0);

      //Click textbox. Append here to add something into the clicked textbox
      var div2 = d3.select(this.refs.space).append("g")

      var boxClick = div2.append('rect')
        .attr('x', '0')
        .attr('y', '0')
        .attr("rx", 6)
        .attr("ry", 6)
        .attr('width', 100)
        .attr('height', 100)
        .attr('fill', 'white')
        .style("opacity", 0)
        .attr("stroke", "grey")
        .attr("stroke-width", 1);

      var boxText = div2.append('text')
        .attr('dy', 35)
        .attr('dx', 10)
        .attr('padding', 10)
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "start")
        // .attr("fill", "#73716b")
        .attr("font-family", "sans-serif")
        .attr("font-size", "20px")
        .style("opacity", 0);

      var boxTimePeriod = div2.append('text')
        .attr('dy', 60)
        .attr('dx', 10)
        .attr('padding', 10)
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "start")
        .attr("fill", "#73716b")
        .attr("font-family", "sans-serif")
        .attr("font-size", "20px")
        .style("opacity", 0);

      var boxCulture = div2.append('text')
        .attr('dy', 85)
        .attr('dx', 10)
        .attr('padding', 10)
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "start")
        .attr("fill", "#73716b")
        .attr("font-family", "sans-serif")
        .attr("font-size", "20px")
        .style("opacity", 0);

      var boxTypeTechnique = div2.append('text')
        .attr('dy', 110)
        .attr('dx', 10)
        .attr('padding', 10)
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "start")
        .attr("fill", "#73716b")
        .attr("font-family", "sans-serif")
        .attr("font-size", "20px")
        .style("opacity", 0);

      var boxFunFact = div2.append('text')
        .attr('dy', 135)
        .attr('dx', 10)
        .attr('padding', 10)
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "start")
        .attr("fill", "#73716b")
        .attr("font-family", "sans-serif")
        .attr("font-size", "20px")
        .style("opacity", 0);

      var boxImage = div2.append("svg:a")
        .append("svg:image")
        .style("opacity", 0)
        .attr('dy', 160)
        .attr('dx', 10)
        .attr('padding', 10);

      //When you click on the x mark it should close out the click box
      var close = div2.append('path')
        .attr('d', d3.symbol().type(d3.symbolCross).size(60))
        .attr('stroke', 'gray')
        .attr('fill', 'gray')
        .style("opacity", 0)
        .on("click", function() {
          div2.attr("opacity", "0");
          div2.selectAll("text").text("");
          boxClick.attr("width", 0).attr("height", 0);
          boxImage.attr("width", 0).attr("height", 0);
        });

      div.selectAll('circle')
          .data(dt)
          .enter()
          .append('circle')
          .attr('class',  function(d) { return d.text; })
          .attr('cx', function(d) { return  xScale(d.x); })
          .attr('cy', function(d) { return yScale(d.y); })
          .attr('fill', function(d){return myColor(d.cluster_id)})
          .attr('r', self.state.window_width * 0.002)
          .on("mouseover", function(d){
            divHover
            .attr("transform", "translate(" + (d.x + 10)
              + "," + (d.y + 10) +")")
            .attr("opacity", 1);

            //Adding text
            text.style("opacity", 1)
            .text(jsonData[d['target'].__data__.text]["title"])
            .transition()
            .duration('10');

            //Dynamic text width
            var text_width = text.node().getBBox().width + 15;
            var text_height = text.node().getBBox().height + 10;

            //Hover textbox formatting
            textbox.style("opacity", 1)
            .attr("width", function(d) {return text_width;})
            .attr('height', text_height)
            .transition()
            .duration('10');
          })
          .on("mouseout", function(d) {
            //Make everything in hover have an opacity of 0
            divHover.attr("opacity", 0);

            textbox.transition()
               .duration('10')
               .attr('width', 0)
               .attr('height', 0);

            text.transition()
               .duration('10')
               .text(d['target'].__data__.text);
          })
          .on("click", function(d) {
            //Moving click textbox
            div2.attr("transform", "translate(" + (d.x + 5)
              + "," + (d.y + 5) +")")
            .attr("opacity", 1);

            //statis vs dynamic textbox width


            //make everything have an opacity of 1
            boxText.style("opacity", 1)
            .text(jsonData[d['target'].__data__.text]["title"])
            .transition()
            .duration('10');

            boxTimePeriod.style("opacity", 1)
            .text(jsonData[d['target'].__data__.text]["creation_date_earliest"] + "~" + jsonData[d['target'].__data__.text]["creation_date_latest"])
            .transition()
            .duration('10');

            boxCulture.style("opacity", 1)
            .text(jsonData[d['target'].__data__.text]["culture"])
            .transition()
            .duration('10');

            boxTypeTechnique.style("opacity", 1)
            .text(jsonData[d['target'].__data__.text]["type"]+", " +jsonData[d['target'].__data__.text]["Technique"])
            .transition()
            .duration('10');

            boxFunFact.style("opacity", 1)
            .text(jsonData[d['target'].__data__.text]["fun_fact"])
            .transition()
            .duration('10');

            var text_width = d3.max([boxText.node().getBBox().width, boxTimePeriod.node().getBBox().width
              , boxCulture.node().getBBox().width, boxTypeTechnique.node().getBBox().width, boxFunFact.node().getBBox().width]) + 20;

            var temp = jsonData[d['target'].__data__.text]["image_url"].split("_")
            temp.pop()
            //The box for clicking a node

            boxImage.style("opacity", 1)
            .attr('width', 200)
            .attr('height', 250)
            .attr("transform", "translate(" + 50
              + "," + 135 +")")
            .attr("xlink:href", temp+"_web.jpg")
            .transition()
            .duration('10');

            boxClick.style("opacity", 1)
            .attr("width", function(d) {return text_width + 25;})
            .attr('height', boxImage.node().getBBox().height + 140)
            .transition()
            .duration('10');


            //Todo: add more information based on what's being passed in from backend
            //Appending artists name, maybe picture? general info about the art piece

            close.attr("transform", "translate(" + (text_width + 15) + ", 10) rotate(45)")
            .style("opacity", 1);
          })

      });
    
  }

  render() {
    // debugger
    return (
      <div ref='overall' style={{overflow: "hidden"}}>
        <svg ref='space' />
      </div>
    );
  }
};

export default Graph;
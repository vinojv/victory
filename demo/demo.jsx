/*global window:false*/
import _ from "lodash";
import React from "react";
import { VictoryPie } from "../src/index";
import Slice from "../src/components/slice";

const rand = () => Math.max(Math.floor(Math.random() * 10000), 1000);

const getData = () => {
  return [
    { x: "<5", y: rand(), label: "A", fill: "grey" },
    { x: "5-13", y: rand() },
    { x: "14-17", y: rand() },
    { x: "18-24", y: rand() },
    { x: "25-44", y: rand() },
    { x: "45-64", y: rand() },
    { x: "≥65", y: rand() }
  ];
};

class BorderLabelSlice extends React.Component {
  static propTypes = {
    ...Slice.propTypes,
    index: React.PropTypes.number
  };

  render() {
    const {index} = this.props;

    return (
      <g key={`slice-and-label-${index}`}>
        {this.renderSlice(this.props)}
        {this.renderLabel(this.props)}
      </g>
    );
  }

  renderSlice(props) {
    return <Slice {...props} />;
  }

  renderLabel(props) {
    const {pathFunction, datum, slice, index} = props;

    const path = pathFunction({...slice, endAngle: slice.startAngle});

    const pathId = `textPath-path-${index}`;

    return (
      <g>
        <path id={pathId} d={path} />
        <text>
          <textPath xlinkHref={`#${pathId}`}>
            {datum.label || datum.xName || datum.x}
          </textPath>
        </text>
      </g>
    );
  }

}

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      colorScale: [
        "#D85F49",
        "#F66D3B",
        "#D92E1D",
        "#D73C4C",
        "#FFAF59",
        "#E28300",
        "#F6A57F"
      ],
      sliceWidth: 60,
      style: {
        parent: {
          border: "1px solid #ccc",
          margin: 20
        },
        data: {
          strokeWidth: 2
        },
        labels: {
          fill: "white",
          padding: 10
        }
      }
    };
  }

  componentDidMount() {
    /* eslint-disable react/no-did-mount-set-state */
    this.setStateInterval = window.setInterval(() => {
      this.setState({
        data: getData()
      });
    }, 2000);
  }

  componentWillUnmount() {
    window.clearInterval(this.setStateInterval);
  }

  render() {
    return (
      <div>
        <h1>VictoryPie Demo</h1>

        <VictoryPie
          style={this.state.style}
          events={{
            data: {
              onClick: (evt, props) => {
                return {
                  style: _.assign({}, props.style, {opacity: props.style.opacity === 1 ? 0.6 : 1})
                };
              }
            }
          }}
        />

        <VictoryPie
          style={{
            parent: {border: "1px solid #ccc", margin: 20},
            labels: {fontSize: 20, padding: 100, fill: "white"}
          }}
          colorScale="greyscale"
        />

        <VictoryPie style={this.state.style} innerRadius={140}/>

        <VictoryPie
          style={{
            parent: {border: "1px solid #ccc", margin: 20},
            data: {stroke: "transparent", opacity: 0.4}
          }}
        />

        <VictoryPie style={this.state.style} startAngle={-90} endAngle={90} />

        <VictoryPie
          style={{...this.state.style, labels: {fontSize: 0}}}
          data={this.state.data}
          innerRadius={100}
          animate={{velocity: 0.03}}
          colorScale={this.state.colorScale}
          dataComponent={<BorderLabelSlice />}
        />

        <VictoryPie
          style={this.state.style}
          data={this.state.data}
          innerRadius={100}
          animate={{velocity: 0.03}}
          colorScale={this.state.colorScale}
        />

        <VictoryPie
          style={this.state.style}
          endAngle={90}
          innerRadius={140}
          padAngle={5}
          startAngle={-90}
        />

        <VictoryPie
          data={_.range(0, 6).map((i) => [i, Math.random()])}
          x={0}
          y={1}
          animate={{velocity: 0.03}}
          style={this.state.style}
          colorScale="warm"
        />

        <VictoryPie
          data={_.range(0, 6).map((i) => [i, Math.random()])}
          x={0}
          y={1}
          style={this.state.style}
          animate={{velocity: 0.03}}
          colorScale="qualitative"
        />
      </div>
    );
  }
}

App.propTypes = {
  data: React.PropTypes.array
};

App.defaultProps = {
  data: getData()
};

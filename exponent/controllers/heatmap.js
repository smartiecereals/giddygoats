import axios from 'axios';

let data = [];

axios.get('http://138.68.62.73:3000/testDanger?long=-122.40898400000003&lat=37.7865518&radius=.01')
      .then(function(res) {
        res.forEach(function(dataPoint) {
          var dataObj = {x: dataPoint[0], y: dataPoint[1]}
          data.push(dataObj)
        })
      })

let HeatMap = () => {
  return (
    <ReactHeatmap data={data} />
  )
}
export default HeatMap
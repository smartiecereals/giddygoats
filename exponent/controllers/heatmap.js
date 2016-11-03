import MapView from 'react-native-maps';
import axios from 'axios';

let data = [];

axios.get('http://138.68.62.73:3000/testDanger?long=-122.40898400000003&lat=37.7865518&radius=.01')
      .then(function(res) {
        res.forEach(function(dataPoint) {
          var dataObj = {latitude: dataPoint[0], longitude: dataPoint[1]}
          data.push(dataObj)
        })
      })

let HeatMap = () => {
  return (
    data.map((coordinate) => {
      <MapView.Circle
        center={coordinate}
        radius={10}
        fillColor="rgba(200, 0, 0, 0.5)"
        strokeColor="rgba(0,0,0,0.5)"
      />      
    })
  )
}
export default HeatMap
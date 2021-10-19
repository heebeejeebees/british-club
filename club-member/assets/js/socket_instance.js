var socket = io.connect('http://localhost:3202');

socket.on('roomcontrol', function(data)
{
  if (data.code == 'SWITCH_AMBIENCE')
  {
      if (data.parameter == "FOREST")
      {
        window.location = "/kioskgateway/roomcontrol/ambienceplayer?v=d0tU18Ybcvk";
      }
      else if (data.parameter == "TRAFFIC")
      {
        window.location = "/kioskgateway/roomcontrol/ambienceplayer?v=cDWZkXjDYsc";
      }
      else if (data.parameter == "AIRPORT")
      {
        window.location = "/kioskgateway/roomcontrol/ambienceplayer?v=zQG5OdBnYfA";
      }
      else if (data.parameter == "STOP")
      {
        window.location = "/kioskgateway/roomcontrol/ambienceplayer?v=none";
      }
  }
})

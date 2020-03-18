const fake = [
  {
    "_id": "5915eBa564beb289d1258558",
    "value": 80,
    "detectorType": "temperature",
    "sensor": "588a427d617fff11d79b3049",
    "_timestamp": {
      "amount": "1",
      "unit": "seconds"
    }
  },
  {
    "_id": "5915eBaa64beb289d1258559",
    "value": 80.07,
    "detectorType": "humidity",
    "sensor": "588a427d617fff11d79b3049",
    "_timestamp": {
      "amount": "1",
      "unit": "seconds"
    }
  },
  {
    "_id": "5915eBb464beb289d125855a",
    "value": 1500,
    "detectorType": "co2",
    "sensor": "588a427d617fff11d79b304d",
    "_timestamp": {
      "amount": "1",
      "unit": "seconds"
    }
  },
  {
    "_id": "5915eBa564beb289d1258551",
    "value": 80,
    "detectorType": "temperature",
    "sensor": "588a427d617fff11d79b3049",
    "_timestamp": {
      "amount": "1",
      "unit": "minutes"
    }
  },
  {
    "_id": "5915eBaa64beb289d1258551",
    "value": 80.07,
    "detectorType": "humidity",
    "sensor": "588a427d617fff11d79b3049",
    "_timestamp": {
      "amount": "1",
      "unit": "minutes"
    }
  },
  {
    "_id": "5915eBb464beb289d1258552",
    "value": 1500,
    "detectorType": "co2",
    "sensor": "588a427d617fff11d79b304d",
    "_timestamp": {
      "amount": "1",
      "unit": "minutes"
    }
  },
  {
    "_id": "5915eBa564beb289d1258552",
    "value": 80,
    "detectorType": "temperature",
    "sensor": "588a427d617fff11d79b3049",
    "_timestamp": {
      "amount": "1",
      "unit": "hours"
    }
  },
  {
    "_id": "5915eBaa64beb289d1258552",
    "value": 80.07,
    "detectorType": "humidity",
    "sensor": "588a427d617fff11d79b3049",
    "_timestamp": {
      "amount": "1",
      "unit": "hours"
    }
  },
  {
    "_id": "5915eBb464beb289d1258551",
    "value": 1500,
    "detectorType": "co2",
    "sensor": "588a427d617fff11d79b304d",
    "_timestamp": {
      "amount": "1",
      "unit": "hours"
    }
  }
]

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

fake.map(obj => {
  const {_timestamp,...rest} = obj;
  rest['timestamp'] = randomDate(new Date(2020,3,10), new Date())
  return rest;
});

export default fake;
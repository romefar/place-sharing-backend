const opencage = require('opencage-api-client')

module.exports = async (address) => {
  const placesData = await opencage.geocode({ q: address })
  if (placesData.status.code === 200) {
    if (placesData.results.length > 0) {
      const place = placesData.results[0]
      // you can retrieve timezone/full address and etc. see more at https://opencagedata.com/api#annotations
      return place.geometry
    } else {
      throw new Error(`No places were found for the given address ${address}`)
    }
  } else if (placesData.status.code === 402) {
    throw new Error('Hit free-trial daily limit for opencage API.')
  } else {
    throw new Error(placesData.status.message)
  }
}

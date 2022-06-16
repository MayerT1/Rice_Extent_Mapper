function srtm_optical_indices(Image, ROI){

  var dataset = Image.clip(ROI);
  var elevation = dataset.select('elevation').rename("elevation");
  var slope = ee.Terrain.slope(elevation).rename("slope");     

return elevation.addBands([slope])
}


exports.srtm_optical_indices = srtm_optical_indices

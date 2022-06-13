
function srtm_optical_indices(Image, ROI){

          function maskL8sr(image) {
                  //Bits 3 and 5 are cloud shadow and cloud, respectively.
                var cloudShadowBitMask = (1 << 3);
                var cloudsBitMask = (1 << 5);
                // Get the pixel QA band.
                var qa = image.select('pixel_qa');
                // Both flags should be set to zero, indicating clear conditions.
                var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
                              .and(qa.bitwiseAnd(cloudsBitMask).eq(0));
                return image.updateMask(mask);
              }

          var dataset = maskL8sr(Image.clip(ROI));
          var elevation = dataset.select('elevation').rename("elevation");
          var slope = ee.Terrain.slope(elevation).rename("slope");     

  return elevation.addBands([slope])
}


exports.srtm_optical_indices = srtm_optical_indices

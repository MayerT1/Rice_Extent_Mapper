
function optical_indices(ImageCollection, ROI){

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

          var NDVI = ImageCollection.map(maskL8sr).map(function(image) { 
            var conv =  image.normalizedDifference(['B5', 'B4']).rename('NDVI')
            return  ee.Image(conv.copyProperties(image)).set('system:time_start', image.get('system:time_start')).clip(ROI);//.mosaic()
          }).median()
          
          var NDWI = ImageCollection.map(maskL8sr).map(function(image) { 
            var conv =  image.normalizedDifference(["B3","B5"]).rename('NDWI')
            return  ee.Image(conv.copyProperties(image)).set('system:time_start', image.get('system:time_start')).clip(ROI);
          }).median()

          var MNDWI = ImageCollection.map(maskL8sr).map(function(image) { 
            var conv =  image.normalizedDifference(["B3","B6"]).rename('MNDWI')
            return  ee.Image(conv.copyProperties(image)).set('system:time_start', image.get('system:time_start')).clip(ROI);
          }).median()
          
          var SAVI = ImageCollection.map(maskL8sr).map(function(image) { 
            var conv =  image.expression('((NIR - RED) / (NIR + RED + 0.5))*(1.5)', {
                                          'NIR': image.select('B5'),
                                          'RED': image.select('B4')}).rename("SAVI")
            return  ee.Image(conv.copyProperties(image)).set('system:time_start', image.get('system:time_start')).clip(ROI);
          }).median()
                
          var NDMI = ImageCollection.map(maskL8sr).map(function(image) { 
            var conv =  image.normalizedDifference(["B5","B6"]).rename('NDMI')
            return  ee.Image(conv.copyProperties(image)).set('system:time_start', image.get('system:time_start')).clip(ROI);
          }).median()
            
          var NDBI  = ImageCollection.map(maskL8sr).map(function(image) { 
            var conv =  image.normalizedDifference(["B6","B5"]).rename('NDBI')
            return  ee.Image(conv.copyProperties(image)).set('system:time_start', image.get('system:time_start')).clip(ROI);
          }).median()

  return NDVI.addBands([NDWI, MNDWI, SAVI, NDMI, NDBI])
}


exports.optical_indices = optical_indices

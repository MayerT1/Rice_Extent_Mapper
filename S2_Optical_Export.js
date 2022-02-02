function optical_indices_S2(ImageCollection, ROI){

              function maskS2clouds(image) {
                var qa = image.select('QA60');
              
                // Bits 10 and 11 are clouds and cirrus, respectively.
                var cloudBitMask = 1 << 10;
                var cirrusBitMask = 1 << 11;
              
                // Both flags should be set to zero, indicating clear conditions.
                var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
                    .and(qa.bitwiseAnd(cirrusBitMask).eq(0));
              
                return image.updateMask(mask).divide(10000);
              }

          var S2_NDVI = ImageCollection.map(maskS2clouds).map(function(image) { 
            var conv =  image.normalizedDifference(['B8', 'B4']).rename('S2_NDVI')
            return  ee.Image(conv.copyProperties(image)).set('system:time_start', image.get('system:time_start')).clip(ROI);//.mosaic()
          }).median()
          
          var S2_NDWI = ImageCollection.map(maskS2clouds).map(function(image) { 
            var conv =  image.normalizedDifference(["B3","B8"]).rename('S2_NDWI')
            return  ee.Image(conv.copyProperties(image)).set('system:time_start', image.get('system:time_start')).clip(ROI);
          }).median()

          var S2_MNDWI = ImageCollection.map(maskS2clouds).map(function(image) { 
            var conv =  image.normalizedDifference(["B3","B11"]).rename('S2_MNDWI')
            return  ee.Image(conv.copyProperties(image)).set('system:time_start', image.get('system:time_start')).clip(ROI);
          }).median()
          
          var S2_SAVI = ImageCollection.map(maskS2clouds).map(function(image) { 
            var conv =  image.expression('((NIR - RED) / (NIR + RED + 0.5))*(1.5)', {
                                          'NIR': image.select('B8'),
                                          'RED': image.select('B4')}).rename("S2_SAVI")
            return  ee.Image(conv.copyProperties(image)).set('system:time_start', image.get('system:time_start')).clip(ROI);
          }).median()
                
          var S2_NDMI = ImageCollection.map(maskS2clouds).map(function(image) { 
            var conv =  image.normalizedDifference(["B8","B11"]).rename('S2_NDMI')
            return  ee.Image(conv.copyProperties(image)).set('system:time_start', image.get('system:time_start')).clip(ROI);
          }).median()
            
          var S2_NDBI  = ImageCollection.map(maskS2clouds).map(function(image) { 
            var conv =  image.normalizedDifference(["B11","B8"]).rename('S2_NDBI')
            return  ee.Image(conv.copyProperties(image)).set('system:time_start', image.get('system:time_start')).clip(ROI);
          }).median()
          
          return S2_NDVI.addBands([S2_NDWI, S2_MNDWI, S2_SAVI, S2_NDMI, S2_NDBI])
}

exports.optical_indices_S2 = optical_indices_S2
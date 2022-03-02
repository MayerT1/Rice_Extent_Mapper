
function Date_splitter (ImageCollection,Month_range1, Month_range2, Year_Range1, Year_Range2, ROI){
          var Selected_Month_Year_IC = ee.ImageCollection(ImageCollection.filter(ee.Filter.calendarRange(Month_range1,Month_range2,'month')).filter(ee.Filter.calendarRange(Year_Range1,Year_Range2,'year'))).filterBounds(ROI)
     return Selected_Month_Year_IC
}


exports.Date_splitter = Date_splitter


////
///https://www.linkedin.com/pulse/time-series-landsat-data-google-earth-engine-andrew-cutts/

// var ROI = ee.FeatureCollection("USDOS/LSIB_SIMPLE/2017").filter(ee.Filter.eq('country_na','Bhutan'));
// Map.centerObject(ROI)

// var ls8 = ee.ImageCollection("LANDSAT/LC08/C01/T2_SR").filterBounds(ROI)

// function date_picker (ImageCollection, Date1, Date2){
//           var IC = ee.ImageCollection(ImageCollection.filterDate(Date1, Date2))
//     return IC
// }

// var a = date_picker(ls8,BASE_DATE, BASE_DATE.advance(2, 'months'))
// print("a",a)
// Map.addLayer(a, {}, "A_map")






//////////////////
// var months = ee.List.sequence(0, 18*12).map(function(n) {
//   var start = ee.Date('2013-05-01').advance(n, 'month')
//   var end = start.advance(1, 'month')
//   return ee.ImageCollection("LANDSAT/LC08/C01/T2_SR").filterDate(start, end)
// })
// print(months.get(95))
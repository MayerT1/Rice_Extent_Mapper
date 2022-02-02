// var ROI = ee.FeatureCollection("USDOS/LSIB_SIMPLE/2017").filter(ee.Filter.eq('country_na','Bhutan'));
// Map.centerObject(ROI)

// var LS8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR').filterBounds(ROI)
// ////////////


// var list_month = [5, 6, 7, 8, 9, 10]
// var list_year = [2015, 2016, 2017, 2018, 2019, 2020]

////


function Time_Period_Selector (ImageCollection, list_m, list_y){
       var Selected_Month_Year_IC =  list_y.map(function (y) {
         var list_ic = list_m.map(function (m) {
           var xic = ImageCollection.filter(
             ee.Filter.date(ee.Date.fromYMD(y, m, 1), ee.Date.fromYMD(y, m, 30))
            );
            return xic.toList(xic.size())
         });
         return ee.List(list_ic).flatten();
       });
      return ee.List(Selected_Month_Year_IC).flatten();
}





// var finalCollection =  ee.ImageCollection(Time_Period_Selector(LS8, list_month, list_year)).sort('system:time_start')
// print('finalCollection', finalCollection.limit(1000))



exports.Time_Period_Selector = Time_Period_Selector

///////
// function Time_Period_Selector (ImageCollection, list_m, list_y){
//       var Selected_Month_Year_IC =  list_year.map(function (y) {
//         var list_ic = list_month.map(function (m) {
//           var xic = ImageCollection.filter(
//             ee.Filter.date(ee.Date.fromYMD(y, m, 1), ee.Date.fromYMD(y, m, 30))
//             );
//             return xic.toList(xic.size())
//         });
//         return ee.List(list_ic).flatten();
//       });
//       return ee.List(Selected_Month_Year_IC).flatten();
// }
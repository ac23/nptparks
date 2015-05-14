angular.module('starter.services', [])
.factory('Directory', function($cordovaSQLite, $window) {

    var parks = [];
    
    var query = "SELECT id, type, lat, lng, name, img, GROUP_CONCAT(use) as categories, comments FROM parks GROUP BY name UNION select id, type, lat, lng, name, img, use, comments FROM cemeteries GROUP BY name";

        $cordovaSQLite.execute(db, query, []).then(function(res) {
            if(res.rows.length > 0) {
    			var lat = document.getElementById('currentLat').innerHTML;
				var lng = document.getElementById('currentLng').innerHTML;
				for(var i = 0; i < res.rows.length; i++) {
                	var row = {};
                	row.name = res.rows.item(i).name;
                	row.lat = res.rows.item(i).lat;
                	row.lng = res.rows.item(i).lng;
                	row.id = res.rows.item(i).id;
                	row.type = res.rows.item(i).type;
                	row.img = res.rows.item(i).img;
                	row.comments = res.rows.item(i).comments;
                	row.categories = res.rows.item(i).categories;
                
                	parks.push(row);
                }
            } else {
                console.log("No results found");
            }
        }, function (error) {
            console.error(JSON.stringify(error));
        });
	
  return {
    nearby: function(categories) {
    var parks = [];
    
    if (categories !== undefined) {
    	console.log('cats logged');
    	var newCats = '';
  		for(var i = 0; i < categories.length; i++) {
  			newCats = newCats+"'"+categories[i].name+"',";
 		 }
  		newCats = newCats.replace(/,\s*$/, "");
    	//console.log('cats: '+newCats);
  		
    	var query = "SELECT id, type, lat, lng, name, img, GROUP_CONCAT(use) as categories, comments FROM parks WHERE use IN("+newCats+") GROUP BY id UNION select id, type, lat, lng, name, img, use, comments FROM cemeteries WHERE use IN("+newCats+") GROUP BY id";
    }
    else {
    console.log('no cats passed');
    	var query = "SELECT id, type, lat, lng, name, img, GROUP_CONCAT(use) as categories, comments FROM parks GROUP BY name UNION select id, type, lat, lng, name, img, use, comments FROM cemeteries GROUP BY name";
    }
    
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            if(res.rows.length > 0) {
    			var lat = document.getElementById('currentLat').innerHTML;
				var lng = document.getElementById('currentLng').innerHTML;
				for(var i = 0; i < res.rows.length; i++) {
                	var row = {};
                	var distance = getDistance(lat, lng, res.rows.item(i).lat, res.rows.item(i).lng);
                	row.name = res.rows.item(i).name;
                	row.lat = res.rows.item(i).lat;
                	row.lng = res.rows.item(i).lng;
                	row.id = res.rows.item(i).id;
                	row.type = res.rows.item(i).type;
                	row.img = res.rows.item(i).img;
                	row.categories = res.rows.item(i).categories;
                	row.comments = res.rows.item(i).comments;
                	row.distance = Math.round(distance*100)/100;
                	
                	parks.push(row);
                }
                //console.log('Query Executed-------------------------------');
        //console.log(parks);
    	for (var i = 0; i < parks.length; i++) {
          //console.log(parks[i].name);
      	}
            } else {
                console.log("No results found");
            }
        }, function (error) {
            console.error(JSON.stringify(error));
        });
      return parks;
    },
    get: function(type, viewID) {
    console.log('type: '+type+' id: '+viewID);
        
        console.log('parks: '+parks);
    
      for (var i = 0; i < parks.length; i++) {
        if (parks[i].id == viewID && parks[i].type == type) {
        	console.log('this one: '+parks[i]);
          return parks[i];
        }
      }
      console.log('null!');
      
      return null;
    }
  };
  
  
})
.factory('Categories', function($cordovaSQLite) {
	
	var cats = [];
	var query = "SELECT use FROM parks GROUP BY use UNION SELECT use FROM cemeteries GROUP BY use";
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            if(res.rows.length > 0) {
				for(var i = 0; i < res.rows.length; i++) {
                	var cat = {};
                	cat.name = res.rows.item(i).use;
                	cats.push(cat);
                }
                
            } else {
                console.log("No results found");
            }
        }, function (error) {
            console.error(JSON.stringify(error));
        });
	
  return {
    list: function() {
      return cats;
    },
    get: function(type, viewID) {
      for (var i = 0; i < parks.length; i++) {
        if (parks[i].id == viewID && parks[i].type == type) {
          return parks[i];
        }
      }
      return null;
    }
  };
})
;
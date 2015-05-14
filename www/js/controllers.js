angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {

})

.controller("MapCtrl", function($scope, $stateParams, $cordovaSQLite, $timeout, $location, $state) {
 	
 	$scope.activeFilters = JSON.parse(window.localStorage['activeFilters'] || '{}');
 	
    $scope.mapAllParks = function() {
    var div = document.getElementById("map_canvas");
    var map = plugin.google.maps.Map.getMap(div);
    
    var newCats = '';
  	map.clear();
  	for(var i = 0; i < $scope.activeFilters.length; i++) {
  		newCats = newCats+"'"+$scope.activeFilters[i].name+"',";
  	}
  	newCats = newCats.replace(/,\s*$/, "");
  
    var query = "SELECT id, type, lat, lng, name, GROUP_CONCAT(use) as categories, comments, img FROM parks WHERE use IN("+newCats+") GROUP BY name UNION select id, type, lat, lng, name, use, comments, img FROM cemeteries WHERE use IN("+newCats+") GROUP BY name";
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            if(res.rows.length > 0) {
            var allMarkers = [];
            var park = '';
                for(var i = 0; i < res.rows.length; i++) {
                	park = res.rows.item(i);
                	var MAP_POINT = new plugin.google.maps.LatLng(res.rows.item(i).lat, res.rows.item(i).lng);
                    var marker = map.addMarker({
						'position': MAP_POINT,
						'title': res.rows.item(i).name,
						'icon': 'www/img/'+res.rows.item(i).type+'Icon.png',
						'snippet': res.rows.item(i).categories,
						'link': '#/tab/view?type='+res.rows.item(i).type+'&viewID='+res.rows.item(i).id,
						'parkType': res.rows.item(i).type,
						'viewID': res.rows.item(i).id,
						'img': res.rows.item(i).img,
						'comments': res.rows.item(i).comments,
						'categories': res.rows.item(i).categories
					}, function(marker) {
						var link = marker.get('link');
						var title = marker.get('title');
						var img = marker.get('img');
						var parkType = marker.get('parkType');
						var parkViewID = marker.get('viewID');
						var categories = marker.get('categories');
						var comments = marker.get('comments');
						//console.log(marker);
						//console.log('link: '+link);
						marker.addEventListener(plugin.google.maps.event.INFO_CLICK, function() {
							//console.log('#/tab/view/'+res.rows.item(i).type+'/'+res.rows.item(i).id);
							//console.log('map type: '+parkType+', id: '+parkViewID);
							//var details = {type: parkType, viewID: parkViewID};
							//$state.go('tab.view-detail', details, {reload: true});
							
							$('#map_canvas').hide();
							
							$('#details').find('h2').text(title);
							$('#photo').attr('src', 'img/'+img);
							$('#details').find('.comments').text(comments);
							$('#details').find('.categories').text(categories);
							$('#details').show();
							//$rootScope.$apply();
							
							$('.close').click(function() {
								$('#map_canvas').show();
								$('#details').hide();
							});
							
							
  						});
					});
                }
                return allMarkers;
            } else {
                console.log("No results found");
            }
        }, function (error) {
            console.error(JSON.stringify(error));
        });
    }
    
    $timeout(function(){
    	$scope.mapAllParks();
  	}, 1000);
  	
 
})

.controller('AboutCtrl', function($scope, $cordovaSQLite) {


  
})

.controller('ViewDetailCtrl', function($scope, $stateParams, $cordovaSQLite, $ionicLoading, Directory, Categories, $state) {
  
  $scope.park = Directory.get($stateParams.type, $stateParams.viewID);
  console.log('parkTop: '+$scope.park);
  $scope.getDirections = function(lat, lng) {
  	var yourLocation = document.getElementById('currentLat').innerHTML+','+document.getElementById('currentLng').innerHTML;
  	plugin.google.maps.external.launchNavigation({
          "from": yourLocation,
          "to": lat+','+lng
        });
  }
  
  $scope.viewMap = function(lat, lng) {
  $state.go('tab.dash');
  	var div = document.getElementById("map_canvas");
  	var map = plugin.google.maps.Map.getMap(div);
  	var POINT = new plugin.google.maps.LatLng(lat, lng);
  	map.animateCamera({
  'target': POINT,
  'zoom': 18,
	});
  }
  
$scope.categories = [
  {"name":"Baseball"},
  {"name":"Basketball"},
  {"name":"Beach"},
  {"name":"Cemetery"},
  {"name":"Football"},
  {"name":"Gazebo"},
  {"name":"High Jump"},
  {"name":"Long Jump"},
  {"name":"Merry Go Round"},
  {"name":"Picnic Facility"},
  {"name":"Playground"},
  {"name":"Pole Vault"},
  {"name":"Skateboarding"},
  {"name":"Soccer"},
  {"name":"Tennis"},
  {"name":"Throwing Field"},
  {"name":"Track"},
  {"name":"Volleyball"}
];


if (typeof window.localStorage['activeFilters'] === 'undefined') {
window.localStorage['activeFilters'] = angular.toJson($scope.categories);
}

var storedFilters = JSON.parse(window.localStorage['activeFilters'] || '{}');

$scope.activeFilters = storedFilters;

$scope.parks = Directory.nearby($scope.activeFilters);

/*Categories.list();*/

$scope.updateFilter = function() {
  console.log('update filter');
  var div = document.getElementById("map_canvas");
  var map = plugin.google.maps.Map.getMap(div);
  var newCats = '';
  map.clear();
  for(var i = 0; i < $scope.activeFilters.length; i++) {
  	newCats = newCats+"'"+$scope.activeFilters[i].name+"',";
  }
  newCats = newCats.replace(/,\s*$/, "");
  window.localStorage['activeFilters'] = angular.toJson($scope.activeFilters);
  var div = document.getElementById("map_canvas");
    var map = plugin.google.maps.Map.getMap(div);
        var query = "SELECT id, type, lat, lng, name, GROUP_CONCAT(use) as categories, comments, img FROM parks WHERE use IN("+newCats+") GROUP BY name UNION select id, type, lat, lng, name, use, comments, img FROM cemeteries WHERE use IN("+newCats+") GROUP BY name";
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            if(res.rows.length > 0) {
            var allMarkers = [];
            var park = '';
                for(var i = 0; i < res.rows.length; i++) {
                	park = res.rows.item(i);
                	var MAP_POINT = new plugin.google.maps.LatLng(res.rows.item(i).lat, res.rows.item(i).lng);
                    var marker = map.addMarker({
						'position': MAP_POINT,
						'title': res.rows.item(i).name,
						'icon': 'www/img/'+res.rows.item(i).type+'Icon.png',
						'snippet': res.rows.item(i).categories,
						'link': '#/tab/view?type='+res.rows.item(i).type+'&viewID='+res.rows.item(i).id,
						'parkType': res.rows.item(i).type,
						'viewID': res.rows.item(i).id,
						'img': res.rows.item(i).img,
						'comments': res.rows.item(i).comments,
						'categories': res.rows.item(i).categories
					}, function(marker) {
						var link = marker.get('link');
						var title = marker.get('title');
						var img = marker.get('img');
						var parkType = marker.get('parkType');
						var parkViewID = marker.get('viewID');
						var categories = marker.get('categories');
						var comments = marker.get('comments');
						//console.log(marker);
						//console.log('link: '+link);
						marker.addEventListener(plugin.google.maps.event.INFO_CLICK, function() {
							//console.log('#/tab/view/'+res.rows.item(i).type+'/'+res.rows.item(i).id);
							//console.log('map type: '+parkType+', id: '+parkViewID);
							//var details = {type: parkType, viewID: parkViewID};
							//$state.go('tab.view-detail', details, {reload: true});
							
							$('#map_canvas').hide();
							
							$('#details').find('h2').text(title);
							$('#photo').attr('src', 'img/'+img);
							$('#details').find('.comments').text(comments);
							$('#details').find('.categories').text(categories);
							$('#details').show();
							//$rootScope.$apply();
							
							$('.close').click(function() {
								$('#map_canvas').show();
								$('#details').hide();
							});
							
							
  						});
					});
                }
                return allMarkers;
            } else {
                console.log("No results found");
            }
        }, function (error) {
            console.error(JSON.stringify(error));
        });
};

})

.controller('FilterCtrl', function($scope, $stateParams, $cordovaSQLite, Categories) {

});
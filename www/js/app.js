(function () {
    'use strict';
    //dataURL: 'http://webmasterstechnologies.com/WNCatlog/   http://5.32.16.10/ProductCatlogApi/
    //'http://5.32.16.10/ProductCatlog/Images/100/', http://localhost:49339/images/ http://172.16.1.80/ProductCatlogAPI/Images/
    
    angular.module('Catlog', ['ionic', 'ngCordova', 'ngLodash'])
        .value('AppUrls', {
            imageURL: 'http://5.32.16.10/ProductCatalog/Images/100/',
            dataURL: 'http://5.32.16.10/ProductCatalogApi/',
            pageSize: 1000
        })
    .run(function ($ionicPlatform, $rootScope, $ionicLoading) {

        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            
            console.log(cordova.file);
            if (window.cordova && window.cordova.plugins.Keyboard) {
                window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            $rootScope.isIPad = ionic.Platform.isIPad();
            $rootScope.$apply();
            $rootScope.$on('loading:show', function () {
                $ionicLoading.show();
            });

            $rootScope.$on('loading:hide', function () {
                $ionicLoading.hide();
            });

        });
    }).
    config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider',
            function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

            $ionicConfigProvider.views.maxCache(2);
            $urlRouterProvider.otherwise('/main/taglist/0');
                

            if (!ionic.Platform.isIOS()) {
                $ionicConfigProvider.scrolling.jsScrolling(false);
            }

            $stateProvider.
            state('main', {
                url: "/main",
                abstract: true,
                templateUrl: 'js/View/main.html'
            }).
            state('main.tagList', {
                cache: false,
                url: "/taglist/:id",
                views: {
                    'main': {
                        templateUrl: 'js/View/tagList.html'
                    }
                }
            }).
            state('main.tagDetail', {
                cache: false,
                url: "/tagdetail/:id",
                views: {
                    'main': {
                        templateUrl: 'js/View/tagdetail.html'
                    }
                }

            }).
            state('main.syncData', {
                url: "/syncdata",
                views: {
                    'main': {
                        templateUrl: 'js/View/syncData.html'
                    }
                }
            }).
            state('main.filterOption', {
                url: "/filteroption/:id",
                views: {
                    'main': {
                        templateUrl: 'js/View/filterOption.html'
                    }
                }
            });
   }]).
    filter('to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
                }]);
    //    .run(['$rootScope', '$state',  '$http', 'webApiUrl',
    //                function ($rootScope, $state, $http, webApiUrl) {
    // keep user logged in after page refresh
    //$rootScope.globals = $cookieStore.get('globals') || {};

    //            if ($rootScope.globals.currentUser) {
    //                $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    //            };

    //            $rootScope.$on('$stateChangeStart',
    //                function (event, toState, toParams, fromState, fromParams) {
    //                    if (toState.name !== 'Login' && !$rootScope.globals.currentUser) {
    //                        event.preventDefault();
    //                    }
    //
    //
    //                })

    //                }]);
    //                })
})();
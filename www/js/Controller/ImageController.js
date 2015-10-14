(function () {
    'use strict';

    angular
        .module('Catlog')
        .controller('ImageController', ImageController);

    ImageController.$inject = ['$scope',
                               '$rootScope',
                               '$ionicPlatform',
                               '$cordovaFileTransfer',
                               '$ionicLoading',
                               '$timeout',
                               '$interval',
                               '$q',
                               '$state',
                               '$stateParams',
                               '$ionicSlideBoxDelegate',
                               '$ionicScrollDelegate',
                               'lodash',
                               'AppUrls',
                               'TagService'];

    //--------------------------------------------------------//
    function ImageController($scope,
        $rootScope,
        $ionicPlatform,
        $cordovaFileTransfer,
        $ionicLoading,
        $timeout,
        $interval,
        $q,
        $state,
        $stateParams,
        $ionicSlideBoxDelegate,
        $ionicScrollDelegate,
        lodash,
        AppUrls,
        TagService) {


        var vm = this;

        var level1Property = 'Brand';
        var level2Property = 'JewelleryType';

        vm.level1Index = '';
        vm.level2Index = '';



        
        if (($stateParams.id) && ($stateParams.id !== '0')) {
            var strParams = $stateParams.id.split("~");
            if (strParams.length === 2) {
                vm.level1Index = strParams[0];
                vm.level2Index = strParams[1];
            }else{
                vm.level1Index = strParams[0];
            };
        };


        vm.images = [];
        vm.tags = []; // = TagService.Tags;
        vm.SyncTags = [];
        vm.Status = "";
        vm.itemwidth = "33%";
        vm.itemheight = "260px";
        vm.imageClass = "image3column";

        vm.startnooftag = 0;
        vm.endnooftag = 5;

        vm.currentView = 0;

        vm.syncimages = syncimages;
        vm.loadimages = loadimages;
        vm.filterview = filterview;
        vm.backview = backview;
        vm.gotoview = gotoview;
        vm.drilldown = drilldown;
        vm.filterOn = 0;

        vm.currentTag = {};
        vm.slideIndex = 0;

        if (ionic.Platform.isIPad()){
            vm.itemwidth = "33%";
            vm.itemheight = "260px";
            vm.imageClass= "image3column";
            vm.Status = '<img src="img/icon.png" height="25px" style="padding-top:8px"> ver 1.3.3';
        }else{
            vm.itemwidth = "50%";
            vm.itemheight = "160px";
            vm.imageClass = "image2column";
            vm.Status = '<img src="img/icon.png" height="25px" style="padding-top:8px"> ver 1.3.3';
        };

        $rootScope.$on('applyFilter', function (event, data) {
            
            console.log(vm);                
            vm.filterOn = data;
            console.log(vm);                
            
            
            
            //loadimages();
        });

        TagService.initDB();

    
        loadimages()

        var tagImageDownloader = {
            totaltag: 0,
            images: [],
            tags: [],
            downloadTagsImage: function () {

                var _this = this; // for use in the callbacks

                if (_this.tags.length === 0) {
                    return;
                }

                var currnetTag = _this.tags.pop()
                var imageName = currnetTag.SRNo; // just the image name (eg image1.jpg)
                var url = "";
                var targetPath = "";
                var trustHosts = true
                var options = {};
                var i = 0;

                console.log(imageName);
                url = "http://5.32.16.10/ProductCatlog/Images/100/" + imageName + '.jpg';

                targetPath = cordova.file.dataDirectory + "Images/" + imageName + '.jpg';

                $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
                    .then(function (result) {
                        _this.images.push({
                            id: (_this.totaltag - _this.tags.length),
                            src: targetPath,
                            tagno: imageName
                        });
                        _this.downloadTagsImage();
                    }, function (err) {
                        _this.downloadTagsImage();

                    }, function (progress) {
                        console.log(_this.tags.length);
                        vm.Status = 'Downloading  ' + imageName + ' ' + (_this.totaltag - _this.tags.length).toString() + ' out of ' + _this.totaltag.toString();
                    });


            }
        }

        function loadimages() {

            var i = 0;
//            TagService.getAlltags().then(function (result) {
//            vm.tags = result;

            if (vm.level2Index === '') {
                if (vm.level1Index === '') {
                    showimages(0)
                } else {
                    showimages(1)
                }

            } else {
                showimages(2)
            }
//           $rootScope.$broadcast('loading:hide');
//            });
        };

        function filterview() {
            
            $state.go('main.filterOption', {
                    id: $stateParams.id
                });

        }

        function backview() {
            showimages(vm.currentView - 1)
        }
        
        function gotoview(passview) {
            showimages(passview)
        }


        function showimages(passview) {

            var countTags = 0;

            var lastSRNo = '';
            vm.images = [];
            vm.currentView = passview;

            switch (vm.currentView) {
            case 0:

                vm.level1Index = '';
                vm.level2Index = '';
                $ionicLoading.show();
                TagService.getGroupLevel1tags().then(function (result) {
                    vm.images = result;
                    $ionicLoading.hide();
                });
                break;

            case 1:


                vm.level2Index = ''
                
                $ionicLoading.show();
                TagService.getGroupLevel2tags(vm.level1Index).then(function (result) {
                     vm.images = result;
                    $ionicLoading.hide();
                    $ionicScrollDelegate.scrollTop();
                })
                break;

            case 2:

                
                $ionicLoading.show();
                TagService.getBottomLeveltags(vm.level1Index, vm.level2Index).then(function (result) {
                     vm.images = result;
                     $ionicLoading.hide();
                    $ionicScrollDelegate.scrollTop();
                })

                break;
            }
        };


        function syncimages() {

            vm.Status = "Start Downloading  ";
            $ionicPlatform.ready(function () {
                try {


                    TagService.getSyncTags().then(function (result) {
                        vm.SyncTags = result.data;

                        angular.forEach(vm.SyncTags, function (value, key) {
                            vm.tags.push(value)
                        });



                        vm.endnooftag = vm.tags.length;
                        vm.startnooftag = 0

                        var totaltags = vm.endnooftag - vm.startnooftag;
                        vm.Status = "Platform ready"
                        var url = "";
                        var targetPath = "";
                        var trustHosts = true
                        var options = {};
                        var i = 0;
                        var promises = [];

                        vm.images = []

                        vm.Status = "Getting images"
                        if (cordova.file.dataDirectory) {
                            vm.Status = cordova.file.dataDirectory + "Images/"
                        } else {
                            vm.Status = "Cannot Access Data directory"
                        };

                        tagImageDownloader.tags = vm.tags.slice(vm.startnooftag, vm.endnooftag);
                        tagImageDownloader.totaltag = vm.endnooftag - vm.startnooftag;
                        tagImageDownloader.downloadTagsImage();

                        TagService.addTags(vm.SyncTags);

                        vm.images = tagImageDownloader.images;
                    });

                } catch (err) {
                    vm.Status = err.message;
                }
            });

        };

        function drilldown(id) {

            switch (vm.currentView) {
            case 0:
                
                vm.level1Index = id;
                vm.level2Index = '';

                showimages(1)
                break;
            case 1:
                
                vm.level2Index = id;
                showimages(2)
                break;
            case 2:

                $state.go('main.tagDetail', {
                    id: vm.level1Index.toString() + '~' + vm.level2Index.toString() + '~' + id.toString()
                });
                break;
            }
        };

    }

})();
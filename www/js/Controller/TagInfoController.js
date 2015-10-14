(function () {
    'use strict';

    angular
        .module('Catlog')
        .controller('TagInfoController', TagInfoController);

    TagInfoController.$inject = ['$scope',
                                 '$ionicSlideBoxDelegate',
                                 '$ionicHistory',
                                 '$state',
                                 '$stateParams',
                                 '$q',
                                 '$timeout',
                                 'lodash',
                                 'AppUrls',
                                 'TagService'];

    //--------------------------------------------------------//
    function TagInfoController(
        $scope,
        $ionicSlideBoxDelegate,
        $ionicHistory,
        $state,
        $stateParams,
        $q,
        $timeout,
        lodash,
        AppUrls,
        TagService) {

        var vm = this;

        var strParams = $stateParams.id.split("~");

        vm.slides = [{}, {}, {}];
        vm.selectedSlide = 1;
        vm.previous = previous;
        vm.next = next;
        vm.slideChanged = slideChanged;
        vm.closetagDetail = closetagDetail;
        vm.gotoview = gotoview;
        vm.tagIndex = 1;
        vm.totaltag = 1

        vm.title = '<img src="img/icon.png" height="25px" style="padding-top:8px"> ver 1.3.1';

        vm.brandIndex = strParams[0];
        vm.jewelleryTypeIndex = strParams[1];
        vm.id = strParams[2];

        var tags = [];
        var direction = 0;
        var currentIndex = 1;
        var default_slides_indexes = [-1, 0, 1];
        var default_slides = [];


        var makeSlide = function (nr, data) {
            return angular.extend(data, {
                nr: nr
            });
        };


        var head;
        var tail;

        activate()

        function activate() {


            var prvIndex;
            var nxtIndex;


            TagService.getBottomLeveltags(vm.brandIndex, vm.jewelleryTypeIndex).then(function (res) {

                tags = res;
                vm.totaltag = tags.length;

                currentIndex = lodash.findIndex(tags, function (img) {
                    return img.id.toString() === vm.id.toString();
                });

                vm.tagIndex = currentIndex;

                if (currentIndex <= 0) {
                    prvIndex = tags.length - 1;
                } else {
                    prvIndex = currentIndex - 1
                };

                if (currentIndex >= tags.length - 1) {
                    nxtIndex = 0
                } else {
                    nxtIndex = currentIndex + 1;
                };

                default_slides = [
                                    makeSlide(default_slides_indexes[0], {
                        currentTag: tags[prvIndex].tagInfo,
                        imagesrc: tags[prvIndex].src
                    }),
                                    makeSlide(default_slides_indexes[1], {
                        currentTag: tags[currentIndex].tagInfo,
                        imagesrc: tags[currentIndex].src
                    }),
                                makeSlide(default_slides_indexes[2], {
                        currentTag: tags[nxtIndex].tagInfo,
                        imagesrc: tags[nxtIndex].src
                    })
                                ];

                vm.slides = angular.copy(default_slides);

                head = vm.slides[0].nr;
                tail = vm.slides[vm.slides.length - 1].nr;
                console.log(vm.slides);
                $ionicSlideBoxDelegate.update();

            });

        };


        function closetagDetail() {
            $state.go('main.tagList', {
                id: vm.brandIndex.toString() + '~' + vm.jewelleryTypeIndex.toString()
            });
        };

        function gotoview(passview) {
            switch (passview) {
            case 0:
                $state.go('main.tagList', {
                    id: '0'
                });
                break;
            case 1:
                $state.go('main.tagList', {
                    id: vm.brandIndex.toString()
                });
                break;
            case 2:
                $state.go('main.tagList', {
                    id: vm.brandIndex.toString() + '~' + vm.jewelleryTypeIndex.toString()
                });
                break;
            };
        }


        function previous() {
            $ionicSlideBoxDelegate.previous();
        };

        function next() {
            $ionicSlideBoxDelegate.next();
        };


        function slideChanged(i) {
            var
                previous_index = i === 0 ? 2 : i - 1,
                next_index = i === 2 ? 0 : i + 1,
                new_direction = vm.slides[i].nr > vm.slides[previous_index].nr ? 1 : -1;


            currentIndex = currentIndex + new_direction;

            if (currentIndex < 0) {
                currentIndex = tags.length - 1;
            };

            if (currentIndex >= tags.length) {
                currentIndex = 0
            };

            vm.tagIndex = currentIndex;

            angular.copy(
                createSlideData(new_direction, direction),
                vm.slides[new_direction > 0 ? next_index : previous_index]
            );
            direction = new_direction;

        };

        var createSlideData = function (new_direction, old_direction) {
            var nr;

            if (new_direction === 1) {
                tail = old_direction <= 0 ? head + 3 : tail + 1;
            } else {
                head = old_direction >= 0 ? tail - 3 : head - 1;
            };


            nr = (new_direction === 1) ? tail : head;
            if (default_slides_indexes.indexOf(nr) !== -1) {
                return default_slides[default_slides_indexes.indexOf(nr)];
            };



            return makeSlide(nr, {
                currentTag: tags[currentIndex].tagInfo,
                imagesrc: tags[currentIndex].src
            });

        };

    }
})();
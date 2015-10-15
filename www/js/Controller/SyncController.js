(function () {
    'use strict';

    angular
        .module('Catlog')
        .controller('SyncController', SyncController);

    SyncController.$inject = ['$ionicPlatform',
                              '$cordovaFileTransfer',
                              '$q',
                             'lodash',
                              'AppUrls',
                              'TagService'];

    //--------------------------------------------------------//
    function SyncController($ionicPlatform,
        $cordovaFileTransfer,
        $q,
        lodash,
        AppUrls,
        TagService) {

        var vm = this;

        vm.tagNo = ''
        vm.tags = []; // = TagService.Tags;
        vm.syncimages = syncimages;
        vm.Status = "";
        vm.title = '<img src="img/icon.png" height="25px" style="padding-top:8px"> ver 1.3.3';

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


                url = AppUrls.imageURL + imageName + '.jpg';

                if (window.cordova) {
                    targetPath = cordova.file.dataDirectory + "Images/" + imageName + '.jpg';

                    $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
                        .then(function (result) {
                            _this.images.push({
                                id: (_this.totaltag - _this.tags.length),
                                src: targetPath,
                                tagno: imageName
                            });
                            currnetTag.id = currnetTag.Brand + currnetTag.JewelleryType + currnetTag.SRNo;

                            TagService.updatetag(currnetTag)

                            TagService.updatelookuptag({
                                "_id": "1Location" + currnetTag.Location,
                                "doctype": "Location",
                                "value": currnetTag.Location
                            });
                            TagService.updatelookuptag({
                                "_id": "2Category" + currnetTag.Category,
                                "doctype": "Category",
                                "value": currnetTag.Category
                            });
                            TagService.updatelookuptag({
                                "_id": "3SubCategory" + currnetTag.SubCategory,
                                "doctype": "4SubCategory",
                                "value": currnetTag.SubCategory
                            });
                            TagService.updatelookuptag({
                                "_id": "4Design" + currnetTag.Design,
                                "doctype": "Design",
                                "value": currnetTag.Design
                            });
                            TagService.updatelookuptag({
                                "_id": "5DesignGroup" + currnetTag.DesignGroup,
                                "doctype": "DesignGroup",
                                "value": currnetTag.DesignGroup
                            });
                            TagService.updatelookuptag({
                                "_id": "6ItemType" + currnetTag.ItemType,
                                "doctype": "ItemType",
                                "value": currnetTag.ItemType
                            });




                            _this.downloadTagsImage();
                        }, function (err) {
                            _this.downloadTagsImage();

                        }, function (progress) {
                            var perc = Math.floor(progress.loaded / progress.total * 100);
                            vm.Status = 'Downloading(  ' + perc.toString() + ' %)' + imageName + ' ' + (_this.totaltag - _this.tags.length).toString() + '/' + _this.totaltag.toString();

                        });
                } else {

                    var saveTagPromise = []
                    saveTagPromise.push(TagService.updatetag(currnetTag));
                    if (currnetTag.Location !== '') {
                        saveTagPromise.push(TagService.updatelookuptag({
                            "_id": "1Location" + currnetTag.Location,
                            "doctype": "Location",
                            "value": currnetTag.Location
                        }));
                    };
                    if (currnetTag.Category !== '') {
                        saveTagPromise.push(TagService.updatelookuptag({
                            "_id": "2Category" + currnetTag.Category,
                            "doctype": "Category",
                            "value": currnetTag.Category
                        }));
                    };
                    if (currnetTag.SubCategory !== '') {
                        saveTagPromise.push(TagService.updatelookuptag({
                            "_id": "3SubCategory" + currnetTag.SubCategory,
                            "doctype": "SubCategory",
                            "value": currnetTag.SubCategory
                        }));
                    };
                    if (currnetTag.Design !== '') {
                        saveTagPromise.push(TagService.updatelookuptag({
                            "_id": "4Design" + currnetTag.Design,
                            "doctype": "Design",
                            "value": currnetTag.Design
                        }));
                    };
                    if (currnetTag.DesignGroup !== '') {
                        saveTagPromise.push(TagService.updatelookuptag({
                            "_id": "5DesignGroup" + currnetTag.DesignGroup,
                            "doctype": "DesignGroup",
                            "value": currnetTag.DesignGroup
                        }));
                    };
                    if (currnetTag.ItemType !== '') {
                        saveTagPromise.push(TagService.updatelookuptag({
                            "_id": "6ItemType" + currnetTag.ItemType,
                            "doctype": "ItemType",
                            "value": currnetTag.ItemType
                        }));
                    };
                    $q.all(saveTagPromise).then(function (res) {
                        console.log(res);
                        _this.downloadTagsImage();
                    }).catch(function (err) {
                        _this.downloadTagsImage();
                        //console.log(err);
                    });
                };


            }
        }



        function syncimages() {

            var pageNo = 0;
            var arrgetTagPromise = [];

            TagService.getSyncTags(vm.tagNo, pageNo).then(function (result) {

                vm.Status = "Generating Data "
                var dataCount = result.data.ResultSets[1][0].DataCount;
                var totalPages = (Math.floor(dataCount / AppUrls.pageSize) + 1);
                console.log(dataCount);
                console.log(totalPages);

                for (pageNo = 0; pageNo < totalPages; pageNo++) {
                    arrgetTagPromise.push(TagService.getSyncTags(vm.tagNo, pageNo))
                };

                $q.all(arrgetTagPromise).then(function (result) {
                    var tmp = [];
                    angular.forEach(result, function (response) {
                        tmp = tmp.concat(response.data.ResultSets[0]);

                    });
                    return tmp;
                }).then(function (tmpResult) {
                    vm.tags = tmpResult;
                    tagImageDownloader.tags = vm.tags;
                    tagImageDownloader.totaltag = vm.tags.length;
                    tagImageDownloader.downloadTagsImage();
                    console.log('done');

                });

            })







        };

    }
})();
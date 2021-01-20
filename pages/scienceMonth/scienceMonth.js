// pages/scienceMonth/scienceMonth.js
//index.js//获取应用实例
const app = getApp()

import {
    urls
} from "../../utils/urls.js";

let util = require("../../utils/util.js");
Page({
    data: {
        /**        * 页面配置        */
        winWidth: 0,
        winHeight: 0,
        // tab切换
        currentTab: 1,
        list: [],
        list2: [],
        page: 1,
        hasMoreData: true, //是否还有更多数据
        hasFail: false, //获取列表数据是否出错
        pageLock: true,
        orderData: "月份搜索",
        _lastTime: 0,
        isLeader: false,
        currentDate: util.getNowDate(new Date())
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this;
        app.globalData.userInfo.roleEOList.forEach(item => {
            if (item.extInfo == 'RS_LEADER') {
                that.setData({
                    isLeader: true,
                    currentTab: 0
                });
                wx.setNavigationBarTitle({
                    title: '工作要点'
                })
            }
        });
        if(app.globalData.isDetail){
            that.setData({
                currentTab: 1
            });
            app.globalData.isDetail=null;
        }
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight
                });
            }
        });

        wx.showLoading({
            title: '加载中',
            mask: true
        })
        //获取列表数据的方法
        if (this.data.currentTab == 0) {
            this.setData({
                hasMoreData: true,
                page: 1
            }, () => this.getList(1));
        } else {
            this.setData({
                hasMoreData: true,
                page: 1
            }, () => this.getList(2));
        }
    },
    onLoads: function () {
        var that = this;
        app.globalData.userInfo.roleEOList.forEach(item => {
            if (item.extInfo == 'RS_LEADER') {
                that.setData({
                    isLeader: true,
                    currentTab: 0
                });
                wx.setNavigationBarTitle({
                    title: '工作要点'
                })
            }
        });
        if(app.globalData.isDetail){
            that.setData({
                currentTab: 1
            });
            app.globalData.isDetail=null;
        }
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight
                });
            }
        });

        wx.showLoading({
            title: '加载中',
            mask: true
        })
        //获取列表数据的方法
        if (this.data.currentTab == 0) {
            this.setData({
                hasMoreData: true,
                page: 1
            }, () => this.getList(1));
        } else {
            this.setData({
                hasMoreData: true,
                page: 1
            }, () => this.getList(2));
        }

    },
    /**     * 滑动切换tab     */
    bindChange: function (e) {
        var that = this;
        that.setData({
            currentTab: e.detail.current
        });
    },
    goTop: function () {
        if (wx.pageScrollTo) { //当滑动距离不为0（不处于顶部时）
            wx.pageScrollTo({
                scrollTop: 0 //设置滑动距离为0
            })
        } else { //版本过低时的兼容操作
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
        }
    },
    detailOnClick: function (e) {
        let nowDate = new Date();
        let that = this;
        console.log(e.currentTarget.dataset.index, this.data.list)
        console.log(e, this.data.list[e.currentTarget.dataset.index]);
        if (util.throwQuickClick(nowDate, that.data._lastTime, 2000)) {
            let url = "../../pages/scienceMonthDetail/scienceMonthDetail?id="
            if (that.data.currentTab == 1) {
                app.globalData.isDetail=1;
                url = "../../pages/scienceMonthDetail/scienceMonthDetailEdit?id="
            }
            wx.navigateTo({
                url: url + e.currentTarget.id + "&title=" + this.data.list[e.currentTarget.dataset.index].title + "&collect=" + this.data.list[e.currentTarget.dataset.index].collect + "&createTime=" + this.data.list[e.currentTarget.dataset.index].createTime
            })
        }
        that.setData({
            _lastTime: new Date()
        })
    },
    /**   * 点击tab切换   */
    swichNav: function (e) {

        var that = this;
        that.goTop();
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            })
            

            if (e.target.dataset.current == 0) {

                that.setData({
                    visible: false,
                    page: 1,
                })
                wx.showLoading({
                    title: '加载中',
                    mask: true
                })

                this.getList(1); //获取列表数据的方法


            } else {
                that.setData({
                    visible: true,
                    page: 1,
                })

                wx.showLoading({
                    title: '加载中',
                    mask: true
                })
                app.globalData.isDetail=1;
                this.getList(2); //获取列表数据的方法


            }
        }
    },

    collect: function (e) {
        let i = e.target.dataset.index;
        console.log(e);
        var that = this;
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        wx.request({
            url: urls.baseUrl + urls.setScienceTopOrCollectUrl(),
            method: "PUT",
            data: {
                userId: app.globalData.userInfo.usid,
                researchId: e.currentTarget.id,
                collect: 1,
            },
            success: function (res) {
                if (res.data.respCode == 0) {

                    var collect = "list[" + i + "].collect";

                    that.setData({
                        [collect]: '1'
                    })

                    // wx.showToast({
                    //   title: '收藏成功',
                    // })
                    util.showMyToast('', '收藏成功!');
                }
            },
            complete(res) {
                wx.hideLoading();
            }
        })

    },

    uncollect: function (e) {
        let i = e.target.dataset.index;
        var that = this;
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        wx.request({
            url: urls.baseUrl + urls.setScienceTopOrCollectUrl(),
            method: "PUT",
            data: {
                userId: app.globalData.userInfo.usid,
                researchId: e.currentTarget.id,
                collect: 0,
            },
            success: function (res) {
                if (res.data.respCode == 0) {

                    var collect = "list[" + i + "].collect";
                    that.setData({
                        [collect]: '0'
                    })
                    // wx.showToast({
                    //   title: '取消收藏',
                    // })
                    util.showMyToast('', '取消收藏!');
                }
            },
            complete(res) {
                wx.hideLoading();
            }
        })

    },

    top: function (e) {
        var that = this;
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        wx.request({
            url: urls.baseUrl + urls.setScienceTopOrCollectUrl(),
            method: "PUT",
            data: {
                userId: app.globalData.userInfo.usid,
                researchId: e.currentTarget.id,
                top: 1,
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.respCode == 0) {
                    if (that.data.currentTab == 0) {
                        that.setData({
                            hasMoreData: true,
                            page: 1
                        }, () => that.getList(1));
                    } else {
                        that.setData({
                            hasMoreData: true,
                            page: 1
                        }, () => that.getList(2));
                    }
                    wx.showToast({
                        title: '置顶成功',
                    })
                }
            },
            fail: function () {
                wx.hideLoading();
            },
            complete(res) {
                // wx.hideLoading();
            }
        })

    },

    untop: function (e) {
        var that = this;
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        wx.request({
            url: urls.baseUrl + urls.setScienceTopOrCollectUrl(),
            method: "PUT",
            data: {
                userId: app.globalData.userInfo.usid,
                researchId: e.currentTarget.id,
                top: 0,
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.respCode == 0) {
                    if (that.data.currentTab == 0) {
                        that.setData({
                            hasMoreData: true,
                            page: 1
                        }, () => that.getList(1));
                    } else {
                        that.setData({
                            hasMoreData: true,
                            page: 1
                        }, () => that.getList(2));
                    }
                    wx.showToast({
                        title: '取消置顶',
                    })
                }
            },
            fail: function () {
                wx.hideLoading();
            },
            complete(res) {
                // wx.hideLoading();
            }
        })

    },
    hideInput: function (e) {
        let _this = this;
        this.setData({
            orderData: '月份搜索',
            currentDate: util.getNowDate(new Date()),
            page: 1,
        }, function () {
            if (_this.data.currentTab == 0) {
                _this.setData({
                    hasMoreData: true,
                    page: 1
                }, () => _this.getList(1));
            } else {
                _this.setData({
                    hasMoreData: true,
                    page: 1
                }, () => _this.getList(2));
            }
        });

    },


    onPullDownRefresh: function () {
        var that = this;
        //下拉刷新，由于我的列表数据是分页的，所以下拉刷新时，需要将page置为1，再调用获取列表数据的方法
        if (that.data.currentTab == 0) {
            that.setData({
                hasMoreData: true,
                page: 1
            }, () => that.getList(1));
        } else {
            that.setData({
                hasMoreData: true,
                page: 1
            }, () => that.getList(2));
        }
    },

    onReachBottom: function () {


        var that = this;
        //上拉加载，判断是否还有数据，如果没有数据，则不执行获取数据的方法，避免重复无用的调用接口
        if (that.data.currentTab == 0) {
            that.data.hasMoreData ? that.getList(1) : null;
        } else {
            that.data.hasMoreData ? that.getList(2) : null;
        }
    },
    getList: function (options) {
        let that = this;
        if (that.data.currentTab == 0) {
            console.log('getList: function (options)');
            wx.showLoading({
                title: '加载中',
                mask: true
            })

            console.log(that.data.pageLock, 'pageLock1')

            if (!that.data.pageLock) {
                // that.setData({
                //     list: that.data.list
                // })
                return;
            }
            console.log(that.data.pageLock, 'pageLock2')
            that.setData({
                pageLock: false,
            })
            console.log(that.data.pageLock, 'pageLock3', that.data.orderData)
            wx.request({
                url: urls.baseUrl + urls.getAllScienceUrl(),
                method: "GET",
                data: {
                    page: this.data.page,
                    userId: app.globalData.userInfo.usid,
                    pageSize: 10,
                    month: that.data.orderData != "月份搜索" ? that.data.orderData.split("-")[1] : "",
                    year: that.data.orderData != "月份搜索" ? that.data.orderData.split("-")[0] : "",
                    // title: this.data.search
                },
                success: function (res) {
                    wx.hideLoading();
                    //因为是分页加载的列表，因此需要判断，是否是第一页，是则需要将数据清空，否则将之前的列表数据赋值
                    let listData = that.data.page == 1 ? [] : that.data.list;
                    //接口获取数据成功，将下拉刷新的操作停止（动画停止）
                    wx.stopPullDownRefresh();

                    let list1 = res.data.data.list

                    for (var i = 0; i < list1.length; i++) {
                        if (list1[i]["updateTime"]) {
                            list1[i]["updateTime"] = util.tsFormatTime(list1[i]["updateTime"], 'Y-M-D h:m');
                        }
                        if (list1[i]["createTime"]) {
                            list1[i]["createTime"] = util.tsFormatTime(list1[i]["createTime"], 'Y/M/D');
                        }
                        list1[i]["title"] = list1[i]["title"]+"汇总";
                        for (var item in list1[i]){
                            if(list1[i][item]){
                                list1[i][item] = util.htmlDecodeByRegExp(list1[i][item]);
                            }
                        }
                    }

                    that.setData({
                        list: listData.concat(list1),
                        pageLock: true,
                        hasFail: false
                    })
                    //获取的数据条数为0或小于20（20是设置的每页数据条数），则说明之后没有数据了
                    if (list1.length == 0 || list1.length < 10) {
                        that.setData({
                            pageLock: true,
                            hasMoreData: false
                        });
                    } else {
                        //否则之后还有数据，将页数加1
                        that.setData({
                            pageLock: true,
                            hasMoreData: true,
                            page: ++that.data.page
                        })

                        console.log(that.data.page);
                    }
                },
                fail: function () {
                    wx.hideLoading();
                    that.setData({
                        pageLock: true,
                        hasFail: true
                    });
                },
                complete(res) {
                    wx.hideLoading();
                }
            })
        } else {

            console.log('getList: function (options)');
            wx.showLoading({
                title: '加载中',
                mask: true
            })
            console.log(that.data.pageLock, 'pageLock1')

            if (!that.data.pageLock) {
                // that.setData({
                //     list: that.data.list
                // })
                return;
            }
            console.log(that.data.pageLock, 'pageLock2')
            that.setData({
                pageLock: false,
            })
            console.log(that.data.pageLock, 'pageLock3')

            wx.request({
                url: urls.baseUrl + urls.getAllScienceUrl(),
                method: "GET",
                data: {
                    page: this.data.page,
                    // meetType: 0,
                    userId: app.globalData.userInfo.usid,
                    pageSize: 10,
                    // title: this.data.search，
                    searchMyselfFlag: 1,
                    month: that.data.orderData != "月份搜索" ? that.data.orderData.split("-")[1] : "",
                    year: that.data.orderData != "月份搜索" ? that.data.orderData.split("-")[0] : "",
                },
                success: function (res) {
                    wx.hideLoading();
                    //因为是分页加载的列表，因此需要判断，是否是第一页，是则需要将数据清空，否则将之前的列表数据赋值
                    let listData = that.data.page == 1 ? [] : that.data.list;
                    //接口获取数据成功，将下拉刷新的操作停止（动画停止）
                    wx.stopPullDownRefresh();

                    let list1 = res.data.data.list
                    for (var i = 0; i < list1.length; i++) {
                        if (list1[i]["updateTime"]) {
                            list1[i]["updateTime"] = util.tsFormatTime(list1[i]["updateTime"], 'Y-M-D h:m');
                        }
                        if (list1[i]["createTime"]) {
                            list1[i]["createTime"] = util.tsFormatTime(list1[i]["createTime"], 'Y/M/D');
                        }
                    }
                    that.setData({
                        pageLock: true,
                        list: listData.concat(list1),
                        hasFail: false
                    })
                    //获取的数据条数为0或小于20（20是设置的每页数据条数），则说明之后没有数据了

                    if (list1.length == 0 || list1.length < 10) {
                        that.setData({
                            pageLock: true,
                            hasMoreData: false
                        });
                    } else {
                        //否则之后还有数据，将页数加1
                        that.setData({
                            pageLock: true,
                            hasMoreData: true,
                            page: ++that.data.page
                        })

                        console.log(that.data.page);
                    }
                },
                fail: function () {
                    wx.hideLoading();
                    that.setData({
                        pageLock: true,
                        hasFail: true
                    });
                },
                complete(res) {
                    wx.hideLoading();
                }
            })
        }
    },
    //value 改变时触发 change 事件
    bindMultiPickerChange: function (e) {
        console.log(e, 8888)
        var that = this
        that.setData({
            orderData: e.detail.value,
            currentDate: e.detail.value,
        });
        if (that.data.currentTab == 0) {
            that.setData({
                hasMoreData: true,
                page: 1
            }, () => that.getList(1));
        } else {
            that.setData({
                hasMoreData: true,
                page: 1
            }, () => that.getList(2));
        }
    },
    //某一列的值改变时触发
    bindMultiPickerColumnChange: function (e) {

    },
})
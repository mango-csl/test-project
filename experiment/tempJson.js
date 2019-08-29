const board = {
    layout: 1,
    cards: [
        {
            cardType: 'sdfs',
            cardName: 'temp',
            imgUrl: ''
        },
    ],
    boardName: ''
};

// 名词解释   开发人员使用
// 模块  =  卡片（容器解析配置项，关联组件渲染而成） + 详情分析页（弹窗组件  + 容器解析配置项，关联组件渲染而成）
// ps：只有一种容器,写一个容器组件

// 配置的时候，需要一个本地项目调试
const contentCompont = {};

const component = ['title','echart','dialog','table','map'];

// todo 样式布局如何配置
// body 宽高固定，通过缩放来适配不同分辨率
// {
//     width: 1920px;
//     height: 1080px;
//     background-color: rgba(13, 42, 67, 0);
//     transform: scale(0.164815) translate(0px, 0px);
//     position: absolute;
// }
// 容器内组件样式
// {
//     width: 1760px;
//     height: 960px;
//     transform: translate(64px, 56px);
//     top: 0px;
//     left: 0px;
// }

const queryCard = {
    cardType: 'sdfs',
    cardName: '日均接单面积',
    imgUrl: '',
    options: [
        {
            component: 'title',
            option: {
                name: '日均接单面积',
            },
            style:{

            }
        },
        {
            component: 'echart',
            option: {
                name: '日均接单面积',
                // todo 是否需要分开存放
                type: 'echart',
                id: '19'
            }
        },
        {
            component: 'dialog',
            option: {
                name: '日均接单面积',
                attrs: [
                    {
                        component: 'title',
                        option: {
                            name: '日均接单面积',
                        }
                    },
                    {
                        component: 'echart',
                        option: {
                            // todo 是否需要分开存放echats配置，保证配置简洁性
                            type: 'echart',
                            id: '19'
                        },
                        // todo 目前想到3中类型
                        // 1、api 返回，配置url
                        // 2、静态数据
                        // 3、全局store，绑定变量
                        data:{

                        }
                    },
                    {
                        component: 'tableName',
                        option: {
                            // todo 会嵌套多层自定义组件
                            type: 'table',
                            columnOption: [
                                {
                                    name: '',
                                    component: {
                                        return <button></button>
                                    }
                                }
                            ]
                        }
                    },
                ]
            }
        },
    ]
};


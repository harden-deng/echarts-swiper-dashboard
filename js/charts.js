// 图表颜色配置
const colors = {
    blue: '#1E88E5',
    green: '#4CAF50',
    red: '#F44336',
    orange: '#FF9800'
};

// ECharts主题配置
const darkTheme = {
    backgroundColor: 'transparent',
    textStyle: {
        color: '#ffffff',
        fontFamily: 'Microsoft YaHei, 微软雅黑, Arial, sans-serif'
    },
    tooltip: {
        backgroundColor: 'rgba(26, 35, 50, 0.95)',
        borderColor: '#1E88E5',
        borderWidth: 1,
        textStyle: {
            color: '#ffffff'
        }
    },
    legend: {
        textStyle: {
            color: '#ffffff'
        }
    },
    grid: {
        borderColor: 'rgba(30, 136, 229, 0.2)'
    }
};
// 懒加载：记录各页图表是否已初始化
var chartSlideInited = [false, false, false, false, false, false, false];

// 按页初始化图表（只初始化未初始化的页）
function loadChartsForSlide(slideIndex) {
    // if (slideIndex < 0 || slideIndex > 2) return;
    if (chartSlideInited[slideIndex]) return;
    if (slideIndex === 0) {
        console.log('初始化第0页图表');
        initChart1Indicator();
        initChart2Indicator();
        initChart2();
    } else if (slideIndex === 1) {
        console.log('初始化第1页图表');
        initChart3();
        initChart4();
    } else if (slideIndex === 2) {
        console.log('初始化第2页图表');
        initChart5();
        initChart6();
    } else if (slideIndex === 3) {
        console.log('初始化第3页图表');
        initChart7();
        initChart8();
    }
    else if (slideIndex === 4) {
        console.log('初始化第4页图表');
        initChart9();
        initChart10();
    }
    else if (slideIndex === 5) {
        console.log('初始化第5页图表');
        initChart11();
        initChart12();
    }
    else if (slideIndex === 6) {
        console.log('初始化第6页图表');
        initChart13();
        initChart14();
    }
    chartSlideInited[slideIndex] = true;



}


function initPixelRatioListener(callback) {
    // 记录原始的像素比
    let originPixelRatio = window.devicePixelRatio;
    // 定义当像素比变化时的处理函数
    let mqListener = function (e) {
        let currentPixelRatio = window.devicePixelRatio;
        console.log('页面缩放比例变化了，当前比例：', currentPixelRatio / originPixelRatio);
        callback(currentPixelRatio / originPixelRatio);

        // 更新监听，以捕获后续变化
        this.removeEventListener('change', mqListener);
        matchMedia(`(resolution: ${currentPixelRatio}dppx)`).addEventListener('change', mqListener);
    };

    // 开始监听
    matchMedia(`(resolution: ${originPixelRatio}dppx)`).addEventListener('change', mqListener);
}

// 预加载下一页（在空闲时执行，避免阻塞首屏）
function preloadNextSlideCharts(currentIndex) {
    var next = currentIndex + 1;
    if (next <= 2 && typeof requestIdleCallback === 'function') {
        requestIdleCallback(function () { loadChartsForSlide(next); }, { timeout: 500 });
    } else if (next <= 2) {
        setTimeout(function () { loadChartsForSlide(next); }, 300);
    }
}
// 首屏只初始化第一页图表，其余页懒加载
document.addEventListener('DOMContentLoaded', function () {
    loadChartsForSlide(0); // 仅第一页
    initToggleSwitch();
    initCustomDropdown();
});

function initChart() {
    // initChart1Indicator(); // 2025年投资情况 - 圆环图
    // initChart1Bar();       // 2025年投资情况 - 柱状图
    // initChart2();          // 资金下达及到位情况 - 柱状图
    // initChart3();          // 总体执行情况统计 - 折线图
    // initChart4();          // 总体执行情况数据 - 双轴图表
    // initChart5();          // 资金下达及到位情况统计 - 柱状图
    // initChart6();          // 资金下达及到位情况数据 - 双轴图表
}
/**
 * 根据 source 动态计算环图间隙值（用于透明占位扇区）
 * 思路：
 * 1) 以最小扇区为锚点，gap 不超过最小值的一定比例（避免小扇区被切太碎）
 * 2) 用总量比例做下限（避免数据整体很大时 gap 太小看不见）
 * 3) 最后做 clamp 限幅
 */
function calcDynamicGap(source, valueKey, options = {}) {
    const {
        minGap = 1.4,        // 提高下限：保证一定看得见
        maxGap = 4.2,        // 允许更大缝隙
        minPartRatio = 0.28, // 最小扇区可承受比例提高
        totalRatio = 0.006,  // 总量比例提高（设计感更强）
        prefer = 0.72        // 越接近1越偏向 byTotal
    } = options;
    const values = source
        .map(i => Number(i[valueKey]) || 0)
        .filter(v => v > 0);
    if (!values.length) return minGap;
    const minPart = Math.min(...values);
    const total = values.reduce((s, v) => s + v, 0);
    const byMinPart = minPart * minPartRatio;
    const byTotal = total * totalRatio;
    // 设计稿风格：偏向 byTotal（整体视觉更“有缝”）
    const raw = byMinPart * (1 - prefer) + byTotal * prefer;
    return Math.max(minGap, Math.min(maxGap, raw));
}
function calcOuterGapDesign(source) {
    return calcDynamicGap(source, 'budget', {
        minGap: 1.6,
        maxGap: 4.5,
        minPartRatio: 0.30,
        totalRatio: 0.0065,
        prefer: 0.75
    });
}
function calcInnerGapDesign(source) {
    // 内圈略小，避免内圈“碎裂感”过强
    return calcDynamicGap(source, 'budget', {
        minGap: 1.6,
        maxGap: 4.5,
        minPartRatio: 0.30,
        totalRatio: 0.0065,
        prefer: 0.75
    });
}
function initChart1Indicator() {
    const dom = document.getElementById('chart1-indicator');
    const chart = echarts.init(dom);
    // 模拟业务数据（可替换）
    const source = [
        { name: '建安工程费', budget: 320, issued: 320, color: '#2A84E9' },
        { name: '工程建设其他费', budget: 190, issued: 170, color: '#36C7C9' },
        { name: '设备工器具购置费', budget: 140, issued: 120, color: '#10C469' },
        { name: '预备费', budget: 140, issued: 120, color: '#10C469' },
        { name: '前期费', budget: 140, issued: 120, color: '#10C469' },
        { name: '建设期贷款利息', budget: 140, issued: 120, color: '#10C469' },
    ];
    const source1 = [
        {
            "name": "建安工程费",
            "budget": 86.977052,
            "issued": 86.977052,
            "color": "#2A84E9"
        },
        {
            "name": "工程建设其他费",
            "budget": 5.269956,
            "issued": 5.269956,
            "color": "#36C7C9"
        },
        {
            "name": "设备工器具购置费",
            "budget": 0,
            "issued": 0,
            "color": "#10C469"
        },
        {
            "name": "预备费",
            "budget": 4.61235,
            "issued": 4.61235,
            "color": "#10C439"
        },
        {
            "name": "前期费",
            "budget": 35.427765,
            "issued": 35.427765,
            "color": "#10C369"
        },
        {
            "name": "建设期贷款利息",
            "budget": 30,
            "issued": 30,
            "color": "#10C269"
        }
    ]

    const totalBudget = source.reduce((s, i) => s + i.budget, 0);
    // const totalIssued = source.reduce((s, i) => s + i.issued, 0);
    // 将16进制颜色转换为rgba颜色
    const hexToRgba = (hex, alpha) => {
        const h = hex.replace('#', '');
        const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
        const num = parseInt(full, 16);
        const r = (num >> 16) & 255;
        const g = (num >> 8) & 255;
        const b = num & 255;
        return `rgba(${r},${g},${b},${alpha})`;
    };

    // 外圈：pie 按权重 + 透明间隙
    // const gapValueOuter = 1; // 间隙权重
    const gapValueOuter = calcOuterGapDesign(source);
    const outerDataWithGap = [];
    source.forEach(item => {
        outerDataWithGap.push({
            name: item.name,
            value: item.budget, // 按概算金额权重
            itemStyle: {
                color: item.color,
                borderRadius: 8 // 让每段端点更圆润（pie风格）
            }
        });
        outerDataWithGap.push({
            name: '__gap_outer__',
            value: gapValueOuter,
            itemStyle: { color: 'rgba(0,0,0,0)' }, // 透明间隙
            label: { show: false },
            labelLine: { show: false },
            tooltip: { show: false },
            emphasis: { disabled: true }
        });
    });
    // 外圈 series
    const outerPieSeries = {
        name: '概算金额',
        type: 'pie', //饼图类型来画环形扇区
        center: ['66%', '50%'], // 为左侧图例留出空间，整体右移。
        radius: ['70%', '78%'], // 外圈厚度, 这是环形饼图的内外半径：外半径 70%，内半径 78%。
        startAngle: 90, // 从 12 点钟方向开始绘制（ECharts 里 90 度对应正上方）。
        clockwise: true, // 顺时针方向绘制（饼图默认是逆时针）。
        avoidLabelOverlap: true, //避免标签重叠（虽然你已关闭标签，这里保留也无害）。
        label: { show: false }, //关闭扇区文字标签，不在图上显示每段名称/数值。
        labelLine: { show: false }, //关闭标签引导线（因为标签关了，线也不需要）。
        itemStyle: {
            borderWidth: 0,
            borderColor: 'transparent'  //不给每个扇区画描边，避免出现白边/分隔线。
            // 你现在的“间隙”来源应由 data: outerDataWithGap 里的透明占位扇区来实现，而不是边框。
        },
        data: outerDataWithGap  //外圈实际数据源。通常是“真实数据项 + 透明间隙项”交替数组
    };
    //外圈---------end---------

    //内圈---------start---------
    // const gapValue = 1; // 建议和外圈 gap 保持一致（比如 gapValueOuter）
    const gapValue = calcInnerGapDesign(source);
    const innerDataWithGap = [];
    source.forEach(item => {
        const budget = Number(item.budget) || 0;
        const issuedRaw = Number(item.issued) || 0;
        // 防御：issued 不允许超过 budget、不小于 0
        const issued = Math.max(0, Math.min(issuedRaw, budget));
        const unissued = Math.max(0, budget - issued);
        // 1) 已发包：半透明显示
        innerDataWithGap.push({
            name: item.name,
            value: issued,
            itemStyle: { color: hexToRgba(item.color, 0.32) }
        });
        let obj = {
            itemStyle: { color: 'rgba(0,0,0,0)' },
            label: { show: false },
            labelLine: { show: false },
            tooltip: { show: false },
            emphasis: { disabled: true }
        }
        // 2) 未发包：透明占位（让内圈“缺口”出现在分类内部）
        if (unissued > 0) {
            innerDataWithGap.push({
                name: '__unissued__',
                value: unissued,
                ...obj
            });
        }
        // 3) 分类间隔：透明缝隙
        innerDataWithGap.push({
            name: '__gap__',
            value: gapValue,
            ...obj
        });
    });

    const innerPie = {
        name: '累计发包',
        type: 'pie',
        center: ['66%', '50%'],
        radius: ['42%', '68%'],
        startAngle: 90,
        clockwise: true,
        avoidLabelOverlap: true,
        label: { show: false },
        labelLine: { show: false },
        itemStyle: {
            borderWidth: 0,
            borderColor: 'transparent'
        },
        data: innerDataWithGap
    };
    //内圈---------end---------

    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(26, 35, 50, 0.95)',
            borderColor: '#1E88E5',
            textStyle: { color: '#fff' },
            formatter: function (p) {
                if (p.name === '__gap_outer__' || p.name === '__gap__' || p.name === '__unissued__') return '';
                const row = source.find(x => x.name === p.name);
                return [
                    `${p.marker}${p.name}`,
                    `概算：${row ? row.budget : '-'} 万元`,
                    `概算占比：${row ? (row.budget / totalBudget * 100).toFixed(2) : '-'}%`,
                    `发包：${row ? row.issued : '-'} 万元`,
                    `发包占比：${row ? (row.issued / row.budget * 100).toFixed(2) : '-'}%`
                ].join('<br/>');
            }
        },
        legend: {
            left: '4%',
            top: 'middle',
            orient: 'vertical',
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 16,
            textStyle: { color: '#7a8699', fontSize: 12 },
            data: source.map(i => i.name)
        },
        series: [
            outerPieSeries,
            innerPie
        ],
        graphic: [
            {
                type: 'circle',
                left: '51.8%',
                top: '31.1%',
                shape: { r: 55 },
                style: {
                    stroke: '#4aa0ff',
                    fill: 'transparent',
                    lineWidth: 3,
                    lineDash: [2, 3]
                }
            },
            {
                type: 'text',
                left: '54%',
                top: '44%',
                style: {
                    text: '采购金额(万元)',
                    fill: '#333',
                    fontSize: 14,
                    fontWeight: 400,
                    textAlign: 'center'
                }
            },
            {
                type: 'text',
                left: '58%',
                top: '51%',
                style: {
                    text: totalBudget.toFixed(2),
                    fill: '#333',
                    fontSize: 14,
                    fontWeight: 600,
                    textAlign: 'center'
                }
            }
        ]
    };

    chart.setOption(option);
    // 监听窗口大小变化
    window.addEventListener('resize', function () {
        chart.resize();
    });
    // 监听像素比变化
    initPixelRatioListener(function () {
        chart.resize();
    });
};

function initChart2Indicator() {
    const dom = document.getElementById('chart2-indicator');
    if (!dom) return;

    const chart = echarts.init(dom);

    const source = [
        { name: '市级全财政', value: 41.56, color: '#2B6F7B' },
        { name: '区级全财政', value: 37.66, color: '#54A774' },
        { name: '自营资金', value: 15.58, color: '#69B6D7' },
        { name: '其他资金', value: 5.19, color: '#BE5468' }
    ];

    const option = {
        backgroundColor: 'transparent',
        color: source.map(i => i.color),
        tooltip: {
            trigger: 'item',
            formatter: '{b}<br/>占比：{d}%'
        },
        legend: {
            left: '4%',
            top: 'middle',
            orient: 'vertical',
            icon: 'roundRect',
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 16,
            textStyle: {
                color: '#7a8699',
                fontSize: 12  
            },
            itemStyle: {
                borderWidth: 0,
                borderColor: 'transparent'
            }
            ,data: source.map(i => i.name)
        }
        ,series: [
            {
                name: '资金来源',
                type: 'pie',
                center: ['48%', '52%'],
                radius: ['0%', '72%'],
                minAngle: 3,
                avoidLabelOverlap: true,
                label: {
                    show: true,
                    position: 'outside',
                    formatter: '{b} {d}%',
                   
                    fontSize: 12
                },
                labelLine: {
                    show: true,
                    length: 12,
                    length2: 10,
                   
                },
                itemStyle: {
                    borderColor: '#ffffff', // 用页面背景色
                    borderWidth: 1
                },
                data: source.map(i => ({ name: i.name, value: i.value, itemStyle: { color: i.color } , label: { color: i.color } , labelLine: {
                    lineStyle: {
                        color: i.color
                    }
                } })),
                emphasis: {
                    scale: false
                }
            }
        ]
    };

    chart.setOption(option);
    // 监听窗口大小变化
    window.addEventListener('resize', function () {
        chart.resize();
    });
    // 监听像素比变化
    initPixelRatioListener(function () {
        chart.resize();
    });
}


// 图表2：资金下达及到位情况 - 柱状图
function initChart2() {
    const chartElement = document.getElementById('chart2');
    if (!chartElement) return;

    const chart = echarts.init(chartElement);

    const option = {
        backgroundColor: 'transparent',
        grid: {
            left: '10%',
            right: '10%',
            bottom: '15%',
            top: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['财力资金', '超长期国债', '专项债', '土地出让金', '其他中央资金'],
            axisLine: {
                lineStyle: {
                    color: 'rgba(30, 136, 229, 0.5)'
                }
            },
            axisLabel: {
                color: '#ffffff',
                fontSize: transformFontSize(12),
                rotate: 15
            }
        },
        yAxis: {
            type: 'value',
            name: '金额(万元)',
            axisLine: {
                lineStyle: {
                    color: 'rgba(30, 136, 229, 0.5)'
                }
            },
            axisLabel: {
                color: '#ffffff',
                fontSize: transformFontSize(12)
            },
            nameTextStyle: {
                color: '#ffffff'
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(30, 136, 229, 0.1)'
                }
            }
        },
        legend: {
            show: false
        },
        series: [
            {
                name: '计划',
                type: 'bar',
                data: [2500, 1800, 1200, 800, 600],
                itemStyle: {
                    color: '#4CAF50'
                }
            },
            {
                name: '累计到位',
                type: 'bar',
                data: [2100, 1500, 980, 650, 480],
                itemStyle: {
                    color: '#1E88E5'
                }
            }
        ],
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(26, 35, 50, 0.95)',
            borderColor: '#1E88E5',
            textStyle: {
                color: '#ffffff'
            }
        }
    };

    chart.setOption(option);

    window.addEventListener('resize', function () {
        setTimeout(() => {
            chart.resize();
        }, 300);
    });
}

// 图表3：总体执行情况统计 - 折线图
function initChart3() {
    const chartElement = document.getElementById('chart3');
    if (!chartElement) return;
    chartElement.style.height = '80vh';  // 或使用其他单位：'50vh', '400px' 等
    const chart = echarts.init(chartElement);

    const option = {
        backgroundColor: 'transparent',
        grid: {
            left: '10%',
            right: '10%',
            bottom: '15%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月'],
            axisLine: {
                lineStyle: {
                    color: 'rgba(30, 136, 229, 0.5)'
                }
            },
            axisLabel: {
                color: '#ffffff',
                fontSize: transformFontSize(12)
            }
        },
        yAxis: {
            type: 'value',
            name: '执行率(%)',
            max: 100,
            axisLine: {
                lineStyle: {
                    color: 'rgba(30, 136, 229, 0.5)'
                }
            },
            axisLabel: {
                color: '#ffffff',
                fontSize: transformFontSize(12),
                formatter: '{value}%'
            },
            nameTextStyle: {
                color: '#ffffff'
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(30, 136, 229, 0.1)'
                }
            }
        },
        legend: {
            show: false
        },
        series: [
            {
                name: '执行率',
                type: 'line',
                data: [75, 82, 78, 85, 88, 90],
                smooth: true,
                itemStyle: {
                    color: '#FF9800'
                },
                lineStyle: {
                    color: '#FF9800',
                    width: 2
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(255, 152, 0, 0.3)' },
                            { offset: 1, color: 'rgba(255, 152, 0, 0.05)' }
                        ]
                    }
                }
            }
        ],
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(26, 35, 50, 0.95)',
            borderColor: '#1E88E5',
            textStyle: {
                color: '#ffffff'
            },
            formatter: function (params) {
                return params[0].name + '<br/>' +
                    params[0].seriesName + ': ' + params[0].value + '%';
            }
        }
    };

    chart.setOption(option);

    window.addEventListener('resize', function () {
        setTimeout(() => {
            chart.resize();
        }, 300);
    });
}

// 图表4：总体执行情况数据 - 双轴图表（执行率+完成度）
function initChart4() {
    const chartElement = document.getElementById('chart4');
    if (!chartElement) return;

    const chart = echarts.init(chartElement);

    const option = {
        backgroundColor: 'transparent',
        grid: {
            left: '10%',
            right: '10%',
            bottom: '15%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月'],
            axisLine: {
                lineStyle: {
                    color: 'rgba(30, 136, 229, 0.5)'
                }
            },
            axisLabel: {
                color: '#ffffff',
                fontSize: transformFontSize(12)
            }
        },
        yAxis: [
            {
                type: 'value',
                name: '执行率(%)',
                max: 100,
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255, 152, 0, 0.5)'
                    }
                },
                axisLabel: {
                    color: '#ffffff',
                    fontSize: transformFontSize(12),
                    formatter: '{value}%'
                },
                nameTextStyle: {
                    color: '#ffffff'
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(30, 136, 229, 0.1)'
                    }
                }
            },
            {
                type: 'value',
                name: '完成度(%)',
                max: 100,
                axisLine: {
                    lineStyle: {
                        color: 'rgba(76, 175, 80, 0.5)'
                    }
                },
                axisLabel: {
                    color: '#ffffff',
                    fontSize: transformFontSize(12),
                    formatter: '{value}%'
                },
                nameTextStyle: {
                    color: '#ffffff'
                }
            }
        ],
        legend: {
            show: false
        },
        series: [
            {
                name: '执行率',
                type: 'bar',
                yAxisIndex: 0,
                data: [75, 82, 78, 85, 88],
                itemStyle: {
                    color: '#FF9800'
                }
            },
            {
                name: '完成度',
                type: 'line',
                yAxisIndex: 1,
                data: [68, 75, 72, 80, 85],
                smooth: true,
                itemStyle: {
                    color: '#4CAF50'
                },
                lineStyle: {
                    color: '#4CAF50',
                    width: 2
                }
            }
        ],
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(26, 35, 50, 0.95)',
            borderColor: '#1E88E5',
            textStyle: {
                color: '#ffffff'
            }
        }
    };

    chart.setOption(option);

    window.addEventListener('resize', function () {
        setTimeout(() => {
            chart.resize();
        }, 300);
    });
}

// 图表5：资金下达及到位情况统计 - 柱状图
function initChart5() {
    const chartElement = document.getElementById('chart5');
    if (!chartElement) return;

    const chart = echarts.init(chartElement);

    const option = {
        backgroundColor: 'transparent',
        grid: {
            left: '10%',
            right: '10%',
            bottom: '15%',
            top: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月'],
            axisLine: {
                lineStyle: {
                    color: 'rgba(30, 136, 229, 0.5)'
                }
            },
            axisLabel: {
                color: '#ffffff',
                fontSize: transformFontSize(12)
            }
        },
        yAxis: {
            type: 'value',
            name: '金额(万元)',
            axisLine: {
                lineStyle: {
                    color: 'rgba(30, 136, 229, 0.5)'
                }
            },
            axisLabel: {
                color: '#ffffff',
                fontSize: transformFontSize(12)
            },
            nameTextStyle: {
                color: '#ffffff'
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(30, 136, 229, 0.1)'
                }
            }
        },
        legend: {
            show: false
        },
        series: [
            {
                name: '同期比较',
                type: 'bar',
                data: [3200, 2800, 3500, 2900, 3100],
                itemStyle: {
                    color: '#1E88E5'
                }
            },
            {
                name: '分分',
                type: 'bar',
                data: [2800, 2500, 3200, 2700, 2900],
                itemStyle: {
                    color: '#4CAF50'
                }
            }
        ],
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(26, 35, 50, 0.95)',
            borderColor: '#1E88E5',
            textStyle: {
                color: '#ffffff'
            }
        }
    };

    chart.setOption(option);

    window.addEventListener('resize', function () {
        setTimeout(() => {
            chart.resize();
        }, 300);
    });
}

// 图表6：资金下达及到位情况数据 - 双轴图表（执行率+完成度）
function initChart6() {
    const chartElement = document.getElementById('chart6');
    if (!chartElement) return;

    const chart = echarts.init(chartElement);

    const option = {
        backgroundColor: 'transparent',
        grid: {
            left: '10%',
            right: '10%',
            bottom: '15%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月'],
            axisLine: {
                lineStyle: {
                    color: 'rgba(30, 136, 229, 0.5)'
                }
            },
            axisLabel: {
                color: '#ffffff',
                fontSize: transformFontSize(12)
            }
        },
        yAxis: [
            {
                type: 'value',
                name: '预算(万元)',
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255, 152, 0, 0.5)'
                    }
                },
                axisLabel: {
                    color: '#ffffff',
                    fontSize: transformFontSize(12)
                },
                nameTextStyle: {
                    color: '#ffffff'
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(30, 136, 229, 0.1)'
                    }
                }
            },
            {
                type: 'value',
                name: '实际(万元)',
                axisLine: {
                    lineStyle: {
                        color: 'rgba(76, 175, 80, 0.5)'
                    }
                },
                axisLabel: {
                    color: '#ffffff',
                    fontSize: transformFontSize(12)
                },
                nameTextStyle: {
                    color: '#ffffff'
                }
            }
        ],
        legend: {
            show: false
        },
        series: [
            {
                name: '预算',
                type: 'bar',
                yAxisIndex: 0,
                data: [3200, 2800, 3500, 2900, 3100],
                itemStyle: {
                    color: '#FF9800'
                }
            },
            {
                name: '实际',
                type: 'line',
                yAxisIndex: 1,
                data: [2800, 2500, 3200, 2700, 2900],
                smooth: true,
                itemStyle: {
                    color: '#4CAF50'
                },
                lineStyle: {
                    color: '#4CAF50',
                    width: 2
                }
            }
        ],
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(26, 35, 50, 0.95)',
            borderColor: '#1E88E5',
            textStyle: {
                color: '#ffffff'
            }
        }
    };

    chart.setOption(option);

    window.addEventListener('resize', function () {
        setTimeout(() => {
            chart.resize();
        }, 300);
    });
}

function transformFontSize(px) {
    let clientWidth = window.innerWidth || document.body.clientWidth
    if (!clientWidth) {
        return 0
    }
    let fontSize = clientWidth / 1920
    console.log(fontSize, px * fontSize)
    return px * fontSize
}

// 初始化切换按钮交互
function initToggleSwitch() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function () {
            // 移除同一组内所有按钮的active类
            const toggleSwitch = this.closest('.toggle-switch');
            toggleSwitch.querySelectorAll('.toggle-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            // 给当前点击的按钮添加active类
            this.classList.add('active');

            // 这里可以添加切换数据或图表的逻辑
            const value = this.getAttribute('data-value');
            console.log('切换到:', value);
            initChart();

        });
    });
}



// 初始化自定义下拉组件
function initCustomDropdown() {
    const customDropdowns = document.querySelectorAll('.custom-dropdown');
    customDropdowns.forEach(dropdown => {
        const selectBtn = dropdown.querySelector('.custom-dropdown-btn');
        const typeFlag = selectBtn.getAttribute('type-flag'); // 类型标识
        const list = dropdown.querySelector('.custom-dropdown-list'); // 选项列表容器
        const items = list.children; // 选项列表
        const text = dropdown.querySelector('.custom-dropdown-text'); // 显示文本标签
        // 点击按钮切换下拉列表
        selectBtn.addEventListener('click', function (e) {
            e.stopPropagation(); //阻止事件冒泡，避免点击按钮时触发 document 上的点击监听器
            const isOpen = list.classList.contains('show'); //检查该元素的 classList 中是否存在某个给定的类名

            // 关闭所有其他下拉列表
            document.querySelectorAll('.custom-dropdown-list').forEach(l => {
                if (l !== list) {
                    l.classList.remove('show');
                    l.parentElement.querySelector('.custom-dropdown-btn').classList.remove('active');
                }
            });

            // 切换当前下拉列表
            if (isOpen) {
                list.classList.remove('show');
                selectBtn.classList.remove('active');
            } else {
                list.classList.add('show');
                selectBtn.classList.add('active');
            }
        });

        // 点击选项
        for (let j = 0; j < items.length; j++) {
            const item_j = items[j];
            item_j.addEventListener('click', function () {
                const value = this.getAttribute('data-value');
                const textContent = this.textContent;

                // 更新显示文本
                text.textContent = textContent;

                // 更新选中状态
                // items.forEach(i => i.classList.remove('selected'));
                for (let i = 0; i < items.length; i++) {
                    const item_i = items[i];
                    item_i.classList.remove('selected');
                }
                this.classList.add('selected');

                // 关闭下拉列表
                list.classList.remove('show');
                selectBtn.classList.remove('active');

                // 可以在这里添加切换数据或图表的逻辑
                console.log('选择:', value);
                if (typeFlag === '1') {
                    console.log('执行此语句typeFlag->', typeFlag);
                }
            });
        }

        // 点击外部关闭下拉列表
        document.addEventListener('click', function (e) {
            if (!dropdown.contains(e.target)) {
                list.classList.remove('show');
                selectBtn.classList.remove('active');
            }
        });

        // 初始化显示第一个选项
        const firstSelected = dropdown.querySelector('.custom-dropdown-item.selected');
        if (firstSelected && text) {
            text.textContent = firstSelected.textContent;
        }
    });
}





//  Swiper 11.0.3 初始化 
// 确保 DOM 和 Swiper 都加载完成
document.addEventListener('DOMContentLoaded', function () {
    // 检查 Swiper 是否已加载
    if (typeof Swiper === 'undefined') {
        console.error('Swiper 未加载！请检查 swiper.min.js 文件');
        return;
    }

    const arrTitle = [
        '投资情况',
        '执行情况',
        '资金情况',
        '债务情况',
        '上月实际支出情况',
        '经营情况',
        '本月预算情况',
    ];

    let dashboardSwiper = new Swiper('.dashboard-swiper', {
        spaceBetween: 20,
        loop: false,
        navigation: {
            nextEl: '.dashboard-swiper .swiper-button-next',
            prevEl: '.dashboard-swiper .swiper-button-prev',
        },
        pagination: {
            el: '.dashboard-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '">' + arrTitle[index] + '</span>';
            },
        },
        effect: 'slide',
        speed: 600,
        allowSlidePrev: true,
        allowSlideNext: true,
        on: {
            init: function () {
                console.log('Swiper 初始化成功');
                console.log('Slides 数量:', this.slides.length);
                console.log('当前索引:', this.activeIndex);
                this.update();
                // 首屏已是第 0 页，预加载第二页
                preloadNextSlideCharts(0);
            },
            slideChange: function () {
                var idx = this.activeIndex;
                loadChartsForSlide(idx);       // 当前页未加载则加载
                preloadNextSlideCharts(idx);   // 预加载下一页
                this.update();
            }
        }
    });

    // 添加键盘事件监听器，支持左右箭头键切换
    document.addEventListener('keydown', function (event) {
        // 检查是否在输入框、文本域或下拉菜单中
        const activeElement = document.activeElement;
        const isInputFocused = activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.tagName === 'SELECT' ||
            activeElement.isContentEditable
        );

        // 如果焦点在输入元素上，不处理键盘事件
        if (isInputFocused) {
            return;
        }
        console.log('event.key->', event);
        // 左箭头键：上一页
        if (event.key === 'ArrowLeft' || event.keyCode === 37) {
            event.preventDefault();
            if (dashboardSwiper && dashboardSwiper.allowSlidePrev) {
                dashboardSwiper.slidePrev();
            }
        }
        // 右箭头键：下一页
        else if (event.key === 'ArrowRight' || event.keyCode === 39) {
            event.preventDefault();
            if (dashboardSwiper && dashboardSwiper.allowSlideNext) {
                dashboardSwiper.slideNext();
            }
        }
    });
});


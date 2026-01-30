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
var chartSlideInited = [false, false, false];

// 按页初始化图表（只初始化未初始化的页）
function loadChartsForSlide(slideIndex) {
    if (slideIndex < 0 || slideIndex > 2) return;
    if (chartSlideInited[slideIndex]) return;
    if (slideIndex === 0) {
        console.log('初始化第0页图表');
        initChart1Indicator();
        initChart1Bar();
        initChart2();
    } else if (slideIndex === 1) {
        console.log('初始化第1页图表');
        initChart3();
        initChart4();
    } else if (slideIndex === 2) {
        console.log('初始化第2页图表');
        initChart5();
        initChart6();
    }
    chartSlideInited[slideIndex] = true;
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
document.addEventListener('DOMContentLoaded', function() {
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
// 图表1：2025年投资情况 - 圆环图
function initChart1Indicator() {
    const chart = echarts.init(document.getElementById('chart1-indicator'));
    
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c}万元 ({d}%)',
            backgroundColor: 'rgba(26, 35, 50, 0.95)',
            borderColor: '#1E88E5',
            textStyle: {
                color: '#ffffff'
            },
            position: function (p) {   //其中p为当前鼠标的位置
                return [p[0] + 10, p[1] - 10];
            }
        },
        legend: {
            top: '70%',
            itemWidth: 10,
            itemHeight: 10,
            // data: ['已完成投资', '进行中投资', '计划投资'],
            textStyle: {
                color: 'rgba(255,255,255,1)',
                fontSize: '12',
            }
        },
        backgroundColor: 'transparent',
        series: [{
            name: '投资情况',
            type: 'pie',
            center: ['50%', '42%'],
            radius: ['40%', '60%'],
            label: { show: false },
            labelLine: { show: false },
            data: [
                { value: 65, name: '已完成投资' },
                { value: 25, name: '进行中投资' },
                { value: 10, name: '计划投资' }
            ],
            color: ['#4CAF50', '#1E88E5' , '#F44336']
        }]
    };
    
    chart.setOption(option);
    
    // 响应式
    window.addEventListener('resize', function() {
        chart.resize();
    });
}

// 图表1：2025年投资情况 - 柱状图
function initChart1Bar() {
    const chart = echarts.init(document.getElementById('chart1-bar'));
    
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
            name: '投资金额(万元)',
            max: 8000,
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
                data: [4500, 3200, 5500, 4000, 3500],
                itemStyle: {
                    color: '#1E88E5'
                }
            },
            {
                name: '分分',
                type: 'bar',
                data: [3800, 2800, 4800, 3500, 3000],
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
    
    window.addEventListener('resize', function() {
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
    
    window.addEventListener('resize', function() {
        chart.resize();
    });
}

// 图表3：总体执行情况统计 - 折线图
function initChart3() {
    const chartElement = document.getElementById('chart3');
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
            formatter: function(params) {
                return params[0].name + '<br/>' + 
                       params[0].seriesName + ': ' + params[0].value + '%';
            }
        }
    };
    
    chart.setOption(option);
    
    window.addEventListener('resize', function() {
        chart.resize();
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
    
    window.addEventListener('resize', function() {
        chart.resize();
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
    
    window.addEventListener('resize', function() {
        chart.resize();
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
    
    window.addEventListener('resize', function() {
        chart.resize();
    });
}

function transformFontSize(px) {
    let clientWidth = window.innerWidth || document.body.clientWidth
    if (!clientWidth) {
      return 0
    }
    let fontSize = clientWidth / 1920
    console.log(fontSize,px * fontSize)
    return px * fontSize
}

// 初始化切换按钮交互
function initToggleSwitch() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
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
        const btn = dropdown.querySelector('.custom-dropdown-btn');
        const list = dropdown.querySelector('.custom-dropdown-list');
        const items = dropdown.querySelectorAll('.custom-dropdown-item');
        const text = dropdown.querySelector('.custom-dropdown-text');
        
        // 点击按钮切换下拉列表
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
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
                btn.classList.remove('active');
            } else {
                list.classList.add('show');
                btn.classList.add('active');
            }
        });
        
        // 点击选项
        items.forEach(item => {
            item.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                const textContent = this.textContent;
                
                // 更新显示文本
                text.textContent = textContent;
                
                // 更新选中状态
                items.forEach(i => i.classList.remove('selected'));
                this.classList.add('selected');
                
              
                
                // 关闭下拉列表
                list.classList.remove('show');
                btn.classList.remove('active');
                
                // 可以在这里添加切换数据或图表的逻辑
                console.log('选择:', value);
            });
        });
        
        // 点击外部关闭下拉列表
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                list.classList.remove('show');
                btn.classList.remove('active');
            }
        });
        
        // 初始化显示第一个选项
        const firstSelected = dropdown.querySelector('.custom-dropdown-item.selected');
        if (firstSelected && select) {
            select.value = firstSelected.getAttribute('data-value');
        }
    });
}





  //  Swiper 11.0.3 初始化 
  // 确保 DOM 和 Swiper 都加载完成
  document.addEventListener('DOMContentLoaded', function() {
    // 检查 Swiper 是否已加载
    if (typeof Swiper === 'undefined') {
        console.error('Swiper 未加载！请检查 swiper.min.js 文件');
        return;
    }

    const arrTitle = [
        '2025年投资情况',
        '总体执行情况',
        '资金下达及到位情况',
        '上月实际投资支出',
        '债务情况',
        '经营情况',
        '本月预算用款情况',
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
            init: function() {
                console.log('Swiper 初始化成功');
                console.log('Slides 数量:', this.slides.length);
                console.log('当前索引:', this.activeIndex);
                this.update();
                // 首屏已是第 0 页，预加载第二页
                preloadNextSlideCharts(0);
            },
            slideChange: function() {
                var idx = this.activeIndex;
                loadChartsForSlide(idx);       // 当前页未加载则加载
                preloadNextSlideCharts(idx);   // 预加载下一页
                this.update();
            }
        }
    });
    
    // 添加键盘事件监听器，支持左右箭头键切换
    document.addEventListener('keydown', function(event) {
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


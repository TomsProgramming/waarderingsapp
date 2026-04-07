<template>
    <canvas ref="canvas"></canvas>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import {
    Chart,
    RadarController,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from 'chart.js'

Chart.register(
    RadarController,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
)

const canvas = ref(null)
let grafiek = null

onMounted(() => {
    grafiek = new Chart(canvas.value, {
        type: 'radar',
        data: {
            labels: ['Vakkundigheid', 'Productie', 'Complexiteit', 'Zelfregie', 'Samenwerken'],
            datasets: [
                {
                    label: '',
                    data: [2, 3, 3, 4, 4],
                    fill: true,
                    backgroundColor: 'rgba(255, 170, 70, 0.62)',
                    borderColor: '#e58b00',
                    pointRadius: 4,
                    pointHoverRadius: 4,
                    pointBackgroundColor: ['#ff9408', '#39d4bd', '#f35695', '#6049d8', '#0b79f2'],
                    pointBorderWidth: 0
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                r: {
                    angleLines: {
                        color: '#333333'
                    },
                    grid: {
                        color: '#333333'
                    },
                    pointLabels: {
                        display: false
                    },
                    ticks: {
                        display: false,
                        stepSize: 1
                    },
                    min: 0,
                    max: 5
                }
            }
        }

    })
})

onBeforeUnmount(() => {
    if (grafiek) {
        grafiek.destroy()
    }
})
</script>

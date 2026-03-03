<template>
    <canvas ref="canvas"></canvas>
</template>

<script setup>
import { onMounted, ref } from 'vue'
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

onMounted(() => {
    new Chart(canvas.value, {
        type: 'radar',
        data: {
            labels: ['Vakkundigheid', 'Productie', 'Complexiteit', 'Zelfregie', 'Samenwerken'],
            datasets: [
                {
                    label: '',
                    data: [1, 2, 2, 3, 1],
                    fill: true,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgb(54, 162, 235)',
                    pointBackgroundColor: 'rgb(54, 162, 235)'
                }
            ]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                r: {
                    min: 0,
                    max: 3
                }
            }
        }

    })
})
</script>

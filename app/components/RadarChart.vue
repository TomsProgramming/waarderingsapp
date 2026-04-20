<template>
    <canvas ref="canvas"></canvas>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
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

const props = defineProps({
    scores: {
        type: Array,
        default: () => [0, 0, 0, 0, 0]
    },
    kleur: {
        type: String,
        default: '#FF9408'
    }
})

const canvas = ref(null)
let grafiek = null

function hexRgba(hex, alpha) {
    const h = hex.replace('#', '')
    const r = parseInt(h.substring(0, 2), 16)
    const g = parseInt(h.substring(2, 4), 16)
    const b = parseInt(h.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

onMounted(() => {
    grafiek = new Chart(canvas.value, {
        type: 'radar',
        data: {
            labels: ['Presenteren', 'Organiseren', 'Zelfstandigheid', 'Samenwerken', 'Communiceren'],
            datasets: [
                {
                    label: '',
                    data: [...props.scores],
                    fill: true,
                    backgroundColor: hexRgba(props.kleur, 0.45),
                    borderColor: props.kleur,
                    pointRadius: 4,
                    pointHoverRadius: 4,
                    pointBackgroundColor: ['#ff9408', '#39d4bd', '#f35695', '#6049d8', '#0b79f2'],
                    pointBorderWidth: 0
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                r: {
                    angleLines: { color: '#333333' },
                    grid: { color: '#333333' },
                    pointLabels: { display: false },
                    ticks: { display: false, stepSize: 1 },
                    min: 0,
                    max: 5
                }
            }
        }
    })
})

watch(
    () => [props.scores, props.kleur],
    () => {
        if (!grafiek) return
        grafiek.data.datasets[0].data = [...props.scores]
        grafiek.data.datasets[0].backgroundColor = hexRgba(props.kleur, 0.45)
        grafiek.data.datasets[0].borderColor = props.kleur
        grafiek.update()
    },
    { deep: true }
)

onBeforeUnmount(() => {
    if (grafiek) grafiek.destroy()
})
</script>

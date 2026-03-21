<script setup lang="ts">
/**
 * MOCKUP: Risk Radar — Radar Chart + Domain Summary
 * Source: student-3-superhuman/02-risk-radar.html
 * Target: Integrated as "Risk Radar" tab content within PackageRisks.vue
 *
 * This is a design mockup with hardcoded data.
 * When implementing, use Chart.js radar type via vue-chartjs for the real chart.
 */
import { ref, computed } from 'vue';
import CommonBadge from '@/Components/Common/CommonBadge.vue';
import CommonButton from '@/Components/Common/CommonButton.vue';
import CommonTabs from '@/Components/Common/CommonTabs.vue';

// --- Mock domain data ---
const domains = ref([
    {
        id: 1,
        name: 'Functional Ability',
        colour: 'yellow' as const,
        assessed: 3,
        total: 5,
        score: 2.5,
        breakdown: { red: 30, amber: 20, green: 10 },
    },
    {
        id: 2,
        name: 'Health & Wellbeing',
        colour: 'red' as const,
        assessed: 4,
        total: 5,
        score: 3,
        breakdown: { red: 30, amber: 20, green: 30 },
    },
    {
        id: 3,
        name: 'Psychosocial',
        colour: 'yellow' as const,
        assessed: 3,
        total: 3,
        score: 2,
        breakdown: { red: 0, amber: 40, green: 20 },
    },
    {
        id: 4,
        name: 'Safety',
        colour: 'red' as const,
        assessed: 2,
        total: 3,
        score: 3,
        breakdown: { red: 35, amber: 0, green: 15 },
    },
    {
        id: 5,
        name: 'Daily Living',
        colour: 'gray' as const,
        assessed: 0,
        total: 3,
        score: 0,
        breakdown: { red: 0, amber: 0, green: 0 },
    },
]);

const totalAssessed = computed(() => domains.value.reduce((sum, d) => sum + d.assessed, 0));
const totalRiskAreas = computed(() => domains.value.reduce((sum, d) => sum + d.total, 0));
const activeDomains = computed(() => domains.value.filter((d) => d.assessed > 0).length);
const unassessed = computed(() => totalRiskAreas.value - totalAssessed.value);

const chartMode = ref<'radar' | 'bar'>('radar');

const domainDotClass = (colour: string) => {
    const map: Record<string, string> = {
        red: 'bg-red-500',
        yellow: 'bg-amber-500',
        green: 'bg-green-500',
        gray: 'bg-gray-300',
    };
    return map[colour] || 'bg-gray-300';
};

// Tab state (shared with accordion view — in real implementation this toggles the tab content)
const activeTab = ref('Risk Radar');
const tabItems = [{ title: 'All Risks' }, { title: 'Risk Radar' }];

// --- SVG Radar Chart helpers ---
const radarCenter = { x: 200, y: 180 };
const radarRadius = 160;
const axes = 5;

const angleFor = (index: number) => {
    return (Math.PI * 2 * index) / axes - Math.PI / 2;
};

const pointAt = (index: number, value: number, maxValue: number = 4) => {
    const angle = angleFor(index);
    const r = (value / maxValue) * radarRadius;
    return {
        x: radarCenter.x + r * Math.cos(angle),
        y: radarCenter.y + r * Math.sin(angle),
    };
};

// Grid ring points for a given level
const gridRing = (level: number) => {
    return Array.from({ length: axes }, (_, i) => {
        const p = pointAt(i, level);
        return `${p.x},${p.y}`;
    }).join(' ');
};

// Data polygon from domain scores
const dataPolygon = computed(() => {
    return domains.value
        .map((d, i) => {
            const p = pointAt(i, d.score);
            return `${p.x},${p.y}`;
        })
        .join(' ');
});

// Data point positions + colours
const dataPoints = computed(() => {
    return domains.value.map((d, i) => ({
        ...pointAt(i, d.score),
        colour: d.colour,
        name: d.name,
    }));
});

// Label positions (offset from outer ring)
const labelPositions = computed(() => {
    return domains.value.map((d, i) => {
        const p = pointAt(i, 4.6); // slightly outside outer ring
        return { ...p, name: d.name, anchor: i === 0 ? 'middle' : i < axes / 2 ? 'start' : 'end' };
    });
});

const fillColour = (colour: string) => {
    const map: Record<string, string> = { red: '#ef4444', yellow: '#f59e0b', green: '#22c55e', gray: '#d1d5db' };
    return map[colour] || '#d1d5db';
};
</script>

<template>
    <div class="flex min-h-screen flex-col">
        <!-- Page header (same as accordion view) -->
        <header class="border-b border-gray-200 bg-white px-6 py-4">
            <nav class="mb-1 text-xs text-gray-400">
                <span>Packages</span>
                <span class="mx-1">/</span>
                <span>Mrs Margaret Smith</span>
                <span class="mx-1">/</span>
                <span class="font-medium text-gray-700">Risks</span>
            </nav>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <h1 class="text-xl font-semibold text-gray-900">Risk Profile</h1>
                    <CommonBadge colour="red">
                        <span class="flex items-center gap-1.5">
                            <span class="h-2 w-2 rounded-full bg-red-500"></span>
                            Red — Safety
                        </span>
                    </CommonBadge>
                </div>
            </div>
            <div class="mt-3 -mb-4">
                <CommonTabs
                    v-model="activeTab"
                    :items="tabItems"
                />
            </div>
        </header>

        <!-- Split-view: Radar (55%) + Domain summary (45%) -->
        <div class="flex flex-1 overflow-hidden">
            <!-- Left panel: Radar chart -->
            <div class="flex w-[55%] flex-col border-r border-gray-200 bg-white">
                <!-- Assessment progress bar -->
                <div class="flex items-center justify-between border-b border-gray-100 px-5 py-3">
                    <div class="flex items-center gap-3">
                        <span class="text-sm font-medium text-gray-700">Assessment Progress</span>
                        <div class="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                            <div
                                class="h-full rounded-full bg-teal-600"
                                :style="{ width: `${(totalAssessed / totalRiskAreas) * 100}%` }"
                            ></div>
                        </div>
                        <span class="text-xs font-medium text-gray-500">{{ totalAssessed }} of {{ totalRiskAreas }} risk areas assessed</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="flex items-center rounded bg-gray-100 p-0.5">
                            <button
                                class="rounded px-2.5 py-1 text-[11px] font-medium"
                                :class="chartMode === 'radar' ? 'bg-white text-gray-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
                                @click="chartMode = 'radar'"
                            >
                                Radar
                            </button>
                            <button
                                class="rounded px-2.5 py-1 text-[11px] font-medium"
                                :class="chartMode === 'bar' ? 'bg-white text-gray-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
                                @click="chartMode = 'bar'"
                            >
                                Bar
                            </button>
                        </div>
                    </div>
                </div>

                <!-- SVG Radar chart -->
                <div
                    v-if="chartMode === 'radar'"
                    class="flex flex-1 items-center justify-center p-6"
                >
                    <svg
                        viewBox="0 0 400 380"
                        class="w-full max-w-sm"
                    >
                        <g>
                            <!-- Grid rings: levels 1-4 -->
                            <polygon
                                v-for="level in [4, 3, 2, 1]"
                                :key="level"
                                :points="gridRing(level)"
                                fill="none"
                                stroke="#e5e7eb"
                                stroke-width="1"
                            />

                            <!-- Axis lines -->
                            <line
                                v-for="(_, i) in domains"
                                :key="'axis-' + i"
                                :x1="radarCenter.x"
                                :y1="radarCenter.y"
                                :x2="pointAt(i, 4).x"
                                :y2="pointAt(i, 4).y"
                                stroke="#e5e7eb"
                                stroke-width="1"
                            />

                            <!-- Data polygon -->
                            <polygon
                                :points="dataPolygon"
                                fill="rgba(0, 127, 126, 0.12)"
                                stroke="#007F7E"
                                stroke-width="2"
                            />

                            <!-- Data points -->
                            <circle
                                v-for="(point, i) in dataPoints"
                                :key="'point-' + i"
                                :cx="point.x"
                                :cy="point.y"
                                r="5"
                                :fill="fillColour(point.colour)"
                                stroke="white"
                                stroke-width="2"
                            />
                        </g>

                        <!-- Domain labels -->
                        <text
                            v-for="(label, i) in labelPositions"
                            :key="'label-' + i"
                            :x="label.x"
                            :y="label.y"
                            :text-anchor="label.anchor"
                            class="text-[11px] font-medium"
                            fill="#374151"
                        >
                            {{ label.name }}
                        </text>

                        <!-- Scale labels -->
                        <text
                            v-for="level in [4, 3, 2, 1]"
                            :key="'scale-' + level"
                            :x="radarCenter.x + 10"
                            :y="radarCenter.y - (level / 4) * radarRadius + 4"
                            class="text-[9px]"
                            fill="#9ca3af"
                        >
                            {{ level }}
                        </text>
                    </svg>
                </div>

                <!-- Bar chart alternative -->
                <div
                    v-else
                    class="flex flex-1 flex-col justify-center gap-4 p-6"
                >
                    <div
                        v-for="domain in domains"
                        :key="domain.id"
                        class="flex items-center gap-3"
                    >
                        <span class="w-36 text-right text-sm font-medium text-gray-700">{{ domain.name }}</span>
                        <div class="flex h-6 flex-1 overflow-hidden rounded bg-gray-100">
                            <div
                                class="h-full bg-red-400"
                                :style="{ width: `${(domain.score / 4) * 100}%` }"
                            ></div>
                        </div>
                        <span class="w-8 text-xs text-gray-500">{{ domain.score }}</span>
                    </div>
                </div>

                <!-- Legend -->
                <div class="flex items-center gap-5 border-t border-gray-100 px-5 py-2.5 text-[11px] text-gray-500">
                    <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-red-500"></span>Red (3+)</span>
                    <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-amber-500"></span>Amber (2)</span>
                    <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-green-500"></span>Green (0-1)</span>
                    <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-gray-300"></span>Not assessed</span>
                </div>
            </div>

            <!-- Right panel: Domain summary (45%) -->
            <div class="flex w-[45%] flex-col bg-white">
                <div class="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
                    <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500">Clinical Domains</h3>
                </div>

                <div class="flex-1 overflow-y-auto">
                    <div
                        v-for="(domain, index) in domains"
                        :key="domain.id"
                        class="cursor-pointer border-b border-gray-50 px-4 py-3 transition-colors hover:bg-gray-50"
                    >
                        <div class="mb-2 flex items-center gap-3">
                            <kbd class="rounded border border-gray-200 bg-gray-100 px-1.5 text-[10px] text-gray-500">{{ index + 1 }}</kbd>
                            <span
                                class="h-2.5 w-2.5 shrink-0 rounded-full"
                                :class="domainDotClass(domain.colour)"
                            ></span>
                            <span
                                class="flex-1 text-sm font-medium"
                                :class="domain.assessed > 0 ? 'text-gray-900' : 'text-gray-500'"
                            >
                                {{ domain.name }}
                            </span>
                            <span
                                class="text-[11px]"
                                :class="domain.assessed > 0 ? 'text-gray-400' : 'text-gray-300'"
                            >
                                {{ domain.assessed }} / {{ domain.total }} assessed
                            </span>
                        </div>
                        <div class="ml-10 flex items-center gap-2">
                            <div class="flex h-2.5 flex-1 overflow-hidden rounded bg-gray-100">
                                <div
                                    v-if="domain.breakdown.red"
                                    class="h-full bg-red-400"
                                    :style="{ width: domain.breakdown.red + '%' }"
                                ></div>
                                <div
                                    v-if="domain.breakdown.amber"
                                    class="h-full bg-amber-400"
                                    :style="{ width: domain.breakdown.amber + '%' }"
                                ></div>
                                <div
                                    v-if="domain.breakdown.green"
                                    class="h-full bg-green-400"
                                    :style="{ width: domain.breakdown.green + '%' }"
                                ></div>
                            </div>
                            <span
                                class="h-2.5 w-2.5 shrink-0 rounded-full"
                                :class="domainDotClass(domain.colour)"
                            ></span>
                        </div>
                    </div>
                </div>

                <!-- Assess all button -->
                <div class="border-t border-gray-100 px-4 py-3">
                    <CommonButton
                        class="w-full justify-center"
                        label="Assess All Remaining"
                        leading-icon="heroicons:clipboard-document-check"
                    >
                        <template #trailing>
                            <span class="ml-1 text-xs text-teal-200">({{ unassessed }} unassessed)</span>
                        </template>
                    </CommonButton>
                </div>
            </div>
        </div>

        <!-- Bottom status bar -->
        <div class="flex items-center gap-4 bg-gray-800 px-4 py-1.5 text-[11px] font-medium text-gray-400">
            <span class="flex items-center gap-1"><kbd class="rounded border border-gray-600 bg-gray-700 px-1 text-[10px] text-gray-300">1</kbd>-<kbd class="rounded border border-gray-600 bg-gray-700 px-1 text-[10px] text-gray-300">5</kbd> Jump to domain</span>
            <span class="flex items-center gap-1"><kbd class="rounded border border-gray-600 bg-gray-700 px-1 text-[10px] text-gray-300">R</kbd> Radar</span>
            <span class="flex items-center gap-1"><kbd class="rounded border border-gray-600 bg-gray-700 px-1 text-[10px] text-gray-300">B</kbd> Bar chart</span>
            <span class="flex items-center gap-1"><kbd class="rounded border border-gray-600 bg-gray-700 px-1 text-[10px] text-gray-300">A</kbd> Assess all</span>
            <div class="flex-1"></div>
            <span class="text-gray-500">{{ totalAssessed }} of {{ totalRiskAreas }} assessed · {{ activeDomains }} domains active</span>
        </div>
    </div>
</template>

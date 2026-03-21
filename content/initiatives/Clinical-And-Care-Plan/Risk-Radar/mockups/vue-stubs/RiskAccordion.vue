<script setup lang="ts">
/**
 * MOCKUP: Risk Accordion — Split-View Layout
 * Source: student-3-superhuman/03-card-accordion.html
 * Target: resources/js/Pages/Packages/tabs/PackageRisks.vue (replaces PrimeVue DataTable)
 *
 * This is a design mockup with hardcoded data.
 * When implementing, replace mock data with real props from PackageRiskController.
 */
import { ref, computed } from 'vue';
import CommonCard from '@/Components/Common/CommonCard.vue';
import CommonBadge from '@/Components/Common/CommonBadge.vue';
import CommonButton from '@/Components/Common/CommonButton.vue';
import CommonCollapsible from '@/Components/Common/CommonCollapsible.vue';
import CommonTabs from '@/Components/Common/CommonTabs.vue';
import CommonIcon from '@/Components/Common/CommonIcon.vue';
import CommonEmptyPlaceholder from '@/Components/Common/CommonEmptyPlaceholder.vue';

// --- Mock data (replace with real props) ---
const risks = ref([
    {
        id: 1,
        name: 'Falls',
        domain: 'Functional Ability',
        consequence: { level: 'Major', score: 3, colour: 'red' as const },
        carePlan: true,
        date: '5 Mar',
        details: 'History of 3 falls in past 6 months. Last fall resulted in bruising to left hip. Uses walking frame indoors.',
        actionPlan: 'Falls alarm installed. Physio review scheduled. Walking frame checked and adjusted.',
    },
    {
        id: 2,
        name: 'Mobility',
        domain: 'Functional Ability',
        consequence: { level: 'Minor', score: 1, colour: 'green' as const },
        carePlan: false,
        date: '3 Mar',
        details: 'Reduced mobility due to arthritis. Can mobilise with walking frame.',
        actionPlan: 'Continue physio exercises. Monitor for deterioration.',
    },
    {
        id: 3,
        name: 'Continence',
        domain: 'Functional Ability',
        consequence: { level: 'Moderate', score: 2, colour: 'yellow' as const },
        carePlan: true,
        date: '1 Mar',
        details: 'Occasional urinary incontinence, particularly at night.',
        actionPlan: 'Continence aids provided. GP referral for assessment.',
    },
    {
        id: 4,
        name: 'Nutrition & Hydration',
        domain: 'Health & Wellbeing',
        consequence: { level: 'Major', score: 3, colour: 'red' as const },
        carePlan: true,
        date: '28 Feb',
        details: 'Reduced appetite reported over past 6 weeks. Weight loss of 2kg noted at last review. Currently on fortified meals. Dietitian referral pending. Client reports difficulty swallowing certain textures.',
        actionPlan: 'Monitor weekly weight. Fortified supplements twice daily. Dietitian review by end of month. Speech pathologist assessment for swallowing difficulties scheduled 10 March.',
        questions: [
            { id: 1, text: 'How many meals has the client eaten today?', type: 'Choice', typeColour: 'blue' as const },
            { id: 2, text: 'Has the client been drinking enough water throughout the day?', type: 'Yes/No', typeColour: 'teal' as const },
            { id: 3, text: 'Any concerns about weight changes or appetite?', type: 'Text', typeColour: 'yellow' as const },
            { id: 4, text: 'Has the client had any difficulty swallowing food or liquids?', type: 'Yes/No', typeColour: 'teal' as const },
        ],
    },
    {
        id: 5,
        name: 'Medication Management',
        domain: 'Health & Wellbeing',
        consequence: { level: 'Moderate', score: 2, colour: 'yellow' as const },
        carePlan: false,
        date: '27 Feb',
        details: 'Taking 8+ medications. Some compliance concerns.',
        actionPlan: 'Webster pack arranged. Pharmacist medication review scheduled.',
    },
    {
        id: 6,
        name: 'Skin Integrity',
        domain: 'Health & Wellbeing',
        consequence: { level: 'Minor', score: 1, colour: 'green' as const },
        carePlan: false,
        date: '25 Feb',
        details: 'Dry, fragile skin. No current wounds.',
        actionPlan: 'Moisturiser applied daily. Skin checks at each visit.',
    },
    {
        id: 7,
        name: 'Social Isolation',
        domain: 'Psychosocial',
        consequence: { level: 'Moderate', score: 2, colour: 'yellow' as const },
        carePlan: true,
        date: '24 Feb',
        details: 'Lives alone. Limited family contact. Reports feeling lonely.',
        actionPlan: 'Social group referral made. Weekly phone check-ins arranged.',
    },
    {
        id: 8,
        name: 'Elder Abuse',
        domain: 'Safety',
        consequence: { level: 'Major', score: 3, colour: 'red' as const },
        carePlan: true,
        date: '15 Feb',
        details: 'Financial concerns raised by neighbour. Unexplained withdrawal of funds.',
        actionPlan: 'Safeguarding referral submitted. Financial advocate engaged.',
    },
]);

const selectedRiskId = ref(4); // Default: Nutrition & Hydration
const selectedRisk = computed(() => risks.value.find((r) => r.id === selectedRiskId.value));

const selectRisk = (id: number) => {
    selectedRiskId.value = id;
};

// Severity dot colour mapping
const severityDotClass = (colour: string) => {
    const map: Record<string, string> = {
        red: 'bg-red-500',
        yellow: 'bg-amber-500',
        green: 'bg-green-500',
        gray: 'bg-gray-300',
    };
    return map[colour] || 'bg-gray-300';
};

// Badge colour mapping for consequence
const badgeColour = (colour: string) => {
    const map: Record<string, string> = {
        red: 'red',
        yellow: 'yellow',
        green: 'green',
    };
    return map[colour] || 'gray';
};

// Summary stats
const assessed = computed(() => risks.value.filter((r) => r.consequence).length);
const redCount = computed(() => risks.value.filter((r) => r.consequence?.colour === 'red').length);
const amberCount = computed(() => risks.value.filter((r) => r.consequence?.colour === 'yellow').length);
const greenCount = computed(() => risks.value.filter((r) => r.consequence?.colour === 'green').length);

// Tab state
const activeTab = ref('All Risks');
const tabItems = [{ title: 'All Risks' }, { title: 'Risk Radar' }];
</script>

<template>
    <div class="flex min-h-screen flex-col">
        <!-- Page header -->
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

            <!-- Tabs -->
            <div class="mt-3 -mb-4">
                <CommonTabs
                    v-model="activeTab"
                    :items="tabItems"
                />
            </div>
        </header>

        <!-- Split-view content -->
        <div class="flex flex-1 overflow-hidden">
            <!-- Left panel: Risk list (60%) -->
            <div class="flex w-[60%] flex-col border-r border-gray-200 bg-white">
                <!-- Summary stats bar -->
                <div class="flex items-center justify-between border-b border-gray-100 px-4 py-2 text-xs text-gray-500">
                    <span>{{ risks.length }} risks · {{ assessed }} assessed</span>
                    <div class="flex items-center gap-3">
                        <span class="flex items-center gap-1">
                            <span class="h-2 w-2 rounded-full bg-red-500"></span>{{ redCount }}
                        </span>
                        <span class="flex items-center gap-1">
                            <span class="h-2 w-2 rounded-full bg-amber-500"></span>{{ amberCount }}
                        </span>
                        <span class="flex items-center gap-1">
                            <span class="h-2 w-2 rounded-full bg-green-500"></span>{{ greenCount }}
                        </span>
                    </div>
                </div>

                <!-- Scrollable risk list -->
                <div class="flex-1 overflow-y-auto">
                    <div
                        v-for="risk in risks"
                        :key="risk.id"
                        class="flex cursor-pointer items-center gap-3 border-l-2 px-4 py-2.5 transition-colors duration-75"
                        :class="
                            selectedRiskId === risk.id
                                ? 'border-l-teal-700 bg-teal-50'
                                : 'border-l-transparent hover:bg-gray-50'
                        "
                        @click="selectRisk(risk.id)"
                    >
                        <span
                            class="h-2.5 w-2.5 shrink-0 rounded-full"
                            :class="severityDotClass(risk.consequence?.colour)"
                        ></span>
                        <div class="min-w-0 flex-1">
                            <div class="flex items-center gap-2">
                                <span class="truncate text-sm font-medium text-gray-900">{{ risk.name }}</span>
                                <CommonBadge
                                    v-if="risk.consequence"
                                    :colour="badgeColour(risk.consequence.colour)"
                                    size="sm"
                                >
                                    {{ risk.consequence.level }} ({{ risk.consequence.score }})
                                </CommonBadge>
                            </div>
                            <div class="mt-0.5 text-[11px] text-gray-400">
                                {{ risk.domain }}
                                <template v-if="risk.carePlan"> · Care Plan</template>
                            </div>
                        </div>
                        <span class="shrink-0 text-[11px] text-gray-400">{{ risk.date }}</span>
                    </div>

                    <!-- Empty state -->
                    <div
                        v-if="risks.length === 0"
                        class="flex min-h-[400px] items-center justify-center"
                    >
                        <CommonEmptyPlaceholder text="No risks found" />
                    </div>
                </div>
            </div>

            <!-- Right panel: Risk detail (40%) -->
            <div
                v-if="selectedRisk"
                class="flex w-[40%] flex-col overflow-y-auto bg-white"
            >
                <!-- Detail header -->
                <div class="border-b border-gray-100 px-5 py-4">
                    <div class="mb-2 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span
                                class="h-3 w-3 rounded-full"
                                :class="severityDotClass(selectedRisk.consequence?.colour)"
                            ></span>
                            <h2 class="text-lg font-semibold text-gray-900">{{ selectedRisk.name }}</h2>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <CommonBadge
                                v-if="selectedRisk.consequence"
                                :colour="badgeColour(selectedRisk.consequence.colour)"
                                size="sm"
                            >
                                {{ selectedRisk.consequence.level }} ({{ selectedRisk.consequence.score }})
                            </CommonBadge>
                            <CommonBadge
                                v-if="selectedRisk.carePlan"
                                colour="blue"
                                size="sm"
                            >
                                Care Plan
                            </CommonBadge>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 text-xs text-gray-500">
                        <span>{{ selectedRisk.domain }}</span>
                        <span>·</span>
                        <span>Updated {{ selectedRisk.date }} 2026</span>
                    </div>
                </div>

                <!-- Properties grid -->
                <div class="border-b border-gray-100 px-5 py-3">
                    <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                        <div class="flex justify-between">
                            <span class="text-gray-400">Domain</span>
                            <span class="font-medium text-gray-700">{{ selectedRisk.domain }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">Consequence</span>
                            <span
                                class="font-medium"
                                :class="selectedRisk.consequence?.colour === 'red' ? 'text-red-700' : selectedRisk.consequence?.colour === 'yellow' ? 'text-amber-700' : 'text-green-700'"
                            >
                                {{ selectedRisk.consequence?.level }} ({{ selectedRisk.consequence?.score }})
                            </span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">Mitigation</span>
                            <span class="font-medium text-gray-700">Partial</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">Residual</span>
                            <span
                                class="font-medium"
                                :class="selectedRisk.consequence?.colour === 'red' ? 'text-red-700' : 'text-gray-700'"
                            >
                                {{ selectedRisk.consequence?.colour === 'red' ? 'Red' : selectedRisk.consequence?.colour === 'yellow' ? 'Amber' : 'Green' }}
                            </span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">Need</span>
                            <span class="font-medium text-gray-700">Identified</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">Care Plan</span>
                            <span :class="selectedRisk.carePlan ? 'font-medium text-teal-700' : 'text-gray-400'">
                                {{ selectedRisk.carePlan ? 'Yes' : 'No' }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Detail body -->
                <div class="flex-1 space-y-4 px-5 py-4">
                    <!-- Details -->
                    <div>
                        <h3 class="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Details</h3>
                        <p class="text-sm leading-relaxed text-gray-700">{{ selectedRisk.details }}</p>
                    </div>

                    <!-- Action Plan -->
                    <div>
                        <h3 class="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Action Plan</h3>
                        <p class="text-sm leading-relaxed text-gray-700">{{ selectedRisk.actionPlan }}</p>
                    </div>

                    <!-- Check-in Questions (feature-flagged to CarePartnerCheckInsFeature) -->
                    <div
                        v-if="selectedRisk.questions?.length"
                        class="border-t border-gray-100 pt-4"
                    >
                        <CommonCollapsible
                            :open="true"
                            variant="soft"
                        >
                            <template #title>
                                <div class="flex items-center gap-2">
                                    <span class="text-xs font-semibold uppercase tracking-wider text-gray-700">Check-in Questions</span>
                                    <span class="text-[10px] text-gray-400">{{ selectedRisk.questions.length }} questions</span>
                                </div>
                            </template>
                            <template #actions>
                                <div class="flex items-center gap-1.5">
                                    <CommonButton
                                        variant="soft"
                                        size="xs"
                                        label="Add"
                                        leading-icon="heroicons:plus"
                                    />
                                    <CommonButton
                                        variant="ghost"
                                        size="xs"
                                        label="Reorder"
                                    />
                                </div>
                            </template>

                            <div class="mt-2 space-y-1">
                                <div
                                    v-for="question in selectedRisk.questions"
                                    :key="question.id"
                                    class="flex items-center gap-2 rounded border border-gray-100 px-3 py-2.5 transition-colors hover:bg-teal-50"
                                >
                                    <!-- Drag handle -->
                                    <span class="shrink-0 cursor-grab text-gray-300 hover:text-gray-400">
                                        <CommonIcon
                                            icon="radix-icons:drag-handle-dots-2"
                                            class="h-4 w-4"
                                        />
                                    </span>
                                    <span class="flex-1 text-sm text-gray-700">{{ question.text }}</span>
                                    <CommonBadge
                                        :colour="question.typeColour"
                                        size="sm"
                                    >
                                        {{ question.type }}
                                    </CommonBadge>
                                </div>
                            </div>
                        </CommonCollapsible>
                    </div>
                </div>

                <!-- Action buttons -->
                <div class="flex items-center gap-2 border-t border-gray-100 px-5 py-3">
                    <CommonButton
                        label="Assess"
                        leading-icon="heroicons:clipboard-document-check"
                    />
                    <CommonButton
                        variant="soft"
                        label="Edit"
                        leading-icon="heroicons-outline:pencil"
                    />
                    <CommonButton
                        variant="ghost"
                        colour="red"
                        label="Delete"
                        leading-icon="heroicons-outline:trash"
                    />
                    <CommonButton
                        variant="ghost"
                        label="Questions"
                        leading-icon="heroicons-outline:chat-bubble-left-right"
                    />
                </div>
            </div>
        </div>

        <!-- Bottom keyboard hints bar -->
        <div class="flex items-center gap-4 bg-gray-800 px-4 py-1.5 text-[11px] font-medium text-gray-400">
            <span class="flex items-center gap-1"><kbd class="rounded border border-gray-600 bg-gray-700 px-1 text-[10px] text-gray-300">↑↓</kbd> Navigate</span>
            <span class="flex items-center gap-1"><kbd class="rounded border border-gray-600 bg-gray-700 px-1 text-[10px] text-gray-300">↵</kbd> Open</span>
            <span class="flex items-center gap-1"><kbd class="rounded border border-gray-600 bg-gray-700 px-1 text-[10px] text-gray-300">Q</kbd> Toggle questions</span>
            <span class="flex items-center gap-1"><kbd class="rounded border border-gray-600 bg-gray-700 px-1 text-[10px] text-gray-300">A</kbd> Assess</span>
            <span class="flex items-center gap-1"><kbd class="rounded border border-gray-600 bg-gray-700 px-1 text-[10px] text-gray-300">/</kbd> Search</span>
            <div class="flex-1"></div>
            <span class="text-gray-500">
                {{ selectedRisk?.name }} · {{ selectedRisk?.questions?.length || 0 }} questions ·
                {{ selectedRiskId }} of {{ risks.length }}
            </span>
        </div>
    </div>
</template>

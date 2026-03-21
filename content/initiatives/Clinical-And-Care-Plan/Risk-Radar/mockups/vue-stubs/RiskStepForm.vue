<script setup lang="ts">
/**
 * MOCKUP: Risk Step Form — 3-Step Wizard
 * Source: student-3-superhuman/04-step-form.html
 * Target: resources/js/Pages/Packages/Risks/Create.vue + Edit.vue
 *
 * IMPORTANT: This preserves the CURRENT WORKFLOW from RiskForm.vue.
 * - Step 1 (Basics): Risk category, need, care plan, details, action plan
 * - Step 2 (Details): Category-specific fields — the EXACT same 26 sections
 *   (FallsSection, WoundManagementSection, etc.) rendered conditionally
 * - Step 3 (Questions): Check-in questions (feature-flagged)
 *
 * The existing RiskForm.vue form fields and category sections are reused.
 * This mockup shows the step navigation wrapper only — it does NOT duplicate
 * the 26 category-specific section components. During implementation, import
 * and render them exactly as RiskForm.vue does today.
 */
import { ref, computed } from 'vue';
import CommonButton from '@/Components/Common/CommonButton.vue';
import CommonCard from '@/Components/Common/CommonCard.vue';
import CommonFormField from '@/Components/Common/CommonFormField.vue';
import CommonSelectMenu from '@/Components/Common/CommonSelectMenu.vue';
import CommonTextarea from '@/Components/Common/CommonTextarea.vue';
import CommonCheckbox from '@/Components/Common/CommonCheckbox.vue';
import CommonStepNavigation from '@/Components/Common/CommonStepNavigation.vue';
import CommonIcon from '@/Components/Common/CommonIcon.vue';

// --- Mock options (replace with real PackageRiskOptions props) ---
const mockCategories = [
    { id: 1, label: 'Falls' },
    { id: 2, label: 'Mobility' },
    { id: 3, label: 'Continence' },
    { id: 4, label: 'Nutrition & Hydration' },
    { id: 5, label: 'Medication Management' },
    { id: 6, label: 'Skin Integrity' },
    { id: 7, label: 'Pain management' },
    { id: 8, label: 'Social isolation' },
    { id: 9, label: 'Depression & Anxiety' },
    { id: 10, label: 'Carer burnout' },
    { id: 11, label: 'Elder Abuse' },
    { id: 12, label: 'Home Safety' },
    { id: 13, label: 'Wound management' },
    { id: 14, label: 'Activity intolerance' },
    { id: 15, label: 'Pressure injury' },
    { id: 16, label: 'Mental health' },
    { id: 17, label: 'Medication safety' },
    { id: 18, label: 'Medical' },
    { id: 19, label: 'Infection' },
    { id: 20, label: 'In-home safety' },
    { id: 21, label: 'Hydration and nutrition' },
    { id: 22, label: 'Hearing/Vision Loss' },
    { id: 23, label: 'Emergency evacuation' },
    { id: 24, label: 'Diabetes' },
    { id: 25, label: 'Allergies' },
    { id: 26, label: 'Behavioural' },
    { id: 27, label: 'Cognition' },
    { id: 28, label: 'Delirium' },
];

const mockNeeds = [
    { uuid: 'n1', text: 'Personal Care' },
    { uuid: 'n2', text: 'Domestic Assistance' },
    { uuid: 'n3', text: 'Social Support' },
];

// --- Form state ---
const currentStep = ref(1);

const form = ref({
    risk_category: null as any,
    package_need_uuids: [] as string[],
    details: '',
    action_plan: '',
    add_to_care_plan: true,
    risk_not_identified_during_assessment: false,
});

// Categories that have specific detail fields (Step 2 is shown for these)
const categoriesWithDetails = [
    'Falls', 'Wound management', 'Activity intolerance', 'Social isolation',
    'Skin integrity', 'Pressure injury', 'Pain management', 'Mental health',
    'Medication safety', 'Medical', 'Infection', 'In-home safety',
    'Hydration and nutrition', 'Hearing/Vision Loss', 'Emergency evacuation',
    'Diabetes', 'Allergies', 'Behavioural', 'Carer burnout', 'Cognition',
    'Delirium', 'Choking/Aspiration', 'Continence', 'Clinical Equipment',
    'Palliative Care', 'Oral Health', 'Other',
];

const hasDetailStep = computed(() => {
    if (!form.value.risk_category) return false;
    if (form.value.risk_not_identified_during_assessment) return false;
    return categoriesWithDetails.includes(form.value.risk_category.label);
});

// Step definitions
const steps = computed(() => {
    const baseSteps = [
        {
            id: 1,
            label: 'Basics',
            status: currentStep.value === 1 ? 'current' : currentStep.value > 1 ? 'complete' : 'upcoming',
            completed: currentStep.value > 1,
        },
    ];

    if (hasDetailStep.value) {
        baseSteps.push({
            id: 2,
            label: 'Details',
            status: currentStep.value === 2 ? 'current' : currentStep.value > 2 ? 'complete' : 'upcoming',
            completed: currentStep.value > 2,
        });
    }

    baseSteps.push({
        id: hasDetailStep.value ? 3 : 2,
        label: 'Questions',
        status: currentStep.value === (hasDetailStep.value ? 3 : 2)
            ? 'current'
            : 'upcoming',
        completed: false,
    });

    return baseSteps;
});

const totalSteps = computed(() => steps.value.length);

const canGoNext = computed(() => {
    if (currentStep.value === 1) {
        return !!form.value.risk_category && !!form.value.action_plan;
    }
    return true;
});

const goNext = () => {
    if (currentStep.value < totalSteps.value) {
        // Skip Step 2 if no detail fields for this category
        if (currentStep.value === 1 && !hasDetailStep.value) {
            currentStep.value = 2; // Goes to Questions (which is step id 2 when no details)
        } else {
            currentStep.value++;
        }
    }
};

const goPrev = () => {
    if (currentStep.value > 1) {
        currentStep.value--;
    }
};

const handleStepClick = (stepId: number) => {
    // Only allow navigating to completed or current steps
    const step = steps.value.find((s) => s.id === stepId);
    if (step && step.status !== 'upcoming') {
        currentStep.value = stepId;
    }
};

// Mock check-in questions for Step 3
const questions = ref([
    { id: 1, text: 'How many meals has the client eaten today?', type: 'Multiple Choice' },
    { id: 2, text: 'Has the client been drinking enough water?', type: 'Yes/No' },
]);

const newQuestion = ref('');
const newQuestionType = ref('Free Text');
const questionTypes = ['Free Text', 'Yes/No', 'Multiple Choice', 'Rating 1-5'];

const addQuestion = () => {
    if (newQuestion.value.trim()) {
        questions.value.push({
            id: Date.now(),
            text: newQuestion.value.trim(),
            type: newQuestionType.value,
        });
        newQuestion.value = '';
    }
};

const removeQuestion = (id: number) => {
    questions.value = questions.value.filter((q) => q.id !== id);
};

const questionTypeBadgeColour = (type: string) => {
    const map: Record<string, string> = {
        'Free Text': 'blue',
        'Yes/No': 'green',
        'Multiple Choice': 'purple',
        'Rating 1-5': 'yellow',
    };
    return map[type] || 'gray';
};
</script>

<template>
    <div class="flex min-h-screen items-start justify-center bg-gray-900/50 pt-16">
        <CommonCard class="flex w-full max-w-xl flex-col shadow-2xl" style="max-height: calc(100vh - 8rem)">
            <!-- Modal header with step navigation -->
            <div class="border-b border-gray-100 px-6 py-4">
                <div class="mb-3 flex items-center justify-between">
                    <h2 class="text-lg font-semibold text-gray-900">New Risk</h2>
                    <button class="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                        <kbd class="rounded border border-gray-200 bg-gray-100 px-1 text-[10px]">Esc</kbd>
                        Close
                    </button>
                </div>

                <!-- Step navigation (using existing CommonStepNavigation) -->
                <CommonStepNavigation
                    :steps="steps"
                    @step-click="handleStepClick"
                />
            </div>

            <!-- Step content -->
            <div class="flex-1 overflow-y-auto px-6 py-5">
                <!-- STEP 1: Basics -->
                <div
                    v-if="currentStep === 1"
                    class="space-y-4"
                >
                    <CommonFormField
                        label="Risk Category"
                        name="risk_category"
                        required
                    >
                        <CommonSelectMenu
                            v-model="form.risk_category"
                            name="risk_category"
                            placeholder="Select a Risk Category"
                            :items="mockCategories"
                            label-key="label"
                        />
                    </CommonFormField>

                    <CommonFormField
                        label="Need"
                        name="package_need_uuids"
                    >
                        <CommonSelectMenu
                            v-model="form.package_need_uuids"
                            name="package_need_uuids"
                            placeholder="Select a Need"
                            :items="mockNeeds"
                            label-key="text"
                            value-key="uuid"
                            multiple
                            searchable
                        />
                    </CommonFormField>

                    <CommonFormField name="add_to_care_plan">
                        <CommonCheckbox
                            label="Add to care plan"
                            v-model="form.add_to_care_plan"
                        />
                    </CommonFormField>

                    <CommonFormField name="risk_not_identified_during_assessment">
                        <CommonCheckbox
                            label="Risk not identified during assessment"
                            v-model="form.risk_not_identified_during_assessment"
                        />
                    </CommonFormField>

                    <CommonFormField
                        label="Details"
                        name="details"
                    >
                        <CommonTextarea
                            v-model="form.details"
                            name="details"
                            placeholder="Describe the risk details..."
                            :rows="3"
                        />
                    </CommonFormField>

                    <CommonFormField
                        label="Action Plan"
                        name="action_plan"
                        required
                    >
                        <CommonTextarea
                            v-model="form.action_plan"
                            name="action_plan"
                            placeholder="Enter action plan..."
                            :rows="3"
                        />
                    </CommonFormField>
                </div>

                <!-- STEP 2: Category-Specific Details -->
                <!--
                    IMPLEMENTATION NOTE:
                    This step renders the EXACT SAME category-specific sections
                    that RiskForm.vue currently shows conditionally.

                    In the real implementation, import and render:
                    - FallsSection (v-if categoryChecks.isFallsRisk)
                    - WoundManagementSection (v-if categoryChecks.isWoundManagementRisk)
                    - ActivityIntoleranceSection
                    - SocialIsolationSection
                    - SkinIntegritySection
                    - PressureInjurySection
                    - PainManagementSection
                    - MentalHealthSection
                    - MedicationSafetySection
                    - MedicalSection
                    - InfectionSection
                    - InHomeSafetySection
                    - HydrationNutritionSection
                    - HearingVisionLossSection
                    - EmergencyEvacuationSection
                    - DiabetesSection
                    - AllergiesEnhancementSection
                    - BehaviouralSection
                    - CarerBurnoutEnhancementSection
                    - CognitionEnhancementSection
                    - DeliriumSection
                    - ChokingAspirationSection
                    - ContinenceSection
                    - ClinicalEquipmentSection
                    - PalliativeCareSection
                    - OralHealthSection
                    - OtherSection

                    The childFormData pattern and updateX callbacks stay identical.
                    Only the LAYOUT changes — these sections now live in Step 2
                    instead of appearing below the basics fields.
                -->
                <div
                    v-if="currentStep === 2 && hasDetailStep"
                    class="space-y-4"
                >
                    <div class="rounded-lg border border-teal-200 bg-teal-50 p-4">
                        <div class="flex items-start gap-3">
                            <CommonIcon
                                icon="heroicons:information-circle"
                                class="mt-0.5 h-5 w-5 text-teal-700"
                            />
                            <div>
                                <p class="text-sm font-medium text-teal-800">
                                    {{ form.risk_category?.label }} — Category-specific fields
                                </p>
                                <p class="mt-1 text-xs text-teal-600">
                                    These fields are specific to the selected risk category.
                                    In the real implementation, the existing category section
                                    component (e.g., FallsSection, WoundManagementSection)
                                    renders here with all its form fields and options.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Placeholder showing which section would render -->
                    <div class="space-y-3 rounded-lg border border-dashed border-gray-300 p-4">
                        <p class="text-sm font-medium text-gray-600">
                            Component: <code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs">{{ form.risk_category?.label }}Section</code>
                        </p>
                        <p class="text-xs text-gray-400">
                            This renders the same category-specific fields currently in RiskForm.vue
                            (wound type, falls history, medication lists, etc.) with the same
                            options props passed from PackageRiskOptions.
                        </p>
                        <div class="space-y-2 pt-2">
                            <div class="h-10 animate-pulse rounded bg-gray-100"></div>
                            <div class="h-10 animate-pulse rounded bg-gray-100"></div>
                            <div class="h-10 animate-pulse rounded bg-gray-100"></div>
                        </div>
                    </div>
                </div>

                <!-- STEP 3 (or Step 2 if no details): Check-in Questions -->
                <div
                    v-if="(currentStep === 3 && hasDetailStep) || (currentStep === 2 && !hasDetailStep)"
                    class="space-y-4"
                >
                    <p class="text-sm text-gray-600">
                        Add check-in questions that care partners will answer during visits.
                        These questions help track the client's risk status over time.
                    </p>

                    <!-- Existing questions -->
                    <div
                        v-if="questions.length"
                        class="space-y-1"
                    >
                        <div
                            v-for="question in questions"
                            :key="question.id"
                            class="flex items-center gap-2 rounded border border-gray-100 px-3 py-2.5 transition-colors hover:bg-teal-50"
                        >
                            <CommonIcon
                                icon="radix-icons:drag-handle-dots-2"
                                class="h-4 w-4 shrink-0 cursor-grab text-gray-300"
                            />
                            <span class="flex-1 text-sm text-gray-700">{{ question.text }}</span>
                            <span
                                class="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium"
                                :class="{
                                    'bg-blue-50 text-blue-700 border border-blue-200': question.type === 'Free Text',
                                    'bg-green-50 text-green-700 border border-green-200': question.type === 'Yes/No',
                                    'bg-purple-50 text-purple-700 border border-purple-200': question.type === 'Multiple Choice',
                                    'bg-amber-50 text-amber-700 border border-amber-200': question.type === 'Rating 1-5',
                                }"
                            >
                                {{ question.type }}
                            </span>
                            <button
                                class="shrink-0 text-gray-400 hover:text-red-500"
                                @click="removeQuestion(question.id)"
                            >
                                <CommonIcon
                                    icon="heroicons-outline:x-mark"
                                    class="h-4 w-4"
                                />
                            </button>
                        </div>
                    </div>

                    <!-- Add question -->
                    <div class="space-y-2 rounded-lg border border-gray-200 p-3">
                        <div class="flex gap-2">
                            <input
                                v-model="newQuestion"
                                type="text"
                                placeholder="Type a check-in question..."
                                class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none"
                                @keydown.enter="addQuestion"
                            />
                            <select
                                v-model="newQuestionType"
                                class="rounded border border-gray-300 px-2 py-2 text-sm"
                            >
                                <option
                                    v-for="type in questionTypes"
                                    :key="type"
                                >
                                    {{ type }}
                                </option>
                            </select>
                        </div>
                        <CommonButton
                            variant="soft"
                            size="sm"
                            label="Add Question"
                            leading-icon="heroicons:plus"
                            @click="addQuestion"
                            :disabled="!newQuestion.trim()"
                        />
                    </div>

                    <div
                        v-if="!questions.length"
                        class="py-8 text-center text-sm text-gray-400"
                    >
                        No check-in questions yet. Add questions above or skip this step.
                    </div>
                </div>
            </div>

            <!-- Modal footer -->
            <div class="flex items-center justify-between border-t border-gray-100 px-6 py-3">
                <div class="text-[11px] text-gray-400">
                    Step {{ currentStep }} of {{ totalSteps }} ·
                    {{ steps.find((s) => s.id === currentStep)?.label }}
                </div>
                <div class="flex items-center gap-2">
                    <CommonButton
                        v-if="currentStep === 1"
                        variant="outline"
                        label="Cancel"
                    />
                    <CommonButton
                        v-if="currentStep > 1"
                        variant="outline"
                        label="Back"
                        leading-icon="heroicons:arrow-left"
                        @click="goPrev"
                    />
                    <CommonButton
                        v-if="currentStep < totalSteps"
                        label="Next"
                        trailing-icon="heroicons:arrow-right"
                        :disabled="!canGoNext"
                        @click="goNext"
                    />
                    <CommonButton
                        v-if="currentStep === totalSteps"
                        label="Save Risk"
                        leading-icon="heroicons:check"
                    />
                </div>
            </div>
        </CommonCard>
    </div>
</template>

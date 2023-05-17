<template>
	<div id="example-full">
		<div class="calendar-controls">
			<div v-if="state.message" class="notification is-success">{{ state.message }}</div>


			<div class="box">
				<div class="field">
					<label class="label">项目名-负责人</label>
					<div class="control">
						<input v-model="state.newItemTitle" class="input" type="text" />
					</div>
				</div>

				<div class="field">
					<label class="label">开始日期</label>
					<div class="control">
						<input v-model="state.newItemStartDate" class="input" type="date" />
					</div>
				</div>

				<div class="field">
					<label class="label">结束日期</label>
					<div class="control">
						<input v-model="state.newItemEndDate" class="input" type="date" />
					</div>
				</div>

				<button class="button is-info" @click="clickTestAddItem">添加</button>
				<button class="button is-info" style="margin-left:10px;" @click="clickTestDelItem">删除</button>
			</div>
		</div>
		<div class="calendar-parent">
			<CalendarView :items="state.items" :show-date="state.showDate"
				:time-format-options="{ hour: 'numeric', minute: '2-digit' }" :enable-drag-drop="true"
				:disable-past="state.disablePast" :disable-future="state.disableFuture" :show-times="state.showTimes"
				:date-classes="myDateClasses()" :display-period-uom="state.displayPeriodUom"
				:display-period-count="state.displayPeriodCount" :starting-day-of-week="state.startingDayOfWeek"
				:class="themeClasses" :period-changed-callback="periodChanged"
				:current-period-label="state.useTodayIcons ? 'icons' : ''" :displayWeekNumbers="state.displayWeekNumbers"
				:enable-date-selection="true" :selection-start="state.selectionStart" :selection-end="state.selectionEnd"
				@date-selection-start="setSelection" @date-selection="setSelection" @date-selection-finish="finishSelection"
				@drop-on-date="onDrop" @click-date="onClickDay" @click-item="onClickItem">
				<template #header="{ headerProps }">
					<CalendarViewHeader :header-props="headerProps" @input="setShowDate" />
				</template>
			</CalendarView>
		</div>
	</div>
</template>
<script setup lang="ts">
// Using the publish version, you would do this instead:
// import { CalendarView, CalendarViewHeader, CalendarMath } from "vue-simple-calendar"
import CalendarView from "../../vue-simple-calendar/src/CalendarView.vue"
import CalendarViewHeader from "../../vue-simple-calendar/src/CalendarViewHeader.vue"
import CalendarMath from "../../vue-simple-calendar/src/CalendarMath"
import { ICalendarItem, INormalizedCalendarItem } from "./ICalendarItem"
import { onMounted, reactive, computed } from "vue";
import { getJSONData, writeJSONData } from "./api/index"
const thisMonth = (d: number, h?: number, m?: number): Date => {
	const t = new Date()
	return new Date(t.getFullYear(), t.getMonth(), d, h || 0, m || 0)
}

interface IExampleState {
	showDate: Date
	message: string
	startingDayOfWeek: number
	disablePast: boolean
	disableFuture: boolean
	displayPeriodUom: string
	displayPeriodCount: number
	displayWeekNumbers: boolean
	showTimes: boolean
	selectionStart?: Date
	selectionEnd?: Date
	newItemTitle: string
	newItemStartDate: string
	newItemEndDate: string
	useDefaultTheme: boolean
	useHolidayTheme: boolean
	useTodayIcons: boolean
	items: ICalendarItem[]
}
let jsondata = reactive({
	data: []
})
const getJsonData1 = () => {
	getJSONData().then(res => {
		console.log(res);
		state.items = res;
	});
}

const state = reactive({
	/* Show the current month, and give it some fake items to show */
	showDate: thisMonth(1),
	message: "",
	startingDayOfWeek: 0,
	disablePast: false,
	disableFuture: false,
	displayPeriodUom: "month",
	displayPeriodCount: 1,
	displayWeekNumbers: false,
	showTimes: true,
	selectionStart: undefined,
	selectionEnd: undefined,
	newItemTitle: "xxx项目-x某",
	newItemStartDate: "",
	newItemEndDate: "",
	useDefaultTheme: true,
	useHolidayTheme: true,
	useTodayIcons: false,
	items: [],
} as IExampleState)

// const userLocale = computed((): string => CalendarMath.getDefaultBrowserLocale())

const themeClasses = computed(() => ({
	"theme-default": state.useDefaultTheme,
	"holiday-us-traditional": state.useHolidayTheme,
	"holiday-us-official": state.useHolidayTheme,
}))

const myDateClasses = (): Record<string, string[]> => {
	// This was added to demonstrate the dateClasses prop. Note in particular that the
	// keys of the object are `yyyy-mm-dd` ISO date strings (not dates), and the values
	// for those keys are strings or string arrays. Keep in mind that your CSS to style these
	// may need to be fairly specific to make it override your theme's styles. See the
	// CSS at the bottom of this component to see how these are styled.
	const o = {} as Record<string, string[]>
	const theFirst = thisMonth(1)
	const ides = [2, 4, 6, 9].includes(theFirst.getMonth()) ? 15 : 13
	const idesDate = thisMonth(ides)
	o[CalendarMath.isoYearMonthDay(idesDate)] = ["ides"]
	o[CalendarMath.isoYearMonthDay(thisMonth(21))] = ["do-you-remember", "the-21st"]
	return o
}

onMounted((): void => {
	state.newItemStartDate = CalendarMath.isoYearMonthDay(CalendarMath.today())
	state.newItemEndDate = CalendarMath.isoYearMonthDay(CalendarMath.today());
	getJsonData1();
})

const periodChanged = (): void => {
	// range, eventSource) {
	// Demo does nothing with this information, just including the method to demonstrate how
	// you can listen for changes to the displayed range and react to them (by loading items, etc.)
	//console.log(eventSource)
	//console.log(range)
}

const onClickDay = (d: Date): void => {
	state.selectionStart = undefined
	state.selectionEnd = undefined
	state.message = `当前选中日期: ${d.toLocaleDateString()}`
}

const onClickItem = (e: INormalizedCalendarItem): void => {
	state.message = `当前选中: ${e.title}`
	state.newItemTitle = e.title
	state.newItemStartDate = CalendarMath.isoYearMonthDay(e.startDate)
	state.newItemEndDate = CalendarMath.isoYearMonthDay(e.endDate)
}

const setShowDate = (d: Date): void => {
	state.message = `Changing calendar view to ${d.toLocaleDateString()}`
	state.showDate = d
}

const setSelection = (dateRange: Date[]): void => {
	state.selectionEnd = dateRange[1]
	state.selectionStart = dateRange[0]
}

const finishSelection = (dateRange: Date[]): void => {
	setSelection(dateRange)
	state.message = `You selected: ${state.selectionStart?.toLocaleDateString() ?? "n/a"} - ${state.selectionEnd?.toLocaleDateString() ?? "n/a"}`
}

const onDrop = (item: INormalizedCalendarItem, date: Date): void => {
	state.message = `You dropped ${item.id} on ${date.toLocaleDateString()}`
	// Determine the delta between the old start date and the date chosen,
	// and apply that delta to both the start and end date to move the item.
	const eLength = CalendarMath.dayDiff(item.startDate, date)
	item.originalItem.startDate = CalendarMath.addDays(item.startDate, eLength)
	item.originalItem.endDate = CalendarMath.addDays(item.endDate, eLength)
}
const clickTestDelItem = (): void => {
	state.items = state.items.filter((i) => i.title !== state.newItemTitle)
	writeJSONData(state.items).then(() => { })
}
const clickTestAddItem = (): void => {

	if (state.items.length > 0) {
		let flag = false;
		state.items.forEach((i) => {
			if (i.title === state.newItemTitle && i.startDate === state.newItemStartDate) {
				i.startDate = state.newItemStartDate
				i.endDate = state.newItemEndDate
				i.title = state.newItemTitle
				flag = true;

			}
		})
		if (!flag) {
			console.log(state.newItemStartDate)
			state.items.push({
				startDate: state.newItemStartDate,
				endDate: state.newItemEndDate,
				title: state.newItemTitle,
				id: "e" + Math.random().toString(36).substring(2, 11),
			})

		}

	} else {
		state.items.push({
			startDate: state.newItemStartDate,
			endDate: state.newItemEndDate,
			title: state.newItemTitle,
			id: "e" + Math.random().toString(36).substring(2, 11),
		});

	}

	console.log(">>", state.items);
	writeJSONData(state.items).then(() => { })
	state.message = "You added a calendar item!"
}
</script>
<style>
@import "https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.2/css/bulma.min.css";
/* For apps using the npm package, the below URLs should reference /node_modules/vue-simple-calendar/dist/css/ instead */
@import "/css/gcal.css";
@import "/css/holidays-us.css";
@import "/css/holidays-ue.css";

#example-full {
	display: flex;
	flex-direction: row;
	font-family: Calibri, sans-serif;
	width: 96vw;
	min-width: 30rem;
	max-width: 100rem;
	min-height: 40rem;
	margin-left: auto;
	margin-right: auto;
}

#example-full .calendar-controls {
	margin-right: 1rem;
	min-width: 14rem;
	max-width: 14rem;
}

#example-full .calendar-parent {
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	overflow-x: hidden;
	overflow-y: hidden;
	max-height: 80vh;
	background-color: white;
}

/* For long calendars, ensure each week gets sufficient height. The body of the calendar will scroll if needed */
#example-full .cv-wrapper.period-month.periodCount-2 .cv-week,
#example-full .cv-wrapper.period-month.periodCount-3 .cv-week,
#example-full .cv-wrapper.period-year .cv-week {
	min-height: 6rem;
}

/* These styles are optional, to illustrate the flexbility of styling the calendar purely with CSS. */

/* Add some styling for items tagged with the "birthday" class */
#example-full .theme-default .cv-item.birthday {
	background-color: #e0f0e0;
	border-color: #d7e7d7;
}

#example-full .theme-default .cv-item.birthday::before {
	content: "\1F382";
	/* Birthday cake */
	margin-right: 0.5em;
}

/* The following classes style the classes computed in myDateClasses and passed to the component's dateClasses prop. */
#example-full .theme-default .cv-day.ides {
	background-color: #ffe0e0;
}

#example-full .ides .cv-day-number::before {
	content: "\271D";
}

#example-full .cv-day.do-you-remember.the-21st .cv-day-number::after {
	content: "\1F30D\1F32C\1F525";
}
</style>

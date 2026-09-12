import type { ComponentChildren } from 'preact';

import type { Survey } from '../lib/survey/types';
import type { CardData, Patch } from '../lib/types';
import { STEPS, stepRoute, type StepEntry } from '../steps/_registry';
import { SURVEYS } from '../surveys/_registry';
import { OUTRO_PAGE } from './outro';
import { SurveyScreen } from './SurveyScreen';
import { WizardScreen } from './WizardScreen';

// 页面能用到的东西：内容与动作都由外面给，页面自己不占一份状态
export interface PageDeps {
	data: CardData;
	patch: Patch;
	reset: () => void;
	navigate: (name: string | null) => void;
}

// 一个页面 = 一个地址名 + 它整页的样子；三步、每份问卷、预览页都是这样的页面，彼此平等
export interface Page {
	name: string;
	render: (deps: PageDeps) => ComponentChildren;
}

const stepPage = (step: StepEntry): Page => ({
	name: stepRoute(step.id),
	render: (deps) => <WizardScreen step={step} deps={deps} />,
});

const surveyPage = (survey: Survey): Page => ({
	name: survey.id,
	render: (deps) => <SurveyScreen key={survey.id} survey={survey} deps={deps} />,
});

// 页面表：加一步、加一份问卷都只是加一条，路由不认识它们任何一类
export const PAGES: Page[] = [
	OUTRO_PAGE,
	...STEPS.map(stepPage),
	// 没有问题的一份入口没有自己的页面，它指向的就是表单本身
	...SURVEYS.filter((survey) => survey.questions.length > 0).map(surveyPage),
];

// 认地址：名字对得上哪一页就是哪一页，对不上就没有页面
export const findPage = (name: string) => PAGES.find((page) => page.name === name);

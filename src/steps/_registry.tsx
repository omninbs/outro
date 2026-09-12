import type { ComponentChildren } from 'preact';

import type { StepDef } from '../components/Stepper';
import { ListIcon, PenLineIcon, SparklesIcon } from '../components/ui';
import { COPY } from '../lib/copy';
import type { CardData, Patch } from '../lib/types';
import { DescribeStep } from './DescribeStep';
import { GenerateStep } from './GenerateStep';
import { SummaryStep } from './SummaryStep';

// 每一步能拿到的东西：当前内容 + 三个动作
export interface StepContext {
	data: CardData;
	patch: Patch;
	onReset: () => void;
	onPreview: () => void;
}

export interface StepEntry extends StepDef {
	// 中档及以下（没有旁边那条栏）把清单显示在这一步的末尾，作最后的确认
	listBelow?: boolean;
	body: (ctx: StepContext) => ComponentChildren;
}

// 步骤表：加一步只要在这里加一条，向导骨架和「上一步 / 下一步」都不用改
export const STEPS: StepEntry[] = [
	{
		id: 'summary',
		label: COPY.step.summary,
		// 图标挑这一步「干什么」：摘要是一列条目，描述是落笔，生成是亮起来那一下
		icon: ListIcon,
		body: ({ data, patch }) => <SummaryStep data={data} patch={patch} />,
	},
	{
		id: 'describe',
		label: COPY.step.describe,
		icon: PenLineIcon,
		body: ({ data, patch }) => <DescribeStep data={data} patch={patch} />,
	},
	{
		id: 'generate',
		label: COPY.step.generate,
		icon: SparklesIcon,
		listBelow: true,
		body: ({ data, onReset, onPreview }) => (
			<GenerateStep data={data} onReset={onReset} onPreview={onPreview} />
		),
	},
];

// 每一步在地址里的名字：`step-` 前缀加步骤 id——地址与步骤表同源
export const stepRoute = (id: string) => `step-${id}`;

// 地址认的是哪一个步骤页；认不出返回 undefined
export const findStep = (name: string) => STEPS.find((step) => stepRoute(step.id) === name);

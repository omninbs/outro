import type { Survey } from '../lib/survey/types';

/**
 * 空预设：没有问题的一份问卷。
 *
 * 它是一条正经的路，不是占位：没有引导就是它的引导——
 * 点进去直接进表单，从零开始填。
 */
export const blankSurvey: Survey = {
	id: 'blank',
	title: '空预设',
	description: '从一张白纸开始：标题、元数据、文本块都由你自己写。',
	questions: [],
};

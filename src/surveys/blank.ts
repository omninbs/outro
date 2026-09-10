import type { Survey } from '../lib/survey/types';

/**
 * 空预设：没有问题的一份问卷。
 *
 * 它是一条正经的路，不是占位：没有引导就是它的引导——
 * 点进去直接进表单，标题、元数据、文本块都由自己写。
 * 「从一张白纸开始」不是比喻，是靠 `resetOnStart` 兑现的：点它先清空内容。
 * 想接着改没写完的那份，走「继续编辑」——那份预设对同一个问题的回答是不清空。
 */
export const blankSurvey: Survey = {
	id: 'blank',
	title: '空预设',
	description: '从一张白纸开始：标题、元数据、文本块都由你自己写。',
	questions: [],
	resetOnStart: true,
};

import type { Survey } from '../lib/survey/types';

/**
 * 编辑表单：唯一没有问题的一份入口。
 *
 * 「不使用预设」本身就是它的预设：点进去直接进表单，标题、元数据、文本块都由自己写，
 * 已有内容一个字都不动——想清空的是第三步的「重置」，那里有二次确认。
 * 它是首页的第一张卡，也一直是可选项：将来所有预设都只是「替你填一部分」，
 * 不想被填的人从这张卡进去就是了。
 */
export const editSurvey: Survey = {
	id: 'edit',
	title: '编辑表单',
	description: '不使用预设，直接编辑当前表单',
	questions: [],
};

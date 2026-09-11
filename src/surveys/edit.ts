import type { Survey } from '../lib/survey/types';

/**
 * 编辑表单：唯一没有问题的一份入口。
 *
 * 「不使用预设」本身就是它的预设：进去就是表单，已有内容一个字都不动——
 * 想清空是别处的动作，不是这里的。预设再多也只是「替你填一部分」，
 * 所以这张卡一直留在最前，不想被填的人从这里进。
 */
export const editSurvey: Survey = {
	id: 'edit',
	title: '编辑表单',
	description: '不使用预设，直接编辑当前表单',
	questions: [],
};

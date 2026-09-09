import { QUICK_META } from './config';
import type { CardData } from './types';

export type Level = 'ok' | 'warn' | 'info';

export interface Hint {
	level: Level;
	text: string;
	/** 若给出，界面会显示一个「补上」按钮，值为要追加的快捷元数据名。 */
	addMeta?: string;
}

export interface Evaluation {
	hints: Hint[];
	score: number;
	grade: string;
}

const valueOf = (data: CardData, keyword: string) => {
	const hit = data.meta.find((item) => item.label.includes(keyword));
	return hit ? hit.value.trim() : '';
};

const hasMeta = (data: CardData, keyword: string) =>
	data.meta.some((item) => `${item.label}${item.value}`.includes(keyword));

export function evaluate(data: CardData): Evaluation {
	const hints: Hint[] = [];
	let passed = 0;
	let total = 0;

	const judge = (ok: boolean, good: string, bad: string) => {
		total += 1;
		if (ok) passed += 1;
		hints.push(ok ? { level: 'ok', text: good } : { level: 'warn', text: bad });
	};

	const text = data.blocks
		.map((block) => block.text.trim())
		.filter(Boolean)
		.join('\n');

	const suggest = (missing: boolean, text: string, addMeta: string) => {
		if (missing) hints.push({ level: 'info', text, addMeta });
	};

	judge(valueOf(data, '原曲') !== '', '「原歌曲作者」已署名', '还差「原歌曲作者」，署名是版权声明的基础');
	judge(valueOf(data, 'NBS') !== '', '「NBS 作者」已署名', '「NBS 作者」还没填');
	if (valueOf(data, '结构') !== '') {
		hints.push({ level: 'ok', text: '「结构设计者」已填写' });
	}

	judge(text.length >= 10, `文本块已填写（${text.length} 字）`, '还没有写版权声明，建议写清转载 / 商用 / 出处');
	total += 1;
	if (/商用|商业|盈利/.test(text)) passed += 1;
	else hints.push({ level: 'info', text: '声明里没提「可否商用」，建议补一句' });
	total += 1;
	if (/转载|分享|发布/.test(text)) passed += 1;
	else hints.push({ level: 'info', text: '没提「转载」，建议写明允许或禁止' });
	total += 1;
	if (/注明|出处/.test(text)) passed += 1;
	else hints.push({ level: 'info', text: '建议写明「转载需注明出处并保留本声明」' });

	suggest(
		!hasMeta(data, '链接') && !hasMeta(data, 'BV'),
		'想更专业？补上「原曲链接 / BV 号」，方便溯源',
		QUICK_META[0],
	);
	suggest(!hasMeta(data, '日期'), '补上「扒谱日期」，方便版本对比', QUICK_META[1]);
	suggest(
		!hasMeta(data, '联系') && !hasMeta(data, '邮箱'),
		'留下「联系 / 授权渠道」，方便他人取得授权',
		QUICK_META[3],
	);

	const score = total === 0 ? 0 : Math.round((passed / total) * 100);
	const grade = score >= 90 ? 'A' : score >= 75 ? 'B' : score >= 55 ? 'C' : score >= 35 ? 'D' : 'E';

	return { hints, score, grade };
}

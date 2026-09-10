import type { Survey } from '../lib/survey/types';

import { blankSurvey } from './blank';
import { demoSurvey } from './demo';

/**
 * 问卷清单：首页按这个顺序铺卡片，第一份固定是「空预设」。
 *
 * 一份问卷一个文件，这里只负责把它们排成一列：
 * 加一份新问卷 = 在 `src/surveys/` 新写一个文件 + 在这里加一行。
 * 题目怎么写（`kind` / `into` / `build`）见 `lib/survey/types.ts`，规则见 README「加一份问卷」。
 */
export const SURVEYS: Survey[] = [blankSurvey, demoSurvey];

/** 按 id 找问卷；找不到返回 undefined——hash 是手写的，认不出就当没有这份 */
export const findSurvey = (id: string) => SURVEYS.find((survey) => survey.id === id);

import type { Survey } from '../lib/survey/types';

import { editSurvey } from './edit';
import { logicRedstoneMusicSurvey } from './logic-redstone-music';

// 入口清单：首页按这个顺序铺卡片，一份入口一个文件，加一份 = 加一个文件 + 加一行
export const SURVEYS: Survey[] = [editSurvey, logicRedstoneMusicSurvey];

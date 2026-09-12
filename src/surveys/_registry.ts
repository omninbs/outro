import type { Survey } from '../lib/survey/types';

import { edit_survey } from './edit';
import { logic_redstone_music_survey } from './logic_redstone_music';

// 入口清单：首页按这个顺序铺卡片，一份入口一个文件，加一份 = 加一个文件 + 加一行
export const SURVEYS: Survey[] = [edit_survey, logic_redstone_music_survey];

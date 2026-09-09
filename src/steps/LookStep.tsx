import { Field, Panel, Slider, TextInput, Toggle } from '../components/ui';
import { accentNames, flavorNames, flavors } from '../lib/palette';
import type { CardData } from '../lib/types';

export function LookStep({
	data,
	patch,
}: {
	data: CardData;
	patch: (next: Partial<CardData>) => void;
}) {
	const palette = flavors[data.flavor];

	return (
		<>
			<Panel title="配色">
				<Field label="主题（Flavor）">
					<div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
						{flavorNames.map((name) => {
							const f = flavors[name];
							const active = name === data.flavor;
							return (
								<button
									key={name}
									type="button"
									onClick={() => patch({ flavor: name })}
									class={`rounded-md border p-2 text-left transition ${
										active
											? 'border-ctp-mauve bg-ctp-surface0'
											: 'border-ctp-surface1 hover:border-ctp-overlay0'
									}`}
								>
									<span
										class="mb-2 flex h-9 items-center gap-1 rounded px-2"
										style={{ backgroundColor: f.colors.base }}
									>
										{['mauve', 'blue', 'green', 'yellow'].map((key) => (
											<span
												key={key}
												class="h-2.5 w-2.5 rounded-full"
												style={{ backgroundColor: f.colors[key as 'mauve'] }}
											/>
										))}
									</span>
									<span class="text-xs text-ctp-text">{f.name}</span>
								</button>
							);
						})}
					</div>
				</Field>

				<Field label="强调色" hint="用于标题分隔线、字段标签和声明边框">
					<div class="flex flex-wrap gap-2">
						{accentNames.map((name) => (
							<button
								key={name}
								type="button"
								title={name}
								onClick={() => patch({ accent: name })}
								style={{ backgroundColor: palette.colors[name] }}
								class={`h-7 w-7 rounded-full border-2 transition ${
									name === data.accent
										? 'border-ctp-text'
										: 'border-transparent hover:border-ctp-overlay0'
								}`}
							/>
						))}
					</div>
				</Field>
			</Panel>

			<Panel title="排版">
				<Field label="文字大小">
					<Slider
						value={data.textScale}
						min={80}
						max={140}
						onInput={(textScale) => patch({ textScale })}
						suffix="%"
					/>
				</Field>
			</Panel>

			<Panel title="页脚">
				<Toggle
					checked={data.footerOn}
					onChange={(footerOn) => patch({ footerOn })}
					label="显示页脚小字"
				/>
				{data.footerOn && (
					<div class="mt-4">
						<TextInput
							value={data.footerText}
							onInput={(footerText) => patch({ footerText })}
							placeholder="由 xxx 生成"
						/>
					</div>
				)}
			</Panel>
		</>
	);
}

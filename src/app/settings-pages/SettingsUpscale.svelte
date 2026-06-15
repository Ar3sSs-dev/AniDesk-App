<script>
    import BaseAltButton from "../components/buttons/BaseAltButton.svelte";
    import BaseMainButton from "../components/buttons/BaseMainButton.svelte";
    import Separator from "../components/elements/Separator.svelte";
    import BlankElement from "../components/settings/BlankElement.svelte";
    import CheckboxElement from "../components/settings/CheckboxElement.svelte";
    import DropdownElement from "../components/settings/DropdownElement.svelte";
    import TitleElement from "../components/settings/TitleElement.svelte";
    import InfoElement from "../components/settings/InfoElement.svelte";
    import { localStorageWritable } from "@babichjacob/svelte-localstorage";

    let upscaleSettings;

    const upscaleSettingsRaw = localStorageWritable("upscaleSettings", utils.upscaleDefaultSettings);

    upscaleSettingsRaw.subscribe((value) => {
        upscaleSettings = value;
    });

    function updateKey(key, value) {
        upscaleSettings[key] = value;
        upscaleSettingsRaw.set({ ...upscaleSettings });
    }

    // --- Конструктор пресета ---

    // Шейдер, выбранный для добавления в пайплайн
    let selectedStageToAdd = utils.upscaleStageOptions[0].value;
    // Имя пресета (локальная переменная, синхронизируется при сохранении)
    let presetNameInput = "";

    // При изменении настроек синхронизируем поле имени
    $: if (upscaleSettings) {
        presetNameInput = upscaleSettings.customPreset?.name ?? "Мой пресет";
    }

    function addStage() {
        const stages = [...(upscaleSettings.customPreset?.stages ?? [])];
        stages.push(selectedStageToAdd);
        upscaleSettings.customPreset = { ...upscaleSettings.customPreset, stages };
        upscaleSettingsRaw.set({ ...upscaleSettings });
    }

    function removeStage(index) {
        const stages = [...(upscaleSettings.customPreset?.stages ?? [])];
        stages.splice(index, 1);
        upscaleSettings.customPreset = { ...upscaleSettings.customPreset, stages };
        upscaleSettingsRaw.set({ ...upscaleSettings });
    }

    function moveStage(index, direction) {
        const stages = [...(upscaleSettings.customPreset?.stages ?? [])];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= stages.length) return;
        [stages[index], stages[targetIndex]] = [stages[targetIndex], stages[index]];
        upscaleSettings.customPreset = { ...upscaleSettings.customPreset, stages };
        upscaleSettingsRaw.set({ ...upscaleSettings });
    }

    function savePresetName() {
        upscaleSettings.customPreset = { ...upscaleSettings.customPreset, name: presetNameInput.trim() || "Мой пресет" };
        upscaleSettingsRaw.set({ ...upscaleSettings });
    }

    function resetPreset() {
        upscaleSettings.customPreset = { name: "Мой пресет", stages: [15, 7] };
        presetNameInput = "Мой пресет";
        upscaleSettingsRaw.set({ ...upscaleSettings });
    }

    function getStageName(modeValue) {
        return utils.upscaleStageOptions.find(x => x.value === modeValue)?.label ?? `Режим ${modeValue}`;
    }

    function getStageGroup(modeValue) {
        return utils.upscaleStageOptions.find(x => x.value === modeValue)?.group ?? "";
    }

    $: isCustomMode = upscaleSettings?.mode === 20;
    $: stages = upscaleSettings?.customPreset?.stages ?? [];
</script>

<div class="flex-column upscale-settings">
    {#if !avaliableGPU}
        <InfoElement
            title="Улучшение качества недоступно на вашем устройстве"
            description="Ваша видеокарта не поддерживает улучшение качества из-за отсутствия поддержки WebGPU. Это может быть связано с устаревшими драйверами или аппаратными ограничениями. Попробуйте обновить драйвер видеокарты, либо использовать другое устройство."
            type="danger"
        />
    {:else}
        <InfoElement
            title="Что делает улучшение качества?"
            description="Система улучшения на основе Anime4K повышает резкость, удаляет шум и повышает чёткость видео в реальном времени. Она особенно эффективна для 2D-анимации."
            type="info"
        />
    {/if}

    <CheckboxElement
        title="Включить улучшение качества"
        description="Активирует улучшение качества через GPU с использованием технологий WebGPU и Anime4K. Повышает чёткость и качество изображения."
        disabled={!avaliableGPU}
        value={upscaleSettings.enabled && avaliableGPU}
        onChangeCallback={(e) => {
            updateKey("enabled", e);
        }}
    />

    <Separator width="75%" />

    <DropdownElement
        title="Режим улучшения"
        values={utils.upscaleValues}
        value={upscaleSettings.mode}
        placeholder="Выберите режим"
        disabled={!avaliableGPU || !upscaleSettings.enabled}
        onChangeCallback={(e, v) => updateKey("mode", v)}
    />

    <Separator width="75%" />

    <!-- Конструктор пользовательского пресета -->
    <BlankElement title="Пользовательский пресет" disabled={!avaliableGPU || !upscaleSettings.enabled || !isCustomMode}>
        {#if !isCustomMode}
            <div class="preset-locked">
                <span class="preset-locked-icon">⚙️</span>
                <span class="preset-locked-title">Выберите «Пользовательский пресет» в меню выше</span>
                <span class="preset-locked-desc">Режим «⚙️ Пользовательский пресет» открывает конструктор цепочки фильтров, где вы можете собрать собственную комбинацию шейдеров Anime4K.</span>
            </div>
        {:else}
            <div class="preset-builder">
                <!-- Название пресета -->
                <div class="preset-name-row">
                    <input
                        class="preset-name-input"
                        type="text"
                        maxlength="32"
                        placeholder="Название пресета"
                        bind:value={presetNameInput}
                        on:blur={savePresetName}
                        on:keydown={(e) => e.key === 'Enter' && savePresetName()}
                    />
                    <button class="preset-reset-btn" on:click={resetPreset} title="Сбросить к стандарту">↺</button>
                </div>

                <!-- Добавить этап -->
                <div class="add-stage-row">
                    <select class="stage-select" bind:value={selectedStageToAdd}>
                        {#each utils.upscaleStageOptions as opt}
                            <option value={opt.value}>{opt.group} · {opt.label}</option>
                        {/each}
                    </select>
                    <button class="add-stage-btn" on:click={addStage} disabled={stages.length >= 8}>
                        + Добавить
                    </button>
                </div>

                {#if stages.length === 0}
                    <div class="pipeline-empty">
                        <span>Пайплайн пуст — добавьте хотя бы один шейдер</span>
                    </div>
                {:else}
                    <!-- Пайплайн -->
                    <div class="pipeline">
                        {#each stages as stageMode, i}
                            <div class="pipeline-stage">
                                <div class="stage-info">
                                    <span class="stage-index">{i + 1}</span>
                                    <div class="stage-text">
                                        <span class="stage-group">{getStageGroup(stageMode)}</span>
                                        <span class="stage-name">{getStageName(stageMode)}</span>
                                    </div>
                                </div>
                                <div class="stage-controls">
                                    <button class="stage-btn" on:click={() => moveStage(i, -1)} disabled={i === 0} title="Вверх">↑</button>
                                    <button class="stage-btn" on:click={() => moveStage(i, 1)} disabled={i === stages.length - 1} title="Вниз">↓</button>
                                    <button class="stage-btn stage-btn-remove" on:click={() => removeStage(i)} title="Удалить">✕</button>
                                </div>
                            </div>
                            {#if i < stages.length - 1}
                                <div class="pipeline-arrow">↓</div>
                            {/if}
                        {/each}
                    </div>
                {/if}

                {#if stages.length >= 8}
                    <span class="preset-limit-warn">Максимум 8 этапов в пайплайне</span>
                {/if}

                <InfoElement
                    title="Как работает пайплайн?"
                    description="Шейдеры применяются последовательно сверху вниз. Рекомендуется: сначала Denoise/Deblur, затем Restore, и в конце Upscale. Слишком длинный пайплайн может снизить FPS."
                    type="info"
                />
            </div>
        {/if}
    </BlankElement>
</div>

<style>
    .upscale-settings {
        align-items: center;
        margin-top: 40px;
    }

    /* ——— Заглушка (не выбран custom режим) ——— */
    .preset-locked {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 32px 20px;
        text-align: center;
    }

    .preset-locked-icon {
        font-size: 36px;
    }

    .preset-locked-title {
        font-size: 15px;
        font-weight: bold;
        color: var(--main-text-color);
    }

    .preset-locked-desc {
        font-size: 12px;
        color: var(--secondary-text-color);
        max-width: 380px;
        line-height: 1.5;
    }

    /* ——— Конструктор пресета ——— */
    .preset-builder {
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
        padding: 4px 0 12px;
    }

    .preset-name-row {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .preset-name-input {
        flex: 1;
        background: var(--alt-background-color);
        border: 1.5px solid var(--border-color, #333);
        border-radius: 10px;
        padding: 8px 14px;
        color: var(--main-text-color);
        font-size: 14px;
        font-weight: 600;
        outline: none;
        transition: border-color 0.2s;
    }

    .preset-name-input:focus {
        border-color: var(--accent-color, #e05a6b);
    }

    .preset-reset-btn {
        width: 36px;
        height: 36px;
        border-radius: 10px;
        background: var(--alt-background-color);
        color: var(--secondary-text-color);
        font-size: 18px;
        border: 1.5px solid var(--border-color, #333);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.2s, border-color 0.2s;
    }

    .preset-reset-btn:hover {
        color: var(--main-text-color);
        border-color: var(--accent-color, #e05a6b);
    }

    /* ——— Добавление этапа ——— */
    .add-stage-row {
        display: flex;
        gap: 8px;
        align-items: center;
    }

    .stage-select {
        flex: 1;
        background: var(--alt-background-color);
        border: 1.5px solid var(--border-color, #333);
        border-radius: 10px;
        padding: 8px 12px;
        color: var(--main-text-color);
        font-size: 13px;
        outline: none;
        cursor: pointer;
    }

    .add-stage-btn {
        padding: 8px 16px;
        border-radius: 10px;
        background: var(--accent-color, #e05a6b);
        color: #fff;
        font-size: 13px;
        font-weight: 600;
        border: none;
        cursor: pointer;
        white-space: nowrap;
        transition: opacity 0.2s;
    }

    .add-stage-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }

    .add-stage-btn:not(:disabled):hover {
        opacity: 0.85;
    }

    /* ——— Пайплайн ——— */
    .pipeline {
        display: flex;
        flex-direction: column;
        gap: 0;
        border-radius: 12px;
        overflow: hidden;
        border: 1.5px solid var(--border-color, #2a2a2a);
    }

    .pipeline-stage {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: var(--alt-background-color);
        padding: 10px 14px;
        border-bottom: 1px solid var(--border-color, #222);
        transition: background 0.15s;
    }

    .pipeline-stage:last-child {
        border-bottom: none;
    }

    .stage-info {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .stage-index {
        width: 22px;
        height: 22px;
        border-radius: 6px;
        background: var(--accent-color, #e05a6b);
        color: #fff;
        font-size: 11px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .stage-text {
        display: flex;
        flex-direction: column;
        gap: 1px;
    }

    .stage-group {
        font-size: 10px;
        color: var(--secondary-text-color);
        line-height: 1;
    }

    .stage-name {
        font-size: 13px;
        color: var(--main-text-color);
        font-weight: 500;
    }

    .stage-controls {
        display: flex;
        gap: 4px;
    }

    .stage-btn {
        width: 28px;
        height: 28px;
        border-radius: 7px;
        background: var(--background-color);
        border: 1.5px solid var(--border-color, #333);
        color: var(--main-text-color);
        font-size: 13px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.15s, color 0.15s;
    }

    .stage-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }

    .stage-btn:not(:disabled):hover {
        background: var(--accent-color, #e05a6b);
        border-color: var(--accent-color, #e05a6b);
        color: #fff;
    }

    .stage-btn-remove:not(:disabled):hover {
        background: #c0392b;
        border-color: #c0392b;
    }

    .pipeline-arrow {
        text-align: center;
        color: var(--secondary-text-color);
        font-size: 12px;
        padding: 2px 0;
        line-height: 1;
        background: var(--alt-background-color);
        border-left: 1.5px solid var(--border-color, #2a2a2a);
        border-right: 1.5px solid var(--border-color, #2a2a2a);
    }

    .pipeline-empty {
        text-align: center;
        padding: 28px;
        color: var(--secondary-text-color);
        font-size: 13px;
        border: 1.5px dashed var(--border-color, #333);
        border-radius: 12px;
    }

    .preset-limit-warn {
        font-size: 12px;
        color: var(--accent-color, #e05a6b);
        text-align: center;
    }
</style>

<script>
    export let src;

    let lastDate = src.slice(-10);

    // Guard: \u0435\u0441\u043b\u0438 \u043c\u0430\u0441\u0441\u0438\u0432 \u043f\u0443\u0441\u0442 \u2014 lastDate[0].count \u0431\u0440\u043e\u0441\u0438\u043b \u0431\u044b TypeError
    let maxCount = lastDate.length > 0
        ? lastDate.map(obj => obj.count).reduce((a, b) => Math.max(a, b), lastDate[0].count)
        : 1; // 1 \u0447\u0442\u043e\u0431\u044b \u0438\u0437\u0431\u0435\u0436\u0430\u0442\u044c \u0434\u0435\u043b\u0435\u043d\u0438\u044f \u043d\u0430 0
</script>

{#snippet graphColumn(obj)}
    <div class="watch-dynamic-column flex-column">
        <div class="watch-dynamic-column-count">{obj.count}</div>
        <div class="watch-dynamic-column-line" style:--height="{obj.count > 0 ? Math.floor((obj.count/maxCount*95)) + 5 : 5}%"></div>
        <div class="watch-dynamic-column-date">{utils.getShortDate(obj.timestamp)}</div>
    </div>
{/snippet}

<div class="watch-dynamic flex-row">
    {#each lastDate as obj}
    {@render graphColumn(obj)}
    {/each}
</div>

<style>
    .watch-dynamic {
        align-items: center;
        font-size: 12px;
        color: var(--main-text-color);
        height: 188px;
        max-height: 188px;
        margin-top: 15px;
    }

    .watch-dynamic-column-count {
        font-weight: 500;
        color: var(--main-text-color);
    }

    .watch-dynamic-column-line {
        width: 17px;
        display: flex;
        background-color: var(--main-text-color);
        height: var(--height, 0%);
        border-radius: 10px 10px 0px 0px;
        margin-bottom: 5px;
        transition: height 0.3s ease;
    }

    .watch-dynamic-column {
        align-items: center;
        margin-right: 15px;
        justify-content: end;
        height: 100%;
    }
</style>
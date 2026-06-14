<script>
    import Icon from "./Icon.svelte";
    import BookmarkIcon from "../../icons/bookmark.svg";
    import CommentIcon from "../../icons/comment.svg";
    import Dot from "./Dot.svelte";

    export let collection;
</script>

<collection-full-row-card class="flex-row" onclick={() => updateViewportComponent(12, { id: collection.id })}>
    <div class="full-row-collection-poster">
        <img loading="eager" decoding="async" src={collection.image} alt="CollectionPoster" class="collection-poster">
    </div>
    <div class="collection-info flex-column">
        <span class="collection-title">{collection.title}</span>
        <div class="collection-counts flex-row">
            <Icon src={BookmarkIcon} varColor="--secondary-text-color" size={{width: 12, height: 12}}/>
            <span>{collection.favorites_count}</span>
            <Dot size={{width: 4, height: 4}}/>
            <Icon src={CommentIcon} varColor="--secondary-text-color" size={{width: 15, height: 15}}/>
            <span>{collection.comment_count}</span>
        </div>
        <span class="collection-description">{collection.description.length > 600 ? collection.description.slice(0, 600) + "..." : collection.description}</span>
    </div>
</collection-full-row-card>

<style>
    collection-full-row-card {
        margin: 20px;
        border-radius: 16px;
        transition: background-color 0.18s ease;
        padding: 4px;
    }

    collection-full-row-card:hover {
        cursor: pointer;
        background-color: var(--alt-background-color);
    }

    collection-full-row-card:active {
        background-color: color-mix(in srgb, var(--alt-background-color) 80%, transparent);
    }

    .full-row-collection-poster {
        will-change: transform;
        transform: translateZ(0);
        transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                    box-shadow 0.2s ease;
        flex-shrink: 0;
    }

    collection-full-row-card:hover .full-row-collection-poster {
        transform: scale(1.02) translateZ(0);
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.3);
    }

    collection-full-row-card:active .full-row-collection-poster {
        transform: scale(0.99) translateZ(0);
        transition-duration: 0.1s;
    }

    .full-row-collection-poster img {
        width: 400px;
        height: 224px;
        object-fit: cover;
        border-radius: 15px;
        display: block;
    }

    .collection-info {
        margin-left: 20px;
    }

    .collection-title {
        margin-top: 5px;
        font-size: var(--anime-full-row-title-size);
        font-weight: var(--anime-full-row-title-weight);
        color: var(--main-text-color);
    }

    .collection-counts {
        margin-top: 10px;
        align-items: center;
    }

    .collection-counts span {
        margin-left: 5px;
        font-size: var(--anime-full-row-epCount-size);
        font-weight: var(--anime-full-row-epCount-weight);
        color: var(--secondary-text-color);
    }

    .collection-description {
        font-size: var(--anime-full-row-description-size);
        color: var(--third-text-color);
        line-height: var(--anime-full-row-description-line-height);
        font-weight: var(--anime-full-row-description-weight);
        margin-top: 10px;
    }
</style>



For the screen reader container that has the "X new posts loaded. Total: Y posts" text, that should probably be updated to remove the text content after a short delay and just have it dynamically update as necessary. Feels a little odd if it would announce "5 new posts loaded. Total: 25 posts" if I were to come and go from the feed area. Especially since the role="feed" element has an aria-label that includes the total number of items, having this status container always have that text may not be necessary. So maybe have it empty by default, then when new posts are loaded it can be dynamically updated with text content "5 new posts loaded. Total: [new total] posts.", then after maybe 5 seconds updating the container again to have no text content.




Also for what it's worth, depending on whether from a design perspective it's desired to have something like a Spinner or the 3 loading dots or a Skeleton or whatever non-text based loading indicator, that should be fine as long as there's still some hidden text that can get announced (either in that screen-reader container you're already using on the page, or just text content that isn't visible and dynamically renders in an aria-live container




2.4.11 Focus Not Obscured (Minimum) (AA): this ties to the "Load 5 more" button when infinite scrolling is turned off comment I had above. This minimum just requires that the focused element is not entirely hidden (the Level AAA counterpart to this guideline is that the focused element is not hidden whatsoever). This is also the only new 2.2 guideline I'm mentioning here


Success Criterion 3.2.1 On Focus: this one I'm not 100% sure about, but this might tie into the "setting" content being visually rendered when Tabbing through the page. Idk if it'd be considered "significantly re-arranging the content of a page", but it might be a little disorienting since there's nothing indicating there's somewhat important content there that wil receive focus before the feed
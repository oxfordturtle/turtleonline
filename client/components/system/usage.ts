/*
 * The program usage component.
 */
import highlight from "../../tokenizer/highlight.ts";
import { state } from "../../state/index.ts";
import { fill, fragment, tr, th, td, code } from "../../tools/elements.ts";
import { on } from "../../tools/hub.ts";
import type { UsageCategory } from "../../analyser/usageCategory.ts";
import type { UsageExpression } from "../../analyser/usageExpression.ts";

// the usage table body
const usageTableBody = document.querySelector('[data-component="usageTableBody"]') as HTMLElement;

if (usageTableBody) {
  // register to keep in sync with the application state
  on("usageChanged", function () {
    fill(usageTableBody, state.usage.map(categoryFragment));
  });
}

// function to convert a category into a document fragment
function categoryFragment(category: UsageCategory): DocumentFragment {
  return fragment([
    tr({
      className: "category-heading",
      content: [th({ colspan: "4", content: category.category })],
    }),
    fragment(category.expressions.map(expressionRow)),
    tr({
      content: [
        td(),
        td({ content: "TOTAL:" }),
        td({ content: category.total.toString(10) }),
        td(),
      ],
    }),
  ]);
}

// function to convert an expression into a table row
function expressionRow(expression: UsageExpression): HTMLTableRowElement {
  return tr({
    content: [
      td({
        content: [code({ content: highlight(expression.name, state.language) })],
      }),
      td({ content: expression.level.toString(10) }),
      td({ content: expression.count.toString(10) }),
      td({ content: expression.lines.replace(/\s/g, ", ") }),
    ],
  });
}
